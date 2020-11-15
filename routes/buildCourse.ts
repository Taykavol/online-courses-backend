import {Request,Router } from 'express'
import {v4 as uuidv4} from 'uuid'
import {PrismaClient} from "@prisma/client" 
import {isAuth, isInstructor , isAdmin} from '../permissions/auth'
import AWS from "aws-sdk";
// const AWS = require('aws-sdk');

// import { s3 } from "aws-sdk";

import multer from 'multer'

const fileStorage = multer.diskStorage({
    destination(req,file,cb) {
        cb(null,'public/images/course')
    },
    filename(req,file,cb) {
        cb(null,file.fieldname+req.params.id+'.jpg')
    }
})

var storage = multer.memoryStorage()
const upload2 = multer({ storage: storage }).single('image')
const upload = multer({ storage: fileStorage }).single('image')


// const { promisify } = require("util");
// const redis = require('redis')
// const redisUrl = 'redis://localhost:6379'
// const clientRedis = redis.createClient(redisUrl)
// clientRedis.get = promisify(clientRedis.get)
// import redis from 'redis'
// const { promisify } = require("util");
// const redisUrl = 'redis://localhost:6379'
// const client = redis.createClient(redisUrl)

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
         }
     }
 })
 res.json(courses)
})
//Get all published course for main page
app.get('/published', async(req,res)=>{
    console.log(req.path)
    
    // client.set('chess','noname',console.log)
    
    // prisma.$use(async (params, next)=>{
    //  clientRedis.flushall()

    //   const redisCourse = await clientRedis.get(req.path)
    //   if(redisCourse) {
    //     console.log('FROM REDIS')
    //     const course:JSON = JSON.parse(redisCourse)
    //     return res.json(course)
    //   } 
    //   console.log('FROM DB')

    const courses = await prisma.course.findMany({
        where:{
            status:"PUBLISH"
        },
        include:{
            author:{
                select:{
                    teacherName:true,
                    title:true,
                    aboutMe:true,
                    avatar:true,
                    registedStudents:true,
                    publishedCourses:true,
                }
            }
        }
    })
    // clientRedis.flushall()
    
    res.json(courses) 
    // clientRedis.set(req.path, JSON.stringify(courses),'EX',10)
    
    // res.json(courses) 
    // client.set('courses', JSON.stringify(courses))
})
// Newest
app.get('/newest', async (req,res)=>{
    // const redisCourse = await clientRedis.get(req.path)
    //   if(redisCourse) {
    //     console.log('FROM REDIS')
    //     const course:JSON = JSON.parse(redisCourse)
    //     return res.json(course)
    //   } 
    const courses = await prisma.course.findMany({
        take:7,
        include:{
            author:{
                select:{
                    teacherName:true,
                    title:true,
                    aboutMe:true,
                    avatar:true,
                    registedStudents:true,
                    publishedCourses:true,
                }
            }
        }
    })
    res.json(courses)
    // clientRedis.set(req.path, JSON.stringify(courses),'EX',10)

})
// Top
app.get('/top', async (req,res)=>{
    const courses = await prisma.course.findMany({
        take:6,
        include:{
            author:{
                select:{
                    teacherName:true,
                    title:true,
                    aboutMe:true,
                    avatar:true,
                    registedStudents:true,
                    publishedCourses:true,
                }
            }
        }
    })
    res.json(courses)
})
// Recommended
app.get('/recommended', async (req,res)=>{
    const courses = await prisma.course.findMany({
        take:2,
        include:{
            author:{
                select:{
                    teacherName:true,
                    title:true,
                    aboutMe:true,
                    avatar:true,
                    registedStudents:true,
                    publishedCourses:true,
                }
            }
        }
    })
    res.json(courses)
})
//Get list of courses
app.get('/all',isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
    //  clientRedis.flushall()
    // if(!req.user.instructorId) return res.json('Finnish')
    // const courses = await clientRedis.get(`myCourses${req.user.instructorId}`)
    // if(courses)  {
    //     console.log('FROM REDIS')
    //     return res.json(JSON.parse(courses))
    // }
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
    // const redisCourse = await clientRedis.get(`${req.params.id}myCourse${req.user.instructorId}`)
    // if(redisCourse) {
    //     console.log('FROM REDIS')
    //     return res.json(JSON.parse(redisCourse)) 
    // }
    const course  = await prisma.course.findOne({
        where:{
            id:+req.params.id
        }
    })
    if(!course) return res.json('Course not found')
    if(course.authorId!=req.user.instructorId && req.user.role!="ADMIN") return res.json('You are not owner')
    // res.json(course)
    // clientRedis.set(`${req.params.id}myCourse${req.user.instructorId}`,JSON.stringify(course),'EX',20)

})
// Get preview (public, for all)
app.get('/:id/preview',async(req,res)=>{
    // console.log(req.path)
    // const redisCourse = await clientRedis.get(req.path)
    //   if(redisCourse) {
    //     console.log('FROM REDIS')
    //     const course:JSON = JSON.parse(redisCourse)
    //     return res.json(course)
    //   } 
    // const redisCourse = await clientRedis.get(`coursePreview${req.params.id}`)
    // if(redisCourse) {
    //     console.log('FROM REDIS')
    //     return res.json(JSON.parse(redisCourse)) 
    // }
    const course = await prisma.course.findOne({
        where:{
            id:+req.params.id
        },
        include:{
            // reviews:{
            //     select:{
            //         review:true,
            //         reviewMessage:true,
            //         reviewSubtitle:true,
            //         authorName:true
            //     }
            // },
            author:{
                select:{
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
    res.json(course)
    // clientRedis.set(req.path, JSON.stringify(course),'EX',10)

    // clientRedis.set(`coursePreview${req.params.id}`,JSON.stringify(course),'EX',20)

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
            curriculum: JSON.stringify(curriculum),
            reviewStats:{
                set:[0,0,0,0,0]
            },
            level:{
                set:[1000,2900]
            }
        },        
    })
    res.json(course)
})
// Update curriculum
app.put('/:id',isAuth,isInstructor,isCourseOwner, async (req:IGetUserAuthInfoRequest,res)=>{
    
    let {curriculum,lessons,duration,totalPuzzles} = req.body
    console.log(curriculum,lessons,duration,totalPuzzles)
    // console.log(curriculum)
    // curriculum=JSON.stringify(curriculum)
    duration= Math.floor(duration)
    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            curriculum:{
                set:curriculum
            },
            // curriculum,
            lessons:{
                set:lessons
            },
            duration:{
                set:duration
            },
            totalPuzzles:{
                set:totalPuzzles
            }
        }
    }) 
    res.json('Ok')
    clientRedis.set(`${req.params.id}myCourse${req.user.instructorId}`,JSON.stringify(updatedCourse),'EX',20)
    
})
// Publish course by Admin
app.put('/publish/:id', isAuth,isAdmin, async(req,res)=>{
    const course = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            status:{
                set:"PUBLISH"
            }
        }
    })
    res.json(course)
   })
