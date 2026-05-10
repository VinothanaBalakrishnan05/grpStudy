import { useState, useEffect } from "react";
import { FileText, Link2, Image, Video, File, Trash2, Plus } from "lucide-react";
import api from "../../api/axios";
import AddResource from "./AddResource";

const typeIcons = {
  link: Link2,
  video: Video,
  pdf: FileText,
  image: Image,
  docx: File,
};

const typeColors = {
  link: "text-blue-500 bg-blue-50",
  video: "text-red-500 bg-red-50",
  pdf: "text-orange-500 bg-orange-50",
  image: "text-green-500 bg-green-50",
  docx: "text-indigo-500 bg-indigo-50",
};

const ResourceList = ({ roomId, userId }) => {
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [roomId]);

  const fetchResources = async () => {
    try {
      const res = await api.get(`/api/resources/${roomId}`);
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, resourceId) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/resources/${resourceId}`);
      setResources(resources.filter((r) => r._id !== resourceId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResourceAdded = (newResource) => {
    setResources([...resources, newResource]);
    setShowModal(false);
  };

  const openResource = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-bold text-[#111827]">Resources</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {resources.length} {resources.length === 1 ? "item" : "items"} shared
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <Plus size={15} />
          Add Resource
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E8EBF0] p-4 animate-pulse">
              <div className="w-8 h-8 bg-gray-100 rounded-lg mb-3" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && resources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
            <FileText size={22} className="text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-[#111827] mb-1">No resources yet</p>
          <p className="text-xs text-[#9CA3AF] max-w-xs mb-4">
            Upload notes, share links or add files for your group to access anytime
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            <Plus size={15} />
            Add First Resource
          </button>
        </div>
      )}

      {/* Resource Grid */}
      {!loading && resources.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = typeIcons[resource.type] || File;
            const colorClass = typeColors[resource.type] || "text-gray-500 bg-gray-50";
            const isOwner = resource.uploadedBy._id === userId;
            const isHovered = hoveredId === resource._id;

            return (
              <div
                key={resource._id}
                onClick={() => openResource(resource.url)}
                onMouseEnter={() => setHoveredId(resource._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="bg-white rounded-xl border border-[#E8EBF0] p-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-indigo-100 relative group"
              >
                {/* Delete button — shows on hover, only for owner */}
                {isOwner && isHovered && (
                  <button
                    onClick={(e) => handleDelete(e, resource._id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                )}

                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorClass}`}>
                  <Icon size={17} />
                </div>

                {/* Title */}
                <p className="text-sm font-semibold text-[#111827] truncate mb-1">
                  {resource.title}
                </p>

                {/* Meta */}
                <p className="text-xs text-[#9CA3AF] mb-2">
                  by {resource.uploadedBy.name}
                </p>

                {/* Tags */}
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] bg-[#EEF2FF] text-indigo-600 px-2 py-0.5 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                    {resource.tags.length > 2 && (
                      <span className="text-[11px] text-[#9CA3AF]">
                        +{resource.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddResource
          roomId={roomId}
          onClose={() => setShowModal(false)}
          onResourceAdded={handleResourceAdded}
        />
      )}
    </div>
  );
};

export default ResourceList;