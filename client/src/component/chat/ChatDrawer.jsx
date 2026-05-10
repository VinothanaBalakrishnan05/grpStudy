import { useState, useEffect, useRef } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/authContext";
import api from "../../api/axios";

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatDrawer = ({ roomId, onClose }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const bottomRef = useRef(null);

  // load message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/messages/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [roomId]);

  // socket events
  useEffect(() => {
    if (!socket) return;

    // join room
    socket.emit("join-room", roomId);

    // receive new message
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // message deleted
    socket.on("message-deleted", (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    return () => {
      socket.off("receive-message");
      socket.off("message-deleted");
    };
  }, [socket, roomId]);

  // auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit("send-message", { roomId, content: input });
    setInput("");
  };

  const deleteMessage = (messageId) => {
    if (!socket) return;
    socket.emit("delete-message", { roomId, messageId });
  };

  return (
    <div className="fixed bottom-0 left-60 right-0 h-72 bg-white border-t border-[#E8EBF0] flex flex-col shadow-lg z-40">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 border-b border-[#E8EBF0] shrink-0">
        <p className="text-sm font-semibold text-[#111827]">Group Chat</p>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
        >
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
        {loading && (
          <p className="text-xs text-[#9CA3AF] text-center mt-4">
            Loading messages...
          </p>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-xs text-[#9CA3AF] text-center mt-4">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId._id === user.id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              onMouseEnter={() => setHoveredId(msg._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex flex-col gap-0.5 max-w-xs">

                {/* Sender name + time */}
                <div className={`flex items-center gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                  {!isMe && (
                    <span className="text-[11px] font-semibold text-indigo-600">
                      {msg.senderId.name}
                    </span>
                  )}
                  <span className="text-[10px] text-[#9CA3AF]">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>

                {/* Message bubble + delete */}
                <div className="flex items-center gap-2">
                  {isMe && hoveredId === msg._id && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="p-1 rounded text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div className={`px-3 py-2 rounded-xl text-sm ${
                    isMe
                      ? "bg-indigo-600 text-white"
                      : "bg-[#F0F2F7] text-[#111827]"
                  }`}>
                    {msg.content}
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-[#E8EBF0] flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-[#F8F9FC] border border-[#E8EBF0] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 transition"
        />
        <button
          onClick={sendMessage}
          className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Send size={15} />
        </button>
      </div>

    </div>
  );
};

export default ChatDrawer;