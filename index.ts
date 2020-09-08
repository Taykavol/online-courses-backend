import express from 'express'
// import {PrismaClient} from "@prisma/client"
import cors from 'cors'
import routerUser from "./routes/user"
import buildCourse from './routes/buildCourse'
import boughtCourse from './routes/boughtCourse'
import order from './routes/order'
import payment from './routes/payment'
import routeVideo from './routes/video'
import routerLichess from "./routes/lichess-auth"
const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    console.log(req.app.get('yoy'))
    res.send(`<h1>Hello ${JSON.stringify(req.query.email)+req.app.get('yoy') } world</h1>`)
    
})

app.use('',routerUser)
app.use('/lichess',routerLichess)
app.use('/buildcourse', buildCourse)
app.use('/video',routeVideo)
app.use('/boughtcourse',boughtCourse)
app.use('/order',order)
app.use('/payment',payment)


app.listen(4000, ()=>{
    console.log('Server is listenig')
})