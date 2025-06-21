// import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// This file is modified to use the WordPress REST API proxy instead of direct calls to GoogleGenerativeAI

const DEFAULT_MODEL_NAME = "gemini-pro";

interface GeminiServiceError extends Error {
  status?: number;
  isApiKeyInvalid?: boolean; // Indicates if the error is due to missing/invalid API key in WP settings
  details?: any; // To store additional error details from the proxy
}

// Access WordPress localized data
// Ensure fluxSeoAppData is available globally when this script runs in WordPress
declare global {
  interface Window {
    fluxSeoAppData: {
      rest_url: string;
      nonce: string;
      proxy_endpoint: string;
    };
  }
}

const getProxyEndpoint = (): string => {
  if (window.fluxSeoAppData && window.fluxSeoAppData.proxy_endpoint) {
    return window.fluxSeoAppData.proxy_endpoint;
  }
  // Fallback or error if not defined, though it should be by wp_localize_script
  console.error("Flux SEO: WordPress proxy endpoint not defined in fluxSeoAppData.");
  return "/wp-json/flux-seo/v1/gemini-proxy"; // Should not happen
};

const getWordPressNonce = (): string => {
  if (window.fluxSeoAppData && window.fluxSeoAppData.nonce) {
    return window.fluxSeoAppData.nonce;
  }
  console.error("Flux SEO: WordPress REST API nonce not defined in fluxSeoAppData.");
  return ""; // Should not happen
};

async function callWordPressProxy(payload: object): Promise<any> {
  const endpoint = getProxyEndpoint();
  const nonce = getWordPressNonce();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce, // WordPress REST API Nonce
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || `HTTP error! status: ${response.status}`) as GeminiServiceError;
      error.status = response.status;
      error.details = responseData.data || responseData; // Store additional details if provided by WP_Error
      if (responseData.code === 'missing_api_key' || response.status === 401 || response.status === 403) {
        error.isApiKeyInvalid = true;
      }
      throw error;
    }
    return responseData; // This is the response from the Gemini API, proxied through WP

  } catch (error: any) {
    console.error("Error calling WordPress Gemini Proxy:", error);
    // Re-throw as a GeminiServiceError or a more specific error type
    const serviceError = new Error(`WordPress Proxy Error: ${error.message || 'Unknown error'}`) as GeminiServiceError;
    if (error.isApiKeyInvalid) serviceError.isApiKeyInvalid = true;
    if (error.status) serviceError.status = error.status;
    if (error.details) serviceError.details = error.details;
    throw serviceError;
  }
}


