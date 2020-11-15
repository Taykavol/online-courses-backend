"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInstructor = exports.isAdmin = exports.isAuth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isAuth(req, res, next) {
    var token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token)
        return res.json('Missing token');
    jsonwebtoken_1.default.verify(token, 'secret', function (error, user) {
        if (error)
            return res.json(error);
        req.user = user;
        next();
    });
}
exports.isAuth = isAuth;
function isAdmin(req, res, next) {
    if (req.user.role == "ADMIN")
        return next();
    res.json('You are not ADMIN');
}
exports.isAdmin = isAdmin;
// function isTeacher(req,res,next) {
//   if(req.user.role=="ADMIN"||req.user.role=="TEACHER") return next()
//   res.json('You are not Teacher')
// }
function isInstructor(req, res, next) {
    if (req.user.instructorId)
        return next();
    res.json('You are not teacher');
}
exports.isInstructor = isInstructor;
//# sourceMappingURL=auth.js.map