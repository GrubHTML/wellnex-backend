import express from "express";
import { authGuard } from "../middlewares/authGuard.middleware.js";
import placeOrder from "../controllers/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/", authGuard, placeOrder);

export default orderRouter;
