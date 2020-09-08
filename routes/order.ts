import { Router } from "express";
import {PrismaClient} from "@prisma/client"
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

app.get('/all',isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            instructorProfile:{
                select:{
                    id:true,
                    orders:{
                        select:{
                            price:true,
                            course:{
                                select:{
                                    title:true
                                }
                            },
                            buyer:{
                                select:{
                                    email:true
                                }
                            },
                            createdAt:true
                            
                        },
                        take:5,
                        orderBy:{
                            createdAt:"desc"
                        }
                    }
                }
            }
        }
    })
    if(!user||!user.instructorProfile) return res.json('User not found')
    // const orders = await prisma.order.findMany({
    //     where:{
    //         sellerId:user.instructorProfile.id
    //     },
    //     select:{
    //         price:true,
    //         course:{
    //             select:{
    //                 title:true
    //             }
    //         },
    //         buyer:{
    //             select:{
    //                 email:true
    //             }
    //         }
    //     },
    //     take:5
    // })
    console.log(user.instructorProfile.orders)
    res.json(user.instructorProfile.orders)
})

export default app