import jwt from 'jsonwebtoken'

function isAuth(req,res,next) {
    const token =req.headers.authorization && req.headers.authorization.split(' ')[1]
    if (!token) return res.json('Missing token')
    jwt.verify(token, 'secret',(error,user)=>{
      if(error) return res.json(error)
      req.user = user
      console.log('User',req.user.id)
      next()
    })
  }

  function isAdmin(req,res,next) {
    if(req.user.role=="ADMIN") return next()
    res.json('You are not ADMIN')
  }

  // function isTeacher(req,res,next) {
  //   if(req.user.role=="ADMIN"||req.user.role=="TEACHER") return next()
  //   res.json('You are not Teacher')
  // }

  function isInstructor(req,res,next) {
    if(req.user.instructorId) return next()
    res.json('You are not teacher')
  }
  export  {isAuth,isAdmin,isInstructor}