import express from 'express'
import {PrismaClient} from "@prisma/client"
import routerUser from "./routes/user"
import routerLichess from "./routes/lichess-auth"
const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    console.log(req.app.get('yoy'))
    res.send(`<h1>Hello ${JSON.stringify(req.query.email)+req.app.get('yoy') } world</h1>`)
    
})

app.use('',routerUser)
app.use('/lichess',routerLichess)

app.listen(3000, ()=>{
    console.log('Server is listenig')
})