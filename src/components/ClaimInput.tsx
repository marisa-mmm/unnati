import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Image, Video, X, Upload, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ClaimInputProps {
  onSubmit: (claim: string, mediaFile?: File) => void;
  isLoading: boolean;
}

const ClaimInput = ({ onSubmit, isLoading }: ClaimInputProps) => {
  const [claim, setClaim] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-US");
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max 10MB.");
      return;
    }

    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isImage = mediaFile?.type.startsWith("image/");
  const isVideo = mediaFile?.type.startsWith("video/");

  return (
    <motion.section
      className="max-w-3xl mx-auto px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder='Paste a claim to fact-check, or upload an image/video to analyze...'
            className="min-h-[120px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-base p-5 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Media Preview */}
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
            {isImage && (
              <img src={mediaPreview} alt="Selected media" className="max-h-48 rounded-lg mx-auto object-contain" />
            )}
            {isVideo && (
              <video src={mediaPreview} controls className="max-h-48 rounded-lg mx-auto" />
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {mediaFile?.name} ({(mediaFile!.size / 1024 / 1024).toFixed(1)}MB)
            </p>
          </motion.div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
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
              Image
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hidden sm:flex"
              disabled={isLoading}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
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
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Verify
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.section>
  );
};

export default ClaimInput;
