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
exports.deletedevices = exports.updatedevices = exports.addDevices = exports.getDevices = void 0;
const devices_1 = __importDefault(require("../../models/devices"));
// controller functions to get, add, update and delete devices
const getDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const devices = yield devices_1.default.find();
        res.status(200).json({
            message: "Devices retrieved",
            status: "200 OK",
            devices: devices,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.getDevices = getDevices;
const addDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const device = new devices_1.default({
            name: body.name,
            state: body.state,
            image: body.image,
            location: body.location,
        });
        const newdevice = yield device.save();
        const alldevices = yield devices_1.default.find();
        res.status(201).json({
            message: "Devices created",
            status: "201 Created",
            newdevice: newdevice,
            devices: alldevices,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.addDevices = addDevices;
const updatedevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        const updatedevice = yield devices_1.default.findByIdAndUpdate({ _id: id }, body);
        const alldevices = yield devices_1.default.find();
        res.status(200).json({
            message: "Devices updated",
            status: "200 OK",
            device: updatedevice,
            devices: alldevices,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.updatedevices = updatedevices;
const deletedevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removedevice = yield devices_1.default.findByIdAndRemove(req.params.id);
        const alldevices = yield devices_1.default.find();
        res.status(200).json({
            message: "Device deleted",
            status: "200 OK",
            device: removedevice,
            devices: alldevices,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.deletedevices = deletedevices;
