import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {isAuth, isAdmin,isInstructor} from '../permissions/auth'

//for extending classes
import { Request } from "express"
import { userInfo } from "os";
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id,
    role,
    instructorId
  } // or any other type
}
export interface userInfo extends Request {
  data: {
    payer_id
  }
}

const app = Router();

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(
    `Query ${params.model}.${params.action} took ${after - before}ms`
  );
  return result;
});

app.get('/users',isAuth,isAdmin, async(req,res)=>{  
    const users = await prisma.user.findMany()
    res.json(users)
})

app.get('/profile',isAuth,isInstructor, async(req:IGetUserAuthInfoRequest,res)=>{
  const profile = await prisma.instructorProfile.findUnique({
    where:{
      id:req.user.instructorId
    },
    include:{
      myCourses:true
    }
  })
  
  res.json({...profile})
})
app.get('/publicprofile/:id', async (req,res)=>{
  const profile = await prisma.instructorProfile.findUnique({
    where:{
      id:+req.params.id
    },
    select:{
      registedStudents:true,
      teacherName:true,
      title:true,
      avatar:true,
      aboutMe:true
    }
  })

  res.json(profile)
})

app.post('/profile', isAuth,isInstructor, async(req:IGetUserAuthInfoRequest,res)=>{
  const profileData = req.body
  const profile = await prisma.instructorProfile.update({
    where:{
      id:req.user.instructorId
    },
    data:{
      ...profileData
    }
  })
  res.json("ok")
} )
// app.post("/login",async (req,res)=>{
//   const { email, password } = req.body;
//   if(!email || !password) return res.json('Info not enough')
//   const user = await prisma.user.findOne({
//     where: {
//       email
//     },
//     include:{
//       instructorProfile:true
//     }
//   })
//   if(!user) return res.json({error:'Email or password are incorrect'})
//   const id = user.id
//   const role = user.role
  
//   console.log(role)
//   const isMatch = await bcrypt.compare(password,user.password)
//   console.log(isMatch)
//   if(!isMatch) return res.json('Password incorrect')
//   const token=jwt.sign({id,role,instructorId:user.instructorProfile.id},'secret')
//   res.json({token, user:{role,email}})
  
// })
// app.post("/signup", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email,password)
//   if(!email || !password) return res.json('Info not enough')
//   const isUserExist = await prisma.user.findOne({
//     where:{
//      email
//     }
//   })
//   if(isUserExist) return res.json('User with this email exists')
//   const hashedPassword =await bcrypt.hash(password,10)

//   const {id,role} = await prisma.user.create({
//     data: {
//       email,
//       password:hashedPassword,
//       role:"USER"
//     }
//   })
  
//   const token=jwt.sign({
//     id,
//     role
//   },'secret')

//   res.json({token, user:{role:"USER",email}})

// });

app.post("/paypal", isAuth,isInstructor,  (req:IGetUserAuthInfoRequest,res)=>{
  const {code} = req.body
  console.log('code',code , process.env.LIVE_PAYPAL_CLIENT,process.env.LIVE_PAYPAL_SECRET,process.env.FRONTEND_URL)
  const paypal = require('paypal-rest-sdk')
  paypal.configure({
    'mode': 'live',
    'openid_client_id': process.env.NODE_ENV == 'production' ? process.env.LIVE_PAYPAL_CLIENT : process.env.SANDBOX_PAYPAL_CLIENT,
    'openid_client_secret': process.env.NODE_ENV == 'production' ?  process.env.LIVE_PAYPAL_SECRET: process.env.SANDBOX_PAYPAL_SECRET ,
    'openid_redirect_uri': `${process.env.FRONTEND_URL}/paypal/` });
  paypal.openIdConnect.tokeninfo.create(code, function(error, tokeninfo){
    if(!tokeninfo) return res.send('Something wrong')
    paypal.openIdConnect.userinfo.get(tokeninfo.access_token, async function(error, userinfo){
      if(error) return res.json(error)
      console.log('Cool')
      console.log()
      console.log(userinfo);
      // userInfo.
      await updateUserPaypalCredentials(req.user.instructorId,userinfo)
      // await prisma.instructorProfile.update({
      //   where:{
      //     id:req.user.instructorId
      //   },
      //   data:{
      //     paypalId:{
      //       set:userInfo.data.payer_id
      //   }
      // }
      // })
      res.json(userinfo)
    });
  });
})

async function updateUserPaypalCredentials(profileId,userInfo) {
  return  prisma.instructorProfile.update({
    where:{
      id:profileId
    },
    data:{
      paypalId:{
        set:userInfo.email
    },
    paymentMethod:{
      set:"PAYPAL"
    }
  }
  })
}


export default app;
