import {  Router } from "express";
const yandexCheckout = require('yandex-checkout')('770033', 'test_j9KT3bKM3pRLIa4Nxhmd-Yf6fMMhxkPyBE4xjq1NAgw');
import {PrismaClient} from "@prisma/client"
import {v4 as uuidv4} from 'uuid'
import Axios from "axios";
const prisma = new PrismaClient()
const app = Router();

app.get('/payment', async (req, res)=>{
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
        return_url: `${process.env.FRONTEND_URL}/learning`
    }
  }})
    if( result.data.confirmation.confirmation_url) return res.json({confirmation_url:result.data.confirmation.confirmation_url})
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

