import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waveform } from "./ui/CoreComponents";
import type { MusicStore } from "../store/useMusicStore";

const searchModes = [
  {
    id: "hum",
    icon: "🎤",
    title: "Hum a Song",
    desc: "Hum any melody — AI finds it in seconds",
    color: "#00F5D4",
    placeholder: "Click the mic and start humming...",
    actionLabel: "Start Humming",
    actionIcon: "🎤",
  },
  {
    id: "lyrics",
    icon: "📝",
    title: "Search by Lyrics",
    desc: "Type any line you remember",
    color: "#7B2CBF",
    placeholder: "Type lyrics you remember... e.g. \"we found love in a hopeless place\"",
    actionLabel: "Find Song",
    actionIcon: "🔍",
  },
  {
    id: "voice",
    icon: "🎙",
    title: "Voice Search",
    desc: "Speak naturally, AI does the rest",
    color: "#FF6B35",
    placeholder: "Describe the song or say the artist name...",
    actionLabel: "Speak Now",
    actionIcon: "🎙",
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI Recommendation",
    desc: "Tell your mood, get a perfect playlist",
    color: "#E040FB",
    placeholder: "e.g. \"something chill for a rainy evening\"",
    actionLabel: "Get Playlist",
    actionIcon: "✨",
  },
];

const micSteps = [
  "AI Core Listening...",
  "Analyzing your humming...",
  "Matching frequencies...",
  "Searching millions of songs...",
  "Found 3 matches!",
];

