import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Globe, Clock, Users, Share2, CheckCircle, AlertTriangle, 
  Loader2, GitBranch, MapPin, Search
} from "lucide-react";

interface PropagationNode {
  id: string;
  label: string;
  platform: string;
  platformIcon: string;
  timestamp: string;
  type: "patient_zero" | "amplifier" | "mainstream" | "viral" | "debunk";
  engagementCount: number;
  accountType: "bot" | "influencer" | "news" | "anonymous" | "verified";
  content: string;
  location?: string;
  children: string[];
}

interface PropagationGraph {
  claim: string;
  patientZero: PropagationNode;
  nodes: PropagationNode[];
  stats: {
    totalNodes: number;
    totalReach: number;
    timeToMainstream: string;
    platformsAffected: number;
    botAmplificationPercent: number;
    debunkCount: number;
  };
  timeline: {
    timestamp: string;
    event: string;
    platform: string;
  }[];
}

const nodeTypeConfig = {
  patient_zero: { color: "border-red-500 bg-red-500/20", dot: "bg-red-500", label: "Patient Zero" },
  amplifier: { color: "border-amber-500 bg-amber-500/10", dot: "bg-amber-500", label: "Amplifier" },
  viral: { color: "border-orange-500 bg-orange-500/10", dot: "bg-orange-500", label: "Viral" },
  mainstream: { color: "border-blue-500 bg-blue-500/10", dot: "bg-blue-500", label: "Mainstream" },
  debunk: { color: "border-emerald-500 bg-emerald-500/10", dot: "bg-emerald-500", label: "Debunked" },
};

const accountTypeConfig = {
  bot: { label: "🤖 Bot", color: "text-red-400" },
  influencer: { label: "⭐ Influencer", color: "text-purple-400" },
  news: { label: "📰 News", color: "text-blue-400" },
  anonymous: { label: "👤 Anonymous", color: "text-slate-400" },
  verified: { label: "✅ Verified", color: "text-emerald-400" },
};

