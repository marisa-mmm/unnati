import React from "react";
import { motion } from "framer-motion";
import type { MusicStore } from "../store/useMusicStore";
import { songs } from "../data/mockData";

// ─── DOWNLOADS PAGE ─────────────────────────────────────────────────────────
export function DownloadsPage({ store }: { store: MusicStore }) {
  const { downloadedSongs, playSong, currentSong, isPlaying } = store;
  
  const downloadedList = songs.filter((s) => downloadedSongs.has(s.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-4 md:px-6 py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">⬇️</span>
        <div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Offline Downloads
          </h1>
          <p className="text-sm text-white/40">Your saved tracks available for offline playback</p>
        </div>
      </div>

      {downloadedList.length === 0 ? (
        <motion.div
          className="rounded-3xl p-10 text-center border border-white/5 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="text-5xl mb-4">💾</div>
          <h3 className="text-lg font-bold text-white mb-2">No offline tracks yet</h3>
          <p className="text-sm text-white/45 max-w-sm mx-auto mb-6">
            Upgrade to VibeLock Premium to download your favorite tracks directly to your device for lossless offline listening.
          </p>
          <motion.button
            onClick={() => store.setShowPremiumModal(true)}
            className="px-6 py-3 rounded-xl font-bold text-sm text-black"
            style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👑 Explore Premium Plans
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {downloadedList.map((song) => {
            const isCurrent = currentSong.id === song.id;
            return (
              <motion.div
                key={song.id}
                className="flex items-center justify-between p-3.5 rounded-2xl transition-all relative overflow-hidden"
                style={{
                  background: isCurrent ? "rgba(0, 245, 212, 0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isCurrent ? "rgba(0, 245, 212, 0.25)" : "rgba(255,255,255,0.06)"}`,
                }}
                whileHover={{ x: 4, background: isCurrent ? "rgba(0, 245, 212, 0.12)" : "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-[#00F5D4] text-xs">▶</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{song.title}</div>
                    <div className="text-xs text-white/40 truncate">{song.artist} • {song.album}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/40">
                    {song.genre}
                  </span>
                  <span className="text-xs text-white/30 tabular-nums">12.8 MB</span>
                  <motion.button
                    onClick={() => playSong(song)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-black"
                    style={{ background: isCurrent && isPlaying ? "#7B2CBF" : "#00F5D4", color: isCurrent && isPlaying ? "white" : "black" }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    {isCurrent && isPlaying ? "⏸" : "▶"}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ─── LIBRARY PAGE ──────────────────────────────────────────────────────────
export function LibraryPage({ store }: { store: MusicStore }) {
  const { likedSongs, toggleLike, playSong, currentSong, isPlaying } = store;

  const libraryList = songs.filter((s) => likedSongs.has(s.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-4 md:px-6 py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📚</span>
        <div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            My Library
          </h1>
          <p className="text-sm text-white/40">Your handpicked tracks and liked music</p>
        </div>
      </div>

      {libraryList.length === 0 ? (
        <motion.div
          className="rounded-3xl p-10 text-center border border-white/5 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
        >
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="text-lg font-bold text-white mb-2">Your library is empty</h3>
          <p className="text-sm text-white/45 max-w-sm mx-auto">
            Click the heart icon on recommended tracks or trending list to build your personalized music vault.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {libraryList.map((song) => {
            const isCurrent = currentSong.id === song.id;
            return (
              <motion.div
                key={song.id}
                className="flex items-center gap-4 p-3 rounded-2xl relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${isCurrent ? "rgba(0, 245, 212, 0.2)" : "rgba(255,255,255,0.06)"}`,
                }}
                whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.04)" }}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                  <motion.button
                    onClick={() => playSong(song)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <span className="text-white text-lg">{isCurrent && isPlaying ? "⏸" : "▶"}</span>
                  </motion.button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{song.title}</div>
                  <div className="text-xs text-white/45 truncate">{song.artist}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20 px-1.5 py-0.5 rounded-full font-bold">
                      {song.match}% Match
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">{song.bpm} BPM</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    onClick={() => toggleLike(song.id)}
                    className="text-red-500 text-lg p-1.5"
                    whileTap={{ scale: 0.8 }}
                  >
                    ❤️
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ─── PROFILE PAGE ──────────────────────────────────────────────────────────
export function ProfilePage({ store }: { store: MusicStore }) {
  const { userProfile, logout, isPremium } = store;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-4 md:px-6 py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">👤</span>
        <div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            My Account
          </h1>
          <p className="text-sm text-white/40">Manage your credentials, subscription, and music preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div
          className="lg:col-span-1 p-6 rounded-3xl border border-white/5 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(16px)" }}
        >
          {/* Accent decoration */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#00F5D4]/10 blur-xl" />

          <div className="flex flex-col items-center text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-black mb-4 relative"
              style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)" }}
            >
              {userProfile.name.charAt(0).toUpperCase()}
              {isPremium && (
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow-500 border-2 border-[#08080C] flex items-center justify-center text-[11px]"
                  title="Premium Subscriber"
                >
                  👑
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-0.5">{userProfile.name}</h2>
            <p className="text-xs text-white/40 mb-4">{userProfile.email}</p>

            <span
              className="text-xs px-3 py-1 rounded-full font-bold border mb-6"
              style={{
                background: isPremium ? "rgba(234,179,8,0.1)" : "rgba(255,255,255,0.05)",
                borderColor: isPremium ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.1)",
                color: isPremium ? "#EAB308" : "rgba(255,255,255,0.5)",
              }}
            >
              {isPremium ? "👑 Premium Subscriber" : "Free Plan Account"}
            </span>

            <motion.button
              onClick={logout}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
              whileTap={{ scale: 0.96 }}
            >
              👋 Sign Out Account
            </motion.button>
          </div>
        </div>

        {/* Music taste details */}
        <div
          className="lg:col-span-2 p-6 rounded-3xl border border-white/5 space-y-6"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(16px)" }}
        >
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span>🎸</span> Favorite Artists
            </h3>
            {userProfile.favoriteArtists && userProfile.favoriteArtists.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userProfile.favoriteArtists.map((artist) => (
                  <span
                    key={artist}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-white/70"
                  >
                    🎤 {artist}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/30">No favorite artists set yet. Setup your profile to add some!</p>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span>⚡</span> Preferences & AI Engine
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-left">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Audio Quality</div>
                <div className="text-sm font-bold text-white">{isPremium ? "960kbps Lossless FLAC" : "256kbps Standard AAC"}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-left">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Weekly Listening Streak</div>
                <div className="text-sm font-bold text-[#00F5D4]">14 Days 🔥</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-left">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Neural Matching Accuracy</div>
                <div className="text-sm font-bold text-white">98.4% Accuracy</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-left">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Registered Engine ID</div>
                <div className="text-xs font-mono text-white/50">VBL-708E2C16-AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
