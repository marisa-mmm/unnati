import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";

interface Rumor {
  id: string;
  claim: string;
  category: string;
  location: string;
  url: string;
}

const GLOBAL_RUMORS: Rumor[] = [
  {
    id: "1",
    claim: "UN banning cash transactions globally by 2026",
    category: "Fabricated Content",
    location: "Global",
    url: "https://www.reuters.com/fact-check"
  },
  {
    id: "2",
    claim: "Recent solar flares caused mass internet outages in Europe",
    category: "False Context",
    location: "Europe",
    url: "https://www.snopes.com/"
  },
  {
    id: "3",
    claim: "New WHO treaty forces mandatory lockdowns for climate change",
    category: "Fabricated Content",
    location: "Global",
    url: "https://www.politifact.com/"
  },
  {
    id: "4",
    claim: "AI models spotted hacking into Pentagon servers autonomously",
    category: "Manipulated Media",
    location: "USA",
    url: "https://www.factcheck.org/"
  },
  {
    id: "5",
    claim: "WhatsApp charging monthly fee starting next month",
    category: "Fabricated Content",
    location: "Global",
    url: "https://www.altnews.in/"
  },
  {
    id: "6",
    claim: "Eiffel Tower caught fire during recent protests",
    category: "Manipulated Media",
    location: "France",
    url: "https://www.snopes.com/"
  },
  {
    id: "7",
    claim: "WEF announces plans to mandate lab-grown meat by 2030",
    category: "False Context",
    location: "Global",
    url: "https://www.poynter.org/ifcn/"
  },
  {
    id: "8",
    claim: "Secret asteroid heading towards Earth hidden by NASA",
    category: "Fabricated Content",
    location: "Global",
    url: "https://science.nasa.gov/"
  },
  {
    id: "9",
    claim: "New 5G upgrade causes widespread bird deaths in Australia",
    category: "False Context",
    location: "Australia",
    url: "https://www.rmit.edu.au/news/factlab"
  },
  {
    id: "10",
    claim: "Digital IDs will track all personal purchases globally",
    category: "Misleading Context",
    location: "Global",
    url: "https://www.reuters.com/fact-check"
  }
];

export const GlobalRumorsTicker = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full bg-red-950/20 border-y border-red-500/20 py-2.5 overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.05)] text-sm">
      <div className="flex items-center absolute left-0 z-10 bg-gradient-to-r from-background via-background/95 to-transparent px-4 py-1 h-full top-0">
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full text-red-400 font-display font-bold text-xs uppercase tracking-wider backdrop-blur-md">
          <AlertTriangle className="w-3.5 h-3.5" />
          Top 10 Global Rumors
        </div>
      </div>
      
      <Marquee gradient={false} speed={40} className="pl-[220px]">
        {GLOBAL_RUMORS.map((rumor, i) => (
          <div key={rumor.id} className="flex items-center ml-8 group cursor-pointer" onClick={() => window.open(rumor.url, '_blank')}>
            <span className="text-muted-foreground mr-3 font-mono text-xs opacity-60">#{i + 1}</span>
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 hover:border-red-500/30 transition-colors px-4 py-1.5 rounded-full">
              <span className="text-red-400 font-medium whitespace-nowrap">"{rumor.claim}"</span>
              <div className="w-1 h-1 rounded-full bg-border mx-1" />
              <span className="text-muted-foreground text-xs font-mono">{rumor.category}</span>
              <div className="w-1 h-1 rounded-full bg-border mx-1" />
              <span className="text-foreground text-xs opacity-75">{rumor.location}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-3 opacity-30" />
          </div>
        ))}
      </Marquee>

      <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
};
