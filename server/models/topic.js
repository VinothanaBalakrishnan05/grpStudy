const mongoose = require("mongoose");
const topicSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true },
);
topicSchema.index({ roomId: 1, userId: 1 });
module.exports = mongoose.model("Topic", topicSchema);
