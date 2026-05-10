const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "study-platform";
    let resource_type = "auto";

    // set folder based on file type
    if (file.mimetype.startsWith("image/")) {
      folder = "study-platform/images";
    } else if (file.mimetype === "application/pdf") {
      folder = "study-platform/pdfs";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "study-platform/videos";
    }

    return {
      folder,
      resource_type,
      allowed_formats: ["jpg", "jpeg", "png", "pdf", "mp4", "mkv","docx","pptx"],
    };
  },
});

// file filter — only allow specific types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "video/mkv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

module.exports = upload;
