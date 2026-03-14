import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Twitter,
  Youtube,
  Newspaper,
  MessageCircle,
  Loader2,
  ExternalLink,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

type FeedTab = "twitter" | "youtube" | "news" | "reddit";

interface FeedItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  author?: string;
  thumbnail?: string;
  meta?: string;
  stat1?: string;
  stat2?: string;
}

interface FeedSummary {
  headline: string;
  subtext: string;
  totalItems: number;
  topItem?: string;
}

const TAB_CONFIG: Record<
  FeedTab,
  {
    label: string;
    icon: typeof Twitter;
    color: string;
    colorClass: string;
    gradient: string;
    glow: string;
    bgAccent: string;
    borderAccent: string;
  }
> = {
  twitter: {
    label: "Twitter / X",
    icon: Twitter,
    color: "#38bdf8",
    colorClass: "text-sky-400",
    gradient: "from-sky-500/20 to-blue-600/20",
    glow: "shadow-sky-500/25",
    bgAccent: "bg-sky-500/10",
    borderAccent: "border-sky-500/30",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    color: "#f87171",
    colorClass: "text-red-400",
    gradient: "from-red-500/20 to-rose-600/20",
    glow: "shadow-red-500/25",
    bgAccent: "bg-red-500/10",
    borderAccent: "border-red-500/30",
  },
  news: {
    label: "News",
    icon: Newspaper,
    color: "#34d399",
    colorClass: "text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-600/20",
    glow: "shadow-emerald-500/25",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/30",
  },
  reddit: {
    label: "Reddit",
    icon: MessageCircle,
    color: "#fb923c",
    colorClass: "text-orange-400",
    gradient: "from-orange-500/20 to-amber-600/20",
    glow: "shadow-orange-500/25",
    bgAccent: "bg-orange-500/10",
    borderAccent: "border-orange-500/30",
  },
};

const cache: Record<string, { data: FeedItem[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000;

// ─── API Fetchers ──────────────────────────────────────────────

async function fetchTwitter(): Promise<FeedItem[]> {
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!rapidApiKey) throw new Error("RapidAPI key is missing");

  const res = await fetch(
    "https://twitter-api45.p.rapidapi.com/trending.php?country=india",
    {
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
      },
    }
  );

  if (!res.ok) throw new Error(`Twitter API error: ${res.status}`);
  const data = await res.json();

  const trends = data?.trends || data || [];
  return (Array.isArray(trends) ? trends : [])
    .slice(0, 20)
    .map((item: any, i: number) => ({
      id: `tw-${i}`,
      title: item.name || item.trend || `#${i + 1} Trend`,
      description: item.domain_context || "",
      url:
        item.url ||
        `https://twitter.com/search?q=${encodeURIComponent(item.name || "")}`,
      source: "Twitter / X",
      stat1: item.tweet_count
        ? `${Number(item.tweet_count).toLocaleString()} tweets`
        : undefined,
    }));
}

async function fetchYouTube(): Promise<FeedItem[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YouTube API key is missing");

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=20&key=${apiKey}`
  );

  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  const data = await res.json();

  return (data.items || []).map((item: any) => ({
    id: `yt-${item.id}`,
    title: item.snippet?.title || "Untitled Video",
    description: item.snippet?.channelTitle || "",
    url: `https://www.youtube.com/watch?v=${item.id}`,
    source: "YouTube",
    author: item.snippet?.channelTitle,
    thumbnail:
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url,
    stat1: item.statistics?.viewCount
      ? `${Number(item.statistics.viewCount).toLocaleString()} views`
      : undefined,
    stat2: item.statistics?.likeCount
      ? `${Number(item.statistics.likeCount).toLocaleString()} likes`
      : undefined,
  }));
}

