const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["link", "pdf", "image", "video", "docx", "pptx"],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);