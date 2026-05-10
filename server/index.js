const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const messageRoutes = require("./routes/messageRoutes");
const initChatSocket = require("./socket/chatSocket");
const userRoutes = require("./routes/userRoutes");
const chatbotRoutes=require("./routes/chatbotRoutes");


dbConnect();

const app = express();
const server = http.createServer(app); // ← right after app

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chatbot",chatbotRoutes);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  },
});

initChatSocket(io);

const port = process.env.PORT || 5000;
server.listen(port, () => {  // ← server.listen not app.listen
  console.log(`server running on port ${port}`);
});