async function fetchNews(): Promise<FeedItem[]> {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) throw new Error("News API key is missing");

  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=in&pageSize=20&apiKey=${apiKey}`
  );

  if (!res.ok) {
    if (res.status === 426) {
      throw new Error(
        "NewsAPI free tier only works on localhost. Upgrade or run locally."
      );
    }
    throw new Error(`News API error: ${res.status}`);
  }
  const data = await res.json();

  return (data.articles || []).map((item: any, i: number) => ({
    id: `news-${i}`,
    title: item.title || "Untitled Article",
    description: item.description || "",
    url: item.url || "#",
    source: item.source?.name || "News",
    author: item.author,
    thumbnail: item.urlToImage,
    stat1: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : undefined,
  }));
}

async function fetchReddit(): Promise<FeedItem[]> {
  const res = await fetch(
    "https://www.reddit.com/r/popular/hot.json?limit=20",
    { headers: { Accept: "application/json" } }
  );

  if (!res.ok) throw new Error(`Reddit API error: ${res.status}`);
  const data = await res.json();

  return (data?.data?.children || []).map((child: any) => {
    const p = child.data;
    return {
      id: `rd-${p.id}`,
      title: p.title || "Untitled Post",
      description: `r/${p.subreddit}`,
      url: `https://www.reddit.com${p.permalink}`,
      source: "Reddit",
      author: `u/${p.author}`,
      thumbnail:
        p.thumbnail && p.thumbnail.startsWith("http") ? p.thumbnail : undefined,
      stat1: `${(p.ups || 0).toLocaleString()} upvotes`,
      stat2: `${(p.num_comments || 0).toLocaleString()} comments`,
    };
  });
}

const FETCHERS: Record<FeedTab, () => Promise<FeedItem[]>> = {
  twitter: fetchTwitter,
  youtube: fetchYouTube,
  news: fetchNews,
  reddit: fetchReddit,
};

// ─── Helpers ───────────────────────────────────────────────────

function buildSummary(tab: FeedTab, items: FeedItem[]): FeedSummary {
  const cfg = TAB_CONFIG[tab];
  const topItem = items[0]?.title || "";
  const truncatedTop =
    topItem.length > 70 ? topItem.substring(0, 70) + "…" : topItem;

  const summaryMap: Record<FeedTab, string> = {
    twitter: `${items.length} trending topics on X right now`,
    youtube: `${items.length} most popular videos in India`,
    news: `${items.length} breaking headlines from top sources`,
    reddit: `${items.length} hottest posts across Reddit`,
  };

  return {
    headline: summaryMap[tab],
    subtext: truncatedTop ? `#1: ${truncatedTop}` : "",
    totalItems: items.length,
    topItem: truncatedTop,
  };
}

// ─── Component ─────────────────────────────────────────────────

