const express = require("express");
const router = express.Router();
const {
  getTopics,
  addTopic,
  toggleTopic,
  deleteTopic,
  getRoomProgress,
} = require("../controllers/topicController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoomMember } = require("../middleware/roomMembership");

router.get("/:roomId", protect, requireRoomMember, getTopics);
router.post("/:roomId", protect, requireRoomMember, addTopic);
router.get("/:roomId/progress", protect, requireRoomMember, getRoomProgress);
router.patch("/:topicId/toggle", protect, toggleTopic);
router.delete("/:topicId", protect, deleteTopic);

module.exports = router;