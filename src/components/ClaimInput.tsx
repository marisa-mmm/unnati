import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Image, Video, X, Mic, MicOff, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

interface ClaimInputProps {
  onSubmit: (claim: string, mediaFile?: File) => void;
  isLoading: boolean;
}

const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/rtf",
];

const LANGUAGES = [
  { code: "en", label: "English",   native: "English",    flag: "🇬🇧", color: "text-cyan-300",    bg: "bg-cyan-500/10 border-cyan-500/25"     },
  { code: "hi", label: "Hindi",     native: "हिन्दी",     flag: "🇮🇳", color: "text-orange-300",  bg: "bg-orange-500/10 border-orange-500/25" },
  { code: "mr", label: "Marathi",   native: "मराठी",      flag: "🇮🇳", color: "text-amber-300",   bg: "bg-amber-500/10 border-amber-500/25"   },
  { code: "bn", label: "Bengali",   native: "বাংলা",      flag: "🇧🇩", color: "text-green-300",   bg: "bg-green-500/10 border-green-500/25"   },
  { code: "ta", label: "Tamil",     native: "தமிழ்",      flag: "🇮🇳", color: "text-rose-300",    bg: "bg-rose-500/10 border-rose-500/25"     },
  { code: "te", label: "Telugu",    native: "తెలుగు",     flag: "🇮🇳", color: "text-violet-300",  bg: "bg-violet-500/10 border-violet-500/25" },
  { code: "gu", label: "Gujarati",  native: "ગુજરાતી",    flag: "🇮🇳", color: "text-yellow-300",  bg: "bg-yellow-500/10 border-yellow-500/25" },
  { code: "kn", label: "Kannada",   native: "ಕನ್ನಡ",      flag: "🇮🇳", color: "text-sky-300",     bg: "bg-sky-500/10 border-sky-500/25"       },
  { code: "ml", label: "Malayalam", native: "മലയാളം",     flag: "🇮🇳", color: "text-teal-300",    bg: "bg-teal-500/10 border-teal-500/25"     },
  { code: "pa", label: "Punjabi",   native: "ਪੰਜਾਬੀ",    flag: "🇮🇳", color: "text-fuchsia-300", bg: "bg-fuchsia-500/10 border-fuchsia-500/25"},
  { code: "ur", label: "Urdu",      native: "اردو",       flag: "🇵🇰", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/25"},
  { code: "or", label: "Odia",      native: "ଓଡ଼ିଆ",     flag: "🇮🇳", color: "text-lime-300",    bg: "bg-lime-500/10 border-lime-500/25"     },
];

const ClaimInput = ({ onSubmit, isLoading }: ClaimInputProps) => {
  const [claim, setClaim] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-US");
  const [inputLang, setInputLang] = useState("en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let newFinalStr = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) newFinalStr += event.results[i][0].transcript + " ";
        }
        if (newFinalStr.trim()) setClaim((prev) => (prev + " " + newFinalStr.trim()).trim());
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim() || mediaFile) onSubmit(claim.trim(), mediaFile || undefined);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = isDocType(file.type) ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) { alert(`File too large. Max ${isDocType(file.type) ? "20MB" : "10MB"}.`); return; }
    setMediaFile(file);
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview("__document__");
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > 10 * 1024 * 1024) { alert("Pasted image too large. Max 10MB."); return; }
          setMediaFile(file);
          const reader = new FileReader();
          reader.onload = () => setMediaPreview(reader.result as string);
          reader.readAsDataURL(file);
          e.preventDefault();
          return;
        }
      }
    }
  };

  const isDocType = (type: string) => DOC_TYPES.includes(type) || type.endsWith(".pdf");
  const isImage = mediaFile?.type.startsWith("image/");
  const isVideo = mediaFile?.type.startsWith("video/");
  const isDocument = mediaFile ? isDocType(mediaFile.type) : false;

  const getDocIcon = () => {
    if (!mediaFile) return "📄";
    if (mediaFile.name.endsWith(".pdf")) return "📕";
    if (mediaFile.name.endsWith(".doc") || mediaFile.name.endsWith(".docx")) return "📘";
    if (mediaFile.name.endsWith(".txt")) return "📝";
    if (mediaFile.name.endsWith(".csv")) return "📊";
    return "📄";
  };

  const handleLanguageSelect = (lang: typeof LANGUAGES[number]) => {
    setInputLang(lang.code);
    setLangDropdownOpen(false);
    const triggerGT = (code: string) => {
      const gt = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (gt) { gt.value = code; gt.dispatchEvent(new Event('change', { bubbles: true })); }
    };
    triggerGT(lang.code);
    setTimeout(() => triggerGT(lang.code), 500);
  };

  const activeLang = LANGUAGES.find(l => l.code === inputLang) || LANGUAGES[0];

  return (
    <motion.section
      className="max-w-3xl mx-auto px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-violet-500/30 rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-visible shadow-2xl transition-all duration-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">

          {/* ── Premium Language Selector ── */}
          <div className="absolute top-3 right-3 z-20" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(prev => !prev)}
              className={`flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200 backdrop-blur-sm text-xs font-semibold ${activeLang.bg} ${activeLang.color} hover:scale-105 shadow-sm`}
            >
              <span className="text-base leading-none">{activeLang.flag}</span>
              <Globe className="w-3 h-3 opacity-60" />
              <span>{activeLang.label}</span>
              <span className="text-[9px] opacity-50">{langDropdownOpen ? "▲" : "▼"}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-[#0d1117]/97 backdrop-blur-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.75)] p-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150">
                <p className="text-[9px] font-code text-muted-foreground/50 uppercase tracking-widest px-2 pb-2 pt-1">
                  Select input language
                </p>
                <div className="grid grid-cols-2 gap-1 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageSelect(lang)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all duration-150 border group ${
                        inputLang === lang.code
                          ? `${lang.bg} ${lang.color} shadow-sm`
                          : "border-transparent hover:border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[11px] font-semibold leading-none ${
                          inputLang === lang.code ? lang.color : "text-foreground/80 group-hover:text-foreground"
                        }`}>{lang.label}</p>
                        <p className="text-[9px] text-muted-foreground/55 mt-0.5 truncate">{lang.native}</p>
                      </div>
                      {inputLang === lang.code && <span className={`text-[10px] ${lang.color}`}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Textarea ── */}
          {inputLang === "en" ? (
            <Textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); }
              }}
              placeholder="Initialize forensic scan: Paste text, upload deepfakes (image/video), or inject documents (PDF/CSV) to extract verifiable truth..."
              className="min-h-[140px] bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 resize-none text-lg p-6 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all !pt-12 md:!pt-6 md:pr-48"
            />
          ) : (
            <ReactTransliterate
              value={claim}
              onChangeText={(text) => setClaim(text)}
              lang={inputLang as any}
              containerClassName="w-full"
              renderComponent={(props) => (
                <Textarea
                  {...props}
                  onPaste={handlePaste}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); }
                  }}
                  placeholder={`Initializing ${activeLang.label} translation matrix...`}
                  className="min-h-[140px] bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 resize-none text-lg p-6 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all !pt-12 md:!pt-6 md:pr-48"
                />
              )}
            />
          )}
        </div>

        {/* Media/Document Preview */}
        {mediaPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-xl overflow-hidden border border-border bg-card p-3"
          >
            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-4 right-4 z-10 bg-background/80 rounded-full p-1 hover:bg-background transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>

            {isImage && mediaPreview !== "__document__" && (
              <img src={mediaPreview} alt="Selected media" className="max-h-48 rounded-lg mx-auto object-contain" />
            )}
            {isVideo && mediaPreview !== "__document__" && (
              <video src={mediaPreview} controls className="max-h-48 rounded-lg mx-auto" />
            )}
            {isDocument && (
              <div className="flex items-center gap-4 py-4 px-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
                  <span className="text-2xl">{getDocIcon()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{mediaFile?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {((mediaFile?.size || 0) / 1024 / 1024).toFixed(1)}MB •{" "}
                    {mediaFile?.type === "application/pdf" ? "PDF Document" :
                     mediaFile?.name.endsWith(".docx") ? "Word Document" :
                     mediaFile?.name.endsWith(".doc") ? "Word Document" :
                     mediaFile?.name.endsWith(".txt") ? "Text File" :
                     mediaFile?.name.endsWith(".csv") ? "CSV Spreadsheet" :
                     "Document"}
                  </p>
                  <p className="text-[11px] text-primary mt-1">Will be analyzed for authenticity & fact-checked</p>
                </div>
              </div>
            )}
            {!isDocument && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {mediaFile?.name} ({(mediaFile!.size / 1024 / 1024).toFixed(1)}MB)
              </p>
            )}
          </motion.div>
        )}

        {/* Toolbar */}
        <div className="relative flex items-center justify-between gap-3 flex-wrap p-4 bg-black/20 border-t border-white/5 rounded-b-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.csv,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-primary/30 transition-all rounded-lg"
              disabled={isLoading}
            >
              <Image className="w-4 h-4 mr-2 text-primary/70" />
              <span>Image</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-primary/30 transition-all rounded-lg hidden sm:flex"
              disabled={isLoading}
            >
              <Video className="w-4 h-4 mr-2 text-primary/70" />
              <span>Video</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => docInputRef.current?.click()}
              className="border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-violet-500/30 transition-all rounded-lg"
              disabled={isLoading}
            >
              <FileText className="w-4 h-4 mr-2 text-violet-400/70" />
              <span>Document</span>
            </Button>

            <div className="flex items-center ml-2 border border-white/10 rounded-lg bg-white/5 overflow-hidden">
              <select
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value)}
                className="bg-transparent text-muted-foreground text-xs p-2.5 outline-none cursor-pointer hover:bg-white/5 transition-colors"
                disabled={isListening}
              >
                <option value="en-US">EN</option>
                <option value="hi-IN">HI</option>
                <option value="mr-IN">MR</option>
                <option value="bn-IN">BN</option>
                <option value="te-IN">TE</option>
                <option value="ta-IN">TA</option>
                <option value="gu-IN">GU</option>
                <option value="kn-IN">KN</option>
                <option value="es-ES">ES</option>
                <option value="fr-FR">FR</option>
              </select>
              <Button
                type="button"
                variant="ghost"
                onClick={toggleListening}
                className={`h-full px-3 rounded-none border-l border-white/10 hover:bg-white/10 ${isListening ? "text-destructive animate-pulse bg-red-500/10" : "text-primary/80 hover:text-primary"}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={(!claim.trim() && !mediaFile) || isLoading}
            className="bg-primary/90 text-primary-foreground hover:bg-primary font-display font-black px-10 py-6 w-full sm:w-auto text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] uppercase tracking-wider relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                <span>Scanning</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-3" />
                <span>Initialize</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.section>
  );
};

export default ClaimInput;
