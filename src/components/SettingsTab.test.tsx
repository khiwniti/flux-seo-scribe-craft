import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SettingsTab from './SettingsTab'; // Adjust path as necessary
import { useToast } from '@/hooks/use-toast';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'),
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eyeoff-icon" />,
  KeyRound: () => <div data-testid="keyround-icon" />,
  AlertTriangle: () => <div data-testid="alerttriangle-icon" />,
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('SettingsTab Component', () => {
  const mockToastFn = jest.fn();
  let localStorageMock: Storage;

  const API_KEY_STORAGE_KEY = 'geminiApiKey';

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToastFn });

    // Setup localStorage mock for each test
    localStorageMock = (function () {
      let store: { [key: string]: string } = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
        length: 0,
        key: jest.fn((index: number) => Object.keys(store)[index] || null),
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
  });

  test('renders initial elements correctly', () => {
    render(<SettingsTab />);
    expect(screen.getByText(/API Key Management/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Google Gemini API Key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save API Key/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear API Key/i })).toBeInTheDocument();
    expect(screen.getByText(/Security Note/i)).toBeInTheDocument();
  });

  test('loads API key from localStorage on mount and populates input (masked)', () => {
    (localStorageMock.getItem as jest.Mock).mockReturnValueOnce('test_api_key_123');
    render(<SettingsTab />);
    const apiKeyInput = screen.getByLabelText<HTMLInputElement>(/Google Gemini API Key/i);
    expect(apiKeyInput.value).toBe('test_api_key_123');
    expect(apiKeyInput.type).toBe('password'); // Should be masked
    expect(localStorageMock.getItem).toHaveBeenCalledWith(API_KEY_STORAGE_KEY);
  });

  test('saves API key to localStorage and shows toast', async () => {
    render(<SettingsTab />);
    const apiKeyInput = screen.getByLabelText<HTMLInputElement>(/Google Gemini API Key/i);
    const saveButton = screen.getByRole('button', { name: /Save API Key/i });

    await userEvent.type(apiKeyInput, 'new_api_key_456');
    fireEvent.click(saveButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(API_KEY_STORAGE_KEY, 'new_api_key_456');
    expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Key Saved',
      description: 'Your Google Gemini API Key has been saved locally.',
    }));
  });

  test('shows error toast if trying to save an empty API key', async () => {
    render(<SettingsTab />);
    const saveButton = screen.getByRole('button', { name: /Save API Key/i });
    const apiKeyInput = screen.getByLabelText<HTMLInputElement>(/Google Gemini API Key/i);
    await userEvent.clear(apiKeyInput); // Ensure it's empty
    fireEvent.click(saveButton);

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Key Empty',
      variant: 'destructive',
    }));
  });


  test('clears API key from localStorage, clears input, and shows toast', async () => {
    (localStorageMock.getItem as jest.Mock).mockReturnValueOnce('test_api_key_123'); // Pre-populate
    render(<SettingsTab />);

    const apiKeyInput = screen.getByLabelText<HTMLInputElement>(/Google Gemini API Key/i);
    expect(apiKeyInput.value).toBe('test_api_key_123'); // Ensure it's populated first

    const clearButton = screen.getByRole('button', { name: /Clear API Key/i });
    fireEvent.click(clearButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(API_KEY_STORAGE_KEY);
    expect(apiKeyInput.value).toBe('');
    expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Key Cleared',
    }));
  });

  test('toggles API key visibility', async () => {
    render(<SettingsTab />);
    const apiKeyInput = screen.getByLabelText<HTMLInputElement>(/Google Gemini API Key/i);
    const toggleButton = screen.getByRole('button', { name: /Show API key/i }); // aria-label

    expect(apiKeyInput.type).toBe('password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument(); // Eye icon for show

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(apiKeyInput.type).toBe('text');
      expect(screen.getByTestId('eyeoff-icon')).toBeInTheDocument(); // EyeOff icon for hide
    });
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide API key');


    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(apiKeyInput.type).toBe('password');
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });
    expect(toggleButton).toHaveAttribute('aria-label', 'Show API key');
  });
});
