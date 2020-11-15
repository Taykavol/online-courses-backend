import {Request,Router } from 'express'
import {PrismaClient} from "@prisma/client"
import {isAuth, isAdmin} from '../permissions/auth'
// const { promisify } = require("util");
// const redis = require('redis')
// const redisUrl = 'redis://localhost:6379'
// const clientRedis = redis.createClient(redisUrl)
// clientRedis.get = promisify(clientRedis.get)

const app = Router()

export interface IGetUserAuthInfoRequest extends Request {
    user: {
      id
    },
    course // or any other type,
  }

const prisma = new PrismaClient()
prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );
    return result;
  });

//Get bought courses
app.get('/all',isAuth,async(req:IGetUserAuthInfoRequest,res)=>{
    // clientRedis.flushall()
    // const redisCourse = await clientRedis.get(`${req.user.id}${req.path}`)
    // console.log(redisCourse)
    // if(redisCourse) {
    //     console.log('FROM REDIS')
    //     const course:JSON = JSON.parse(redisCourse)
    //     return res.json(course)
    //   } 
    const boughtCourse = await prisma.boughtCourse.findMany({
        where:{
            userId:req.user.id
        },
        select:{
            course:{
                select:{
                    id:true,
                    title:true,
                    subtitle:true,
                    category:true,
                    lessons:true,
                    duration:true,
                    pictureUri:true,
                    curriculum:true,
                    author:{
                        select:{
                            teacherName:true,
                            title:true,
                            avatar:true
                        }
                    }
                }
            },
            progress:true,
            progressOfLessons:true,
            progressOfPuzzles:true,
            reviewId:true,
            id:true,
        }
    })

    // await prisma.boughtCourse.
    // const user = await prisma.user.findOne({
    //     where:{
    //         id:req.user.id
    //     },
    //     include:{
    //         boughtCourses:{
    //             select:{
    //                 course:{
    //                     select:{
    //                         title:true,
    //                         subtitle:true,
    //                         category:true,
    //                         lessons:true,
    //                         duration:true,
    //                         author:{
    //                             select:{
    //                                 teacherName:true,
    //                                 title:true
    //                             }
    //                         }
    //                     }
    //                 },
    //                 progress:true,
    //                 review:true,
    //                 id:true,
    //             }
    //         }
    //     }
    // })
    // if(!user) return res.json('User not found')
    res.json(boughtCourse)
    // clientRedis.set(`${req.user.id}${req.path}`, JSON.stringify(boughtCourse),'EX',10)
})
// Get 1 course
app.get('/:id',isAuth, async(req:IGetUserAuthInfoRequest, res)=>{
    // setTimeout(()=>{
    //     console.log('I am back in 10 seconds')
    // },10000)
    const boughtCourse = await prisma.boughtCourse.findOne({
        where:{
            id:+req.params.id
        },
        select:{
            course:{
                select:{
                    title:true,
                    curriculum:true,
                    duration:true,
                    totalPuzzles:true,
                    author:{
                        select:{
                            teacherName:true,
                            title:true,
                            avatar:true
                        }
                    }
                    
                }
                
            },
            userId:true,
            progressOfLessons:true,
            progressOfPuzzles:true,
        }
    })
    if(req.user.id == boughtCourse.userId) return res.json(boughtCourse)
    res.json('You are not owner')
})
app.patch('/:id', isAuth, async(req:IGetUserAuthInfoRequest, res)=>{
    const {progressOfLessons,progressOfPuzzles,progress} = req.body
    console.log(progressOfLessons,progressOfPuzzles)
    const boughtCourse = await prisma.boughtCourse.findOne({
        where:{
            id:+req.params.id
        },
        select:{
            userId:true,
        }
    })
    if(req.user.id != boughtCourse.userId) return res.json('You are now owner.')
    const updatedCourse = await prisma.boughtCourse.update({
        where:{
            id:+req.params.id
        },
        data:{
            progressOfLessons:{
                set:progressOfLessons
            },
            progressOfPuzzles:{
                set:progressOfPuzzles
            },
            progress:{
                set:progress
            }
        }
    })
    res.send('Ok')
})
// Buy course
app.post('/:id',isAuth, async (req:IGetUserAuthInfoRequest,res)=>{
    const user = await prisma.user.findOne({
        where:{
            id:req.user.id
        },
        include:{
            instructorProfile:{
                select:{
                    myCourses:true
                }
            }
        }
        // include:{
        //     boughtCourses:{
        //         select:{
        //             courseId:true
        //         }
        //     }
        // }
    })
    if(!user) return res.json('User not found')
    if(user.instructorProfile) {
        if(user.instructorProfile.myCourses.find(course=>course.id==+req.params.id)) {
            return res.status(502).end()
        }
    }
    // if(user.boughtCourses.find)
 
    try {
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
                        author:{
                            select:{
                                profit:true,
                            },
                            
                        },
                        authorId:true,
                        price:true,
                    
                    },
                }
            }
        })
        // clientRedis.del(`coursesAll${req.user.id}`)

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
        const today  = new Date()
        const invoice = await prisma.invoice.upsert({
            create:{
                month: today.getMonth(),
                year:today.getFullYear(),
                profile:{
                    connect:{
                    id:boughtCourse.course.authorId
                },
                
                },
                total:boughtCourse.course.price*boughtCourse.course.author.profit
            },
            update:{
                total:{
                    increment:boughtCourse.course.price*boughtCourse.course.author.profit
                }
            },
            where:{
                month_year_profileId:{
                    month:today.getMonth(),
                    year:today.getFullYear(),
                    profileId:boughtCourse.course.authorId
                }
            }
        })
        const updatedCourse = await prisma.course.update({
            where:{
                id:+req.params.id
            },
            data:{
                registedStudents:{
                    increment:1
                }
            }
        })
        const updatedProfile = await prisma.instructorProfile.update({
            where:{
                id:boughtCourse.course.authorId
            },
            data:{
                registedStudents:{
                    increment:1
                }
            }
        })
        res.json('Good')
    } catch (error) {
        res.json('You already bought the course')
    }

})
// Review course
app.post('/:id/review',isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
const course = await prisma.boughtCourse.findOne({
    where:{
        id:+req.params.id
    },
    select:{
        userId:true,
        review:true,
        courseId:true,
        course:{
            select:{
                reviewStats:true,
            }
        }
    }
})
if(course.userId!=req.user.id) return res.json('You are not owner')
if(course.review) return res.json('You have already voted')
const {review,reviewMessage,authorName,reviewSubtitle} = req.body

course.course.reviewStats[review-1]++
const avgRating = course.course.reviewStats.reduce((acc,val,index)=>acc+val*(index+1))/course.course.reviewStats.reduce((acc,val)=>acc+val)

const newReview = await prisma.review.create({
    data:{
        review,
        reviewMessage,
        authorName,
        reviewSubtitle,
        course:{
            connect:{
                id:course.courseId
            },
        },
        boughtCourse:{
            connect:{
                id:+req.params.id
            }
        }
    }
})
const updatedCourse = await prisma.course.update({
    where:{
        id:course.courseId
    },
    data:{
        reviewStats:{
            set:course.course.reviewStats
        },
        averageRating:{
            set:avgRating
        }
        
    }
})

res.json('Good')
})
// Get review
app.get('')



export default app