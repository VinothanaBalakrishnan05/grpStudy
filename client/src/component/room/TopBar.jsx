import { ArrowLeft, Copy, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const TopBar = ({ room, onLeave }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← add this

  const copyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
  };

  return (
    <header className="h-14 bg-white border-b border-[#E8EBF0] px-6 flex items-center justify-between shrink-0">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#111827] leading-tight">
            {room.name}
          </h1>
          {room.description && (
            <p className="text-xs text-[#9CA3AF]">{room.description}</p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] text-indigo-600 rounded-lg text-xs font-mono font-bold hover:bg-indigo-100 transition"
        >
          <Copy size={13} />
          {room.roomCode}
        </button>

        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
        >
          <LogOut size={13} />
          Leave
        </button>

        {/* Profile Avatar → goes to profile page */}
        <button
          onClick={() => navigate("/profile")}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E8EBF0] hover:border-indigo-300 transition"
          title={user?.name}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
        </button>
      </div>

    </header>
  );
};

export default TopBar;