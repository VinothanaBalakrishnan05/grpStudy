const Room = require('../models/room');
const generateRoomCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const all = letters + numbers;

  // guarantee at least 2 letters and 2 numbers
  let code = "";
  code += letters[Math.floor(Math.random() * letters.length)];
  code += letters[Math.floor(Math.random() * letters.length)];
  code += numbers[Math.floor(Math.random() * numbers.length)];
  code += numbers[Math.floor(Math.random() * numbers.length)];

  // fill remaining 2 characters randomly from all
  for (let i = 0; i < 2; i++) {
    code += all[Math.floor(Math.random() * all.length)];
  }

  // shuffle the code so it's not always letters first
  code = code.split("").sort(() => Math.random() - 0.5).join("");

  return code;
};
const createRoom = async (req, res) => {
  const { name, description, roomCode } = req.body;

  try {
    if (!name || !roomCode) {
      return res.status(400).json({ message: "Room name and code are required" });
    }

    const room = await Room.create({
      name,
      description,
      roomCode,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Try again, regenerate the room code" });
    }
    res.status(500).json({ message: error.message });
  }
};
// JOIN ROOM
const joinRoom = async (req, res) => {
  const { roomCode } = req.body;

  try {
    if (!roomCode) {
      return res.status(400).json({ message: "Room code is required" });
    }

    // find room by code
    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: "Invalid room code" });
    }

    // check if already a member
    if (room.members.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already in this room" });
    }

    // add user to members
    room.members.push(req.user._id);
    await room.save();

    res.status(200).json({ message: "Joined room successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ROOMS USER IS IN
const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user._id });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  // GET SINGLE ROOM
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("members", "name");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // check if user is a member
    const isMember = room.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this room" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LEAVE ROOM
const leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // remove user from members
    room.members = room.members.filter(
      (m) => m.toString() !== req.user._id.toString()
    );
    await room.save();

    res.status(200).json({ message: "Left room successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { generateRoomCode, createRoom, joinRoom, getMyRooms,getRoom, leaveRoom };