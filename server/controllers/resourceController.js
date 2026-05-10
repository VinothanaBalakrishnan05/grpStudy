const Resource = require("../models/resource");

// helper to detect type from mimetype
const getTypeFromMimetype = (mimetype) => {
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.includes("wordprocessingml")) return "docx";
  return "link";
};

// UPLOAD FILE RESOURCE
const uploadResource = async (req, res) => {
  try {
    const { title, tags } = req.body;
    const { roomId } = req.params;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // multer-storage-cloudinary already uploaded it
    // req.file.path is the Cloudinary URL
    const type = getTypeFromMimetype(req.file.mimetype);

    const resource = await Resource.create({
      roomId,
      uploadedBy: req.user._id,
      title,
      type,
      url: req.file.path,   // cloudinary URL
      tags: tags ? tags.split(",") : []
    });

    res.status(201).json({ message: "Resource uploaded successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD LINK RESOURCE (no file upload)
const addLink = async (req, res) => {
  try {
    const { title, url, type, tags } = req.body;
    const { roomId } = req.params;

    if (!title || !url || !type) {
      return res.status(400).json({ message: "Title, url and type are required" });
    }

    // type must be link or video for this route
    if (!["link", "video"].includes(type)) {
      return res.status(400).json({ message: "Type must be link or video" });
    }

    const resource = await Resource.create({
      roomId,
      uploadedBy: req.user._id,
      title,
      type,
      url,
      tags: tags ? tags.split(",") : []
    });

    res.status(201).json({ message: "Link added successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL RESOURCES IN A ROOM
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ roomId: req.params.roomId })
      .populate("uploadedBy", "name");
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE RESOURCE
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // only uploader can delete
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this resource" });
    }

    await resource.deleteOne();
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResource, addLink, getResources, deleteResource };