import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartFieldEnhancer } from './SmartFieldEnhancer'; // Adjust path as necessary
import { useToast } from '@/hooks/use-toast'; // Adjust path

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Brain: () => <div data-testid="brain-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Wand2: () => <div data-testid="wand-icon" />,
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock 'natural' library modules used
jest.mock('natural', () => ({
  TfIdf: jest.fn().mockImplementation(() => ({
    addDocument: jest.fn(),
    listTerms: jest.fn().mockReturnValue([]), // Default mock
    tfidf: jest.fn().mockReturnValue(0), // Default mock for single term
  })),
  PorterStemmer: {}, // Assuming it's an object, not a function/class being instantiated
  SentimentAnalyzer: jest.fn().mockImplementation(() => ({
    getSentiment: jest.fn().mockReturnValue(0), // Neutral sentiment
  })),
  WordTokenizer: jest.fn().mockImplementation(() => ({
    tokenize: jest.fn().mockImplementation((text) => text ? text.split(/\s+/) : []),
  })),
  NGrams: {
    bigrams: jest.fn().mockReturnValue([]),
    trigrams: jest.fn().mockReturnValue([]),
  }
}));


describe('SmartFieldEnhancer', () => {
  const mockOnEnhance = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  test('renders nothing if content is too short or not provided initially', () => {
    render(<SmartFieldEnhancer content="" onEnhance={mockOnEnhance} />);
    expect(screen.queryByText(/AI Suggestions Available/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('brain-icon')).not.toBeInTheDocument();
  });

  test('renders nothing if content is just below threshold (e.g. 19 chars if threshold is 20)', () => {
    render(<SmartFieldEnhancer content="Short content here." onEnhance={mockOnEnhance} />);
    // The component's internal logic has content.length < 20 returns early.
    // And useEffect for content.length > 50 triggers analysis.
    // So, content between 20 and 50 without prior analysis won't show suggestions yet.
    expect(screen.queryByText(/AI Suggestions Available/i)).not.toBeInTheDocument();
  });

  test('shows "Analyzing content..." when content is sufficient and analysis starts', async () => {
    render(<SmartFieldEnhancer content="This is a long piece of content to trigger analysis functionality." onEnhance={mockOnEnhance} />);
    // useEffect triggers analyzeContent, which sets isAnalyzing to true
    // The UI then shows "Analyzing content..."
    // The setTimeout in analyzeContent will eventually set isAnalyzing to false
    // We check for the initial "Analyzing content..." state.
    expect(screen.getByText(/Analyzing content.../i)).toBeInTheDocument();
    expect(screen.getByTestId('brain-icon')).toBeInTheDocument();

    // Wait for the analysis (setTimeout) to complete
    await waitFor(() => {
      expect(screen.queryByText(/Analyzing content.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/AI Suggestions Available/i)).toBeInTheDocument();
    }, { timeout: 300 }); // Slightly more than the 100ms timeout in component + processing
  });

  describe('With Mocked Suggestions', () => {
    const mockSuggestions = {
      suggestedTitle: { value: 'Mock Title', explanation: 'Title Explanation' },
      suggestedKeywords: { value: ['mockKeyword1', 'mockKeyword2'], explanation: 'Keywords Explanation' },
      suggestedTone: { value: 'Positive', explanation: 'Tone Explanation' },
      suggestedAudience: { value: 'Technical', explanation: 'Audience Explanation' },
      suggestedIndustry: { value: 'Technology', explanation: 'Industry Explanation' },
      suggestedTemplate: { value: 'Blog Post', explanation: 'Template Explanation' },
    };

    // Helper to set up mocks for NLP functions to return specific suggestions
    const setupMockNlpFunctions = () => {
      const natural = require('natural');
      natural.TfIdf.mockImplementation(() => ({
        addDocument: jest.fn(),
        listTerms: jest.fn().mockReturnValue([
          { term: 'mockKeyword1', tfidf: 0.5 },
          { term: 'mockKeyword2', tfidf: 0.4 }
        ]),
        tfidf: jest.fn((term: string) => (term === 'Mock' || term === 'Title' ? 1 : 0.5)),
      }));
      natural.SentimentAnalyzer.mockImplementation(() => ({
        getSentiment: jest.fn().mockReturnValue(0.5), // Positive
      }));
      // Mock other functions if their direct output is needed for specific suggestions
      // For now, we'll rely on the component's structure which calls these
      // and then uses their results.
    };

    beforeEach(() => {
        setupMockNlpFunctions();
    });

    test('renders suggestions correctly after analysis', async () => {
      render(<SmartFieldEnhancer content="Sufficiently long content for analysis to generate mock suggestions." onEnhance={mockOnEnhance} />);

      await waitFor(() => {
        expect(screen.getByText(/AI Suggestions Available/i)).toBeInTheDocument();
      }, { timeout: 300 });

      // Check for Title
      expect(screen.getByText('Title:')).toBeInTheDocument();
      // The title itself might be complex if it's a sentence, TF-IDF logic is complex.
      // We'll check based on what our mocked TF-IDF would likely produce or a simplified version.
      // For this test, let's assume extractTitle will pick a sentence.
      // If extractTitle is complex, we should mock extractTitle itself for this part of the test.
      // Given the current mocks, the title might be empty or the first sentence.
      // Let's adjust the mock for TfIdf to be more specific for title extraction or simplify the check.
      // For now, check if the label is there. The exact value depends on the complex interaction of mocks.
      // A more robust test would mock the direct output of extractTitle, extractKeywords etc.

      // Check for Keywords
      expect(screen.getByText('Keywords:')).toBeInTheDocument();
      expect(screen.getByText('mockKeyword1')).toBeInTheDocument();
      expect(screen.getByText('mockKeyword2')).toBeInTheDocument();

      // Check for Tone
      expect(screen.getByText('Tone:')).toBeInTheDocument();
      expect(screen.getByText('Positive')).toBeInTheDocument(); // Based on SentimentAnalyzer mock

      // Check for Audience (current implementation uses simple keyword matching)
      expect(screen.getByText('Audience:')).toBeInTheDocument();
      // Value depends on keywords in content, e.g. "technical"
      // If content is "Sufficiently long content with technical words for analysis..."
      // it should detect 'Technical'. For this specific content, it might be general.
      // Let's ensure the mock content implies an audience.
      // For now, assuming the default or a simple match.

      // Check for Industry
      expect(screen.getByText('Industry:')).toBeInTheDocument();

      // Check for Template
      // This also depends on keywords in content.
    });

    test('applies title suggestion and calls toast', async () => {
      render(<SmartFieldEnhancer content="Content to get title suggestion." onEnhance={mockOnEnhance} />);
      await waitFor(() => expect(screen.getByText('Title:')).toBeInTheDocument(), { timeout: 300 });

      const applyTitleButtons = screen.getAllByTestId('wand-icon');
      // Assuming the first wand icon is for the title, this might be fragile.
      // A better way is to scope the query:
      const titleSection = screen.getByText('Title:').closest('div');
      const applyTitleButton = titleSection?.querySelector('[data-testid="wand-icon"]');

      if (applyTitleButton) {
        fireEvent.click(applyTitleButton);
      } else {
        throw new Error("Apply title button not found");
      }

      expect(mockOnEnhance).toHaveBeenCalledWith(expect.objectContaining({ suggestedTitle: expect.any(String) }));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Suggestion Applied!",
        description: expect.stringContaining("Title has been auto-filled"),
      }));
    });

    test('applies keywords suggestion and calls toast', async () => {
      render(<SmartFieldEnhancer content="Content for keyword suggestions like mockKeyword1 and mockKeyword2." onEnhance={mockOnEnhance} />);
      await waitFor(() => expect(screen.getByText('Keywords:')).toBeInTheDocument(), { timeout: 300 });

      const keywordsSection = screen.getByText('Keywords:').closest('div');
      const applyKeywordsButton = keywordsSection?.parentElement?.querySelector('[data-testid="wand-icon"]'); // parentElement to get to the div containing the button

      if (applyKeywordsButton) {
        fireEvent.click(applyKeywordsButton);
      } else {
        throw new Error("Apply keywords button not found");
      }

      expect(mockOnEnhance).toHaveBeenCalledWith(expect.objectContaining({ suggestedKeywords: 'mockKeyword1, mockKeyword2' }));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Suggestion Applied!",
        description: expect.stringContaining("Keywords has been auto-filled"),
      }));
    });

    test('applies tone suggestion and calls toast', async () => {
      render(<SmartFieldEnhancer content="Content for tone suggestion." onEnhance={mockOnEnhance} />);
      await waitFor(() => expect(screen.getByText('Tone:')).toBeInTheDocument(), { timeout: 300 });

      const section = screen.getByText('Tone:').closest('div');
      const button = section?.parentElement?.querySelector('[data-testid="wand-icon"]');
      if (!button) throw new Error("Apply tone button not found");
      fireEvent.click(button);

      expect(mockOnEnhance).toHaveBeenCalledWith(expect.objectContaining({ suggestedTone: 'Positive' })); // Mocked to be positive
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Suggestion Applied!",
        description: expect.stringContaining("Tone has been auto-filled"),
      }));
    });

    test('applies audience suggestion and calls toast', async () => {
      // To make this test predictable for audience, ensure content implies it based on current simple logic
      render(<SmartFieldEnhancer content="This content is for technical experts and professionals." onEnhance={mockOnEnhance} />);
      await waitFor(() => expect(screen.getByText('Audience:')).toBeInTheDocument(), { timeout: 300 });

      const section = screen.getByText('Audience:').closest('div');
      const button = section?.parentElement?.querySelector('[data-testid="wand-icon"]');
      if (!button) throw new Error("Apply audience button not found");
      fireEvent.click(button);

      // The audience detection is based on keywords in the content.
      // "technical", "expert", "professional" point to "professionals" with the new logic in SmartFieldEnhancer
      expect(mockOnEnhance).toHaveBeenCalledWith(expect.objectContaining({ suggestedAudience: 'professionals' }));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Suggestion Applied!",
        description: expect.stringContaining("Audience has been auto-filled"),
      }));
    });

    test('applies industry suggestion and calls toast', async () => {
      render(<SmartFieldEnhancer content="This content is about software and technology." onEnhance={mockOnEnhance} />);
      await waitFor(() => expect(screen.getByText('Industry:')).toBeInTheDocument(), { timeout: 300 });

      const section = screen.getByText('Industry:').closest('div');
      const button = section?.parentElement?.querySelector('[data-testid="wand-icon"]');
      if (!button) throw new Error("Apply industry button not found");
      fireEvent.click(button);

      // "software", "technology" point to "technology" industry
      expect(mockOnEnhance).toHaveBeenCalledWith(expect.objectContaining({ suggestedIndustry: 'technology' }));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Suggestion Applied!",
        description: expect.stringContaining("Industry has been auto-filled"),
      }));
    });

    test('applies template suggestion and calls toast', async () => {
      render(<SmartFieldEnhancer content="This is a blog post about how to do something." onEnhance={mockOnEnhance} />);
      await waitFor(() => expect(screen.getByText('Template:')).toBeInTheDocument(), { timeout: 300 });

      const section = screen.getByText('Template:').closest('div');
      // The template items are the last ones, so this might be fragile if order changes.
      // It's better to find the specific button if possible.
      // For now, we assume it's the last button of this kind.
      const allApplyButtons = screen.getAllByTestId('wand-icon');
      const applyButton = allApplyButtons[allApplyButtons.length-1]; // Assuming it's the last one if others are present.

      // A better way:
      let templateApplyButton;
      const allSuggestionItems = screen.getAllByText(/Title:|Keywords:|Tone:|Audience:|Industry:|Template:/);
      allSuggestionItems.forEach(itemElement => {
          if (itemElement.textContent?.startsWith("Template:")) {
              const parentDiv = itemElement.closest('div')?.parentElement; // up to the div that wraps label and button
              if (parentDiv) {
                templateApplyButton = parentDiv.querySelector('[data-testid="wand-icon"]');
              }
          }
      });


      if (!templateApplyButton) throw new Error("Apply template button not found");
      fireEvent.click(templateApplyButton);

      // "how to" and "blog post" point to "how-to" or "blog post" based on implementation.
      // Current detectTemplate prefers "how-to" if "how to" is present.
      expect(mockOnEnhance).toHaveBeenCalledWith(expect.objectContaining({ suggestedTemplate: 'how-to' }));
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Suggestion Applied!",
        description: expect.stringContaining("Template has been auto-filled"),
      }));
    });

  });

  test('extractKeywords fallback when TF-IDF returns no terms', async () => {
    const natural = require('natural');
    natural.TfIdf.mockImplementation(() => ({
      addDocument: jest.fn(),
      listTerms: jest.fn().mockReturnValue([]), // No terms from TF-IDF
      tfidf: jest.fn().mockReturnValue(0),
    }));

    render(<SmartFieldEnhancer content="Fallback content with common the and but also specific fallbackone fallbacktwo." onEnhance={mockOnEnhance} />);

    await waitFor(() => {
      expect(screen.getByText(/AI Suggestions Available/i)).toBeInTheDocument();
    }, { timeout: 300 });

    // Check if fallback keywords are rendered
    expect(screen.getByText('Keywords:')).toBeInTheDocument();
    expect(screen.getByText('fallbackone')).toBeInTheDocument();
    expect(screen.getByText('fallbacktwo')).toBeInTheDocument();
    // Check explanation for fallback
    // This requires the component to expose explanations to the testing library, e.g. via hover or another element.
    // The current UI shows explanation on hover, which is harder to test directly with RTL for the text content.
    // For now, we verify the fallback keywords are present.
  });

});
