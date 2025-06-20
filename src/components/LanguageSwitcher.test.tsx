import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LanguageSwitcher from './LanguageSwitcher'; // Adjust path
import { LanguageProvider, useLanguage, Language } from '@/contexts/LanguageContext'; // Adjust path

// Mock lucide-react Check icon
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'), // Keep other icons working if any
  Check: () => <div data-testid="check-icon" />,
}));

describe('LanguageSwitcher Component', () => {
  const mockSetLanguage = jest.fn();

  const renderWithProvider = (currentLanguage: Language) => {
    return render(
      <LanguageContext.Provider value={{ language: currentLanguage, setLanguage: mockSetLanguage }}>
        <LanguageSwitcher />
      </LanguageContext.Provider>
    );
  };

  // A more complete provider setup for testing state changes reflected in UI
  const TestHarness: React.FC<{ initialLang?: Language }> = ({ initialLang = 'en' }) => {
    const [language, setLanguageState] = useState<Language>(initialLang);
    const setLanguage = (lang: Language) => {
        mockSetLanguage(lang); // Call the mock for assertion
        setLanguageState(lang); // Actual state change for UI update
    };
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <LanguageSwitcher />
        </LanguageContext.Provider>
    );
  };


  beforeEach(() => {
    mockSetLanguage.mockClear();
  });

  test('renders EN and TH buttons', () => {
    renderWithProvider('en');
    expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TH/i })).toBeInTheDocument();
  });

  test('calls setLanguage with "th" when TH button is clicked', async () => {
    renderWithProvider('en');
    const thButton = screen.getByRole('button', { name: /TH/i });
    await userEvent.click(thButton);
    expect(mockSetLanguage).toHaveBeenCalledWith('th');
  });

  test('calls setLanguage with "en" when EN button is clicked', async () => {
    renderWithProvider('th');
    const enButton = screen.getByRole('button', { name: /EN/i });
    await userEvent.click(enButton);
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

  test('EN button has active styling when language is "en"', () => {
    render(<TestHarness initialLang="en" />);
    const enButton = screen.getByRole('button', { name: /EN/i });
    const thButton = screen.getByRole('button', { name: /TH/i });

    // Active button should have the check icon and specific classes
    expect(within(enButton).getByTestId('check-icon')).toBeInTheDocument();
    expect(enButton).toHaveClass('bg-gradient-to-r from-blue-600 to-purple-600');

    // Inactive button should not have the check icon and different classes
    expect(within(thButton).queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(thButton).not.toHaveClass('bg-gradient-to-r from-blue-600 to-purple-600');
    expect(thButton).toHaveClass('text-gray-600');
  });

  test('TH button has active styling when language is "th"', () => {
    render(<TestHarness initialLang="th" />);
    const enButton = screen.getByRole('button', { name: /EN/i });
    const thButton = screen.getByRole('button', { name: /TH/i });

    expect(within(thButton).getByTestId('check-icon')).toBeInTheDocument();
    expect(thButton).toHaveClass('bg-gradient-to-r from-blue-600 to-purple-600');

    expect(within(enButton).queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(enButton).not.toHaveClass('bg-gradient-to-r from-blue-600 to-purple-600');
    expect(enButton).toHaveClass('text-gray-600');
  });

  test('button styling updates correctly after language change', async () => {
    // Use the TestHarness which includes actual state updates for UI re-render
    render(<TestHarness initialLang="en" />);

    const enButton = screen.getByRole('button', { name: /EN/i });
    const thButton = screen.getByRole('button', { name: /TH/i });

    // Initial: EN active
    expect(within(enButton).getByTestId('check-icon')).toBeInTheDocument();
    expect(enButton).toHaveClass('bg-gradient-to-r'); // Check for part of the gradient class

    // Click TH button
    await act(async () => {
      await userEvent.click(thButton);
    });

    // Now TH should be active
    expect(within(thButton).getByTestId('check-icon')).toBeInTheDocument();
    expect(thButton).toHaveClass('bg-gradient-to-r');
    expect(mockSetLanguage).toHaveBeenCalledWith('th'); // Verify context function was called

    // EN should be inactive
    expect(within(enButton).queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(enButton).not.toHaveClass('bg-gradient-to-r');
  });
});

// Need to import useState and within for the TestHarness and more detailed assertions
import { useState } from 'react';
import { within } from '@testing-library/react';
