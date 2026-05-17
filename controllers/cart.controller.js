import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const createCart = async (req, res, next) => {
  const userId = req.id;
  const { id: productId } = req.body;
  try {
    const product = await ProductModel.findOne({ where: { id: productId } });
    if (!product) {
      const err = new Error("Product is not available!");
      err.statusCode = 404;
      return next(err);
    }
    const existingUserWithProduct = await CartModel.findOne({
      where: { userId, productId },
    });
    let cartItem;
    if (!existingUserWithProduct) {
      cartItem = await CartModel.create({
        userId: userId,
        productId: productId,
        quantity: 1,
      });
    } else {
      existingUserWithProduct.quantity += 1;
      cartItem = await existingUserWithProduct.save();
    }
    return res
      .status(201)
      .json({ success: true, message: "Cart item has been added", cartItem });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCarts = async (req, res, next) => {
  const id = req.id;
  try {
    const cartItems = await CartModel.findAll({
      order: [["id", "DESC"]],
      where: { userId: id },
      include: [ProductModel],
    });
    if (cartItems.length === 0) {
      const err = new Error("Nor cart items found!");
      err.statusCode = 404;
      return next(err);
    }
    return res.status(200).json({
      success: true,
      message: "Cart item fetched successfully",
      cartItems,
    });
  } catch (error) {
    next(error);
  }
};

const getCartById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cartItem = await CartModel.findOne({
      where: {
        id,
        userId: req.id,
      },
    });
    if (!cartItem) {
      const err = new Error("Cart item not found!");
      err.statusCode = 404;
      return next(err);
    }
    return res.status(200).json({ success: true, message: "Cart:", cartItem });
  } catch (error) {
    next(error);
  }
};

const updateCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { productId, quantity } = req.body;
    const cartItem = await CartModel.findOne({
      where: {
        id,
        userId: req.id,
      },
    });
    if (!cartItem) {
      const err = new Error("Cart item not found!");
      err.statusCode = 404;
      return next(err);
    }
    await cartItem.update({
      productId: productId || cartItem.productId,
      quantity: quantity ?? cartItem.quantity,
    });
    res
      .status(200)
      .json({ success: true, message: "Cart item has been updated", cartItem });
  } catch (error) {
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cartItem = await CartModel.findOne({
      where: {
        id,
        userId: req.id,
      },
    });
    if (!cartItem) {
      const err = new Error("Cart item not found!");
      err.statusCode = 404;
      return next(err);
    }
    await cartItem.destroy();
    return res.status(200).json({
      success: true,
      message: "Cart item has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export { createCart, getCarts, getCartById, updateCart, deleteCart };
