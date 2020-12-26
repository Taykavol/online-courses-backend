import {Request,Router } from 'express'
import {PrismaClient} from "@prisma/client"
import {isAuth, isAdmin, isInstructor} from '../permissions/auth'

const app = Router()

export interface IGetUserAuthInfoRequest extends Request {
    user: {
      id,
      instructorId,
      role
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
            progress:true,
            progressOfLessons:true,
            progressOfPuzzles:true,
            reviewId:true,
            id:true,
        }
    })

    res.json(boughtCourse)
})
// Get 1 course by CourseId (check, if courses bought or not)
app.get('/course/:id', isAuth, async(req:IGetUserAuthInfoRequest, res)=> {
    const user = await prisma.user.findUnique({
        where:{
            id:req.user.id
        },
        select:{
            boughtCourses:true
        }
    })
    const course = user.boughtCourses.find(boughtCourse=>boughtCourse.courseId==+req.params.id)
    if(course) return res.json({body:'Course is bought, redirect'})
    res.json({error:'Try to resend request.'})
})
app.get('/seedcourse/:id', isAuth, isInstructor, async(req:IGetUserAuthInfoRequest,res)=>{
    const course = await prisma.course.findUnique({
        where:{
            id:+req.params.id
        },
        select:{
            title:true,
            curriculum:true,
            duration:true,
            totalPuzzles:true,
            author:{
                select:{
                    id:true,
                    teacherName:true,
                    title:true,
                }
            }
        },
    })
    if(course.author.id!=req.user.instructorId) return res.json('You are not owner')
    const boughtCourse = {course, progressOfLessons:[],progressOfPuzzles:[],reviewId:''}
    res.json(boughtCourse)

})
// Get 1 course
app.get('/:id',isAuth, async(req:IGetUserAuthInfoRequest, res)=>{
    const boughtCourse = await prisma.boughtCourse.findUnique({
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
                        }
                    }
                    
                }
                
            },
            userId:true,
            progressOfLessons:true,
            progressOfPuzzles:true,
            reviewId:true
        }
    })
    if(!boughtCourse) return res.json('Not found')
    if(req.user.id == boughtCourse.userId) return res.json(boughtCourse)
    res.json('You are not owner')
})
// User progress update
app.patch('/:id', isAuth, async(req:IGetUserAuthInfoRequest, res)=>{
    const {progressOfLessons,progressOfPuzzles,progress} = req.body
    const boughtCourse = await prisma.boughtCourse.findUnique({
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
// app.post('/:id',isAuth, async (req:IGetUserAuthInfoRequest,res)=>{
//     const user = await prisma.user.findUnique({
//         where:{
//             id:req.user.id
//         },
//         include:{
//             instructorProfile:{
//                 select:{
//                     myCourses:true
//                 }
//             }
//         }
//     })
//     if(!user) return res.json('User not found')
//     if(user.instructorProfile) {
//         if(user.instructorProfile.myCourses.find(course=>course.id==+req.params.id)) {
//             return res.send('You can not buy your course.')
//         }
//     }
 
//     try {
//         const boughtCourse = await prisma.boughtCourse.create({
//             data:{
//                  user:{
//                      connect:{
//                          id:user.id
//                      }
//                  },
//                  course:{
//                      connect:{
//                          id:+req.params.id
//                      }
//                  }
//             },
//             include:{
//                 course:{
//                     select:{
//                         author:{
//                             select:{
//                                 profit:true,
//                             },
                            
//                         },
//                         authorId:true,
//                         price:true,
                    
//                     },
//                 }
//             }
//         })

//         const order = await prisma.order.create({
//             data:{
//                 course:{
//                     connect:{
//                         id:+req.params.id
//                     }
//                 },
//                 buyer:{
//                     connect:{
//                         id:user.id
//                     }
//                 },
//                 seller:{
//                     connect:{
//                         id:boughtCourse.course.authorId
//                     }
//                 },
//                 price:boughtCourse.course.price
//             }
//         })
//         const today  = new Date()
//         const invoice = await prisma.invoice.upsert({
//             create:{
//                 month: today.getMonth(),
//                 year:today.getFullYear(),
//                 profile:{
//                     connect:{
//                     id:boughtCourse.course.authorId
//                 },
                
//                 },
//                 total:boughtCourse.course.price*boughtCourse.course.author.profit
//             },
//             update:{
//                 total:{
//                     increment:boughtCourse.course.price*boughtCourse.course.author.profit
//                 }
//             },
//             where:{
//                 month_year_profileId:{
//                     month:today.getMonth(),
//                     year:today.getFullYear(),
//                     profileId:boughtCourse.course.authorId
//                 }
//             }
//         })
//         const updatedCourse = await prisma.course.update({
//             where:{
//                 id:+req.params.id
//             },
//             data:{
//                 registedStudents:{
//                     increment:1
//                 },
//                 searchRating:{
//                     increment:1
//                 }
//             }
//         })
//         const updatedProfile = await prisma.instructorProfile.update({
//             where:{
//                 id:boughtCourse.course.authorId
//             },
//             data:{
//                 registedStudents:{
//                     increment:1
//                 }
//             }
//         })
//         res.json('Good')
//     } catch (error) {
//         res.json('You already bought the course')
//     }

// })
// Review course
app.post('/:id/review',isAuth, async(req:IGetUserAuthInfoRequest,res)=>{
const {review,reviewMessage,authorName,reviewSubtitle} = req.body
if(!(review==1||review==2||review==3||review==4||review==5)) return res.json(' Something wrong with review')
const course = await prisma.boughtCourse.findUnique({
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
                author:{
                    select:{
                        totalReviews:true,
                        instructorRating:true,
                    }
                }
            }
        }
    }
})
if(course.userId!=req.user.id) return res.json('You are not owner')
if(course.review) return res.json('You have already voted')


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
        },
        searchRating:{
            increment:(review-4)*20
        },
        author:{
            update:{
                totalReviews:{
                    increment:1
                },
                instructorRating:{
                    set:(course.course.author.instructorRating*course.course.author.totalReviews+review)/(course.course.author.totalReviews+1)
                },
            }
        }
    },
})
// const updatedProfile = await pr

res.json('Good')
})




export default app