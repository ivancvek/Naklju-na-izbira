
import { GoogleGenAI } from "@google/genai";

export const getAiSuggestion = async (category: string, optionLabel: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Uporabnik se je odločil za kategorijo "${category}" in vrsto "${optionLabel}". 
  Predlagaj eno specifično jed (če gre za hrano) ali en specifičen film/serijo (če gre za zabavo), ki je trenutno popularna ali klasika. 
  Odgovori kratko in spodbudno v slovenskem jeziku, največ 2 stavka.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Uživaj v svoji izbiri!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tukaj je tvoja izbira! Dober tek oziroma uživaj v ogledu!";
  }
};
