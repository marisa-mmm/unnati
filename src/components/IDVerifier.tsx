import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Fingerprint,
  ScanLine,
  Eye,
  Lock,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

// ─── ID Pattern Validators ────────────────────────────────────

const ID_PATTERNS: Record<string, { regex: RegExp; label: string; format: string }> = {
  aadhaar: {
    regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/,
    label: "Aadhaar Card",
    format: "XXXX XXXX XXXX",
  },
  pan: {
    regex: /\b[A-Z]{5}\d{4}[A-Z]\b/,
    label: "PAN Card",
    format: "ABCDE1234F",
  },
  passport: {
    regex: /\b[A-Z]\d{7}\b/,
    label: "Passport",
    format: "A1234567",
  },
  voter: {
    regex: /\b[A-Z]{3}\d{7}\b/,
    label: "Voter ID",
    format: "ABC1234567",
  },
  driving: {
    regex: /\b[A-Z]{2}\d{2}\s?\d{4}\s?\d{7}\b/,
    label: "Driving License",
    format: "XX00 0000 0000000",
  },
};

interface ForensicCheck {
  name: string;
  status: "pass" | "fail" | "warning" | "pending";
  detail: string;
}

interface IDReport {
  documentType: string;
  isGovernmentApproved: boolean;
  authenticityScore: number; // 0-100
  verdict: "GENUINE" | "SUSPICIOUS" | "FAKE" | "UNVERIFIABLE";
  extractedData: Record<string, string>;
  forensicChecks: ForensicCheck[];
  reasoning: string;
  recommendation: string;
  patternValidation?: {
    matched: boolean;
    format: string;
    detectedNumber: string;
  };
}

const VERDICT_STYLES: Record<
  string,
  { color: string; bg: string; border: string; icon: typeof CheckCircle2 }
> = {
  GENUINE: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  SUSPICIOUS: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: AlertTriangle,
  },
  FAKE: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
  },
  UNVERIFIABLE: {
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    icon: AlertTriangle,
  },
};

// ─── Component ─────────────────────────────────────────────────

