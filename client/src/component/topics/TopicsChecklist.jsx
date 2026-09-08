import { useState, useEffect } from "react";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import api from "../../api/axios";

const TopicChecklist = ({ roomId, onProgressChange }) => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [roomId]);

  useEffect(() => {
    const done = topics.filter((t) => t.done).length;
    const pct = topics.length === 0 ? 0 : Math.round((done / topics.length) * 100);
    onProgressChange(pct);
  }, [topics]);

  const fetchTopics = async () => {
    try {
      const res = await api.get(`/api/topics/${roomId}`);
      setTopics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTopic = async () => {
    if (!newTopic.trim()) return;
    try {
      const res = await api.post(`/api/topics/${roomId}`, { text: newTopic.trim() });
      setTopics([...topics, res.data]);
      setNewTopic("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTopic = async (topicId) => {
    setTopics(topics.map((t) => (t._id === topicId ? { ...t, done: !t.done } : t)));
    try {
      await api.patch(`/api/topics/${topicId}/toggle`);
    } catch (err) {
      console.error(err);
      fetchTopics();
    }
  };

  const deleteTopic = async (topicId) => {
    const prev = topics;
    setTopics(topics.filter((t) => t._id !== topicId));
    try {
      await api.delete(`/api/topics/${topicId}`);
    } catch (err) {
      console.error(err);
      setTopics(prev);
    }
  };

  const done = topics.filter((t) => t.done).length;

  if (loading) {
    return <p className="text-sm text-[#9CA3AF]">Loading topics...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-bold text-[#111827]">My Topics</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {done} of {topics.length} completed
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a topic to study..."
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTopic()}
          className="flex-1 bg-white border border-[#E8EBF0] rounded-lg px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-indigo-400 transition"
        />
        <button
          onClick={addTopic}
          className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {topics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
            <CheckSquare size={22} className="text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-[#111827] mb-1">No topics yet</p>
          <p className="text-xs text-[#9CA3AF] max-w-xs">
            Add topics you need to study and tick them off as you go
          </p>
        </div>
      )}

      {topics.length > 0 && (
        <div className="flex flex-col gap-2">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="flex items-center gap-3 bg-white border border-[#E8EBF0] rounded-lg px-4 py-3 group hover:border-indigo-100 transition"
            >
              <input
                type="checkbox"
                checked={topic.done}
                onChange={() => toggleTopic(topic._id)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer shrink-0"
              />
              <span className={`flex-1 text-sm ${topic.done ? "line-through text-[#9CA3AF]" : "text-[#111827]"}`}>
                {topic.text}
              </span>
              <button
                onClick={() => deleteTopic(topic._id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#9CA3AF] hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicChecklist;