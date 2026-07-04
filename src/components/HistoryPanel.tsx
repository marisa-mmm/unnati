import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Shield, AlertTriangle, XCircle, HelpCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  claim_text: string;
  media_type: string;
  verdict: string;
  risk_severity: number;
  created_at: string;
}

const verdictIcons: Record<string, typeof Shield> = {
  TRUE: CheckCircle,
  FALSE: XCircle,
  MISLEADING: AlertTriangle,
  UNVERIFIED: HelpCircle,
};

const verdictColors: Record<string, string> = {
  TRUE: "text-verdict-true",
  FALSE: "text-verdict-false",
  MISLEADING: "text-verdict-misleading",
  UNVERIFIED: "text-verdict-unverified",
};

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryPanel = ({ isOpen, onClose }: HistoryPanelProps) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem("unnati_history") || "[]");
      setItems(stored as HistoryItem[]);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Claim History
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-3">
              {loading ? (
                <p className="text-muted-foreground text-sm text-center py-8">Loading history…</p>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No history yet.</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">
                    Analyze a claim and it will appear here.
                  </p>
                </div>
              ) : (
                items.map((item) => {
                  const VerdictIcon = verdictIcons[item.verdict] || HelpCircle;
                  const colorClass = verdictColors[item.verdict] || "text-muted-foreground";
                  return (
                    <Card key={item.id} className="p-4 bg-card/60 border-border/60">
                      <div className="flex items-start gap-3">
                        <VerdictIcon className={`w-5 h-5 mt-0.5 shrink-0 ${colorClass}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.claim_text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-bold ${colorClass}`}>{item.verdict}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              Risk: {item.risk_severity}/10
                            </span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;
