import { Users } from "lucide-react";

const getStatusConfig = (progress) => {
  if (progress === 100) return { label: "Completed!", color: "#22c55e", trail: "#dcfce7", textColor: "#16a34a" };
  if (progress >= 75)   return { label: "Almost there!", color: "#84cc16", trail: "#f7fee7", textColor: "#65a30d" };
  if (progress >= 50)   return { label: "Halfway 🔥", color: "#f59e0b", trail: "#fef9c3", textColor: "#d97706" };
  if (progress > 0)     return { label: "Studying...", color: "#f97316", trail: "#fff7ed", textColor: "#ea580c" };
  return { label: "Not started", color: "#d1d5db", trail: "#f3f4f6", textColor: "#9ca3af" };
};

const RingProgress = ({ progress, size = 70 }) => {
  const segments = 20;
  const radius = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const { color, trail, textColor } = getStatusConfig(progress);
  const filled = Math.round((progress / 100) * segments);

  const segmentPath = (i) => {
    const gap = 0.05;
    const arcAngle = (2 * Math.PI) / segments - gap;
    const startAngle = -Math.PI / 2 + (i * 2 * Math.PI) / segments;
    const endAngle = startAngle + arcAngle;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <path
          key={i}
          d={segmentPath(i)}
          fill="none"
          stroke={i < filled ? color : trail}
          strokeWidth="5"
          strokeLinecap="round"
          style={{ transition: `stroke 0.3s ease ${i * 25}ms` }}
        />
      ))}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "12px",
          fontWeight: "700",
          fill: textColor,
          fontFamily: "inherit",
        }}
      >
        {progress}%
      </text>
    </svg>
  );
};

const MemberCard = ({ member, progress, isMe }) => {
  const { label, textColor, color } = getStatusConfig(progress);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 10px",
        borderRadius: "14px",
        background: isMe ? `${color}14` : "transparent",
        border: `1.5px solid ${isMe ? color + "40" : "transparent"}`,
        transition: "background 0.3s, border 0.3s",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <RingProgress progress={progress} size={68} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "14px",
            fontWeight: "600",
            color: "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.name}
          {isMe && (
            <span style={{ marginLeft: "5px", fontSize: "11px", opacity: 0.5, fontWeight: "400" }}>
              you
            </span>
          )}
        </p>
        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: "600",
            color: textColor,
            background: `${color}1A`,
            padding: "2px 9px",
            borderRadius: "99px",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

const MemberList = ({ members, myProgress, currentUserId }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <Users size={18} color="#6366f1" />
        <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Members</h2>
        <span style={{ marginLeft: "auto", fontSize: "13px", opacity: 0.45 }}>
          {members.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {members.map((member) => {
          const isMe = member._id === currentUserId;
          const progress = isMe ? myProgress : 0;
          return (
            <MemberCard
              key={member._id}
              member={member}
              progress={progress}
              isMe={isMe}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MemberList;