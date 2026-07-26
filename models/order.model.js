import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

export const OrderModel = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  paymentMethod: {
    type: DataTypes.ENUM("cash_on_delivery", "online", "bkash", "paypal"),
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 120.0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
