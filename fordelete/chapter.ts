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

  app.get('/chapter/:id',isAuth, async(req,res)=>{

  })

  async function setChapter(req,res,next){

      const user = await prisma.user.findOne({
        where:{
          id:req.user.id
        },
        
      })
      const chapter = await prisma.chapter.findOne({
          where:{
              id:req.params.id 
          }
      })
      if(!chapter) return res.send('There is no chapter')
      req.chapter = chapter
      next()
  }
  async function setUser(req,res,next) {
      const user = await prisma.user.findOne({
          where:{
              id:req.user.id
          },
          include:{
            instructorProfile:true
          }
      })
      if(!user) return res.send('There is no user')
      req.user = user 
      next()
  }

  async function setProfile(req,res,next) {
    const profile = await prisma.instructorProfile.findOne({
      where:{
        
      }
    })
  }

  export default app