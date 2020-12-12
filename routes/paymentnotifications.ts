import {  Router } from "express";
import {PrismaClient} from "@prisma/client"
import Axios from "axios";
import {v4 as uuidv4} from 'uuid'

const prisma = new PrismaClient()
const app = Router();

// app.get('/',(req,res)=>{
//     console.log('body',req.body)
//     console.log('Payment was succeed.' )
// })
app.post('/',async (req,res)=>{
    // console.log(req)
    
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('ip', ip)
    const {object} = req.body
    const payment_id = object.id
    const status = object.status
    const idempotenceKey = uuidv4();

    console.log('status',status , 'payment_id',payment_id )
    try {
        if(status=='waiting_for_capture') {
            // console.log(object.metadata.buyerId, object.metadata.courseId)
            const confirm = await Axios({
                url:`https://api.yookassa.ru/v3/payments/${payment_id}/capture`,
                method:"POST",
                auth:{
                    username:"770033",
                    password:"test_j9KT3bKM3pRLIa4Nxhmd-Yf6fMMhxkPyBE4xjq1NAgw"
                }, 
                headers:{
                    'Idempotence-Key':idempotenceKey,
                    'Content-Type': 'application/json'
                },
                data:{
                    amount: object.amount
                }
            })
            console.log('confirm',confirm)
            return res.status(200).send()
        }
        
        if(status=='succeeded') {
            const boughtCourse = await prisma.boughtCourse.create({
                data:{
                     user:{
                         connect:{
                             id:+object.metadata.buyerId
                         }
                     },
                     course:{
                         connect:{
                             id:+object.metadata.courseId
                         }
                     }
                },
                include:{
                    course:{
                        select:{
                            author:{
                                select:{
                                    profit:true,
                                },
                                
                            },
                            authorId:true,
                            price:true,
                        
                        },
                    }
                }
            })
            const order = await prisma.order.create({
                data:{
                    course:{
                        connect:{
                            id:+object.metadata.courseId
                        }
                    },
                    buyer:{
                        connect:{
                            id:+object.metadata.buyerId
                        }
                    },
                    seller:{
                        connect:{
                            id:boughtCourse.course.authorId
                        }
                    },
                    price:boughtCourse.course.price
                }
            })

            const today  = new Date()
            const invoice = await prisma.invoice.upsert({
                create:{
                    month: today.getMonth(),
                    year:today.getFullYear(),
                    profile:{
                        connect:{
                        id:boughtCourse.course.authorId
                    },
                    
                    },
                    total:boughtCourse.course.price*boughtCourse.course.author.profit
                },
                update:{
                    total:{
                        increment:boughtCourse.course.price*boughtCourse.course.author.profit
                    }
                },
                where:{
                    month_year_profileId:{
                        month:today.getMonth(),
                        year:today.getFullYear(),
                        profileId:boughtCourse.course.authorId
                    }
                }
            })
            const updatedCourse = await prisma.course.update({
                where:{
                    id:+object.metadata.courseId
                },
                data:{
                    registedStudents:{
                        increment:1
                    },
                    searchRating:{
                        increment:1
                    }
                }
            })
            const updatedProfile = await prisma.instructorProfile.update({
                where:{
                    id:boughtCourse.course.authorId
                },
                data:{
                    registedStudents:{
                        increment:1
                    }
                }
            })
            console.log('course was bought!')
            return res.status(200).send()
            // Выдать курс
        }
    } catch (error) {
        console.log(error)
        return res.status(200).send()
    }

    // console.log('bodyPost',req.body)
    // console.log('Payment was succeed.Post' )
    
})

export default app;
