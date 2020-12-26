import {Request,Router } from 'express'
import {v4 as uuidv4} from 'uuid'
import {Prisma, PrismaClient} from "@prisma/client" 
import {isAuth, isInstructor , isAdmin} from '../permissions/auth'
// import AWS from "aws-sdk";
import multer from 'multer'

var storage = multer.memoryStorage()
const upload2 = multer({ storage: storage }).single('image')


const app = Router()

export interface IGetUserAuthInfoRequest extends Request {
    user: {
      id,
      instructorId,
      role
    },
    course,
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
// Get all courses sended on verification. 
app.get('/verified', isAuth,isAdmin, async(req,res)=>{
 const courses = await prisma.course.findMany({
     where:{
         status:{
             equals:"VERIFYING"
         },
     },
     include:{
         author:true
     }
 })
 res.json(courses)
})

//Get all published course for main page
app.get('/newest', async (req,res)=>{

    const courses = await prisma.course.findMany({
        where:{
            status:"PUBLISH"
        },
        include:{
            author:{
                select:{
                    id:true,
                    teacherName:true,
                    title:true,
                    aboutMe:true,
                    avatar:true,
                    registedStudents:true,
                    publishedCourses:true,
                }
            },
        },
        // :TODO:improve algorithm
    //     select:{
    //         author:{
    //             select:{
    //                 id:true,
    //                 teacherName:true,
    //                 title:true,
    //                 aboutMe:true,
    //                 avatar:true,
    //                 registedStudents:true,
    //                 publishedCourses:true,
    //             }
    //         },
    //         id:true,
    //         duration:true,
    //         title:true,
    //         price:true,
    //         reviewStats:true,
    //         averageRating:true,
    //         registedStudents:true,
    //         sentences:true,
    //         promoVideo:true
    //     }
    })
    // courses.forEach(course=>{
    //     const curriculum = JSON.parse(JSON.stringify(course.curriculum))
    //     curriculum.forEach(chapter => {
    //         chapter.lessons.forEach(lesson => {
    //           delete lesson.puzzles
    //           if(!lesson.preview) {
    //               delete lesson.video.vimeoId
    //           }
    //       });  
    //     });
    //     course.curriculum = curriculum
    // })
    res.json(courses)
    // clientRedis.set(req.path, JSON.stringify(courses),'EX',10)

})
// Get all published courses of author
app.get('/:authorId/published', async(req,res)=>{
    const courses = await prisma.course.findMany({
        where:{
            status:"PUBLISH",
            authorId:+req.params.authorId
        },
        // select:{
            // author:{
            //     select:{
            //         teacherName:true,
            //         title:true,
            //         aboutMe:true,
            //         avatar:true,
            //         registedStudents:true,
            //         publishedCourses:true,
            //     },
            // },
            // price:true,
            // averageRating:true,
            // title:true,

        // }
    })
    res.json(courses)
})
//Get list of courses for specific instructor
app.get('/all',isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
    const myCourses = await prisma.course.findMany({
       where:{
            authorId:req.user.instructorId
       }
    }) 

    res.json(myCourses)
    // clientRedis.set(`myCourses${req.user.instructorId}`,JSON.stringify(myCourses),'EX', 10)
})
//Get specific course
app.get('/:id', isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{

    const course  = await prisma.course.findUnique({
        where:{
            id:+req.params.id
        }
    })
    if(!course) return res.json('Course not found')
    if(course.authorId!=req.user.instructorId && req.user.role!="ADMIN") return res.json('You are not owner')
    res.json(course)

})
// Get preview (public, for all)
app.get('/:id/preview',async(req,res)=>{
    const course = await prisma.course.findUnique({
        where:{
            id:+req.params.id
        },
        include:{
            author:{
                select:{
                    id:true,
                    teacherName:true,
                    title:true,
                    registedStudents:true,
                    publishedCourses:true,
                    aboutMe:true,
                    avatar:true
                },
            }
        },

    })
    const curriculum = JSON.parse(JSON.stringify(course.curriculum))
    curriculum.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          delete lesson.puzzles
          delete lesson.id
          if(!lesson.preview) {
              delete lesson.video.vimeoId
          }
      });  
    });
    res.json(course)


})
// Get reviews
app.get('/:id/review', async(req,res)=>{
    const reviews = await prisma.review.findMany({
        where:{
            courseId:+req.params.id
        },
        take:5
    })
    res.json(reviews)
})
// Create course
app.post('/create',isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
    // if(!req.user.instructorId) return res.json('You are not teacher')
    // TODO:After prisma will be stable to add this functional, checking for exist course status =='BUILDING'.
    // const buildingCourse = await prisma.course.findFirst({})
    const curriculum = [{id:uuidv4(),name:"",order:0,lessons:[{order:"0",id:uuidv4(),name:"",description:"",video:{duration:"0"},puzzles:[]}]}]
    const course = await prisma.course.create({
        data:{
            author:{
                connect:{
                    id:req.user.instructorId
                }
            },
            curriculum,
            reviewStats:[0,0,0,0,0],
            level:{
                set:[1000,1500]
            },
            description:[{title:'',description:''}]
        },        
    })
    res.json(course)
})
// Update curriculum
app.put('/:id',isAuth,isInstructor,isCourseOwner, async (req:IGetUserAuthInfoRequest,res)=>{
    const data = req.body
    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            ...data
        }
    }) 
    res.json('Ok')
    // clientRedis.set(`${req.params.id}myCourse${req.user.instructorId}`,JSON.stringify(updatedCourse),'EX',20)
})
// Publish course by Admin
app.put('/publish/:id', isAuth,isAdmin, async(req,res)=>{
    const course = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            status:"PUBLISH",
            author:{
                update:{
                    publishedCourses:{
                        increment:1
                    }
                }
            }
        }
    })

    res.json(course)
   })
