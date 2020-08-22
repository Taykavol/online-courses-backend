import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {isAuth, isAdmin} from '../utils/auth'

//for extending classes
import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id,
    role
  } // or any other type
}


const app = Router();

const prisma = new PrismaClient()

app.get('/users',isAuth,isAdmin, async(req,res)=>{  
    const users = await prisma.user.findMany()
    res.json(users)
})

// app.get('/me', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
//   const {id} = req.user
//   if(!id) return res.send('userWasDeleted')
//   const user = await prisma.user.findOne({
//     where:{
//       id
//     },
//     include:{
//       boughtCourses:{
//         orderBy:{
//           createdAt:'desc'
//         }
//       }
//     }
//   })
//   res.json(user)
// })

app.post("/login",async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.json('Info not enough')
  const user = await prisma.user.findOne({
    where: {
      email
    }
  })
  if(!user) return res.json('There is no users')
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
