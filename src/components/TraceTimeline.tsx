import { motion } from "framer-motion";
import { CheckCircle, Clock, Search, Database, ShieldAlert, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type TraceStepStatus = "pending" | "loading" | "complete" | "alert";

export interface TraceStep {
  id: string;
  label: string;
  status: TraceStepStatus;
  timestamp?: string;
}

interface TraceTimelineProps {
  steps: TraceStep[];
}

const getIcon = (status: TraceStepStatus, index: number) => {
  if (status === "complete") return <CheckCircle className="w-5 h-5 text-primary" />;
  if (status === "alert") return <AlertCircle className="w-5 h-5 text-destructive" />;
  if (status === "loading") return <Clock className="w-5 h-5 text-accent animate-spin" />;
  
  // Pending icons based on index
  if (index === 0) return <Search className="w-5 h-5 text-muted-foreground" />;
  if (index === 1) return <ShieldAlert className="w-5 h-5 text-muted-foreground" />;
  if (index === 2) return <Database className="w-5 h-5 text-muted-foreground" />;
  return <Clock className="w-5 h-5 text-muted-foreground" />;
};

const TraceTimeline = ({ steps }: TraceTimelineProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-border shadow-2xl">
      <h3 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Truth Trace Lineage
      </h3>
      
      <div className="flex items-center justify-between relative">
        {/* Background connecting line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted z-0 hidden md:block" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full relative z-10 gap-6 md:gap-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-row md:flex-col items-center gap-4 md:gap-3 flex-1"
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step.status === "complete" ? "bg-primary/20 border-primary" : 
                    step.status === "alert" ? "bg-destructive/20 border-destructive" :
                    step.status === "loading" ? "bg-accent/20 border-accent glow-misleading" : 
                    "bg-muted/20 border-muted"
                  } backdrop-blur-sm transition-all duration-300`}
                >
                  {getIcon(step.status, index)}
                </div>
                
                <div className="text-left md:text-center">
                  <p className={`font-display text-sm font-semibold ${
                    step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                  }`}>
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {step.timestamp}
                    </p>
                  )}
                </div>
                
                {/* Mobile connecting line */}
                {!isLast && (
                  <div className="hidden md:hidden absolute left-[1.4rem] top-[3rem] w-0.5 h-10 bg-muted" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TraceTimeline;
