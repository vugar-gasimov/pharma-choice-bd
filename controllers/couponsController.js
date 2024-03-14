const Coupons = require("../models/Coupon");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all coupons
// @route GET /coupons
// @access Private
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupons.find().select().lean();
  if (!coupons?.length) {
    return res.status(400).json({ message: "No coupons found" });
  }
  res.json(coupons);
});

// @desc Create new coupons
// @route POST /notes
// @access Private
const createNewCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expirationDate } = req.body;

  //Confirm Data
  if (!code || !discount || !expirationDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Check for duplicate
  const duplicate = await Coupons.findOne({ code }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Code" });
  }

  const couponObject = { code, discount, expirationDate };

  // Create and store new coupon
  const coupon = await Coupons.create(couponObject);

  if (coupon) {
    res.status(201).json({ message: `New coupon ${code} is created` });
  } else {
    res.status(400).json({ message: "Invalid coupon data received" });
  }
});

// @desc Update a coupon
// @route PATCH /notes
// @access Private
const updateCoupon = asyncHandler(async (req, res) => {
  const { id, code, discount, expirationDate } = req.body;

  // Confirm data
  if (!code || !discount || !expirationDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const coupon = await Coupons.findById(id).exec();

  if (!coupon) {
    return res.status(400).json({ message: "Coupon not found" });
  }

  // Check for duplicates
  const duplicate = await Coupons.findOne({ code }).lean().exec();
  // Allow updates to the original coupon
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Coupon is already in use." });
  }

  coupon.code = code;
  coupon.discount = discount;
  coupon.expirationDate = expirationDate;

  const updatedCoupon = await coupon.save();

  res.json({ message: `${updatedCoupon.code} updated` });
});

// @desc Delete a coupon
// @route DELETE /notes
// @access Private
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "No coupon ID provided" });
  }

  const coupon = await coupon.findById(id).exec();
  if (!coupon) {
    return res.status(400).json({ message: "Coupon not  found" });
  }

  const result = await coupon.deleteOne();

  const reply = `Coupon with code ${result.code} with Id ${result._id} deleted successfully`;

  res.json(reply);
});

module.exports = {
  getAllCoupons,
  createNewCoupon,
  updateCoupon,
  deleteCoupon,
};
