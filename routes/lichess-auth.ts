import { Router } from "express";
import jwt from "jsonwebtoken"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()
const simpleOauth = require('simple-oauth2');
const axios = require('axios');

/* Create your lichess OAuth app on https://lichess.org/account/oauth/app/create
 * Homepage URL: http://localhost:8087
 * Callback URL: http://localhost:8087/callback
 */

/* --- Fill in your app config here --- */
const port = 3000;
const clientId = process.env.NODE_ENV == 'production'? 'HiJRdVFcIWpn8yj2':'IKGglix7XImcYLPc'

const clientSecret = process.env.NODE_ENV == 'production'? 'FdEfs81wXkaDfk5osx6ZYN52GTNpEp11':'43nbT0LBFw3UGjUy2eNrPOzWv07Vg0zF'
const redirectUri = `${process.env.FRONTEND_URL}/auth/?provider=lichess`;

/* --- Lichess config --- */
const tokenHost = 'https://oauth.lichess.org';
const authorizePath = '/oauth/authorize';
const tokenPath = '/oauth';
/* --- End of lichess config --- */

const oauth2 = simpleOauth.create({
  client: {
    id: clientId,
    secret: clientSecret,
  },
  auth: {
    tokenHost,
    tokenPath,
    authorizePath,
  },
});


const app = Router();

// Redirect URI: parse the authorization token and ask for the access token
app.get('/callback', async (req, res) => {
  try {
    console.log(req.query.code)
    const result = await oauth2.authorizationCode.getToken({
      code: req.query.code,
      redirect_uri: redirectUri
    });
    console.log('res',result);
    const token = oauth2.accessToken.create(result);
    const userInfo = await getUserInfo(token.token);
    const userEmail = await getUserEmail(token.token);
    const email = userEmail.data.email
    const data = userInfo.data
    console.log(data)
    const {title, id} = data
    console.log('id',id)
    console.log('title',title)
    const user = await prisma.user.findOne({
      where:{
        lichessId:id 
      },
      include:{
        instructorProfile:{
          select:{
            id:true
          }
        },
        boughtCourses:{
          select:{
            courseId:true
          }
        }
      }
    })
    if(!user) {
      let newUser
      if(title=="GM"||title=="IM"||title=="WGM") {
         newUser = await prisma.user.create({
          data:{
            lichessId:id,
            role:"TEACHER",
            instructorProfile:{
              create:{
                title
              }
            }
          },
          select:{
            id:true,
            instructorProfile:{
              select:{
                id:true
              }
            }
          }
        })
        const tokenApp=jwt.sign({
          id:newUser.id,
          role:"TEACHER",
          instructorId:newUser.instructorProfile.id
        },'secret')
        return res.json({email,role:"TEACHER", token:tokenApp})
      } else {
         newUser = await prisma.user.create({
          data:{
            lichessId:id,
            role:"USER"
          },
        })
        const tokenApp=jwt.sign({
          id:newUser.id,
          role:"USER"
        },'secret')
        return res.json({email,role:"USER", token:tokenApp})
      } 
      
    }
    const tokenApp=jwt.sign({
      id:user.id,
      role:user.role,
      instructorId:user.instructorProfile?user.instructorProfile.id:null
    },'secret')
    res.json({email, role:user.role,title, token:tokenApp, courses:user.boughtCourses})

  } catch(error) {
    console.error('Access Token Error', error.message);
    res.status(500).json('Authentication failed');
  }
});

function getUserInfo(token) {
  return axios.get('/api/account', {
    baseURL: 'https://lichess.org/',
    headers: { 'Authorization': 'Bearer ' + token.access_token }
  });
}
function getUserEmail(token) {
    return axios.get('/api/account/email', {
      baseURL: 'https://lichess.org/',
      headers: { 'Authorization': 'Bearer ' + token.access_token }
    });
  }
export default app