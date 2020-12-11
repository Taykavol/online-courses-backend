import {  Router } from "express";
const yandexCheckout = require('yandex-checkout')('770033', 'test_j9KT3bKM3pRLIa4Nxhmd-Yf6fMMhxkPyBE4xjq1NAgw');
import {PrismaClient} from "@prisma/client"
import {v4 as uuidv4} from 'uuid'
const prisma = new PrismaClient()
const app = Router();

app.get('/payment', (req, res)=>{
  console.log(req.query.token)
  
 var idempotenceKey = uuidv4();
 console.log(idempotenceKey)
    yandexCheckout.createPayment({
    'payment_token':req.query.token,
    'amount': {
        'value': '2.00',
        'currency': 'RUB'
    },
    // 'payment_method_data': {
    //     'type': 'bank_card'
    // },
    'confirmation': {
        'type': 'redirect',
        'return_url': `${process.env.FRONTEND_URL}/learning`
    }
}, idempotenceKey)
  .then(function(result) {
    console.log(result,result.confirmation.confirmation_url)
    if(result.confirmation.confirmation_url) return res.json({confirmation_url:result.confirmation.confirmation_url})
    res.json('bad')
  })
  .catch(function(err) {
    console.error(err);
  })
})

export default app;

