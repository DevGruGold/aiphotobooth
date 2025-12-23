import { supabase } from "@/integrations/supabase/client";
import { Theme } from "@/data/themes";

export interface TransformResult {
  transformedImage: string;
  message: string;
}

export async function transformPhoto(
  imageBase64: string,
  theme: Theme
): Promise<TransformResult> {
  const { data, error } = await supabase.functions.invoke<TransformResult>(
    "transform-photo",
    {
      body: {
        imageBase64,
        theme: {
          id: theme.id,
          name: theme.name,
          prompt: theme.prompt,
        },
      },
    }
  );

  if (error) {
    console.error("Transform error:", error);
    throw new Error(error.message || "Failed to transform photo");
  }

  if (!data) {
    throw new Error("No response from transformation service");
  }

  return data;
}
