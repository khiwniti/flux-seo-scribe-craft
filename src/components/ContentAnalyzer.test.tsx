import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContentAnalyzer from './ContentAnalyzer'; // Adjust path as necessary
import { useToast } from '@/hooks/use-toast';
import * as geminiService from '@/lib/geminiService';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'),
  Target: () => <div data-testid="target-icon" />,
  TrendingUp: () => <div data-testid="trendingup-icon" />,
  AlertCircle: () => <div data-testid="alertcircle-icon" />,
  CheckCircle: () => <div data-testid="checkcircle-icon" />,
  AlertTriangle: () => <div data-testid="alerttriangle-icon" />,
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock geminiService
jest.mock('@/lib/geminiService');

describe('ContentAnalyzer Component', () => {
  const mockToastFn = jest.fn();
  const mockCallGeminiApi = geminiService.generateBlogContent as jest.Mock; // Using generateBlogContent as the generic caller

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToastFn });
  });

  test('renders initial form elements correctly', () => {
    render(<ContentAnalyzer />);
    expect(screen.getByLabelText(/Page Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meta Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Keywords/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze Content/i })).toBeInTheDocument();
    expect(screen.getByText(/Enter content above and click "Analyze Content" to see results/i)).toBeInTheDocument();
  });

  test('shows error if content is empty when analyze is clicked', async () => {
    render(<ContentAnalyzer />);
    fireEvent.click(screen.getByRole('button', { name: /Analyze Content/i }));
    expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
      title: "Content Required",
      variant: "destructive",
    }));
    expect(mockCallGeminiApi).not.toHaveBeenCalled();
  });

  describe('Gemini API Integration for Content Analysis', () => {
    const mockApiResponse = `
Overall SEO Score: 85
Justification: The content is well-structured and covers the topic comprehensively.
Readability: Good (Flesch-Kincaid score: 75)
Keyword Density: Main keyword "test" used appropriately.
Suggestion 1: Add more images.
Suggestion 2: Improve call to action.
- Another suggestion format.
* And one more.
    `;
    const mockApiError = { message: "Network error during analysis.", isApiKeyInvalid: false };
    const mockApiKeyError = { message: "API key invalid. Please go to Settings to add it.", isApiKeyInvalid: true };

    test('successfully analyzes content and displays results', async () => {
      mockCallGeminiApi.mockResolvedValueOnce(mockApiResponse);
      render(<ContentAnalyzer />);

      await userEvent.type(screen.getByLabelText(/Content/i), 'This is test content for analysis.');
      await userEvent.type(screen.getByLabelText(/Page Title/i), 'Test Title');
      await userEvent.type(screen.getByLabelText(/Target Keywords/i), 'test, analysis');

      fireEvent.click(screen.getByRole('button', { name: /Analyze Content/i }));

      expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();

      await waitFor(() => {
        expect(mockCallGeminiApi).toHaveBeenCalledWith(
          expect.stringContaining('Content to Analyze:\n---\nThis is test content for analysis.\n---'),
          // API key is handled by service, so not passed here
        );
      });

      await waitFor(() => {
        expect(screen.getByText('85%')).toBeInTheDocument(); // SEO Score
        expect(screen.getByText('Excellent')).toBeInTheDocument(); // Badge for score
        expect(screen.getByText(/The content is well-structured/i)).toBeInTheDocument(); // Justification
        expect(screen.getByText('Good (Flesch-Kincaid score: 75)')).toBeInTheDocument(); // Readability
        expect(screen.getByText(/Main keyword "test" used appropriately/i)).toBeInTheDocument(); // Keyword Density
        expect(screen.getByText('Add more images.')).toBeInTheDocument();
        expect(screen.getByText('Improve call to action.')).toBeInTheDocument();
        expect(screen.getByText('Another suggestion format.')).toBeInTheDocument();
        expect(screen.getByText('And one more.')).toBeInTheDocument();
      });
      expect(screen.queryByText(/Analyzing.../i)).not.toBeInTheDocument();
    });

    test('handles API key error from Gemini service', async () => {
      mockCallGeminiApi.mockRejectedValueOnce(mockApiKeyError);
      render(<ContentAnalyzer />);

      await userEvent.type(screen.getByLabelText(/Content/i), 'Test content.');
      fireEvent.click(screen.getByRole('button', { name: /Analyze Content/i }));

      await waitFor(() => {
        expect(screen.getByText(new RegExp(mockApiKeyError.message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument(); // API key error in UI
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
          title: "Analysis Failed",
          description: mockApiKeyError.message,
        }));
        // Check if analysis section shows error state
        expect(screen.getByText('Error')).toBeInTheDocument(); // For readability score
        expect(screen.getByText('0%')).toBeInTheDocument(); // Default SEO score on error
      });
    });

    test('handles generic API error from Gemini service', async () => {
      mockCallGeminiApi.mockRejectedValueOnce(mockApiError);
      render(<ContentAnalyzer />);

      await userEvent.type(screen.getByLabelText(/Content/i), 'Test content.');
      fireEvent.click(screen.getByRole('button', { name: /Analyze Content/i }));

      await waitFor(() => {
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
          title: "Analysis Failed",
          description: mockApiError.message,
        }));
        expect(screen.getByText(mockApiError.message)).toBeInTheDocument(); // Suggestion shows error
      });
    });

    test('parser handles incomplete or differently formatted Gemini response', async () => {
      const incompleteResponse = `
Overall SEO Score: 70
Readability: Okay
Suggestion 1: This is one suggestion.
      `;
      mockCallGeminiApi.mockResolvedValueOnce(incompleteResponse);
      render(<ContentAnalyzer />);
      await userEvent.type(screen.getByLabelText(/Content/i), 'Test content for parsing.');
      fireEvent.click(screen.getByRole('button', { name: /Analyze Content/i }));

      await waitFor(() => {
        expect(screen.getByText('70%')).toBeInTheDocument();
        expect(screen.getByText('Okay')).toBeInTheDocument(); // Readability
        expect(screen.getByText('This is one suggestion.')).toBeInTheDocument();
        // Check for default/fallback values for missing fields
        expect(screen.getByText('No justification provided.')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument(); // For Keyword Density
      });
    });
  });
});
