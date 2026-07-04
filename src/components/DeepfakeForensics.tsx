import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  ShieldAlert, ScanFace, Activity, CheckCircle, 
  AlertTriangle, UploadCloud, X, Loader2, PlaySquare, FileAudio, FileImage, Shield
} from "lucide-react";

interface ComponentScore {
  name: string;
  score: number;
  status: "pass" | "fail" | "warning";
  detail: string;
}

interface ForensicReport {
  verdict: "AUTHENTIC" | "DEEPFAKE" | "SUSPICIOUS" | "INCONCLUSIVE";
  confidenceScore: number;
  spatialAnalysis: {
    overallScore: number;
    components: ComponentScore[];
  };
  temporalAnalysis: {
    overallScore: number;
    components: ComponentScore[];
  };
  audioAnalysis: {
    overallScore: number;
    components: ComponentScore[];
  };
  summary: string;
  metadata: {
    resolution: string;
    duration: string;
    codec: string;
    modelLog: string;
  };
}

const statusColorMap = {
  pass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  fail: "text-red-400 bg-red-500/10 border-red-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const verdictTheme = {
  AUTHENTIC: "from-emerald-600/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400",
  DEEPFAKE: "from-red-600/20 to-red-900/10 border-red-500/30 text-red-400",
  SUSPICIOUS: "from-amber-600/20 to-amber-900/10 border-amber-500/30 text-amber-400",
  INCONCLUSIVE: "from-slate-600/20 to-slate-900/10 border-slate-500/30 text-slate-400",
};

