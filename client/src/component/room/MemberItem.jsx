const MemberItem = ({ member, isMe, progress }) => {
  return (
    <div className="px-2 py-2 rounded-lg hover:bg-[#E8EBF0] transition">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
            {member.name[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-[#111827]">
            {member.name} {isMe && (
              <span className="text-xs text-[#9CA3AF] font-normal">(you)</span>
            )}
          </span>
        </div>
        <span className="text-xs font-semibold text-indigo-600">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E8EBF0] rounded-full h-1.5">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default MemberItem;