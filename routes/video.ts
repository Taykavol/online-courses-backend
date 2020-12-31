import { Router } from 'express'
import {PrismaClient} from "@prisma/client"
import {isAuth, isAdmin,isInstructor} from '../permissions/auth'
import { Request } from "express"
// import Axios from 'axios'
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id,
    role,
    instructorId
  } // or any other type
}

const app = Router()
const prisma = new PrismaClient()


// Delete video from course
app.delete('/:vimeoId/:courseId',isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
  var Vimeo = require('vimeo').Vimeo;
  var client = new Vimeo("32d615dc4ca483e433a4bf76192475102dcee8c0", "lNFDTgMihkuv/mrQURmHCtREg4hLqo6K976Gycmv49AC8MY/BhAv5ojdWl1kUbHrWsYwNYSiVqShTmDvrXBS0hc7GgVR3g8Wmpg6coJC8x0Hv07kS21n6g92X+5VJuXS", "8969d11029edcd376c506f0bc444149b");
  const course = await prisma.course.findUnique({
    where:{
      id:+req.params.courseId
    },
    select:{
      authorId:true,
      videos:true
    }
  })

  if(req.user.instructorId!=course.authorId && req.user.role!="ADMIN") return res.json('Something wrong:(')

  const videoArray = course.videos
  const index= videoArray.findIndex(videoId => videoId==req.params.vimeoId)
  if(index==-1) return res.json('is nothing to delete')
  //  Only admin can do
  const apiCall =  client.request({
        method:"DELETE",
        path:`/videos/${req.params.vimeoId}`
    }, async (error, body, status_code, headers) => {
        if (error) {
          console.log('error');
          console.log(error);
        } else {
          // console.log('body');
          // console.log(body);
        }
        console.log('status code');
        console.log(status_code);
        if(status_code == 429) {
          setTimeout(()=>{
            apiCall
          },1000)
        }

        const videoArray = course.videos
        const index= videoArray.findIndex(videoId => videoId==req.params.vimeoId)
        if(index>=0) {
          videoArray.splice(index,1)
          const updatedCourse = await prisma.course.update({
            where:{
              id:+req.params.courseId
            },
            data:{
              videos:{
              set:videoArray
              }
            }
          })
        }
        res.json('good')
      })
      apiCall
      

    
})

app.delete('/promo/:vimeoId/:courseId',isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
  var Vimeo = require('vimeo').Vimeo;
  var client = new Vimeo(process.env.VIMEO_CLIENT, process.env.VIMEO_SECRET, process.env.VIMEO_ACCESS_TOKEN_DELETE_SCOPE);

  const course = await prisma.course.findUnique({
    where:{
      id:+req.params.courseId
    },
    select:{
      authorId:true,
      promoVideo:true,
      // status:true
    }
  })
  if(req.user.instructorId!=course.authorId && req.user.role!="ADMIN") return res.json('Something wrong:(')
  // if(course.status!="BUILDING"&&req.user.role!='ADMIN') return res.json({error:"You have no right to edit."})

  // const videoArray = course.videos
  // const index= videoArray.findIndex(videoId => videoId==req.params.vimeoId)
  // if(index==-1) return res.json('is nothing to delete')
  //  Only admin can do
  const apiCall =  client.request({
        method:"DELETE",
        path:`/videos/${req.params.vimeoId}`
    }, async (error, body, status_code, headers) => {
        if (error) {
          console.log('error');
          console.log(error);
        } else {
          // console.log('body');
          // console.log(body);
        }
        console.log('status code');
        console.log(status_code);
        if(status_code == 429) {
          setTimeout(()=>{
            apiCall
          },100000)
        }

         await prisma.course.update({
              where:{
                id:+req.params.courseId
              },
              data:{
                promoVideo:{
                set:null
                }
              }
            })
        res.json('good')
      })
      apiCall
})

app.post('/video/:courseId',isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
  const {size,updateKey} = req.body 
  const course = await prisma.course.findUnique({
    where:{
      id:+req.params.courseId
    },
    select:{
      authorId:true,
      videos:true,
      updateKey:true
    }
  })
  console.log(updateKey,course.updateKey)
  if(updateKey!=course.updateKey) return res.json({error:"Update mistake"})
  if(req.user.instructorId!=course.authorId && req.user.role!="ADMIN") return res.json('Something wrong:(')
  const fetch = require('node-fetch');
  let data = {
    upload: {
      approach: "tus",
      size
    },
    name:`Co${req.params.courseId}rse`
  };
  const response = await fetch("https://api.vimeo.com/me/videos", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN_UPLOAD_SCOPE}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.vimeo.*+json;version=3.4"
    }
  });
  const jsonInfo = await response.json();
      if (!jsonInfo.uri) {
        return res.json('Try later');
      }
  const vimeoId = jsonInfo.uri.split('/')[2]
  const uploadLink = jsonInfo.upload.upload_link
  const videoArray = course.videos
  videoArray.push(vimeoId)
  await prisma.course.update({
    where:{
      id:+req.params.courseId
    },
    data:{
      videos:{
       set:videoArray
      }
    }
  })
  res.json({vimeoId,uploadLink})

})

app.post('/promo/:courseId',isAuth,isInstructor, async (req:IGetUserAuthInfoRequest,res)=>{
  const course = await prisma.course.findUnique({
    where:{
      id:+req.params.courseId
    },
    select:{
      authorId:true,
      videos:true
    }
  })

  if(req.user.instructorId!=course.authorId && req.user.role!="ADMIN") return res.json('Something wrong:(')
  const fetch = require('node-fetch');
  const {size} = req.body 
  console.log(size)
  let data = {
    upload: {
      approach: "tus",
      size
    },
    name:`Pr${req.params.courseId}omo`
  };
  const response = await fetch("https://api.vimeo.com/me/videos", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN_UPLOAD_SCOPE}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.vimeo.*+json;version=3.4"
    }
  });
  const jsonInfo = await response.json();
      if (!jsonInfo.uri) {
        return res.json('Try later');
      }
  const vimeoId = jsonInfo.uri.split('/')[2]
  const uploadLink = jsonInfo.upload.upload_link
  await prisma.course.update({
    where:{
      id:+req.params.courseId
    },
    data:{
      promoVideo:{
        set:vimeoId
      }
    }
  })
  res.json({vimeoId,uploadLink})
})


export default app