export async function generateBlogContent(prompt: string, _apiKeyOverride?: string): Promise<string> {
  // apiKeyOverride is no longer used as the key is handled server-side by WordPress
  const payload = {
    model: DEFAULT_MODEL_NAME, // The proxy can decide which model or this can be passed
    prompt: prompt, // Kept for simplicity, proxy will structure it into 'contents'
    // Or structure it directly here if the proxy expects full 'contents' format:
    // contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
    // Safety settings could be passed to the proxy if it's designed to handle them,
    // or the proxy applies default safety settings. For now, assuming proxy handles defaults.
  };

  try {
    const proxyResponse = await callWordPressProxy(payload);
    // Assuming the proxy returns the Gemini API's structure,
    // we need to extract the text similarly to how it was done before.
    if (proxyResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return proxyResponse.candidates[0].content.parts[0].text;
    } else if (proxyResponse?.text) { // Simpler direct text response from proxy (less likely for full Gemini structure)
        return proxyResponse.text;
    }
    // Handle cases where content might be blocked or response structure is different
    const blockReason = proxyResponse?.promptFeedback?.blockReason;
    if (blockReason) {
        throw new Error(`Content generation blocked via proxy. Reason: ${blockReason}.`);
    }
    const finishReason = proxyResponse?.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== "STOP") {
       throw new Error(`Content generation stopped via proxy. Reason: ${finishReason}.`);
    }
    throw new Error("Could not extract text from proxied Gemini API response.");

  } catch (error: any) {
    // The error from callWordPressProxy should already be a GeminiServiceError
    // but ensure it's propagated correctly.
    console.error("Error in generateBlogContent via proxy:", error);
    if (error instanceof Error) { // Check if it's an error object
        const serviceError = error as GeminiServiceError;
        // If not already a GeminiServiceError, wrap it
        if (!serviceError.isApiKeyInvalid && (serviceError.message.includes("API key") || serviceError.message.includes("Unauthenticated"))) {
            serviceError.isApiKeyInvalid = true;
        }
        throw serviceError;
    }
    throw new Error(`Unknown error in generateBlogContent: ${error}`);
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
    _apiKeyOverride?: string // No longer used
): Promise<string> {
    const payload = {
        model: "gemini-pro", // Or a chat-specific model if preferred
        contents: [ // Construct the full 'contents' array including history and new prompt
            ...chatHistory,
            { role: "user", parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
        },
        // Safety settings: Assuming proxy handles or applies defaults
    };

    try {
        const proxyResponse = await callWordPressProxy(payload);

        if (proxyResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return proxyResponse.candidates[0].content.parts[0].text;
        }
        const blockReason = proxyResponse?.promptFeedback?.blockReason;
        if (blockReason) {
            throw new Error(`Chatbot response blocked via proxy. Reason: ${blockReason}.`);
        }
        const finishReason = proxyResponse?.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== "STOP") {
           throw new Error(`Chatbot response stopped via proxy. Reason: ${finishReason}.`);
       }
       throw new Error("Could not extract text for chatbot response from proxied Gemini API.");

    } catch (error: any) {
        console.error("Error in getChatbotResponse via proxy:", error);
        if (error instanceof Error) {
            const serviceError = error as GeminiServiceError;
            if (!serviceError.isApiKeyInvalid && (serviceError.message.includes("API key") || serviceError.message.includes("Unauthenticated"))) {
                serviceError.isApiKeyInvalid = true;
            }
            throw serviceError;
        }
        throw new Error(`Unknown error in getChatbotResponse: ${error}`);
    }
}

export async function generateImagePromptForText(textInput: string, _apiKeyOverride?: string): Promise<string> {
    const fullPromptForImage = `Based on the following text, generate a detailed and creative prompt for a text-to-image generation model.
The image prompt should be descriptive, specifying the subject, style (e.g., photorealistic, watercolor, cartoonish, abstract), mood (e.g., inspiring, serene, energetic, mysterious), composition, and any key elements or colors that would make the image compelling and relevant to the text.

Input Text:
---
${textInput.substring(0, 1500)}
---
Generated Image Prompt:`;

    const payload = {
        model: DEFAULT_MODEL_NAME,
        // The proxy expects 'prompt' or 'contents'. Let's use 'contents' for consistency.
        contents: [{ parts: [{ text: fullPromptForImage }] }],
        generationConfig: {
            temperature: 0.8,
            topK: 1,
            topP: 1,
            maxOutputTokens: 200,
        },
    };

    try {
        const proxyResponse = await callWordPressProxy(payload);

        if (proxyResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return proxyResponse.candidates[0].content.parts[0].text.replace("Generated Image Prompt:", "").trim();
        }
        const blockReason = proxyResponse?.promptFeedback?.blockReason;
        if (blockReason) {
            throw new Error(`Image prompt generation blocked via proxy. Reason: ${blockReason}.`);
        }
        const finishReason = proxyResponse?.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== "STOP") {
           throw new Error(`Image prompt generation stopped via proxy. Reason: ${finishReason}.`);
        }
        throw new Error("Could not extract text for image prompt from proxied Gemini API response.");

    } catch (error: any) {
        console.error("Error in generateImagePromptForText via proxy:", error);
         if (error instanceof Error) {
            const serviceError = error as GeminiServiceError;
            if (!serviceError.isApiKeyInvalid && (serviceError.message.includes("API key") || serviceError.message.includes("Unauthenticated"))) {
                serviceError.isApiKeyInvalid = true;
            }
            throw serviceError;
        }
        throw new Error(`Unknown error in generateImagePromptForText: ${error}`);
    }
}
