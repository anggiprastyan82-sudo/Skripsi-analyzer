import { GoogleGenAI, Type } from "@google/genai";
import { FullAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `Kamu adalah dosen pembimbing skripsi dan reviewer jurnal ilmiah profesional.
Analisis dokumen akademik dengan fokus pada:
- typo & EYD
- struktur ilmiah
- konsistensi penelitian
- bahasa akademik
- metodologi penelitian

Berikan output dalam format JSON yang sangat terstruktur.`;

export async function analyzeThesis(text: string): Promise<FullAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: `Analisis teks skripsi berikut dan berikan feedback mendalam:\n\n${text.substring(0, 30000)}` }]
      }
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sections: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              background: { type: Type.STRING },
              problemStatement: { type: Type.STRING },
              objectives: { type: Type.STRING },
              methodology: { type: Type.STRING },
              references: { type: Type.STRING }
            },
            required: ["title", "background", "problemStatement", "objectives", "methodology", "references"]
          },
          analyses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING, enum: ["KRITIS", "WARNING", "AMAN"] },
                category: { type: Type.STRING, enum: ["TYPO", "STRUKTUR", "BAHASA", "ORISINALITAS"] },
                problem: { type: Type.STRING },
                reason: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                revision: { type: Type.STRING }
              },
              required: ["level", "category", "problem", "reason", "suggestion", "revision"]
            }
          },
          scores: {
            type: Type.OBJECT,
            properties: {
              overall: { type: Type.NUMBER },
              structure: { type: Type.NUMBER },
              language: { type: Type.NUMBER },
              eyd: { type: Type.NUMBER },
              originality: { type: Type.NUMBER }
            },
            required: ["overall", "structure", "language", "eyd", "originality"]
          },
          aiProbability: { type: Type.NUMBER },
          originalityScore: { type: Type.NUMBER }
        },
        required: ["sections", "analyses", "scores", "aiProbability", "originalityScore"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(response.text) as FullAnalysis;
}

export async function chatWithAI(history: { role: "user" | "model", parts: { text: string }[] }[], message: string) {
  const model = "gemini-3-flash-preview";
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: "Kamu adalah asisten akademik ahli skripsi. Bantu mahasiswa memperbaiki skripsi mereka dengan saran profesional, teknis, dan suportif. Gunakan bahasa Indonesia yang baik dan benar."
    },
    history
  });

  const result = await chat.sendMessage({ message });
  return result.text;
}
