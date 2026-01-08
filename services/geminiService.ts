
import { GoogleGenAI, Type } from "@google/genai";
import { Expense, AIAnalysisResponse } from "../types";

export const analyzeExpenses = async (expenses: Expense[]): Promise<AIAnalysisResponse> => {
  if (expenses.length === 0) {
    return { insights: [] };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Проанализируй следующие расходы на автомобиль и дай 3 кратких совета по экономии или обслуживанию.
    Расходы: ${JSON.stringify(expenses)}
    
    Верни ответ строго в формате JSON:
    {
      "insights": [
        {
          "title": "Заголовок совета",
          "description": "Описание совета",
          "type": "warning" | "tip" | "success"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING }
                },
                required: ["title", "description", "type"]
              }
            }
          },
          required: ["insights"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"insights": []}');
    return result as AIAnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      insights: [
        {
          title: "Упс! Ошибка анализа",
          description: "Не удалось подключиться к ИИ для анализа ваших трат. Попробуйте позже.",
          type: "warning"
        }
      ]
    };
  }
};
