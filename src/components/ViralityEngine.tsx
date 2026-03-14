import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ViralityEngineProps {
  riskScore: number;
}

const ViralityEngine = ({ riskScore }: ViralityEngineProps) => {
  const isHighRisk = riskScore > 80;

  useEffect(() => {
    if (isHighRisk) {
      document.body.classList.add("bg-glitch-effect");
    } else {
      document.body.classList.remove("bg-glitch-effect");
    }
    return () => document.body.classList.remove("bg-glitch-effect");
  }, [isHighRisk]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] flex items-center justify-center">
      {/* Central Holographic Globe Placeholder */}
      <motion.div
        animate={{
          scale: isHighRisk ? [1, 1.05, 1] : [1, 1.02, 1],
          opacity: isHighRisk ? [0.4, 0.7, 0.4] : [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: isHighRisk ? 0.8 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`w-[600px] h-[600px] rounded-full blur-[100px] ${
          isHighRisk ? "bg-destructive" : "bg-primary"
        }`}
      />
      {/* Glitch Overlay if high risk */}
      {isHighRisk && (
        <div className="absolute inset-0 bg-destructive/5 animate-pulse mix-blend-overlay" />
      )}
    </div>
  );
};

export default ViralityEngine;
