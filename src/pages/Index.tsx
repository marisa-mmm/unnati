import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import ClaimInput from "@/components/ClaimInput";
import TruthReport, { TruthReportData } from "@/components/TruthReport";
import AuthHeader from "@/components/AuthHeader";
import HistoryPanel from "@/components/HistoryPanel";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<TruthReportData | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

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
      video.currentTime = 1; // grab frame at 1s
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

  const handleClaimSubmit = async (claim: string, mediaFile?: File) => {
    setIsLoading(true);
    setReport(null);

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

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fact-check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ claim, mediaBase64, mediaType }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Analysis failed" }));
        throw new Error(err.error || "Analysis failed");
      }

      const data = await response.json();
      const reportData: TruthReportData = {
        verdict: data.verdict || "UNVERIFIED",
        riskSeverity: data.riskSeverity || 3,
        evidence: data.evidence || [],
        reasoning: data.reasoning || "",
        counterNarrative: data.counterNarrative || "",
        claim: claim || `[${mediaType} analysis]`,
      };

      setReport(reportData);

      // Save to history if logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("claim_history").insert({
          user_id: user.id,
          claim_text: claim || null,
          media_type: mediaType || "text",
          verdict: reportData.verdict,
          risk_severity: reportData.riskSeverity,
          evidence: reportData.evidence,
          reasoning: reportData.reasoning,
          counter_narrative: reportData.counterNarrative,
        });
      }
    } catch (error: any) {
      console.error("Fact-check error:", error);
      toast.error(error.message || "Failed to analyze claim");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AuthHeader onShowHistory={() => setHistoryOpen(true)} />
      <HeroSection />

      <div className="space-y-10 pb-20">
        <ClaimInput onSubmit={handleClaimSubmit} isLoading={isLoading} />
        {report && <TruthReport report={report} />}
      </div>

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
};

export default Index;
