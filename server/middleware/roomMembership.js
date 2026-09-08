const Room = require("../models/room");
const requireRoomMember = async (req, res, next) => {
  try {
    const roomId = req.params.roomId || req.params.id;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    const isMember = room.members.some(
      (m) => m.toString() === req.user._id.toString(),
    );
    if (!isMember)
      return res.status(403).json({ message: "Not a member of this room" });
    req.room = room;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking room membership" });
  }
};
module.exports = { requireRoomMember };
