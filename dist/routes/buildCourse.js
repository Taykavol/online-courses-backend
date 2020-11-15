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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uuid_1 = require("uuid");
var client_1 = require("@prisma/client");
var auth_1 = require("../permissions/auth");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
// const AWS = require('aws-sdk');
// import { s3 } from "aws-sdk";
var multer_1 = __importDefault(require("multer"));
var fileStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/course');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + req.params.id + '.jpg');
    }
});
var storage = multer_1.default.memoryStorage();
var upload2 = multer_1.default({ storage: storage }).single('image');
var upload = multer_1.default({ storage: fileStorage }).single('image');
var promisify = require("util").promisify;
var redis = require('redis');
var redisUrl = 'redis://localhost:6379';
var clientRedis = redis.createClient(redisUrl);
clientRedis.get = promisify(clientRedis.get);
// import redis from 'redis'
// const { promisify } = require("util");
// const redisUrl = 'redis://localhost:6379'
// const client = redis.createClient(redisUrl)
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
// Get all courses sended on verification. 
app.get('/verified', auth_1.isAuth, auth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findMany({
                    where: {
                        status: {
                            equals: "VERIFYING"
                        }
                    }
                })];
            case 1:
                courses = _a.sent();
                res.json(courses);
                return [2 /*return*/];
        }
    });
}); });
//Get all published course for main page
app.get('/published', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var redisCourse, course, courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.path);
                return [4 /*yield*/, clientRedis.get(req.path)];
            case 1:
                redisCourse = _a.sent();
                if (redisCourse) {
                    console.log('FROM REDIS');
                    course = JSON.parse(redisCourse);
                    return [2 /*return*/, res.json(course)];
                }
                console.log('FROM DB');
                return [4 /*yield*/, prisma.course.findMany({
                        where: {
                            status: "PUBLISH"
                        },
                        include: {
                            author: {
                                select: {
                                    teacherName: true,
                                    title: true,
                                    aboutMe: true,
                                    avatar: true,
                                    registedStudents: true,
                                    publishedCourses: true,
                                }
                            }
                        }
                    })
                    // clientRedis.flushall()
                ];
            case 2:
                courses = _a.sent();
                // clientRedis.flushall()
                res.json(courses);
                clientRedis.set(req.path, JSON.stringify(courses), 'EX', 10);
                return [2 /*return*/];
        }
    });
}); });
// Newest
app.get('/newest', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var redisCourse, course, courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, clientRedis.get(req.path)];
            case 1:
                redisCourse = _a.sent();
                if (redisCourse) {
                    console.log('FROM REDIS');
                    course = JSON.parse(redisCourse);
                    return [2 /*return*/, res.json(course)];
                }
                return [4 /*yield*/, prisma.course.findMany({
                        take: 7,
                        include: {
                            author: {
                                select: {
                                    teacherName: true,
                                    title: true,
                                    aboutMe: true,
                                    avatar: true,
                                    registedStudents: true,
                                    publishedCourses: true,
                                }
                            }
                        }
                    })];
            case 2:
                courses = _a.sent();
                res.json(courses);
                clientRedis.set(req.path, JSON.stringify(courses), 'EX', 10);
                return [2 /*return*/];
        }
    });
}); });
// Top
app.get('/top', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findMany({
                    take: 6,
                    include: {
                        author: {
                            select: {
                                teacherName: true,
                                title: true,
                                aboutMe: true,
                                avatar: true,
                                registedStudents: true,
                                publishedCourses: true,
                            }
                        }
                    }
                })];
            case 1:
                courses = _a.sent();
                res.json(courses);
                return [2 /*return*/];
        }
    });
}); });
// Recommended
app.get('/recommended', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findMany({
                    take: 2,
                    include: {
                        author: {
                            select: {
                                teacherName: true,
                                title: true,
                                aboutMe: true,
                                avatar: true,
                                registedStudents: true,
                                publishedCourses: true,
                            }
                        }
                    }
                })];
            case 1:
                courses = _a.sent();
                res.json(courses);
                return [2 /*return*/];
        }
    });
}); });
//Get list of courses
app.get('/all', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses, myCourses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //  clientRedis.flushall()
                if (!req.user.instructorId)
                    return [2 /*return*/, res.json('Finnish')];
                return [4 /*yield*/, clientRedis.get("myCourses" + req.user.instructorId)];
            case 1:
                courses = _a.sent();
                if (courses) {
                    console.log('FROM REDIS');
                    return [2 /*return*/, res.json(JSON.parse(courses))];
                }
                return [4 /*yield*/, prisma.course.findMany({
                        where: {
                            authorId: req.user.instructorId
                        }
                    })];
            case 2:
                myCourses = _a.sent();
                res.json(myCourses);
                clientRedis.set("myCourses" + req.user.instructorId, JSON.stringify(myCourses), 'EX', 10);
                return [2 /*return*/];
        }
    });
}); });
//Get specific course
app.get('/:id', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var redisCourse, course;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, clientRedis.get(req.params.id + "myCourse" + req.user.instructorId)];
            case 1:
                redisCourse = _a.sent();
                if (redisCourse) {
                    console.log('FROM REDIS');
                    return [2 /*return*/, res.json(JSON.parse(redisCourse))];
                }
                return [4 /*yield*/, prisma.course.findOne({
                        where: {
                            id: +req.params.id
                        }
                    })];
            case 2:
                course = _a.sent();
                if (!course)
                    return [2 /*return*/, res.json('Course not found')];
                if (course.authorId != req.user.instructorId && req.user.role != "ADMIN")
                    return [2 /*return*/, res.json('You are not owner')];
                res.json(course);
                clientRedis.set(req.params.id + "myCourse" + req.user.instructorId, JSON.stringify(course), 'EX', 20);
                return [2 /*return*/];
        }
    });
}); });
// Get preview (public, for all)
app.get('/:id/preview', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var redisCourse, course_1, course;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.path);
                return [4 /*yield*/, clientRedis.get(req.path)];
            case 1:
                redisCourse = _a.sent();
                if (redisCourse) {
                    console.log('FROM REDIS');
                    course_1 = JSON.parse(redisCourse);
                    return [2 /*return*/, res.json(course_1)];
                }
                return [4 /*yield*/, prisma.course.findOne({
                        where: {
                            id: +req.params.id
                        },
                        include: {
                            // reviews:{
                            //     select:{
                            //         review:true,
                            //         reviewMessage:true,
                            //         reviewSubtitle:true,
                            //         authorName:true
                            //     }
                            // },
                            author: {
                                select: {
                                    teacherName: true,
                                    title: true,
                                    registedStudents: true,
                                    publishedCourses: true,
                                    aboutMe: true,
                                    avatar: true
                                },
                            }
                        },
                    })];
            case 2:
                course = _a.sent();
                res.json(course);
                clientRedis.set(req.path, JSON.stringify(course), 'EX', 10);
                return [2 /*return*/];
        }
    });
}); });
// Get reviews
app.get('/:id/review', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reviews;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.review.findMany({
                    where: {
                        courseId: +req.params.id
                    },
                    take: 5
                })];
            case 1:
                reviews = _a.sent();
                res.json(reviews);
                return [2 /*return*/];
        }
    });
}); });
// Create course
app.post('/create', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var curriculum, course;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                curriculum = [{ id: uuid_1.v4(), name: "", order: 0, lessons: [{ order: "0", id: uuid_1.v4(), name: "", description: "", video: { duration: "0" }, puzzles: [] }] }];
                return [4 /*yield*/, prisma.course.create({
                        data: {
                            author: {
                                connect: {
                                    id: req.user.instructorId
                                }
                            },
                            curriculum: JSON.stringify(curriculum),
                            reviewStats: {
                                set: [0, 0, 0, 0, 0]
                            },
                            level: {
                                set: [1000, 2900]
                            }
                        },
                    })];
            case 1:
                course = _a.sent();
                res.json(course);
                return [2 /*return*/];
        }
    });
}); });
// Update curriculum
app.put('/:id', auth_1.isAuth, auth_1.isInstructor, isCourseOwner, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, curriculum, lessons, duration, totalPuzzles, updatedCourse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, curriculum = _a.curriculum, lessons = _a.lessons, duration = _a.duration, totalPuzzles = _a.totalPuzzles;
                console.log(curriculum, lessons, duration, totalPuzzles);
                // console.log(curriculum)
                // curriculum=JSON.stringify(curriculum)
                duration = Math.floor(duration);
                return [4 /*yield*/, prisma.course.update({
                        where: {
                            id: +req.params.id
                        },
                        data: {
                            curriculum: {
                                set: curriculum
                            },
                            // curriculum,
                            lessons: {
                                set: lessons
                            },
                            duration: {
                                set: duration
                            },
                            totalPuzzles: {
                                set: totalPuzzles
                            }
                        }
                    })];
            case 1:
                updatedCourse = _b.sent();
                res.json('Ok');
                clientRedis.set(req.params.id + "myCourse" + req.user.instructorId, JSON.stringify(updatedCourse), 'EX', 20);
                return [2 /*return*/];
        }
    });
}); });
// Publish course by Admin
app.put('/publish/:id', auth_1.isAuth, auth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.update({
                    where: {
                        id: +req.params.id
                    },
                    data: {
                        status: {
                            set: "PUBLISH"
                        }
                    }
                })];
            case 1:
                course = _a.sent();
                res.json(course);
                return [2 /*return*/];
        }
    });
}); });
// Sent to verification by user.
app.put('/verifying/:id', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findOne({
                    where: {
                        id: +req.params.id
                    },
                    select: {
                        authorId: true,
                        status: true
                    }
                })];
            case 1:
                course = _a.sent();
                if (!course)
                    return [2 /*return*/, res.json('Course not found')];
                if (course.authorId != req.user.instructorId && req.user.role != "ADMIN")
                    return [2 /*return*/, res.json('You are not owner')];
                if (course.status != "BUILDING")
                    return [2 /*return*/, res.json('The course has no Build status')];
                return [4 /*yield*/, prisma.course.update({
                        where: {
                            id: +req.params.id
                        },
                        data: {
                            status: {
                                set: "VERIFYING"
                            }
                        }
                    })];
            case 2:
                _a.sent();
                res.json('Course is already verifying.');
                return [2 /*return*/];
        }
    });
}); });
// Update photo.
app.patch('/:id/photo', auth_1.isAuth, auth_1.isInstructor, isCourseOwner, upload2, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var s3, AWSKey;
    return __generator(this, function (_a) {
        // var storage = multer.memoryStorage()
        // const {size,file} = req.body
        console.log('Sizer', req.file);
        // const AWS = require("aws-sdk");
        aws_sdk_1.default.config.loadFromPath('./utils/aws/config.json');
        s3 = new aws_sdk_1.default.S3({});
        if (req.course.pictureUri) {
            console.log(req.course.pictureUri);
            s3.deleteObject({
                Bucket: "chess-courses",
                Key: req.course.pictureUri
            }, function (err, data) {
                console.log(err);
                console.log('was deleted');
                console.log(data);
            });
        }
        AWSKey = "course/" + uuid_1.v4() + "image" + req.params.id + ".jpg";
        s3.putObject({
            Body: req.file.buffer,
            Bucket: "chess-courses",
            Key: AWSKey,
            ContentType: "image/jpeg",
            ACL: 'public-read',
            CacheControl: "max-age=2628000"
        }, function (err, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!err) return [3 /*break*/, 1];
                            throw err; // an error occurred
                        case 1: return [4 /*yield*/, prisma.course.update({
                                where: {
                                    id: +req.params.id
                                },
                                data: {
                                    pictureUri: {
                                        set: AWSKey
                                    }
                                }
                            })];
                        case 2:
                            _a.sent();
                            console.log('we are here');
                            res.json({ pictureUri: AWSKey });
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        });
        return [2 /*return*/];
    });
}); });
// Teacher
app.patch('/teacher', auth_1.isAuth, auth_1.isInstructor, upload2, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var s3, teacher, AWSKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // var storage = multer.memoryStorage()
                // const {size,file} = req.body
                console.log('Sizer', req.file);
                // const AWS = require("aws-sdk");
                aws_sdk_1.default.config.loadFromPath('./utils/aws/config.json');
                s3 = new aws_sdk_1.default.S3({});
                return [4 /*yield*/, prisma.instructorProfile.findOne({
                        where: {
                            id: req.user.instructorId
                        },
                        select: {
                            avatar: true
                        }
                    })];
            case 1:
                teacher = _a.sent();
                if (teacher.avatar) {
                    // console.log(req.course.pictureUri)
                    s3.deleteObject({
                        Bucket: "chess-courses",
                        Key: teacher.avatar
                    }, function (err, data) {
                        console.log(err);
                        console.log('was deleted');
                        console.log(data);
                    });
                }
                AWSKey = "teacher/" + uuid_1.v4() + "image" + req.user.instructorId + ".jpg";
                s3.putObject({
                    Body: req.file.buffer,
                    Bucket: "chess-courses",
                    Key: AWSKey,
                    ContentType: "image/jpeg",
                    ACL: 'public-read',
                    CacheControl: "max-age=2628000"
                }, function (err, data) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!err) return [3 /*break*/, 1];
                                    throw err; // an error occurred
                                case 1: return [4 /*yield*/, prisma.instructorProfile.update({
                                        where: {
                                            id: req.user.instructorId
                                        },
                                        data: {
                                            avatar: {
                                                set: AWSKey
                                            }
                                        }
                                    })];
                                case 2:
                                    _a.sent();
                                    res.send("ok");
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
        }
    });
}); });
// Update course info
app.patch('/:id', auth_1.isAuth, auth_1.isInstructor, isCourseOwner, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, subtitle, description, category, level, price, sentences, updatedCourse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, subtitle = _a.subtitle, description = _a.description, category = _a.category, level = _a.level, price = _a.price, sentences = _a.sentences;
                console.log(title, subtitle, description, category, level, price);
                return [4 /*yield*/, prisma.course.update({
                        where: {
                            id: +req.params.id
                        },
                        data: {
                            title: {
                                set: title
                            },
                            subtitle: {
                                set: subtitle
                            },
                            description: {
                                set: description
                            },
                            category: {
                                set: category
                            },
                            level: {
                                set: level
                            },
                            price: {
                                set: +price
                            },
                            sentences: {
                                set: sentences
                            }
                        }
                    })];
            case 1:
                updatedCourse = _b.sent();
                res.json('Ok');
                clientRedis.set(req.params.id + "myCourse" + req.user.instructorId, JSON.stringify(updatedCourse), 'EX', 20);
                return [2 /*return*/];
        }
    });
}); });
function isCourseOwner(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var course;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.course.findOne({
                        where: {
                            id: +req.params.id
                        },
                        select: {
                            authorId: true,
                            pictureUri: true
                        }
                    })];
                case 1:
                    course = _a.sent();
                    if (!course)
                        return [2 /*return*/, res.json('Course not found')];
                    if (course.authorId != req.user.instructorId && req.user.role != "ADMIN")
                        return [2 /*return*/, res.json('You are not owner')];
                    req.course = course;
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = app;
//# sourceMappingURL=buildCourse.js.map