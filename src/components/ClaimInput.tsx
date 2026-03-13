import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ClaimInputProps {
  onSubmit: (claim: string) => void;
  isLoading: boolean;
}

const ClaimInput = ({ onSubmit, isLoading }: ClaimInputProps) => {
  const [claim, setClaim] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim()) {
      onSubmit(claim.trim());
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
          <Textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder='Paste a claim to fact-check... e.g. "The government announced free electricity for all citizens starting next month"'
            className="min-h-[120px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-base p-5 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={!claim.trim() || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold px-8 py-3 text-base rounded-xl transition-all glow-true"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Claim...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Verify Claim
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.section>
  );
};

export default ClaimInput;
