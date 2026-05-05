import express from "express";
const userRouter = express.Router();

import { me, userLogin, userRegister } from "../controllers/user.controller.js";
import { authGuard } from "../middlewares/authGuard.middleware.js";

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/profile", authGuard, (req, res) => {
  res.status(200).json({ message: "welcome to your profile", id: req.id });
});
userRouter.get("/me", authGuard, me);
export default userRouter;
