import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

export const OrderModel = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shippingName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  orderNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.ENUM("cash_on_delivery", "online", "bkash", "paypal"),
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("unpaid", "paid"),
    defaultValue: "unpaid",
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ),
    defaultValue: "pending",
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 120.0,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
