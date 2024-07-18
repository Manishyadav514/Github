"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
}, { timestamps: true,
    useFindAndModify: false });
exports.default = (0, mongoose_1.model)("Device", deviceSchema);
