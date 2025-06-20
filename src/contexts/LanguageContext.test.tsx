import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LanguageProvider, useLanguage, Language } from './LanguageContext'; // Adjust path

// Test component to consume the context
const TestConsumerComponent: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="language-display">{language}</span>
      <button onClick={() => setLanguage('en')}>Set EN</button>
      <button onClick={() => setLanguage('th')}>Set TH</button>
    </div>
  );
};

describe('LanguageContext', () => {
  test('LanguageProvider initializes with default language "en"', () => {
    render(
      <LanguageProvider>
        <TestConsumerComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('language-display')).toHaveTextContent('en');
  });

  test('LanguageProvider initializes with a specific default language', () => {
    render(
      <LanguageProvider defaultLanguage="th">
        <TestConsumerComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('language-display')).toHaveTextContent('th');
  });

  test('setLanguage updates the language in the context', async () => {
    render(
      <LanguageProvider>
        <TestConsumerComponent />
      </LanguageProvider>
    );

    const setThButton = screen.getByRole('button', { name: 'Set TH' });
    const setEnButton = screen.getByRole('button', { name: 'Set EN' });
    const display = screen.getByTestId('language-display');

    // Initial state
    expect(display).toHaveTextContent('en');

    // Change to Thai
    await act(async () => {
      await userEvent.click(setThButton);
    });
    expect(display).toHaveTextContent('th');

    // Change back to English
    await act(async () => {
      await userEvent.click(setEnButton);
    });
    expect(display).toHaveTextContent('en');
  });

  test('useLanguage throws error if used outside of LanguageProvider', () => {
    // Suppress console.error for this specific test as React will log an error
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestConsumerComponent />);
    }).toThrow('useLanguage must be used within a LanguageProvider');

    // Restore console.error
    console.error = originalError;
  });
});
