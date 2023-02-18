const mongoose = require("mongoose");

const uploadModel = new mongoose.Schema({
  title: { type: String },
  images: Array,
});

module.exports = mongoose.model("uploadModel", uploadModel);
