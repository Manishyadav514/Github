import { Request, Response } from "express";
import user from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// create token with user id
const createtoken = (_id: string) => {
  // @ts-ignore
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// controller functions to register and login users

const registeruser = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;

  try {
    const exists = await user.findOne({ email: body.email });

    if (!body.name || !body.email || !body.password) {
      throw Error("Please fill all the fields");
    }

    if (!validator.isEmail(body.email)) {
      throw Error("Email is not valid");
    }

    if (!validator.isStrongPassword(body.password)) {
      throw Error("Password is not strong enough");
    }

    if (exists) {
      throw Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newuser = new user({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });

    const newentry = await newuser.save();
    const token = createtoken(newentry._id as string);

    res.status(201).json({
      name: newentry.name,
      email: newentry.email,
      token: token,
    });
  } catch (error) {
    // Check if it's a validation error
    if (error instanceof Error) {
      res.status(400).json({
        status: "400 Bad Request",
        message: error.message,
      });
    } else {
      // Handle internal server errors
      console.error("Internal Server Error:", error);

      res.status(500).json({
        status: "500 Internal Server Error",
        message: "500 Internal Server Error, User not created",
      });
    }
  }
};

const loginuser = async (req: Request, res: Response): Promise<void> => {
  try {
    const login = await user.findOne({
      email: req.body.email,
    });

    if (!login) {
      res.status(404).json({
        message: "Email not found",
        status: "404 Not Found",
      });
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      login.password
    );

    if (!validPassword) {
      res.status(400).json({
        message: "Invalid password",
        status: "400 Bad Request",
      });
      return;
    }

    const token = createtoken(login._id as string);

    res.status(200).json({
      name: login.name,
      email: login.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "500 Internal Server Error",
      message: "500 Internal Server Error, User not logged in",
    });
  }
};

export { registeruser, loginuser };
