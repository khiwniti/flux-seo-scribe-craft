import { makeWpAjaxRequest, WpAjaxError } from './wpApiService';

// Interfaces for the data structures if needed by calling components
// but the service itself will now primarily deal with what the WP AJAX expects.

export interface GeminiServiceError extends WpAjaxError {
  isApiKeyInvalid?: boolean; // This might become less relevant if WP always handles key issues
}

// Interface for the expected response from the backend for content generation
// (Matches the structure returned by call_gemini_api in PHP)
export interface GeneratedContentResponse {
  title: string;
  content: string; // HTML content
  meta_description: string;
  keywords: string; // Comma-separated
  seo_score: number;
}

// Interface for the expected response from the backend for content analysis
export interface ContentAnalysisResponse {
  seo_score: number;
  justification: string;
  readability_assessment: string;
  keyword_analysis: string;
  suggestions_list: string[];
  // Potentially other fields Gemini might be prompted to return
}

/**
 * Generates blog content by calling the WordPress backend.
 * The backend's 'flux_seo_generate_content' action will call the Gemini API.
 *
 * @param topic - The main topic for the content.
 * @param language - Language code (e.g., 'en').
 * @param contentType - Type of content (e.g., 'blog', 'article').
 * @param keywords - Comma-separated keywords.
 * @returns The generated content object.
 */
export async function generateBlogContent(
  topic: string,
  language: string,
  contentType: string, // e.g., 'blog', 'article'
  keywords: string
): Promise<GeneratedContentResponse> {
  try {
    // This function is now specifically for content types that expect GeneratedContentResponse structure
    if (contentType === 'content_analysis') {
      // Should not happen if called correctly, but as a safeguard:
      console.error("generateBlogContent called with contentType 'content_analysis'. Use analyzeContentWithGemini instead.");
      throw new Error("Misdirected API call: Use analyzeContentWithGemini for analysis.");
    }
    const responseData = await makeWpAjaxRequest<GeneratedContentResponse>({
      wpAjaxAction: 'flux_seo_generate_content',
      data: { topic, language, content_type: contentType, keywords },
    });
    return responseData;
  } catch (error: any) {
    console.error(`Error in generateBlogContent for contentType '${contentType}':`, error);
    // Enhance or re-throw the error if needed
    const serviceError = error as GeminiServiceError;
    // The backend now checks for API key validity. If wpSuccess is false and response indicates API key issue.
    if (error.wpSuccess === false && typeof error.response === 'string' && error.response.includes("API key not configured")) {
        serviceError.isApiKeyInvalid = true;
    }
    throw serviceError;
  }
}

/**
 * Performs content analysis by calling the WordPress backend.
 * The backend's 'flux_seo_generate_content' action (with contentType 'content_analysis')
 * will call the Gemini API.
 *
 * @param contentToAnalyze - The main text content to analyze.
 * @param language - Language code (e.g., 'en').
 * @param analysisContext - Optional context (e.g., title, existing keywords) for more accurate analysis.
 * @returns The analysis result object.
 */
export async function analyzeContentWithGemini(
  contentToAnalyze: string,
  language: string,
  analysisContext: string // Pass concatenated title, meta, keywords here
): Promise<ContentAnalysisResponse> {
  try {
    const responseData = await makeWpAjaxRequest<ContentAnalysisResponse>({
      wpAjaxAction: 'flux_seo_generate_content',
      data: {
        topic: contentToAnalyze, // The content itself is the 'topic' for this mode
        language,
        content_type: 'content_analysis',
        keywords: analysisContext, // Contextual keywords, title, meta
      },
    });
    return responseData;
  } catch (error: any) {
    console.error("Error calling WordPress backend for content analysis:", error);
    const serviceError = error as GeminiServiceError;
    if (error.wpSuccess === false && typeof error.response === 'string' && error.response.includes("API key not configured")) {
        serviceError.isApiKeyInvalid = true;
    }
    throw serviceError;
  }
}

// For SEOChatbot - simplified to align with current backend
export interface ChatHistoryMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

/**
 * Gets a chatbot response by calling the WordPress backend.
 * Note: Current backend 'flux_seo_generate_content' is not designed for chat history.
 * This function sends the userPrompt as the 'topic' and a specific 'content_type'.
 * Chat history is NOT currently passed to the backend.
 *
 * @param userPrompt - The user's message to the chatbot.
 * @param chatHistory - The current chat history (currently ignored by backend).
 * @returns The chatbot's response text (as part of GeneratedContentResponse.content).
 */
export async function getChatbotResponse(
    userPrompt: string,
    // chatHistory: ChatHistoryMessage[] // chatHistory is not used by current backend endpoint
): Promise<string> {
    try {
        // Adapting to the existing 'flux_seo_generate_content' endpoint
        // The backend will treat userPrompt as the main 'topic' for content generation
        const responseData = await makeWpAjaxRequest<GeneratedContentResponse>({
            wpAjaxAction: 'flux_seo_generate_content',
            data: {
                topic: userPrompt,
                language: 'en', // Or make this configurable if needed for chatbot
                content_type: 'chatbot_response', // Special type for backend to potentially handle differently
                keywords: '', // Keywords might not be relevant for a direct chat response
            },
        });
        // The backend's GeneratedContentResponse has a 'content' field.
        // We assume this 'content' field will hold the chatbot's text response.
        return responseData.content;
    } catch (error: any) {
        console.error("Error calling WordPress backend for chatbot response:", error);
        const serviceError = error as GeminiServiceError;
        if (error.wpSuccess === false && typeof error.response === 'string' && error.response.includes("API key not configured")) {
            serviceError.isApiKeyInvalid = true;
        }
        throw serviceError;
    }
}


/**
 * Generates an image prompt by calling the WordPress backend.
 * The backend's 'flux_seo_generate_content' action will be used,
 * with a specific content_type to indicate image prompt generation.
 *
 * @param textInput - The text based on which an image prompt should be generated.
 * @returns The generated image prompt string (as part of GeneratedContentResponse.content).
 */
export async function generateImagePromptForText(textInput: string): Promise<string> {
  try {
    // Adapting to the existing 'flux_seo_generate_content' endpoint
    const responseData = await makeWpAjaxRequest<GeneratedContentResponse>({
      wpAjaxAction: 'flux_seo_generate_content',
      data: {
        topic: textInput, // The input text will be the basis for the prompt generation
        language: 'en', // Assuming image prompts are typically generated in English
        content_type: 'image_prompt_generation', // Special type for backend
        keywords: '', // Not typically relevant for this task
      },
    });
    // We assume the 'content' field of the response will contain the generated image prompt.
    return responseData.content;
  } catch (error: any) {
    console.error("Error calling WordPress backend for image prompt generation:", error);
    const serviceError = error as GeminiServiceError;
    if (error.wpSuccess === false && typeof error.response === 'string' && error.response.includes("API key not configured")) {
        serviceError.isApiKeyInvalid = true;
    }
    throw serviceError;
  }
}
