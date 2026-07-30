import sequelize from "../config/dbConfig.js";
import { CartModel } from "../models/cart.model.js";
import { OrderModel } from "../models/order.model.js";
import { OrderItemModel } from "../models/orderItem.model.js";
import { ProductModel } from "../models/product.model.js";

const placeOrder = async (req, res, next) => {
  const userId = req.id;
  const {
    shippingName,
    shippingPhone,
    shippingEmail,
    shippingAddress,
    orderNotes,
    paymentMethod,
  } = req.body;

  if (!shippingName || !paymentMethod || !shippingAddress || !shippingPhone) {
    const err = new Error("All required fields are missing!");
    err.statusCode = 400;
    return next(err);
  }
  try {
    // Managed transaction - only one try/catch, commit/rolback nei
    const result = await sequelize.transaction(async (t) => {
      // step 1- cart fetch kora with product price
      const cartItems = await CartModel.findAll({
        where: { userId },
        include: [{ model: ProductModel }],
        transaction: t,
      });
      if (cartItems.length === 0) {
        throw new Error("Cart is empty"); // throw korle auto rollback
      }
      // step 2a: calculate subtotal
      let subtotal = 0;
      cartItems.forEach((item) => {
        subtotal += parseFloat(item.product.price) * item.quantity;
      });
      // step 2b: calculate total
      const shippingCost = 120.0;
      const discount = 0.0;
      const totalAmount = subtotal + shippingCost - discount;

      //step 3: order create
      const newOrder = await OrderModel.create(
        {
          userId,
          shippingName,
          shippingPhone,
          shippingEmail,
          shippingAddress,
          orderNotes,
          paymentMethod,
          subtotal,
          shippingCost,
          discount,
          totalAmount,
        },
        { transaction: t },
      );
      const orderItemsArray = cartItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
        totalPrice: parseFloat(item.product.price) * item.quantity,
      }));

      await OrderItemModel.bulkCreate(orderItemsArray, { transaction: t });

      await CartModel.destroy({
        where: { userId },
        transaction: t,
      });

      return { orderId: newOrder.id, totalAmount }; // এই value বাইরে পাবে
    });
    // এখানে কোনো error না হলে Sequelize auto commit করবে
    return res.status(201).json({
      message: "Order placed successfully!",
      orderId: result.orderId,
      totalAmount: result.totalAmount,
    });
  } catch (error) {
    console.error("Order place error:", error);
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.findAll({
      where: {
        userId: req.id,
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      message: "All Orders List: ",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrdersById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await OrderModel.findByPk(id, {
      include: [
        {
          model: OrderItemModel,
        },
      ],
    });
    if (!order) {
      const err = new Error("Order not found!");
      err.statusCode = 404;
      return next(err);
    }
    return res.status(200).json({
      success: true,
      message: "Your Order: ",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export { placeOrder, getOrders, getOrdersById };
