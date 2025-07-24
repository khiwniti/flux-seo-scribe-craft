import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_MODEL_NAME = "gemini-pro";

interface GeminiServiceError extends Error {
  status?: number;
  isApiKeyInvalid?: boolean;
  details?: any;
}

export async function generateBlogContent(prompt: string, apiKeyOverride?: string): Promise<string> {
  try {
    const API_KEY = apiKeyOverride || import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY environment variable.');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL_NAME });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No content generated from Gemini API');
    }

    return text;
  } catch (error: any) {
    console.error("Error in generateBlogContent:", error);
    
    if (error.message?.includes("API key")) {
      const serviceError = new Error('Invalid or missing Gemini API key') as GeminiServiceError;
      serviceError.isApiKeyInvalid = true;
      throw serviceError;
    }
    
    throw new Error(`Content generation failed: ${error.message || 'Unknown error'}`);
  }
}

// For SEOChatbot
interface ChatMessagePart {
  text: string;
}
export interface ChatHistoryMessage {
  role: "user" | "model";
  parts: ChatMessagePart[];
}

export async function getChatbotResponse(
  userPrompt: string,
  chatHistory: ChatHistoryMessage[],
  apiKeyOverride?: string
): Promise<string> {
  try {
    const API_KEY = apiKeyOverride || import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY environment variable.');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: chatHistory.map(msg => ({
        role: msg.role,
        parts: msg.parts
      })),
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response generated from Gemini API');
    }

    return text;
  } catch (error: any) {
    console.error("Error in getChatbotResponse:", error);
    
    if (error.message?.includes("API key")) {
      const serviceError = new Error('Invalid or missing Gemini API key') as GeminiServiceError;
      serviceError.isApiKeyInvalid = true;
      throw serviceError;
    }
    
    throw new Error(`Chatbot response failed: ${error.message || 'Unknown error'}`);
  }
}

export async function generateImagePromptForText(textInput: string, apiKeyOverride?: string): Promise<string> {
  try {
    const API_KEY = apiKeyOverride || import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
      throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY environment variable.');
    }

    const fullPromptForImage = `Based on the following text, generate a detailed and creative prompt for a text-to-image generation model.
The image prompt should be descriptive, specifying the subject, style (e.g., photorealistic, watercolor, cartoonish, abstract), mood (e.g., inspiring, serene, energetic, mysterious), composition, and any key elements or colors that would make the image compelling and relevant to the text.

Input Text:
---
${textInput.substring(0, 1500)}
---
Generated Image Prompt:`;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL_NAME });

    const result = await model.generateContent(fullPromptForImage);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No image prompt generated from Gemini API');
    }

    return text.replace("Generated Image Prompt:", "").trim();
  } catch (error: any) {
    console.error("Error in generateImagePromptForText:", error);
    
    if (error.message?.includes("API key")) {
      const serviceError = new Error('Invalid or missing Gemini API key') as GeminiServiceError;
      serviceError.isApiKeyInvalid = true;
      throw serviceError;
    }
    
    throw new Error(`Image prompt generation failed: ${error.message || 'Unknown error'}`);
  }
}
