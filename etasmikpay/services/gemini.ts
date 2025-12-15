import { GoogleGenAI } from "@google/genai";

// Helper to retrieve API key safely for both Vite (Vercel) and Playground environments
const getApiKey = (): string => {
  const candidates = [
    // Vite-style env (browser build)
    () => (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GEMINI_API_KEY) as string | undefined,
    () => (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_KEY) as string | undefined,
    // Node-style env (server / playground)
    () => (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) as string | undefined,
    () => (typeof process !== 'undefined' && process.env?.API_KEY) as string | undefined,
  ];

  for (const getter of candidates) {
    const value = getter();
    if (value) return value;
  }

  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (prompt: string, roleContext: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful Islamic assistant for a Quran Hafazan application called eTasmikPay.
        Your goal is to assist ${roleContext}.
        If the user is an Ustaz, provide teaching tips, motivation for students, or explanations of Tajweed rules.
        If the user is a Parent, explain the meaning of Surahs, benefits of hafazan, or how to encourage their child.
        Keep answers concise, respectful, and culturally appropriate for a Malaysian Islamic context.
        Use Markdown for formatting.`,
      },
    });

    return response.text || "Maaf, saya tidak dapat menjawab permintaan itu sekarang.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, perkhidmatan AI sedang sibuk. Sila cuba sebentar lagi.";
  }
};
