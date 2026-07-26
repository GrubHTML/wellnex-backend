import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/dbConfig.js";
import { UserModel } from "./models/user.model.js";
import { ProductModel } from "./models/product.model.js";
import { CategoryModel } from "./models/category.model.js";
import userRouter from "./routes/user.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import "./models/index.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5500;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      // "https://wellnex.grubdev.top",
      "http://192.168.88.11:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);

// Global error handling middleware
app.use(errorHandler);

// DB connection
const dBConnection = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("DB Connection has been successfully extablished.");
  } catch (error) {
    console.error("Unable to connect to the DB", error);
  }
};
dBConnection();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running at http://192.168.88.11:${PORT}`);
});
