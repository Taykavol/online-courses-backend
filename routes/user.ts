import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {isAuth, isAdmin,isInstructor} from '../permissions/auth'

//for extending classes
import { Request } from "express"
// import { userInfo } from "os";
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id,
    role,
    instructorId
  } // or any other type
}
// export interface userInfo extends Request {
//   data: {
//     payer_id
//   }
// }

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

app.get('/me', isAuth, async (req:IGetUserAuthInfoRequest,res)=>{
  const user = await prisma.user.findUnique({
    where:{id:req.user.id},
    select:{
      id:true,
      email:true,
      fullname:true
      // lichessId:true,
      // googleId:true,
      // facebookId:true,
      // VKId:true,
    }
  })
  res.json(user)
})

app.get('/all',isAuth,isAdmin, async(req,res)=>{  
    const users = await prisma.user.findMany()
    res.json(users)
})
app.put('/email', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
  const {email} = req.body
  await prisma.user.update({
    where:{
      id:req.user.id
    },
    data:{
      email
    }
  }
  )
  res.json('Ok')
})
app.put('/fullname', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
  const {fullname} = req.body
  await prisma.user.update({
    where:{
      id:req.user.id
    },
    data:{
      fullname
    }
  }
  )
  res.json('Ok')

})


// app.get('/publicprofile/:id', async (req,res)=>{
//   const profile = await prisma.instructorProfile.findUnique({
//     where:{
//       id:+req.params.id
//     },
//     select:{
//       registedStudents:true,
//       teacherName:true,
//       title:true,
//       avatar:true,
//       aboutMe:true
//     }
//   })

//   res.json(profile)
// })





app.post("/paypal", isAuth,isInstructor,  (req:IGetUserAuthInfoRequest,res)=>{
  const {code} = req.body
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
      await updateUserPaypalCredentials(req.user.instructorId,userinfo)
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
