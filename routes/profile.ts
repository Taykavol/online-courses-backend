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
            avatarBackground:true,
            totalReviews:true,
            instructorRating:true,
            registedStudents:true,
            publishedCourses:true,
            teacherName:true,
            title:true,
            id:true,
            aboutMe:true,
        }
    })
    console.log(profiles)
    res.send(profiles)
})

app.get('/:id', async(req,res)=>{
    const profile =  await prisma.instructorProfile.findUnique({
        where:{
            id:+req.params.id
        },
        select:{
            avatarBackground:true,
            totalReviews:true,
            instructorRating:true,
            registedStudents:true,
            publishedCourses:true,
            teacherName:true,
            title:true,
            id:true,
            aboutMe:true,
        }
    })
    console.log(profile)
    res.send(profile)
})


export default app
