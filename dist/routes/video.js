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
var app = express_1.Router();
var prisma = new client_1.PrismaClient();
var Vimeo = require('vimeo').Vimeo;
var client = new Vimeo("32d615dc4ca483e433a4bf76192475102dcee8c0", "lNFDTgMihkuv/mrQURmHCtREg4hLqo6K976Gycmv49AC8MY/BhAv5ojdWl1kUbHrWsYwNYSiVqShTmDvrXBS0hc7GgVR3g8Wmpg6coJC8x0Hv07kS21n6g92X+5VJuXS", "8969d11029edcd376c506f0bc444149b");
// app.post('/create',isAuth, async (req:IGetUserAuthInfoRequest,res)=>{
// })
app.delete('/:vimeoId/:courseId', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, videoArray, index, apiCall;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findOne({
                    where: {
                        id: +req.params.courseId
                    },
                    select: {
                        authorId: true,
                        videos: true
                    }
                })];
            case 1:
                course = _a.sent();
                if (req.user.instructorId != course.authorId && req.user.role != "ADMIN")
                    return [2 /*return*/, res.json('Something wrong:(')];
                videoArray = course.videos;
                index = videoArray.findIndex(function (videoId) { return videoId == req.params.vimeoId; });
                if (index == -1)
                    return [2 /*return*/, res.json('is nothing to delete')
                        //  Only admin can do
                    ];
                apiCall = client.request({
                    method: "DELETE",
                    path: "/videos/" + req.params.vimeoId
                }, function (error, body, status_code, headers) { return __awaiter(void 0, void 0, void 0, function () {
                    var videoArray, index, updatedCourse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error) {
                                    console.log('error');
                                    console.log(error);
                                }
                                else {
                                    // console.log('body');
                                    // console.log(body);
                                }
                                console.log('status code');
                                console.log(status_code);
                                if (status_code == 429) {
                                    setTimeout(function () {
                                        apiCall;
                                    }, 1000);
                                }
                                videoArray = course.videos;
                                index = videoArray.findIndex(function (videoId) { return videoId == req.params.vimeoId; });
                                console.log('info', videoArray, index);
                                if (!(index >= 0)) return [3 /*break*/, 2];
                                videoArray.splice(index, 1);
                                console.log(videoArray);
                                return [4 /*yield*/, prisma.course.update({
                                        where: {
                                            id: +req.params.courseId
                                        },
                                        data: {
                                            videos: {
                                                set: videoArray
                                            }
                                        }
                                    })];
                            case 1:
                                updatedCourse = _a.sent();
                                console.log(updatedCourse);
                                _a.label = 2;
                            case 2:
                                res.json('good');
                                return [2 /*return*/];
                        }
                    });
                }); });
                apiCall;
                return [2 /*return*/];
        }
    });
}); });
app.delete('/promo/:vimeoId/:courseId', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, apiCall;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findOne({
                    where: {
                        id: +req.params.courseId
                    },
                    select: {
                        authorId: true,
                        promoVideo: true
                    }
                })];
            case 1:
                course = _a.sent();
                if (req.user.instructorId != course.authorId && req.user.role != "ADMIN")
                    return [2 /*return*/, res.json('Something wrong:(')
                        // const videoArray = course.videos
                        // const index= videoArray.findIndex(videoId => videoId==req.params.vimeoId)
                        // if(index==-1) return res.json('is nothing to delete')
                        //  Only admin can do
                    ];
                apiCall = client.request({
                    method: "DELETE",
                    path: "/videos/" + req.params.vimeoId
                }, function (error, body, status_code, headers) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error) {
                                    console.log('error');
                                    console.log(error);
                                }
                                else {
                                    // console.log('body');
                                    // console.log(body);
                                }
                                console.log('status code');
                                console.log(status_code);
                                if (status_code == 429) {
                                    setTimeout(function () {
                                        apiCall;
                                    }, 100000);
                                }
                                return [4 /*yield*/, prisma.course.update({
                                        where: {
                                            id: +req.params.courseId
                                        },
                                        data: {
                                            promoVideo: {
                                                set: null
                                            }
                                        }
                                    })];
                            case 1:
                                _a.sent();
                                res.json('good');
                                return [2 /*return*/];
                        }
                    });
                }); });
                apiCall;
                return [2 /*return*/];
        }
    });
}); });
app.post('/video/:courseId', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, fetch, size, data, response, jsonInfo, vimeoId, uploadLink, videoArray;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findOne({
                    where: {
                        id: +req.params.courseId
                    },
                    select: {
                        authorId: true,
                        videos: true
                    }
                })];
            case 1:
                course = _a.sent();
                if (req.user.instructorId != course.authorId && req.user.role != "ADMIN")
                    return [2 /*return*/, res.json('Something wrong:(')];
                fetch = require('node-fetch');
                size = req.body.size;
                console.log(size);
                data = {
                    upload: {
                        approach: "tus",
                        size: size
                    },
                    name: "" + req.params.courseId
                };
                return [4 /*yield*/, fetch("https://api.vimeo.com/me/videos", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            Authorization: "Bearer 3e92014e848e2e2cf2be98351cf18204",
                            "Content-Type": "application/json",
                            Accept: "application/vnd.vimeo.*+json;version=3.4"
                        }
                    })];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                jsonInfo = _a.sent();
                if (!jsonInfo.uri) {
                    console.log("Sorry, but request not allows");
                    return [2 /*return*/];
                }
                vimeoId = jsonInfo.uri.split('/')[2];
                uploadLink = jsonInfo.upload.upload_link;
                videoArray = course.videos;
                videoArray.push(vimeoId);
                return [4 /*yield*/, prisma.course.update({
                        where: {
                            id: +req.params.courseId
                        },
                        data: {
                            videos: {
                                set: videoArray
                            }
                        }
                    })];
            case 4:
                _a.sent();
                console.log(vimeoId, uploadLink);
                res.json({ vimeoId: vimeoId, uploadLink: uploadLink });
                return [2 /*return*/];
        }
    });
}); });
app.post('/promo/:courseId', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, fetch, size, data, response, jsonInfo, vimeoId, uploadLink;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.course.findOne({
                    where: {
                        id: +req.params.courseId
                    },
                    select: {
                        authorId: true,
                        videos: true
                    }
                })];
            case 1:
                course = _a.sent();
                if (req.user.instructorId != course.authorId && req.user.role != "ADMIN")
                    return [2 /*return*/, res.json('Something wrong:(')];
                fetch = require('node-fetch');
                size = req.body.size;
                console.log(size);
                data = {
                    upload: {
                        approach: "tus",
                        size: size
                    },
                    name: "Promo" + req.params.courseId
                };
                return [4 /*yield*/, fetch("https://api.vimeo.com/me/videos", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            Authorization: "Bearer 3e92014e848e2e2cf2be98351cf18204",
                            "Content-Type": "application/json",
                            Accept: "application/vnd.vimeo.*+json;version=3.4"
                        }
                    })];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                jsonInfo = _a.sent();
                if (!jsonInfo.uri) {
                    console.log("Sorry, but request not allows");
                    return [2 /*return*/];
                }
                vimeoId = jsonInfo.uri.split('/')[2];
                uploadLink = jsonInfo.upload.upload_link;
                // const videoArray = course.videos
                // videoArray.push(vimeoId)
                // await prisma.course.update({
                //   where:{
                //     id:+req.params.courseId
                //   },
                //   data:{
                //     videos:{
                //      set:videoArray
                //     }
                //   }
                // })
                // console.log(vimeoId,uploadLink)
                return [4 /*yield*/, prisma.course.update({
                        where: {
                            id: +req.params.courseId
                        },
                        data: {
                            promoVideo: {
                                set: vimeoId
                            }
                        }
                    })];
            case 4:
                // const videoArray = course.videos
                // videoArray.push(vimeoId)
                // await prisma.course.update({
                //   where:{
                //     id:+req.params.courseId
                //   },
                //   data:{
                //     videos:{
                //      set:videoArray
                //     }
                //   }
                // })
                // console.log(vimeoId,uploadLink)
                _a.sent();
                res.json({ vimeoId: vimeoId, uploadLink: uploadLink });
                return [2 /*return*/];
        }
    });
}); });
// Teachers
// app.get('/videoadmin/',(req,res)=>{
// })
exports.default = app;
//# sourceMappingURL=video.js.map