const Drugs = require("../models/Drugs");
const asyncHandler = require("express-async-handler");

// @desc Get all drugs
// @route GET /drugs
// @access Private
const getAllDrugs = asyncHandler(async (req, res) => {
  const drugs = await Drugs.find().select().lean();
  if (!drugs?.length) {
    return res.status(400).json({ message: "No drugs found" });
  }
  res.json(drugs);
});

// @desc Create new drug
// @route POST /notes
// @access Private
const createNewDrug = asyncHandler(async (req, res) => {
  const { name, desc, price, dateAdded, image } = req.body;

  //Confirm Data
  if (!desc || !name || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Check for duplicate
  const duplicate = await Drugs.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Name" });
  }

  const drugObject = { desc, name, price, dateAdded, image };

  // Create and store new drug
  const drug = await Drugs.create(drugObject);

  if (drug) {
    res.status(201).json({ message: `New drug ${name} is created` });
  } else {
    res.status(400).json({ message: "Invalid drag data received" });
  }
});

// @desc Update a drug
// @route PATCH /notes
// @access Private
const updateDrug = asyncHandler(async (req, res) => {
  const { id, name, desc, price, dateAdded, image } = req.body;

  // Confirm data
  if (!id || !name || !desc || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const drug = await Drugs.findById(id).exec();

  if (!drug) {
    return res.status(400).json({ message: "Drug not found" });
  }

  // Check for duplicates
  const duplicate = await Drugs.findOne({ name }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Name is already in use." });
  }

  drug.name = name;
  drug.desc = desc;
  drug.price = price;
  drug.dateAdded = dateAdded;
  drug.image = image;

  const updatedDrug = await drug.save();

  res.json({ message: `${updatedDrug.name} updated` });
});

// @desc Delete a drug
// @route DELETE /notes
// @access Private
const deleteDrug = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "No drug ID provided" });
  }

  const drug = await drug.findById(id).exec();
  if (!drug) {
    return res.status(400).json({ message: "Drug not  found" });
  }

  const result = await drug.deleteOne();

  const reply = `Drug with name ${result.name} with Id ${result._id} deleted successfully`;

  res.json(reply);
});

module.exports = {
  getAllDrugs,
  createNewDrug,
  updateDrug,
  deleteDrug,
};
