"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express_1 = __importDefault(require("express"));
// import {PrismaClient} from "@prisma/client"
var cors_1 = __importDefault(require("cors"));
var user_1 = __importDefault(require("./routes/user"));
var buildCourse_1 = __importDefault(require("./routes/buildCourse"));
var boughtCourse_1 = __importDefault(require("./routes/boughtCourse"));
var order_1 = __importDefault(require("./routes/order"));
var payment_1 = __importDefault(require("./routes/payment"));
var video_1 = __importDefault(require("./routes/video"));
var lichess_auth_1 = __importDefault(require("./routes/lichess-auth"));
var app = express_1.default();
// const upload = multer({ storage: fileStorage })
app.use('/public', express_1.default.static('public', {
    maxAge: 30000
}));
app.use(cors_1.default());
app.use(express_1.default.json());
// app.use('/files', express.static(path.join(__dirname,'public')))
app.get('/', function (req, res) {
    console.log(req.app.get('yoy'));
    res.send("<h1>Hello " + (JSON.stringify(req.query.email) + req.app.get('yoy')) + " world</h1>");
});
app.use('', user_1.default);
app.use('/lichess', lichess_auth_1.default);
app.use('/buildcourse', buildCourse_1.default);
app.use('/video', video_1.default);
app.use('/boughtcourse', boughtCourse_1.default);
app.use('/order', order_1.default);
app.use('/payment', payment_1.default);
var port = 4000;
app.listen(port, function () {
    console.log('Server is listenig:', port);
});
//# sourceMappingURL=index.js.map