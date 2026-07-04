import React from "react";
import { motion } from "framer-motion";
import type { MusicStore } from "../store/useMusicStore";
import { moodModes } from "../data/mockData";

const discoveryCards = [
  {
    icon: "🎤",
    title: "Hum a Song",
    desc: "Hum any melody and our AI will find the exact song within seconds.",
    color: "#00F5D4",
    gradient: "from-[#00F5D4]/10 to-transparent",
  },
  {
    icon: "📝",
    title: "Search by Lyrics",
    desc: "Remember a line? Type any lyrics fragment and we'll identify the song.",
    color: "#7B2CBF",
    gradient: "from-[#7B2CBF]/10 to-transparent",
  },
  {
    icon: "🎙",
    title: "Voice Search",
    desc: "Speak naturally. Describe the song or sing out loud and let AI do the rest.",
    color: "#FF6B35",
    gradient: "from-[#FF6B35]/10 to-transparent",
  },
  {
    icon: "🤖",
    title: "AI Recommendation",
    desc: "Let our neural engine curate a personalized playlist based on your emotions.",
    color: "#E040FB",
    gradient: "from-[#E040FB]/10 to-transparent",
  },
];

// ─── Smart Discovery Cards ────────────────────────────────────────────────
export function SmartDiscovery({ store }: { store: MusicStore }) {
  return (
    <section className="px-4 md:px-6 mb-10">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
      >
        {discoveryCards.map((card) => (
          <motion.div
            key={card.title}
            className={`relative rounded-[18px] p-6 overflow-hidden cursor-pointer group`}
            style={{
              background: `rgba(255,255,255,0.03)`,
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
            }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -6, boxShadow: `0 20px 60px ${card.color}20` }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Glow on hover */}
            <motion.div
              className="absolute -inset-px rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, ${card.color}20, transparent)`, border: `1px solid ${card.color}30` }}
            />

            <div className="relative z-10">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}30`,
                }}
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                {card.icon}
              </motion.div>
              <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {card.desc}
              </p>
              <motion.div
                className="mt-4 flex items-center gap-1 text-xs font-semibold"
                style={{ color: card.color }}
              >
                Try it <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Mood Modes ───────────────────────────────────────────────────────────
export function MoodModes({ store }: { store: MusicStore }) {
  const { activeMood, setMood } = store;

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
            AI Mood Modes
          </h2>
          <p className="text-sm text-white/40 mt-0.5">Let the AI adapt to your vibe</p>
        </div>
        {activeMood && (
          <motion.button
            onClick={() => setMood(null)}
            className="text-xs px-3 py-1.5 rounded-lg text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Mood
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {moodModes.map((mood, i) => {
          const isActive = activeMood === mood.id;
          return (
            <motion.div
              key={mood.id}
              className={`relative rounded-[18px] p-5 cursor-pointer overflow-hidden`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${mood.color}20, ${mood.color}08)`
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? mood.color + "50" : "rgba(255,255,255,0.07)"}`,
                boxShadow: isActive ? `0 0 40px ${mood.glow}` : "none",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 16px 40px ${mood.glow}` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMood(mood.id as any)}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(ellipse at center, ${mood.color}, transparent)` }}
                  animate={{ opacity: [0.1, 0.25, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="relative z-10">
                <motion.div
                  className="text-3xl mb-3"
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {mood.emoji}
                </motion.div>
                <h3 className="font-bold text-white text-sm mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {mood.label}
                </h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{mood.description}</p>

                {isActive && (
                  <motion.div
                    className="mt-3 space-y-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    {mood.playlist.map((p) => (
                      <div key={p} className="text-xs py-1 px-2 rounded-lg" style={{ background: `${mood.color}15`, color: mood.color }}>
                        ♪ {p}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {isActive && (
                <motion.div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: mood.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-black text-[10px] font-bold">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
