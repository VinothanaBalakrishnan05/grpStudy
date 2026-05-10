const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  ],
});

module.exports = mongoose.models.Room || mongoose.model("Room", roomSchema);