import { useState } from "react";
import { X, Send, Bot, ChevronDown } from "lucide-react";
import api from "../../api/axios";

const MODELS = [
  { value: "phi3:mini", label: "Phi3 Mini (faster)" },
  { value: "mistral:7b-instruct-q4_K_M", label: "Mistral 7B (smarter)" },
];

const AIPanel = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am your AI study assistant. Ask me anything about your topics.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("phi3:mini");
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/chatbot", {
        messages: updatedMessages.filter((m) => m.role !== "assistant" || m.content !== messages[0].content),
        model,
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: res.data.message },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-14 right-0 bottom-0 w-80 bg-white border-l border-[#E8EBF0] flex flex-col shadow-xl z-40">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-[#E8EBF0] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Bot size={15} className="text-indigo-600" />
          </div>
          <p className="text-sm font-semibold text-[#111827]">AI Assistant</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
        >
          <X size={15} />
        </button>
      </div>

      {/* Model Selector */}
      <div className="px-4 py-2 border-b border-[#E8EBF0] shrink-0">
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-[#F8F9FC] border border-[#E8EBF0] rounded-lg px-3 py-1.5 text-xs text-[#6B7280] focus:outline-none appearance-none cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-indigo-600 text-white"
                : "bg-[#F0F2F7] text-[#111827]"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#F0F2F7] px-4 py-2.5 rounded-xl">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#E8EBF0] flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
          className="flex-1 bg-[#F8F9FC] border border-[#E8EBF0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </div>

    </div>
  );
};

export default AIPanel;