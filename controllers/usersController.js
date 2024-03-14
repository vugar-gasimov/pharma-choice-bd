const User = require("../models/User");
// const Drugs = require("../models/Drugs");
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select().lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create new user
// @route POST /notes
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { email, name, phone, address } = req.body;

  //Confirm Data
  if (!email || !name || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Check for duplicate
  const duplicate = await User.findOne({ email }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Email" });
  }

  const userObject = { email, name, phone, address };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${name} is created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /notes
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, name, email, phone, address } = req.body;

  // Confirm data
  if (!id || !name || !email || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicates
  const duplicate = await User.findOne({ email }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Email is already in use." });
  }

  user.email = email;
  user.name = name;
  user.phone = phone;
  user.address = address;

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.name} updated` });
});

// @desc Delete a user
// @route DELETE /notes
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "No user ID provided" });
  }

  const user = await user.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not  found" });
  }

  const result = await user.deleteOne();

  const reply = `User with name ${result.name} with Id ${result._id} deleted successfully`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
