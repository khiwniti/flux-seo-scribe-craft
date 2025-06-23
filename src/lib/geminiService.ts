// Modified to work in both WordPress and standalone React environments

const DEFAULT_MODEL_NAME = "gemini-pro";

interface GeminiServiceError extends Error {
  status?: number;
  isApiKeyInvalid?: boolean;
  details?: any;
}

// Check if we're in WordPress environment
const isWordPressEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
         !!window.fluxSeoAppData && 
         !!window.fluxSeoAppData.proxy_endpoint;
};

// Access WordPress localized data (only in WordPress)
declare global {
  interface Window {
    fluxSeoAppData?: {
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
  throw new Error("WordPress proxy endpoint not available");
};

const getWordPressNonce = (): string => {
  if (window.fluxSeoAppData && window.fluxSeoAppData.nonce) {
    return window.fluxSeoAppData.nonce;
  }
  throw new Error("WordPress REST API nonce not available");
};

async function callWordPressProxy(payload: object): Promise<any> {
  const endpoint = getProxyEndpoint();
  const nonce = getWordPressNonce();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || `HTTP error! status: ${response.status}`) as GeminiServiceError;
      error.status = response.status;
      error.details = responseData.data || responseData;
      if (responseData.code === 'missing_api_key' || response.status === 401 || response.status === 403) {
        error.isApiKeyInvalid = true;
      }
      throw error;
    }
    return responseData;

  } catch (error: any) {
    console.error("Error calling WordPress Gemini Proxy:", error);
    const serviceError = new Error(`WordPress Proxy Error: ${error.message || 'Unknown error'}`) as GeminiServiceError;
    if (error.isApiKeyInvalid) serviceError.isApiKeyInvalid = true;
    if (error.status) serviceError.status = error.status;
    if (error.details) serviceError.details = error.details;
    throw serviceError;
  }
}

// Fallback for standalone React environment
async function generateContentFallback(prompt: string): Promise<string> {
  // This is a fallback for when not in WordPress environment
  // In a real implementation, you might want to:
  // 1. Use direct API calls to Gemini (requires API key in frontend - not recommended)
  // 2. Call your own backend API
  // 3. Show a message asking user to configure API
  
  throw new Error("Content generation requires WordPress environment with configured API key. Please ensure you're using this in a WordPress site with the Flux SEO plugin installed and API key configured.");
}

export async function generateBlogContent(prompt: string, _apiKeyOverride?: string): Promise<string> {
  // Check if we're in WordPress environment
  if (!isWordPressEnvironment()) {
    return generateContentFallback(prompt);
  }

  const payload = {
    model: DEFAULT_MODEL_NAME,
    prompt: prompt,
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
  };

  try {
    const proxyResponse = await callWordPressProxy(payload);
    
    if (proxyResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return proxyResponse.candidates[0].content.parts[0].text;
    } else if (proxyResponse?.text) {
      return proxyResponse.text;
    }
    
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
    console.error("Error in generateBlogContent via proxy:", error);
    if (error instanceof Error) {
      const serviceError = error as GeminiServiceError;
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
  _apiKeyOverride?: string
): Promise<string> {
  if (!isWordPressEnvironment()) {
    throw new Error("Chatbot requires WordPress environment with configured API key.");
  }

  const payload = {
    model: "gemini-pro",
    contents: [
      ...chatHistory,
      { role: "user", parts: [{ text: userPrompt }] }
    ],
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
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
  if (!isWordPressEnvironment()) {
    throw new Error("Image prompt generation requires WordPress environment with configured API key.");
  }

  const fullPromptForImage = `Based on the following text, generate a detailed and creative prompt for a text-to-image generation model.
The image prompt should be descriptive, specifying the subject, style (e.g., photorealistic, watercolor, cartoonish, abstract), mood (e.g., inspiring, serene, energetic, mysterious), composition, and any key elements or colors that would make the image compelling and relevant to the text.

Input Text:
---
${textInput.substring(0, 1500)}
---
Generated Image Prompt:`;

  const payload = {
    model: DEFAULT_MODEL_NAME,
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
