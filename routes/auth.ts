import { Router } from "express";
import { PrismaClient } from "@prisma/client"
import fetch from "node-fetch"
import expiresIn from '../utils/jwtexpire'
import bcrypt from 'bcrypt'
// import axios from "axios"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

// const axios = require('axios');

const app = Router();

app.post('/google', async (req, res) => {
    const { code } = req.body
    const url = `https://accounts.google.com/o/oauth2/token?grant_type=authorization_code&code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.FRONTEND_URL}/auth/?provider=google`
    const data = await fetch(url, {
        method: "POST"
    })
    const { access_token } = await data.json()
    const emailData = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })
    const { email } = await emailData.json()
    let user = await prisma.user.findUnique({
        where: {
            googleId: email
        },
        select: {
            id: true,
            role: true,
            instructorProfile:true,
            boughtCourses:true
        }
    })
    if (!user)
        user = await prisma.user.create({
            data: {
                googleId: email,
                email: email,
            },
            select: {
                id: true,
                role: true,
                instructorProfile:true,
                boughtCourses:true
            }
        })
    // else  
        // await prisma.user.
    await prisma.user.update({
        where:{
            googleId: email
        },
        data:{
            lastLogin:new Date()
        }
    })
    const tokenApp = jwt.sign({
        id: user.id,
        role: user.role,
        instructorId:user.instructorProfile?user.instructorProfile.id:null
    }, process.env.JWT_SECRET, {expiresIn})

    res.json({ email, role: user.role, token: tokenApp, instructorId:user.instructorProfile?user.instructorProfile.id:null,courses:user.boughtCourses })
})

app.post('/facebook', async (req, res) => {
    const { code } = req.body
    const url = `https://graph.facebook.com/v9.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL}/auth/?provider=facebook&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
    let data = await fetch(url)
    const { access_token } = await data.json()
    // &fields=email,name
    const url2 = `https://graph.facebook.com/me?access_token=${access_token}&fields=email,name`
    let data2 = await fetch(url2)
    const { email, id } = await data2.json()
    let user = await prisma.user.findUnique({
        where: {
            facebookId: id,
        },
        select: {
            id: true,
            role: true,
            instructorProfile:true,
            boughtCourses:true
        }
    })
    if (!user)
        user = await prisma.user.create({
            data: {
                facebookId: id,
                email: email,
            },
            select: {
                id: true,
                role: true,
                instructorProfile:true,
                boughtCourses:true
            }
        })

        await prisma.user.update({
            where:{
                facebookId: id,
            },
            data:{
                lastLogin:new Date()
            }
        })
    const tokenApp = jwt.sign({
        id: user.id,
        role: user.role,
        instructorId:user.instructorProfile?user.instructorProfile.id:null
    }, process.env.JWT_SECRET, {expiresIn})

    res.json({ email, role: user.role, token: tokenApp, instructorId:user.instructorProfile?user.instructorProfile.id:null, courses:user.boughtCourses})

})

app.post('/vk', async (req, res) => {
    const { code } = req.body
    const url = `https://oauth.vk.com/access_token?client_id=${process.env.VK_CLIENT_ID}&client_secret=${process.env.VK_CLIENT_SECRET}&redirect_uri=${process.env.FRONTEND_URL}/auth/?provider=vk&code=${code}`
    let data = await fetch(url)
    // const access_token = await data.json()
    const { access_token, user_id, email } = await data.json()
    let user = await prisma.user.findUnique({
        where: {
            VKId: user_id
        },
        select: {
            id: true,
            role: true,
            instructorProfile:true,
            boughtCourses:true
        }
    })
    if (!user)
        user = await prisma.user.create({
            data: {
                VKId: user_id,
                email: email,
            },
            select: {
                id: true,
                role: true,
                instructorProfile:true,
                boughtCourses:true
            }
        })

        await prisma.user.update({
            where:{
                VKId: user_id
            },
            data:{
                lastLogin:new Date()
            }
        })
    const tokenApp = jwt.sign({
        id: user.id,
        role: user.role,
        instructorId:user.instructorProfile?user.instructorProfile.id:null
    }, process.env.JWT_SECRET, {expiresIn})

    res.json({ email, role:user.role, token: tokenApp, instructorId:user.instructorProfile?user.instructorProfile.id:null,courses:user.boughtCourses })
})

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password)
    if(!email || !password) return res.json({error:'Info not enough'})
    const isUserExist = await prisma.user.findUnique({
      where:{
       login:email
      }
    })
    if(isUserExist) return res.json({error:'User with this email exists'})
    const hashedPassword =await bcrypt.hash(password,10)
  
    const {id,role} = await prisma.user.create({
      data: {
        login:email,
        password:hashedPassword,
        role:"USER"
      }
    })
    
    const token=jwt.sign({
      id,
      role
    },process.env.JWT_SECRET, {expiresIn})
    res.json({token, user:{role:"USER",email}})
  });

  app.post("/login",async (req,res)=>{
    const { email, password } = req.body;
    if(!email || !password) return res.json({error:'Info not enough'})
    const user = await prisma.user.findUnique({
      where: {
        login:email
      },
      include:{
        instructorProfile:true
      }
    })
    if(!user) return res.json({error:'Email or password are incorrect'})
    const id = user.id
    const role = user.role
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) return res.json({error:'Password incorrect'})
    const token=jwt.sign({id,role,instructorId:user.instructorProfile?user.instructorProfile.id:null},process.env.JWT_SECRET, {expiresIn})
    res.json({token, user:{role,email}})
    
  })
export default app
