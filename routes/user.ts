import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//for extending classes
import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
  user: Object // or any other type
}


const app = Router();

const prisma = new PrismaClient()

app.get('/users',isAuth, async(req,res)=>{  
    const users = await prisma.user.findMany()
    res.json(users)
})

app.get('/me', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
  const user = req.user
  res.json(user)
})

app.post("/login",async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.send('Info not enough')
  const user = await prisma.user.findOne({
    where:{
      email
    }
  })
  if(!user) return res.send('There is no users')
  const isMatch = await bcrypt.compare(password,user.password)
  console.log(isMatch)
  if(!isMatch) return res.send('Password incorrect')
  const token=jwt.sign({email},'secret')
  res.json(token)
  
})

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.send('Info not enough')
  const isUserExist = await prisma.user.findOne({
    where:{
      email
    }
  })
  console.log(isUserExist)
  if(isUserExist) return res.send('User with this email exists')
  const hashedPassword =await bcrypt.hash(password,10)

  const user = await prisma.user.create({
    data: {
      email,
      password:hashedPassword
    }
  })
  
  const token=jwt.sign({
    email
  },'secret')

  res.json(token)

});


function isAuth(req,res,next) {
  
  const token =req.headers.authorization && req.headers.authorization.split(' ')[1]
  if (!token) return res.send('Missing token')
  jwt.verify(token, 'secret',(error,user)=>{
    if(error) return res.send(error)
    req.user = user
    next()
  })
}

export default app;
