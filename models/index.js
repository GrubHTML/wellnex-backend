import { ProductModel } from "./product.model.js";
import { CategoryModel } from "./category.model.js";
import { UserModel } from "./user.model.js";
import { CartModel } from "./cart.model.js";

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
