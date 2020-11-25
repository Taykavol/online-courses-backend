import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import axios from "axios"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

// const axios = require('axios');

const app = Router();

app.post('google',async(req,res)=>{
    // https://accounts.google.com/o/oauth2/v2/auth?
    // redirect_uri=http://localhost:3000/&
    // response_type=code&access_type=offline&
    // scope=https://www.googleapis.com/auth/userinfo.email&client_id=231498108232-bqrk6v0pmvnm8o8igcn6en22f42g41ls.apps.googleusercontent.com
    await axios({url:'https://accounts.google.com/o/oauth2/v2/auth',method:'POST',params:{
        redirect_uri:'http://localhost:3000/auth/?provider=google?'

    }})
})

export default app

