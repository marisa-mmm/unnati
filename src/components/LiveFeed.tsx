import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, CheckCircle, HelpCircle, XCircle, Twitter, Globe, Youtube, MessageCircle, Clock, Search, ExternalLink, ShieldCheck, Database, Zap, FileText, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";

type Verdict = "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED";

export interface SourceChecked {
  name: string;
  type: "Database" | "News Archive" | "Official Record" | "Social Graph";
  finding: string;
  reliability: "High" | "Medium" | "Low";
}

interface FeedItem {
  id: string;
  claim: string;
  source: "Twitter" | "YouTube" | "Web" | "Reddit" | "WhatsApp";
  riskScore: number; // 0-100
  verdict: Verdict;
  confidence: number; // percentage
  timestamp: string;
  reasoning: string;
  sourcesChecked: SourceChecked[];
}

const VERDICT_STYLES: Record<Verdict, { icon: typeof CheckCircle; colorClass: string; bgClass: string; label: string }> = {
  TRUE: { icon: CheckCircle, colorClass: "text-emerald-400", bgClass: "bg-emerald-500/10 border-emerald-500/20", label: "TRUE" },
  FALSE: { icon: XCircle, colorClass: "text-red-400", bgClass: "bg-red-500/10 border-red-500/20", label: "FALSE" },
  MISLEADING: { icon: AlertTriangle, colorClass: "text-amber-400", bgClass: "bg-amber-500/10 border-amber-500/20", label: "MISLEADING" },
  UNVERIFIED: { icon: HelpCircle, colorClass: "text-slate-400", bgClass: "bg-slate-500/10 border-slate-500/20", label: "UNVERIFIED" },
};

const SOURCE_ICONS: Record<string, typeof Twitter> = {
  Twitter: Twitter,
  YouTube: Youtube,
  Web: Globe,
  Reddit: MessageCircle,
  WhatsApp: MessageCircle,
};

const INITIAL_FEED: FeedItem[] = [
  {
    id: "f1",
    claim: "UN banning cash transactions globally by 2026 to introduce digital tracking.",
    source: "Twitter",
    riskScore: 94,
    verdict: "FALSE",
    confidence: 98,
    timestamp: "Just now",
    reasoning: "No official UN mandate exists regarding a global cash ban. The UN has no authority to ban physical currency in sovereign nations. This stems from misinterpreted digital infrastructure goals.",
    sourcesChecked: [
      { name: "UN Official Press", type: "Official Record", finding: "No mentions of cash ban; digital infrastructure goals misquoted.", reliability: "High" },
      { name: "Reuters Fact Check", type: "News Archive", finding: "Debunked similar viral iterations in 2023.", reliability: "High" }
    ]
  },
  {
    id: "f2",
    claim: "New study shows green tea extracts can completely cure advanced stage diabetes.",
    source: "Web",
    riskScore: 88,
    verdict: "MISLEADING",
    confidence: 85,
    timestamp: "2m ago",
    reasoning: "While some studies indicate green tea can help regulate blood sugar levels, there is no medical consensus or clinical proof that it can 'cure' diabetes. Substituting prescribed insulin for extracts is highly dangerous.",
    sourcesChecked: [
      { name: "PubMed Central", type: "Database", finding: "Green tea shows minor blood sugar benefits, no curative properties.", reliability: "High" },
      { name: "Reddit (r/supplements)", type: "Social Graph", finding: "High volume of affiliate marketing links pushing this narrative.", reliability: "Low" }
    ]
  },
  {
    id: "f3",
    claim: "NASA officially spotted a black hole heading towards our solar system.",
    source: "YouTube",
    riskScore: 75,
    verdict: "FALSE",
    confidence: 99,
    timestamp: "5m ago",
    reasoning: "NASA has made no such announcement. The closest known black hole (Gaia BH1) is 1,560 light years away and its trajectory poses zero threat to Earth.",
    sourcesChecked: [
      { name: "NASA JPL Asteroid Watch", type: "Official Record", finding: "No alerts or press releases matching this claim.", reliability: "High" }
    ]
  },
];

