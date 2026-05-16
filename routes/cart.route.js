import express from "express";
import {
  createCart,
  deleteCart,
  getCartById,
  getCarts,
  updateCart,
} from "../controllers/cart.controller.js";
import { authGuard } from "../middlewares/authGuard.middleware.js";

const cartRouter = express.Router();

cartRouter.use(authGuard);

cartRouter.post("/", createCart);
cartRouter.get("/", getCarts);
cartRouter.get("/:id", getCartById);
cartRouter.put("/:id", updateCart);
cartRouter.delete("/:id", deleteCart);

export default cartRouter;
