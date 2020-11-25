
// if (process.env.NODE_ENV !== 'production')
// require('dotenv').config()
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

const app = express()


// const upload = multer({ storage: fileStorage })
// app.use('/public',express.static('public',{
//     maxAge:30000
// }));
// app.use(compression())
app.use(cors())
app.use(express.json())
// app.use('/files', express.static(path.join(__dirname,'public')))



app.get('/',(req,res)=>{
    console.log(req.app.get('yoy'))
    res.json({env:process.env.NODE_ENV,binance:process.env.BINANCE_CLIENT})
    
})

app.use('',routerUser)
app.use('/lichess',routerLichess)
app.use('/buildcourse', buildCourse)
app.use('/video',routeVideo)
app.use('/boughtcourse',boughtCourse)
app.use('/order',order)
app.use('/payment',payment)
app.use('/auth',authRoutes)

let PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(process.env.NODE_ENV)
    console.log('Server is listening on port: ', PORT)
})