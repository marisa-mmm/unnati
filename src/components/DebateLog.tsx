import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, AlertTriangle, Scale } from "lucide-react";

interface DebateMessage {
  id: string;
  role: "proponent" | "opponent" | "judge";
  content: string;
}

const TypewriterText = ({ text, onComplete, speed = 20 }: { text: string; onComplete?: () => void; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

interface DebateLogProps {
  messages: DebateMessage[];
  onFinish?: () => void;
}

const getRoleConfig = (role: "proponent" | "opponent" | "judge") => {
  switch (role) {
    case "proponent":
      return { icon: Shield, color: "text-primary", bg: "bg-primary/10", label: "Agent A (Proponent)" };
    case "opponent":
      return { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Agent B (Opponent)" };
    case "judge":
      return { icon: Scale, color: "text-accent", bg: "bg-accent/10", label: "Judge (Gemini)" };
  }
};

const DebateLog = ({ messages, onFinish }: DebateLogProps) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const handleMessageComplete = () => {
    if (activeMessageIndex < messages.length - 1) {
      setTimeout(() => {
        setActiveMessageIndex((prev) => prev + 1);
      }, 800);
    } else {
      setTimeout(() => {
        onFinish?.();
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border bg-[#0A0E1A]/80 backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-[#0A0E1A]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground font-semibold tracking-wider text-xs">UNNATI DEBATE LOG_</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/50" />
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {messages.map((msg, index) => {
          if (index > activeMessageIndex) return null;

          const config = getRoleConfig(msg.role);
          const Icon = config.icon;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 p-3 rounded bg-secondary/30"
            >
              <div className={`mt-1 p-1.5 rounded ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${config.color}`}>{config.label}</span>
                  <span className="text-muted-foreground text-xs opacity-50">
                    {new Date().toISOString().split("T")[1].slice(0, 12)}
                  </span>
                </div>
                
                <div className="text-foreground/90 leading-relaxed font-mono whitespace-pre-wrap">
                  {index === activeMessageIndex ? (
                    <TypewriterText text={msg.content} onComplete={handleMessageComplete} speed={15} />
                  ) : (
                    <span>{msg.content}</span>
                  )}
                  {index === activeMessageIndex && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DebateLog;
