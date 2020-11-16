require('dotenv').config()
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

// const upload = multer({ storage: fileStorage })
app.use('/public',express.static('public',{
    maxAge:30000
}));

app.use(cors())
app.use(express.json())
// app.use('/files', express.static(path.join(__dirname,'public')))



app.get('/',(req,res)=>{
    console.log(req.app.get('yoy'))
    res.json('uous')
    
})

app.use('',routerUser)
app.use('/lichess',routerLichess)
app.use('/buildcourse', buildCourse)
app.use('/video',routeVideo)
app.use('/boughtcourse',boughtCourse)
app.use('/order',order)
app.use('/payment',payment)

let port;
if(process.env.NODE_ENV=="production")
    port = process.env.PORT 
else port = 4000
app.listen(port, ()=>{
    console.log('Server is listening:',port)
})