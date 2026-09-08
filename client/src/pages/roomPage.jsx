import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/authContext";
import TopBar from "../component/room/TopBar";
import Sidebar from "../component/room/SideBar";
import ResourceList from "../component/resource/ResourceList";
import TopicChecklist from "../component/topics/TopicsChecklist";
import ChatDrawer from "../component/chat/ChatDrawer";
import AIPanel from "../component/ai/AIPanel";

const RoomPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("resources");
  const [myProgress, setMyProgress] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [allProgress, setAllProgress] = useState({});

  useEffect(() => {
    fetchRoom();
    fetchAllProgress();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const res = await api.get(`/api/rooms/${id}`);
      setRoom(res.data);
    } catch (err) {
      setError("Room not found or you are not a member");
    } finally {
      setLoading(false);
    }
  };
  const fetchAllProgress = async () => {
  try {
    const res = await api.get(`/api/topics/${id}/progress`);
    setAllProgress(res.data);
  } catch (err) {
    console.error(err);
  }
};

  const handleLeave = async () => {
    try {
      await api.post(`/api/rooms/${id}/leave`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async () => {
  if (!window.confirm("Delete this room permanently? This can't be undone.")) {
    return;
  }
  try {
    await api.delete(`/api/rooms/${id}`);
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <p className="text-indigo-600 font-medium">Loading room...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <p className="text-red-500 font-medium">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Top Bar */}
      <TopBar room={room} onLeave={handleLeave} onDelete={handleDelete}  isCreator={room.createdBy === user.id}/>
        
    
      
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          members={room.members}
          myProgress={myProgress}
          allProgress={allProgress}
          currentUserId={user.id}
          onChatOpen={() => setChatOpen(true)}
          onAiOpen={() => setAiOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeSection === "resources" && (
            <ResourceList roomId={id} userId={user.id} />
          )}
          {activeSection === "topics" && (
            <TopicChecklist roomId={id} onProgressChange={setMyProgress} />
          )}
        </main>

      </div>

      {/* Chat Drawer */}
      {chatOpen && (
        <ChatDrawer
          roomId={id}
          user={user}
          onClose={() => setChatOpen(false)}
        />
      )}

      {/* AI Panel */}
      {aiOpen && (
        <AIPanel onClose={() => setAiOpen(false)} />
      )}

    </div>
  );
};

export default RoomPage;