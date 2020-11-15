"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var client_1 = require("@prisma/client");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var auth_1 = require("../permissions/auth");
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
app.get('/users', auth_1.isAuth, auth_1.isAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findMany()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); });
app.get('/profile', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.instructorProfile.findOne({
                    where: {
                        id: req.user.instructorId
                    },
                    include: {
                        myCourses: true
                    }
                })];
            case 1:
                profile = _a.sent();
                res.json(__assign({}, profile));
                return [2 /*return*/];
        }
    });
}); });
app.get('/publicprofile/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.instructorProfile.findOne({
                    where: {
                        id: +req.params.id
                    },
                    select: {
                        registedStudents: true,
                        teacherName: true,
                        title: true,
                        avatar: true,
                        aboutMe: true
                    }
                })];
            case 1:
                profile = _a.sent();
                res.json(profile);
                return [2 /*return*/];
        }
    });
}); });
// app.get('/publicprofileofcourse/:id', async(req,res)=>{
//   const publicprofile = await prisma.instructorProfile.findOne({
//     where:{
//       id
//     }
//   })
// })
app.post('/profile', auth_1.isAuth, auth_1.isInstructor, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profileData, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                profileData = req.body;
                console.log(profileData);
                return [4 /*yield*/, prisma.instructorProfile.update({
                        where: {
                            id: req.user.instructorId
                        },
                        data: {
                            // TODO:Must be
                            // ...profileData
                            // bad
                            teacherName: {
                                set: profileData.teacherName
                            },
                            aboutMe: {
                                set: profileData.aboutMe
                            }
                            // avatar:{
                            //   set:profileData.avatar
                            // },
                            // title:{
                            //   set:profileData.title
                            // }
                        }
                    })];
            case 1:
                profile = _a.sent();
                console.log(profile.teacherName);
                res.json("ok");
                return [2 /*return*/];
        }
    });
}); });
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, id, role, isMatch, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password)
                    return [2 /*return*/, res.json('Info not enough')];
                return [4 /*yield*/, prisma.user.findOne({
                        where: {
                            email: email
                        },
                        include: {
                            instructorProfile: true
                        }
                    })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.json({ error: 'Email or password are incorrect' })];
                id = user.id;
                role = user.role;
                console.log(role);
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                isMatch = _b.sent();
                console.log(isMatch);
                if (!isMatch)
                    return [2 /*return*/, res.json('Password incorrect')];
                token = jsonwebtoken_1.default.sign({ id: id, role: role, instructorId: user.instructorProfile.id }, 'secret');
                res.json({ token: token, user: { role: role, email: email } });
                return [2 /*return*/];
        }
    });
}); });
app.post("/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, isUserExist, hashedPassword, _b, id, role, token;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                console.log(email, password);
                if (!email || !password)
                    return [2 /*return*/, res.json('Info not enough')];
                return [4 /*yield*/, prisma.user.findOne({
                        where: {
                            email: email
                        }
                    })];
            case 1:
                isUserExist = _c.sent();
                if (isUserExist)
                    return [2 /*return*/, res.json('User with this email exists')];
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _c.sent();
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: email,
                            password: hashedPassword,
                            role: "USER"
                        }
                    })];
            case 3:
                _b = _c.sent(), id = _b.id, role = _b.role;
                token = jsonwebtoken_1.default.sign({
                    id: id,
                    role: role
                }, 'secret');
                res.json({ token: token, user: { role: "USER", email: email } });
                return [2 /*return*/];
        }
    });
}); });
app.post("/paypal", auth_1.isAuth, auth_1.isInstructor, function (req, res) {
    var code = req.body.code;
    var paypal = require('paypal-rest-sdk');
    paypal.configure({
        'openid_client_id': process.env.SANBOX_PAYPAL_CLIENT,
        'openid_client_secret': process.env.SANDBOX_PAYPAL_SECRET,
        'openid_redirect_uri': 'http://127.0.0.1:3000/paypal'
    });
    paypal.openIdConnect.tokeninfo.create(code, function (error, tokeninfo) {
        console.log(tokeninfo);
        if (!tokeninfo)
            return res.send('Something wrong');
        paypal.openIdConnect.userinfo.get(tokeninfo.access_token, function (error, userinfo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (error)
                                return [2 /*return*/, res.json(error)];
                            console.log('Cool');
                            console.log();
                            console.log(userinfo);
                            // userInfo.
                            return [4 /*yield*/, updateUserPaypalCredentials(req.user.instructorId, userinfo)
                                // await prisma.instructorProfile.update({
                                //   where:{
                                //     id:req.user.instructorId
                                //   },
                                //   data:{
                                //     paypalId:{
                                //       set:userInfo.data.payer_id
                                //   }
                                // }
                                // })
                            ];
                        case 1:
                            // userInfo.
                            _a.sent();
                            // await prisma.instructorProfile.update({
                            //   where:{
                            //     id:req.user.instructorId
                            //   },
                            //   data:{
                            //     paypalId:{
                            //       set:userInfo.data.payer_id
                            //   }
                            // }
                            // })
                            res.json(userinfo);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
function updateUserPaypalCredentials(profileId, userInfo) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('userInfo', userInfo.payer_id);
            console.log('', profileId);
            // const good= JSON.parse(userInfo)
            // console.log('good',good)
            return [2 /*return*/, prisma.instructorProfile.update({
                    where: {
                        id: profileId
                    },
                    data: {
                        paypalId: {
                            set: userInfo.payer_id
                        },
                        paymentMethod: {
                            set: "PAYPAL"
                        }
                    }
                })];
        });
    });
}
exports.default = app;
//# sourceMappingURL=user.js.map