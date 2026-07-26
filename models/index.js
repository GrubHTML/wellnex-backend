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

// User -> Order
UserModel.hasMany(OrderModel, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
OrderModel.belongsTo(UserModel, {
  foreignKey: "userId",
});
// Order -> OrderItem
OrderModel.hasMany(OrderItemModel, {
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
OrderItemModel.belongsTo(OrderModel, {
  foreignKey: "orderId",
});
// Product → OrderItem
ProductModel.hasMany(OrderItemModel, {
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT", // Product delete হলে পুরনো order যেন না মোছে
});
OrderItemModel.belongsTo(ProductModel, {
  foreignKey: "productId",
});
