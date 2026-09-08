const Topic = require("../models/topic");

// GET MY TOPICS FOR A ROOM
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      roomId: req.params.roomId,
      userId: req.user._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD A TOPIC
const addTopic = async (req, res) => {
  const { text } = req.body;
  try {
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Topic text is required" });
    }
    const topic = await Topic.create({
      roomId: req.params.roomId,
      userId: req.user._id,
      text: text.trim(),
    });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE DONE
const toggleTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({
      _id: req.params.topicId,
      userId: req.user._id,
    });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    topic.done = !topic.done;
    await topic.save();
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE A TOPIC
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({
      _id: req.params.topicId,
      userId: req.user._id,
    });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(200).json({ message: "Topic deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET EVERY MEMBER'S PROGRESS % FOR A ROOM (for the Members panel)
const getRoomProgress = async (req, res) => {
  try {
    const topics = await Topic.find({ roomId: req.params.roomId });

    const counts = {};
    topics.forEach((t) => {
      const uid = t.userId.toString();
      if (!counts[uid]) counts[uid] = { total: 0, done: 0 };
      counts[uid].total += 1;
      if (t.done) counts[uid].done += 1;
    });

    const progress = {};
    Object.keys(counts).forEach((uid) => {
      const { total, done } = counts[uid];
      progress[uid] = total === 0 ? 0 : Math.round((done / total) * 100);
    });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTopics,
  addTopic,
  toggleTopic,
  deleteTopic,
  getRoomProgress,
};