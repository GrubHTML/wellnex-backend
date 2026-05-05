import { CategoryModel } from "../models/category.model.js";

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      const err = new Error("Category name is required");
      err.statusCode = 400;
      return next(err);
    }
    const existingName = await CategoryModel.findOne({ where: { name: name } });
    if (existingName) {
      const err = new Error("Category already exists");
      err.statusCode = 400;
      return next(err);
    }
    const normalizedName = name.toLowerCase();
    const category = await CategoryModel.create({
      name: normalizedName,
    });
    return res.status(201).json({
      success: true,
      message: "A new category has been created",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll({
      order: [["id", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
};
export { createCategory, getCategories };
