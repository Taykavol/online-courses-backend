import {PrismaClient} from "@prisma/client" 
import {Request,Router } from 'express'
import {isAuth, isInstructor , isAdmin} from '../permissions/auth'

const app = Router()
const prisma = new PrismaClient()



  export interface IGetUserAuthInfoRequest extends Request {
    user: {
      id,
      role,
      instructorId
    } // or any other type
  }

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
            country:true
        }
    })
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
            country:true,
        }
    })
    res.send(profile)
})
app.post('/payment', isAuth,isInstructor, async(req:IGetUserAuthInfoRequest,res)=>{
    const {paymentInfo,paymentMethod} = req.body
    await prisma.instructorProfile.update({
        where:{
            id:req.user.instructorId
        },
        data:{
            paymentInfo,
            paymentMethod
        }
    })
    res.json('Ok')
    
})

export default app
