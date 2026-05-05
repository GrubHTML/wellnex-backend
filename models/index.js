import { ProductModel } from "./product.model.js";
import { CategoryModel } from "./category.model.js";

CategoryModel.hasMany(ProductModel, {
  foreignKey: "categoryId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
ProductModel.belongsTo(CategoryModel, {
  foreignKey: "categoryId",
});
