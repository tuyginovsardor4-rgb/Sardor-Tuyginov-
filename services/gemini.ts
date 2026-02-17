
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAIResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Vibogram AI, an advanced coding and social media assistant. You help developers with code snippets, explain VSCode shortcuts, and provide creative social post ideas. Keep responses concise and use emojis where appropriate.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "The stars are currently misaligned. Please try again in a moment... 🌌";
  }
};
