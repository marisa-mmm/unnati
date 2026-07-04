import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MusicStore } from "../store/useMusicStore";

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

type Step = "auth" | "artists" | "genres" | "done";

// ─── Auth Modal (Sign In) ───────────────────────────────────────────────────
export function AuthModal({ store }: { store: MusicStore }) {
  const { showAuthModal, setShowAuthModal, setShowOnboarding, addToast } = store;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { addToast("Please fill all fields", "warning"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowAuthModal(false);
      addToast("⚠️ No account found. Please sign up!", "warning");
      setShowOnboarding(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: "rgba(8,8,12,0.88)", backdropFilter: "blur(24px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl p-8"
            style={{
              background: "rgba(18,18,24,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            }}
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.2), rgba(123,44,191,0.2))", border: "1px solid rgba(0,245,212,0.3)" }}>
                🎵
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome Back
              </h2>
              <p className="text-sm text-white/40">Sign in to continue your music journey</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,212,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,212,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-black relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                ) : "Sign In →"}
              </motion.button>
            </form>

            <p className="text-center text-sm text-white/40 mt-5">
              New here?{" "}
              <button
                className="font-bold hover:underline"
                style={{ color: "#00F5D4" }}
                onClick={() => { setShowAuthModal(false); setShowOnboarding(true); }}
              >
                Create Account
              </button>
            </p>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Onboarding Flow ────────────────────────────────────────────────────────
export function OnboardingModal({ store }: { store: MusicStore }) {
  const { showOnboarding, setShowOnboarding, createAccount } = store;
  const [step, setStep] = useState<Step>("auth");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleArtist = (artist: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artist) ? prev.filter((a) => a !== artist) : [...prev, artist]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleNext = () => {
    if (step === "auth") {
      if (!name || !email || !password) { return; }
      setStep("artists");
    } else if (step === "artists") {
      setStep("genres");
    } else if (step === "genres") {
      setStep("done");
      setLoading(true);
      setTimeout(() => {
        createAccount(name, email, selectedArtists);
        setStep("auth");
        setName(""); setEmail(""); setPassword("");
        setSelectedArtists([]); setSelectedGenres([]);
        setLoading(false);
      }, 1500);
    }
  };

  const stepNumber = step === "auth" ? 1 : step === "artists" ? 2 : step === "genres" ? 3 : 4;
  const totalSteps = 3;

  return (
    <AnimatePresence>
      {showOnboarding && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: "rgba(8,8,12,0.92)", backdropFilter: "blur(30px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg rounded-3xl overflow-hidden relative"
            style={{
              background: "rgba(14,14,20,0.99)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
              maxHeight: "90vh",
            }}
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          >
            {/* Progress bar */}
            <div className="h-1" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg, #00F5D4, #7B2CBF)" }}
                animate={{ width: `${(stepNumber / totalSteps) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="p-8 overflow-y-auto" style={{ maxHeight: "calc(90vh - 4px)" }}>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{ background: i < stepNumber ? "#00F5D4" : "rgba(255,255,255,0.1)" }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Create Account */}
                {step === "auth" && (
                  <motion.div
                    key="auth"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-7">
                      <div className="text-4xl mb-3">🎵</div>
                      <h2 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Join VibeLock AI
                      </h2>
                      <p className="text-sm text-white/40">Create your account to unlock personalized music</p>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,212,0.5)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,212,0.5)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                      <input
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,212,0.5)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>

                    <p className="text-xs text-white/25 mt-3 text-center">
                      By signing up you agree to our Terms & Privacy Policy
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Favorite Artists */}
                {step === "artists" && (
                  <motion.div
                    key="artists"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">🎤</div>
                      <h2 className="text-xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Who Do You Vibe With?
                      </h2>
                      <p className="text-sm text-white/40">
                        Select your favorite artists ({selectedArtists.length} selected)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                      {ARTISTS.map((artist) => {
                        const isSelected = selectedArtists.includes(artist.name);
                        return (
                          <motion.button
                            key={artist.name}
                            onClick={() => toggleArtist(artist.name)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all relative"
                            style={{
                              background: isSelected ? "rgba(0,245,212,0.12)" : "rgba(255,255,255,0.04)",
                              border: `1px solid ${isSelected ? "rgba(0,245,212,0.4)" : "rgba(255,255,255,0.07)"}`,
                              color: isSelected ? "#00F5D4" : "rgba(255,255,255,0.6)",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span className="text-lg">{artist.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold truncate" style={{ color: isSelected ? "#00F5D4" : "white" }}>
                                {artist.name}
                              </div>
                              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{artist.genre}</div>
                            </div>
                            {isSelected && (
                              <motion.div
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0"
                                style={{ background: "#00F5D4" }}
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
                  </motion.div>
                )}

                {/* Step 3: Genre selection */}
                {step === "genres" && (
                  <motion.div
                    key="genres"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">🎶</div>
                      <h2 className="text-xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Your Music Taste
                      </h2>
                      <p className="text-sm text-white/40">Pick genres you love — AI will learn from this</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {GENRES.map((genre) => {
                        const isSelected = selectedGenres.includes(genre.name);
                        return (
                          <motion.button
                            key={genre.name}
                            onClick={() => toggleGenre(genre.name)}
                            className="relative py-5 rounded-2xl font-bold text-sm overflow-hidden"
                            style={{
                              background: isSelected ? `${genre.color}18` : "rgba(255,255,255,0.04)",
                              border: `1px solid ${isSelected ? `${genre.color}50` : "rgba(255,255,255,0.07)"}`,
                              boxShadow: isSelected ? `0 0 24px ${genre.color}20` : "none",
                            }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                          >
                            <div className="text-2xl mb-1">{genre.emoji}</div>
                            <div style={{ color: isSelected ? genre.color : "rgba(255,255,255,0.6)" }}>
                              {genre.name}
                            </div>
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
                  </motion.div>
                )}

                {/* Done */}
                {step === "done" && (
                  <motion.div
                    key="done"
                    className="text-center py-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <motion.div
                      className="text-6xl mb-5"
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: 2 }}
                    >
                      🎉
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Setting Up Your Vibe...
                    </h2>
                    <p className="text-sm text-white/40">AI is personalizing your experience</p>
                    <motion.div
                      className="w-32 h-1 rounded-full mx-auto mt-6"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #00F5D4, #7B2CBF)" }}
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 1.4 }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              {step !== "done" && (
                <div className="flex gap-3 mt-6">
                  {step !== "auth" && (
                    <motion.button
                      onClick={() => setStep(step === "genres" ? "artists" : "auth")}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/50"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      whileHover={{ background: "rgba(255,255,255,0.08)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      ← Back
                    </motion.button>
                  )}
                  <motion.button
                    onClick={handleNext}
                    disabled={step === "auth" && (!name || !email || !password)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-black relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #00F5D4, #7B2CBF)",
                      opacity: step === "auth" && (!name || !email || !password) ? 0.5 : 1,
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-25"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {step === "auth" ? "Continue →" : step === "artists" ? "Next: Genres →" : "🚀 Create My Account"}
                  </motion.button>
                </div>
              )}

              {step === "auth" && (
                <p className="text-center text-sm text-white/30 mt-4">
                  Already have an account?{" "}
                  <button
                    className="font-bold"
                    style={{ color: "#00F5D4" }}
                    onClick={() => { setShowOnboarding(false); store.setShowAuthModal(true); }}
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Close */}
            {step !== "done" && (
              <button
                onClick={() => setShowOnboarding(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
