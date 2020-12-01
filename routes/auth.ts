import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import fetch from "node-fetch"
import axios from "axios"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

// const axios = require('axios');

const app = Router();

app.post('/google',async(req,res)=>{
    const {code} = req.body

    const url = `https://accounts.google.com/o/oauth2/token?grant_type=authorization_code&code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.FRONTEND_URL}/auth/?provider=google`
    const data = await fetch(url, {
        method:"POST"
    })
    const {access_token} = await data.json()
    const emailData  = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{
        method:"GET",
        headers:{
            Authorization:`Bearer ${access_token}`
        }
    })
    const {email} = await emailData.json()
    let user = await prisma.user.findOne({
        where:{
            googleId:email
        },
        select:{
            id:true,
            role:true
        }
    })
    if(!user)
     user = await prisma.user.create({
        data:{
            googleId:email,
            email:email,
        },
        select:{
            id:true,
            role:true
        }
    }) 


    const tokenApp=jwt.sign({
        id:user.id,
        role:user.role,
      },'secret')

    // console.log(typeof(email),email)
    // console.log('emailData',await emailData.json())
    // console.log('Data:',access_token)
     res.json({email,role:"USER", token:tokenApp})
    // res.send({email:email})
})

app.post('/facebook', async(req,res)=>{
    const {code} = req.body
    console.log('Code',code)
    const url = `https://graph.facebook.com/v9.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL}/auth/?provider=facebook&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
    let data = await fetch(url)
    const {access_token} = await data.json()
    // &fields=email,name
    const url2 =`https://graph.facebook.com/me?access_token=${access_token}&fields=email,name`
    let data2 = await fetch(url2)
    const {email,id} = await data2.json()
    let user = await prisma.user.findOne({
        where:{
            facebookId:id,
        },
        select:{
            id:true,
            role:true
        }
    })
    if(!user)
     user = await prisma.user.create({
        data:{
            facebookId:id,
            email:email,
        },
        select:{
            id:true,
            role:true
        }
    }) 
    
    const tokenApp=jwt.sign({
        id:user.id,
        role:user.role,
    },'secret')

    res.json({email,role:"USER", token:tokenApp})

})

app.post('/vk', async (req,res)=>{
console.log('VK')
const {code} = req.body
console.log(code)
const url = `https://oauth.vk.com/access_token?client_id=${process.env.VK_CLIENT_ID}&client_secret=${process.env.VK_CLIENT_SECRET}&redirect_uri=${process.env.FRONTEND_URL}/auth?provider=vk&code=${code}`
let data = await fetch(url)
// const access_token = await data.json()
const {access_token, user_id ,email} = await data.json()
let user = await prisma.user.findOne({
    where:{
        VKId:user_id
    },
    select:{
        id:true,
        role:true
    }
})
if(!user)
 user = await prisma.user.create({
    data:{
        VKId:user_id,
        email:email,
    },
    select:{
        id:true,
        role:true
    }
}) 

const tokenApp=jwt.sign({
    id:user.id,
    role:user.role,
},'secret')

res.json({email,role:"USER", token:tokenApp})

    // &fields=email,name
    // const url2 =`https://graph.facebook.com/me?access_token=${access_token}&fields=email,name`
    // let data2 = await fetch(url2)
    // const {email,id} = await data2.json()
})
export default app

