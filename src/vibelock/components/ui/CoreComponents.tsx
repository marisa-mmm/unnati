import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Floating Particles Background ─────────────────────────────────────
export function FloatingParticles({ count = 25 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 8,
    color: i % 3 === 0 ? "#00F5D4" : i % 3 === 1 ? "#7B2CBF" : "#ffffff",
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Waveform ──────────────────────────────────────────────────
export function Waveform({ color = "#00F5D4", bars = 20, height = 32, isPlaying = true }: {
  color?: string; bars?: number; height?: number; isPlaying?: boolean;
}) {
  return (
    <div className="flex items-center gap-[2px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: 2, background: color }}
          animate={isPlaying ? {
            height: [
              Math.random() * height * 0.3 + height * 0.1,
              Math.random() * height * 0.8 + height * 0.2,
              Math.random() * height * 0.4 + height * 0.1,
            ],
          } : { height: height * 0.15 }}
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Mini Equalizer ─────────────────────────────────────────────────────
export function MiniEqualizer({ color = "#00F5D4", isPlaying = true }: { color?: string; isPlaying?: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          style={{ width: 3, background: color, borderRadius: 1 }}
          animate={isPlaying ? { height: ["4px", "14px", "6px", "12px", "4px"] } : { height: "4px" }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ─── Animated Background Glow ────────────────────────────────────────────
export function AmbientGlow({ moodBg }: { moodBg?: string }) {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-1000"
        style={{
          background: moodBg || "radial-gradient(ellipse at 30% 20%, rgba(0,245,212,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 80% 80%, rgba(123,44,191,0.06) 0%, transparent 60%)",
        }}
      />
    </>
  );
}

// ─── Glass Card ─────────────────────────────────────────────────────────
export function GlassCard({ children, className = "", onClick, hover = true }: {
  children: React.ReactNode; className?: string; onClick?: () => void; hover?: boolean;
}) {
  return (
    <motion.div
      onClick={onClick}
      className={`glass-card rounded-[18px] p-6 relative overflow-hidden ${hover ? "cursor-pointer" : ""} ${className}`}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Gradient Badge ──────────────────────────────────────────────────────
export function GradientBadge({ label, color = "#00F5D4" }: { label: string; color?: string }) {
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{
        background: `${color}20`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  );
}

// ─── Pulse Dot ───────────────────────────────────────────────────────────
export function PulseDot({ color = "#00F5D4", size = 8 }: { color?: string; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: color }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="absolute inset-0 rounded-full" style={{ background: color }} />
    </div>
  );
}

// ─── Toast Notifications ─────────────────────────────────────────────────
export function ToastContainer({ toasts }: { toasts: Array<{ id: string; message: string; type: string }> }) {
  const colorMap: Record<string, string> = {
    success: "#00F5D4",
    info: "#7B2CBF",
    warning: "#F97316",
    premium: "#EAB308",
  };
  return (
    <div className="fixed bottom-28 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="glass-card rounded-xl px-4 py-3 text-sm font-medium text-white max-w-xs pointer-events-auto"
            style={{ borderLeft: `3px solid ${colorMap[t.type] || "#00F5D4"}` }}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Confetti ────────────────────────────────────────────────────────────
export function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#00F5D4", "#7B2CBF", "#FF6B35", "#FFD700", "#E040FB"][i % 5],
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[300]">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{ left: `${p.x}%`, background: p.color, top: "-10px" }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 720], opacity: [1, 0] }}
          transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ─── Loading Screen ──────────────────────────────────────────────────────
export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const steps = ["Initializing AI Core...", "Loading Music Database...", "Connecting Neural Engine...", "VibeLock AI Ready ✦"];
  const [step, setStep] = React.useState(0);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 700)
    );
    const done = setTimeout(onDone, steps.length * 700 + 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center"
      style={{ background: "#08080C" }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <FloatingParticles count={30} />
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center relative"
          style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.15), rgba(123,44,191,0.15))", border: "1px solid rgba(0,245,212,0.3)" }}>
          <span className="text-4xl">🎵</span>
          <motion.div className="absolute -right-1 -top-1 w-4 h-4 rounded-full"
            style={{ background: "#00F5D4" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
      </motion.div>
      <motion.h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Vibe<span style={{ color: "#00F5D4" }}>Lock</span> <span style={{ color: "#7B2CBF" }}>AI</span>
      </motion.h1>
      <Waveform bars={30} height={40} color="#00F5D4" />
      <motion.p className="mt-6 text-sm font-mono" style={{ color: "#00F5D4" }}
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {steps[step]}
      </motion.p>
      <div className="mt-4 w-48 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #00F5D4, #7B2CBF)" }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
