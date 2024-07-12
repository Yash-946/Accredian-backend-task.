"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const sentEmail_1 = require("./email/sentEmail");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
const referralSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    referredTo: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    courses: zod_1.z.array(zod_1.z.string()).min(1, "At least one course must be selected")
});
app.get('/', (req, res) => {
    res.send('Hello express!');
});
app.post("/referdata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const checkValidation = referralSchema.safeParse(body);
        // console.log(checkValidation);
        if (!checkValidation.success) {
            return res.status(406).json({
                status: false,
                message: "Input fields are not correct"
            });
        }
        const data = yield prisma.user.create({
            data: {
                ReferBy: body.name,
                ReferTo: body.referredTo,
                ReferEmail: body.email,
                Courses: { courses: body.courses }
            }
        });
        // console.log(data);
        const status = yield (0, sentEmail_1.sendEmail)(body.name, body.referredTo, body.email, body.courses);
        console.log(status);
        if (!status.id) {
            return res.status(502).json({
                status: false,
                message: "Error in sending email"
            });
        }
        return res.status(200).json({
            status: true,
            message: "All good"
        });
    }
    catch (error) {
        return res.status(500).json({
            status: "fail",
            message: "Internal server error"
        });
    }
}));
app.listen(port, () => {
    return console.log(`Express server is listening at http://localhost:${port} 🚀`);
});
