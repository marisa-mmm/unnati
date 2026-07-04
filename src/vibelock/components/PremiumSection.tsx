import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { premiumFeatures } from "../data/mockData";
import { Confetti } from "./ui/CoreComponents";
import type { MusicStore } from "../store/useMusicStore";

// ─── Premium Section ─────────────────────────────────────────────────────
export function PremiumSection({ store }: { store: MusicStore }) {
  const { isPremium, upgradePremium, setShowPremiumModal } = store;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const premiumRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = premiumRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

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
            Choose Your Plan
          </h2>
          <p className="text-sm text-white/40 mt-0.5">Unlock the full VibeLock AI experience</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <motion.div
          className="rounded-[18px] p-6 relative"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
        >
          <div className="mb-4">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Free</div>
            <div className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              $0 <span className="text-sm font-normal text-white/40">/ month</span>
            </div>
          </div>
          <ul className="space-y-2.5 mb-6">
            {premiumFeatures.free.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/55">
                <span className="text-white/25">○</span> {f}
              </li>
            ))}
          </ul>
          <div
            className="w-full py-3 rounded-xl text-sm font-bold text-center text-white/50"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {isPremium ? "Downgrade" : "Current Plan"}
          </div>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          ref={premiumRef}
          className="rounded-[18px] p-6 relative overflow-hidden cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(0,245,212,0.08), rgba(123,44,191,0.08))",
            border: "1px solid rgba(0,245,212,0.2)",
            boxShadow: "0 0 60px rgba(0,245,212,0.1)",
          }}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -6, boxShadow: "0 0 80px rgba(0,245,212,0.2)" }}
          onMouseMove={handleMouseMove}
          onClick={() => !isPremium && upgradePremium()}
        >
          {/* Cursor follow glow */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 200,
              height: 200,
              background: "radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)",
              left: mousePos.x - 100,
              top: mousePos.y - 100,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-[18px]"
            style={{ background: "linear-gradient(90deg, rgba(0,245,212,0.4), rgba(123,44,191,0.4), rgba(0,245,212,0.4))" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          />
          <div className="absolute inset-[1px] rounded-[17px]" style={{ background: "rgba(8,8,12,0.92)" }} />

          <div className="relative z-10">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(0,245,212,0.15)", color: "#00F5D4", border: "1px solid rgba(0,245,212,0.3)" }}
              >
                ✦ MOST POPULAR
              </span>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00F5D4" }}>Premium</div>
              <div className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                $9.99 <span className="text-sm font-normal text-white/40">/ month</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-6">
              {premiumFeatures.premium.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white">
                  <span style={{ color: "#00F5D4" }}>✓</span> {f}
                </li>
              ))}
            </ul>

            <motion.div
              className="w-full py-3 rounded-xl text-sm font-extrabold text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #00F5D4, #7B2CBF)",
                color: "#000",
                boxShadow: "0 0 30px rgba(0,245,212,0.4)",
              }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(0,245,212,0.6)" }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="absolute inset-0 opacity-40"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
              />
              {isPremium ? "✦ You're Premium!" : "🚀 Unlock Infinite Vibes"}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Reward Ad System ─────────────────────────────────────────────────────
export function RewardAdModal({ store }: { store: MusicStore }) {
  const { showRewardAd, setShowRewardAd, claimRewardAd, showConfetti } = store;
  const [countdown, setCountdown] = useState(5);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!showRewardAd) { setCountdown(5); setDone(false); return; }
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(t); setDone(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [showRewardAd]);

  return (
    <>
      {showConfetti && <Confetti />}
      <AnimatePresence>
        {showRewardAd && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(8,8,12,0.85)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-[24px] p-8 text-center max-w-sm w-full relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
              }}
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {done ? "🎉 Reward Earned!" : "Watch a 5-Second Ad"}
              </h3>
              <p className="text-sm text-white/50 mb-6">
                {done ? "You earned +5 Ad Skips!" : "Watch this short ad to earn 5 bonus ad skips."}
              </p>

              {!done ? (
                <div className="relative mb-6">
                  <div
                    className="w-24 h-24 rounded-full border-4 mx-auto flex items-center justify-center"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#00F5D4 ${((5 - countdown) / 5) * 360}deg, transparent 0deg)`,
                      }}
                    />
                    <span className="text-4xl font-extrabold text-white relative z-10">{countdown}</span>
                  </div>
                </div>
              ) : (
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  🎊
                </motion.div>
              )}

              {done ? (
                <motion.button
                  onClick={claimRewardAd}
                  className="w-full py-3 rounded-xl font-bold text-black"
                  style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  🎁 Claim +5 Skips
                </motion.button>
              ) : (
                <button
                  onClick={() => setShowRewardAd(false)}
                  className="w-full py-3 rounded-xl text-sm text-white/50 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Cancel
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Premium Modal ────────────────────────────────────────────────────────
export function PremiumModal({ store }: { store: MusicStore }) {
  const { showPremiumModal, setShowPremiumModal, upgradePremium } = store;

  return (
    <AnimatePresence>
      {showPremiumModal && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(8,8,12,0.85)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPremiumModal(false)}
        >
          <motion.div
            className="rounded-[24px] p-8 text-center max-w-sm w-full"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,212,0.08), rgba(123,44,191,0.08))",
              border: "1px solid rgba(0,245,212,0.2)",
              backdropFilter: "blur(24px)",
            }}
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Premium Feature
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Upgrade to Premium to download songs for offline listening, enjoy lossless audio, and unlock unlimited AI searches.
            </p>
            <motion.button
              onClick={upgradePremium}
              className="w-full py-3 rounded-xl font-bold text-black mb-3 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              👑 Upgrade to Premium — $9.99/mo
            </motion.button>
            <button
              onClick={() => setShowPremiumModal(false)}
              className="w-full py-2.5 text-sm text-white/40 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
