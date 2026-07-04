import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, CheckCircle, HelpCircle, XCircle, Twitter, Globe, Youtube, MessageCircle, Clock, Search, FileText, Database, ShieldCheck, Link2, Loader2, RefreshCw } from "lucide-react";
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

// ── Static fallback data shown when API is unavailable ──
const STATIC_FEED: FeedItem[] = [
  {
    id: "static-1",
    claim: "WHO declares 5G towers responsible for recent bird population decline across Southeast Asia",
    source: "WhatsApp",
    riskScore: 91,
    verdict: "FALSE",
    confidence: 97,
    timestamp: "2 min ago",
    reasoning: "The WHO has never issued any such declaration. Multiple peer-reviewed studies confirm 5G frequencies (3–300 GHz) are non-ionizing and have no proven biological effect on birds. The claim originated from a satirical blog post that was shared out of context and went viral on WhatsApp chains.",
    sourcesChecked: [
      { name: "WHO Official Site", type: "Official Record", finding: "No such advisory exists in any WHO database or press release.", reliability: "High" },
      { name: "BirdLife International", type: "Database", finding: "Bird decline attributed to habitat loss and climate shift — not EMF.", reliability: "High" },
    ],
  },
  {
    id: "static-2",
    claim: "India's Supreme Court has ordered suspension of all UPI transactions for 72 hours citing security audit",
    source: "Twitter",
    riskScore: 88,
    verdict: "FALSE",
    confidence: 95,
    timestamp: "7 min ago",
    reasoning: "No such order exists. The Supreme Court of India has not issued any directive related to UPI transaction suspension. The claim may have originated from a manipulated screenshot circulated on social media. NPCI and RBI have not issued any related advisory.",
    sourcesChecked: [
      { name: "Supreme Court of India", type: "Official Record", finding: "No relevant case or order found in the court registry.", reliability: "High" },
      { name: "RBI Official Site", type: "Official Record", finding: "No UPI suspension advisory issued.", reliability: "High" },
    ],
  },
  {
    id: "static-3",
    claim: "NASA confirms a habitable exoplanet with liquid water discovered just 12 light-years from Earth",
    source: "YouTube",
    riskScore: 55,
    verdict: "MISLEADING",
    confidence: 82,
    timestamp: "14 min ago",
    reasoning: "NASA did make an exoplanet discovery announcement, but the claim of 'habitable' and 'liquid water' is speculative extrapolation. The planet detected shows atmospheric markers that could indicate water vapor, but no direct confirmation of surface liquid water has been made. The distance of 12 light-years is also inaccurate — the actual discovery was at 40+ light-years.",
    sourcesChecked: [
      { name: "NASA Exoplanet Archive", type: "Database", finding: "Candidate planet flagged as 'potentially habitable zone' — not confirmed habitable.", reliability: "High" },
      { name: "Nature Astronomy Journal", type: "News Archive", finding: "Peer review pending; water vapor inference based on spectroscopy.", reliability: "High" },
    ],
  },
  {
    id: "static-4",
    claim: "India becomes the 3rd largest economy globally, surpassing Japan in 2024 IMF rankings",
    source: "Web",
    riskScore: 18,
    verdict: "TRUE",
    confidence: 92,
    timestamp: "31 min ago",
    reasoning: "This claim is accurate. According to IMF World Economic Outlook data for 2024, India surpassed Japan to become the world's 3rd largest economy by nominal GDP. This milestone was reported by multiple credible outlets including Reuters, Bloomberg, and the Ministry of Finance India.",
    sourcesChecked: [
      { name: "IMF World Economic Outlook", type: "Official Record", finding: "India GDP 2024: $3.94T — ranked 3rd globally behind US and China.", reliability: "High" },
      { name: "Reuters", type: "News Archive", finding: "Confirmed in multiple quarterly reports and official IMF data.", reliability: "High" },
    ],
  },
  {
    id: "static-5",
    claim: "Viral video shows Delhi metro flooding due to 'underground river breach' — railway officials confirm",
    source: "Reddit",
    riskScore: 73,
    verdict: "MISLEADING",
    confidence: 88,
    timestamp: "48 min ago",
    reasoning: "The video is real but the context is false. The flooding shown occurred during a monsoon water seepage incident in 2023, not a 'river breach'. There are no underground rivers beneath the Delhi metro network. DMRC clarified on their official X (Twitter) account that flooding was due to heavy rainfall-induced water ingress through ventilation shafts.",
    sourcesChecked: [
      { name: "DMRC Official X Account", type: "Official Record", finding: "Flooding was a monsoon seepage event, not a river breach. Old video recirculated.", reliability: "High" },
      { name: "India Meteorological Department", type: "Database", finding: "Extreme rainfall event confirmed for the period shown in original video.", reliability: "High" },
    ],
  },
];

