import { generateBlogContent, generateImagePromptForText } from './geminiService';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Mock the @google/generative-ai library
jest.mock('@google/generative-ai', () => {
  // Mock the specific classes and methods used
  const mockGenerateContent = jest.fn();
  const mockGetGenerativeModel = jest.fn(() => ({
    generateContent: mockGenerateContent,
  }));
  const mockGoogleGenerativeAI = jest.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  }));

  return {
    GoogleGenerativeAI: mockGoogleGenerativeAI,
    HarmCategory: { // Include actual enum values if they are used directly in tests, otherwise mock them
        HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
        HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
        HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
    },
    HarmBlockThreshold: { // Same for enums
        BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE",
    },
  };
});

// Helper to access mocked functions for assertions
const mockGoogleGenerativeAI = GoogleGenerativeAI as jest.Mock;
const mockGetGenerativeModel = mockGoogleGenerativeAI.mock.results[0]?.value.getGenerativeModel;
const mockGenerateContent = mockGetGenerativeModel?.mock.results[0]?.value.generateContent;


describe('Gemini Service', () => {
  const ENV_API_KEY = 'test_env_api_key';
  const LS_API_KEY = 'test_ls_api_key';
  const MOCK_PROMPT = 'Test prompt';

  let originalEnv: NodeJS.ProcessEnv;
  let localStorageMock: Storage;

  beforeEach(() => {
    jest.clearAllMocks();
    originalEnv = { ...process.env }; // Backup original process.env

    // Mock localStorage
    localStorageMock = (function () {
      let store: { [key: string]: string } = {};
      return {
        getItem: function (key: string) {
          return store[key] || null;
        },
        setItem: function (key: string, value: string) {
          store[key] = value.toString();
        },
        removeItem: function (key: string) {
          delete store[key];
        },
        clear: function () {
          store = {};
        },
        length: 0, // Add length property
        key: function (index: number) { // Add key method
            return Object.keys(store)[index] || null;
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original process.env
    localStorageMock.clear();
  });

  describe('API Key Retrieval Logic (Implicitly tested via service functions)', () => {
    it('should use localStorage API key if available', async () => {
      localStorageMock.setItem('geminiApiKey', LS_API_KEY);
      process.env.REACT_APP_GEMINI_API_KEY = ENV_API_KEY; // Set env key too

      mockGenerateContent?.mockResolvedValueOnce({ response: { text: () => 'Success' } });
      await generateBlogContent(MOCK_PROMPT);
      expect(mockGoogleGenerativeAI).toHaveBeenCalledWith(LS_API_KEY);
    });

    it('should use environment variable API key if localStorage is empty', async () => {
      localStorageMock.removeItem('geminiApiKey');
      process.env.REACT_APP_GEMINI_API_KEY = ENV_API_KEY;

      mockGenerateContent?.mockResolvedValueOnce({ response: { text: () => 'Success' } });
      await generateBlogContent(MOCK_PROMPT);
      expect(mockGoogleGenerativeAI).toHaveBeenCalledWith(ENV_API_KEY);
    });

    it('should use override API key if provided, ignoring localStorage and env', async () => {
        localStorageMock.setItem('geminiApiKey', LS_API_KEY);
        process.env.REACT_APP_GEMINI_API_KEY = ENV_API_KEY;
        const overrideKey = "override_key_123";

        mockGenerateContent?.mockResolvedValueOnce({ response: { text: () => 'Success' } });
        await generateBlogContent(MOCK_PROMPT, overrideKey);
        expect(mockGoogleGenerativeAI).toHaveBeenCalledWith(overrideKey);
      });


    it('should throw error if no API key is found', async () => {
      localStorageMock.removeItem('geminiApiKey');
      delete process.env.REACT_APP_GEMINI_API_KEY; // Ensure it's deleted

      await expect(generateBlogContent(MOCK_PROMPT)).rejects.toMatchObject({
        message: expect.stringContaining("API key is missing."),
        isApiKeyInvalid: true,
      });
    });
  });

  describe('generateBlogContent', () => {
    it('should return generated text on successful API call', async () => {
      localStorageMock.setItem('geminiApiKey', LS_API_KEY);
      const mockResponseText = 'Generated blog content here.';
      mockGenerateContent?.mockResolvedValueOnce({ response: { text: () => mockResponseText } });

      const result = await generateBlogContent(MOCK_PROMPT);
      expect(result).toBe(mockResponseText);
      expect(mockGenerateContent).toHaveBeenCalledWith(MOCK_PROMPT);
    });

    it('should handle API error and set isApiKeyInvalid if message indicates it', async () => {
      localStorageMock.setItem('geminiApiKey', LS_API_KEY);
      const apiError = new Error('API key not valid. Please pass a valid API key.');
      mockGenerateContent?.mockRejectedValueOnce(apiError);

      await expect(generateBlogContent(MOCK_PROMPT)).rejects.toMatchObject({
        message: expect.stringContaining('API key not valid'),
        isApiKeyInvalid: true,
      });
    });

    it('should handle generic API error', async () => {
      localStorageMock.setItem('geminiApiKey', LS_API_KEY);
      const apiError = new Error('Network error');
      mockGenerateContent?.mockRejectedValueOnce(apiError);

      await expect(generateBlogContent(MOCK_PROMPT)).rejects.toMatchObject({
        message: expect.stringContaining('Network error'),
        isApiKeyInvalid: undefined, // Should not be set for generic errors
      });
    });

    it('should handle content blockage', async () => {
        localStorageMock.setItem('geminiApiKey', LS_API_KEY);
        mockGenerateContent?.mockResolvedValueOnce({
            response: {
                text: () => '', // Empty text
                promptFeedback: { blockReason: 'SAFETY' }
            }
        });
        await expect(generateBlogContent(MOCK_PROMPT)).rejects.toThrow(/Content generation blocked. Reason: SAFETY/);
    });

    it('should handle finish reason other than STOP', async () => {
        localStorageMock.setItem('geminiApiKey', LS_API_KEY);
        mockGenerateContent?.mockResolvedValueOnce({
            response: {
                text: () => '',
                candidates: [{ finishReason: 'MAX_TOKENS' }]
            }
        });
        await expect(generateBlogContent(MOCK_PROMPT)).rejects.toThrow(/Content generation stopped. Reason: MAX_TOKENS/);
    });

    it('should handle empty response or unexpected structure', async () => {
        localStorageMock.setItem('geminiApiKey', LS_API_KEY);
        mockGenerateContent?.mockResolvedValueOnce({ response: {} }); // No text() function or candidates
        await expect(generateBlogContent(MOCK_PROMPT)).rejects.toThrow(/Could not extract text from Gemini API response/);
    });
  });

  describe('generateImagePromptForText', () => {
    const MOCK_TEXT_INPUT = "Some blog text for image prompt.";
    it('should return generated image prompt on successful API call', async () => {
      localStorageMock.setItem('geminiApiKey', LS_API_KEY);
      const mockResponseText = 'Detailed image prompt.';
      // Ensure the mock is for the correct call if generateContent is used multiple times
      mockGenerateContent?.mockResolvedValueOnce({ response: { text: () => mockResponseText } });

      const result = await generateImagePromptForText(MOCK_TEXT_INPUT);
      expect(result).toBe(mockResponseText.replace("Generated Image Prompt:", "").trim());
      expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining(MOCK_TEXT_INPUT.substring(0,1500)));
    });

    // Similar error handling tests as for generateBlogContent can be added here
    it('should handle API error for image prompt and set isApiKeyInvalid if applicable', async () => {
      localStorageMock.setItem('geminiApiKey', LS_API_KEY);
      const apiError = new Error('API key not valid for image prompt.');
      mockGenerateContent?.mockRejectedValueOnce(apiError);

      await expect(generateImagePromptForText(MOCK_TEXT_INPUT)).rejects.toMatchObject({
        message: expect.stringContaining('API key not valid for image prompt.'),
        isApiKeyInvalid: true, // This relies on the error message containing "API key not valid" or similar
      });
    });

    it('should handle generic API error for image prompt', async () => {
      localStorageMock.setItem('geminiApiKey', LS_API_KEY);
      const apiError = new Error('Image prompt network error');
      mockGenerateContent?.mockRejectedValueOnce(apiError);

      await expect(generateImagePromptForText(MOCK_TEXT_INPUT)).rejects.toMatchObject({
        message: expect.stringContaining('Image prompt network error'),
        isApiKeyInvalid: undefined,
      });
    });

    it('should handle content blockage for image prompt', async () => {
        localStorageMock.setItem('geminiApiKey', LS_API_KEY);
        mockGenerateContent?.mockResolvedValueOnce({
            response: {
                text: () => '',
                promptFeedback: { blockReason: 'SAFETY_IMG' }
            }
        });
        await expect(generateImagePromptForText(MOCK_TEXT_INPUT)).rejects.toThrow(/Image prompt generation blocked. Reason: SAFETY_IMG/);
    });

    it('should throw error if no API key is found for image prompt', async () => {
        localStorageMock.removeItem('geminiApiKey');
        delete process.env.REACT_APP_GEMINI_API_KEY;

        await expect(generateImagePromptForText(MOCK_TEXT_INPUT)).rejects.toMatchObject({
          message: expect.stringContaining("API key is missing for image prompt generation."),
          isApiKeyInvalid: true,
        });
      });
  });
});
