import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";

// ── mouse hook ────────────────────────────────────────────────────────────────
function useMouse() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

// ── blob ──────────────────────────────────────────────────────────────────────
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

// ── main ──────────────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const mouse = useMouse();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");

  const decos = useMemo(() => [
    { emoji: "📖", x: 5,  y: 20, dur: 7,   delay: 0.3 },
    { emoji: "✏️", x: 90, y: 10, dur: 9,   delay: 1.1 },
    { emoji: "🔭", x: 93, y: 70, dur: 6,   delay: 0.7 },
    { emoji: "📐", x: 4,  y: 75, dur: 11,  delay: 2.0 },
    { emoji: "💡", x: 78, y: 90, dur: 8,   delay: 0.5 },
    { emoji: "🎓", x: 18, y: 90, dur: 10,  delay: 1.5 },
    { emoji: "🧪", x: 50, y: 4,  dur: 7.5, delay: 2.4 },
  ], []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          --bg: #f5f3ff;
          --text: #1e1b4b;
        }

        .login-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* blobs */
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

        /* deco floaters */
        .deco-wrap {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
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

        /* card */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 460px;
          margin: 24px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1.5px solid rgba(165,180,252,0.4);
          border-radius: 28px;
          padding: 48px 44px;
          box-shadow: 0 24px 64px rgba(79,70,229,0.12), 0 4px 16px rgba(79,70,229,0.06);
          animation: cardIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* logo link */
        .card-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--indigo);
          letter-spacing: -0.02em;
          display: inline-block;
          margin-bottom: 28px;
          position: relative;
          text-decoration: none;
        }
        .card-logo::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, var(--indigo), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,100% { opacity: 0.3; transform: scaleX(0.3); }
          50%      { opacity: 1;   transform: scaleX(1); }
        }

        /* heading */
        .card-heading {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .card-sub {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 32px;
        }

        /* error */
        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 0.85rem;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 18px;
          animation: fadeUp 0.3s ease both;
        }

        /* form */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        .input-wrap {
          position: relative;
        }
        .input-wrap input {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(99,102,241,0.2);
          background: rgba(255,255,255,0.8);
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-wrap input::placeholder { color: #9ca3af; }
        .input-wrap input:focus {
          border-color: var(--indigo);
          background: white;
          box-shadow: 0 0 0 4px rgba(79,70,229,0.1);
        }
        .input-wrap input.has-icon { padding-right: 46px; }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: var(--indigo); }

        /* floating label effect */
        .input-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--indigo);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 5px;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .input-field-wrap.active .input-label {
          opacity: 1;
          transform: translateY(0);
        }

        /* submit btn */
        .submit-btn {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          padding: 14px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--indigo), #7c3aed);
          color: white;
          box-shadow: 0 8px 24px rgba(79,70,229,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
          animation: ctaPulse 2.8s ease-in-out infinite;
        }
        @keyframes ctaPulse {
          0%,100% { box-shadow: 0 8px 24px rgba(79,70,229,0.35); }
          50%      { box-shadow: 0 8px 36px rgba(79,70,229,0.6); }
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; animation: none; }

        /* ripple */
        .ripple {
          position: absolute;
          width: 10px; height: 10px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          transform: translate(-50%,-50%) scale(0);
          animation: rippleOut 0.6s ease-out forwards;
          pointer-events: none;
        }
        @keyframes rippleOut {
          to { transform: translate(-50%,-50%) scale(20); opacity: 0; }
        }

        /* divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: #d1d5db;
          font-size: 0.8rem;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(99,102,241,0.15);
        }

        /* footer text */
        .card-footer {
          text-align: center;
          font-size: 0.88rem;
          color: #6b7280;
          margin-top: 4px;
        }
        .card-footer a {
          color: var(--indigo);
          font-weight: 600;
          text-decoration: none;
        }
        .card-footer a:hover { text-decoration: underline; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* blobs */}
      <div className="blob-layer">
        <Blob cx={10} cy={15} rx={460} ry={360} color="rgba(165,180,252,0.5)"  dur={9}  mouse={mouse} />
        <Blob cx={88} cy={75} rx={500} ry={400} color="rgba(196,181,253,0.45)" dur={12} mouse={mouse} />
        <Blob cx={50} cy={95} rx={380} ry={280} color="rgba(186,230,253,0.4)"  dur={10} mouse={mouse} />
        <Blob cx={80} cy={10} rx={280} ry={240} color="rgba(167,243,208,0.35)" dur={14} mouse={mouse} />
      </div>

      {/* deco floaters */}
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

      {/* card */}
      <div className="login-card">
        <Link to="/" className="card-logo">StudyTogether</Link>

        <h1 className="card-heading">Welcome back 👋</h1>
        <p className="card-sub">Sign in to your study space</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* email */}
            <div className={`input-field-wrap ${focused === "email" || formData.email ? "active" : ""}`}>
              <label className="input-label">Email</label>
              <div className="input-wrap">
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                />
              </div>
            </div>

            {/* password */}
            <div className={`input-field-wrap ${focused === "password" || formData.password ? "active" : ""}`}>
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("password")}
                  className="has-icon"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div className="divider">or</div>

        <p className="card-footer">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </>
  );
};

export default Login;