const IDVerifier = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IDReport | null>(null);
  const [scanPhase, setScanPhase] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB.");
      return;
    }
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image of the ID document.");
      return;
    }
    setFile(f);
    setReport(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setReport(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const runVerification = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setReport(null);

    const phases = [
      "Scanning document structure...",
      "Analyzing font consistency & alignment...",
      "Checking security features & holograms...",
      "Validating ID number format...",
      "Running AI forensic analysis...",
      "Cross-referencing government patterns...",
      "Generating authenticity report...",
    ];

    // Animate phases
    let phaseIdx = 0;
    const phaseInterval = setInterval(() => {
      if (phaseIdx < phases.length) {
        setScanPhase(phases[phaseIdx]);
        phaseIdx++;
      }
    }, 800);

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) throw new Error("VITE_GEMINI_API_KEY is missing");

      const base64Data = preview.split(",")[1];

      const prompt = `You are an expert Government ID Document Forensic Analyst. Your task is to determine if this uploaded ID document is a GENUINE government-issued document or a FAKE/TAMPERED one.

PERFORM THESE FORENSIC CHECKS:

1. **DOCUMENT STRUCTURE ANALYSIS**
   - Is this a recognized government ID format? (Aadhaar, PAN, Passport, Voter ID, Driving License, etc.)
   - Does the layout match official government templates?
   - Are the dimensions, margins, and positioning correct?

2. **TYPOGRAPHY & FONT ANALYSIS**
   - Are fonts consistent throughout the document?
   - Do fonts match the official government-issued fonts?
   - Any mismatched font sizes, styles, or spacing?

3. **SECURITY FEATURE DETECTION**
   - Presence of holograms, watermarks, microprinting
   - QR code / barcode presence and positioning
   - Government emblem / logo quality and placement
   - Signature presence and authenticity indicators

4. **PHOTO ANALYSIS**
   - Is the photo naturally embedded or overlaid/pasted?
   - Are there signs of photo manipulation (edge artifacts, inconsistent lighting)?
   - Photo background consistency

5. **DATA INTEGRITY**
   - Extract ALL visible text fields (Name, ID Number, DOB, Address, etc.)
   - Validate ID number format against known government patterns:
     * Aadhaar: XXXX XXXX XXXX (12 digits)
     * PAN: ABCDE1234F (5 letters + 4 digits + 1 letter)
     * Passport: A1234567 (1 letter + 7 digits)
     * Voter ID: ABC1234567 (3 letters + 7 digits)
     * Driving License: State-code followed by numbers
   - Check for obviously invalid data (future DOB, impossible ages, etc.)

6. **DIGITAL FORENSICS**
   - Signs of pixel-level editing or manipulation
   - Inconsistent compression artifacts
   - Copy-paste edge detection
   - Color consistency across the document

RESPOND WITH THIS EXACT JSON (no markdown, no code fences):
{
  "documentType": "Type of document identified (e.g., Aadhaar Card, PAN Card, Passport)",
  "isGovernmentApproved": true/false,
  "authenticityScore": 0-100,
  "verdict": "GENUINE" | "SUSPICIOUS" | "FAKE" | "UNVERIFIABLE",
  "extractedData": {
    "Name": "...",
    "ID_Number": "...",
    "Date_of_Birth": "...",
    "Address": "...",
    "Gender": "...",
    "Issue_Date": "...",
    "Expiry_Date": "..."
  },
  "forensicChecks": [
    { "name": "Document Structure", "status": "pass|fail|warning", "detail": "Specific finding" },
    { "name": "Font Consistency", "status": "pass|fail|warning", "detail": "Specific finding" },
    { "name": "Security Features", "status": "pass|fail|warning", "detail": "Specific finding" },
    { "name": "Photo Integrity", "status": "pass|fail|warning", "detail": "Specific finding" },
    { "name": "ID Number Format", "status": "pass|fail|warning", "detail": "Specific finding about format validation" },
    { "name": "Digital Tampering", "status": "pass|fail|warning", "detail": "Specific finding" }
  ],
  "reasoning": "Detailed paragraph explaining your complete analysis, why you believe this is genuine or fake, and what specific evidence supports your conclusion.",
  "recommendation": "Clear recommendation for the user - is this ID safe to accept or should it be rejected?"
}

IMPORTANT RULES:
- Be STRICT. Look for ANY inconsistency.
- If the image is NOT a government ID at all, set verdict to "UNVERIFIABLE" and explain.
- authenticityScore should reflect confidence: 80-100 = genuine, 50-79 = suspicious, 0-49 = likely fake.
- ALWAYS extract whatever data you can read from the document.
- Each forensicCheck must have a specific, actionable detail — not generic statements.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      data: base64Data,
                      mimeType: file.type,
                    },
                  },
                  { text: prompt },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      clearInterval(phaseInterval);

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const rawData = await response.json();
      const textResponse =
        rawData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      let parsed: any;
      try {
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        parsed = null;
      }

      if (!parsed) {
        throw new Error("Failed to parse AI response");
      }

      // Client-side ID number pattern validation
      let patternValidation: IDReport["patternValidation"] = undefined;
      const extractedNumber = parsed.extractedData?.ID_Number || "";
      if (extractedNumber) {
        for (const [, pattern] of Object.entries(ID_PATTERNS)) {
          if (pattern.regex.test(extractedNumber.replace(/\s/g, "").toUpperCase()) ||
              pattern.regex.test(extractedNumber)) {
            patternValidation = {
              matched: true,
              format: pattern.format,
              detectedNumber: extractedNumber,
            };
            break;
          }
        }
        if (!patternValidation) {
          patternValidation = {
            matched: false,
            format: "Unknown",
            detectedNumber: extractedNumber,
          };
        }
      }

      const idReport: IDReport = {
        documentType: parsed.documentType || "Unknown Document",
        isGovernmentApproved: parsed.isGovernmentApproved ?? false,
        authenticityScore: parsed.authenticityScore ?? 0,
        verdict: parsed.verdict || "UNVERIFIABLE",
        extractedData: parsed.extractedData || {},
        forensicChecks: (parsed.forensicChecks || []).map((c: any) => ({
          name: c.name || "Check",
          status: c.status || "pending",
          detail: c.detail || "No detail",
        })),
        reasoning: parsed.reasoning || "No reasoning provided",
        recommendation: parsed.recommendation || "Unable to provide recommendation",
        patternValidation,
      };

      setReport(idReport);
      setScanPhase("");
    } catch (err: any) {
      console.error("ID verification error:", err);
      toast.error(err.message || "Verification failed");
      setScanPhase("");
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
    }
  };

  const verdictStyle = report
    ? VERDICT_STYLES[report.verdict] || VERDICT_STYLES.UNVERIFIABLE
    : null;
  const VerdictIcon = verdictStyle?.icon || AlertTriangle;

  const checkIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />;
    }
  };

  return (
    <section className="max-w-5xl mx-auto w-full">
      {/* Section Header — Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 mb-4 group"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
            <Fingerprint className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              ID <span className="text-gradient-brand">Verifier</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI-powered Government ID authenticity check
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-white transition-colors">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Upload Area */}
            <div className="mb-6">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!preview ? (
                <motion.div
                  onClick={() => fileRef.current?.click()}
                  whileHover={{ scale: 1.01 }}
                  className="cursor-pointer border-2 border-dashed border-violet-500/30 rounded-2xl p-10
                             bg-violet-500/[0.03] hover:bg-violet-500/[0.06] hover:border-violet-500/50
                             transition-all flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-violet-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">
                      Upload Government ID
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Aadhaar · PAN · Passport · Voter ID · Driving License
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-2">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-violet-500/20 bg-white/[0.02] p-4">
                  <button
                    onClick={removeFile}
                    className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-full p-1.5
                               hover:bg-red-500/40 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-white" />
                  </button>
                  <img
                    src={preview}
                    alt="ID Document"
                    className="max-h-56 rounded-xl mx-auto object-contain"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-muted-foreground">
                      {file?.name} ·{" "}
                      {((file?.size || 0) / 1024 / 1024).toFixed(1)}MB
                    </p>
                    <button
                      onClick={runVerification}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600
                                 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm
                                 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ScanLine className="w-4 h-4" />
                          Verify Authenticity
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Scanning Animation */}
            {loading && scanPhase && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-lg opacity-40 bg-violet-500" />
                    <Loader2 className="w-6 h-6 text-violet-400 animate-spin relative" />
                  </div>
                  <div>
                    <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">
                      SCANNING
                    </p>
                    <p className="text-sm text-white/80 mt-0.5">{scanPhase}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}

            {/* ═══ FORENSIC REPORT ═══ */}
            <AnimatePresence>
              {report && verdictStyle && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Verdict Banner */}
                  <div
                    className={`p-5 rounded-2xl border ${verdictStyle.border} ${verdictStyle.bg}`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <VerdictIcon
                          className={`w-8 h-8 ${verdictStyle.color}`}
                        />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Verification Result
                          </p>
                          <h3
                            className={`text-2xl font-bold ${verdictStyle.color}`}
                          >
                            {report.verdict}
                          </h3>
                        </div>
                      </div>

                      {/* Authenticity Score Ring */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Authenticity
                          </p>
                          <p
                            className={`text-3xl font-bold ${verdictStyle.color}`}
                          >
                            {report.authenticityScore}
                            <span className="text-sm font-normal text-muted-foreground">
                              /100
                            </span>
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                            report.isGovernmentApproved
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {report.isGovernmentApproved ? (
                            <Shield className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {report.isGovernmentApproved
                            ? "Govt. Approved Format"
                            : "Not Govt. Format"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Info + Forensic Checks Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Left: Extracted Data */}
                    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-4 h-4 text-violet-400" />
                        <h4 className="text-sm font-bold text-white">
                          {report.documentType}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(report.extractedData)
                          .filter(([, v]) => v && v !== "N/A" && v !== "...")
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between text-sm py-1 border-b border-white/[0.04] last:border-0"
                            >
                              <span className="text-muted-foreground text-xs">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="text-white font-medium text-xs">
                                {value}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Pattern Validation */}
                      {report.patternValidation && (
                        <div
                          className={`mt-3 p-2.5 rounded-lg text-xs ${
                            report.patternValidation.matched
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "bg-amber-500/10 border border-amber-500/20"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {report.patternValidation.matched ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span
                              className={
                                report.patternValidation.matched
                                  ? "text-emerald-300"
                                  : "text-amber-300"
                              }
                            >
                              {report.patternValidation.matched
                                ? `ID matches format: ${report.patternValidation.format}`
                                : "ID format doesn't match known patterns"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Forensic Checks */}
                    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-violet-400" />
                        <h4 className="text-sm font-bold text-white">
                          Forensic Checks
                        </h4>
                      </div>
                      <div className="space-y-2.5">
                        {report.forensicChecks.map((check, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-2.5"
                          >
                            {checkIcon(check.status)}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white/90">
                                {check.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                                {check.detail}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-violet-400" />
                      <h4 className="text-sm font-bold text-white">
                        AI Analysis
                      </h4>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {report.reasoning}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div
                    className={`p-4 rounded-xl border ${verdictStyle.border} ${verdictStyle.bg}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4" style={{ color: verdictStyle.color.includes("emerald") ? "#34d399" : verdictStyle.color.includes("red") ? "#f87171" : "#fbbf24" }} />
                      <h4 className="text-sm font-bold text-white">
                        Recommendation
                      </h4>
                    </div>
                    <p className="text-sm text-white/80">
                      {report.recommendation}
                    </p>
                  </div>

                  {/* Completion Signal */}
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/[0.05]">
                      <CheckCircle2 className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-semibold text-violet-400/80 uppercase tracking-wide">
                        Verification Complete
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default IDVerifier;
