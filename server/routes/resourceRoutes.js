const express = require("express");
const router = express.Router();
const { uploadResource, addLink, getResources, deleteResource } = require("../controllers/resourceController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { requireRoomMember } = require("../middleware/roomMembership");

router.post("/:roomId/upload", protect, requireRoomMember, upload.single("file"), uploadResource);
router.post("/:roomId/link", protect, requireRoomMember, addLink);
router.get("/:roomId", protect, requireRoomMember, getResources);
router.delete("/:id", protect, deleteResource);

module.exports = router;