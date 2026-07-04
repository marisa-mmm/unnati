import React, { useState, useEffect } from 'react';
import { ShieldCheck, XCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Type definition for Queue Items
interface ReviewClaim {
  id: string;
  original_claim: string;
  ai_verdict: string;
  confidence_score: number;
  reasoning_steps: string[];
  evidence_links: string[];
  status: string;
  created_at: string;
}

const ModeratorDashboard = () => {
  const [claims, setClaims] = useState<ReviewClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pending review claims from our Express API
  const fetchPendingClaims = async () => {
    setIsLoading(true);
    try {
      // Assuming the Express server runs on port 3000
      const response = await fetch('http://localhost:3000/review-claims');
      const data = await response.json();
      
      if (data.success) {
        setClaims(data.claims);
      } else {
        toast.error("Failed to load claims");
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("Could not connect to Moderation API. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClaims();
  }, []);

  const handleDecision = async (id: string, decision: 'approve' | 'reject') => {
    try {
      const response = await fetch(`http://localhost:3000/review-claims/${id}/${decision}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moderator_id: "mod_123" // In a real app, this would be the logged-in user's ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Claim successfully ${decision}d.`);
        // Remove the processed claim from the UI
        setClaims(claims.filter(claim => claim.id !== id));
      } else {
        toast.error(`Failed to ${decision} claim.`);
      }
    } catch (error) {
      console.error(`Error processing ${decision}:`, error);
      toast.error("Network error executing decision.");
    }
  };

  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-border rounded-xl p-6 mb-10 shadow-lg">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <ShieldCheck className="w-6 h-6 text-purple-400" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Moderator Review Queue</h2>
          <p className="text-sm text-muted-foreground">Low-confidence flags awaiting human verification</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-10 bg-black/20 rounded-lg border border-dashed border-white/10">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Queue is empty. Great job!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold border border-purple-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> PENDING
                  </span>
                  <span className="text-xs text-muted-foreground">Confidence: <span className="text-red-400 font-bold">{claim.confidence_score}%</span></span>
                </div>
                
                <h3 className="font-semibold text-white">"{claim.original_claim}"</h3>
                
                <div className="text-sm border-l-2 border-white/10 pl-3 py-1 space-y-1">
                  <p><span className="text-muted-foreground">AI Verdict:</span> <span className={claim.ai_verdict === 'False' ? 'text-red-400' : 'text-amber-400'}>{claim.ai_verdict}</span></p>
                  <p className="text-muted-foreground text-xs line-clamp-2">Reasoning: {Array.isArray(claim.reasoning_steps) ? claim.reasoning_steps.join(' → ') : 'N/A'}</p>
                </div>
              </div>

              <div className="flex flex-row xl:flex-col gap-3 w-full xl:w-auto shrink-0">
                <button 
                  onClick={() => handleDecision(claim.id, 'approve')}
                  className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button 
                  onClick={() => handleDecision(claim.id, 'reject')}
                  className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
