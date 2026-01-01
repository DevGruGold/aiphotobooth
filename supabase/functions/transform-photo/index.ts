import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransformRequest {
  imageBase64: string;
  theme: {
    id: string;
    name: string;
    prompt: string;
  };
}

interface TransformResult {
  transformedImage: string;
  message: string;
}

async function tryGeminiDirect(cleanBase64: string, prompt: string): Promise<TransformResult | null> {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY not configured, skipping direct Gemini");
    return null;
  }

  console.log("Attempting direct Gemini API call...");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log("Gemini response received successfully");

    // Extract image from Gemini response
    const parts = data.candidates?.[0]?.content?.parts;
    let generatedImage: string | null = null;
    let textResponse = "";

    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          generatedImage = `data:${mimeType};base64,${part.inlineData.data}`;
        }
        if (part.text) {
          textResponse = part.text;
        }
      }
    }

    if (!generatedImage) {
      console.error("No image in Gemini response:", JSON.stringify(data));
      return null;
    }

    return {
      transformedImage: generatedImage,
      message: textResponse || "Transformation complete!",
    };
  } catch (error) {
    console.error("Gemini direct call failed:", error);
    return null;
  }
}

async function tryLovableAI(cleanBase64: string, prompt: string): Promise<TransformResult | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY is not configured");
    return null;
  }

  console.log("Attempting Lovable AI Gateway call...");

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${cleanBase64}`,
                },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI gateway error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log("Lovable AI response received successfully");

    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!generatedImage) {
      console.error("No image in Lovable AI response:", JSON.stringify(data));
      return null;
    }

    return {
      transformedImage: generatedImage,
      message: textResponse || "Transformation complete!",
    };
  } catch (error) {
    console.error("Lovable AI call failed:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, theme }: TransformRequest = await req.json();
    
    if (!imageBase64 || !theme) {
      return new Response(
        JSON.stringify({ error: "Missing imageBase64 or theme" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing transformation for theme: ${theme.name}`);

    // Clean the base64 string if it has the data URL prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Try Gemini API first
    let result = await tryGeminiDirect(cleanBase64, theme.prompt);
    
    // Fall back to Lovable AI if Gemini fails
    if (!result) {
      console.log("Gemini failed, falling back to Lovable AI...");
      result = await tryLovableAI(cleanBase64, theme.prompt);
    }

    if (!result) {
      return new Response(
        JSON.stringify({ error: "All AI providers failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Transform photo error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
