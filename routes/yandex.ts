import {  Router ,Request } from "express";
import {PrismaClient} from "@prisma/client"
import {v4 as uuidv4} from 'uuid'
import {isAuth} from '../permissions/auth'
import  {Address6} from 'ip-address'

import Axios from "axios";

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id
  },
  course // or any other type,
}

const prisma = new PrismaClient()
const app = Router();
app.post('/notify',async (req,res)=>{
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
app.post('/payment',isAuth, async (req:IGetUserAuthInfoRequest, res)=>{
        console.log('We are here!!!!')
        const {courseId} = req.body
        const user = await prisma.user.findUnique({
          where:{
              id:+req.user.id
          },
          include:{
              instructorProfile:{
                  select:{
                      myCourses:true
                  }
              },
              boughtCourses:true
          }
        })

      if(!user) return res.json('User not found')
      if(user.instructorProfile) {
          if(user.instructorProfile.myCourses.find(course=>course.id==courseId)) {
              return res.send('You can not buy your course.')
          }
      }
      if(user.boughtCourses) {
        if(user.boughtCourses.find(course=>course.courseId==courseId)) {
          return res.send('You have already bought the course!')
        }
      }
  console.log(req.query.token)
  var idempotenceKey = uuidv4();
  const result =  await Axios({url:'https://api.yookassa.ru/v3/payments', method:"POST", 
  auth:{
    username:"770033",
    password:"test_j9KT3bKM3pRLIa4Nxhmd-Yf6fMMhxkPyBE4xjq1NAgw"
  },
  headers:{
    'Idempotence-Key':idempotenceKey,
    'Content-Type': 'application/json'
  },
  data:{
    payment_token:req.query.token,
    amount: {
        value: '2.00',
        currency: 'RUB'
    },
    confirmation: {
        type: 'redirect',
        return_url: `${process.env.FRONTEND_URL}/coursebought/${courseId}`
    },
    metadata:{
      courseId:courseId,
      buyerId:req.user.id
    }
  }})
  console.log(result.data)
    if( result.data.confirmation.confirmation_url) return res.json({confirmation_url:result.data.confirmation.confirmation_url})
      res.json('bad')
})
app.post('/ip',(req,res)=>{
    // 185.71.76.0/27
    // 185.71.77.0/27
    // 77.75.153.0/25
    // 77.75.154.128/25
    // 2a02:5180:0:1509::/64
    // 2a02:5180:0:2655::/64
    // 2a02:5180:0:1533::/64
    // 2a02:5180:0:2669::/64
    const requestIp = require('request-ip');
    const clientIp = requestIp.getClientIp(req)
    console.log('IP',clientIp)
    const ip:any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const address = new Address6(ip)
    console.log(address.subnetMask , address.mask())
    // address.subnetMask()
  console.log('ip', ip)
  res.status(200).send()
})

export default app;

