
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAIResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Vibogram AI, an advanced coding and social media assistant. Use Google Search for real-time dev info. If search is used, provide links. Be concise and futuristic.",
      },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter((s: any) => s.title && s.uri);

    return {
      text: response.text,
      sources: sources || []
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { text: "Tizimda uzilish yuz berdi... 🌌", sources: [] };
  }
};

export const generateDevImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality futuristic developer concept: ${prompt}, neon colors, cyber-tech aesthetic, 4k` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error('Image Gen Error:', error);
    return null;
  }
};
