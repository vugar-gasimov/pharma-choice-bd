const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");

// Controller function to find orders by email, phone number, or order ID
const findOrders = asyncHandler(async (req, res) => {
  const { email, phoneNumber, orderId } = req.query;

  try {
    let query = {};

    // Check if email, phone number, or order ID is provided
    if (email) {
      query.email = email;
    }
    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    }
    if (orderId) {
      query._id = orderId;
    }

    // Find orders based on the query
    const orders = await Order.find(query);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Failed to find orders:", error);
    res
      .status(500)
      .json({ message: "Failed to find orders", error: error.message });
  }
});

// Controller function to create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { user, products, total, name, address, email, phoneNumber } = req.body;

  try {
    // Check if all required fields are provided
    if (
      !user ||
      !products ||
      !total ||
      !name ||
      !address ||
      !email ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the new order
    const newOrder = await Order.create({
      user,
      products,
      total,
      name,
      address,
      email,
      phoneNumber,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Failed to create order:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
});

// Controller function to update an existing order
const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params; // Extract the order ID from request parameters
  const updateData = req.body; // Data to update

  try {
    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order with the provided data
    Object.assign(order, updateData);
    const updatedOrder = await order.save();

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Failed to update order:", error);
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
});

// Controller function to delete an existing order
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params; // Extract the order ID from request parameters

  try {
    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Delete the order
    await order.remove();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
});

module.exports = {
  findOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
