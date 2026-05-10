const express=require("express");
const router=express.Router();
const { createRoom, joinRoom,getMyRooms,getRoom,leaveRoom} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createRoom);
router.post("/join", protect, joinRoom);
router.get("/my-rooms", protect, getMyRooms);
router.get("/:id", protect, getRoom);
router.post("/:id/leave", protect, leaveRoom);

module.exports=router;