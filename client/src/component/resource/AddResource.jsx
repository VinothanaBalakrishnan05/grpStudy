import { useState } from "react";
import api from "../../api/axios";
import { X, Link2, FolderOpen } from "lucide-react";

const AddResource = ({ roomId, onClose, onResourceAdded }) => {
  const [activeTab, setActiveTab] = useState("link");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [linkData, setLinkData] = useState({ title: "", url: "", type: "link", tags: "" });
  const [fileData, setFileData] = useState({ title: "", tags: "" });
  const [file, setFile] = useState(null);

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/api/resources/${roomId}/link`, linkData);
      onResourceAdded(res.data.resource);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please select a file");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", fileData.title);
      formData.append("tags", fileData.tags);
      const res = await api.post(`/api/resources/${roomId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResourceAdded(res.data.resource);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Add Resource</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-indigo-200 mb-4">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition ${
              activeTab === "link"
                ? "bg-indigo-600 text-white"
                : "text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <Link2 size={14} /> Link
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition ${
              activeTab === "file"
                ? "bg-indigo-600 text-white"
                : "text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <FolderOpen size={14} /> File
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        {/* Link Form */}
        {activeTab === "link" && (
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Title" value={linkData.title}
              onChange={(e) => setLinkData({ ...linkData, title: e.target.value })}
              className={inputClass} required />
            <input type="url" placeholder="URL" value={linkData.url}
              onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
              className={inputClass} required />
            <select value={linkData.type}
              onChange={(e) => setLinkData({ ...linkData, type: e.target.value })}
              className={inputClass}>
              <option value="link">Link</option>
              <option value="video">Video</option>
            </select>
            <input type="text" placeholder="Tags (comma separated) e.g. unit1,important"
              value={linkData.tags}
              onChange={(e) => setLinkData({ ...linkData, tags: e.target.value })}
              className={inputClass} />
            <button onClick={handleLinkSubmit} disabled={loading}
              className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? "Adding..." : "Add Link"}
            </button>
          </div>
        )}

        {/* File Form */}
        {activeTab === "file" && (
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Title" value={fileData.title}
              onChange={(e) => setFileData({ ...fileData, title: e.target.value })}
              className={inputClass} required />

            {/* Custom styled file picker — no ugly browser border */}
            <label className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-indigo-50 rounded-lg cursor-pointer text-sm text-gray-500 hover:text-indigo-600 transition">
              <FolderOpen size={16} />
              <span className="truncate flex-1">
                {file ? file.name : "Choose a file..."}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.mp4,.mkv,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            <input type="text" placeholder="Tags (comma separated) e.g. unit1,important"
              value={fileData.tags}
              onChange={(e) => setFileData({ ...fileData, tags: e.target.value })}
              className={inputClass} />
            <button onClick={handleFileSubmit} disabled={loading}
              className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AddResource;