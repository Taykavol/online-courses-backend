import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import {isAuth, isInstructor} from '../permissions/auth'

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

app.get('/invoice',isAuth,isInstructor,async(req:IGetUserAuthInfoRequest,res)=>{
    const invoice = await prisma.invoice.findMany({
        where:{
            profileId:req.user.instructorId,
            
        },
        orderBy:{
            createdAt:"desc",
        },
        take:3,
    })

    res.json(invoice)
})
app.get('/all',isAuth, isInstructor, async(req:IGetUserAuthInfoRequest,res)=>{
    const orders = await prisma.order.findMany({
        where:{
            sellerId:req.user.instructorId,
            // createdAt:{
            //     gte: new Date(`${todayMonth} 1, ${todayYear}`),
            //     lte: new Date(`${(todayMonth)%12+1} 1, ${(todayMonth)%12+1>todayMonth?todayYear:todayYear+1}`)
            // }
            
        },
        select:{
            price:true,
            course:{
                select:{
                    title:true
                }
            },
            buyer:{
                select:{
                    email:true,
                    lichessId:true
                }
            },
            createdAt:true
            
        },
        take:10,
        orderBy:{
            createdAt:"desc"
        }
    })
    res.json(orders)
})

export default app