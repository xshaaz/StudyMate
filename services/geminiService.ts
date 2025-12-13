import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_QUIZ_JSON } from '../constants';
import { QuizQuestion } from '../types';

const apiKey = process.env.API_KEY;

// Fallback Mock Service to ensure app works without key or on error
const MockAI = {
  chat: async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return `[MOCK AI] I see you're asking about "${message}". Here is a helpful study tip: Break your work into small chunks! (Connect a valid API Key to get real Gemini responses)`;
  },
  
  generateQuiz: async (topic: string): Promise<QuizQuestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
        return JSON.parse(MOCK_QUIZ_JSON);
    } catch (e) {
        return [];
    }
  },

  breakdownTask: async (taskTitle: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return [
      `Research key concepts for ${taskTitle}`,
      `Draft the initial outline`,
      `Review and refine the content`,
      `Finalize formatting and submission`
    ];
  }
};

class GeminiService {
  private client: GoogleGenAI | null = null;

  constructor() {
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    }
  }

  async chat(message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> {
    if (!this.client) return MockAI.chat(message);

    try {
      const model = 'gemini-2.5-flash';
      const response = await this.client.models.generateContent({
        model,
        contents: [
            ...history.map(h => ({ role: h.role, parts: h.parts })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are a helpful, encouraging AI study tutor. Keep answers concise and strictly text-based. Do not use markdown formatting like bolding or headers.",
        }
      });
      return response.text || "I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return MockAI.chat(message);
    }
  }

  async generateQuiz(topic: string): Promise<QuizQuestion[]> {
    if (!this.client) return MockAI.generateQuiz(topic);

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a quiz about "${topic}" with 3 questions.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.INTEGER },
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctAnswer: { type: Type.INTEGER, description: "Zero-based index of the correct option" }
                    },
                    required: ["id", "question", "options", "correctAnswer"]
                }
            }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response text");
      return JSON.parse(text) as QuizQuestion[];

    } catch (error) {
      console.error("Gemini Quiz Error:", error);
      return MockAI.generateQuiz(topic);
    }
  }

  async breakdownTask(taskTitle: string): Promise<string[]> {
    if (!this.client) return MockAI.breakdownTask(taskTitle);

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Break down the task "${taskTitle}" into 3 to 5 actionable sub-tasks. Return ONLY a JSON array of strings.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
      });
      
      const text = response.text;
      if(!text) throw new Error("No text");
      return JSON.parse(text) as string[];

    } catch (error) {
        console.error("Gemini Task Breakdown Error:", error);
        return MockAI.breakdownTask(taskTitle);
    }
  }
}

export const geminiService = new GeminiService();