const PatientZeroTracker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTracing, setIsTracing] = useState(false);
  const [graph, setGraph] = useState<PropagationGraph | null>(null);
  const [selectedNode, setSelectedNode] = useState<PropagationNode | null>(null);
  const [viewMode, setViewMode] = useState<"graph" | "timeline">("graph");

  const handleTrace = async () => {
    if (!searchQuery.trim()) return;
    setIsTracing(true);
    setGraph(null);
    setSelectedNode(null);

    try {
      const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      if (!GEMINI_API_KEY) throw new Error("Gemini API key is missing");

      let searchContext = "";
      if (TAVILY_API_KEY) {
        try {
          const tavilyRes = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              api_key: TAVILY_API_KEY,
              query: `"${searchQuery}" origin OR viral OR debunked`,
              search_depth: "advanced",
              include_answer: true,
              max_results: 10,
            }),
          });
          if (tavilyRes.ok) {
            const data = await tavilyRes.json();
            searchContext = data.results?.map((r: any) => `[${r.title}] (${r.url}): ${r.content}`).join("\n");
          }
        } catch (e) {
          console.error("Tavily error", e);
        }
      }

      const prompt = `You are an AI Graph Database mapping the spread of information online.
Analyze this real web search context about this claim: "${searchQuery}"

Search Results context:
${searchContext}

Based ONLY on this real-world context, construct a chronological propagation graph of how this claim spread. Identify who likely started it ("Patient Zero"), how it was amplified, what news picked it up, and any factual debunks. If it's a completely new/fictional claim, simulate a realistic graph based on standard viral patterns.

Return ONLY a JSON object exactly matching this structure:
{
  "claim": "The claim text",
  "patientZero": {
    "id": "pz-1",
    "label": "Name of source/account",
    "platform": "Twitter, Reddit, News, etc",
    "platformIcon": "🐦/💬/📰/👤",
    "timestamp": "ISO Date string (approximate based on search)",
    "type": "patient_zero",
    "engagementCount": number,
    "accountType": "anonymous" | "bot" | "influencer" | "verified" | "news",
    "content": "quote or summary...",
    "location": "Geo string if known",
    "children": ["amp-1", "main-1"]
  },
  "nodes": [
    // Array of nodes including Patient Zero AND the others.
    // Make sure 'type' is one of: "patient_zero", "amplifier", "mainstream", "viral", "debunk"
    // Keep 'children' populated correctly to link IDs.
  ],
  "stats": {
    "totalNodes": number,
    "totalReach": number,
    "timeToMainstream": "e.g., 24 hours",
    "platformsAffected": number,
    "botAmplificationPercent": number,
    "debunkCount": number
  },
  "timeline": [
    { "timestamp": "ISO Date", "event": "Description", "platform": "Platform Name" }
  ]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Gemini API Failed");

      const rawData = await response.json();
      const textResponse = rawData?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const result: PropagationGraph = JSON.parse(textResponse || "{}");
      setGraph(result);

    } catch (error) {
      console.error(error);
      alert("Failed to trace origin. Check API keys.");
    } finally {
      setIsTracing(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4">
      <Card className="overflow-hidden border border-border bg-card">
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600/15 to-blue-600/15 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <GitBranch className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white tracking-wide">
                Patient Zero Tracker (Real-Time)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Powered by Tavily Web Crawler & Gemini 2.5 Logic
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 border border-border rounded-xl bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-500/50">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrace()}
                placeholder="Enter a claim to search the web and trace its origin..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground"
              />
            </div>
            <button
              onClick={handleTrace}
              disabled={isTracing || !searchQuery.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-display font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isTracing ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
              Trace Origin
            </button>
          </div>

          {isTracing && (
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-foreground">Crawling web for claim origins...</p>
            </div>
          )}

          {graph && graph.nodes && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { label: "Nodes", value: graph.stats.totalNodes, icon: Share2 },
                  { label: "Total Reach", value: (graph.stats.totalReach / 1000).toFixed(0) + "K", icon: Users },
                  { label: "Time to News", value: graph.stats.timeToMainstream, icon: Clock },
                  { label: "Platforms", value: graph.stats.platformsAffected, icon: Globe },
                  { label: "Bots %", value: graph.stats.botAmplificationPercent + "%", icon: AlertTriangle },
                  { label: "Debunks", value: graph.stats.debunkCount, icon: CheckCircle },
                ].map((stat, i) => {
                  const SIcon = stat.icon;
                  return (
                    <motion.div key={stat.label} className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                      <SIcon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                      <p className="text-lg font-mono font-bold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {graph.patientZero && (
                <Card className="p-4 bg-gradient-to-r from-red-600/10 to-red-900/5 border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                    <span className="font-display font-bold text-red-400 text-sm tracking-wider uppercase">
                      🔴 Patient Zero Identified
                    </span>
                  </div>
                  <div className="ml-5">
                    <p className="text-foreground font-medium">{graph.patientZero.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {graph.patientZero.platform} • {new Date(graph.patientZero.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-foreground/80 mt-2 italic">"{graph.patientZero.content}"</p>
                  </div>
                </Card>
              )}

              <div className="flex gap-2">
                <button onClick={() => setViewMode("graph")} className={`px-4 py-2 rounded-lg text-xs font-display font-semibold transition-all ${viewMode === "graph" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-secondary/30 text-muted-foreground border border-border"}`}>Graph View</button>
                <button onClick={() => setViewMode("timeline")} className={`px-4 py-2 rounded-lg text-xs font-display font-semibold transition-all ${viewMode === "timeline" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-secondary/30 text-muted-foreground border border-border"}`}>Timeline View</button>
              </div>

              {viewMode === "graph" && (
                <div className="space-y-2">
                  {graph.nodes.map((node, i) => {
                    const ntc = nodeTypeConfig[node.type] || nodeTypeConfig.amplifier;
                    const atc = accountTypeConfig[node.accountType] || accountTypeConfig.anonymous;
                    const depth = node.type === "patient_zero" ? 0 : node.type === "amplifier" ? 1 : node.type === "viral" ? 2 : 3;

                    return (
                      <motion.div key={node.id} style={{ marginLeft: `${depth * 24}px` }}>
                        <Card onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)} className={`p-3 cursor-pointer transition-all hover:ring-1 hover:ring-cyan-500/20 ${ntc.color} ${selectedNode?.id === node.id ? "ring-1 ring-cyan-500/40" : ""}`}>
                          <div className="flex items-center gap-3">
                            {depth > 0 && <div className="flex items-center gap-1"><div className="w-3 h-px bg-border" /><div className={`w-2 h-2 rounded-full ${ntc.dot}`} /></div>}
                            {depth === 0 && <div className={`w-3 h-3 rounded-full ${ntc.dot} animate-pulse`} />}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground">{node.label}</span>
                                <span className={`text-[10px] ${atc.color}`}>{atc.label}</span>
                                <span className="text-[10px] text-muted-foreground font-mono ml-auto">{node.engagementCount?.toLocaleString() || 0} engagements</span>
                              </div>
                            </div>
                          </div>
                          <AnimatePresence>
                            {selectedNode?.id === node.id && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/10 space-y-2">
                                <p className="text-xs text-foreground/80 italic">"{node.content}"</p>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                                  <span>{new Date(node.timestamp).toLocaleString()}</span>
                                  <span>{node.platform}</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {viewMode === "timeline" && graph.timeline && (
                <div className="relative pl-6 space-y-0">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500" />
                  {graph.timeline.map((event, i) => (
                    <div key={i} className="relative py-3">
                      <div className="absolute left-[-18px] w-3 h-3 rounded-full bg-foreground border-2 border-background" />
                      <div className="ml-3">
                        <p className="text-sm text-foreground font-medium">{event.event}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(event.timestamp).toLocaleString()} • {event.platform}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </Card>
    </section>
  );
};

export default PatientZeroTracker;
