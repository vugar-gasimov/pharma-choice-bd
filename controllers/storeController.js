const Store = require("../models/Store");

const asyncHandler = require("express-async-handler");

// @desc Get all stores
// @route GET /stores
// @access Private
const getAllStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().select().lean();
  if (!stores?.length) {
    return res.status(400).json({ message: "No stores found" });
  }
  res.json(stores);
});

// @desc Create new Store
// @route POST /stores
// @access Private
const createNewStore = asyncHandler(async (req, res) => {
  const { name, drugs, address } = req.body;

  //Confirm Data
  if (!name || !address) {
    return res.status(400).json({ message: "Name and address are required" });
  }

  //Check for duplicate
  const duplicate = await Store.findOne({ address }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Address" });
  }

  const newStore = new Store({ name, drugs, address });
  await newStore.save();

  // Create and store new Store
  const Store = await Store.create(StoreObject);

  if (Store) {
    res.status(201).json({ message: `New Store ${name} is created` });
  } else {
    res.status(400).json({ message: "Invalid Store data received" });
  }
});

// @desc Update a Store
// @route PATCH /stores
// @access Private
const updateStore = asyncHandler(async (req, res) => {
  const { id, name, drugs, address } = req.body;

  // Confirm data
  if (!name || !address) {
    return res.status(400).json({ message: "Name and address are required" });
  }
  const updatedStore = await Store.findByIdAndUpdate(
    id,
    { name, address, drugs },
    { new: true }
  );
  const Store = await Store.findById(id).exec();

  if (!Store) {
    return res.status(400).json({ message: "Store not found" });
  }

  // Check for duplicates
  const duplicate = await Store.findOne({ address }).lean().exec();
  // Allow updates to the original Store
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Address is already in use." });
  }

  Store.name = name;
  Store.address = address;
  Store.drugs = drugs;

  const updatedStore = await Store.save();

  res.json({ message: `${updatedStore.name} updated` });
});

// @desc Delete a Store
// @route DELETE /stores/:id
// @access Private
const deleteStore = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "No Store ID provided" });
  }

  const deletedStore = await Store.findById(id).exec();
  if (!deletedStore) {
    return res.status(400).json({ message: "Store not found" });
  }

  const result = await Store.deleteOne();

  const reply = `Store with name ${deletedStore.name} with Id ${deletedStore._id} deleted successfully`;

  res.json(reply);
});

module.exports = {
  getAllStores,
  createNewStore,
  updateStore,
  deleteStore,
};
