import express from "express";
import { authGuard } from "../middlewares/authGuard.middleware.js";
import {
  placeOrder,
  getOrders,
  getOrdersById,
} from "../controllers/order.controller.js";
const orderRouter = express.Router();

orderRouter.use(authGuard);

orderRouter.post("/", placeOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrdersById);

export default orderRouter;
