import {PrismaClient} from "@prisma/client" 
import {Request,Router } from 'express'
import {isAuth, isInstructor , isAdmin} from '../permissions/auth'

const app = Router()
const prisma = new PrismaClient()

app.get('/all', async (req,res)=>{
  const profiles =  await prisma.instructorProfile.findMany({
        where:{
            publishedCourses:{
                gte:1
            }
        },
        select:{
            avatar:true,
            totalReviews:true,
            instructorRating:true,
            registedStudents:true,
            publishedCourses:true,
            teacherName:true,
            title:true
        }
    })
    console.log(profiles)
    res.send(profiles)
})


export default app
