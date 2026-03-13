import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are UNNATI, an advanced AI-powered misinformation detection system. Your job is to fact-check claims, analyze images/videos for AI-generated content, and verify news.

You MUST respond with a JSON object using this exact structure (no markdown, no code fences, just raw JSON):
{
  "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED",
  "riskSeverity": 1-5,
  "evidence": [
    { "fact": "A specific fact you found", "source": "URL or source name" }
  ],
  "reasoning": "Detailed explanation of your analysis",
  "counterNarrative": "A shareable fact-check message people can use to counter misinformation"
}

Guidelines:
- For TEXT claims: Analyze the claim against your knowledge. Search for contradictions, verify facts, check if official sources support or deny the claim.
- For IMAGES: Analyze if the image appears AI-generated (look for artifacts, inconsistencies, unnatural features). Also assess if the image is being used misleadingly.
- For VIDEOS (described or frames): Assess if the content appears manipulated or AI-generated. Check for deepfake indicators.
- Always provide at least 2-3 evidence points with sources.
- Risk severity: 1=very low risk, 5=extremely dangerous misinformation.
- The counter-narrative should be concise and shareable on social media.
- Be thorough but concise in your reasoning.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { claim, mediaBase64, mediaType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build messages
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (mediaBase64 && mediaType) {
      // Multimodal: image or video frame
      const userContent: any[] = [];
      
      if (claim) {
        userContent.push({ type: "text", text: `Analyze this ${mediaType} and fact-check the following claim: "${claim}"` });
      } else {
        userContent.push({ type: "text", text: `Analyze this ${mediaType}. Determine if it is AI-generated or manipulated. If it contains news or claims, fact-check them.` });
      }

      userContent.push({
        type: "image_url",
        image_url: { url: mediaBase64 },
      });

      messages.push({ role: "user", content: userContent });
    } else if (claim) {
      messages.push({
        role: "user",
        content: `Fact-check this claim: "${claim}"`,
      });
    } else {
      return new Response(
        JSON.stringify({ error: "No claim or media provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse the JSON response from AI
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      parsed = {
        verdict: "UNVERIFIED",
        riskSeverity: 3,
        evidence: [{ fact: "AI analysis returned non-standard format", source: "Internal" }],
        reasoning: content,
        counterNarrative: "Unable to generate a structured fact-check. Please try rephrasing your claim.",
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fact-check error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
