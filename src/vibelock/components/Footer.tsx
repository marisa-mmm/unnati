import React from "react";
import { motion } from "framer-motion";

const footerLinks = {
  Product: ["About", "Features", "Premium", "Changelog"],
  Support: ["Help Center", "Contact", "Privacy", "Terms"],
  Community: ["GitHub", "LinkedIn", "Instagram", "Discord"],
};

export function Footer() {
  return (
    <footer className="px-4 pt-12 pb-32 md:pb-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter */}
        <motion.div
          className="rounded-[24px] p-8 mb-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,245,212,0.06), rgba(123,44,191,0.06))",
            border: "1px solid rgba(0,245,212,0.1)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(0,245,212,0.2) 0%, transparent 60%)",
            }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Stay in the Vibe 🎵
            </h3>
            <p className="text-sm text-white/40 mb-6">Get AI music discoveries, new features & exclusive playlists in your inbox.</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white bg-transparent outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <motion.button
                className="px-5 py-3 rounded-xl text-sm font-bold text-black"
                style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.2), rgba(123,44,191,0.2))", border: "1px solid rgba(0,245,212,0.3)" }}
              >
                🎵
              </div>
              <span className="font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Vibe<span style={{ color: "#00F5D4" }}>Lock</span> AI
              </span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              The world's first AI music assistant that finds songs even if you don't know their name.
            </p>
            <div className="flex gap-3 mt-4">
              {["🐙", "💼", "📸"].map((icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  whileHover={{ scale: 1.1, background: "rgba(0,245,212,0.1)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-white/25"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span>© 2026 VibeLock AI. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
            <span>All systems operational • AI Core v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
