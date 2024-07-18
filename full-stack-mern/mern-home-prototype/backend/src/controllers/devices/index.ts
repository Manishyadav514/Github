import { Response, Request } from "express";
import { device } from "./types/device";
import devicemodel from "../../models/devices";
import user from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// controller functions to get, add, update and delete devices

const getDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const devices: device[] = await devicemodel.find();
    res.status(200).json({
      message: "Devices retrieved",
      status: "200 OK",
      devices: devices,
    });
  } catch (error) {
    throw error;
  }
};

const addDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as device;

    const device: device = new devicemodel({
      name: body.name,
      state: body.state,
      image: body.image,
      location: body.location,
    });

    const newdevice = await device.save();
    const alldevices = await devicemodel.find();

    res.status(201).json({
      message: "Devices created",
      status: "201 Created",
      newdevice: newdevice,
      devices: alldevices,
    });
  } catch (error) {
    throw error;
  }
};

const updatedevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const updatedevice: device | null = await devicemodel.findByIdAndUpdate(
      { _id: id },
      body
    );

    const alldevices: device[] = await devicemodel.find();

    res.status(200).json({
      message: "Devices updated",
      status: "200 OK",
      device: updatedevice,
      devices: alldevices,
    });
  } catch (error) {
    throw error;
  }
};

const deletedevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const removedevice: device | null = await devicemodel.findByIdAndRemove(
      req.params.id
    );

    const alldevices: device[] = await devicemodel.find();

    res.status(200).json({
      message: "Device deleted",
      status: "200 OK",
      device: removedevice,
      devices: alldevices,
    });
  } catch (error) {
    throw error;
  }
};

export { getDevices, addDevices, updatedevices, deletedevices };
