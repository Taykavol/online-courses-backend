import {  Router ,Request } from "express";
const yandexCheckout = require('yandex-checkout')('770033', 'test_j9KT3bKM3pRLIa4Nxhmd-Yf6fMMhxkPyBE4xjq1NAgw');
import {PrismaClient} from "@prisma/client"
import {v4 as uuidv4} from 'uuid'
import {isAuth} from '../permissions/auth'

import Axios from "axios";

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id
  },
  course // or any other type,
}

const prisma = new PrismaClient()
const app = Router();

app.post('/payment/',isAuth, async (req:IGetUserAuthInfoRequest, res)=>{
        console.log('We are here!!!!')
        const {courseId} = req.body
        // console.log('User',req.user.id)
        // if(!req.user.id) return res.json('You are not auth')
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
    // if(result.data==t)
      res.json('bad')
  // console.log('easy',good)
//  console.log(idempotenceKey)
//     yandexCheckout.createPayment({
    // 'payment_token':req.query.token,
    // 'amount': {
    //     'value': '2.00',
    //     'currency': 'RUB'
    // },
    // 'confirmation': {
    //     'type': 'redirect',
    //     'return_url': `${process.env.FRONTEND_URL}/learning`
    // }
// }, idempotenceKey)
//   .then(function(result) {
//     console.log(result,result.confirmation.confirmation_url)
//     if(result.confirmation.confirmation_url) return res.json({confirmation_url:result.confirmation.confirmation_url})
//     res.json('bad')
//   })
//   .catch(function(err) {
//     console.error(err);
//   })
})

export default app;

