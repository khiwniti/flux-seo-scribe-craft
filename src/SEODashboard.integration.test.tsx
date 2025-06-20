import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SEODashboard from './components/SEODashboard'; // Adjust path as needed
import { useToast } from '@/hooks/use-toast'; // Mock if SEODashboard or its children use it

// Mock lucide-react icons globally for tests if not done elsewhere
jest.mock('lucide-react', () => {
  const original = jest.requireActual('lucide-react');
  return {
    ...original,
    // Mock specific icons used by SEODashboard and its children if they cause issues
    // or if you want to simplify the DOM snapshot for tests.
    // Example:
    Zap: () => <div data-testid="zap-icon" />,
    Search: () => <div data-testid="search-icon" />,
    FileText: () => <div data-testid="filetext-icon" />,
    BarChart3: () => <div data-testid="barchart3-icon" />,
    Target: () => <div data-testid="target-icon" />,
    Globe: () => <div data-testid="globe-icon" />,
    Code: () => <div data-testid="code-icon" />,
    Settings: () => <div data-testid="settings-icon" />,
    Trash2: () => <div data-testid="trash-icon" />, // From AdvancedSEOAnalytics
    Brain: () => <div data-testid="brain-icon" />, // From SmartFieldEnhancer (if it were part of a deeper integration test)
    Sparkles: () => <div data-testid="sparkles-icon" />,
    Wand2: () => <div data-testid="wand-icon" />,
  };
});

// Mock useToast if SEODashboard or AdvancedSEOAnalytics uses it directly or indirectly
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock 'natural' library as it's a dependency of SmartFieldEnhancer which might be part of AdvancedSEOAnalytics or other tabs
jest.mock('natural', () => ({
  TfIdf: jest.fn().mockImplementation(() => ({
    addDocument: jest.fn(),
    listTerms: jest.fn().mockReturnValue([]),
    tfidf: jest.fn().mockReturnValue(0),
  })),
  PorterStemmer: {},
  SentimentAnalyzer: jest.fn().mockImplementation(() => ({
    getSentiment: jest.fn().mockReturnValue(0),
  })),
  WordTokenizer: jest.fn().mockImplementation(() => ({
    tokenize: jest.fn().mockImplementation((text) => text ? text.split(/\s+/) : []),
  })),
  NGrams: {
    bigrams: jest.fn().mockReturnValue([]),
    trigrams: jest.fn().mockReturnValue([]),
  }
}));


