import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getPlantCareAdvice(plantName: string, species: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Proporciona un consejo breve y profesional de cuidado para una planta llamada ${plantName} de la especie ${species}. El tono debe ser elegante y botánico.`,
    config: {
      systemInstruction: "Eres un experto botánico de Digital Greenhouse. Proporcionas consejos de cuidado precisos y elegantes.",
    },
  });
  return response.text;
}

export async function analyzePlantHealth(plantName: string, species: string, lastWatered: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza el estado de salud de una ${species} llamada ${plantName}. Fue regada por última vez el ${lastWatered}. ¿Qué acciones recomiendas?`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, description: "Saludable, Estable o Necesita Atención" },
          recommendation: { type: Type.STRING },
          nextWateringDays: { type: Type.NUMBER }
        },
        required: ["status", "recommendation", "nextWateringDays"]
      }
    }
  });
  return JSON.parse(response.text);
}