const TrendingFeed = () => {
  const [activeTab, setActiveTab] = useState<FeedTab | null>(null);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedStatus, setFeedStatus] = useState<
    "idle" | "loading" | "complete" | "error"
  >("idle");
  const [summary, setSummary] = useState<FeedSummary | null>(null);
  const [fetchTime, setFetchTime] = useState<string>("");

  const loadFeed = useCallback(async (tab: FeedTab, forceRefresh = false) => {
    setActiveTab(tab);
    setItems([]);
    setLoading(true);
    setFeedStatus("loading");
    setSummary(null);

    const cached = cache[tab];
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setItems(cached.data);
      setSummary(buildSummary(tab, cached.data));
      setFetchTime(new Date(cached.timestamp).toLocaleTimeString());
      setFeedStatus("complete");
      setLoading(false);
      return;
    }

    try {
      const start = Date.now();
      const data = await FETCHERS[tab]();
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      cache[tab] = { data, timestamp: Date.now() };
      setItems(data);
      setSummary(buildSummary(tab, data));
      setFetchTime(`${elapsed}s ago`);
      setFeedStatus("complete");
    } catch (err: any) {
      console.error(`Error fetching ${tab}:`, err);
      toast.error(
        err.message || `Failed to fetch ${TAB_CONFIG[tab].label} data`
      );
      setItems([]);
      setFeedStatus("error");
    } finally {
      setLoading(false);
    }
  }, []);

  const collapseFeed = useCallback(() => {
    setActiveTab(null);
    setItems([]);
    setFeedStatus("idle");
    setSummary(null);
  }, []);

  const cfg = activeTab ? TAB_CONFIG[activeTab] : null;

  return (
    <section className="max-w-5xl mx-auto w-full">
      {/* ═══ VISIBILITY ANCHOR — Section Header ═══ */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Trending <span className="text-gradient-brand">Now</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live feeds from across the internet
          </p>
        </div>
      </div>

      {/* ═══ TAB BUTTONS ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 mt-5">
        {(Object.keys(TAB_CONFIG) as FeedTab[]).map((tab) => {
          const { label, icon: Icon, colorClass, gradient, glow } =
            TAB_CONFIG[tab];
          const isActive = activeTab === tab;

          return (
            <motion.button
              key={tab}
              onClick={() => (isActive ? collapseFeed() : loadFeed(tab))}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`
                relative flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl
                border transition-all duration-300 font-semibold text-sm
                ${
                  isActive
                    ? `bg-gradient-to-br ${gradient} border-white/20 shadow-lg ${glow}`
                    : "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/15"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? colorClass : "text-muted-foreground"}`}
              />
              <span
                className={isActive ? "text-white" : "text-muted-foreground"}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-xl border-2 border-white/15 pointer-events-none"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ═══ CONTENT AREA ═══ */}
      <AnimatePresence mode="wait">
        {/* ── Idle State ── */}
        {feedStatus === "idle" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-4">
              <TrendingUp className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a category above to view trending content
            </p>
          </motion.div>
        )}

        {/* ── Loading State ── */}
        {feedStatus === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{ backgroundColor: cfg?.color }}
              />
              <Loader2
                className={`w-12 h-12 animate-spin ${cfg?.colorClass || "text-primary"}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Fetching latest from <b className="text-white">{cfg?.label}</b>…
            </p>
          </motion.div>
        )}

        {/* ── Error State ── */}
        {feedStatus === "error" && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300">
                Failed to load feed
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              The API may be unavailable. Try refreshing or check your API keys.
            </p>
            <button
              onClick={() => activeTab && loadFeed(activeTab, true)}
              className="mt-4 flex items-center gap-1.5 mx-auto text-xs text-primary hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>

            {/* ── TASK COMPLETE signal for error ── */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-red-400/60">
              <AlertCircle className="w-3 h-3" />
              <span>FEED ENDED — ERROR</span>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {feedStatus === "complete" && !loading && activeTab && cfg && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* ═══ NEWS BREAK PROTOCOL — Summary Banner ═══ */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`mb-5 p-4 rounded-xl border ${cfg.borderAccent} ${cfg.bgAccent} backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: cfg.color }}
                      >
                        LIVE SUMMARY
                      </span>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {summary.headline}
                    </p>
                    {summary.subtext && (
                      <p className="text-xs text-white/60 mt-1 truncate">
                        {summary.subtext}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <div className="text-right">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: cfg.color }}
                      >
                        {summary.totalItems}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        items
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated {fetchTime}</span>
              </div>
              <button
                onClick={() => loadFeed(activeTab, true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground
                           hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {/* ── Card Grid ── */}
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">
                  No results found. The API may be temporarily unavailable.
                </p>
              </div>
            ) : (
              <div className="grid gap-2.5">
                {items.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.025, duration: 0.25 }}
                    className="group flex items-start gap-3 p-3.5 rounded-xl
                               bg-white/[0.02] border border-white/[0.05]
                               hover:bg-white/[0.06] hover:border-white/[0.12]
                               transition-all duration-250 hover:shadow-md"
                  >
                    {/* Rank Badge */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: `${cfg.color}15`,
                        color: cfg.color,
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    {item.thumbnail && (
                      <div className="flex-shrink-0 w-18 h-12 rounded-lg overflow-hidden bg-white/5">
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white/90 group-hover:text-white line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {item.description && (
                          <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                            {item.description}
                          </span>
                        )}
                        {item.stat1 && (
                          <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: cfg.color + "aa" }}>
                            <Eye className="w-3 h-3" />
                            {item.stat1}
                          </span>
                        )}
                        {item.stat2 && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
                            <ThumbsUp className="w-3 h-3" />
                            {item.stat2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* External link */}
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-white/50 flex-shrink-0 mt-1 transition-colors" />
                  </motion.a>
                ))}
              </div>
            )}

            {/* ═══ COMPLETION SIGNAL ═══ */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center justify-center gap-2"
              >
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{
                    borderColor: `${cfg.color}30`,
                    backgroundColor: `${cfg.color}08`,
                  }}
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: cfg.color }}
                  />
                  <span
                    className="text-xs font-semibold tracking-wide uppercase"
                    style={{ color: `${cfg.color}cc` }}
                  >
                    Feed Complete — {items.length} items loaded
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TrendingFeed;
