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
import "./models/index.js";

dotenv.config();
const PORT = process.env.PORT || 5500;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

// // error handleling
// // 404
// app.use((req, res, next) => {
//   const error = new Error("url not found");
//   error.status = 404;
//   // const a = 404
//   next(error);
// });

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

// server and api test
// app.get("/", (req, res) => {
//   res.send("Hello world");
// });
app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running at http://192.168.88.11:${PORT}`);
});
