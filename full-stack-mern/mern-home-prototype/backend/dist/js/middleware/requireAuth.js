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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
// requireAuth middleware is applied to all routes except /login and /register
// to prevent unauthenticated users from accessing protected routes
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path === "/login" || req.path === "/register") {
        return next();
    }
    // verify user is authenticated
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }
    const token = authorization.split(" ")[1];
    try {
        // verify token
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;
        // @ts-ignore
        req.user = yield user_1.default.findOne({ _id }).select("_id");
        console.log("user is authenticated");
        next();
    }
    catch (error) {
        console.log("Error while authenticating : ", error);
        return res.status(401).json({ error: "Request is not authorized" });
    }
});
exports.default = requireAuth;
