const express = require("express");
const router = express.Router();
const { uploadResource, addLink, getResources, deleteResource } = require("../controllers/resourceController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/:roomId/upload", protect, upload.single("file"), uploadResource);
router.post("/:roomId/link", protect, addLink);
router.get("/:roomId", protect, getResources);
router.delete("/:id", protect, deleteResource);

module.exports = router;