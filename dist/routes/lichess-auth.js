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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var simpleOauth = require('simple-oauth2');
var axios = require('axios');
/* Create your lichess OAuth app on https://lichess.org/account/oauth/app/create
 * Homepage URL: http://localhost:8087
 * Callback URL: http://localhost:8087/callback
 */
/* --- Fill in your app config here --- */
var port = 3000;
var clientId = 'IKGglix7XImcYLPc';
var clientSecret = '43nbT0LBFw3UGjUy2eNrPOzWv07Vg0zF';
var redirectUri = "http://localhost:" + port + "/test";
/* --- Lichess config --- */
var tokenHost = 'https://oauth.lichess.org';
var authorizePath = '/oauth/authorize';
var tokenPath = '/oauth';
/* --- End of lichess config --- */
var oauth2 = simpleOauth.create({
    client: {
        id: clientId,
        secret: clientSecret,
    },
    auth: {
        tokenHost: tokenHost,
        tokenPath: tokenPath,
        authorizePath: authorizePath,
    },
});
var app = express_1.Router();
// Redirect URI: parse the authorization token and ask for the access token
app.get('/callback', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, token, userInfo, userEmail, email, data, title, id, user, newUser, tokenApp_1, tokenApp_2, tokenApp, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                console.log(req.query.code);
                return [4 /*yield*/, oauth2.authorizationCode.getToken({
                        code: req.query.code,
                        redirect_uri: redirectUri
                    })];
            case 1:
                result = _a.sent();
                console.log('res', result);
                token = oauth2.accessToken.create(result);
                return [4 /*yield*/, getUserInfo(token.token)];
            case 2:
                userInfo = _a.sent();
                return [4 /*yield*/, getUserEmail(token.token)];
            case 3:
                userEmail = _a.sent();
                email = userEmail.data.email;
                data = userInfo.data;
                console.log(data);
                title = data.title, id = data.id;
                console.log('id', id);
                console.log('title', title);
                return [4 /*yield*/, prisma.user.findOne({
                        where: {
                            lichessId: id
                        },
                        include: {
                            instructorProfile: {
                                select: {
                                    id: true
                                }
                            },
                            boughtCourses: {
                                select: {
                                    courseId: true
                                }
                            }
                        }
                    })];
            case 4:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 8];
                newUser = void 0;
                if (!(title == "GM" || title == "IM" || title == "WGM" || title == "WIM")) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            lichessId: id,
                            role: "TEACHER",
                            instructorProfile: {
                                create: {
                                    title: title
                                }
                            }
                        },
                        select: {
                            id: true,
                            instructorProfile: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    })];
            case 5:
                newUser = _a.sent();
                tokenApp_1 = jsonwebtoken_1.default.sign({
                    id: newUser.id,
                    role: "TEACHER",
                    instructorId: newUser.instructorProfile.id
                }, 'secret');
                return [2 /*return*/, res.json({ email: email, role: "TEACHER", token: tokenApp_1 })];
            case 6: return [4 /*yield*/, prisma.user.create({
                    data: {
                        lichessId: id,
                        role: "USER"
                    },
                })];
            case 7:
                newUser = _a.sent();
                tokenApp_2 = jsonwebtoken_1.default.sign({
                    id: newUser.id,
                    role: "USER"
                }, 'secret');
                return [2 /*return*/, res.json({ email: email, role: "USER", token: tokenApp_2 })];
            case 8:
                tokenApp = jsonwebtoken_1.default.sign({
                    id: user.id,
                    role: user.role,
                    instructorId: user.instructorProfile ? user.instructorProfile.id : null
                }, 'secret');
                res.json({ email: email, role: user.role, title: title, token: tokenApp, courses: user.boughtCourses });
                return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                console.error('Access Token Error', error_1.message);
                res.status(500).json('Authentication failed');
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
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
exports.default = app;
//# sourceMappingURL=lichess-auth.js.map