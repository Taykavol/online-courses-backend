"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("@prisma/client");
var auth_1 = require("../permissions/auth");
var promisify = require("util").promisify;
var redis = require('redis');
var redisUrl = 'redis://localhost:6379';
var clientRedis = redis.createClient(redisUrl);
clientRedis.get = promisify(clientRedis.get);
clientRedis.hmget = promisify(clientRedis.hmget);
var app = express_1.Router();
var prisma = new client_1.PrismaClient();
app.get('/invoice', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var invoice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.invoice.findMany({
                    where: {
                        profileId: req.user.instructorId,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 3,
                })];
            case 1:
                invoice = _a.sent();
                res.json(invoice);
                return [2 /*return*/];
        }
    });
}); });
app.get('/all', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.order.findMany({
                    where: {
                        sellerId: req.user.instructorId,
                    },
                    select: {
                        price: true,
                        course: {
                            select: {
                                title: true
                            }
                        },
                        buyer: {
                            select: {
                                email: true,
                                lichessId: true
                            }
                        },
                        createdAt: true
                    },
                    take: 10,
                    orderBy: {
                        createdAt: "desc"
                    }
                })
                // const monthRevenue = await prisma.order.aggregate({
                //     where:{
                //         sellerId:req.user.instructorId,
                //         createdAt:{
                //             gte: new Date(`${todayMonth} 1, ${todayYear}`),
                //             lte: new Date(`${(todayMonth)%12+1} 1, ${(todayMonth)%12+1>todayMonth?todayYear:todayYear+1}`)
                //         }
                //     },
                //     sum:{
                //         price:true
                //     }
                // })
                // const totalRevenue = await prisma.order.aggregate({
                //     where:{
                //         sellerId:req.user.instructorId
                //     },
                //     sum:{
                //         price:true
                //     }
                // })
                // const totalStudents = await prisma.order.count({
                //     where:{
                //         sellerId:req.user.instructorId
                //     }
                // })
                // const totalMax
                // console.log(totalStudents)
                // if(!orders) return res.json('User not found')
            ];
            case 1:
                orders = _a.sent();
                // const monthRevenue = await prisma.order.aggregate({
                //     where:{
                //         sellerId:req.user.instructorId,
                //         createdAt:{
                //             gte: new Date(`${todayMonth} 1, ${todayYear}`),
                //             lte: new Date(`${(todayMonth)%12+1} 1, ${(todayMonth)%12+1>todayMonth?todayYear:todayYear+1}`)
                //         }
                //     },
                //     sum:{
                //         price:true
                //     }
                // })
                // const totalRevenue = await prisma.order.aggregate({
                //     where:{
                //         sellerId:req.user.instructorId
                //     },
                //     sum:{
                //         price:true
                //     }
                // })
                // const totalStudents = await prisma.order.count({
                //     where:{
                //         sellerId:req.user.instructorId
                //     }
                // })
                // const totalMax
                // console.log(totalStudents)
                // if(!orders) return res.json('User not found')
                res.json(orders);
                return [2 /*return*/];
        }
    });
}); });
// app.get('/revenuethismonth',isAuth,isInstructor,async(req:IGetUserAuthInfoRequest,res)=>{
//     const today = new Date()
//     const todayMonth = today.getMonth()+1
//     const todayYear = today.getFullYear()
//     const revenueThisMonth = await prisma.order.aggregate({
//         where:{
//             sellerId:req.user.instructorId,
//             createdAt:{
//                 gte: new Date(`${todayMonth} 1, ${todayYear}`),
//                 lte: new Date(`${(todayMonth)%12+1} 1, ${(todayMonth)%12+1>todayMonth?todayYear:todayYear+1}`)
//             }
//         },
//         sum:{
//             price:true
//         }
//     })
//     res.json(revenueThisMonth)
// })
// app.get('/revenue')
exports.default = app;
//# sourceMappingURL=order.js.map