describe('SEODashboard Integration Tests', () => {
  const mockToastFn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToastFn });
  });

  test('navigates to "Analytics" tab and renders AdvancedSEOAnalytics component', async () => {
    render(<SEODashboard />);

    // SEODashboard starts on the "analyzer" tab by default.
    // Find the "Analytics" tab trigger. The text might be split on small screens.
    // We can look for the BarChart3 icon or the text "Analytics".
    const analyticsTabTrigger = screen.getByRole('tab', { name: /Analytics/i });
    expect(analyticsTabTrigger).toBeInTheDocument();

    // Click the "Analytics" tab
    fireEvent.click(analyticsTabTrigger);

    // Wait for the AdvancedSEOAnalytics component to be visible
    // Check for its unique title
    await waitFor(() => {
      expect(screen.getByText('Advanced SEO Analytics & Strategy Hub')).toBeInTheDocument();
    });

    // Also check if a known element from AdvancedSEOAnalytics's first section is there
    expect(screen.getByText('1. Define Goals and Scope')).toBeInTheDocument();
  });

  test('basic interaction within AdvancedSEOAnalytics on Analytics tab', async () => {
    render(<SEODashboard />);

    const analyticsTabTrigger = screen.getByRole('tab', { name: /Analytics/i });
    fireEvent.click(analyticsTabTrigger);

    await waitFor(() => {
      expect(screen.getByText('Advanced SEO Analytics & Strategy Hub')).toBeInTheDocument();
    });

    // Now interact with the AdvancedSEOAnalytics component
    // Open the "Keyword Research and Scoring" accordion
    const keywordSectionTrigger = screen.getByText('2. Keyword Research and Scoring');
    fireEvent.click(keywordSectionTrigger);

    // Add a keyword using the textarea
    const keywordsTextarea = await screen.findByLabelText<HTMLTextAreaElement>(/Enter Keywords \(one per line\)/i);
    await userEvent.type(keywordsTextarea, "integration test keyword");

    const addButton = screen.getByRole('button', { name: /Add Keywords to Table/i });
    fireEvent.click(addButton);

    // Verify the keyword appears in the table
    await waitFor(() => {
      expect(screen.getByDisplayValue('integration test keyword')).toBeInTheDocument();
    });

    // Check its default score (should be 30.00 as other fields are empty)
    const rowWithKeyword = screen.getByDisplayValue('integration test keyword').closest('tr');
    if (!rowWithKeyword) throw new Error('Keyword row not found for integration test');
    expect(within(rowWithKeyword).getByText("30.00")).toBeInTheDocument();
  });

  test('navigates to Settings tab and renders SettingsTab component', async () => {
    render(<SEODashboard />);
    const settingsTabTrigger = screen.getByRole('tab', { name: /Settings/i });
    expect(settingsTabTrigger).toBeInTheDocument();

    fireEvent.click(settingsTabTrigger);

    await waitFor(() => {
      expect(screen.getByText(/API Key Management/i)).toBeInTheDocument(); // Title of SettingsTab
    });
    expect(screen.getByLabelText(/Google Gemini API Key/i)).toBeInTheDocument();
  });

  describe('API Key Workflow Integration Test', () => {
    let localStorageMock: Storage;

    beforeEach(() => {
      // Setup localStorage mock for this describe block
      localStorageMock = (function () {
        let store: { [key: string]: string } = {};
        return {
          getItem: jest.fn((key: string) => store[key] || null),
          setItem: jest.fn((key: string, value: string) => { store[key] = value.toString(); }),
          removeItem: jest.fn((key: string) => { delete store[key]; }),
          clear: jest.fn(() => { store = {}; }),
          length: 0,
          key: jest.fn(),
        };
      })();
      Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

      // Clear any environment variable for this specific test suite to ensure localStorage is prioritized or tested as missing
      delete process.env.REACT_APP_GEMINI_API_KEY;
    });

    afterEach(() => {
        localStorageMock.clear(); // Clear after each test in this block
         // Restore process.env if modified, though it's deleted here. Consider a more robust backup/restore if needed elsewhere.
    });

    test('shows API key error in BlogGenerator, then works after setting key in Settings', async () => {
      const { generateBlogContent } = jest.requireActual('@/lib/geminiService'); // Get actual for mocking specific implementation details
      const mockGenerateBlogContent = geminiService.generateBlogContent as jest.Mock;


      render(<SEODashboard />);

      // 1. Navigate to BlogGenerator (AI Generator Tab) - Assume it's "generator"
      const generatorTabTrigger = screen.getByRole('tab', { name: /AI Generator/i });
      fireEvent.click(generatorTabTrigger);

      // Wait for BlogGenerator to load (check for a unique element)
      await screen.findByLabelText(/Blog Topic/i);

      // Try to generate content - expect API key error because none is set
      mockGenerateBlogContent.mockImplementation(async () => {
        // Simulate the service throwing an API key error if no key is found by it
        const error: any = new Error("API key is missing. Please set it in Settings or as REACT_APP_GEMINI_API_KEY.");
        error.isApiKeyInvalid = true;
        throw error;
      });

      await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i), 'Initial Topic');
      fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

      await waitFor(() => {
        // Check for the API key error message displayed by BlogGenerator
        expect(screen.getByText(/API key is missing. Please set it in Settings/i)).toBeInTheDocument();
      });
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Content Generation Failed",
        description: expect.stringContaining("API key is missing."),
      }));

      // 2. Navigate to Settings tab
      const settingsTabTrigger = screen.getByRole('tab', { name: /Settings/i });
      fireEvent.click(settingsTabTrigger);
      await screen.findByText(/API Key Management/i);

      // 3. Enter and save API key
      const apiKeyInput = screen.getByLabelText<HTMLInputElement>(/Google Gemini API Key/i);
      const saveApiKeyButton = screen.getByRole('button', { name: /Save API Key/i });
      await userEvent.type(apiKeyInput, 'test_ls_api_key_123');
      fireEvent.click(saveApiKeyButton);

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('geminiApiKey', 'test_ls_api_key_123');
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({ title: 'API Key Saved' }));
      });

      // 4. Navigate back to BlogGenerator
      fireEvent.click(generatorTabTrigger);
      await screen.findByLabelText(/Blog Topic/i); // Wait for it to load

      // 5. Try to generate content again - this time it should succeed
      mockGenerateBlogContent.mockReset(); // Reset previous mock
      mockGenerateBlogContent.mockResolvedValueOnce("Successfully generated blog content with new key!");
      (geminiService.generateImagePromptForText as jest.Mock).mockResolvedValueOnce("Successful image prompt!");


      // Topic field might be reset or retain value depending on component structure, re-type if needed or ensure it persists
      // For this test, let's assume it persists or re-type for safety:
      await userEvent.clear(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i));
      await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i), 'New Topic with API Key');
      fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

      await waitFor(() => {
        expect(screen.getByText("Successfully generated blog content with new key!")).toBeInTheDocument();
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({ title: "Content Generated Successfully!" }));
      });
       await waitFor(() => {
        expect(screen.getByDisplayValue("Successful image prompt!")).toBeInTheDocument();
      });
      // Ensure no API key error is shown this time
      expect(screen.queryByText(/API key is missing. Please set it in Settings/i)).not.toBeInTheDocument();
    });

    test('Chatbot also works after API key is set in Settings', async () => {
      // This test assumes the API key has been set in localStorage by a previous step/test
      // or we can set it directly here for isolation if preferred.
      // For this flow, we'll assume the previous test in this describe block set the key.
      // If localStorageMock is not persisted across tests in the same describe, set it here.
      if (!localStorageMock.getItem('geminiApiKey')) { // Ensure key is set from previous test or set it now
        localStorageMock.setItem('geminiApiKey', 'test_ls_api_key_123');
      }

      const mockGetChatbotResponse = geminiService.getChatbotResponse as jest.Mock;
      mockGetChatbotResponse.mockResolvedValueOnce("Hello from the integrated chatbot!");

      render(<SEODashboard />);

      // Navigate to Chatbot tab
      const chatbotTabTrigger = screen.getByRole('tab', { name: /Chatbot/i });
      fireEvent.click(chatbotTabTrigger);
      await screen.findByText(/SEO Assistant Chatbot/i); // Wait for chatbot title

      // Interact with chatbot
      const chatInput = screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i);
      const sendChatButton = screen.getByRole('button', { name: /Send/i });

      await userEvent.type(chatInput, 'Hello chatbot');
      fireEvent.click(sendChatButton);

      await waitFor(() => {
        expect(screen.getByText('Hello chatbot')).toBeInTheDocument(); // User message
      });
      await waitFor(() => {
        expect(screen.getByText("Hello from the integrated chatbot!")).toBeInTheDocument(); // Bot response
      }, {timeout: 2000});

      // Verify no API key error is shown in chatbot either
      expect(screen.queryByText(/API key is missing. Please configure it in Settings./i)).not.toBeInTheDocument();
      expect(mockGetChatbotResponse).toHaveBeenCalledWith(
        expect.stringContaining("Hello chatbot"), // Prompt will include system message + user message
        expect.any(Array) // History
      );
    });
  });

  test('navigates to Chatbot tab and renders SEOChatbot component', async () => {
    render(<SEODashboard />);
    const chatbotTabTrigger = screen.getByRole('tab', { name: /Chatbot/i });
    expect(chatbotTabTrigger).toBeInTheDocument();

    fireEvent.click(chatbotTabTrigger);

    await waitFor(() => {
      expect(screen.getByText(/SEO Assistant Chatbot/i)).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText(/Ask about SEO.../i)).toBeInTheDocument();
  });

  test('basic interaction within SEOChatbot on Chatbot tab', async () => {
    const mockGetChatbotResponse = geminiService.getChatbotResponse as jest.Mock;
    mockGetChatbotResponse.mockResolvedValueOnce("Test bot response from dashboard.");

    // Ensure API key is available for this test, either via mock or actual localStorage setup if needed
    // For simplicity, we assume geminiService will find a key (e.g. from mock localStorage or env)
    // If not, this test might show API key error instead of expected interaction.
    // Let's ensure localStorage has a key for this test.
     Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: jest.fn(() => 'dummy_integration_key'), // Mock key present
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
            length: 0,
            key: jest.fn(),
        },
        writable: true
    });


    render(<SEODashboard />);

    const chatbotTabTrigger = screen.getByRole('tab', { name: /Chatbot/i });
    fireEvent.click(chatbotTabTrigger);

    await waitFor(() => {
      expect(screen.getByText(/SEO Assistant Chatbot/i)).toBeInTheDocument();
    });

    const chatInput = screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i);
    const sendChatButton = screen.getByRole('button', { name: /Send/i });

    await userEvent.type(chatInput, "Hello from integration test");
    fireEvent.click(sendChatButton);

    await waitFor(() => {
      expect(screen.getByText("Hello from integration test")).toBeInTheDocument(); // User message
    });
     await waitFor(() => {
      expect(screen.getByText("Test bot response from dashboard.")).toBeInTheDocument(); // Bot response
    }, {timeout: 2000});

    expect(mockGetChatbotResponse).toHaveBeenCalled();
  });
});
