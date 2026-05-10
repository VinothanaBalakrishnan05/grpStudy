import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── tiny hook: track mouse position ──────────────────────────────────────────
function useMouse() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

// ── floating blob ─────────────────────────────────────────────────────────────
function Blob({ cx, cy, rx, ry, color, dur, mouse }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const dx = mouse.x - window.innerWidth / 2;
    const dy = mouse.y - window.innerHeight / 2;
    setOffset({ x: dx * 0.02, y: dy * 0.02 });
  }, [mouse]);
  return (
    <div
      style={{
        position: "absolute",
        left: `${cx}%`,
        top: `${cy}%`,
        width: `${rx}px`,
        height: `${ry}px`,
        background: color,
        borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
        filter: "blur(70px)",
        transform: `translate(-50%,-50%) translate(${offset.x}px,${offset.y}px)`,
        transition: "transform 0.8s ease-out",
        animation: `blobFloat ${dur}s ease-in-out infinite`,
        opacity: 0.55,
      }}
    />
  );
}

// ── magnetic feature pill ─────────────────────────────────────────────────────
function FeaturePill({ label, delay, mouse }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("none");

  useEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
    const maxDist = 140;
    if (dist < maxDist) {
      const force = ((maxDist - dist) / maxDist) * 14;
      const angle = Math.atan2(mouse.y - cy, mouse.x - cx);
      setTransform(
        `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px) scale(1.08)`
      );
    } else {
      setTransform("translate(0,0) scale(1)");
    }
  }, [mouse]);

  return (
    <span
      ref={ref}
      className="pill"
      style={{
        animationDelay: `${delay}s`,
        transform,
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {label}
    </span>
  );
}

// ── animated letter title ────────────────────────────────────────────────────
function AnimTitle({ line1, line2 }) {
  const letters1 = line1.split("");
  const letters2 = line2.split("");
  return (
    <h2 className="hero-title">
      <span className="title-line">
        {letters1.map((ch, i) => (
          <span key={i} className="letter" style={{ animationDelay: `${i * 0.04}s` }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
      <span className="title-line accent-line">
        {letters2.map((ch, i) => (
          <span
            key={i}
            className="letter"
            style={{ animationDelay: `${(letters1.length + i) * 0.04 + 0.1}s` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </h2>
  );
}

// ── ripple button ─────────────────────────────────────────────────────────────
function RippleButton({ children, onClick, primary }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((rp) => rp.id !== id)), 600);
    onClick?.();
  };
  return (
    <button onClick={handleClick} className={primary ? "btn-primary" : "btn-outline"}>
      {children}
      {ripples.map((rp) => (
        <span key={rp.id} className="ripple" style={{ left: rp.x, top: rp.y }} />
      ))}
    </button>
  );
}

// ── main component ────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const mouse = useMouse();

  const decos = useMemo(() => [
    { emoji: "📖", x: 8,  y: 25, dur: 7,   delay: 0.3 },
    { emoji: "✏️", x: 88, y: 15, dur: 9,   delay: 1.1 },
    { emoji: "🔭", x: 92, y: 65, dur: 6,   delay: 0.7 },
    { emoji: "📐", x: 5,  y: 70, dur: 11,  delay: 2.0 },
    { emoji: "💡", x: 75, y: 88, dur: 8,   delay: 0.5 },
    { emoji: "🎓", x: 20, y: 88, dur: 10,  delay: 1.5 },
    { emoji: "🧪", x: 55, y: 5,  dur: 7.5, delay: 2.4 },
    { emoji: "🗒️", x: 40, y: 92, dur: 9.5, delay: 0.9 },
  ], []);

  const features = [
    { label: "📚 Share Resources", delay: 0 },
    { label: "💬 Group Chat", delay: 0.15 },
    { label: "🤖 AI Chatbot", delay: 0.3 },
    { label: "📅 Exam Planner", delay: 0.45 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --indigo: #4f46e5;
          --indigo-dark: #3730a3;
          --indigo-light: #818cf8;
          --lavender: #e0e7ff;
          --sky: #bae6fd;
          --mint: #a7f3d0;
          --bg: #f5f3ff;
          --text: #1e1b4b;
          --muted: #6366f1;
        }

        .page-wrap {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .blob-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes blobFloat {
          0%,100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
          33%      { border-radius: 40% 60% 45% 55% / 60% 40% 60% 40%; }
          66%      { border-radius: 55% 45% 65% 35% / 40% 55% 45% 60%; }
        }

        .navbar {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 60px;
        }
        .logo {
          font-family: 'Fraunces', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--indigo);
          letter-spacing: -0.02em;
          position: relative;
        }
        .logo::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--indigo), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,100% { opacity: 0.3; transform: scaleX(0.3) translateX(0); }
          50%      { opacity: 1;   transform: scaleX(1) translateX(0); }
        }

        .hero {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 24px 80px;
          gap: 28px;
        }

        .hero-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.6rem, 6vw, 5rem);
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.03em;
        }
        .title-line {
          display: block;
          margin: 0;
          padding: 0;
        }
        .accent-line {
          background: none;
          -webkit-text-fill-color: #1e1b4b;
          color: #1e1b4b;
        }
        .letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(30px) rotate(4deg);
          animation: letterIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes letterIn {
          to { opacity: 1; transform: translateY(0) rotate(0deg); }
        }

        .subtitle {
          color: #6b7280;
          font-size: 1.1rem;
          max-width: 500px;
          line-height: 1.7;
          animation: fadeUp 0.7s 0.6s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          animation: fadeUp 0.7s 0.8s ease both;
        }
        .pill {
          background: white;
          border: 1.5px solid rgba(99,102,241,0.2);
          color: #4338ca;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 100px;
          box-shadow: 0 4px 16px rgba(79,70,229,0.08);
          animation: floatPill 3.5s ease-in-out infinite;
          display: inline-block;
          cursor: default;
        }
        .pill:hover {
          background: linear-gradient(135deg, var(--lavender), white);
          border-color: var(--indigo-light);
          box-shadow: 0 8px 28px rgba(79,70,229,0.2);
        }
        @keyframes floatPill {
          0%,100% { transform: translateY(0px) scale(1); }
          50%      { transform: translateY(-6px) scale(1.02); }
        }

        .btn-row {
          display: flex;
          gap: 16px;
          animation: fadeUp 0.7s 1s ease both;
        }
        .btn-primary, .btn-outline {
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          padding: 14px 36px;
          border-radius: 14px;
          cursor: pointer;
          border: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--indigo), #7c3aed);
          color: white;
          box-shadow: 0 8px 24px rgba(79,70,229,0.35);
          animation: ctaPulse 2.8s ease-in-out infinite;
        }
        @keyframes ctaPulse {
          0%,100% { box-shadow: 0 8px 24px rgba(79,70,229,0.35); }
          50%      { box-shadow: 0 8px 36px rgba(79,70,229,0.6); }
        }
        .btn-primary:hover  { transform: translateY(-3px) scale(1.03); }
        .btn-outline {
          background: white;
          color: var(--indigo);
          border: 2px solid var(--indigo);
          box-shadow: 0 4px 14px rgba(79,70,229,0.1);
        }
        .btn-outline:hover { transform: translateY(-3px) scale(1.03); background: var(--lavender); }

        .ripple {
          position: absolute;
          width: 10px; height: 10px;
          background: rgba(255,255,255,0.45);
          border-radius: 50%;
          transform: translate(-50%,-50%) scale(0);
          animation: rippleOut 0.6s ease-out forwards;
          pointer-events: none;
        }
        .btn-outline .ripple { background: rgba(79,70,229,0.18); }
        @keyframes rippleOut {
          to { transform: translate(-50%,-50%) scale(18); opacity: 0; }
        }

        .deco-wrap {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .deco {
          position: absolute;
          font-size: 1.5rem;
          animation: decoFloat linear infinite;
          opacity: 0.18;
          user-select: none;
        }
        @keyframes decoFloat {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
          50%  { transform: translateY(-22px) rotate(12deg); opacity: 0.28; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="blob-layer">
          <Blob cx={15} cy={20} rx={480} ry={380} color="rgba(165,180,252,0.5)"  dur={9}  mouse={mouse} />
          <Blob cx={85} cy={70} rx={520} ry={420} color="rgba(196,181,253,0.45)" dur={12} mouse={mouse} />
          <Blob cx={50} cy={90} rx={400} ry={300} color="rgba(186,230,253,0.4)"  dur={10} mouse={mouse} />
          <Blob cx={75} cy={15} rx={300} ry={260} color="rgba(167,243,208,0.35)" dur={14} mouse={mouse} />
        </div>

        <div className="deco-wrap">
          {decos.map((d) => (
            <div
              key={d.emoji}
              className="deco"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                animationDuration: `${d.dur}s`,
                animationDelay: `${d.delay}s`,
              }}
            >
              {d.emoji}
            </div>
          ))}
        </div>

        <nav className="navbar">
          <div className="logo">StudyTogether</div>
          <RippleButton onClick={() => navigate("/login")}>Sign In</RippleButton>
        </nav>

        <main className="hero">
          <AnimTitle line1="Study Together," line2="Grow Together" />

          <p className="subtitle">
            Create study rooms, share resources, chat with friends, and track
            your progress — all in one delightful place.
          </p>

          <div className="pills">
            {features.map((f) => (
              <FeaturePill key={f.label} label={f.label} delay={f.delay} mouse={mouse} />
            ))}
          </div>

          <div className="btn-row">
            <RippleButton primary onClick={() => navigate("/login")}>
              Get Started →
            </RippleButton>
            <RippleButton onClick={() => navigate("/login")}>
              Sign In
            </RippleButton>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;