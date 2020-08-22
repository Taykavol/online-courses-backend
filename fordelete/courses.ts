import { Router} from "express";
import {PrismaClient} from "@prisma/client"
import {isAuth,isAdmin} from '../utils/auth'
import {Request} from 'express'
const app = Router();
const prisma = new PrismaClient()


export interface IGetUserAuthInfoRequest extends Request {
    user: {
      id
    } // or any other type
  }
// GET all courses including not PUBLISH
app.get('/allCourses',isAuth,isAdmin, async (req,res)=>{
    const courses = await prisma.course.findMany()
    res.json(courses)
})

//GET curriculum of course
app.get('/courses/curriculum/:id',isAuth,async (req:IGetUserAuthInfoRequest,res)=>{
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        },
        include:{
            curriculum:true
        }
    })
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            instructorProfile:{
                include:{
                    myCourses:true
                }
            }
        }
    })
    if(!course||!user) return res.send('User or course not found')
    let isUserOwner
    if(user.instructorProfile)
    isUserOwner = user.instructorProfile.myCourses.find(course=>course.id==+req.params.id)
    if(!isUserOwner) return res.send('User is not Owner') 

    if(!course.curriculum) return res.send('Curriculum not found')
    const curriculum = course.curriculum
    res.json(curriculum)
})
// GET all Publish courses 
app.get('/courses', async (req,res)=>{
    const courses =await prisma.course.findMany({
        where:{
            status:"PUBLISH"
        }
    })
    res.json(courses)
    // const courses = await prisma.course
})
// GET 1 publish course
app.get('/coursePublic/:id',async(req,res)=>{
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        }
    })
    if(course && course.status=="PUBLISH") return res.send(course)
    res.send('This course not exists!')
})
// GET 1 own course MAIN
app.get('/myOwnCourses/:id', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        },
        include:{
            author:{
                select:{
                    userID:true
                }
            },
            curriculum:{
                include:{
                    chapters:{
                        include:{
                            lessons:{
                                include:{
                                    puzzles:true,
                                    video:true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        }
    })

    if(!user||!course) return res.send('User or Course not found')
    if(user.id==course.author.userID) return res.json(course)
    res.send('It is private course ')
    
} )
// GET 1 bought couser FIXME: maybe need to delete
app.get('/myBoughtCourse/:id',isAuth, async (req:IGetUserAuthInfoRequest,res)=>{
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            boughtCourses:true
        }
    })
    if(!user) return res.send('User not found')
    const course = user.boughtCourses.find(course=>course.id ==+req.params.id)
    if(!course) return res.send("There is no course")
    res.json(course)
})
// GET Popular courses for main page
app.get('/popularCourses', async(req,res)=>{
    const courses = await prisma.course.findMany({
        where:{
            status:"PUBLISH"
        },
        orderBy:{
            forSearchEngines:"desc"
        },
        take:10
    })

    res.json(courses)
})
// Set status to the course
app.post('/publishCourse/:id',isAuth,isAdmin, async (req,res)=>{
    const {status} = req.body
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        }
    })
    if(!course) return res.send('Course not found')
    
    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            status
        }
    })
    res.json(updatedCourse)
})
// Buy 1 course, by authorize user.
app.post('/buyCourse/:id',isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        }
    })
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            boughtCourses:true,
            instructorProfile:{
                include:{myCourses:true}
            }
        }
    })
    console.log("I am user with id",user.id)
    if(!course||!user||!(course.status=="PUBLISH")) return res.send('Course or user not found')
    const isAlreadyBought = user.boughtCourses.find(course=>course.id==+req.params.id)
    if(isAlreadyBought) return res.send('You are already bought the course.')
    let isMyCourse
    if(user.instructorProfile) {isMyCourse = user.instructorProfile.myCourses.find(course=>course.id==+req.params.id)}
    if(isMyCourse) return res.send('You can not buy your own course ')
    //TODO: payment

    const updatedUser = await prisma.user.update({
        where:{
            id:req.user.id
        },
        data:{
            boughtCourses:{
                connect:{
                    id:course.id
                },
                update:{
                    where:{
                        id:course.id
                    },
                    data:{
                        totalPurchase:course.totalPurchase+1,
                        totalRevenue:course.totalRevenue+course.priceSale
                    }
                }
            }
        },
        include:{
            boughtCourses:true
        }
    })
    res.send(updatedUser)
})
// Create own course, if you have teacher profile
app.post('/course', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
    console.log(req.user.id)
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        select:{
            instructorProfile:true
        }
    })
    if(!user.instructorProfile) return res.send('You are not teacher')
    const id = user.instructorProfile.id
    const course = await prisma.course.create({
        data:{
            author:{
                connect:{
                    id
                }
            },
            curriculum:{
                create:{
                    chapters:{
                        create:{
                            order:0,
                        }
                    }
                }
            }
        }
    })
    res.send(course)
})
// Update course information
app.patch('/course/:id', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
    // interface dataType extends CourseCreateWithoutAuthorInput {
    //     name: string | null
    //     description: string | null
    //     category: string | null
    //     level: string | null
    //     picture: string | null
    // }
    
        let {name,description,category,level,picture,price,priceSale} = req.body
    
    
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        }
    })
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            instructorProfile:{
                include:{
                    myCourses:true
                }
            }
        }
    })
    if(!course||!user) return res.send('User or Course not found')
    let isUserOwner
    if(user.instructorProfile)
    isUserOwner = user.instructorProfile.myCourses.find(course=>course.id==+req.params.id)
    if(!isUserOwner) return res.send('User is not Owner') 
    if(price&&price>100) price=100 
    else if (price&&price<9.99) price=9.99 
    if(priceSale) {
        if(priceSale>price) priceSale=price
        if(priceSale<9.99) priceSale=9.99
    } 

    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            name,description,category,level,picture,price,priceSale
        }
    })
    res.json(updatedCourse)
} )
// Delete course
app.delete('/course/:id', isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        }
    })
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            instructorProfile:{
                include:{
                    myCourses:true
                }
            }
        }
    })
    if(!course||!user) return res.send('Course or user not found')
    let isUserOwner
    if(user.instructorProfile)
    isUserOwner = user.instructorProfile.myCourses.find(course=>course.id==+req.params.id)
    if(!isUserOwner&&!(user.role=="ADMIN")) return res.send('You are not allows to delete')
    if(user.role=="ADMIN"||course.totalPurchase==0) {
        const deletedCourse = await prisma.course.delete({
            where:{
                id:+req.params.id
            }
        })
        res.json(deletedCourse)

    } else if (isUserOwner)  {
        const updatedCourse = await prisma.course.update({
            where:{
                id:+req.params.id
            },
            data:{
                // TODO: Must be in publish in final migrate
                status:"BUILDING"
            }
        })
        res.json(updatedCourse)
    }
} )


export default app;
