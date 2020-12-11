import {  Router } from "express";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()
const app = Router();

app.get('/',(req,res)=>{
    console.log('Payment was succeed.')
})

export default app;