const NEW_ITEMS: FeedItem[] = [
  {
    id: "f4",
    claim: "The Eiffel Tower was struck by lightning 15 times during yesterday's storm.",
    source: "Twitter",
    riskScore: 12,
    verdict: "TRUE",
    confidence: 92,
    timestamp: "Just now",
    reasoning: "Meteorological data and numerous verified multi-angle videos confirm the Eiffel Tower absorbed multiple lightning strikes during the severe squall line that passed over Paris.",
    sourcesChecked: [
      { name: "Météo-France", type: "Official Record", finding: "Severe thunderstorm warning issued; extreme lightning observed over central Paris.", reliability: "High" },
      { name: "Twitter Video Analysis", type: "Social Graph", finding: "Multiple independent, distinct angles of the event verify authenticity.", reliability: "Medium" }
    ]
  },
  {
    id: "f5",
    claim: "Government secretly increasing taxes on all incoming bank transfers starting midnight.",
    source: "WhatsApp",
    riskScore: 82,
    verdict: "FALSE",
    confidence: 96,
    timestamp: "Just now",
    reasoning: "No legislation or central bank circular supports this claim. This is a recycled viral hoax structure designed to cause financial panic.",
    sourcesChecked: [
      { name: "Ministry of Finance", type: "Official Record", finding: "No tax increase announcements. Central bank explicitly refuted the rumors.", reliability: "High" }
    ]
  }
];

