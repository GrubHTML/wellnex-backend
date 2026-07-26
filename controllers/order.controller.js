import sequelize from "../config/dbConfig.js";
import { CartModel } from "../models/cart.model.js";
import { OrderModel } from "../models/order.model.js";
import { OrderItemModel } from "../models/orderItem.model.js";
import { ProductModel } from "../models/product.model.js";

const placeOrder = async (req, res) => {
  const userId = req.id;
  const { paymentMethod, shippingAddress, phone, notes } = req.body;

  try {
    // step 1: cart fetch kora with product price
    const cartItems = await CartModel.findAll({
      where: { userId },
      include: [{ model: ProductModel }],
    });
    if (cartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty, No order will be placed!" });
    }
    // step 2: Total calculate kora
    const shippingCost = 120;
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.quantity * parseFloat(item.product.price);
    }, 0);
    const total = subtotal + shippingCost;

    // ── Step 3: Managed Transaction ──
    // Managed মানে হলো — তুমি manually commit/rollback করবে না।
    // যদি callback এর ভেতরে কোনো error throw হয়, Sequelize
    // নিজেই rollback করবে। সব ঠিকঠাক হলে নিজেই commit করবে।

    const order = await sequelize.transaction(async (t) => {
      // step 3a: Order make
      const newOrder = await OrderModel.create(
        {
          userId,
          paymentMethod,
          shippingAddress,
          phone,
          notes,
          subtotal,
          shippingCost,
          total,
          status: "pending",
        },
        { transaction: t },
      );
      // ── Step 3b: OrderItems তৈরি করো (bulkCreate) ──
      const orderItemsData = cartItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price, // সেই মুহূর্তের price
      }));

      await OrderItemModel.bulkCreate(orderItemsData, { transaction: t });

      // ── Step 3c: Cart clear করো ──
      await CartModel.destroy({
        where: { userId },
        transaction: t,
      });

      return newOrder; // transaction শেষে এটা return করো
    });

    // ── Step 4: Success response ──
    res.status(201).json({
      message: "Order সফলভাবে place হয়েছে!",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order place error:", error);
    res.status(500).json({ message: "Order place করতে সমস্যা হয়েছে" });
  }
};

export default placeOrder;
