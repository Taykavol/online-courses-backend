import jwt from 'jsonwebtoken'

function isAuth(req,res,next) {
    const token =req.headers.authorization && req.headers.authorization.split(' ')[1]
    if (!token) return res.json('Missing token')
    jwt.verify(token, 'secret',(error,user)=>{
      if(error) return res.json(error)
      req.user = user
      next()
    })
  }

  function isAdmin(req,res,next) {
    if(req.user.role=="ADMIN") return next()
    res.send('You are not ADMIN')
  }
  export  {isAuth,isAdmin}