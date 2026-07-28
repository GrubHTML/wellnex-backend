import { ProductModel } from "./product.model.js";
import { CategoryModel } from "./category.model.js";
import { UserModel } from "./user.model.js";
import { CartModel } from "./cart.model.js";
import { OrderItemModel } from "./orderItem.model.js";
import { OrderModel } from "./order.model.js";

CategoryModel.hasMany(ProductModel, {
  foreignKey: "categoryId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
ProductModel.belongsTo(CategoryModel, {
  foreignKey: "categoryId",
});

UserModel.hasMany(CartModel, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
CartModel.belongsTo(UserModel, {
  foreignKey: "userId",
});

ProductModel.hasMany(CartModel, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
CartModel.belongsTo(ProductModel, {
  foreignKey: "productId",
});

// User → Orders
UserModel.hasMany(OrderModel, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
OrderModel.belongsTo(UserModel, {
  foreignKey: "userId",
});

// Order → OrderItems
OrderModel.hasMany(OrderItemModel, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
OrderItemModel.belongsTo(OrderModel, {
  foreignKey: "orderId",
});

// Product → OrderItems
ProductModel.hasMany(OrderItemModel, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT", //RESTRICT মানে — product delete করতে গেলে error দেবে যদি সেই product এর কোনো order থাকে। Order history নষ্ট হবে না।
});
OrderItemModel.belongsTo(ProductModel, {
  foreignKey: "productId",
});
