import React from "react";
import { motion } from "framer-motion";
import { aiInsights } from "../data/mockData";

export function AIInsights() {
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
            🧠 AI Insights
          </h2>
          <p className="text-sm text-white/40 mt-0.5">Your personalized music intelligence dashboard</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiInsights.map((insight, i) => (
          <motion.div
            key={insight.label}
            className="rounded-[18px] p-5 relative overflow-hidden group"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{
              y: -4,
              boxShadow: `0 16px 40px ${insight.color}20`,
              borderColor: `${insight.color}30`,
            }}
          >
            {/* Glow blob */}
            <motion.div
              className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
              style={{ background: insight.color }}
            />

            <div className="relative z-10">
              <div className="text-2xl mb-3">{insight.icon}</div>
              <motion.div
                className="text-2xl font-extrabold text-white mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 + 0.2 }}
              >
                {insight.value}
              </motion.div>
              <div className="text-xs font-medium text-white/50 mb-2">{insight.label}</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-white/30">{insight.sub}</div>
                <span
                  className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${insight.color}15`,
                    color: insight.color,
                    border: `1px solid ${insight.color}25`,
                  }}
                >
                  {insight.trend}
                </span>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, transparent, ${insight.color}, transparent)` }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
