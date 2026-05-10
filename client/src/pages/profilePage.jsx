import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft, Eye, EyeOff, LogOut } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // edit name
  const [name, setName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  // avatar
  const [avatarLoading, setAvatarLoading] = useState(false);

  // password
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState("");
  const [passError, setPassError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setProfile(res.data.user);
      setName(res.data.user.name);
      setRooms(res.data.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameError("");
    setNameSuccess("");
    setNameLoading(true);
    try {
      const res = await api.put("/api/users/profile", { name });
      setProfile(res.data.user);
      updateUser({ ...user, name: res.data.user.name });
      setNameSuccess("Name updated successfully");
    } catch (err) {
      setNameError(err.response?.data?.message || "Something went wrong");
    } finally {
      setNameLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.put("/api/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.user);
      updateUser({ ...user, avatar: res.data.user.avatar });
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      return setPassError("New passwords do not match");
    }

    if (passwords.newPassword.length < 8) {
      return setPassError("New password must be at least 8 characters");
    }

    setPassLoading(true);
    try {
      await api.put("/api/users/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPassSuccess("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPassError(err.response?.data?.message || "Something went wrong");
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <p className="text-indigo-600 font-medium">Loading profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Topbar */}
      <header className="h-14 bg-white border-b border-[#E8EBF0] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-bold text-[#111827]">Profile</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
        >
          <LogOut size={13} />
          Logout
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Avatar + Name Section */}
        <div className="bg-white rounded-xl border border-[#E8EBF0] p-6">
          <h2 className="text-sm font-semibold text-[#111827] mb-6">
            Personal Info
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E8EBF0]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold border-2 border-[#E8EBF0]">
                  {profile?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition">
                {avatarLoading ? (
                  <span className="text-white text-xs">...</span>
                ) : (
                  <Camera size={13} className="text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-base font-semibold text-[#111827]">{profile?.name}</p>
              <p className="text-sm text-[#9CA3AF]">{profile?.email}</p>
            </div>
          </div>

          {/* Edit Name */}
          <form onSubmit={handleNameUpdate} className="flex flex-col gap-3">
            <label className="text-xs font-medium text-[#6B7280]">
              Display Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-[#F8F9FC] border border-[#E8EBF0] rounded-lg px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-indigo-400 transition"
              />
              <button
                type="submit"
                disabled={nameLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {nameLoading ? "Saving..." : "Save"}
              </button>
            </div>
            {nameSuccess && <p className="text-green-600 text-xs">{nameSuccess}</p>}
            {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-xl border border-[#E8EBF0] p-6">
          <h2 className="text-sm font-semibold text-[#111827] mb-6">
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">

            {/* Current Password */}
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full bg-[#F8F9FC] border border-[#E8EBF0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-600"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full bg-[#F8F9FC] border border-[#E8EBF0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-600"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full bg-[#F8F9FC] border border-[#E8EBF0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {passSuccess && <p className="text-green-600 text-xs">{passSuccess}</p>}
            {passError && <p className="text-red-500 text-xs">{passError}</p>}

            <button
              type="submit"
              disabled={passLoading}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {passLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Rooms Section */}
        <div className="bg-white rounded-xl border border-[#E8EBF0] p-6">
          <h2 className="text-sm font-semibold text-[#111827] mb-4">
            My Rooms ({rooms.length})
          </h2>

          {rooms.length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">
              You are not in any rooms yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => navigate(`/room/${room._id}`)}
                  className="flex items-center justify-between px-4 py-3 bg-[#F8F9FC] rounded-lg border border-[#E8EBF0] hover:border-indigo-200 hover:bg-[#EEF2FF] cursor-pointer transition group"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111827] group-hover:text-indigo-600 transition">
                      {room.name}
                    </p>
                    {room.description && (
                      <p className="text-xs text-[#9CA3AF]">{room.description}</p>
                    )}
                  </div>
                  <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    {room.roomCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;