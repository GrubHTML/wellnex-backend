import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { UserModel } from "../models/user.model.js";

const userRegister = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      const err = new Error("All fields are required!");
      err.statusCode = 400;
      return next(err);
    }
    const existingUser = await UserModel.findOne({ where: { email: email } });
    if (existingUser) {
      const err = new Error("User already exists!");
      err.statusCode = 400;
      return next(err);
    }
    const normalizedEmail = email.toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const userData = await UserModel.create({
      username,
      email: normalizedEmail,
      password: hashed,
    });
    return res.status(201).json({
      success: true,
      message: "A new user created successfully",
      // userData: {
      //   id: userData.id,
      //   username: userData.username,
      //   email: userData.email,
      // },
    });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error("All fields are required!");
      err.statusCode = 400;
      return next(err);
    }
    const normalizedEmail = email.toLowerCase();
    const user = await UserModel.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      const err = new Error("Invalid credentials!");
      err.statusCode = 401;
      return next(err);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const err = new Error("Invalid credentials!");
      err.statusCode = 401;
      return next(err);
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN },
    );
    return res.status(200).json({
      success: true,
      accessToken: token,
      message: "You are successfully logged in!",
      // user,
    });
  } catch (error) {
    next(error);
  }
};
export const me = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { id: req.id },
      attributes: ["username"],
    });
    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", cm: error.message });
  }
};
export { userRegister, userLogin };
