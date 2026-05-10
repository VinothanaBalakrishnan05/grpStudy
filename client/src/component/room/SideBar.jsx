import { Paperclip, CheckSquare, MessageCircle, Bot } from "lucide-react";
import MemberItem from "./MemberItem";

const navItems = [
  { id: "resources", label: "Resources", icon: Paperclip },
  { id: "topics", label: "My Topics", icon: CheckSquare },
];

const Sidebar = ({
  activeSection,
  setActiveSection,
  members,
  myProgress,
  currentUserId,
  onChatOpen,
  onAiOpen,
}) => {
  return (
    <aside className="w-60 bg-[#F0F2F7] border-r border-[#E8EBF0] flex flex-col shrink-0">

      {/* Nav Items */}
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
              activeSection === id
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-[#6B7280] hover:bg-[#E8EBF0]"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

        {/* Chat Button */}
        <button
          onClick={onChatOpen}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#E8EBF0] transition text-left"
        >
          <MessageCircle size={16} />
          Chat
        </button>

        {/* AI Button */}
        <button
          onClick={onAiOpen}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#E8EBF0] transition text-left"
        >
          <Bot size={16} />
          AI Assistant
        </button>
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-[#E8EBF0] my-1" />

      {/* Members */}
      <div className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-2 mb-2">
          Members ({members.length})
        </p>
        {members.map((member) => (
          <MemberItem
            key={member._id}
            member={member}
            isMe={member._id === currentUserId}
            progress={member._id === currentUserId ? myProgress : 0}
          />
        ))}
      </div>

    </aside>
  );
};

export default Sidebar;