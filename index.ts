
if (process.env.NODE_ENV !== 'production')
require('dotenv').config()

console.log(process.env.NODE_ENV)
console.log(process.env.FRONTEND_URL,'URL')
// require('dotenv').config()
import express from 'express'
// import compression from "compression"
// import {PrismaClient} from "@prisma/client"
import cors from 'cors'
import routerUser from "./routes/user"
import buildCourse from './routes/buildCourse'
import boughtCourse from './routes/boughtCourse'
import order from './routes/order'
import payment from './routes/payment'
import routeVideo from './routes/video'
import authRoutes from './routes/auth'
import routerLichess from "./routes/lichess-auth"
import invoices from './routes/invoices'
import profile from './routes/profile'
import yandex from './routes/yandex'

const app = express()
app.set('trust proxy', true)

// const upload = multer({ storage: fileStorage })
// app.use('/public',express.static('public',{
//     maxAge:30000
// }));
app.use(cors())
app.use(express.json())
// app.use(compression())
// app.use('/files', express.static(path.join(__dirname,'public')))



app.get('/',(req,res)=>{
    console.log(req.app.get('yoy'))
    const requestIp = require('request-ip');
    const clientIp = requestIp.getClientIp(req)
    console.log('IP',clientIp, req.connection.remoteAddress, req.headers['x-forwarded-for'],req.headers['connection'],req.headers['X-Real-IP'])
    const ip:any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // const address = new Address6(ip)
    // console.log(address.subnetMask , address.mask())
    // address.subnetMask()
  console.log('ip', ip)
    res.send(`${clientIp}${req.connection.remoteAddress}${req.headers['x-forwarded-for']}${req.headers['X-Real-IP']}${JSON.stringify(req.headers) }`)
    
})

app.use('',routerUser)
app.use('/lichess',routerLichess)
app.use('/buildcourse', buildCourse)
app.use('/video',routeVideo)
app.use('/boughtcourse',boughtCourse)
app.use('/order',order)
app.use('/payment',payment)
app.use('/auth',authRoutes)
app.use('/invoices',invoices)
app.use('/profile',profile)
app.use('/checkout',yandex)
// app.use('/paymentnotifications',paymentnotifications)

let PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(process.env.NODE_ENV)
    console.log('Server is listening on port: ', PORT)
})