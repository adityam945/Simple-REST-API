const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  dataString: { type: String, required: true },
  dataNumber: { type: Number, required: true },
});

module.exports = mongoose.model("Data", dataSchema);
