
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getLegalAdvice = async (query: string): Promise<string> => {
  if (!API_KEY) return "AI Assistant is currently offline. Please contact our office directly.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional legal assistant for AKG Legal Services. 
                 A client is asking: "${query}". 
                 Provide a concise, professional response. 
                 Always include a disclaimer that this is not official legal advice.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "I'm sorry, I couldn't process that query. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while fetching legal guidance. Please try again.";
  }
};