export const LiveFeed = () => {
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate incoming flags
    let itemIndex = 0;
    const interval = setInterval(() => {
      if (itemIndex < NEW_ITEMS.length) {
        setFeed(prev => {
          const updated = [NEW_ITEMS[itemIndex], ...prev].map(item => {
            // fake update timestamps
            if (item.timestamp === "Just now") return item;
            if (item.timestamp.includes("m ago")) {
              const mins = parseInt(item.timestamp);
              return { ...item, timestamp: `${mins + 1}m ago` };
            }
            return { ...item, timestamp: "1m ago" };
          });
          return updated.slice(0, 10); // keep max 10
        });
        itemIndex++;
      } else {
        clearInterval(interval);
      }
    }, 15000); // add a new one every 15s for demo

    return () => clearInterval(interval);
  }, []);

  // Re-trigger Google Translate for dynamically added livestream claims
  useEffect(() => {
    const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (gtCombo && gtCombo.value && gtCombo.value !== '') {
      // Small timeout to let React finish mounting the new DOM nodes before translating
      setTimeout(() => {
        gtCombo.dispatchEvent(new Event('change', { bubbles: true }));
      }, 50);
    }
  }, [feed]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section className="max-w-3xl mx-auto px-6 mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground">Live Flagged Claims</h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full uppercase tracking-widest border border-border">Global Stream</span>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {feed.map((item) => {
            const style = VERDICT_STYLES[item.verdict];
            const SourceIcon = SOURCE_ICONS[item.source] || Globe;
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-colors">
                  <div 
                    className="p-5 cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Left side: Source & Claim */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1.5 min-w-0 text-muted-foreground bg-black/20 px-2 py-0.5 rounded text-xs font-medium">
                          <SourceIcon className="w-3.5 h-3.5" />
                          <span className="truncate">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0 text-muted-foreground text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                      <h3 className="text-foreground font-medium text-base leading-snug pr-4 line-clamp-2">
                        "{item.claim}"
                      </h3>
                    </div>

                    {/* Right side: Stats & Verdict */}
                    <div className="flex items-center gap-4 sm:pl-4 sm:border-l border-border/50 shrink-0 mt-3 sm:mt-0">
                      
                      {/* Risk & Confidence */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground w-12">Risk</span>
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" style={{ width: `${item.riskScore}%` }} />
                          </div>
                          <span className="font-mono text-foreground">{item.riskScore}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground w-12">Conf.</span>
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary/80 rounded-full" style={{ width: `${item.confidence}%` }} />
                          </div>
                          <span className="font-mono text-foreground">{item.confidence}%</span>
                        </div>
                      </div>

                      {/* Verdict Badge */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${style.bgClass} shrink-0 w-[120px] justify-center`}>
                        <style.icon className={`w-3.5 h-3.5 ${style.colorClass}`} />
                        <span className={`text-xs font-bold tracking-wider uppercase ${style.colorClass}`}>
                          {style.label}
                        </span>
                      </div>

                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/20 border-t border-border"
                      >
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" />
                            Reasoning Chain Visualization
                          </h4>
                          
                          <div className="relative border-l-2 border-primary/20 ml-2.5 pl-5 space-y-6">
                            {/* Step 1 */}
                            <div className="relative">
                              <div className="absolute -left-[29px] top-1 px-1 bg-background">
                                <FileText className="w-4 h-4 text-emerald-400 bg-background" />
                              </div>
                              <h5 className="text-sm font-medium text-foreground">Step 1: Claim Extracted</h5>
                              <p className="text-xs text-muted-foreground mt-1">Successfully parsed the core verifiable statements from the input {item.source} source.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative">
                              <div className="absolute -left-[29px] top-1 px-1 bg-background">
                                <Globe className="w-4 h-4 text-emerald-400 bg-background" />
                              </div>
                              <h5 className="text-sm font-medium text-foreground">Step 2: Trusted Source Search</h5>
                              <p className="text-xs text-muted-foreground mt-1">Queried established fact-checking databases, news archives, and official government API records.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative">
                              <div className="absolute -left-[29px] top-1 px-1 bg-background">
                                <Database className="w-4 h-4 text-emerald-400 bg-background" />
                              </div>
                              <h5 className="text-sm font-medium text-foreground">Step 3: Cross-Reference Check</h5>
                              <p className="text-xs text-muted-foreground mt-1">Compared chronological reporting and analyzed counter-evidence. No anomalies found in retrieved data.</p>
                            </div>

                            {/* Step 4 */}
                            <div className="relative">
                              <div className="absolute -left-[29px] top-1 px-1 bg-background">
                                {item.riskScore > 50 ? (
                                  <AlertTriangle className="w-4 h-4 text-amber-400 bg-background" />
                                ) : (
                                  <ShieldCheck className="w-4 h-4 text-emerald-400 bg-background" />
                                )}
                              </div>
                              <h5 className="text-sm font-medium text-foreground">Step 4: Risk Evaluation</h5>
                              <p className="text-xs text-muted-foreground mt-1">Calculated spread velocity and potential societal harm. Assigned a Risk Score of {item.riskScore}/100.</p>
                            </div>

                            {/* Step 5 */}
                            <div className="relative">
                              <div className="absolute -left-[30px] top-1 px-1 bg-background">
                                <style.icon className={`w-[18px] h-[18px] bg-background ${style.colorClass}`} />
                              </div>
                              <h5 className={`text-sm font-bold ${style.colorClass}`}>Step 5: Final Verdict — {style.label}</h5>
                              <p className="text-sm text-secondary-foreground mt-1.5 leading-relaxed bg-black/20 p-3 rounded border border-border">
                                {item.reasoning}
                              </p>
                            </div>
                          </div>

                          {/* Sources Checked Section */}
                          <div className="mt-8 pt-6 border-t border-border/50">
                            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                              <Link2 className="w-4 h-4 text-primary" />
                              Sources Checked
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.sourcesChecked.map((source, idx) => (
                                <div key={idx} className="bg-background/50 border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                                  <div className="flex items-start justify-between mb-2">
                                    <h5 className="text-sm font-semibold text-foreground truncate mr-2">{source.name}</h5>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                                      source.reliability === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                      source.reliability === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                      'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                      {source.reliability}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-mono text-primary/80 mb-2">{source.type}</div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {source.finding}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LiveFeed;
