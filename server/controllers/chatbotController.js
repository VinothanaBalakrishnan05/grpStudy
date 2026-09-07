const axios = require("axios");

const chat = async (req, res) => {
  const { messages, model } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ message: "Messages are required" });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        model: model || "gemini-3.1-flash-lite",
        messages: [
          {
            role: "system",
            content: "You are a helpful study assistant. Help students understand topics, clarify doubts, and explain concepts clearly and concisely.",
          },
          ...messages,
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    res.status(200).json({
      message: response.data.choices[0].message.content,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.error?.message || "AI service error",
      });
    }
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ message: "AI request timed out" });
    }
    res.status(500).json({ message: "AI assistant is temporarily unavailable" });
  }
};

module.exports = { chat };