export function HeroSection({ store }: { store: MusicStore }) {
  const { isMicOpen, setIsMicOpen, addToast, activeSearchMode, setActiveSearchMode } = store;
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [micStep, setMicStep] = useState(0);

  const selectedMode = searchModes.find((m) => m.id === activeSearchMode);

  const openMic = () => {
    setIsMicOpen(true);
    setMicStep(0);
    const interval = setInterval(() => {
      setMicStep((s) => {
        if (s >= micSteps.length - 1) { clearInterval(interval); return s; }
        return s + 1;
      });
    }, 1200);
    setTimeout(() => {
      setIsMicOpen(false);
      addToast("🎤 Hum Matched: Midnight Protocol — Luna Waves", "success");
    }, micSteps.length * 1200 + 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addToast(`🔍 Searching for: "${query}"`, "info");
  };

  const handleModeSelect = (modeId: string) => {
    if (activeSearchMode === modeId) {
      setActiveSearchMode(null);
      setQuery("");
      return;
    }
    setActiveSearchMode(modeId);
    setQuery("");
    if (modeId === "hum") {
      setTimeout(() => openMic(), 300);
    }
  };

  return (
    <section className="relative pt-16 pb-10 px-4 md:px-6">
      {/* Big glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${selectedMode ? selectedMode.color + "12" : "rgba(0,245,212,0.07)"} 0%, transparent 65%)`,
          transition: "background 0.5s ease",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center relative"
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
          style={{
            background: "rgba(0,245,212,0.08)",
            border: "1px solid rgba(0,245,212,0.2)",
            color: "#00F5D4",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
          AI Music Intelligence • v2.0
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Find Any Song,
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #00F5D4, #7B2CBF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Even If You Forgot
          </span>
          <br />
          Its Name.
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-white/50 mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          Choose how you want to search — hum, speak, type lyrics, or describe your mood.
        </motion.p>

        {/* ── MODE CARDS ──────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {searchModes.map((mode) => {
            const isActive = activeSearchMode === mode.id;
            return (
              <motion.button
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                className="relative flex flex-col items-center gap-2 px-3 py-4 rounded-2xl text-center overflow-hidden"
                style={{
                  background: isActive ? `${mode.color}14` : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${isActive ? mode.color + "55" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: isActive ? `0 0 30px ${mode.color}20` : "none",
                }}
                whileHover={{ scale: 1.04, y: -3, border: `1.5px solid ${mode.color}40` }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Glow blob */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${mode.color}, transparent 70%)` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.12 }}
                  />
                )}

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ background: mode.color, boxShadow: `0 0 6px ${mode.color}` }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                <span className="text-2xl">{mode.icon}</span>
                <div>
                  <div
                    className="text-sm font-bold leading-tight"
                    style={{ color: isActive ? mode.color : "white" }}
                  >
                    {mode.title}
                  </div>
                  <div className="text-[11px] text-white/35 mt-0.5 leading-tight">{mode.desc}</div>
                </div>

                {/* Bottom accent bar */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: mode.color }}
                    layoutId="activeBar"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── SEARCH BAR — only appears when a mode is selected ─── */}
        <AnimatePresence>
          {selectedMode && (
            <motion.div
              key={selectedMode.id}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="overflow-hidden"
            >
              <motion.form
                onSubmit={handleSearch}
                className="relative max-w-3xl mx-auto"
              >
                <motion.div
                  className="relative rounded-2xl overflow-visible"
                  animate={isFocused ? {
                    boxShadow: `0 0 0 2px ${selectedMode.color}55, 0 20px 60px ${selectedMode.color}18`,
                  } : {
                    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${isFocused ? selectedMode.color + "40" : "rgba(255,255,255,0.1)"}`,
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {/* Mode icon */}
                    <span className="text-xl flex-shrink-0">{selectedMode.icon}</span>

                    <input
                      autoFocus
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={selectedMode.placeholder}
                      className="flex-1 bg-transparent text-white placeholder-white/25 outline-none text-sm md:text-base"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />

                    {/* Clear button */}
                    {query && (
                      <motion.button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-white/30 hover:text-white/60 text-sm px-1 transition-colors"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.85 }}
                      >
                        ✕
                      </motion.button>
                    )}

                    {/* Action button */}
                    <motion.button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-black flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${selectedMode.color}, ${selectedMode.id === "lyrics" ? "#E040FB" : "#7B2CBF"})`,
                        boxShadow: `0 0 20px ${selectedMode.color}40`,
                      }}
                      whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${selectedMode.color}60` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{selectedMode.actionIcon}</span>
                      <span className="hidden sm:inline">{selectedMode.actionLabel}</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Helper tip */}
                <motion.p
                  className="text-xs text-white/30 mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {selectedMode.id === "hum" && "🎵 Just hum the tune — no words needed!"}
                  {selectedMode.id === "lyrics" && "💡 Even a single line works — AI will match it"}
                  {selectedMode.id === "voice" && "🎙 Speak clearly — describe artist, mood, or song"}
                  {selectedMode.id === "ai" && "🤖 Be descriptive — the more detail, the better the match"}
                </motion.p>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats row */}
        <motion.div
          className="flex items-center justify-center gap-4 md:gap-6 mt-6 text-sm text-white/40 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          {["50M+ Songs", "98% Match Rate", "AI Powered", "Real-time"].map((s, i) => (
            <React.Fragment key={s}>
              <span className="font-medium" style={{ color: i % 2 === 0 ? "#00F5D4" : "rgba(255,255,255,0.55)" }}>
                {s}
              </span>
              {i < 3 && <span className="opacity-30">•</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* Mic Overlay */}
      <AnimatePresence>
        {isMicOpen && (
          <motion.div
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center"
            style={{ background: "rgba(8,8,12,0.96)", backdropFilter: "blur(30px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* Pulsing mic */}
              <div className="relative">
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute inset-0 rounded-full"
                    style={{ border: `2px solid rgba(0,245,212,${0.4 / ring})` }}
                    animate={{ scale: [1, 1 + ring * 0.25, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, delay: ring * 0.3, repeat: Infinity }}
                  />
                ))}
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-5xl relative z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,245,212,0.2), rgba(123,44,191,0.2))",
                    border: "2px solid rgba(0,245,212,0.5)",
                    boxShadow: "0 0 60px rgba(0,245,212,0.3)",
                  }}
                >
                  🎤
                </div>
              </div>

              <Waveform bars={40} height={60} color="#00F5D4" />

              <motion.p
                key={micStep}
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {micSteps[micStep]}
              </motion.p>

              <p className="text-sm text-white/40">VibeLock AI is analyzing your audio...</p>

              <motion.button
                onClick={() => setIsMicOpen(false)}
                className="px-8 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                }}
                whileHover={{ background: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