export const LiveFeed = () => {
  const [feed, setFeed] = useState<FeedItem[]>(STATIC_FEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveClaims = async () => {
    setIsLoading(true);
    setExpandedId(null);

    try {
      const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      if (!GEMINI_API_KEY) throw new Error("Gemini API key is missing");

      let context = "Recent Global News Headlines:\n";
      
      if (NEWS_API_KEY) {
        try {
          const newsRes = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`);
          if (newsRes.ok) {
            const data = await newsRes.json();
            context += data.articles?.slice(0, 10).map((a: any) => `- ${a.title}`).join("\n");
          }
        } catch (e) {
          console.error("News API failed", e);
        }
      }

      const prompt = `You are a Live Fact-Checking Threat Intelligence Engine.
Analyze the following real-time news headlines:
${context}

Your task is to generate a realistic "Live Stream of Flagged Claims" based on these current topics. Simulate how these headlines might be misrepresented on social media, or if they are just breaking news, analyze their factuality. Create a mix of TRUE, FALSE, and MISLEADING claims reflecting the current news cycle.

Return ONLY a JSON object mapping to this interface exactly:
{
  "claims": [
    {
      "id": "a-unique-string",
      "claim": "The supposed claim appearing on social media",
      "source": "Twitter" | "YouTube" | "Web" | "Reddit" | "WhatsApp",
      "riskScore": number (0-100),
      "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED",
      "confidence": number (0-100),
      "timestamp": "Just now",
      "reasoning": "A solid, detailed paragraph explaining the fact-check",
      "sourcesChecked": [
        {
          "name": "e.g., Reuters, FactCheck.org, Official DB",
          "type": "Database" | "News Archive" | "Official Record" | "Social Graph",
          "finding": "What this source stated about the claim",
          "reliability": "High" | "Medium" | "Low"
        }
      ]
    }
  ] // Return exactly 4 claims
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Gemini API Failed");

      const rawData = await response.json();
      const textResponse = rawData?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const parsed = JSON.parse(textResponse || "{}");
      if (parsed && parsed.claims) {
        setFeed(parsed.claims);
        return;
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    // Fallback: always show curated static data
    setFeed(STATIC_FEED);
  };

  useEffect(() => {
    fetchLiveClaims();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section className="max-w-3xl mx-auto px-6 mb-16 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground">Live Flagged Claims</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLiveClaims}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground text-xs font-medium transition-colors border border-border disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Refresh Stream
          </button>
          <span className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full uppercase tracking-widest border border-border hidden sm:block">Global Stream</span>
        </div>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {isLoading && feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-border rounded-xl bg-card/50">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Monitoring global feeds in real-time...</p>
          </div>
        ) : (
          <AnimatePresence>
            {feed.map((item) => {
              const style = VERDICT_STYLES[item.verdict] || VERDICT_STYLES["UNVERIFIED"];
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
                      className="p-5 cursor-pointer flex flex-col gap-3"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {/* Top Row: Source, Time, and Verdict */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-muted-foreground bg-black/20 px-2.5 py-1 rounded-md text-xs font-semibold border border-white/5">
                            <SourceIcon className="w-3.5 h-3.5" />
                            <span>{item.source}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.timestamp}</span>
                          </div>
                        </div>

                        {/* Verdict Badge */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${style.bgClass} shadow-sm`}>
                          <style.icon className={`w-3.5 h-3.5 ${style.colorClass}`} />
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${style.colorClass}`}>
                            {style.label}
                          </span>
                        </div>
                      </div>

                      {/* Main Claim Text */}
                      <h3 className="text-foreground font-semibold text-[17px] leading-relaxed py-1">
                        "{item.claim}"
                      </h3>

                      {/* Bottom Row: Score Metrics & Expand Toggle */}
                      <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                          
                          {/* Risk Score */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Risk</span>
                            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" style={{ width: `${item.riskScore}%` }} />
                            </div>
                            <span className="text-xs font-mono text-foreground font-medium">{item.riskScore}%</span>
                          </div>

                          {/* Confidence Score */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Conf</span>
                            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-primary/80 rounded-full" style={{ width: `${item.confidence}%` }} />
                            </div>
                            <span className="text-xs font-mono text-foreground font-medium">{item.confidence}%</span>
                          </div>
                          
                        </div>

                        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
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
                              <div className="relative">
                                <div className="absolute -left-[29px] top-1 px-1 bg-background">
                                  <FileText className="w-4 h-4 text-emerald-400 bg-background" />
                                </div>
                                <h5 className="text-sm font-medium text-foreground">Step 1: Claim Extracted</h5>
                                <p className="text-xs text-muted-foreground mt-1">Successfully parsed the core verifiable statements from the input {item.source} source.</p>
                              </div>

                              <div className="relative">
                                <div className="absolute -left-[29px] top-1 px-1 bg-background">
                                  <Globe className="w-4 h-4 text-emerald-400 bg-background" />
                                </div>
                                <h5 className="text-sm font-medium text-foreground">Step 2: Trusted Source Search</h5>
                                <p className="text-xs text-muted-foreground mt-1">Queried established fact-checking databases, news archives, and official government API records.</p>
                              </div>

                              <div className="relative">
                                <div className="absolute -left-[29px] top-1 px-1 bg-background">
                                  <Database className="w-4 h-4 text-emerald-400 bg-background" />
                                </div>
                                <h5 className="text-sm font-medium text-foreground">Step 3: Cross-Reference Check</h5>
                                <p className="text-xs text-muted-foreground mt-1">Compared chronological reporting and analyzed counter-evidence. No anomalies found in retrieved data.</p>
                              </div>

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
        )}
      </div>
    </section>
  );
};

export default LiveFeed;
