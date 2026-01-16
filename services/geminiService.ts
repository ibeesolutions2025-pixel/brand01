import { GoogleGenAI, Type } from "@google/genai";
import { GenerationSettings, GeneratedResult, BackgroundOption } from '../types';
import { BACKGROUND_OPTIONS, STYLE_OPTIONS, TONE_OPTIONS } from '../constants';

const getBackgroundPrompt = (settings: GenerationSettings) => {
  if (settings.background === 'custom') {
    return settings.customBackground || 'clean professional background';
  }
  return BACKGROUND_OPTIONS.find(o => o.id === settings.background)?.promptDesc || '';
};

const getStylePrompt = (id: string) => STYLE_OPTIONS.find(o => o.id === id)?.promptDesc || '';
const getTonePrompt = (id: string) => TONE_OPTIONS.find(o => o.id === id)?.promptDesc || '';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

// Internal function to generate a single asset set
const generateSingleAsset = async (
  ai: GoogleGenAI,
  base64Image: string,
  imageMimeType: string,
  settings: GenerationSettings,
  bgDesc: string,
  styleDesc: string,
  toneDesc: string,
  index: number
): Promise<GeneratedResult> => {
  
  // 1. Generate Text Assets
  const textModel = 'gemini-3-flash-preview';
  const textPrompt = `
    You are an expert AI Video Producer for Veo 3.
    User Context:
    - Content Topic: "${settings.content}"
    - Background: ${bgDesc}
    - Style: ${styleDesc}
    - Tone: ${toneDesc}
    - Variation: This is variation #${index + 1}.

    Task 1: Create a Veo 3 Video Prompt (English).
    - Start with: "A real person sitting comfortably and speaking naturally..."
    - Pose Description: "Relaxed posture, natural shoulder position, not rigid."
    - Setting: "Person is seamlessly integrated into a ${bgDesc}."
    - Include: "Medium shot", "Subtle, natural hand gestures allowed", "Cinematic lighting", "High fidelity".
    - Constraint: "Keep exact facial identity. Body movement should be subtle but natural (breathing, slight shifts), avoiding a frozen statue look."

    Task 2: Create a Script (Vietnamese).
    - Length: Exactly 20-25 words (approx 8 seconds).
    - Tone: ${toneDesc}.
    - Content: Based on "${settings.content}".
    - Style: Natural spoken language, engaging.
    
    Output JSON.
  `;

  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: textPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          veoPrompt: { type: Type.STRING },
          script: { type: Type.STRING }
        },
        required: ["veoPrompt", "script"]
      }
    }
  });

  const textData = JSON.parse(textResponse.text || '{}');

  // 2. Generate Image
  // Updated Prompt: Focus on preserving FACE identity, but relaxing the BODY pose.
  const imageModel = 'gemini-2.5-flash-image';
  const imagePrompt = `
    Edit this image to place the person in a ${bgDesc}.
    
    CRITICAL INSTRUCTIONS FOR EDITING:
    1. FACE & IDENTITY: Keep the facial features, hair, and head structure 100% IDENTICAL to the source image. Do not change the person's identity.
    2. BODY & POSE: Adjust the body posture and shoulders to look NATURAL and RELAXED in the new environment. Remove any stiffness or rigidity from the original photo.
    3. COMPOSITION: Ensure the person is sitting comfortably. The shoulders should interact naturally with the chair or environment (if visible).
    4. LIGHTING: Apply cinematic lighting (${styleDesc}) that wraps around the subject naturally, matching the background.
    
    Aspect Ratio: ${settings.aspectRatio === '9:16' ? 'Portrait' : 'Landscape'}.
    Variation #${index + 1}.
  `;

  const imageResponse = await ai.models.generateContent({
    model: imageModel,
    contents: {
      parts: [
        { inlineData: { mimeType: imageMimeType, data: base64Image } },
        { text: imagePrompt }
      ]
    }
  });

  let generatedImageUrl = '';
  if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!generatedImageUrl) {
     generatedImageUrl = `data:${imageMimeType};base64,${base64Image}`;
  }

  return {
    id: `result-${Date.now()}-${index}`,
    imageUrl: generatedImageUrl,
    veoPrompt: textData.veoPrompt || "Failed prompt.",
    script: textData.script || "Failed script.",
    variantName: `Cảnh ${index + 1}`
  };
};

export const generateAssets = async (
  apiKey: string,
  imageFile: File,
  settings: GenerationSettings
): Promise<GeneratedResult[]> => {
  const ai = new GoogleGenAI({ apiKey });
  const base64Image = await fileToBase64(imageFile);
  const bgDesc = getBackgroundPrompt(settings);
  const styleDesc = getStylePrompt(settings.style);
  const toneDesc = getTonePrompt(settings.tone);

  // Create an array of promises based on quantity
  const promises = Array.from({ length: settings.quantity }, (_, i) => 
    generateSingleAsset(
      ai, 
      base64Image, 
      imageFile.type, 
      settings, 
      bgDesc, 
      styleDesc, 
      toneDesc, 
      i
    )
  );

  return await Promise.all(promises);
};