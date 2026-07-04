import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { songs, trendingSongs, recentSearches } from "../data/mockData";
import { MiniEqualizer, GradientBadge } from "./ui/CoreComponents";
import type { MusicStore } from "../store/useMusicStore";

// ─── AI Recommendations ───────────────────────────────────────────────────
export function AIRecommendations({ store }: { store: MusicStore }) {
  const { playSong, toggleLike, likedSongs, downloadSong, downloadedSongs, downloadingId, currentSong, isPlaying } = store;
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="px-4 md:px-6 mb-10">
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Recommended by VibeLock AI
          </h2>
          <p className="text-sm text-white/40 mt-0.5">Neural-powered picks just for you</p>
        </div>
        <span className="ml-auto text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(0,245,212,0.1)", color: "#00F5D4", border: "1px solid rgba(0,245,212,0.2)" }}>
          🤖 AI Curated
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song, i) => {
          const isCurrentPlaying = currentSong.id === song.id && isPlaying;
          const isDownloading = downloadingId === song.id;
          const isDownloaded = downloadedSongs.has(song.id);

          return (
            <motion.div
              key={song.id}
              className="relative rounded-[18px] overflow-hidden group cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${isCurrentPlaying ? song.color + "40" : "rgba(255,255,255,0.07)"}`,
                backdropFilter: "blur(12px)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: `0 20px 60px ${song.color}20` }}
              onHoverStart={() => setHoveredId(song.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              {/* Album art top */}
              <div className="relative h-40 overflow-hidden">
                <motion.img
                  src={song.cover}
                  alt={song.album}
                  className="w-full h-full object-cover"
                  animate={hoveredId === song.id ? { scale: 1.08 } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Overlay */}
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(8,8,12,0.9) 100%)` }} />

                {/* Match badge */}
                <div className="absolute top-3 left-3">
                  <motion.div
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${song.color}20`,
                      border: `1px solid ${song.color}50`,
                      color: song.color,
                      backdropFilter: "blur(8px)",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {song.match}% Match
                  </motion.div>
                </div>

                {/* Play button overlay */}
                <AnimatePresence>
                  {hoveredId === song.id && (
                    <motion.button
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => playSong(song)}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                        style={{
                          background: song.color,
                          boxShadow: `0 0 30px ${song.color}60`,
                        }}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {isCurrentPlaying ? "⏸" : "▶"}
                      </motion.div>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Now playing indicator */}
                {isCurrentPlaying && (
                  <div className="absolute bottom-2 right-2">
                    <MiniEqualizer color={song.color} isPlaying />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {song.title}
                    </h3>
                    <p className="text-xs text-white/50 truncate">{song.artist}</p>
                  </div>
                  <motion.button
                    onClick={() => toggleLike(song.id)}
                    className="ml-2 text-lg"
                    whileTap={{ scale: 0.7 }}
                    animate={likedSongs.has(song.id) ? { scale: [1, 1.3, 1] } : {}}
                  >
                    {likedSongs.has(song.id) ? "❤️" : "🤍"}
                  </motion.button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <GradientBadge label={song.genre} color={song.color} />
                  <GradientBadge label={song.tag} color="rgba(255,255,255,0.5)" />
                </div>

                <div className="flex items-center gap-1 text-xs text-white/40 mb-3">
                  <span>🕐</span> {song.duration} • BPM {song.bpm}
                </div>

                <div className="text-xs text-white/40 mb-3 italic">{song.label}</div>

                {/* Match bar */}
                <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${song.color}, ${song.color}80)` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${song.match}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>

                {/* Action row */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => playSong(song)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    style={{
                      background: `${song.color}15`,
                      border: `1px solid ${song.color}30`,
                      color: song.color,
                    }}
                    whileHover={{ background: `${song.color}25` }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {isCurrentPlaying ? "⏸ Playing" : "▶ Play"}
                  </motion.button>
                  <motion.button
                    onClick={() => downloadSong(song)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm relative overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    whileHover={{ background: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isDownloading ? (
                      <motion.div
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: `${song.color} transparent transparent transparent` }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : isDownloaded ? "✅" : "⬇️"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Trending Section ────────────────────────────────────────────────────
export function TrendingSection({ store }: { store: MusicStore }) {
  const { playSong, isPlaying, currentSong } = store;

  return (
    <section className="px-4 md:px-6 mb-10">
      <motion.div
        className="flex items-center justify-between mb-5"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            🔥 Trending Now
          </h2>
          <p className="text-sm text-white/40 mt-0.5">What the world is listening to</p>
        </div>
        <button className="text-xs text-white/40 hover:text-white transition-colors">See all →</button>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {trendingSongs.map((song, i) => (
          <motion.div
            key={song.id}
            className="flex-shrink-0 w-40 group cursor-pointer"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            onClick={() => playSong(songs[i % songs.length])}
          >
            <div className="relative rounded-2xl overflow-hidden mb-3">
              <motion.img
                src={song.cover}
                alt={song.title}
                className="w-40 h-40 object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.4)" }}>
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ background: "#00F5D4", boxShadow: "0 0 20px rgba(0,245,212,0.5)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  ▶
                </motion.div>
              </div>

              {/* Rank badge */}
              <div
                className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(0,0,0,0.7)", color: "#00F5D4", border: "1px solid rgba(0,245,212,0.3)" }}
              >
                {i + 1}
              </div>

              {/* Equalizer when playing */}
              {currentSong && isPlaying && i === 0 && (
                <div className="absolute bottom-2 right-2">
                  <MiniEqualizer color="#00F5D4" isPlaying />
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-white truncate">{song.title}</h3>
            <p className="text-xs text-white/40 truncate">{song.artist}</p>
            <p className="text-xs mt-0.5" style={{ color: "#00F5D4" }}>▶ {song.plays}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Recent Searches ──────────────────────────────────────────────────────
export function RecentSearches({ store }: { store: MusicStore }) {
  return (
    <section className="px-4 md:px-6 mb-10">
      <motion.h2
        className="text-2xl font-bold text-white mb-5"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Recent Searches
      </motion.h2>

      <div className="space-y-2">
        {recentSearches.map((search, i) => (
          <motion.div
            key={search.id}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{
              x: 6,
              background: "rgba(0,245,212,0.04)",
              borderColor: "rgba(0,245,212,0.15)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {search.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80 truncate">{search.query}</p>
              <p className="text-xs text-white/40 truncate">→ {search.result}</p>
            </div>
            <div className="text-xs text-white/25 flex-shrink-0">{search.time}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
