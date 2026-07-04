import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MusicStore } from "../../store/useMusicStore";
import { FloatingParticles } from "./CoreComponents";

const ARTISTS = [
  { name: "The Weeknd", genre: "R&B", emoji: "🎤" },
  { name: "Dua Lipa", genre: "Pop", emoji: "💃" },
  { name: "Travis Scott", genre: "Hip-Hop", emoji: "🔥" },
  { name: "Billie Eilish", genre: "Alt Pop", emoji: "🖤" },
  { name: "Arctic Monkeys", genre: "Indie Rock", emoji: "🎸" },
  { name: "Kendrick Lamar", genre: "Hip-Hop", emoji: "🎙" },
  { name: "Taylor Swift", genre: "Pop", emoji: "✨" },
  { name: "Harry Styles", genre: "Pop Rock", emoji: "🌈" },
  { name: "Drake", genre: "Hip-Hop", emoji: "👑" },
  { name: "Ariana Grande", genre: "Pop", emoji: "🎀" },
  { name: "Post Malone", genre: "Hip-Hop/Pop", emoji: "⚡" },
  { name: "SZA", genre: "R&B", emoji: "🌙" },
  { name: "Bad Bunny", genre: "Reggaeton", emoji: "🐰" },
  { name: "Olivia Rodrigo", genre: "Pop Rock", emoji: "💔" },
  { name: "Frank Ocean", genre: "R&B", emoji: "🌊" },
  { name: "Doja Cat", genre: "Pop/Rap", emoji: "🐱" },
];

const GENRES = [
  { name: "Pop", color: "#00F5D4", emoji: "🎵" },
  { name: "Hip-Hop", color: "#7B2CBF", emoji: "🎤" },
  { name: "Electronic", color: "#FF6B35", emoji: "⚡" },
  { name: "R&B", color: "#E040FB", emoji: "💜" },
  { name: "Rock", color: "#FF4757", emoji: "🎸" },
  { name: "Lo-Fi", color: "#4FC3F7", emoji: "☕" },
  { name: "Jazz", color: "#EAB308", emoji: "🎺" },
  { name: "Classical", color: "#10B981", emoji: "🎻" },
];

type AuthView = "landing" | "signin" | "signup" | "artists" | "genres" | "finishing";

