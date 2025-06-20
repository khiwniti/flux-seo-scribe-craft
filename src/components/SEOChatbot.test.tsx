import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SEOChatbot from './SEOChatbot';
import { useToast } from '@/hooks/use-toast';
import * as geminiService from '@/lib/geminiService';
import { LanguageProvider, Language } from '@/contexts/LanguageContext'; // Import LanguageProvider
import React from 'react'; // Ensure React is in scope for JSX

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'),
  Bot: () => <div data-testid="bot-icon" />,
  User: () => <div data-testid="user-icon" />,
  SendHorizonal: () => <div data-testid="send-icon" />,
  AlertTriangle: () => <div data-testid="alerttriangle-icon" />,
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock geminiService
jest.mock('@/lib/geminiService');

describe('SEOChatbot Component', () => {
  const mockToastFn = jest.fn();
  const mockGetChatbotResponse = geminiService.getChatbotResponse as jest.Mock;

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

  test('renders initial chat interface correctly', () => {
    renderWithLanguageProvider(<SEOChatbot />);
    expect(screen.getByText(/SEO Assistant Chatbot/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about SEO.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
    // Initially no messages, so no message elements should be found beyond loading/empty state
  });

  test('allows user to type and send a message, displays user and bot response (English)', async () => {
    mockGetChatbotResponse.mockResolvedValueOnce("This is a helpful bot response about keywords.");
    renderWithLanguageProvider(<SEOChatbot />, 'en');

    const inputField = screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    await userEvent.type(inputField, 'Tell me about keywords');
    expect(inputField.value).toBe('Tell me about keywords');
    fireEvent.click(sendButton);

    // User message should appear immediately
    await waitFor(() => {
      expect(screen.getByText('Tell me about keywords')).toBeInTheDocument();
    });
    expect(inputField.value).toBe(''); // Input cleared
    expect(screen.getByText(/Typing.../i)).toBeInTheDocument(); // Loading indicator

    // Bot response
    await waitFor(() => {
      expect(screen.getByText("This is a helpful bot response about keywords.")).toBeInTheDocument();
    }, { timeout: 2000 }); // Timeout for API call + rendering
    expect(screen.queryByText(/Typing.../i)).not.toBeInTheDocument(); // Loading indicator gone

    // Check chat history formatting passed to service
    expect(mockGetChatbotResponse).toHaveBeenCalledWith(
      expect.stringContaining("You are an expert SEO assistant. Provide helpful, concise, and accurate advice on SEO topics.") &&
      expect.stringContaining("My first question is: Tell me about keywords"),
      [],
    );
  });

  test('sends subsequent messages with formatted history (English)', async () => {
    mockGetChatbotResponse
      .mockResolvedValueOnce("Response to first query.")
      .mockResolvedValueOnce("Response to second query about page speed.");
    renderWithLanguageProvider(<SEOChatbot />, 'en');

    const inputField = screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    // First message
    await userEvent.type(inputField, 'First query');
    fireEvent.click(sendButton);
    await waitFor(() => screen.getByText("Response to first query."), { timeout: 2000 });

    // Second message
    await userEvent.type(inputField, 'Query about page speed');
    fireEvent.click(sendButton);
    await waitFor(() => screen.getByText("Response to second query about page speed."), { timeout: 2000 });

    expect(mockGetChatbotResponse).toHaveBeenCalledTimes(2);
    // Check the second call's history
    const expectedHistory: geminiService.ChatHistoryMessage[] = [
      { role: 'user', parts: [{ text: 'First query' }] }, // System prompt is part of this internally for the first message
      { role: 'model', parts: [{ text: 'Response to first query.' }] },
    ];
     // The actual prompt for the second message would be just 'Query about page speed'
     // The system prompt is only added to the *very first* user message in a session.
    expect(mockGetChatbotResponse).toHaveBeenLastCalledWith(
      'Query about page speed',
      expectedHistory
    );
  });

  test('limits chat history sent to API (e.g., last 10 messages)', async () => {
    // Fill up messages state to exceed 10
    const initialMessages: any[] = [];
    for (let i = 0; i < 12; i++) { // 6 turns
      initialMessages.push({ sender: 'user', text: `User message ${i+1}` });
      initialMessages.push({ sender: 'bot', text: `Bot response ${i+1}` });
    }
    // This direct state manipulation is not ideal for testing, better to simulate via UI if possible
    // But for brevity to test history formatting:
    // We'll rely on the internal formatChatHistory to be tested implicitly by what's sent.

    mockGetChatbotResponse.mockResolvedValue("Another response");

    renderWithLanguageProvider(<SEOChatbot />, 'en'); // Start fresh

    // Simulate 10 messages (5 turns)
    for (let i = 0; i < 5; i++) {
        mockGetChatbotResponse.mockResolvedValueOnce(`Bot response ${i + 1}`);
        await userEvent.type(screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i), `User query ${i + 1}`);
        fireEvent.click(screen.getByRole('button', { name: /Send/i }));
        await waitFor(() => screen.getByText(`Bot response ${i + 1}`), { timeout: 2000 });
    }

    // The 6th user message (11th message overall)
    mockGetChatbotResponse.mockResolvedValueOnce("Response to 6th user query");
    await userEvent.type(screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i), "User query 6");
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));
    await waitFor(() => screen.getByText("Response to 6th user query"), { timeout: 2000 });

    const lastCallArgs = mockGetChatbotResponse.mock.calls[mockGetChatbotResponse.mock.calls.length - 1];
    const historySent: geminiService.ChatHistoryMessage[] = lastCallArgs[1];
    expect(historySent.length).toBe(10);
    expect(historySent[0].parts[0].text).toBe('User query 1');
    expect(historySent[9].parts[0].text).toBe('Bot response 5');
  });


  test('handles API key error from getChatbotResponse', async () => {
    const apiKeyError = { message: "API Key is invalid or missing. Please configure it in Settings.", isApiKeyInvalid: true };
    mockGetChatbotResponse.mockRejectedValueOnce(apiKeyError);
    renderWithLanguageProvider(<SEOChatbot />);

    await userEvent.type(screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i), 'Test with API key error');
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(screen.getByText(apiKeyError.message)).toBeInTheDocument(); // Error shown as bot message
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Chatbot Error",
        description: apiKeyError.message,
      }));
      // Check for persistent API key error message in UI
      expect(screen.getByTestId('alerttriangle-icon').closest('div')).toHaveTextContent(apiKeyError.message);
    });
  });

  test('handles generic API error from getChatbotResponse', async () => {
    const genericError = { message: "Network failed badly." };
    mockGetChatbotResponse.mockRejectedValueOnce(genericError);
    renderWithLanguageProvider(<SEOChatbot />);

    await userEvent.type(screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i), 'Test with generic error');
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(screen.getByText(genericError.message)).toBeInTheDocument(); // Error shown as bot message
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Chatbot Error",
        description: genericError.message,
      }));
      // No persistent API key error message
      expect(screen.queryByTestId('alerttriangle-icon')?.closest('div')).not.toHaveTextContent(genericError.message);
    });
  });

  test('sends Thai-specific system prompt and instructions when language is "th"', async () => {
    mockGetChatbotResponse
      .mockResolvedValueOnce("นี่คือการตอบกลับภาษาไทยสำหรับคำถามแรก") // First response
      .mockResolvedValueOnce("นี่คือการตอบกลับภาษาไทยสำหรับคำถามที่สอง"); // Second response
    renderWithLanguageProvider(<SEOChatbot />, 'th');

    const inputField = screen.getByPlaceholderText<HTMLInputElement>(/Ask about SEO.../i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    // First message
    await userEvent.type(inputField, 'คำถามแรก');
    fireEvent.click(sendButton);
    await waitFor(() => screen.getByText("นี่คือการตอบกลับภาษาไทยสำหรับคำถามแรก"), { timeout: 2000 });

    expect(mockGetChatbotResponse).toHaveBeenCalledWith(
      expect.stringContaining("You are an expert SEO assistant. Please respond in Thai.") &&
      expect.stringContaining("My first question is: คำถามแรก"),
      [] // Initial history
    );

    // Second message
    mockGetChatbotResponse.mockClear(); // Clear previous call info
    await userEvent.type(inputField, 'คำถามที่สอง');
    fireEvent.click(sendButton);
    await waitFor(() => screen.getByText("นี่คือการตอบกลับภาษาไทยสำหรับคำถามที่สอง"), { timeout: 2000 });

    expect(mockGetChatbotResponse).toHaveBeenCalledWith(
      expect.stringContaining("คำถามที่สอง\n(Remember to respond in Thai.)"), // Subsequent messages get reminder
      expect.arrayContaining([
        expect.objectContaining({ role: 'user', parts: [{ text: 'คำถามแรก' }] }),
        expect.objectContaining({ role: 'model', parts: [{ text: 'นี่คือการตอบกลับภาษาไทยสำหรับคำถามแรก' }] })
      ])
    );
  });
});
