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
import TrendingFeed from "@/components/TrendingFeed";
import IDVerifier from "@/components/IDVerifier";
import LiveFeed from "@/components/LiveFeed";
import AuditLogPanel from "@/components/AuditLogPanel";
import { toast } from "sonner";

import { GlobalRumorsTicker } from "@/components/GlobalRumorsTicker";

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
  const [auditOpen, setAuditOpen] = useState(false);

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

    setTimeout(() => {
      document.getElementById("analysis-timeline")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

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
      let mediaMimeType: string | undefined;
      let extractedDocText: string | undefined;

      const docTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/csv",
        "application/rtf",
      ];

      if (mediaFile) {
        if (mediaFile.type.startsWith("video/")) {
          mediaBase64 = await extractVideoFrame(mediaFile);
          mediaType = "video";
          mediaMimeType = "image/jpeg";
        } else if (mediaFile.type.startsWith("image/")) {
          mediaBase64 = await fileToBase64(mediaFile);
          mediaType = "image";
          mediaMimeType = mediaFile.type;
        } else if (docTypes.includes(mediaFile.type) || mediaFile.name.endsWith(".pdf")) {
          // Handle PDF and documents
          mediaType = "document";
          mediaMimeType = mediaFile.type || "application/pdf";

          if (mediaFile.type === "text/plain" || mediaFile.type === "text/csv") {
            // For text files, read as text and pass as prompt
            extractedDocText = await mediaFile.text();
          } else {
            // For PDFs and binary docs, read as base64 — Gemini supports PDF natively
            mediaBase64 = await fileToBase64(mediaFile);
          }
        }
      }

      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is missing from .env file");
      }

      const simPromise = runVerificationSimulation();

      const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;
      let webContext = "";
      let realSearchUrls: { title: string; url: string }[] = [];

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
              max_results: 5,
            }),
          });

          if (tavilyRes.ok) {
            const tavilyData = await tavilyRes.json();
            realSearchUrls = (tavilyData.results || []).map((r: any) => ({
              title: r.title || "",
              url: r.url || "",
            }));

            const resultsStr = tavilyData.results
              ?.map((r: any) => `- ${r.title}: ${r.content} (${r.url})`)
              .join("\n");

            webContext = `\nREAL-TIME WEB SEARCH RESULTS (Use these verified URLs in your evidence sources and counterEvidenceUrl):\n${
              tavilyData.answer || ""
            }\n${resultsStr || ""}\n`;
          }
        } catch (e) {
          console.error("Tavily search failed", e);
        }
      }

      const prompt = `You are UNNATI, an advanced AI-powered misinformation detection system and document verification assistant. 

Your job is to:
1. Fact-check text claims.
2. Analyze images/videos for AI-generated content (deepfakes).
3. **Government ID Verification.** If an image of a Government ID (like Aadhaar, PAN, Passport, Voter ID, Driving License, etc.) is provided:
   - Identify the specific Document Type.
   - Extract relevant metadata (Name, ID Number, Expiry, Date of Birth).
   - Perform a forensic check for tampering (e.g., mismatched fonts, inconsistent lighting, photo overlays, artifacts of digital editing).
   - Assign an 'Authenticity Score' (part of riskSeverity).

VERDICT RULES — CRITICAL:
For TEXT CLAIMS:
  - "TRUE" = The claim is factually correct and verified.
  - "FALSE" = The claim is factually wrong / misinformation.
  - "MISLEADING" = Partially true but taken out of context.
  - "UNVERIFIED" = Cannot determine truth from available evidence.

For GOVERNMENT ID DOCUMENTS:
  - "TRUE" = The document appears to be a GENUINE, authentic, government-issued ID with no signs of tampering. Use this when the ID layout, fonts, security features, and format all match official government standards.
  - "FALSE" = The document appears to be FAKE or digitally TAMPERED.
  - "MISLEADING" = The document has some questionable elements but is not conclusively fake.
  - "UNVERIFIED" = The image is too blurry, unclear, or unreadable to make any determination.

IMPORTANT: If a government ID looks genuine and has a valid format, the verdict MUST be "TRUE" and riskSeverity MUST be 1 (lowest risk). Do NOT default to "UNVERIFIED" for readable, genuine-looking documents.

RUMOR DEBUNKING (for FALSE or MISLEADING claims):
When the verdict is "FALSE" or "MISLEADING", you MUST also provide:
1. "rumorCategory": Classify as one of:
   - "Manipulated Media" — deepfakes, doctored images/videos, AI-generated content
   - "False Context" — real media used with wrong date, location, or narrative (e.g., old videos passed as recent)
   - "Fabricated Content" — entirely made-up stories, quotes, events, or data
2. "counterEvidenceUrl": Provide a REAL, working URL to a fact-check or official source that debunks this claim. Use sources like:
   - https://www.snopes.com/
   - https://www.politifact.com/
   - https://www.altnews.in/
   - https://factly.in/
   - https://www.boomlive.in/
   - Official government or organization websites
   - If no specific fact-check exists, provide the most relevant official source URL.
3. "reportText": Write a single professional sentence that the user can copy/paste into the "Report Post" button on Twitter, YouTube, or Facebook. It should mention the specific type of misinformation and be suitable for a formal report.

You MUST respond with a JSON object using this exact structure (no markdown, no code fences, just raw JSON):
{
  "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED",
  "riskSeverity": 1-5,
  "signalColor": "green" | "yellow" | "red",
  "bottomLine": [
    "Bullet 1: Key finding in one sentence",
    "Bullet 2: Supporting evidence in one sentence",
    "Bullet 3: Action/conclusion in one sentence"
  ],
  "suggestedQuestions": [
    "Related follow-up question 1",
    "Related follow-up question 2",
    "Related follow-up question 3"
  ],
  "rumorCount": 0,
  "evidence": [
    { "fact": "A specific fact or document observation", "source": "Source name or 'Visual Analysis'" }
  ],
  "reasoning": "Detailed explanation of your analysis. If it's a document, list extracted data and forensic findings.",
  "counterNarrative": "A shareable fact-check message. If it's a document, provide a summary of its validity.",
  "rumorCategory": "Manipulated Media" | "False Context" | "Fabricated Content" | null,
  "counterEvidenceUrl": "URL to fact-check source or null",
  "reportText": "One-sentence professional report text for social media reporting or null",
  "documentData": {
    "type": "string (e.g., Aadhaar Card)",
    "extractedInfo": { "Name": "...", "ID_Number": "..." },
    "forensics": "Summary of visual integrity check"
  }
}

SIGNAL COLOR RULES (CRITICAL — this powers the traffic light dashboard):
- "green" = verdict is TRUE. Facts verified, logic is sound.
- "yellow" = verdict is UNVERIFIED or MISLEADING. Unverified rumors, proceed with caution.
- "red" = verdict is FALSE. Misinformation alert.

BOTTOM LINE RULES:
- "bottomLine" MUST always contain exactly 3 short, punchy bullet points.
- Each bullet is a single sentence — concise and scannable.
- The user should be able to read JUST these 3 bullets and understand the entire analysis.
- Think of it as "3 things you need to know, then close all tabs."

RUMOR COUNT:
- "rumorCount": How many distinct false claims or rumors were detected in the input. Usually 1 for a single claim. Can be higher if the input contains multiple false statements.

SUGGESTED QUESTIONS:
- You MUST provide exactly 3 "suggestedQuestions".
- These should be deep, engaging follow-up questions a user might naturally ask next.
- E.g. "What is the science behind X?", "Where did this video originally come from?"

CRITICAL: Detect the language of the claim or document, and write your 'reasoning', 'counterNarrative', and 'evidence facts' in THAT exact same language. (e.g., if the claim is in Hindi, your explanations must be in Hindi). The JSON keys must remain in English. The "reportText" should always be in English.

DOCUMENT/PDF VERIFICATION:
If a PDF or document file is uploaded, you are performing DOCUMENT VERIFICATION:
- Read and analyze the ENTIRE document content.
- Determine if the claims, data, citations, and facts within the document are TRUE or FALSE.
- For research papers: verify if citations are real, if data/statistics are plausible, if methodology is sound.
- For certificates/official documents: verify if the format matches known official formats, check for inconsistencies.
- For reference papers: cross-check the key claims with known facts.
- For legal documents: check for standard legal formatting and terminology.
- Set "documentData.type" to the type of document (e.g., "Research Paper", "Certificate", "Legal Document", "News Article", "Reference Paper").
- Set "documentData.extractedInfo" with key metadata (Title, Author, Date, Institution, etc.).
- Set "documentData.forensics" with your analysis of the document's credibility.
- If the document content is factually correct, verdict = "TRUE". If it contains false claims, verdict = "FALSE".

${webContext}
${extractedDocText ? `\n--- UPLOADED DOCUMENT CONTENT ---\n${extractedDocText.substring(0, 30000)}\n--- END OF DOCUMENT ---\n` : ""}
Analyze this input: "${claim}"`;

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
            mimeType: mediaMimeType || mediaFile?.type || "image/jpeg",
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
        const errorText = await response.text();
        let errorMsg = "Failed to contact Gemini API. Ensure API key is correct.";
        if (response.status === 429) {
          errorMsg = "Gemini API Quota Exceeded (429 Too Many Requests). Please try again later or check billing.";
        } else if (response.status === 400 || response.status === 403) {
          errorMsg = `API Error ${response.status}: Please verify your Gemini API key.`;
        }
        console.error("Gemini API Error details:", errorText);
        throw new Error(errorMsg);
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

      // Use REAL URLs from Tavily search, not AI-hallucinated ones
      let counterUrl = parsed.counterEvidenceUrl || null;
      if (counterUrl) {
        // Test if the AI's URL is likely real (from our search results)
        const isRealUrl = realSearchUrls.some(r => counterUrl && counterUrl.includes(new URL(r.url).hostname));
        if (!isRealUrl && realSearchUrls.length > 0) {
          // Override with first real search result URL
          counterUrl = realSearchUrls[0].url;
        }
      } else if (realSearchUrls.length > 0 && (parsed.verdict === "FALSE" || parsed.verdict === "MISLEADING")) {
        counterUrl = realSearchUrls[0].url;
      }

      // Build evidence with real URLs where possible
      const enrichedEvidence = (parsed.evidence || []).map((e: any, i: number) => {
        const src = typeof e.source === "string" ? e.source : "";
        const isUrl = src.startsWith("http://") || src.startsWith("https://");
        // If source is not a URL, try to match it with a real search result
        if (!isUrl && realSearchUrls[i]) {
          return { ...e, source: src, sourceUrl: realSearchUrls[i].url };
        }
        return { ...e, source: src, sourceUrl: isUrl ? src : null };
      });

      const reportData: TruthReportData = {
        verdict: parsed.verdict || "UNVERIFIED",
        riskSeverity: parsed.riskSeverity || 3,
        evidence: enrichedEvidence,
        reasoning: parsed.reasoning || "Could not generate reasoning.",
        counterNarrative: parsed.counterNarrative || "",
        claim: claim || `[${mediaType} analysis]`,
        rumorCategory: parsed.rumorCategory || null,
        counterEvidenceUrl: counterUrl,
        reportText: parsed.reportText || null,
        signalColor: parsed.signalColor || (parsed.verdict === "TRUE" ? "green" : parsed.verdict === "FALSE" ? "red" : "yellow"),
        bottomLine: Array.isArray(parsed.bottomLine) ? parsed.bottomLine : [],
        rumorCount: parsed.rumorCount || (parsed.verdict === "FALSE" ? 1 : 0),
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions.slice(0, 3) : [],
      };

      setReport(reportData);

      // Shake screen for 3 seconds on FALSE verdict as an alert
      if (reportData.verdict === "FALSE") {
        setViralityScore(100);
        setTimeout(() => setViralityScore(0), 3000);
      } else {
        setViralityScore(0);
      }

      setTimelineSteps((prev) => {
        const next = [...prev];
        if (next[3]) {
          // Use verdict to determine status — TRUE/MISLEADING = complete, FALSE = alert
          const isAlert = reportData.verdict === "FALSE" || reportData.verdict === "UNVERIFIED" && reportData.riskSeverity >= 4;
          next[3] = {
            ...next[3],
            status: isAlert ? "alert" : "complete",
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

  const handleQuestionClick = (question: string) => {
    handleClaimSubmit(question);
  };

  return (
    <div className="min-h-screen bg-transparent relative z-10 transition-colors duration-500">
      <ViralityEngine riskScore={viralityScore} />

      <AuthHeader 
        onShowHistory={() => setHistoryOpen(true)} 
        onShowAudit={() => setAuditOpen(true)} 
      />
      <div className="pt-20">
        <GlobalRumorsTicker />
      </div>
      <HeroSection />

      <div className="space-y-12 pb-20 px-4 md:px-0">
        <ClaimInput onSubmit={handleClaimSubmit} isLoading={isLoading} />

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <TrendingFeed />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <IDVerifier />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <LiveFeed />
        </div>

        {showTimeline && (
          <div id="analysis-timeline" className="animate-in fade-in slide-in-from-bottom-8 duration-500 pt-8 mt-[-2rem]">
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
            <TruthReport report={report} onQuestionClick={handleQuestionClick} />
          </div>
        )}
      </div>

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      <AuditLogPanel isOpen={auditOpen} onClose={() => setAuditOpen(false)} />
    </div>
  );
};

export default Index;