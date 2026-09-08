const express = require("express");
const router = express.Router();
const { getMessages, deleteMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoomMember } = require("../middleware/roomMembership");

router.get("/:roomId", protect, requireRoomMember, getMessages);
router.delete("/:id", protect,deleteMessage);

module.exports = router;