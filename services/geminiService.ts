
import { GoogleGenAI } from "@google/genai";
export const getAiSuggestion = async (category: string, label: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Predlagaj specifično jed ali film za kategorijo ${category} (${label}). Odgovori v slovenščini, 1 stavek.`,
    });
    return response.text;
  } catch (e) { return "Uživaj v svoji izbiri!"; }
};