// Sent to verification by user.
app.put('/verifying/:id', isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
    const course  = await prisma.course.findUnique({
        where:{
            id:+req.params.id
        },
        select:{
            authorId:true,
            status:true
        }
    })
    if(!course) return res.json('Course not found')
    if(!(course.authorId==req.user.instructorId || req.user.role=="ADMIN")) return res.json('You are not owner')
    if(course.status!="BUILDING") return res.json('The course has no Build status')
    await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            status:"VERIFYING"
        }
    })
    res.json('Course is already verifying.')
})
// Update photo.
app.patch('/:id/photo',isAuth,isInstructor,isCourseOwner,upload2, async(req:IGetUserAuthInfoRequest,res)=>{

    const AWS = require("aws-sdk");
    AWS.config.loadFromPath('./utils/aws/config.json')
    const s3 = new AWS.S3({})

    if(req.course.pictureUri)  {
            s3.deleteObject({
                Bucket: "chess-courses",
                Key:req.course.pictureUri
            },(err,data)=>{
                console.log(err)
                console.log('was deleted')
                console.log(data)
            })
    }
    const AWSKey = `course/${uuidv4()}image${req.params.id}.jpg`
    s3.putObject({
        Body: req.file.buffer,
        Bucket: "chess-courses",
        Key: AWSKey,
        ContentType:"image/jpeg",
        ACL: 'public-read',
        CacheControl:"max-age=2628000"
     }, async function(err, data){
        if (err) throw err; // an error occurred
        else  {
            await prisma.course.update({
                where:{
                    id:+req.params.id
                },
                data:{
                  pictureUri:{
                      set:AWSKey
                  }
                }
            })
            res.json({pictureUri:AWSKey});

        }           // successful response
     })
})
// Teacher photo without background
app.patch('/teacher',isAuth,isInstructor,upload2, async(req:IGetUserAuthInfoRequest,res)=>{

    const AWS = require("aws-sdk");

    AWS.config.loadFromPath('./utils/aws/config.json')
    const s3 = new AWS.S3({})
    const teacher = await prisma.instructorProfile.findUnique({
        where:{
            id:req.user.instructorId
        },
        select:{
            avatar:true
        }
    })
    if(teacher.avatar)  {
            s3.deleteObject({
                Bucket: "chess-courses",
                Key:teacher.avatar
            },(err,data)=>{
                console.log(err)
                console.log('was deleted')
                console.log(data)
            })
    }
    const AWSKey = `teacher/${uuidv4()}image${req.user.instructorId}.jpg`
    s3.putObject({
        Body: req.file.buffer,
        Bucket: "chess-courses",
        Key: AWSKey,
        ContentType:"image/jpeg",
        ACL: 'public-read',
        CacheControl:"max-age=2628000"
     }, async function(err, data){
        if (err) throw err; // an error occurred
        else  {
            await prisma.instructorProfile.update({
                where:{
                    id:req.user.instructorId
                },
                data:{
                    avatar: {
                        set:AWSKey
                    }
                }
            })
            res.send("ok");

        }           // successful response
     })
})
// Teacher photo with background
app.patch('/teacher2',isAuth,isInstructor,upload2, async(req:IGetUserAuthInfoRequest,res)=>{
    const AWS = require("aws-sdk");
    AWS.config.loadFromPath('./utils/aws/config.json')
    const s3 = new AWS.S3({})
    const teacher = await prisma.instructorProfile.findUnique({
        where:{
            id:req.user.instructorId
        },
        select:{
            avatarBackground:true,
        }
    })
    if(teacher.avatarBackground)  {
            s3.deleteObject({
                Bucket: "chess-courses",
                Key:teacher.avatarBackground
            },(err,data)=>{
                console.log(err)
                console.log('was deleted')
                console.log(data)
            })
    }
    const AWSKey = `teacher2/${uuidv4()}image${req.user.instructorId}.jpg`
    s3.putObject({
        Body: req.file.buffer,
        Bucket: "chess-courses",
        Key: AWSKey,
        ContentType:"image/jpeg",
        ACL: 'public-read',
        CacheControl:"max-age=2628000"
     }, async function(err, data){
        if (err) throw err; // an error occurred
        else  {
            await prisma.instructorProfile.update({
                where:{
                    id:req.user.instructorId
                },
                data:{
                    avatarBackground:AWSKey
                }
            })
            res.send("ok");
        }           // successful response
     })
})
// Update course info
app.patch('/:id',isAuth,isInstructor,isCourseOwner,async (req:IGetUserAuthInfoRequest,res)=>{
    const data = req.body
    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{ ...data}
    })
    res.json('Ok')
    // clientRedis.set(`${req.params.id}myCourse${req.user.instructorId}`,JSON.stringify(updatedCourse),'EX',20)
})

async function isCourseOwner(req,res,next) {
    const course  = await prisma.course.findUnique({
        where:{
            id:+req.params.id
        },
        select:{
            authorId:true,
            pictureUri:true
        }
    })
    if(!course) return res.json('Course not found')
    if(course.authorId!=req.user.instructorId && req.user.role!="ADMIN") return res.json('You are not owner')
    req.course=course
    next()
} 
export default app

