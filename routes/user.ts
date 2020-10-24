import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {isAuth, isAdmin,isInstructor} from '../permissions/auth'

//for extending classes
import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id,
    role,
    instructorId
  } // or any other type
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
  const profile = await prisma.instructorProfile.findOne({
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
  const profile = await prisma.instructorProfile.findOne({
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
// app.get('/publicprofileofcourse/:id', async(req,res)=>{
//   const publicprofile = await prisma.instructorProfile.findOne({
//     where:{
//       id
//     }
//   })
// })
app.post('/profile', isAuth,isInstructor, async(req:IGetUserAuthInfoRequest,res)=>{
  const profileData = req.body

  console.log(profileData)
  // console.log(profileData)
  // return
  // console.log(avatar)
  // console.log('Hey')
  // console.log(profilename)
  const profile = await prisma.instructorProfile.update({
    where:{
      id:req.user.instructorId
    },
    data:{
      // TODO:Must be
      // ...profileData
      // bad
      teacherName:{
        set:profileData.teacherName
      },
      aboutMe:{
        set:profileData.aboutMe
      }
      // avatar:{
      //   set:profileData.avatar
      // },
      // title:{
      //   set:profileData.title
      // }
    }
  })
  console.log(profile.teacherName)
  res.json("ok")
} )
app.post("/login",async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.json('Info not enough')
  const user = await prisma.user.findOne({
    where: {
      email
    }
  })
  if(!user) return res.json({error:'Email or password are incorrect'})
  const id = user.id
  const role = user.role
  console.log(role)
  const isMatch = await bcrypt.compare(password,user.password)
  console.log(isMatch)
  if(!isMatch) return res.json('Password incorrect')
  const token=jwt.sign({id,role},'secret')
  res.json({token, user:{role,email}})
  
})

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  if(!email || !password) return res.json('Info not enough')
  const isUserExist = await prisma.user.findOne({
    where:{
     email
    }
  })
  if(isUserExist) return res.json('User with this email exists')
  const hashedPassword =await bcrypt.hash(password,10)

  const {id,role} = await prisma.user.create({
    data: {
      email,
      password:hashedPassword,
      role:"USER"
    }
  })
  
  const token=jwt.sign({
    id,
    role
  },'secret')

  res.json({token, user:{role:"USER",email}})

});




export default app;
