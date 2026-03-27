import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ModerationResult {
  isAllowed: boolean;
  reason?: string;
}

export const analyzeContent = async (title: string, content: string): Promise<ModerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analiza el siguiente relato erótico para detectar violaciones legales graves. 
      SOLO debes rechazar si detectas:
      1. Pedofilia o contenido con menores.
      2. Bestialismo.
      3. Contenido no consensuado (violación real, no fantasía).
      4. Violencia extrema o snuff.
      
      El erotismo explícito, fetiches comunes, BDSM consensuado y fantasías tabú entre adultos están PERMITIDOS.
      
      Título: ${title}
      Contenido: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAllowed: {
              type: Type.BOOLEAN,
              description: "True si el contenido es legal y está permitido, False si viola las reglas graves."
            },
            reason: {
              type: Type.STRING,
              description: "Breve explicación en español si es rechazado."
            }
          },
          required: ["isAllowed"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Moderation error:", error);
    // En caso de error, permitimos pero registramos para revisión manual si fuera necesario
    return { isAllowed: true };
  }
};
