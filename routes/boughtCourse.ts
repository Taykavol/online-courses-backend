import {Request,Router } from 'express'
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

app.get('/all',isAuth,async(req:IGetUserAuthInfoRequest,res)=>{
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            boughtCourses:{
                select:{
                    course:{
                        select:{
                            title:true,
                            subtitle:true,
                            category:true,
                            lessons:true,
                            duration:true,
                            author:{
                                select:{
                                    teacherName:true,
                                    title:true
                                }
                            }
                        }
                    },
                    progress:true,
                    
                }
            }
        }
    })
    if(!user) return res.json('User not found')
    res.json(user.boughtCourses)
})
// Buy course
app.post('/:id',isAuth, async (req:IGetUserAuthInfoRequest,res)=>{
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            boughtCourses:{
                select:{
                    course:{
                        select:{
                            id:true
                        }
                    }
                }
            }
        }
    })
    if(!user) return res.json('User not found')
    const isAlreadyExists = user.boughtCourses.find(course=>course.course.id==+req.params.id)
    console.log('coyurss',user.boughtCourses)
    if(isAlreadyExists) return res.json('You already bought the course')

    const boughtCourse = await prisma.boughtCourse.create({
        data:{
             user:{
                 connect:{
                     id:user.id
                 }
             },
             course:{
                 connect:{
                     id:+req.params.id
                 }
             }
        },
        include:{
            course:{
                select:{
                    authorId:true,
                    price:true
                }
            }
        }
    })
    console.log('sdfgd')
    const order = await prisma.order.create({
        data:{
            course:{
                connect:{
                    id:+req.params.id
                }
            },
            buyer:{
                connect:{
                    id:user.id
                }
            },
            seller:{
                connect:{
                    id:boughtCourse.course.authorId
                }
            },
            price:boughtCourse.course.price
        }
    })

    res.json(order)

})


export default app