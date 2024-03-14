const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    dateAdded: { type: Date, default: Date.now },
    image: { type: String, default: "pillbottle.jpg" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drugs", drugSchema);
