const mongoose = require("mongoose");
const validator = require("validator");


const textbookListing = new mongoose.Schema({
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Textbook must be provided by a user"],
    },
    textbook: {
        type: mongoose.Types.ObjectId,
        ref: "Textbook",
        required: [true, "Textbook must be provided for a listinng"],
      },
    price: {
      type: Number,
      required: [true, "You must have a price set for textbook"],
    },
    note: {
      type: String,
    },
  });

  const TextbookListing = mongoose.model('TextbookListing', textbookListing);
  module.exports = textbookListing;