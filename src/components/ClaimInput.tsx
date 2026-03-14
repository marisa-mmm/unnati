import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Image, Video, X, Upload, Mic, MicOff, FileText, Globe } from "lucide-react";
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

const ClaimInput = ({ onSubmit, isLoading }: ClaimInputProps) => {
  const [claim, setClaim] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-US");
  const [inputLang, setInputLang] = useState("en");
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

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
          if (event.results[i].isFinal) {
            newFinalStr += event.results[i][0].transcript + " ";
          }
        }
        if (newFinalStr.trim()) {
          setClaim((prev) => (prev + " " + newFinalStr.trim()).trim());
        }
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
    if (claim.trim() || mediaFile) {
      onSubmit(claim.trim(), mediaFile || undefined);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 20MB for documents, 10MB for media
    const maxSize = isDocType(file.type) ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File too large. Max ${isDocType(file.type) ? "20MB" : "10MB"}.`);
      return;
    }

    setMediaFile(file);

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      // For documents, just set a marker — no visual preview needed
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
          // Check file size (max 5MB for pasted images usually fine, but using existing 10MB logic)
          if (file.size > 10 * 1024 * 1024) {
            alert("Pasted image too large. Max 10MB.");
            return;
          }
          setMediaFile(file);
          const reader = new FileReader();
          reader.onload = () => setMediaPreview(reader.result as string);
          reader.readAsDataURL(file);
          e.preventDefault(); // Prevent default paste only if it's an image
          return; // Stop after first image
        }
      }
    }
  };

  const isDocType = (type: string) => {
    return DOC_TYPES.includes(type) || type.endsWith(".pdf");
  };

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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setInputLang(lang);
    
    // Trigger Google Translate to convert entire interface
    const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (gtCombo) {
      gtCombo.value = lang;
      gtCombo.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      setTimeout(() => {
        const delayedCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (delayedCombo) {
          delayedCombo.value = lang;
          delayedCombo.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 500);
    }
  };

  return (
    <motion.section
      className="max-w-3xl mx-auto px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm border border-border px-2 py-1 rounded-md">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <select 
                value={inputLang}
                onChange={handleLanguageChange}
                className="bg-transparent text-xs text-foreground cursor-pointer focus:outline-none appearance-none"
              >
                <option value="en">English (En)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="or">Odia (ଓଡ଼ିଆ)</option>
              </select>
            </div>
          </div>

          {inputLang === "en" ? (
            <Textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder='Paste a claim to fact-check, upload an image/video, or a PDF/document to verify. You can also press Ctrl+V to paste an image here...'
              className="min-h-[120px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-base p-5 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all !pt-12 md:!pt-5 md:pr-40"
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
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  placeholder={`Start typing to see ${inputLang.toUpperCase()} transliteration...`}
                  className="min-h-[120px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-base p-5 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all !pt-12 md:!pt-5 md:pr-40"
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
                  <p className="text-[11px] text-primary mt-1">
                    Will be analyzed for authenticity & fact-checked
                  </p>
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

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Image/Video file input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {/* Document file input (hidden) */}
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
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              disabled={isLoading}
            >
              <Image className="w-4 h-4 mr-2" />
              <span>Image</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hidden sm:flex"
              disabled={isLoading}
            >
              <Video className="w-4 h-4 mr-2" />
              <span>Video</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => docInputRef.current?.click()}
              className="border-border text-muted-foreground hover:text-foreground hover:border-violet-500/50"
              disabled={isLoading}
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>PDF / Doc</span>
            </Button>

            <div className="flex items-center ml-2 border border-border rounded-md px-1 bg-card">
              <select 
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value)}
                className="bg-transparent text-muted-foreground text-xs p-2 outline-none cursor-pointer"
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
                className={`h-8 px-2 ${isListening ? 'text-destructive animate-pulse' : 'text-primary'}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={(!claim.trim() && !mediaFile) || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold px-8 py-3 w-full sm:w-auto text-base rounded-xl transition-all glow-true"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                <span>Verify</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.section>
  );
};

export default ClaimInput;
