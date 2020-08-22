import { Router } from 'express'
import data from '../utils/data'
import course from '../utils/data';
const app = Router()
var Vimeo = require('vimeo').Vimeo;
var client = new Vimeo("32d615dc4ca483e433a4bf76192475102dcee8c0", "lNFDTgMihkuv/mrQURmHCtREg4hLqo6K976Gycmv49AC8MY/BhAv5ojdWl1kUbHrWsYwNYSiVqShTmDvrXBS0hc7GgVR3g8Wmpg6coJC8x0Hv07kS21n6g92X+5VJuXS", "8969d11029edcd376c506f0bc444149b");

// Delete video on vimeo via lesson id only admin

app.delete('/:vimeoId', (req,res)=>{
  //  Only admin can do
    client.request({
        method:"DELETE",
        path:`/videos/${req.params.vimeoId}`
    },(error, body, status_code, headers) => {
        if (error) {
          console.log('error');
          console.log(error);
        } else {
          console.log('body');
          console.log(body);
        }
      
        console.log('status code');
        console.log(status_code);
        console.log('headers');
        console.log(headers);
      })
    res.status(204).json()
})

// Teachers
app.post('/videoadmin/:id',(req,res)=>{
  
})
// app.get('/course/:id', (req,res)=>{
//     const course  = data.find(course=>course.id==+req.params.id)
//     if(!course) return res.json({})
//     res.json(course)
// })

// app.put('/course/:id', (req,res)=>{
//     const curriculum = req.body
//     const courseIndex  = data.findIndex(course=>course.id==+req.params.id)
//     console.log(curriculum)
//     if(courseIndex===-1) return res.status(404).json()
//     data[courseIndex].curriculum = curriculum
//     res.json()
    
// })

export default app
