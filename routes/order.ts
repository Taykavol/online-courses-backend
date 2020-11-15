import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import {isAuth, isInstructor} from '../permissions/auth'
// const { promisify } = require("util");
// const redis = require('redis')
// const redisUrl = 'redis://localhost:6379'
// const clientRedis = redis.createClient(redisUrl)
// clientRedis.get = promisify(clientRedis.get)
// clientRedis.hmget = promisify(clientRedis.hmget)


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
    // await clientRedis.flushall()
    // const info = await clientRedis.hmget(`order${req.user.id}`,['orders','monthrevenue','totalrevenue','totalstudents'])


    // if(info[0]) {
    //     console.log(  info,'FROM REDIS')
    //     return res.json({orders:JSON.parse(info[0]),summ:JSON.parse(info[1]),totalRevenue:JSON.parse(info[2]),totalStudents:JSON.parse(info[3])})
    // }
    // console.log('FROM DB')
    // const today = new Date()
    // const todayMonth = today.getMonth()+1
    // const todayYear = today.getFullYear()
    
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
    // const monthRevenue = await prisma.order.aggregate({
    //     where:{
    //         sellerId:req.user.instructorId,
    //         createdAt:{
    //             gte: new Date(`${todayMonth} 1, ${todayYear}`),
    //             lte: new Date(`${(todayMonth)%12+1} 1, ${(todayMonth)%12+1>todayMonth?todayYear:todayYear+1}`)
    //         }
    //     },
    //     sum:{
    //         price:true
    //     }
    // })
    // const totalRevenue = await prisma.order.aggregate({
    //     where:{
    //         sellerId:req.user.instructorId
    //     },
    //     sum:{
    //         price:true
    //     }
    // })
    // const totalStudents = await prisma.order.count({
    //     where:{
    //         sellerId:req.user.instructorId
    //     }
    // })
    // const totalMax
    // console.log(totalStudents)

    // if(!orders) return res.json('User not found')
    res.json(orders)
    // res.json({orders,summ:monthRevenue,totalRevenue,totalStudents})
    // clientRedis.hmset(`order${req.user.id}`,'orders',JSON.stringify(orders),'monthrevenue',JSON.stringify(monthRevenue),'totalrevenue',JSON.stringify(totalRevenue),'totalstudents',JSON.stringify(totalStudents))
    // clientRedis.expire(`order${req.user.id}`,10)
    // clientRedis.del('order')
})

// app.get('/revenuethismonth',isAuth,isInstructor,async(req:IGetUserAuthInfoRequest,res)=>{
//     const today = new Date()
//     const todayMonth = today.getMonth()+1
//     const todayYear = today.getFullYear()
//     const revenueThisMonth = await prisma.order.aggregate({
//         where:{
//             sellerId:req.user.instructorId,
//             createdAt:{
//                 gte: new Date(`${todayMonth} 1, ${todayYear}`),
//                 lte: new Date(`${(todayMonth)%12+1} 1, ${(todayMonth)%12+1>todayMonth?todayYear:todayYear+1}`)
//             }
//         },
//         sum:{
//             price:true
//         }
//     })
//     res.json(revenueThisMonth)
// })

// app.get('/revenue')

export default app