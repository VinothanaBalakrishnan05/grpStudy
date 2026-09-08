const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Room = require("../models/room");
const { canDeleteMessage } = require("../utils/permissions");

const initChatSocket = (io) => {
  // authenticate socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name}`);
    ``;

    // JOIN ROOM
    // JOIN ROOM
    socket.on("join-room", async (roomId) => {
      try {
        const room = await Room.findById(roomId);

        if (!room) {
          return socket.emit("error", {
            message: "Room not found",
          });
        }

        const isMember = room.members.some(
          (memberId) => memberId.toString() === socket.user._id.toString(),
        );

        if (!isMember) {
          return socket.emit("error", {
            message: "You are not a member of this room",
          });
        }

        socket.join(roomId);

        console.log(`${socket.user.name} joined room ${roomId}`);
      } catch (err) {
        console.error("Join room error:", err.message);

        socket.emit("error", {
          message: "Unable to join room",
        });
      }
    });

    // SEND MESSAGE
    socket.on("send-message", async ({ roomId, content }) => {
      try {
        // save to DB
        const message = await Message.create({
          roomId,
          senderId: socket.user._id,
          content,
        });

        // populate sender name
        const populated = await message.populate("senderId", "name");

        // broadcast to everyone in room
        io.to(roomId).emit("receive-message", {
          _id: populated._id,
          content: populated.content,
          senderId: {
            _id: populated.senderId._id,
            name: populated.senderId.name,
          },
          createdAt: populated.createdAt,
        });
      } catch (err) {
        console.error("Send message error:", err.message);
      }
    });

    // DELETE MESSAGE
    socket.on("delete-message", async ({ roomId, messageId }) => {
      try {
        const message = await Message.findById(messageId);

        if (!message) return;

        if (!canDeleteMessage(socket.user, message)) return;
        await message.deleteOne();

        // broadcast deletion to room
        io.to(roomId).emit("message-deleted", messageId);
      } catch (err) {
        console.error("Delete message error:", err.message);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = initChatSocket;
