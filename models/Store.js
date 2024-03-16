const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    drugs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Drugs" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
