"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quote: { type: String },
}, { collection: 'user-data', timestamps: true,
    useFindAndModify: false });
exports.default = (0, mongoose_1.model)("User", UserSchema);
