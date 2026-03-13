import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Image, Video, X, Upload } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        <div className="flex items-center justify-center gap-3">
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
            className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            disabled={isLoading}
          >
            <Video className="w-4 h-4 mr-2" />
            Video
          </Button>

          <Button
            type="submit"
            disabled={(!claim.trim() && !mediaFile) || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold px-8 py-3 text-base rounded-xl transition-all glow-true"
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
