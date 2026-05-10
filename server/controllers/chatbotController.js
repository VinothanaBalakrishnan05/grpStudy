const axios = require("axios");

const chat = async (req, res) => {
  const { messages, model } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ message: "Messages are required" });
  }

  try {
    const response = await axios.post(
      "http://localhost:11434/api/chat",
      {
        model: model || "phi3:mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful study assistant. Help students understand topics, clarify doubts, and explain concepts clearly and concisely.",
          },
          ...messages,
        ],
        stream: false,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      }
    );

    res.status(200).json({
      message: response.data.message.content,
    });
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "Ollama is not running. Please start Ollama on your machine.",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chat };