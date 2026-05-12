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
      message: "You are registered successfully!",
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
      { expiresIn: "1m" },
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    const { password: _, ...safeUser } = user.toJSON();
    //save refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "development" ? false : true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({
      success: true,
      accessToken: token,
      message: "You are successfully logged in!",
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
export const me = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { id: req.id },
    });
    // console.log(user);
    const { password: _, ...safeUser } = user.toJSON();
    return res.status(200).json({ user: safeUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", cm: error.message });
  }
};

//refresh logic
const refresh = async (req, res) => {
  const cookies = req.cookies;
  try {
    if (!cookies?.refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const refreshToken = cookies.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded)
      return res.status(403).json({ message: "invalid refresh token" });
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "1m" },
    );
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "refresh error", error: error.message });
  }
};
const logout = async (req, res) => {
  try {
    await res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ message: "You are successfully logged out!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: " error from backend logout", error: error.message });
  }
};
export { userRegister, userLogin, refresh, logout };
