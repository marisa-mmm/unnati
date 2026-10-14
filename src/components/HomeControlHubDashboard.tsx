import { useState } from "react";
import { 
  Search, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  ScanFace, 
  ShieldAlert, 
  GitBranch, 
  BrainCircuit, 
  Fingerprint, 
  ArrowDown, 
  ArrowUp,
  Zap,
  TrendingUp,
  Radio,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeControlHubDashboardProps {
  onSearch: (query: string) => void;
  onSelectTool: (tool: "deepfake" | "narrative" | "patient_zero" | "explainable_ai" | "id_verifier") => void;
  onScrollToTrending?: () => void;
  onScrollToClaimInput?: () => void;
}

const QUICK_SEARCH_TOPICS = [
  { label: "RBI 2000 Note Ban Circular", tag: "Finance", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { label: "Free Solar Rooftop WhatsApp Scam", tag: "Cyber Scam", color: "text-red-400 border-red-500/30 bg-red-500/10" },
  { label: "AI Voice Clone Extortion Call", tag: "Deepfake", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { label: "Govt Exam Paper Leak Rumor", tag: "Viral News", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { label: "WHO Global Emergency Notification", tag: "Health", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
];

export const HomeControlHubDashboard = ({
  onSearch,
  onSelectTool,
  onScrollToTrending,
  onScrollToClaimInput,
}: HomeControlHubDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic);
    onSearch(topic);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
      
      {/* ═══ 1. SEARCHING BAR SHOWN DOWN INSIDE CONTROL HUB ═══ */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-black/50 to-slate-900/60 p-4 shadow-[0_0_25px_rgba(0,255,255,0.08)]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                Instant Forensic Claim Search
                <span className="px-1.5 py-0.5 rounded text-[9px] font-code font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIVE
                </span>
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Search viral claims, rumors, or enter news to verify down here
              </p>
            </div>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or enter claim here to verify down..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/60 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs px-4 h-10 rounded-lg shadow-md hover:shadow-cyan-500/25 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search & Verify</span>
          </Button>
        </form>

        {/* Quick Topics Pills */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] font-code text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            Trending Rumor Topics:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SEARCH_TOPICS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleTopicClick(item.label)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all text-left flex items-center gap-1.5 hover:scale-[1.02] ${item.color}`}
              >
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-[9px] opacity-70 uppercase tracking-tighter">({item.tag})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 2. REAL-TIME PLATFORM INTELLIGENCE METRICS ═══ */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-display font-bold text-foreground">Engine Performance & Defense Matrix</span>
          </div>
          <span className="text-[10px] font-code text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ALL 6 ENGINES OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: "Rumors Scanned", val: "1,428", trend: "+14% today", color: "text-cyan-400", border: "border-cyan-500/20" },
            { label: "Bot Flag Rate", val: "98.4%", trend: "Active Shield", color: "text-amber-400", border: "border-amber-500/20" },
            { label: "Avg Latency", val: "1.2s", trend: "Gemini 2.5 Flash", color: "text-violet-400", border: "border-violet-500/20" },
            { label: "Truth Score", val: "99.1%", trend: "High Confidence", color: "text-emerald-400", border: "border-emerald-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`p-3 rounded-xl bg-card/40 border ${stat.border} flex flex-col justify-between`}>
              <span className="text-[10px] text-muted-foreground font-code">{stat.label}</span>
              <span className={`text-lg font-bold font-display ${stat.color} my-0.5`}>{stat.val}</span>
              <span className="text-[9px] text-muted-foreground/80">{stat.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 3. QUICK FORENSIC ENGINE LAUNCHER ═══ */}
      <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
        <span className="text-[11px] font-code text-muted-foreground block mb-2 px-1">
          ↳ Quick Switch to Specialized Engine:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { key: "deepfake", icon: ScanFace, label: "Deepfake Forensics", color: "text-teal-400 hover:border-teal-500/40" },
            { key: "narrative", icon: ShieldAlert, label: "Narrative Inoculation", color: "text-amber-400 hover:border-amber-500/40" },
            { key: "patient_zero", icon: GitBranch, label: "Patient Zero Trace", color: "text-blue-400 hover:border-blue-500/40" },
            { key: "explainable_ai", icon: BrainCircuit, label: "Explainable AI Logic", color: "text-purple-400 hover:border-purple-500/40" },
            { key: "id_verifier", icon: Fingerprint, label: "Govt ID Verifier", color: "text-emerald-400 hover:border-emerald-500/40" },
          ].map(({ key, icon: Icon, label, color }) => (
            <button
              key={key}
              onClick={() => onSelectTool(key as any)}
              className={`p-2.5 rounded-lg border border-white/8 bg-card/50 flex items-center gap-2 transition-all hover:bg-white/5 ${color} text-left group`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-semibold text-foreground group-hover:text-inherit truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ 4. NAVIGATION SHORTCUTS ═══ */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
        <button
          type="button"
          onClick={onScrollToClaimInput}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-cyan-400 transition-colors py-1 px-2 rounded-md hover:bg-white/5"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Go to Top Multi-Modal Input</span>
        </button>

        <button
          type="button"
          onClick={onScrollToTrending}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-emerald-400 transition-colors py-1 px-2 rounded-md hover:bg-white/5"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>View Global Trending Now Feed</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

export default HomeControlHubDashboard;
