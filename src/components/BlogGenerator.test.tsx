
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BlogGenerator from './BlogGenerator';
import { useToast } from '@/hooks/use-toast';
import * as geminiService from '@/lib/geminiService';
import { LanguageProvider, Language } from '@/contexts/LanguageContext';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'), // Keep other icons working
  FileText: () => <div data-testid="filetext-icon" />,
  Wand2: () => <div data-testid="wand2-icon" />,
  Copy: () => <div data-testid="copy-icon" />,
  Download: () => <div data-testid="download-icon" />,
  AlertTriangle: () => <div data-testid="alerttriangle-icon" />,
  ImageIcon: () => <div data-testid="image-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock geminiService
jest.mock('@/lib/geminiService');

// Mock 'natural' library (for tone suggestion fallback or direct use if any)
jest.mock('natural', () => ({
  SentimentAnalyzer: jest.fn().mockImplementation(() => ({
    getSentiment: jest.fn().mockReturnValue(0), // Default neutral
  })),
  WordTokenizer: jest.fn().mockImplementation(() => ({
    tokenize: jest.fn(text => text ? text.split(' ') : []),
  })),
  PorterStemmer: {}, // Mock object
}));


describe('BlogGenerator Component', () => {
  const mockToastFn = jest.fn();
  const mockGenerateBlogContent = geminiService.generateBlogContent as jest.Mock;
  const mockGenerateImagePromptForText = geminiService.generateImagePromptForText as jest.Mock;

  const renderWithLanguageProvider = (ui: React.ReactElement, language: Language = 'en') => {
    return render(
      <LanguageProvider defaultLanguage={language}>
        {ui}
      </LanguageProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToastFn });
  });

  test('renders initial form elements correctly', () => {
    renderWithLanguageProvider(<BlogGenerator />);
    expect(screen.getByLabelText(/Blog Topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Keyword/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Writing Tone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Word Count/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Blog Post/i })).toBeInTheDocument();
    expect(screen.getByText(/Generated blog content will appear here/i)).toBeInTheDocument();
  });

  test('updates topic and primary keyword fields on input', async () => {
    renderWithLanguageProvider(<BlogGenerator />);
    const topicInput = screen.getByLabelText<HTMLInputElement>(/Blog Topic/i);
    const keywordInput = screen.getByLabelText<HTMLInputElement>(/Primary Keyword/i);

    await userEvent.type(topicInput, 'New Blog Topic');
    await userEvent.type(keywordInput, 'single keyword');

    expect(topicInput.value).toBe('New Blog Topic');
    expect(keywordInput.value).toBe('single keyword');
  });

  test('AI tone suggestion works when topic/keyword changes and tone is "Auto-suggest"', async () => {
    const natural = require('natural');
    const mockGetSentiment = jest.fn().mockReturnValue(0.5); // Positive
    natural.SentimentAnalyzer.mockImplementation(() => ({ getSentiment: mockGetSentiment }));

    renderWithLanguageProvider(<BlogGenerator />);

    const topicInput = screen.getByLabelText<HTMLInputElement>(/Blog Topic/i);
    const toneSelectTrigger = screen.getByRole('combobox', { name: /Writing Tone/i });

    // Initial state should be auto-suggest (empty value for tone state)
    expect(toneSelectTrigger).toHaveTextContent("Select tone or let AI suggest");

    await userEvent.type(topicInput, 'An exciting new adventure');

    await waitFor(() => {
      expect(mockGetSentiment).toHaveBeenCalled();
      // Check if the select now reflects "Positive"
      // This depends on how SelectValue updates the displayed text.
      // We might need to check the underlying state or a more specific part of the Select.
      // For now, we'll check if a toast appeared, which is an indirect confirmation.
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "AI Suggestion",
        description: "Writing tone auto-suggested: Positive",
      }));
      // To verify the Select itself, you might need to inspect its 'value' prop if possible,
      // or see if "Positive" becomes the displayed value.
      // If the Select component updates its displayed text based on the value prop:
      expect(toneSelectTrigger).toHaveTextContent("Positive");
    });

    // Manually select a different tone
    await userEvent.click(toneSelectTrigger);
    const professionalOption = await screen.findByText('Professional');
    await userEvent.click(professionalOption);
     expect(toneSelectTrigger).toHaveTextContent("Professional");

    // Clear mocks for the next interaction
    mockGetSentiment.mockClear();
    mockToastFn.mockClear();

    // Change topic again, AI should NOT suggest because tone is manually set
    await userEvent.type(topicInput, ' another new topic');

    // Ensure getSentiment was not called again
    expect(mockGetSentiment).not.toHaveBeenCalled();
    expect(mockToastFn).not.toHaveBeenCalledWith(expect.objectContaining({ title: "AI Suggestion" }));
  });

  test('writing style selection updates state and is included in prompt', async () => {
    mockGenerateBlogContent.mockResolvedValueOnce('Styled content.');
    mockGenerateImagePromptForText.mockResolvedValueOnce('Styled image prompt.');
    renderWithLanguageProvider(<BlogGenerator />);

    const topicInput = screen.getByLabelText<HTMLInputElement>(/Blog Topic/i);
    await userEvent.type(topicInput, 'Style Test Topic');

    const styleSelectTrigger = screen.getByRole('combobox', { name: /Writing Style/i });
    expect(styleSelectTrigger).toHaveTextContent('Default / Informative'); // Initial value

    await userEvent.click(styleSelectTrigger);
    const humorousOption = await screen.findByText('Humorous & Witty');
    await userEvent.click(humorousOption);
    expect(styleSelectTrigger).toHaveTextContent('Humorous & Witty'); // Check if display value updated

    fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

    await waitFor(() => {
      expect(mockGenerateBlogContent).toHaveBeenCalledWith(
        expect.stringContaining('Write the blog post in a Humorous & Witty style. Incorporate humor and wit where appropriate.')
      );
    });

    // Test default/Informative style
    mockGenerateBlogContent.mockClear();
    await userEvent.click(styleSelectTrigger);
    const informativeOption = await screen.findByText('Default / Informative');
    await userEvent.click(informativeOption);
    expect(styleSelectTrigger).toHaveTextContent('Default / Informative');

    fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));
    await waitFor(() => {
        expect(mockGenerateBlogContent).toHaveBeenCalledWith(
          expect.stringContaining('Write in a clear and informative style.')
        );
      });
  });


  describe('Gemini API Integration', () => {
    test('successfully generates blog content and image prompt with default style', async () => {
      mockGenerateBlogContent.mockResolvedValueOnce('Generated blog post content.');
      mockGenerateImagePromptForText.mockResolvedValueOnce('Generated image prompt.');

      renderWithLanguageProvider(<BlogGenerator />, 'en'); // Test with English
      await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i), 'Test Topic');
      await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Primary Keyword/i), 'test keyword');
      const toneSelectTrigger = screen.getByRole('combobox', { name: /Writing Tone/i });
      await userEvent.click(toneSelectTrigger);
      const casualOption = await screen.findByText('Casual');
      await userEvent.click(casualOption);

      fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

      expect(screen.getByText(/Generating Content.../i)).toBeInTheDocument();

      await waitFor(() => {
        expect(mockGenerateBlogContent).toHaveBeenCalledWith(
          expect.stringContaining('Generate a blog post about "Test Topic". The primary focus keyword is "test keyword". The desired writing tone is "Casual". Write in a clear and informative style. Please write this blog post entirely in English.')
        );
      });

      await waitFor(() => {
        expect(mockGenerateImagePromptForText).toHaveBeenCalledWith(
          expect.stringContaining('generate an English image prompt based on the following English text.')
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Generated blog post content.')).toBeInTheDocument();
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({ title: "Content Generated Successfully!" }));
      });

      await waitFor(() => {
         expect(screen.getByText(/Generating image prompt.../i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(mockGenerateImagePromptForText).toHaveBeenCalledWith('Generated blog post content.');
        expect(screen.getByDisplayValue('Generated image prompt.')).toBeInTheDocument(); // Textarea displays value
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({ title: "Image Prompt Generated!" }));
      });

      expect(screen.queryByText(/Generating Content.../i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Generating image prompt.../i)).not.toBeInTheDocument();
    });

    test('handles API key error from generateBlogContent', async () => {
      const apiKeyError = { message: "API key is invalid or missing. Please go to Settings to add it.", isApiKeyInvalid: true };
      mockGenerateBlogContent.mockRejectedValueOnce(apiKeyError);

      renderWithLanguageProvider(<BlogGenerator />);
      await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i), 'Test Topic');
      fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

      await waitFor(() => {
        expect(screen.getByText(new RegExp(apiKeyError.message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument(); // Check for error in UI
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
          title: "Content Generation Failed",
          description: apiKeyError.message,
        }));
      });
      // Image prompt generation should not be attempted
      expect(mockGenerateImagePromptForText).not.toHaveBeenCalled();
    });

    test('handles other API errors from generateBlogContent', async () => {
      const genericError = { message: "Network failed." };
      mockGenerateBlogContent.mockRejectedValueOnce(genericError);

      renderWithLanguageProvider(<BlogGenerator />);
      await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i), 'Test Topic');
      fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

      await waitFor(() => {
        expect(screen.getByText(new RegExp(genericError.message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
          title: "Content Generation Failed",
          description: genericError.message,
        }));
      });
    });

    test('handles API key error from generateImagePromptForText', async () => {
      mockGenerateBlogContent.mockResolvedValueOnce('Some blog content.');
      const apiKeyErrorImg = { message: "API Key error during image prompt generation. Check Settings.", isApiKeyInvalid: true };
      mockGenerateImagePromptForText.mockRejectedValueOnce(apiKeyErrorImg);

      renderWithLanguageProvider(<BlogGenerator />);
      await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i), 'Test Topic');
      fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

      await waitFor(() => expect(mockGenerateBlogContent).toHaveBeenCalled());
      await waitFor(() => {
        expect(screen.getByDisplayValue(new RegExp(apiKeyErrorImg.message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
          title: "Image Prompt Generation Failed",
          description: apiKeyErrorImg.message,
        }));
         // Check that the persistent API key error is shown for the image prompt part
        expect(screen.getByText(new RegExp(apiKeyErrorImg.message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
      });
    });

    test('prompt includes Thai instructions when language is "th"', async () => {
        mockGenerateBlogContent.mockResolvedValueOnce('เนื้อหาบล็อกที่สร้างขึ้น');
        mockGenerateImagePromptForText.mockResolvedValueOnce('คำแนะนำรูปภาพที่สร้างขึ้น');

        renderWithLanguageProvider(<BlogGenerator />, 'th');

        await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Blog Topic/i), 'หัวข้อภาษาไทย');
        await userEvent.type(screen.getByLabelText<HTMLInputElement>(/Primary Keyword/i), 'คีย์เวิร์ด');

        const styleSelectTrigger = screen.getByRole('combobox', { name: /Writing Style/i });
        await userEvent.click(styleSelectTrigger);
        const casualOption = await screen.findByText('Casual & Engaging'); // Use a non-default style
        await userEvent.click(casualOption);

        fireEvent.click(screen.getByRole('button', { name: /Generate Blog Post/i }));

        await waitFor(() => {
          expect(mockGenerateBlogContent).toHaveBeenCalledWith(
            expect.stringContaining('Write the blog post in a Casual & Engaging style. Use conversational language and a friendly tone. Please write this blog post entirely in Thai.')
          );
        });
        await waitFor(() => {
            expect(mockGenerateImagePromptForText).toHaveBeenCalledWith(
              expect.stringContaining('generate a Thai image prompt based on the following Thai text.')
            );
        });
      });
  });
});
