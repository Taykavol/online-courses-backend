import {Request,Router } from 'express'
import {v4 as uuidv4} from 'uuid'
import {PrismaClient} from "@prisma/client"
import {isAuth, isAdmin} from '../utils/auth'

const app = Router()

export interface IGetUserAuthInfoRequest extends Request {
    user: {
      id
    },
    course // or any other type,
  }
  
const prisma = new PrismaClient()
// app.get('/course', (req,res)=>{
//     res.json(data)
// })
app.post('/create',isAuth, async (req:IGetUserAuthInfoRequest,res)=>{
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            instructorProfile:{
                select:{
                    id:true
                }
            }
        }
    })
    if(!user.instructorProfile) return res.json('You are not teacher')
    const curriculum = [{id:uuidv4(),name:"",order:0,lessons:[{order:0,id:uuidv4(),name:"",description:"",video:{duration:0},puzzles:[]}]}]
    const course = await prisma.course.create({
        data:{
            author:{
                connect:{
                    id:user.instructorProfile.id
                }
            },
            curriculum: JSON.stringify(curriculum)
        },        
    })
    res.json(course)
    // if(course) return res.json('Course not found')

})
app.get('/all',isAuth,async (req:IGetUserAuthInfoRequest,res)=>{
    const user = await prisma.user.findOne({
        where:{
            id:+req.user.id
        },
        include:{
            instructorProfile:{
                include:{
                    myCourses:true
                }
            }
        }
    })
    if(!user.instructorProfile) return res.json('You are not teacher')
    res.json(user.instructorProfile.myCourses)
})
app.get('/:id', isAuth,isCourseOwner, async (req:IGetUserAuthInfoRequest,res)=>{
    res.json(req.course)
})

app.put('/:id',isAuth,isCourseOwner, async (req:IGetUserAuthInfoRequest,res)=>{
    let {curriculum,lessons,duration} = req.body
    duration= Math.floor(duration)
    console.log(lessons)
    console.log(typeof(curriculum))
    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            curriculum:JSON.stringify(curriculum),
            lessons,
            duration
        }
    }) 
    res.json(updatedCourse)
    
})

app.patch('/:id',isAuth,isCourseOwner,async (req:IGetUserAuthInfoRequest,res)=>{
    let {title,subtitle,description,category,level,price} = req.body
    // let data= req.body
    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            title,subtitle,description,category,level,price
        }
    })
    console.log(req.body)
    res.json(updatedCourse)
})

async function isCourseOwner(req,res,next) {
    const course  = await prisma.course.findOne({
        where:{
            id:+req.params.id
        },
        include:{
            author:{
                select:{
                    userId:true
                }
            }
        }
    })
    if(!course) return res.json('Course not found')
    if(course.author.userId!=req.user.id) return res.json('You are not owner')
    req.course=course
    next()
} 
export default app