const DeepfakeForensics = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setReport(null);
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
        reject(new Error("Failed to extract frame"));
      };
    });
  };

  const runAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setReport(null);

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) throw new Error("Missing Gemini API Key");

      let base64Data = "";
      let mimeType = file.type;

      if (file.type.startsWith("video/")) {
        // Extract a frame for video to prevent huge base64 strings crashing the browser
        base64Data = await extractVideoFrame(file);
        mimeType = "image/jpeg"; 
      } else {
        base64Data = await fileToBase64(file);
      }
      
      const cleanBase64 = base64Data.split(",")[1];

      const prompt = `You are an expert AI Deepfake & Multimedia Forensic Analyst.
Analyze the provided media file (or video frame) for any signs of AI generation, manipulation, voice cloning, or deepfake artifacts.
Assume strict forensic parameters. Look for inconsistencies in lighting, facial boundaries, GAN artifacts, unnatural blurring, or synthetic audio patterns.

Return ONLY a JSON object matching this structure:
{
  "verdict": "AUTHENTIC" | "DEEPFAKE" | "SUSPICIOUS" | "INCONCLUSIVE",
  "confidenceScore": number (0-100),
  "summary": "1-2 sentences summarizing your forensic findings",
  "metadata": {
    "resolution": "e.g., 1080p or Image dimensions",
    "duration": "N/A or audio/video length",
    "codec": "Detected compression/codec",
    "modelLog": "What forensic tools/models you theoretically ran (e.g., 'Wav2Lip CNN, MediaPipe')"
  },
  "spatialAnalysis": {
    "overallScore": number (0-100),
    "components": [
      { "name": "Facial Boundary Integrity", "score": number, "status": "pass" | "fail" | "warning", "detail": "string" },
      { "name": "Lighting & Shadows", "score": number, "status": "pass" | "fail" | "warning", "detail": "string" }
    ]
  },
  "temporalAnalysis": {
    "overallScore": number (0-100),
    "components": [
      { "name": "Blink Rate Naturalness", "score": number, "status": "pass" | "fail" | "warning", "detail": "string" },
      { "name": "Frame-to-Frame Coherence", "score": number, "status": "pass" | "fail" | "warning", "detail": "string" }
    ]
  },
  "audioAnalysis": {
    "overallScore": number (0-100),
    "components": [
      { "name": "Lip-Sync Alignment", "score": number, "status": "pass" | "fail" | "warning", "detail": "string" },
      { "name": "Spectral Void Detection", "score": number, "status": "pass" | "fail" | "warning", "detail": "string" }
    ]
  }
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  { inlineData: { data: cleanBase64, mimeType } }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Gemini API Failed to process media");

      const rawData = await response.json();
      const textResponse = rawData?.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed: ForensicReport = JSON.parse(textResponse || "{}");
      
      setReport(parsed);

    } catch (error) {
      console.error(error);
      alert("Analysis failed. Media might be too large or invalid format.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setReport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to render score components
  const renderAnalysisSection = (title: string, data: any, icon: React.ReactNode) => {
    if (!data || !data.components) return null;
    return (
      <Card className="p-4 bg-card border-border mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-display font-semibold text-sm text-foreground">{title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
            <span className={`text-sm font-mono font-bold ${data.overallScore > 80 ? "text-emerald-400" : data.overallScore > 50 ? "text-amber-400" : "text-red-400"}`}>
              {data.overallScore}/100
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {data.components.map((comp: ComponentScore, i: number) => {
            const style = statusColorMap[comp.status] || statusColorMap.warning;
            const Icon = comp.status === "pass" ? CheckCircle : comp.status === "fail" ? XCircle : AlertTriangle;
            
            return (
              <div key={i} className="flex flex-col gap-1.5 p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${style} uppercase flex items-center gap-1`}>
                      <Icon className="w-3 h-3" /> {comp.status}
                    </span>
                    <span className="text-xs font-medium text-foreground">{comp.name}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{comp.score}%</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-1">{comp.detail}</p>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  // Missing icon for renderAnalysisSection map
  const XCircle = ShieldAlert;

  return (
    <section className="max-w-4xl mx-auto px-4">
      <Card className="overflow-hidden border border-border bg-card">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600/15 to-cyan-600/15 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20 border border-teal-500/30">
              <ScanFace className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white tracking-wide">
                Multi-Modal Deepfake Forensics (Real-Time)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Powered by Gemini 2.5 Flash Multimodal Vision & Audio Engine
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-1">Upload Media for Analysis</h3>
              <p className="text-sm text-muted-foreground break-words max-w-sm mx-auto">
                Drag & drop or click to upload Image, Video, or Audio file. Max size 5MB (videos will be frame-sampled).
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Media Preview */}
              <div className="w-full md:w-1/3 space-y-3">
                <div className="relative aspect-square md:aspect-[3/4] rounded-xl overflow-hidden bg-black/50 border border-border flex items-center justify-center">
                  {file.type.startsWith("image/") && previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  {file.type.startsWith("video/") && previewUrl && (
                    <video src={previewUrl} className="w-full h-full object-cover" controls />
                  )}
                  {file.type.startsWith("audio/") && (
                    <div className="text-center p-6">
                      <FileAudio className="w-16 h-16 text-teal-500 mx-auto mb-4" />
                      <audio src={previewUrl || ""} controls className="w-full max-w-[200px]" />
                    </div>
                  )}
                  
                  <button onClick={clearFile} disabled={isAnalyzing} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500/80 text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>

                {!report && (
                  <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full flex justify-center items-center gap-2 py-3 rounded-xl font-display font-bold bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-teal-600/25"
                  >
                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                    {isAnalyzing ? "Analyzing Pixels..." : "Run Forensic Scan"}
                  </button>
                )}
              </div>

              {/* Status / Output */}
              <div className="w-full md:w-2/3">
                {isAnalyzing && (
                  <div className="h-full flex flex-col items-center justify-center py-10">
                    <Loader2 className="w-10 h-10 text-teal-400 animate-spin mb-4" />
                    <h3 className="font-display font-bold text-foreground mb-1">Running Forensic Multi-Model Pipeline</h3>
                    <p className="text-xs text-muted-foreground text-center">
                      Uploading to Gemini 2.5 Vision...<br/>
                      Extracting spatial artifacts...<br/>
                      Detecting generative GAN signatures...
                    </p>
                  </div>
                )}

                {report && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    
                    {/* Verdict Card */}
                    <Card className={`p-5 border bg-gradient-to-r ${verdictTheme[report.verdict]}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-black text-2xl tracking-tight">
                          {report.verdict}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest text-current opacity-80 block">Confidence</span>
                          <span className="text-xl font-mono font-bold tracking-tight">{report.confidenceScore}%</span>
                        </div>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed font-medium">
                        {report.summary}
                      </p>
                    </Card>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="p-2 rounded bg-secondary/40 text-center"><p className="text-[9px] uppercase text-muted-foreground">Resolution</p><p className="text-xs font-mono font-medium">{report.metadata.resolution}</p></div>
                      <div className="p-2 rounded bg-secondary/40 text-center"><p className="text-[9px] uppercase text-muted-foreground">Duration</p><p className="text-xs font-mono font-medium">{report.metadata.duration}</p></div>
                      <div className="p-2 rounded bg-secondary/40 text-center"><p className="text-[9px] uppercase text-muted-foreground">Codec</p><p className="text-xs font-mono font-medium">{report.metadata.codec}</p></div>
                      <div className="p-2 rounded bg-secondary/40 text-center"><p className="text-[9px] uppercase text-muted-foreground">Engine</p><p className="text-xs font-mono text-teal-400 font-bold truncate" title={report.metadata.modelLog}>Gemini 2.5</p></div>
                    </div>

                    <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {renderAnalysisSection("Spatial Face & Image Analysis", report.spatialAnalysis, <ScanFace className="w-4 h-4 text-teal-400" />)}
                      {renderAnalysisSection("Temporal / Frame Coherence", report.temporalAnalysis, <PlaySquare className="w-4 h-4 text-teal-400" />)}
                      {renderAnalysisSection("Audio & Spectral Forensics", report.audioAnalysis, <Activity className="w-4 h-4 text-teal-400" />)}
                    </div>
                  </motion.div>
                )}
              </div>

            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*,video/*,audio/*" 
            className="hidden" 
          />
        </div>
      </Card>
    </section>
  );
};

export default DeepfakeForensics;