// Sent to verification by user.
app.put('/verifying/:id', isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
    const course  = await prisma.course.findOne({
        where:{
            id:+req.params.id
        },
        select:{
            authorId:true,
            status:true
        }
    })
    if(!course) return res.json('Course not found')
    if(course.authorId!=req.user.instructorId && req.user.role!="ADMIN") return res.json('You are not owner')
    if(course.status!="BUILDING") return res.json('The course has no Build status')
    await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            status:{
                set:"VERIFYING"
            }
        }
    })
    res.json('Course is already verifying.')
})
// Update photo.
app.patch('/:id/photo',isAuth,isInstructor,isCourseOwner,upload2, async(req:IGetUserAuthInfoRequest,res)=>{

    // var storage = multer.memoryStorage()
    // const {size,file} = req.body
    console.log('Sizer',req.file)
    // const AWS = require("aws-sdk");

    AWS.config.loadFromPath('./utils/aws/config.json')
    const s3 = new AWS.S3({})

    if(req.course.pictureUri)  {
        console.log(req.course.pictureUri)
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
            console.log('we are here')
            res.json({pictureUri:AWSKey});

        }           // successful response
     })
})
// Teacher
app.patch('/teacher',isAuth,isInstructor,upload2, async(req:IGetUserAuthInfoRequest,res)=>{

    // var storage = multer.memoryStorage()
    // const {size,file} = req.body
    console.log('Sizer',req.file)
    // const AWS = require("aws-sdk");

    AWS.config.loadFromPath('./utils/aws/config.json')
    const s3 = new AWS.S3({})
    const teacher = await prisma.instructorProfile.findOne({
        where:{
            id:req.user.instructorId
        },
        select:{
            avatar:true
        }
    })
    if(teacher.avatar)  {
        // console.log(req.course.pictureUri)
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
// Update course info
app.patch('/:id',isAuth,isInstructor,isCourseOwner,async (req:IGetUserAuthInfoRequest,res)=>{
    
    let {title,subtitle,description,category,level,price,sentences } = req.body
    console.log(title,subtitle,description,category,level,price)
    // let imageUrl
    // if(req.file)
    // imageUrl = req.file.path
    // console.log(imageUrl)
    const updatedCourse = await prisma.course.update({
        where:{
            id:+req.params.id
        },
        data:{
            title:{
                set:title
            },
            subtitle:{
                set:subtitle
            },
            description:{
                set:description
            },
            category:{
                set:category
            },
            level:{
                set:level
            },
            price:{
                set:+price
            },
            sentences:{
                set:sentences
            }
        }
    })
    res.json('Ok')
    clientRedis.set(`${req.params.id}myCourse${req.user.instructorId}`,JSON.stringify(updatedCourse),'EX',20)
})

async function isCourseOwner(req,res,next) {
    const course  = await prisma.course.findOne({
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

