import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MiniEqualizer, Waveform } from "./ui/CoreComponents";
import type { MusicStore } from "../store/useMusicStore";

const songLyrics: Record<number, string[]> = {
  1: [
    "In the neon glow of a digital night,",
    "Your frequencies pulse with synthetic light,",
    "The horizon bends where the circuits meet,",
    "And every heartbeat finds its perfect beat.",
    "We drift through the neon horizon together,",
    "Electric souls dancing forever and ever...",
  ],
  2: [
    "Midnight falls like a velvet curtain,",
    "The protocol runs when I'm uncertain,",
    "Frequencies bleed into the dark,",
    "A signal lost, a fading spark.",
    "Luna waves crash on silicon shores,",
    "We're searching for something more...",
  ],
  3: [
    "The solar flare burns across the sky,",
    "Cosmic drive, we're running high,",
    "Thermal rockets pierce the atmosphere,",
    "The universe expands, crystal clear.",
    "We chase the sun to the edge of space,",
    "Moving at hypersonic pace...",
  ],
  4: [
    "Crystal rain falls on a glass cathedral,",
    "Every drop a whisper, primordial,",
    "The ceiling shatters, aria in flight,",
    "Dissolving softly into the night.",
    "Nova floats above the clouds so high,",
    "A lullaby beneath the starlit sky...",
  ],
  5: [
    "Velocity rush through the fiber lanes,",
    "Electric veins, digital rains,",
    "Apex beats drop at 128,",
    "This overdrive won't let me wait.",
    "We're burning fuel on a neon road,",
    "The music carries every heavy load...",
  ],
  6: [
    "Phantom keys play in an empty hall,",
    "Ghost notes echo against the wall,",
    "Nocturne AI composes from the dark,",
    "A spectral melody leaves its mark.",
    "The piano breathes, each chord alive,",
    "These phantom harmonies help us survive...",
  ],
};

