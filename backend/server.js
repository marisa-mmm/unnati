// -------------------------------------------------------------
// Human Review Layer - UNNATI Misinformation Detection Backend
// -------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_SERVICE_ROLE_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 1. INGESTION & THRESHOLD LOGIC
// ==========================================
/**
 * POST /analyze-claim
 * Simulates an AI system analyzing a claim and deciding whether to auto-publish or queue for human review.
 */
app.post('/analyze-claim', async (req, res) => {
  const { original_claim, ai_verdict, confidence_score, reasoning_steps, evidence_links } = req.body;

  try {
    // 2. Confidence Threshold Logic
    if (confidence_score < 70) {
      // 5. Safety Rule: Not confident enough. Send to Human Review Queue.
      console.log(`[Safety Triggered] Confidence (${confidence_score}%) < 70. Routing to Human Review.`);
      
      const { data, error } = await supabase
        .from('human_review_queue')
        .insert([{
          original_claim,
          ai_verdict,
          confidence_score,
          reasoning_steps: reasoning_steps || [],
          evidence_links: evidence_links || [],
          status: 'pending' // Enforces Safety Rule: System will not act until status shifts to 'approved'.
        }])
        .select('*')
        .single();

      if (error) throw error;

      return res.status(202).json({
        success: true,
        message: "Confidence too low for automation. Claim sent to Human Review Queue.",
        queue_ticket: data
      });

    } else {
      // If Confidence >= 70, allow system to publish automated response.
      console.log(`[Auto-Publish] Confidence (${confidence_score}%) >= 70. Publishing automatically.`);
      
      // Real-World Scenario: Here you would save directly to the 'published_claims' table.
      return res.status(200).json({
        success: true,
        message: "High confidence score. Automated fact-check posted successfully.",
        published_data: {
          original_claim,
          ai_verdict,
          confidence_score
        }
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 3. MODERATOR DASHBOARD APIs
// ==========================================

/**
 * GET /review-claims
 * Returns all pending claims waiting in the human_review_queue.
 */
app.get('/review-claims', async (req, res) => {
  try {
    const { data: claims, error } = await supabase
      .from('human_review_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      count: claims.length, 
      claims 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch pending review claims" });
  }
});

/**
 * Helper function for processing human decisions and logging audits.
 */
async function processReviewDecision(queueId, decision, moderatorId = null) {
  // Update the Queue table to approved/rejected
  const { data: updatedQueue, error: updateError } = await supabase
    .from('human_review_queue')
    .update({ status: decision })
    .eq('id', queueId)
    .select()
    .single();

  if (updateError) throw updateError;
  if (!updatedQueue) throw new Error("Claim ID not found");

  // 4. Logging: Insert decision into review_logs
  const { error: logError } = await supabase
    .from('review_logs')
    .insert([{
      queue_id: queueId,
      decision: decision,
      moderator_id: moderatorId // In a real app, extract this from auth middleware
    }]);

  if (logError) throw logError;

  return updatedQueue;
}

/**
 * POST /review-claims/:id/approve
 * Moderator marks a claim as approved. 
 * Once approved, it can be fetched by the frontend and officially published.
 */
app.post('/review-claims/:id/approve', async (req, res) => {
  try {
    const queueId = req.params.id;
    const moderatorId = req.body.moderator_id; // Assume passed in body for simplicity
    
    // Process approval
    const approvedClaim = await processReviewDecision(queueId, 'approved', moderatorId);

    // Notice: From here, the backend could emit a Webhook / Event to auto-post the approved claim.

    return res.status(200).json({
      success: true,
      message: "Claim approved successfully and logged.",
      claim: approvedClaim
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to approve claim" });
  }
});

/**
 * POST /review-claims/:id/reject
 * Moderator marks a claim as rejected.
 */
app.post('/review-claims/:id/reject', async (req, res) => {
  try {
    const queueId = req.params.id;
    const moderatorId = req.body.moderator_id; 
    
    // Process rejection
    const rejectedClaim = await processReviewDecision(queueId, 'rejected', moderatorId);

    return res.status(200).json({
      success: true,
      message: "Claim rejected successfully and logged.",
      claim: rejectedClaim
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to reject claim" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Express] UNNATI Moderation Layer running on port ${PORT}`);
});
