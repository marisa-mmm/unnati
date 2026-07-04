import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Eye, Zap, Brain, Globe, Cpu, Activity } from "lucide-react";

// Animated counter hook
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  
  return count;
};

// Floating particle component
const Particle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, hsl(183, 100%, ${60 + Math.random() * 30}%) 0%, transparent 70%)`,
    }}
    animate={{
      y: [0, -40, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0, 0.6, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 4 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Live stat card
const StatCard = ({ icon: Icon, label, value, suffix, color, delay }: {
  icon: typeof Shield;
  label: string;
  value: number;
  suffix: string;
  color: string;
  delay: number;
}) => {
  const count = useCounter(value, 2500);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative group"
    >
      <div className={`glass-card rounded-2xl p-4 min-w-[140px] hover:scale-105 transition-all duration-300 cursor-default ${color === "cyan" ? "hover:border-cyan-500/40" : color === "violet" ? "hover:border-violet-500/40" : color === "emerald" ? "hover:border-emerald-500/40" : "hover:border-amber-500/40"}`}>
        {/* Glow backing */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          color === "cyan" ? "bg-cyan-500/5" :
          color === "violet" ? "bg-violet-500/5" :
          color === "emerald" ? "bg-emerald-500/5" :
          "bg-amber-500/5"
        }`} />
        
        <div className="relative z-10">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
            color === "cyan" ? "bg-cyan-500/15 text-cyan-400" :
            color === "violet" ? "bg-violet-500/15 text-violet-400" :
            color === "emerald" ? "bg-emerald-500/15 text-emerald-400" :
            "bg-amber-500/15 text-amber-400"
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="font-code font-bold text-2xl text-white tabular-nums">
            {count.toLocaleString()}{suffix}
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    size: 2 + Math.random() * 4,
  }));

  const [blinkIndex, setBlinkIndex] = useState(0);
  const blinks = ["Claims", "Images", "Videos", "Documents", "Deepfakes"];

  useEffect(() => {
    const timer = setInterval(() => {
      setBlinkIndex(prev => (prev + 1) % blinks.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-20">

      {/* ── BACKGROUND LAYERS ── */}
      {/* Deep star-field */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Primary radial glow - top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-[100%] bg-primary/10 blur-[120px] pointer-events-none" />
      
      {/* Violet accent orb - left */}
      <motion.div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Teal accent orb - right */}
      <motion.div
        className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-cyan-600/8 blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} size={p.size} />
      ))}

      {/* ── ORBITAL RINGS ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        {/* Outer ring */}
        <motion.div
          className="absolute -inset-[300px] rounded-full border border-primary/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full bg-cyan-400/60 shadow-[0_0_12px_3px_rgba(0,255,255,0.4)]" />
          </div>
        </motion.div>

        {/* Middle ring */}
        <motion.div
          className="absolute -inset-[200px] rounded-full border border-violet-500/8"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-0 right-0 w-2 h-2 translate-x-1/2 translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-violet-400/70 shadow-[0_0_8px_2px_rgba(139,92,246,0.5)]" />
          </div>
        </motion.div>

        {/* Inner ring */}
        <motion.div
          className="absolute -inset-[130px] rounded-full border border-emerald-500/6"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/4 right-0 w-1.5 h-1.5 translate-x-1/2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_6px_2px_rgba(34,197,94,0.4)]" />
          </div>
        </motion.div>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full space-y-8">

        {/* ── BADGE ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-primary/25 shadow-[0_0_20px_rgba(0,255,255,0.12)] animate-border-glow">
            {/* Animated dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_6px_2px_rgba(0,255,255,0.6)]" />
            </span>
            <span className="text-xs font-code font-semibold tracking-[0.2em] text-primary uppercase">
              v3.0 · Quantum Intelligence Engine · Online
            </span>
            <div className="w-px h-3 bg-primary/30" />
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-code">LIVE</span>
            </div>
          </div>
        </motion.div>

        {/* ── MAIN TITLE ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <h1 className="font-display font-black tracking-tighter leading-none">
            <span className="block text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-gradient-brand drop-shadow-2xl" style={{
              filter: "drop-shadow(0 0 30px hsl(183, 100%, 50%, 0.3))"
            }}>
              UNNATI
            </span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-3"
          >
            <p className="font-display text-lg md:text-2xl text-white/70 tracking-[0.25em] uppercase font-light">
              Omniscient Truth Matrix
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto mt-4" />
          </motion.div>
        </motion.div>

        {/* ── ANIMATED SUBTITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            The world's most advanced AI-powered misinformation shield.{" "}
            <br className="hidden md:block" />
            Analyzing{" "}
            <span className="relative inline-block">
              <motion.span
                key={blinkIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="font-semibold text-primary"
              >
                {blinks[blinkIndex]}
              </motion.span>
            </span>
            {" "}with quantum precision in real-time.
          </p>
        </motion.div>

        {/* ── FEATURE PILLS ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            { icon: Shield, label: "Multi-Modal Forensics", color: "cyan" },
            { icon: Zap, label: "Real-Time Trajectory", color: "violet" },
            { icon: Eye, label: "Source Transparency", color: "emerald" },
            { icon: Brain, label: "Explainable AI Logic", color: "amber" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl glass border transition-all duration-300 cursor-default group hover:scale-105 ${
                color === "cyan" ? "hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]" :
                color === "violet" ? "hover:border-violet-500/40 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]" :
                color === "emerald" ? "hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]" :
                color === "amber" ? "hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(251,191,36,0.15)]" :
                "hover:border-sky-400/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]"
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${
                color === "cyan" ? "text-cyan-400 group-hover:text-cyan-300" :
                color === "violet" ? "text-violet-400 group-hover:text-violet-300" :
                color === "emerald" ? "text-emerald-400 group-hover:text-emerald-300" :
                color === "amber" ? "text-amber-400 group-hover:text-amber-300" :
                "text-sky-400 group-hover:text-sky-300"
              }`} />
              <span className={`text-sm font-medium transition-colors ${
                color === "sky" ? "text-sky-200 group-hover:text-sky-100" : "text-white/80 group-hover:text-white"
              }`}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── STATS STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <StatCard icon={Cpu} label="Claims Analyzed" value={142847} suffix="+" color="cyan" delay={0.9} />
          <StatCard icon={Shield} label="Deepfakes Caught" value={8293} suffix="+" color="violet" delay={1.0} />
          <StatCard icon={Globe} label="Accuracy Rate" value={97} suffix="%" color="emerald" delay={1.1} />
          <StatCard icon={Activity} label="Sources Scanned" value={500} suffix="K+" color="amber" delay={1.2} />
        </motion.div>
      </div>

      {/* ── SCANNER LINE DECORATION ── */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(183, 100%, 50%, 0.5) 40%, hsl(270, 80%, 60%, 0.5) 60%, transparent)",
        }}
        animate={{ top: ["10%", "90%", "10%"], opacity: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
      
      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};

export default HeroSection;