export function BottomPlayer({ store }: { store: MusicStore }) {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    progress,
    setProgress,
    adSkips,
    isPremium,
    isShuffled,
    setIsShuffled,
    isRepeating,
    setIsRepeating,
    downloadSong,
    downloadedSongs,
    downloadingId,
    showLyrics,
    setShowLyrics,
    playSong,
    addToast,
    songs: storeSongs,
  } = store;

  const [activeLyricLine, setActiveLyricLine] = useState(0);
  const lyrics = songLyrics[currentSong.id] || [];

  // Auto-advance lyrics line every few seconds when playing
  useEffect(() => {
    if (!isPlaying || !showLyrics || lyrics.length === 0) return;
    const t = setInterval(() => {
      setActiveLyricLine((l) => (l + 1) % lyrics.length);
    }, 3500);
    return () => clearInterval(t);
  }, [isPlaying, showLyrics, lyrics.length]);

  // Reset lyric line when song changes
  useEffect(() => {
    setActiveLyricLine(0);
  }, [currentSong.id]);

  return (
    <>
      {/* Lyrics Panel — shown above player when active */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            className="fixed bottom-[88px] left-0 right-0 z-50 mx-auto px-4"
            style={{ maxWidth: 700, left: "50%", transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
          >
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "rgba(10,10,16,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 -20px 60px rgba(0,0,0,0.7)",
              }}
            >
              {/* Glow blob */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 100%, ${currentSong.color || "#00F5D4"}, transparent 70%)`,
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-base">📜</span>
                  <span className="text-sm font-bold text-white">Lyrics</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${currentSong.color || "#00F5D4"}20`, color: currentSong.color || "#00F5D4", border: `1px solid ${currentSong.color || "#00F5D4"}30` }}
                  >
                    AI Synced
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{currentSong.title} — {currentSong.artist}</span>
                  <motion.button
                    onClick={() => setShowLyrics(false)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all text-sm"
                    whileTap={{ scale: 0.85 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Lyric lines */}
              <div className="relative z-10 text-center space-y-1.5">
                {lyrics.map((line, i) => {
                  const distance = Math.abs(i - activeLyricLine);
                  const isActive = i === activeLyricLine;
                  const opacity = isActive ? 1 : Math.max(0.15, 1 - distance * 0.25);
                  const scale = isActive ? 1 : Math.max(0.9, 1 - distance * 0.04);

                  return (
                    <motion.p
                      key={i}
                      className="cursor-pointer select-none font-semibold py-0.5 rounded-xl transition-all"
                      style={{
                        fontSize: isActive ? "1.05rem" : "0.875rem",
                        color: isActive ? (currentSong.color || "#00F5D4") : "rgba(255,255,255,0.5)",
                        opacity,
                        transform: `scale(${scale})`,
                        textShadow: isActive ? `0 0 20px ${currentSong.color || "#00F5D4"}80` : "none",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        lineHeight: 1.5,
                      }}
                      onClick={() => setActiveLyricLine(i)}
                      animate={{
                        opacity,
                        scale,
                        textShadow: isActive ? `0 0 20px ${currentSong.color || "#00F5D4"}80` : "0 0 0px transparent",
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {line}
                    </motion.p>
                  );
                })}
                {lyrics.length === 0 && (
                  <p className="text-sm text-white/30 py-4">Lyrics not available for this song</p>
                )}
              </div>

              {/* Animated waveform at bottom */}
              {isPlaying && (
                <div className="flex justify-center mt-4 relative z-10">
                  <MiniEqualizer color={currentSong.color || "#00F5D4"} isPlaying={isPlaying} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom Player Bar ─────────────────────────────────────────────── */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[60]"
        style={{
          background: "rgba(8,8,12,0.98)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(30px)",
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Progress bar — tap/click to seek */}
        <div
          className="w-full h-1 cursor-pointer group relative"
          style={{ background: "rgba(255,255,255,0.06)" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(Math.max(0, Math.min(100, pct)));
          }}
        >
          <motion.div
            className="h-full relative"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #00F5D4, ${currentSong.color || "#7B2CBF"})`,
            }}
            transition={{ type: "spring", damping: 40 }}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: `0 0 8px ${currentSong.color || "#00F5D4"}` }}
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          {/* LEFT: Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-[220px]">
            <motion.div
              className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 relative"
              animate={isPlaying ? { rotate: [0, 360] } : {}}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {currentSong.title}
              </div>
              <div className="text-xs text-white/40 truncate">{currentSong.artist}</div>
            </div>
            <MiniEqualizer color={currentSong.color || "#00F5D4"} isPlaying={isPlaying} />
          </div>

          {/* CENTER: Controls */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="flex items-center gap-2 md:gap-4">
              <motion.button
                onClick={() => setIsShuffled(!isShuffled)}
                className="text-xs p-1.5 rounded-lg hidden md:flex"
                style={{ color: isShuffled ? "#00F5D4" : "rgba(255,255,255,0.35)" }}
                whileTap={{ scale: 0.82 }}
                title="Shuffle"
              >
                🔀
              </motion.button>

              <motion.button
                className="text-lg text-white/50 hover:text-white transition-colors p-1"
                whileTap={{ scale: 0.82 }}
                title="Previous"
              >
                ⏮
              </motion.button>

              <motion.button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-black relative overflow-hidden flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #00F5D4, #7B2CBF)",
                  boxShadow: `0 0 ${isPlaying ? 25 : 12}px rgba(0,245,212,0.5)`,
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                animate={isPlaying ? {
                  boxShadow: ["0 0 12px rgba(0,245,212,0.3)", "0 0 28px rgba(0,245,212,0.6)", "0 0 12px rgba(0,245,212,0.3)"],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isPlaying ? "⏸" : "▶"}
              </motion.button>

              <motion.button
                className="text-lg text-white/50 hover:text-white transition-colors p-1"
                whileTap={{ scale: 0.82 }}
                title="Next"
              >
                ⏭
              </motion.button>

              <motion.button
                onClick={() => setIsRepeating(!isRepeating)}
                className="text-xs p-1.5 rounded-lg hidden md:flex"
                style={{ color: isRepeating ? "#00F5D4" : "rgba(255,255,255,0.35)" }}
                whileTap={{ scale: 0.82 }}
                title="Repeat"
              >
                🔁
              </motion.button>
            </div>

            {/* Time */}
            <div className="hidden md:flex items-center gap-2 text-[10px] text-white/25 tabular-nums">
              <span>
                {Math.floor(progress / 100 * 3)}:{String(Math.floor((progress / 100 * 47) % 60)).padStart(2, "0")}
              </span>
              <span className="text-white/15">/ {currentSong.duration}</span>
            </div>
          </div>

          {/* RIGHT: Extra controls */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-end max-w-[260px]">
            {/* Lyrics button */}
            <motion.button
              onClick={() => setShowLyrics(!showLyrics)}
              className="p-2 rounded-xl text-sm hidden md:flex items-center gap-1 font-medium transition-all"
              style={{
                background: showLyrics ? "rgba(0,245,212,0.12)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${showLyrics ? "rgba(0,245,212,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: showLyrics ? "#00F5D4" : "rgba(255,255,255,0.4)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              title="Toggle Lyrics"
            >
              <span>📜</span>
              <span className="text-xs">Lyrics</span>
            </motion.button>

            {/* Download */}
            <motion.button
              onClick={() => downloadSong(currentSong)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              title="Download"
            >
              {downloadedSongs.has(currentSong.id) ? "✅" : downloadingId === currentSong.id ? (
                <motion.div className="w-3.5 h-3.5 border-2 border-white/20 border-t-[#00F5D4] rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
              ) : "⬇️"}
            </motion.button>

            {/* Volume — hidden on small */}
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-xs">🔊</span>
              <input
                type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(90deg, #00F5D4 ${volume}%, rgba(255,255,255,0.1) ${volume}%)` }}
              />
            </div>

            {/* Ad skips display */}
            <div className="flex flex-col items-end">
              <div className="text-[9px] text-white/25 uppercase tracking-wide">Skips</div>
              <div className="text-xs font-bold tabular-nums" style={{ color: adSkips > 0 ? "#00F5D4" : "#FF6B35" }}>
                {adSkips === 999 ? "∞" : adSkips}/{adSkips === 999 ? "∞" : "10"}
              </div>
            </div>

            {/* Reward ad */}
            {!isPremium && (
              <motion.button
                onClick={() => store.setShowRewardAd(true)}
                className="text-[10px] px-2 py-1.5 rounded-xl font-bold hidden sm:block"
                style={{
                  background: "rgba(234,179,8,0.1)",
                  border: "1px solid rgba(234,179,8,0.3)",
                  color: "#EAB308",
                }}
                whileHover={{ scale: 1.04, background: "rgba(234,179,8,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                📺 +5
              </motion.button>
            )}
            {isPremium && (
              <div
                className="text-[10px] px-2 py-1.5 rounded-xl font-bold"
                style={{ background: "rgba(234,179,8,0.1)", color: "#EAB308", border: "1px solid rgba(234,179,8,0.25)" }}
              >
                👑
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
