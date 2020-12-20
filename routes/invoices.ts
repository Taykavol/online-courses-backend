import { Router } from "express";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

const app = Router();

app.get('/all', async (req,res)=>{
    const date = new Date()
    const invoices = await prisma.invoice.findMany({
        where:{
            status:"PENDING",
            NOT:{
                month:{
                    equals:date.getMonth()
                },
                year:{
                    equals:date.getFullYear()
                }
            }
        },
        include:{
            profile:{
                select:{
                    teacherName:true,
                    title:true,
                    paymentMethod:true,
                    paypalId:true
                }
            }
        }
    })
    res.send(invoices)
})

export default app
