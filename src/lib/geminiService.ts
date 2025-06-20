import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-pro"; // Or specific model as needed
const API_KEY_STORAGE_KEY = 'geminiApiKey';

interface GeminiServiceError extends Error {
  status?: number;
  isApiKeyInvalid?: boolean;
}

function getApiKey(): string | null {
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) {
    return storedKey;
  }
  // Ensure this environment variable is correctly set up in your build process (e.g., Vite, Create React App)
  // For CRA, it must be REACT_APP_... For Vite, it's import.meta.env.VITE_...
  // This example assumes REACT_APP_ for broader compatibility, but adjust if needed.
  const envKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (envKey) {
    return envKey;
  }
  return null;
}

export async function generateBlogContent(prompt: string, apiKeyOverride?: string): Promise<string> {
  const apiKeyToUse = apiKeyOverride || getApiKey();

  if (!apiKeyToUse) {
    const error = new Error("API key is missing. Please set it in Settings or as REACT_APP_GEMINI_API_KEY.") as GeminiServiceError;
    error.isApiKeyInvalid = true; // Treat as invalid if completely missing
    throw error;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKeyToUse);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9, // Controls randomness. Higher is more creative.
      topK: 1, // For next-token selection strategy.
      topP: 1, // For next-token selection strategy.
      maxOutputTokens: 2048, // Adjust as needed for blog post length
    };

    // Safety settings to minimize blocking of harmless content
    // Adjust these based on requirements and testing
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const result = await model.generateContent(
        prompt
        // { // If sending parts instead of a single prompt string
        // generationConfig,
        // safetySettings,
        // }
    );

    // Older versions of the API might have response.text() directly
    // Newer versions (v0.1.0-alpha.3 and later) have a more structured response
    if (result.response && typeof result.response.text === 'function') {
        const text = result.response.text();
        if (text) {
            return text;
        } else {
            // This case might happen if the content was blocked due to safety settings
            // or if the response is empty for other reasons.
            const blockReason = result.response.promptFeedback?.blockReason;
            if (blockReason) {
                throw new Error(`Content generation blocked. Reason: ${blockReason}. Adjust safety settings or prompt if necessary.`);
            }
            const finishReason = result.response.candidates?.[0]?.finishReason;
             if (finishReason && finishReason !== "STOP") {
                throw new Error(`Content generation stopped. Reason: ${finishReason}.`);
            }
            throw new Error("Received empty response from Gemini API or content was blocked.");
        }
    } else {
        // Fallback for potentially different response structures or if text() is not available.
        // This part might need adjustment based on the exact API version and response object.
        // console.warn("Gemini API response structure might have changed. Check geminiService.ts.");
        // If response.candidates exists and has text
        if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return result.response.candidates[0].content.parts[0].text;
        }
        throw new Error("Could not extract text from Gemini API response. The response structure might be unexpected.");
    }

  } catch (error: any) {
    console.error("Error calling Gemini API (generateBlogContent):", error);
    const serviceError = new Error(`Gemini API Error: ${error.message || 'Unknown error'}`) as GeminiServiceError;
    if (error.message && (error.message.includes("API key not valid") || error.message.includes("API key invalid"))) {
      serviceError.isApiKeyInvalid = true;
    }
    // You might want to check for specific error codes or types if the SDK provides them
    // e.g., if (error.status === 400) { ... }
    throw serviceError;
  }
}

export async function generateImagePromptForText(textInput: string, apiKeyOverride?: string): Promise<string> {
  const apiKeyToUse = apiKeyOverride || getApiKey();

  if (!apiKeyToUse) {
    const error = new Error("API key is missing for image prompt generation. Please set it in Settings or as REACT_APP_GEMINI_API_KEY.") as GeminiServiceError;
    error.isApiKeyInvalid = true;
    throw error;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKeyToUse);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME }); // Using gemini-pro

    const fullPrompt = `Based on the following text, generate a detailed and creative prompt for a text-to-image generation model.
The image prompt should be descriptive, specifying the subject, style (e.g., photorealistic, watercolor, cartoonish, abstract), mood (e.g., inspiring, serene, energetic, mysterious), composition, and any key elements or colors that would make the image compelling and relevant to the text.

Input Text:
---
${textInput.substring(0, 1500)}
---
Generated Image Prompt:`; // Added substring to limit input length for safety

    const generationConfig = {
      temperature: 0.8, // Slightly lower for more focused prompt generation
      topK: 1,
      topP: 1,
      maxOutputTokens: 200, // Image prompts are usually shorter
    };

    // Safety settings can be reused or adjusted
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const result = await model.generateContent(
        fullPrompt
        // { // If sending parts
        //   generationConfig,
        //   safetySettings
        // }
    );

    if (result.response && typeof result.response.text === 'function') {
      const text = result.response.text();
      if (text) {
        return text.replace("Generated Image Prompt:", "").trim(); // Clean up prefix if model includes it
      } else {
        const blockReason = result.response.promptFeedback?.blockReason;
        if (blockReason) {
            throw new Error(`Image prompt generation blocked. Reason: ${blockReason}.`);
        }
        const finishReason = result.response.candidates?.[0]?.finishReason;
         if (finishReason && finishReason !== "STOP") {
            throw new Error(`Image prompt generation stopped. Reason: ${finishReason}.`);
        }
        throw new Error("Received empty response from Gemini API for image prompt or content was blocked.");
      }
    } else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.response.candidates[0].content.parts[0].text.replace("Generated Image Prompt:", "").trim();
    }

    throw new Error("Could not extract text for image prompt from Gemini API response.");

  } catch (error: any) {
    console.error("Error calling Gemini API (generateImagePromptForText):", error);
    const serviceError = new Error(`Gemini API Error for Image Prompt: ${error.message || 'Unknown error'}`) as GeminiServiceError;
    if (error.message && (error.message.includes("API key not valid") || error.message.includes("API key invalid"))) {
      serviceError.isApiKeyInvalid = true;
    }
    throw serviceError;
  }
}
