import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY is missing in process.env");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface DecadeResult {
  decade: string;
  imageUrl: string;
  status: 'loading' | 'done' | 'error';
}

export async function detectGender(base64Image: string): Promise<string> {
  try {
    // Remove data URL prefix if present for processing
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Data } },
          { text: "Look at the person in this image. Reply with only ONE word: 'man' if male-presenting, 'woman' if female-presenting. If unsure, reply 'person'." }
        ]
      }
    });
    
    const text = response.text?.trim().toLowerCase();
    if (text === 'man' || text === 'woman') return text;
    return 'person';
  } catch (e) {
    console.warn("Gender detection failed, defaulting to 'person'", e);
    return 'person';
  }
}

export async function generateDecadeImage(base64Org: string, decade: string, gender: string): Promise<DecadeResult> {
  const base64Data = base64Org.replace(/^data:image\/\w+;base64,/, "");
  
  const prompt = `Create a classic ${decade} high school yearbook portrait of a youthful teenage version (approx 17-18 years old) of this person.
  CRITICAL: Maintain facial identity but make them look high school age.
  Use an authentic ${decade} yearbook style backdrop, lighting, pose, and grain.
  Style them with stereotypical ${decade} high school hairstyle and clothing for a ${gender}.
  Head and shoulders portrait. Slight smile, looking at camera.
  Single person only. No text in image.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      return { decade, imageUrl, status: 'done' };
    } else {
      throw new Error("No image data received");
    }
  } catch (err) {
    console.error(`Gemini API error for ${decade}:`, err);
    return { decade, imageUrl: '', status: 'error' };
  }
}
