import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardList, Shield, AlertTriangle, XCircle, HelpCircle, CheckCircle, UserCheck, ShieldOff, FileSignature } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AuditItem {
  id: string;
  claim: string;
  verdict: string;
  confidence: number;
  actionTaken: "Blocked" | "Flagged" | "Labeled" | "Allowed";
  humanOverride: boolean;
  timestamp: string;
}

const verdictIcons: Record<string, typeof Shield> = {
  TRUE: CheckCircle,
  FALSE: XCircle,
  MISLEADING: AlertTriangle,
  UNVERIFIED: HelpCircle,
};

const verdictColors: Record<string, string> = {
  TRUE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  FALSE: "text-red-400 bg-red-500/10 border-red-500/20",
  MISLEADING: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  UNVERIFIED: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

const actionColors: Record<string, string> = {
  Blocked: "text-red-400 bg-red-500/10",
  Flagged: "text-amber-400 bg-amber-500/10",
  Labeled: "text-blue-400 bg-blue-500/10",
  Allowed: "text-emerald-400 bg-emerald-500/10",
};

const MOCK_AUDIT_LOGS: AuditItem[] = [
  {
    id: "a1",
    claim: "UN banning cash transactions globally by 2026...",
    verdict: "FALSE",
    confidence: 98,
    actionTaken: "Flagged",
    humanOverride: false,
    timestamp: "2 mins ago"
  },
  {
    id: "a2",
    claim: "Election ballots found dumped in river in Ohio...",
    verdict: "FALSE",
    confidence: 100,
    actionTaken: "Blocked",
    humanOverride: true,
    timestamp: "15 mins ago"
  },
  {
    id: "a3",
    claim: "New study shows green tea extracts can completely cure advanced stage diabetes...",
    verdict: "MISLEADING",
    confidence: 85,
    actionTaken: "Labeled",
    humanOverride: false,
    timestamp: "1 hour ago"
  },
  {
    id: "a4",
    claim: "The Eiffel Tower was struck by lightning 15 times during yesterday's storm.",
    verdict: "TRUE",
    confidence: 92,
    actionTaken: "Allowed",
    humanOverride: false,
    timestamp: "2 hours ago"
  },
  {
    id: "a5",
    claim: "Government secretly increasing taxes on all incoming bank transfers starting midnight.",
    verdict: "FALSE",
    confidence: 96,
    actionTaken: "Blocked",
    humanOverride: true,
    timestamp: "3 hours ago"
  }
];

interface AuditLogPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuditLogPanel = ({ isOpen, onClose }: AuditLogPanelProps) => {
  const [items, setItems] = useState<AuditItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setItems(MOCK_AUDIT_LOGS);
    }
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
            className="fixed left-0 top-0 h-full w-full max-w-md bg-card border-r border-border z-50 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur z-10">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-primary" />
                Moderation Audit Log
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {items.map((item) => {
                const Icon = verdictIcons[item.verdict] || HelpCircle;
                const vColor = verdictColors[item.verdict] || "text-slate-400 bg-slate-500/10";
                
                return (
                  <Card key={item.id} className="bg-secondary/30 border-border overflow-hidden pb-1">
                    <div className="p-4 pb-3">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${vColor}`}>
                          <Icon className="w-3 h-3" />
                          {item.verdict}
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{item.timestamp}</span>
                      </div>
                      
                      <h3 className="text-sm font-medium leading-snug text-foreground mb-4">
                        {item.claim}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
                          <span className="text-muted-foreground block mb-1">Confidence</span>
                          <span className="font-mono text-foreground">{item.confidence}%</span>
                        </div>
                        
                        <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
                          <span className="text-muted-foreground block mb-1">Action</span>
                          <span className={`font-semibold ${actionColors[item.actionTaken].split(' ')[0]}`}>
                            {item.actionTaken}
                          </span>
                        </div>
                        
                        <div className={`col-span-2 rounded-lg p-2.5 flex justify-between items-center border ${item.humanOverride ? 'bg-primary/5 border-primary/20' : 'bg-background/50 border-border/50'}`}>
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            {item.humanOverride ? <UserCheck className="w-3.5 h-3.5 text-primary" /> : <ShieldOff className="w-3.5 h-3.5" />}
                            Human Override
                          </span>
                          <span className={`font-bold ${item.humanOverride ? 'text-primary' : 'text-foreground'}`}>
                            {item.humanOverride ? 'YES' : 'NO'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuditLogPanel;
