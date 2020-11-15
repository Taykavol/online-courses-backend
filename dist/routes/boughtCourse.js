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
var app = express_1.Router();
var prisma = new client_1.PrismaClient();
prisma.$use(function (params, next) { return __awaiter(void 0, void 0, void 0, function () {
    var before, result, after;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                before = Date.now();
                return [4 /*yield*/, next(params)];
            case 1:
                result = _a.sent();
                after = Date.now();
                console.log("Query " + params.model + "." + params.action + " took " + (after - before) + "ms");
                return [2 /*return*/, result];
        }
    });
}); });
//Get bought courses
app.get('/all', auth_1.isAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var redisCourse, course, boughtCourse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, clientRedis.get("" + req.user.id + req.path)];
            case 1:
                redisCourse = _a.sent();
                console.log(redisCourse);
                if (redisCourse) {
                    console.log('FROM REDIS');
                    course = JSON.parse(redisCourse);
                    return [2 /*return*/, res.json(course)];
                }
                return [4 /*yield*/, prisma.boughtCourse.findMany({
                        where: {
                            userId: req.user.id
                        },
                        select: {
                            course: {
                                select: {
                                    id: true,
                                    title: true,
                                    subtitle: true,
                                    category: true,
                                    lessons: true,
                                    duration: true,
                                    pictureUri: true,
                                    curriculum: true,
                                    author: {
                                        select: {
                                            teacherName: true,
                                            title: true,
                                            avatar: true
                                        }
                                    }
                                }
                            },
                            progress: true,
                            progressOfLessons: true,
                            progressOfPuzzles: true,
                            reviewId: true,
                            id: true,
                        }
                    })
                    // await prisma.boughtCourse.
                    // const user = await prisma.user.findOne({
                    //     where:{
                    //         id:req.user.id
                    //     },
                    //     include:{
                    //         boughtCourses:{
                    //             select:{
                    //                 course:{
                    //                     select:{
                    //                         title:true,
                    //                         subtitle:true,
                    //                         category:true,
                    //                         lessons:true,
                    //                         duration:true,
                    //                         author:{
                    //                             select:{
                    //                                 teacherName:true,
                    //                                 title:true
                    //                             }
                    //                         }
                    //                     }
                    //                 },
                    //                 progress:true,
                    //                 review:true,
                    //                 id:true,
                    //             }
                    //         }
                    //     }
                    // })
                    // if(!user) return res.json('User not found')
                ];
            case 2:
                boughtCourse = _a.sent();
                // await prisma.boughtCourse.
                // const user = await prisma.user.findOne({
                //     where:{
                //         id:req.user.id
                //     },
                //     include:{
                //         boughtCourses:{
                //             select:{
                //                 course:{
                //                     select:{
                //                         title:true,
                //                         subtitle:true,
                //                         category:true,
                //                         lessons:true,
                //                         duration:true,
                //                         author:{
                //                             select:{
                //                                 teacherName:true,
                //                                 title:true
                //                             }
                //                         }
                //                     }
                //                 },
                //                 progress:true,
                //                 review:true,
                //                 id:true,
                //             }
                //         }
                //     }
                // })
                // if(!user) return res.json('User not found')
                res.json(boughtCourse);
                clientRedis.set("" + req.user.id + req.path, JSON.stringify(boughtCourse), 'EX', 10);
                return [2 /*return*/];
        }
    });
}); });
// Get 1 course
app.get('/:id', auth_1.isAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var boughtCourse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.boughtCourse.findOne({
                    where: {
                        id: +req.params.id
                    },
                    select: {
                        course: {
                            select: {
                                title: true,
                                curriculum: true,
                                duration: true,
                                totalPuzzles: true,
                                author: {
                                    select: {
                                        teacherName: true,
                                        title: true,
                                        avatar: true
                                    }
                                }
                            }
                        },
                        userId: true,
                        progressOfLessons: true,
                        progressOfPuzzles: true,
                    }
                })];
            case 1:
                boughtCourse = _a.sent();
                if (req.user.id == boughtCourse.userId)
                    return [2 /*return*/, res.json(boughtCourse)];
                res.json('You are not owner');
                return [2 /*return*/];
        }
    });
}); });
app.patch('/:id', auth_1.isAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, progressOfLessons, progressOfPuzzles, progress, boughtCourse, updatedCourse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, progressOfLessons = _a.progressOfLessons, progressOfPuzzles = _a.progressOfPuzzles, progress = _a.progress;
                console.log(progressOfLessons, progressOfPuzzles);
                return [4 /*yield*/, prisma.boughtCourse.findOne({
                        where: {
                            id: +req.params.id
                        },
                        select: {
                            userId: true,
                        }
                    })];
            case 1:
                boughtCourse = _b.sent();
                if (req.user.id != boughtCourse.userId)
                    return [2 /*return*/, res.json('You are now owner.')];
                return [4 /*yield*/, prisma.boughtCourse.update({
                        where: {
                            id: +req.params.id
                        },
                        data: {
                            progressOfLessons: {
                                set: progressOfLessons
                            },
                            progressOfPuzzles: {
                                set: progressOfPuzzles
                            },
                            progress: {
                                set: progress
                            }
                        }
                    })];
            case 2:
                updatedCourse = _b.sent();
                res.send('Ok');
                return [2 /*return*/];
        }
    });
}); });
// Buy course
app.post('/:id', auth_1.isAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, boughtCourse, order, today, invoice, updatedCourse, updatedProfile, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findOne({
                    where: {
                        id: req.user.id
                    },
                    include: {
                        instructorProfile: {
                            select: {
                                myCourses: true
                            }
                        }
                    }
                    // include:{
                    //     boughtCourses:{
                    //         select:{
                    //             courseId:true
                    //         }
                    //     }
                    // }
                })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.json('User not found')];
                if (user.instructorProfile) {
                    if (user.instructorProfile.myCourses.find(function (course) { return course.id == +req.params.id; })) {
                        return [2 /*return*/, res.status(502).end()];
                    }
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 8, , 9]);
                return [4 /*yield*/, prisma.boughtCourse.create({
                        data: {
                            user: {
                                connect: {
                                    id: user.id
                                }
                            },
                            course: {
                                connect: {
                                    id: +req.params.id
                                }
                            }
                        },
                        include: {
                            course: {
                                select: {
                                    author: {
                                        select: {
                                            profit: true,
                                        },
                                    },
                                    authorId: true,
                                    price: true,
                                },
                            }
                        }
                    })
                    // clientRedis.del(`coursesAll${req.user.id}`)
                ];
            case 3:
                boughtCourse = _a.sent();
                return [4 /*yield*/, prisma.order.create({
                        data: {
                            course: {
                                connect: {
                                    id: +req.params.id
                                }
                            },
                            buyer: {
                                connect: {
                                    id: user.id
                                }
                            },
                            seller: {
                                connect: {
                                    id: boughtCourse.course.authorId
                                }
                            },
                            price: boughtCourse.course.price
                        }
                    })];
            case 4:
                order = _a.sent();
                today = new Date();
                return [4 /*yield*/, prisma.invoice.upsert({
                        create: {
                            month: today.getMonth(),
                            year: today.getFullYear(),
                            profile: {
                                connect: {
                                    id: boughtCourse.course.authorId
                                },
                            },
                            total: boughtCourse.course.price * boughtCourse.course.author.profit
                        },
                        update: {
                            total: {
                                increment: boughtCourse.course.price * boughtCourse.course.author.profit
                            }
                        },
                        where: {
                            month_year_profileId: {
                                month: today.getMonth(),
                                year: today.getFullYear(),
                                profileId: boughtCourse.course.authorId
                            }
                        }
                    })];
            case 5:
                invoice = _a.sent();
                return [4 /*yield*/, prisma.course.update({
                        where: {
                            id: +req.params.id
                        },
                        data: {
                            registedStudents: {
                                increment: 1
                            }
                        }
                    })];
            case 6:
                updatedCourse = _a.sent();
                return [4 /*yield*/, prisma.instructorProfile.update({
                        where: {
                            id: boughtCourse.course.authorId
                        },
                        data: {
                            registedStudents: {
                                increment: 1
                            }
                        }
                    })];
            case 7:
                updatedProfile = _a.sent();
                res.json('Good');
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                res.json('You already bought the course');
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// Review course
app.post('/:id/review', auth_1.isAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, _a, review, reviewMessage, authorName, reviewSubtitle, avgRating, newReview, updatedCourse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, prisma.boughtCourse.findOne({
                    where: {
                        id: +req.params.id
                    },
                    select: {
                        userId: true,
                        review: true,
                        courseId: true,
                        course: {
                            select: {
                                reviewStats: true,
                            }
                        }
                    }
                })];
            case 1:
                course = _b.sent();
                if (course.userId != req.user.id)
                    return [2 /*return*/, res.json('You are not owner')];
                if (course.review)
                    return [2 /*return*/, res.json('You have already voted')];
                _a = req.body, review = _a.review, reviewMessage = _a.reviewMessage, authorName = _a.authorName, reviewSubtitle = _a.reviewSubtitle;
                course.course.reviewStats[review - 1]++;
                avgRating = course.course.reviewStats.reduce(function (acc, val, index) { return acc + val * (index + 1); }) / course.course.reviewStats.reduce(function (acc, val) { return acc + val; });
                return [4 /*yield*/, prisma.review.create({
                        data: {
                            review: review,
                            reviewMessage: reviewMessage,
                            authorName: authorName,
                            reviewSubtitle: reviewSubtitle,
                            course: {
                                connect: {
                                    id: course.courseId
                                },
                            },
                            boughtCourse: {
                                connect: {
                                    id: +req.params.id
                                }
                            }
                        }
                    })];
            case 2:
                newReview = _b.sent();
                return [4 /*yield*/, prisma.course.update({
                        where: {
                            id: course.courseId
                        },
                        data: {
                            reviewStats: {
                                set: course.course.reviewStats
                            },
                            averageRating: {
                                set: avgRating
                            }
                        }
                    })];
            case 3:
                updatedCourse = _b.sent();
                res.json('Good');
                return [2 /*return*/];
        }
    });
}); });
// Get review
app.get('');
exports.default = app;
//# sourceMappingURL=boughtCourse.js.map