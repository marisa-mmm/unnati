import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ClaimInput from "@/components/ClaimInput";
import TruthReport, { TruthReportData } from "@/components/TruthReport";

// Demo data for showcasing the UI
const DEMO_REPORTS: Record<string, TruthReportData> = {
  default: {
    verdict: "FALSE",
    riskSeverity: 4,
    claim: "The government announced free electricity for all citizens starting next month",
    evidence: [
      {
        fact: "No official announcement regarding free electricity has been made by any government ministry as of March 2026.",
        source: "https://pib.gov.in",
      },
      {
        fact: "The viral message has been debunked by PIB Fact Check as fabricated content with no basis in policy.",
        source: "https://factcheck.pib.gov.in",
      },
      {
        fact: "The Ministry of Power's latest press release discusses solar subsidies, not free electricity.",
        source: "https://powermin.gov.in",
      },
    ],
    reasoning:
      "The claim that the government will provide free electricity to all citizens starting next month is fabricated. No official government portal, ministry statement, or credible news outlet has reported any such policy. The viral message appears to be designed to generate social media engagement through false promises.",
    counterNarrative:
      "⚠️ Fact Check: The claim about 'free electricity for all citizens next month' is FALSE. No government ministry has made this announcement. Always verify such claims on official sources like pib.gov.in before sharing. Don't let misinformation spread — verify first! ✅",
  },
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<TruthReportData | null>(null);

  const handleClaimSubmit = (claim: string) => {
    setIsLoading(true);
    setReport(null);

    // Simulate AI analysis with demo data
    setTimeout(() => {
      setReport({
        ...DEMO_REPORTS.default,
        claim,
      });
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="space-y-10 pb-20">
        <ClaimInput onSubmit={handleClaimSubmit} isLoading={isLoading} />

        {report && <TruthReport report={report} />}
      </div>
    </div>
  );
};

export default Index;
