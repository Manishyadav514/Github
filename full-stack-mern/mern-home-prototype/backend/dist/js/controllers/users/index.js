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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginuser = exports.registeruser = void 0;
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
// create token with user id
const createtoken = (_id) => {
    // @ts-ignore
    return jsonwebtoken_1.default.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
// controller functions to register and login users
const registeruser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const exists = yield user_1.default.findOne({ email: body.email });
        if (!body.name || !body.email || !body.password) {
            throw Error("Please fill all the fields");
        }
        if (!validator_1.default.isEmail(body.email)) {
            throw Error("Email is not valid");
        }
        if (!validator_1.default.isStrongPassword(body.password)) {
            throw Error("Password is not strong enough");
        }
        if (exists) {
            throw Error("Email already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(body.password, salt);
        const newuser = new user_1.default({
            name: body.name,
            email: body.email,
            password: hashedPassword,
        });
        const newentry = yield newuser.save();
        const token = createtoken(newentry._id);
        res.status(201).json({
            name: newentry.name,
            email: newentry.email,
            token: token,
        });
    }
    catch (error) {
        // Check if it's a validation error
        if (error instanceof Error) {
            res.status(400).json({
                status: "400 Bad Request",
                message: error.message,
            });
        }
        else {
            // Handle internal server errors
            console.error("Internal Server Error:", error);
            res.status(500).json({
                status: "500 Internal Server Error",
                message: "500 Internal Server Error, User not created",
            });
        }
    }
});
exports.registeruser = registeruser;
const loginuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const login = yield user_1.default.findOne({
            email: req.body.email,
        });
        if (!login) {
            res.status(404).json({
                message: "Email not found",
                status: "404 Not Found",
            });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, login.password);
        if (!validPassword) {
            res.status(400).json({
                message: "Invalid password",
                status: "400 Bad Request",
            });
            return;
        }
        const token = createtoken(login._id);
        res.status(200).json({
            name: login.name,
            email: login.email,
            token: token,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "500 Internal Server Error",
            message: "500 Internal Server Error, User not logged in",
        });
    }
});
exports.loginuser = loginuser;
