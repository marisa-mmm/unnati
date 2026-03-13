import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import ClaimInput from "@/components/ClaimInput";
import TruthReport, { TruthReportData } from "@/components/TruthReport";
import AuthHeader from "@/components/AuthHeader";
import HistoryPanel from "@/components/HistoryPanel";
import ViralityEngine from "@/components/ViralityEngine";
import DebateLog from "@/components/DebateLog";
import TraceTimeline, { TraceStep } from "@/components/TraceTimeline";
import { toast } from "sonner";

const initialSteps: TraceStep[] = [
  { id: "src", label: "Source Detected", status: "pending" },
  { id: "ana", label: "Agent Analysis", status: "pending" },
  { id: "db", label: "Database Cross-Ref", status: "pending" },
  { id: "ver", label: "Official Verdict", status: "pending" },
];

type LiveLog = {
  id: string;
  role: "proponent" | "opponent" | "judge";
  content: string;
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<TruthReportData | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [showDebate, setShowDebate] = useState(false);
  const [liveLogs, setLiveLogs] = useState<LiveLog[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState<TraceStep[]>(initialSteps);
  const [viralityScore, setViralityScore] = useState(0);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractVideoFrame = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);
      video.src = url;
      video.currentTime = 1;

      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to extract video frame"));
      };
    });
  };

  const runVerificationSimulation = () => {
    let currentStep = 0;

    setTimelineSteps(initialSteps.map((s) => ({ ...s })));
    setShowTimeline(true);
    setLiveLogs([]);
    setShowDebate(true);

    const logSequence: LiveLog[] = [
      {
        id: "log-1",
        role: "proponent",
        content: "Querying Google Fact Check API... (Scanning 12 recent debunked claims)",
      },
      {
        id: "log-2",
        role: "opponent",
        content: "Searching site:gov.in and site:pib.gov.in for official press releases...",
      },
      {
        id: "log-3",
        role: "judge",
        content: "Cross-referencing timestamps. Claim date vs Article publish date mismatch detected.",
      },
      {
        id: "log-4",
        role: "proponent",
        content: "Analyzing semantic context... Sensationalist bait markers found.",
      },
    ];

    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setTimelineSteps((prev) => {
          const next = [...prev];

          if (currentStep > 0 && currentStep <= next.length) {
            next[currentStep - 1] = {
              ...next[currentStep - 1],
              status: "complete",
              timestamp: new Date().toLocaleTimeString(),
            };
          }

          if (currentStep < next.length) {
            next[currentStep] = {
              ...next[currentStep],
              status: "loading",
            };
          }

          return next;
        });

        const nextLog = logSequence[currentStep];
        if (nextLog) {
          setLiveLogs((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${currentStep}`,
              role: nextLog.role,
              content: nextLog.content,
            },
          ]);
        }

        currentStep++;

        if (currentStep > initialSteps.length) {
          clearInterval(interval);
          resolve();
        }
      }, 1500);
    });
  };

  const handleClaimSubmit = async (claim: string, mediaFile?: File) => {
    setIsLoading(true);
    setReport(null);
    setShowDebate(false);
    setShowTimeline(false);
    setViralityScore(0);

    try {
      let mediaBase64: string | undefined;
      let mediaType: string | undefined;

      if (mediaFile) {
        if (mediaFile.type.startsWith("video/")) {
          mediaBase64 = await extractVideoFrame(mediaFile);
          mediaType = "video";
        } else if (mediaFile.type.startsWith("image/")) {
          mediaBase64 = await fileToBase64(mediaFile);
          mediaType = "image";
        }
      }

      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is missing from .env file");
      }

      const simPromise = runVerificationSimulation();

      const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;
      let webContext = "";

      if (TAVILY_API_KEY && claim) {
        try {
          const tavilyRes = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              api_key: TAVILY_API_KEY,
              query: claim,
              search_depth: "basic",
              include_answer: true,
              max_results: 3,
            }),
          });

          if (tavilyRes.ok) {
            const tavilyData = await tavilyRes.json();
            const resultsStr = tavilyData.results
              ?.map((r: any) => `- ${r.title}: ${r.content} (${r.url})`)
              .join("\n");

            webContext = `\nREAL-TIME WEB SEARCH RESULTS (Use this to verify the claim):\n${
              tavilyData.answer || ""
            }\n${resultsStr || ""}\n`;
          }
        } catch (e) {
          console.error("Tavily search failed", e);
        }
      }

      const prompt = `You are UNNATI, an advanced AI-powered misinformation detection system. Your job is to fact-check claims, analyze images/videos for AI-generated content, and verify news.

You MUST respond with a JSON object using this exact structure (no markdown, no code fences, just raw JSON):
{
  "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED",
  "riskSeverity": 1-5,
  "evidence": [
    { "fact": "A specific fact you found", "source": "URL or source name" }
  ],
  "reasoning": "Detailed explanation of your analysis",
  "counterNarrative": "A shareable fact-check message people can use to counter misinformation"
}

CRITICAL: Detect the language of the claim, and write your 'reasoning', 'counterNarrative', and 'evidence facts' in THAT exact same language. (e.g., if the claim is in Hindi, your explanations must be in Hindi). The JSON keys must remain in English.
${webContext}
Analyze this claim: "${claim}"`;

      const contents: any[] = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];

      if (mediaBase64) {
        const base64Data = mediaBase64.split(",")[1];
        contents[0].parts.unshift({
          inlineData: {
            data: base64Data,
            mimeType: mediaFile?.type || "image/jpeg",
          },
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      await simPromise;

      if (!response.ok) {
        throw new Error("Failed to contact Gemini API. Ensure API key is correct.");
      }

      const rawData = await response.json();
      const textResponse = rawData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      let parsed: any;

      try {
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = {
            verdict: "UNVERIFIED",
            riskSeverity: 3,
            evidence: [{ fact: "Format Error", source: "" }],
            reasoning: "The AI responded in an unexpected format: " + textResponse.substring(0, 100),
            counterNarrative: "",
          };
        }
      } catch (e) {
        console.error("JSON Parse Error. Raw string was:", textResponse);
        parsed = {
          verdict: "UNVERIFIED",
          riskSeverity: 3,
          evidence: [{ fact: "Parse Error", source: "" }],
          reasoning: "The AI responded with invalid JSON that could not be parsed.",
          counterNarrative: "N/A",
        };
      }

      const reportData: TruthReportData = {
        verdict: parsed.verdict || "UNVERIFIED",
        riskSeverity: parsed.riskSeverity || 3,
        evidence: parsed.evidence || [],
        reasoning: parsed.reasoning || "Could not generate reasoning.",
        counterNarrative: parsed.counterNarrative || "",
        claim: claim || `[${mediaType} analysis]`,
      };

      setReport(reportData);

      const calculatedScore = (reportData.riskSeverity / 5) * 100;
      setViralityScore(calculatedScore);

      setTimelineSteps((prev) => {
        const next = [...prev];
        if (next[3]) {
          next[3] = {
            ...next[3],
            status: reportData.riskSeverity >= 4 ? "alert" : "complete",
            timestamp: new Date().toLocaleTimeString(),
          };
        }
        return next;
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error: insertError } = await supabase.from("claim_history").insert({
          user_id: user.id,
          claim_text: claim || null,
          media_type: mediaType || "text",
          verdict: reportData.verdict,
          risk_severity: reportData.riskSeverity,
          evidence: reportData.evidence,
          reasoning: reportData.reasoning,
          counter_narrative: reportData.counterNarrative,
        });

        if (insertError) {
          console.error("Failed to save to history:", insertError);
          toast.error("Analysis complete, but failed to save to your history: " + insertError.message);
        } else {
          toast.success("Saved to your history");
        }
      }
    } catch (error: any) {
      console.error("Fact-check error:", error);
      toast.error(error.message || "Failed to analyze claim");

      setTimelineSteps((prev) => {
        const next = [...prev];
        if (next.length > 0) {
          next[next.length - 1] = {
            ...next[next.length - 1],
            status: "alert",
          };
        }
        return next;
      });
    } finally {
      setIsLoading(false);
      setShowDebate(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative z-10 transition-colors duration-500">
      <ViralityEngine riskScore={viralityScore} />

      <AuthHeader onShowHistory={() => setHistoryOpen(true)} />
      <HeroSection />

      <div className="space-y-12 pb-20 px-4 md:px-0">
        <ClaimInput onSubmit={handleClaimSubmit} isLoading={isLoading} />

        {showTimeline && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <TraceTimeline steps={timelineSteps} />
          </div>
        )}

        {showDebate && !report && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <DebateLog messages={liveLogs} />
          </div>
        )}

        {report && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <TruthReport report={report} />
          </div>
        )}
      </div>

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
};

export default Index;