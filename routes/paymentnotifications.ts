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
    if(status=='waiting_for_capture') {
        const confirm = await Axios({
            url:`https://api.yookassa.ru/v3/payments/${payment_id}/capture`,
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

        console.log('course was bought!')
        // Выдать курс
    }
    
    // console.log('bodyPost',req.body)
    // console.log('Payment was succeed.Post' )
    res.status(200).send()
})

export default app;
