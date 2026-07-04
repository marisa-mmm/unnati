import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PulseDot, GradientBadge } from "./ui/CoreComponents";
import type { MusicStore } from "../store/useMusicStore";

const navItems = [
  { label: "Home", emoji: "🏠" },
  { label: "Discover", emoji: "🔭" },
  { label: "Smart Search", emoji: "🔍" },
  { label: "Mood Modes", emoji: "🎭" },
  { label: "Downloads", emoji: "⬇️" },
  { label: "Premium", emoji: "👑" },
  { label: "Library", emoji: "📚" },
  { label: "Profile", emoji: "👤" },
];

export function SidebarToggle({ store }: { store: MusicStore }) {
  const { sidebarOpen, setSidebarOpen } = store;
  return (
    <motion.button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="fixed top-4 left-4 z-[80] w-9 h-9 rounded-xl flex items-center justify-center"
      style={{
        background: "rgba(8,8,12,0.9)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      whileHover={{ scale: 1.08, borderColor: "rgba(0,245,212,0.4)" }}
      whileTap={{ scale: 0.92 }}
      title="Open Sidebar"
    >
      <span className="text-white/70 text-sm font-bold">
        ▶
      </span>
    </motion.button>
  );
}

export function Sidebar({ store }: { store: MusicStore }) {
  const { activeNav, setActiveNav, isPremium, setShowPremiumModal, sidebarOpen, setSidebarOpen, userProfile, setShowAuthModal, setShowOnboarding, logout } = store;

  return (
    <>
      {/* Backdrop on mobile when open */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-30 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className="flex flex-col fixed left-0 top-0 bottom-[72px] z-40"
            style={{
              width: 256,
              background: "rgba(8,8,12,0.97)",
              borderRight: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(24px)",
            }}
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Logo row */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center relative flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,245,212,0.2), rgba(123,44,191,0.2))",
                    border: "1px solid rgba(0,245,212,0.3)",
                    boxShadow: "0 0 16px rgba(0,245,212,0.2)",
                  }}
                >
                  <span className="text-base">🎵</span>
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{ background: "#00F5D4" }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <div className="font-extrabold text-base leading-none text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Vibe<span style={{ color: "#00F5D4" }}>Lock</span>
                  </div>
                  <div className="text-[10px] font-bold mt-0.5" style={{ color: "#7B2CBF" }}>AI v2.0</div>
                </div>
              </div>
              {/* Close button */}
              <motion.button
                onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            {/* User profile strip */}
            {userProfile.isLoggedIn ? (
              <div
                className="mx-3 mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer"
                style={{ background: "rgba(0,245,212,0.06)", border: "1px solid rgba(0,245,212,0.12)" }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)", color: "#000" }}>
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{userProfile.name}</div>
                  <div className="text-[10px] text-white/40 truncate">{userProfile.email}</div>
                </div>
                <motion.button
                  onClick={logout}
                  className="text-[10px] text-white/30 hover:text-red-400 transition-colors px-1"
                  title="Sign out"
                  whileTap={{ scale: 0.9 }}
                >
                  ⏏
                </motion.button>
              </div>
            ) : (
              <div className="mx-3 mt-3 flex gap-2">
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold"
                  style={{ background: "rgba(0,245,212,0.08)", border: "1px solid rgba(0,245,212,0.2)", color: "#00F5D4" }}
                  whileHover={{ background: "rgba(0,245,212,0.15)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => { setShowOnboarding(true); }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-black"
                  style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign Up
                </motion.button>
              </div>
            )}

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto custom-scrollbar">
              <div className="space-y-0.5">
                {navItems.map((item) => (
                  <motion.button
                    key={item.label}
                    onClick={() => setActiveNav(item.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
                    style={{
                      color: activeNav === item.label ? "#00F5D4" : "rgba(255,255,255,0.5)",
                      background: activeNav === item.label ? "rgba(0,245,212,0.08)" : "transparent",
                    }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {activeNav === item.label && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r"
                        style={{ background: "#00F5D4" }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="text-base">{item.emoji}</span>
                    {item.label}
                    {item.label === "Premium" && !isPremium && (
                      <span className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-500/30">
                        ✦
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-white/5 space-y-2">
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(0,245,212,0.04)", border: "1px solid rgba(0,245,212,0.1)" }}
              >
                <PulseDot color="#00F5D4" size={7} />
                <div>
                  <div className="text-xs font-semibold text-white">AI Core Connected</div>
                  <div className="text-[10px]" style={{ color: "#00F5D4" }}>Neural Engine Active</div>
                </div>
              </div>

              {!isPremium && (
                <motion.button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-black relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #00F5D4, #7B2CBF)",
                    boxShadow: "0 0 20px rgba(0,245,212,0.25)",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,245,212,0.45)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  👑 Upgrade to Premium
                </motion.button>
              )}
              {isPremium && (
                <div
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-center"
                  style={{ background: "rgba(234,179,8,0.1)", color: "#EAB308", border: "1px solid rgba(234,179,8,0.3)" }}
                >
                  ✦ Premium Member
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────
export function MobileNav({ store }: { store: MusicStore }) {
  const { activeNav, setActiveNav } = store;
  const mobileItems = navItems.slice(0, 5);

  return (
    <div
      className="md:hidden fixed bottom-[84px] left-2 right-2 z-40 flex items-center justify-around px-2 py-2.5 rounded-2xl"
      style={{
        background: "rgba(8,8,12,0.97)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 -4px 30px rgba(0,0,0,0.5)",
      }}
    >
      {mobileItems.map((item) => (
        <motion.button
          key={item.label}
          onClick={() => setActiveNav(item.label)}
          className="flex flex-col items-center gap-0.5 px-2 py-1"
          whileTap={{ scale: 0.85 }}
        >
          <span className="text-xl">{item.emoji}</span>
          <span
            className="text-[9px] font-medium"
            style={{ color: activeNav === item.label ? "#00F5D4" : "rgba(255,255,255,0.35)" }}
          >
            {item.label}
          </span>
          {activeNav === item.label && (
            <motion.div
              layoutId="mobileActiveBar"
              className="w-4 h-0.5 rounded-full mt-0.5"
              style={{ background: "#00F5D4" }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
