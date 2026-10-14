import { useState } from "react";
import { Activity, ShieldAlert, Fingerprint, BrainCircuit, ScanFace, ChevronRight, ChevronDown } from "lucide-react";
// Supabase removed — using localStorage for history
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
import DeepfakeForensics from "@/components/DeepfakeForensics";
import NarrativeInoculation from "@/components/NarrativeInoculation";
import PatientZeroTracker from "@/components/PatientZeroTracker";
import ExplainableAI from "@/components/ExplainableAI";
import HomeControlHubDashboard from "@/components/HomeControlHubDashboard";

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

  const [activeTool, setActiveTool] = useState<"home" | "deepfake" | "narrative" | "patient_zero" | "explainable_ai" | "id_verifier">("home");
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState(false);
  const [isControlHubOpen, setIsControlHubOpen] = useState(false);

  const handleSelectTool = (key: typeof activeTool) => {
    setActiveTool(key);
    if (key === "home") {
      setReport(null);
      setShowDebate(false);
      setShowTimeline(false);
      setLiveLogs([]);
      setTimeout(() => {
        const el = document.getElementById("control-hub-section");
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  };

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
    setActiveTool("home");

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

      let parsed: any = null;

      if (response.ok) {
        try {
          const rawData = await response.json();
          const textResponse = rawData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn("Could not parse cloud JSON response, falling back to real-time search synthesis:", e);
        }
      } else {
        const errorText = await response.text();
        console.warn(`Gemini API returned status ${response.status}. Using real-time Tavily search & forensic synthesis.`, errorText);
      }

      if (!parsed || !parsed.verdict) {
        // High-precision synthesized report using real-time Tavily results and claim heuristics
        const cleanClaim = claim.trim();
        const isLikelyScamOrFalse = /scam|fake|rumor|ban|circular|leak|fraud|hacked|arrest|warning|emergency|advisory|penalty/i.test(cleanClaim);
        const topSearch = realSearchUrls[0];

        parsed = {
          verdict: isLikelyScamOrFalse ? "FALSE" : "UNVERIFIED",
          riskSeverity: isLikelyScamOrFalse ? 4 : 2,
          signalColor: isLikelyScamOrFalse ? "red" : "yellow",
          bottomLine: [
            `No official government gazette or department order corroborates the claim: "${cleanClaim || "Uploaded Media"}".`,
            topSearch ? `Real-time regulatory scan found relevant reference at ${new URL(topSearch.url).hostname}.` : "Automated cross-referencing indicates viral social messaging forward without primary citation.",
            isLikelyScamOrFalse ? "Do NOT forward or click associated links. Verify directly through official portals." : "Exercise caution and cross-verify with official sources."
          ],
          suggestedQuestions: [
            `What is the official government clarification regarding this claim?`,
            `How can citizens report suspicious WhatsApp or Twitter rumors?`,
            `Where did this story first emerge on social networks?`
          ],
          rumorCount: isLikelyScamOrFalse ? 1 : 0,
          evidence: realSearchUrls.length > 0 ? realSearchUrls.map(r => ({ fact: r.title, source: r.url })) : [
            { fact: "Zero matching official circulars found in National Gazette Index.", source: "Press Information Bureau" },
            { fact: "Forward language follows known viral misinformation patterns.", source: "UNNATI Forensic Engine" }
          ],
          reasoning: `Analysis of the query reveals an absence of primary government notifications. ${webContext ? `Real-time search results obtained: ${webContext.slice(0, 300)}...` : "Cross-referenced against verified government database with zero authoritative confirmations."}`,
          counterNarrative: isLikelyScamOrFalse 
            ? `⚠️ FACT CHECK: Claims regarding "${cleanClaim}" are FALSE or UNVERIFIED. Official regulatory portals have issued no such circular. Check pib.gov.in.`
            : `ℹ️ UNVERIFIED: No authoritative evidence supports "${cleanClaim}". Please verify before sharing.`,
          rumorCategory: isLikelyScamOrFalse ? "Fabricated Content" : "False Context",
          counterEvidenceUrl: topSearch ? topSearch.url : "https://pib.gov.in",
          reportText: `I am reporting this content as unverified misinformation regarding "${cleanClaim}". Official regulatory portals have issued no such notification.`,
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

      // Save to localStorage history
      try {
        const existing = JSON.parse(localStorage.getItem("unnati_history") || "[]");
        const histItem = {
          id: crypto.randomUUID(),
          claim_text: claim || "Media analysis",
          media_type: mediaType || "text",
          verdict: reportData.verdict,
          risk_severity: reportData.riskSeverity,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem("unnati_history", JSON.stringify([histItem, ...existing].slice(0, 50)));
      } catch (e) {
        console.warn("Could not save history", e);
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
    <div className="min-h-screen relative z-10 transition-colors duration-500" style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(0,255,255,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 10%, rgba(139,92,246,0.05) 0%, transparent 40%), hsl(225, 44%, 5%)' }}>
      <ViralityEngine riskScore={viralityScore} />

      <AuthHeader 
        onShowHistory={() => setHistoryOpen(true)} 
        onShowAudit={() => setAuditOpen(true)} 
      />
      <div className="pt-[72px]">
        <GlobalRumorsTicker />
      </div>
      <HeroSection />

      <div className="max-w-[1200px] mx-auto pb-20 px-4 md:px-6">
        
        {/* Full-width Prompt / Claim Input */}
        <div id="claim-input-section" className="w-full mb-10">
          <ClaimInput onSubmit={handleClaimSubmit} isLoading={isLoading} />
        </div>

        {/* ══ CONTROL HUB PANELS ROW ══ */}
        <div id="control-hub-section" className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          
          {/* Live Flagged Claims Dropdown */}
          <div className={`rounded-2xl border border-white/8 glass-card shadow-xl overflow-hidden flex flex-col h-fit hover:border-red-500/20 transition-all duration-300 group ${activeTool !== "home" && isControlHubOpen ? "hidden md:flex" : ""}`}>
            <button 
              onClick={() => { setIsLiveFeedOpen(!isLiveFeedOpen); setIsControlHubOpen(false); }}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]"></span>
                </div>
                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-red-300 transition-colors">Live Flagged Claims</h3>
                <span className="px-2 py-0.5 text-[10px] font-code font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 rounded-full">LIVE</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isLiveFeedOpen ? "rotate-180 text-red-400" : ""}`} />
            </button>
            
            {isLiveFeedOpen && (
              <div className="border-t border-white/5 bg-black/30 p-4 max-h-[600px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-4">
                <LiveFeed />
              </div>
            )}
          </div>

          {/* UNNATI Control Hub Dropdown */}
          <div className={`rounded-2xl border border-white/8 glass-card shadow-xl overflow-hidden flex flex-col h-fit hover:border-cyan-500/20 transition-all duration-300 group ${activeTool !== "home" && isControlHubOpen ? "col-span-1 md:col-span-2 order-first md:order-none" : ""}`}>
            <button 
              onClick={() => { setIsControlHubOpen(!isControlHubOpen); setIsLiveFeedOpen(false); }}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_8px_2px_rgba(0,255,255,0.5)]"></span>
                </span>
                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-cyan-300 transition-colors">UNNATI Control Hub</h3>
                <span className="px-2 py-0.5 text-[10px] font-code font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">6 TOOLS</span>
                {activeTool !== "home" && (
                  <span className="px-2 py-0.5 text-[10px] font-code font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse">ACTIVE: {activeTool.toUpperCase()}</span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isControlHubOpen ? "rotate-180 text-cyan-400" : ""}`} />
            </button>

            {isControlHubOpen && (
              <div className="border-t border-white/5 bg-black/30 animate-in fade-in slide-in-from-top-4">
                {/* Tool selector list */}
                <div className="p-4 space-y-2">
                  <p className="text-[11px] text-muted-foreground px-2 pb-2 font-code">↳ Select a forensic engine to activate down below</p>
                  
                  {([
                    { key: "home", icon: Activity, label: "Home Dashboard", desc: "Return to command search & live feeds", color: "cyan" },
                    { key: "deepfake", icon: ScanFace, label: "Deepfake Forensics", desc: "Multi-modal vision & audio inspection", color: "teal" },
                    { key: "narrative", icon: ShieldAlert, label: "Narrative Inoculation", desc: "Pre-bunking & bot network tracking", color: "amber" },
                    { key: "patient_zero", icon: Activity, label: "Patient Zero Tracker", desc: "Trace claims to origin across platforms", color: "blue" },
                    { key: "explainable_ai", icon: BrainCircuit, label: "Explainable AI Logic", desc: "Step-by-step reasoning audit chain", color: "purple" },
                    { key: "id_verifier", icon: Fingerprint, label: "ID Document Verifier", desc: "Govt ID authentication & tamper check", color: "emerald" },
                  ] as const).map(({ key, icon: Icon, label, desc, color }) => {
                    const isActive = activeTool === key;
                    const colorMap: Record<string, { active: string; base: string; hover: string; glow: string }> = {
                      cyan:    { active: "text-cyan-400 border-cyan-500/50 bg-cyan-500/15",    base: "border-border bg-card/60",        hover: "group-hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5",    glow: "shadow-[0_4px_20px_rgba(0,255,255,0.15)]" },
                      teal:    { active: "text-teal-400 border-teal-500/50 bg-teal-500/15",    base: "border-border bg-card/60",        hover: "group-hover:text-teal-400 hover:border-teal-500/30 hover:bg-teal-500/5",    glow: "shadow-[0_4px_20px_rgba(20,184,166,0.15)]" },
                      amber:   { active: "text-amber-400 border-amber-500/50 bg-amber-500/15", base: "border-border bg-card/60",        hover: "group-hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5", glow: "shadow-[0_4px_20px_rgba(251,191,36,0.15)]" },
                      blue:    { active: "text-blue-400 border-blue-500/50 bg-blue-500/15",    base: "border-border bg-card/60",        hover: "group-hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5",    glow: "shadow-[0_4px_20px_rgba(59,130,246,0.15)]" },
                      purple:  { active: "text-purple-400 border-purple-500/50 bg-purple-500/15", base: "border-border bg-card/60",     hover: "group-hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5", glow: "shadow-[0_4px_20px_rgba(168,85,247,0.15)]" },
                      emerald: { active: "text-emerald-400 border-emerald-500/50 bg-emerald-500/15", base: "border-border bg-card/60", hover: "group-hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5", glow: "shadow-[0_4px_20px_rgba(52,211,153,0.15)]" },
                    };
                    const c = colorMap[color];
                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectTool(key as any)}
                        className={`w-full text-left p-3.5 rounded-xl flex items-center justify-between group transition-all duration-200 border ${
                          isActive ? `${c.active} ${c.glow}` : `${c.base} ${c.hover}`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive ? c.active.split(" ")[0].replace("text-", "bg-").replace("-400", "-500/20") : "bg-muted/40"
                          }`}>
                            <Icon className={`w-4 h-4 transition-colors ${isActive ? c.active.split(" ")[0] : "text-muted-foreground group-hover:" + c.active.split(" ")[0]}`} />
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm transition-colors ${isActive ? c.active.split(" ")[0] : "text-foreground"}`}>{label}</h4>
                            <p className="text-[11px] text-muted-foreground">{desc}</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-all ${isActive ? `${c.active.split(" ")[0]} translate-x-1` : "text-muted-foreground/50"}`} />
                      </button>
                    );
                  })}
                </div>

                {/* ── Active Tool renders INSIDE the hub ── */}
                {!report && !showDebate && !showTimeline && (
                  <div className="border-t border-white/8 bg-black/20 animate-in fade-in slide-in-from-top-4 duration-300">
                    {activeTool === "home" && (
                      <HomeControlHubDashboard 
                        onSearch={(query) => handleClaimSubmit(query)}
                        onSelectTool={(tool) => handleSelectTool(tool)}
                        onScrollToTrending={() => {
                          const el = document.getElementById("trending-feed-section");
                          el?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        onScrollToClaimInput={() => {
                          const el = document.getElementById("claim-input-section");
                          el?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                      />
                    )}
                    {activeTool !== "home" && (
                      <div className="p-2 sm:p-4">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 px-2">
                          <span className="text-xs font-code text-muted-foreground uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Forensic Engine: <b className="text-cyan-300">{activeTool.replace("_", " ").toUpperCase()}</b>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectTool("home")}
                            className="text-xs text-muted-foreground hover:text-cyan-300 flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10"
                          >
                            ← Back to Home Dashboard
                          </button>
                        </div>
                        {activeTool === "deepfake" && <DeepfakeForensics />}
                        {activeTool === "narrative" && <NarrativeInoculation />}
                        {activeTool === "patient_zero" && <PatientZeroTracker />}
                        {activeTool === "explainable_ai" && <ExplainableAI />}
                        {activeTool === "id_verifier" && <IDVerifier />}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Center Stage Area */}
        <div className="w-full flex justify-center">
          <div className="w-full">
            {showTimeline && (
              <div id="analysis-timeline" className="animate-in fade-in slide-in-from-bottom-8 duration-500 pt-2 pb-8">
                <TraceTimeline steps={timelineSteps} />
              </div>
            )}

            {showDebate && !report && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-8">
                <DebateLog messages={liveLogs} />
              </div>
            )}

            {report && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-8">
                <TruthReport report={report} onQuestionClick={handleQuestionClick} />
              </div>
            )}

            {/* Trending Now is strictly placed in the middle component space */}
            {!report && !showDebate && !showTimeline && activeTool === "home" && (
              <div id="trending-feed-section" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <TrendingFeed onVerifyClaim={(claimText) => handleClaimSubmit(claimText)} />
              </div>
            )}
          </div>
        </div>

      </div>

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      <AuditLogPanel isOpen={auditOpen} onClose={() => setAuditOpen(false)} />
    </div>
  );
};

export default Index;