// Animated wave bars for decoration
function WaveBars() {
  return (
    <div className="flex items-end gap-1 h-12">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full w-1"
          style={{ background: `hsl(${170 + i * 5}, 90%, 60%)`, opacity: 0.6 }}
          animate={{
            height: [
              `${12 + Math.sin(i * 0.8) * 8}px`,
              `${28 + Math.sin(i * 0.5) * 16}px`,
              `${14 + Math.sin(i * 1.2) * 10}px`,
            ],
          }}
          transition={{
            duration: 1.2 + i * 0.06,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.04,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function AuthLandingScreen({ store }: { store: MusicStore }) {
  const { createAccount, addToast, userProfile } = store;
  const [view, setView] = useState<AuthView>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset error on view change
  useEffect(() => { setError(""); }, [view]);

  const toggleArtist = (a: string) =>
    setSelectedArtists((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const toggleGenre = (g: string) =>
    setSelectedGenres((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate sign in — in real app this would hit an API
      createAccount(email.split("@")[0] || "Listener", email, []);
    }, 1400);
  };

  const handleSignupNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setView("artists");
  };

  const handleFinish = () => {
    setView("finishing");
    setTimeout(() => {
      createAccount(name, email, selectedArtists);
    }, 2200);
  };

  const inputClass = `
    w-full px-4 py-3.5 rounded-2xl text-sm text-white outline-none transition-all
    placeholder-white/25
  `;
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };
  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "rgba(0,245,212,0.5)");
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  // ── FINISHING ──────────────────────────────────────────────────────────────
  if (view === "finishing") {
    return (
      <FullscreenWrap>
        <motion.div
          className="flex flex-col items-center justify-center text-center px-6"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ rotate: [0, 20, -20, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome, {name}!
          </h2>
          <p className="text-white/40 text-sm mb-8">Setting up your personalized music universe...</p>
          <div className="w-56 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #00F5D4, #7B2CBF)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
          <p className="text-xs text-white/25 mt-3 font-mono">Initializing AI Core...</p>
        </motion.div>
      </FullscreenWrap>
    );
  }

  // ── GENRE SELECTION ────────────────────────────────────────────────────────
  if (view === "genres") {
    return (
      <FullscreenWrap>
        <SlidePanel title="Your Music Taste 🎶" subtitle="Pick the genres you love — AI will learn from this" step={3} total={3}>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre.name);
              return (
                <motion.button
                  key={genre.name}
                  onClick={() => toggleGenre(genre.name)}
                  className="relative py-5 rounded-2xl font-bold text-sm overflow-hidden"
                  style={{
                    background: isSelected ? `${genre.color}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isSelected ? `${genre.color}55` : "rgba(255,255,255,0.08)"}`,
                    boxShadow: isSelected ? `0 0 28px ${genre.color}25` : "none",
                  }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="text-2xl mb-1">{genre.emoji}</div>
                  <div style={{ color: isSelected ? genre.color : "rgba(255,255,255,0.55)" }}>{genre.name}</div>
                  {isSelected && (
                    <motion.div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold text-black"
                      style={{ background: genre.color }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <BackBtn onClick={() => setView("artists")} />
            <PrimaryBtn onClick={handleFinish}>
              🚀 Create My Account
            </PrimaryBtn>
          </div>
        </SlidePanel>
      </FullscreenWrap>
    );
  }

  // ── ARTIST SELECTION ───────────────────────────────────────────────────────
  if (view === "artists") {
    return (
      <FullscreenWrap>
        <SlidePanel
          title="Who Do You Vibe With? 🎤"
          subtitle={`Select your favorite artists — ${selectedArtists.length} selected`}
          step={2}
          total={3}
        >
          <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1 mb-6 custom-scrollbar">
            {ARTISTS.map((artist) => {
              const isSelected = selectedArtists.includes(artist.name);
              return (
                <motion.button
                  key={artist.name}
                  onClick={() => toggleArtist(artist.name)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left"
                  style={{
                    background: isSelected ? "rgba(0,245,212,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isSelected ? "rgba(0,245,212,0.4)" : "rgba(255,255,255,0.07)"}`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-lg flex-shrink-0">{artist.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: isSelected ? "#00F5D4" : "white" }}>{artist.name}</div>
                    <div className="text-[10px] text-white/30">{artist.genre}</div>
                  </div>
                  {isSelected && (
                    <motion.div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0"
                      style={{ background: "#00F5D4" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >✓</motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <BackBtn onClick={() => setView("signup")} />
            <PrimaryBtn onClick={() => setView("genres")}>
              Next: Genres →
            </PrimaryBtn>
          </div>
        </SlidePanel>
      </FullscreenWrap>
    );
  }

  // ── SIGN UP ────────────────────────────────────────────────────────────────
  if (view === "signup") {
    return (
      <FullscreenWrap>
        <SlidePanel title="Create Your Account ✨" subtitle="Join millions discovering music with AI" step={1} total={3}>
          <form onSubmit={handleSignupNext} className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
            <input
              type="password"
              placeholder="Create Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,71,87,0.12)", color: "#FF4757", border: "1px solid rgba(255,71,87,0.25)" }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </AnimatePresence>

            <PrimaryBtn type="submit">
              Continue: Pick Artists →
            </PrimaryBtn>
          </form>

          <p className="text-center text-xs text-white/25 mt-4">
            By signing up, you agree to our Terms & Privacy Policy
          </p>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs text-white/25">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <p className="text-center text-sm text-white/35">
            Already have an account?{" "}
            <button
              type="button"
              className="font-bold hover:underline"
              style={{ color: "#00F5D4" }}
              onClick={() => setView("signin")}
            >
              Sign In
            </button>
          </p>
          <BackBtn onClick={() => setView("landing")} className="mt-3 w-full justify-center" />
        </SlidePanel>
      </FullscreenWrap>
    );
  }

  // ── SIGN IN ────────────────────────────────────────────────────────────────
  if (view === "signin") {
    return (
      <FullscreenWrap>
        <SlidePanel title="Welcome Back 👋" subtitle="Sign in to continue your music journey">
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,71,87,0.12)", color: "#FF4757", border: "1px solid rgba(255,71,87,0.25)" }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </AnimatePresence>

            <PrimaryBtn type="submit" loading={loading}>
              {loading ? "Signing In..." : "Sign In →"}
            </PrimaryBtn>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs text-white/25">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <p className="text-center text-sm text-white/35">
            New here?{" "}
            <button
              type="button"
              className="font-bold hover:underline"
              style={{ color: "#00F5D4" }}
              onClick={() => setView("signup")}
            >
              Create Account
            </button>
          </p>
          <BackBtn onClick={() => setView("landing")} className="mt-3 w-full justify-center" />
        </SlidePanel>
      </FullscreenWrap>
    );
  }

  // ── LANDING (default) ──────────────────────────────────────────────────────
  return (
    <FullscreenWrap>
      <motion.div
        className="flex flex-col items-center justify-center text-center px-6 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="relative mb-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto relative"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,212,0.18), rgba(123,44,191,0.18))",
              border: "1.5px solid rgba(0,245,212,0.35)",
              boxShadow: "0 0 60px rgba(0,245,212,0.2), 0 0 120px rgba(123,44,191,0.1)",
            }}
          >
            🎵
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
              style={{ background: "#00F5D4", boxShadow: "0 0 12px #00F5D4" }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="text-5xl font-extrabold text-white mb-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Vibe<span style={{ color: "#00F5D4" }}>Lock</span>{" "}
          <span style={{ background: "linear-gradient(135deg,#7B2CBF,#E040FB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
        </motion.h1>

        <motion.p
          className="text-sm font-semibold mb-1"
          style={{ color: "#00F5D4", letterSpacing: "0.05em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          AI v2.0
        </motion.p>

        {/* Waveform */}
        <motion.div className="my-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <WaveBars />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-base md:text-lg text-white/60 leading-relaxed mb-2 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The World's First AI Music Assistant That{" "}
          <span className="text-white font-semibold">Finds Songs Even If You Don't Know Their Name.</span>
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: "🎤 Hum to Find", modeId: "hum" },
            { label: "📝 Lyrics Search", modeId: "lyrics" },
            { label: "🎭 Mood AI", modeId: "voice" },
            { label: "🤖 Neural Match", modeId: "ai" }
          ].map((item) => (
            <motion.button
              key={item.modeId}
              onClick={() => {
                createAccount("Guest", "guest@vibelock.ai", []);
                store.setActiveSearchMode(item.modeId);
                if (item.modeId === "hum") {
                  store.setIsMicOpen(true);
                }
                addToast(`🚀 Guest Login Success! Opened ${item.label.split(" ").slice(1).join(" ")}`, "success");
              }}
              className="text-xs px-3 py-1 rounded-full font-medium transition-all"
              style={{
                background: "rgba(0,245,212,0.08)",
                border: "1px solid rgba(0,245,212,0.18)",
                color: "rgba(255,255,255,0.65)",
              }}
              whileHover={{ scale: 1.05, background: "rgba(0,245,212,0.18)", color: "#00F5D4" }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="w-full space-y-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => setView("signup")}
            className="w-full py-4 rounded-2xl font-extrabold text-base text-black relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00F5D4, #7B2CBF)",
              boxShadow: "0 0 40px rgba(0,245,212,0.35)",
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 60px rgba(0,245,212,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            🚀 Get Started — It's Free
          </motion.button>

          <motion.button
            onClick={() => setView("signin")}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white/70"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            whileHover={{ background: "rgba(255,255,255,0.08)", color: "white" }}
            whileTap={{ scale: 0.97 }}
          >
            Sign In to Existing Account
          </motion.button>

          {/* Guest / explore */}
          <motion.button
            onClick={() => createAccount("Guest", "guest@vibelock.ai", [])}
            className="w-full py-2.5 text-xs font-medium text-white/25 hover:text-white/50 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            Continue as Guest →
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex items-center gap-4 mt-8 text-xs text-white/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {["50M+ Songs", "98% Match Rate", "Free Forever"].map((s, i) => (
            <React.Fragment key={s}>
              <span>{s}</span>
              {i < 2 && <span className="opacity-40">·</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>
    </FullscreenWrap>
  );
}

// ─── Layout helpers ─────────────────────────────────────────────────────────

function FullscreenWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "#08080C",
        fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <FloatingParticles count={20} />
      {/* Big glow blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute",
          width: 600, height: 600, left: "20%", top: "-10%",
          background: "radial-gradient(circle, rgba(0,245,212,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute",
          width: 500, height: 500, right: "10%", bottom: "10%",
          background: "radial-gradient(circle, rgba(123,44,191,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
      </div>
      {/* Scroll content: min-height 100vh so it's always centered, but can scroll */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SlidePanel({
  children, title, subtitle, step, total,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  step?: number;
  total?: number;
}) {
  return (
    <motion.div
      className="w-full max-w-md mx-auto rounded-3xl p-7 relative"
      style={{
        background: "rgba(16,16,22,0.98)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,245,212,0.05)",
      }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      {/* Step indicator */}
      {step !== undefined && total !== undefined && (
        <div className="flex gap-1.5 mb-5">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{ background: i < step ? "#00F5D4" : "rgba(255,255,255,0.1)" }}
              animate={{ background: i < step ? "#00F5D4" : "rgba(255,255,255,0.1)" }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      )}

      {/* Branding header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.2), rgba(123,44,191,0.2))", border: "1px solid rgba(0,245,212,0.3)" }}
        >
          🎵
        </div>
        <div>
          <div className="text-sm font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Vibe<span style={{ color: "#00F5D4" }}>Lock</span> AI
          </div>
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </h2>
      <p className="text-sm text-white/40 mb-5">{subtitle}</p>

      {children}
    </motion.div>
  );
}

function PrimaryBtn({
  children, onClick, type = "button", loading = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full py-3.5 rounded-xl font-bold text-sm text-black relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #00F5D4, #7B2CBF)",
        boxShadow: "0 0 30px rgba(0,245,212,0.3)",
        opacity: loading ? 0.75 : 1,
      }}
      whileHover={{ scale: loading ? 1 : 1.01, boxShadow: "0 0 40px rgba(0,245,212,0.5)" }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        />
      ) : children}
    </motion.button>
  );
}

function BackBtn({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors ${className}`}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      whileHover={{ background: "rgba(255,255,255,0.07)" }}
      whileTap={{ scale: 0.96 }}
    >
      ← Back
    </motion.button>
  );
}
