import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/axios";

const generateRoomCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const all = letters + numbers;

  let code = "";
  code += letters[Math.floor(Math.random() * letters.length)];
  code += letters[Math.floor(Math.random() * letters.length)];
  code += numbers[Math.floor(Math.random() * numbers.length)];
  code += numbers[Math.floor(Math.random() * numbers.length)];

  for (let i = 0; i < 2; i++) {
    code += all[Math.floor(Math.random() * all.length)];
  }

  return code.split("").sort(() => Math.random() - 0.5).join("");
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("create");

  // create room state
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [roomCode, setRoomCode] = useState(generateRoomCode());
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // join room state
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);
    try {
      const res = await api.post("/api/rooms/create", {
        name: roomName,
        description,
        roomCode,
      });
      navigate(`/room/${res.data.room._id}`);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Something went wrong");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setJoinError("");
    setJoinLoading(true);
    try {
      const res = await api.post("/api/rooms/join", { roomCode: joinCode });
      navigate(`/room/${res.data.room._id}`);
    } catch (err) {
      setJoinError(err.response?.data?.message || "Something went wrong");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-10 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">StudyTogether</h1>
        <div className="flex items-center gap-4">
          <button
             onClick={() => navigate("/profile")}
             className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold hover:bg-indigo-200 transition"
             title={user?.name}
          >
            {user?.avatar ? (
              <img
              src={user.avatar}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
            user?.name?.[0]?.toUpperCase()
            )}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex flex-col items-center justify-center mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

          {/* Toggle Tabs */}
          <div className="flex rounded-lg overflow-hidden border border-indigo-200 mb-6">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                activeTab === "create"
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Create Room
            </button>
            <button
              onClick={() => setActiveTab("join")}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                activeTab === "join"
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Join Room
            </button>
          </div>

          {/* Create Room Form */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateRoom} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">Create a Room</h2>

              {createError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {createError}
                </p>
              )}

              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
                required
              />

              <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
              />

              {/* Room Code */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={roomCode}
                  readOnly
                  className="border border-gray-300 rounded-lg px-4 py-3 flex-1 bg-gray-50 font-mono tracking-widest text-indigo-600 font-bold"
                />
                <button
                  type="button"
                  onClick={() => setRoomCode(generateRoomCode())}
                  className="px-3 py-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition text-sm font-semibold"
                >
                  🔄
                </button>
              </div>
              <p className="text-xs text-gray-400 -mt-2">
                Share this code with friends to join your room
              </p>

              <button
                type="submit"
                disabled={createLoading}
                className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {createLoading ? "Creating..." : "Create Room"}
              </button>
            </form>
          )}

          {/* Join Room Form */}
          {activeTab === "join" && (
            <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">Join a Room</h2>

              {joinError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {joinError}
                </p>
              )}

              <input
                type="text"
                placeholder="Enter Room Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 font-mono tracking-widest uppercase"
                maxLength={6}
                required
              />

              <button
                type="submit"
                disabled={joinLoading}
                className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {joinLoading ? "Joining..." : "Join Room"}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;