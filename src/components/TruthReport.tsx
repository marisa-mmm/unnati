import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  XCircle,
  HelpCircle,
  CheckCircle,
  MessageSquare,
  Brain,
  FileText,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

export type Verdict = "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED";

export interface TruthReportData {
  verdict: Verdict;
  riskSeverity: number;
  evidence: { fact: string; source: string }[];
  reasoning: string;
  counterNarrative: string;
  claim: string;
}

const verdictConfig: Record<
  Verdict,
  {
    icon: typeof Shield;
    label: string;
    colorClass: string;
    glowClass: string;
    bgClass: string;
  }
> = {
  TRUE: {
    icon: CheckCircle,
    label: "Verified True",
    colorClass: "text-verdict-true",
    glowClass: "glow-true",
    bgClass: "bg-verdict-true/10 border-verdict-true/30",
  },
  FALSE: {
    icon: XCircle,
    label: "False",
    colorClass: "text-verdict-false",
    glowClass: "glow-false",
    bgClass: "bg-verdict-false/10 border-verdict-false/30",
  },
  MISLEADING: {
    icon: AlertTriangle,
    label: "Misleading",
    colorClass: "text-verdict-misleading",
    glowClass: "glow-misleading",
    bgClass: "bg-verdict-misleading/10 border-verdict-misleading/30",
  },
  UNVERIFIED: {
    icon: HelpCircle,
    label: "Unverified",
    colorClass: "text-verdict-unverified",
    glowClass: "",
    bgClass: "bg-verdict-unverified/10 border-verdict-unverified/30",
  },
};

const RiskMeter = ({ severity }: { severity: number }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground font-display">Risk</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            className={`w-8 h-3 rounded-sm ${
              level <= severity
                ? severity >= 4
                  ? "bg-verdict-false"
                  : severity >= 3
                  ? "bg-verdict-misleading"
                  : "bg-verdict-true"
                : "bg-secondary"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1 * level, duration: 0.3 }}
          />
        ))}
      </div>
      <span className="text-sm font-display font-semibold text-foreground">{severity}/5</span>
    </div>
  );
};

const TruthReport = ({ report }: { report: TruthReportData }) => {
  const normalizedVerdict = (report.verdict?.toString().toUpperCase() || "UNVERIFIED") as Verdict;
  const config = verdictConfig[normalizedVerdict] || verdictConfig["UNVERIFIED"];
  const VerdictIcon = config.icon;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-US");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getBestVoice = (lang: string) => {
    if (!voices.length) return null;

    const exactMatch = voices.find(
      (voice) => voice.lang.toLowerCase() === lang.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    const baseLang = lang.split("-")[0].toLowerCase();

    const partialMatch = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(baseLang)
    );
    if (partialMatch) return partialMatch;

    const googleMatch = voices.find(
      (voice) =>
        voice.lang.toLowerCase().startsWith(baseLang) &&
        voice.name.toLowerCase().includes("google")
    );
    if (googleMatch) return googleMatch;

    return null;
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Verdict: ${config.label}. Reasoning: ${report.reasoning}. Counter Narrative: ${report.counterNarrative}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = speechLang;

    const selectedVoice = getBestVoice(speechLang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      alert(
        `Audio playback failed for ${speechLang}. Your browser/OS may not have a voice installed for this language.`
      );
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.section
      className="max-w-3xl mx-auto px-6 space-y-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={`p-6 border ${config.bgClass} ${config.glowClass}`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <VerdictIcon className={`w-8 h-8 ${config.colorClass}`} />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-display">
                  Verdict
                </p>
                <h2 className={`font-display text-2xl font-bold ${config.colorClass}`}>
                  {config.label}
                </h2>
              </div>
            </div>
            <RiskMeter severity={report.riskSeverity} />
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 pt-4 border-t border-border">
            <span className="text-sm font-display text-muted-foreground mr-1">
              Listen to Report:
            </span>

            <select
              value={speechLang}
              onChange={(e) => {
                setSpeechLang(e.target.value);
                if (isSpeaking) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
              }}
              className="bg-card border border-border text-foreground text-sm rounded-md px-2 py-1 outline-none"
            >
              <option value="en-US">English</option>
              <option value="hi-IN">Hindi</option>
              <option value="mr-IN">Marathi</option>
              <option value="bn-IN">Bengali</option>
              <option value="te-IN">Telugu</option>
              <option value="ta-IN">Tamil</option>
              <option value="gu-IN">Gujarati</option>
              <option value="kn-IN">Kannada</option>
              <option value="ml-IN">Malayalam</option>
              <option value="pa-IN">Punjabi</option>
              <option value="ur-IN">Urdu</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
            </select>

            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isSpeaking
                  ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                  : "bg-primary/20 text-primary hover:bg-primary/30"
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isSpeaking ? "Stop Playback" : "Play Audio"}
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-display mb-1">
              Claim Analyzed
            </p>
            <p className="text-foreground italic">"{report.claim}"</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">The Evidence</h3>
        </div>
        <ul className="space-y-3">
          {(Array.isArray(report.evidence) ? report.evidence : report.evidence ? [report.evidence as any] : []).map(
            (item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-foreground">
                    {typeof item.fact === "string" ? item.fact : JSON.stringify(item.fact)}
                  </p>
                  <a
                    href={typeof item.source === "string" ? item.source : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    {typeof item.source === "string" ? item.source : "Source Link"}
                  </a>
                </div>
              </motion.li>
            )
          )}
        </ul>
      </Card>

      <Card className="p-5 bg-card border-border">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-accent" />
          <h3 className="font-display font-semibold text-foreground">The Reasoning</h3>
        </div>
        <p className="text-secondary-foreground text-sm leading-relaxed">
          {typeof report.reasoning === "string" ? report.reasoning : JSON.stringify(report.reasoning)}
        </p>
      </Card>

      <Card className="p-5 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Counter-Narrative</h3>
          <span className="text-xs text-muted-foreground ml-auto">Ready to share</span>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-foreground text-sm leading-relaxed">
            {typeof report.counterNarrative === "string"
              ? report.counterNarrative
              : JSON.stringify(report.counterNarrative)}
          </p>
        </div>
      </Card>
    </motion.section>
  );
};

export default TruthReport;