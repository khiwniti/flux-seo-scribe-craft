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

});
