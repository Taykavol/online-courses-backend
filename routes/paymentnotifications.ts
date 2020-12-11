import {  Router } from "express";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()
const app = Router();

app.get('/',(req,res)=>{
    console.log('body',req.body)
    console.log('Payment was succeed.' )
})
app.post('/',(req,res)=>{
    console.log('bodyPost',req.body)
    console.log('Payment was succeed.Post' )
})

export default app;
