import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdvancedSEOAnalytics from './AdvancedSEOAnalytics'; // Adjust path as necessary

// Mock lucide-react icons used in AdvancedSEOAnalytics
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'), // Import and retain default behavior for other icons
  Trash2: () => <div data-testid="trash-icon" />,
  // Add any other icons directly used by AdvancedSEOAnalytics if they cause issues
}));

// Mocking console.log for "Save Goals" button
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});


describe('AdvancedSEOAnalytics Component', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockAlert.mockClear();
  });

  test('renders the main title and all 8 accordion triggers', () => {
    render(<AdvancedSEOAnalytics />);
    expect(screen.getByText('Advanced SEO Analytics & Strategy Hub')).toBeInTheDocument();

    expect(screen.getByText('1. Define Goals and Scope')).toBeInTheDocument();
    expect(screen.getByText('2. Keyword Research and Scoring')).toBeInTheDocument();
    expect(screen.getByText('3. Technical SEO Audit')).toBeInTheDocument();
    expect(screen.getByText('4. On-Page SEO Analysis')).toBeInTheDocument();
    expect(screen.getByText('5. Off-Page SEO and Link Analysis')).toBeInTheDocument();
    expect(screen.getByText('6. Content Strategy Development')).toBeInTheDocument();
    expect(screen.getByText('7. Performance Tracking and Reporting')).toBeInTheDocument();
    expect(screen.getByText('8. Continuous Monitoring and Adaptation')).toBeInTheDocument();
  });

  describe('1. Define Goals and Scope Section', () => {
    test('renders input fields correctly', () => {
      render(<AdvancedSEOAnalytics />);
      // Open the first accordion item
      fireEvent.click(screen.getByText('1. Define Goals and Scope'));

      expect(screen.getByLabelText(/SEO Campaign Objective/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Target Audience/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Broader Business Objectives/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Campaign Timeline/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Performance Indicators \(KPIs\)/i)).toBeInTheDocument();
      // Check for a few KPI checkboxes
      expect(screen.getByLabelText(/organic traffic/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/conversions/i)).toBeInTheDocument();
    });

    test('allows typing into input fields', async () => {
      render(<AdvancedSEOAnalytics />);
      fireEvent.click(screen.getByText('1. Define Goals and Scope'));

      const objectiveInput = screen.getByLabelText<HTMLTextAreaElement>(/SEO Campaign Objective/i);
      await userEvent.type(objectiveInput, 'Increase traffic');
      expect(objectiveInput.value).toBe('Increase traffic');

      const audienceInput = screen.getByLabelText<HTMLTextAreaElement>(/Target Audience/i);
      await userEvent.type(audienceInput, 'Tech enthusiasts');
      expect(audienceInput.value).toBe('Tech enthusiasts');

      const timelineInput = screen.getByLabelText<HTMLInputElement>(/Campaign Timeline/i);
      await userEvent.type(timelineInput, '6 months');
      expect(timelineInput.value).toBe('6 months');
    });

    test('allows selecting and deselecting KPIs', async () => {
      render(<AdvancedSEOAnalytics />);
      fireEvent.click(screen.getByText('1. Define Goals and Scope'));

      const organicTrafficKpi = screen.getByLabelText(/organic traffic/i);
      const conversionsKpi = screen.getByLabelText(/conversions/i);

      await userEvent.click(organicTrafficKpi);
      expect(organicTrafficKpi).toBeChecked();

      await userEvent.click(conversionsKpi);
      expect(conversionsKpi).toBeChecked();

      await userEvent.click(organicTrafficKpi); // Deselect
      expect(organicTrafficKpi).not.toBeChecked();
    });

    test('"Save Goals & Strategy" button logs data to console and alerts', async () => {
      render(<AdvancedSEOAnalytics />);
      fireEvent.click(screen.getByText('1. Define Goals and Scope'));

      await userEvent.type(screen.getByLabelText<HTMLTextAreaElement>(/SEO Campaign Objective/i), 'Test Obj');
      await userEvent.click(screen.getByLabelText(/organic traffic/i));

      const saveButton = screen.getByRole('button', { name: /Save Goals & Strategy/i });
      fireEvent.click(saveButton);

      expect(mockConsoleLog).toHaveBeenCalledWith('Goals Saved:', expect.objectContaining({
        campaignObjective: 'Test Obj',
        kpis: expect.arrayContaining(['organic traffic']),
      }));
      expect(mockAlert).toHaveBeenCalledWith('Goals saved! (Check console for data)');
    });
  });

  // Placeholder for "2. Keyword Research and Scoring" tests
  describe('2. Keyword Research and Scoring Section', () => {
    test('renders keyword discovery and scoring table elements', async () => {
        render(<AdvancedSEOAnalytics />);
        // Accordion is defaulted to open for item-1, so we need to click to open item-2
        fireEvent.click(screen.getByText('2. Keyword Research and Scoring'));

        // Wait for content to be visible if there's any delay
        await waitFor(() => {
            expect(screen.getByText('Keyword Discovery')).toBeInTheDocument();
        });
        expect(screen.getByLabelText(/Enter Keywords \(one per line\)/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Add Keywords to Table/i})).toBeInTheDocument();
        expect(screen.getByText('Keyword Scoring & Categorization')).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Add New Keyword/i})).toBeInTheDocument();
    });

    test('adding keywords from textarea populates the table and calculates initial score', async () => {
        render(<AdvancedSEOAnalytics />);
        fireEvent.click(screen.getByText('2. Keyword Research and Scoring'));
        await waitFor(() => expect(screen.getByLabelText(/Enter Keywords \(one per line\)/i)).toBeVisible());

        const keywordsTextarea = screen.getByLabelText<HTMLTextAreaElement>(/Enter Keywords \(one per line\)/i);
        await userEvent.type(keywordsTextarea, "test keyword 1\nbest seo tool");

        const addButton = screen.getByRole('button', { name: /Add Keywords to Table/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByDisplayValue('test keyword 1')).toBeInTheDocument();
            expect(screen.getByDisplayValue('best seo tool')).toBeInTheDocument();
        });

        const rows = screen.getAllByRole('row');
        // Header row + 2 keyword rows
        expect(rows.length).toBeGreaterThanOrEqual(3);

        // Check if score is calculated (default score for empty values is 30.00 based on formula (100-0)*0.3)
        // (0*0.3) + ((100-0)*0.3) + (0*0.2) + (0*0.2) = 30
        const firstKeywordRow = within(rows[1]); // First data row
        expect(firstKeywordRow.getByText("30.00")).toBeInTheDocument();
    });

    test('adding a new keyword manually adds a row to the table', async () => {
      render(<AdvancedSEOAnalytics />);
      fireEvent.click(screen.getByText('2. Keyword Research and Scoring'));
      await waitFor(() => expect(screen.getByRole('button', { name: /Add New Keyword/i })).toBeVisible());

      const initialRowCount = screen.getAllByRole('rowgroup')[1]?.querySelectorAll('tr').length || 0; // Get rows in tbody

      const addNewButton = screen.getByRole('button', { name: /Add New Keyword/i });
      fireEvent.click(addNewButton);

      await waitFor(() => {
        const currentRowCount = screen.getAllByRole('rowgroup')[1]?.querySelectorAll('tr').length || 0;
        expect(currentRowCount).toBe(initialRowCount + 1);
      });
      // Check for an empty input in the new row as a proxy for its existence
      const rows = screen.getAllByRole('row');
      const lastRow = rows[rows.length -1];
      expect(within(lastRow).getByPlaceholderText('Enter keyword')).toBeInTheDocument();
    });

    test('inputting data into keyword row fields and score recalculation', async () => {
      render(<AdvancedSEOAnalytics />);
      fireEvent.click(screen.getByText('2. Keyword Research and Scoring'));
      await waitFor(() => expect(screen.getByRole('button', { name: /Add New Keyword/i })).toBeVisible());
      fireEvent.click(screen.getByRole('button', { name: /Add New Keyword/i }));
      await waitFor(() => expect(screen.getByPlaceholderText('Enter keyword')).toBeVisible());

      const keywordInput = screen.getByPlaceholderText<HTMLInputElement>('Enter keyword');
      const svInput = screen.getByPlaceholderText<HTMLInputElement>('e.g. 1500');
      const kdInput = screen.getByPlaceholderText<HTMLInputElement>('e.g. 30');
      const relevanceInput = screen.getByPlaceholderText<HTMLInputElement>('1-10');
      const rankInput = screen.getByPlaceholderText<HTMLInputElement>('e.g. 5');
      const cpcInput = screen.getByPlaceholderText<HTMLInputElement>('$0.75');
      const intentSelectTrigger = screen.getByRole('button', { name: /Select Intent/i }); // Gets the SelectTrigger

      await userEvent.type(keywordInput, 'advanced test');
      await userEvent.type(svInput, '50000'); // Normalized SV = 50
      await userEvent.type(kdInput, '20');    // Normalized KD (100-20) = 80
      await userEvent.type(relevanceInput, '8'); // Scaled Relevance = 80
      await userEvent.type(rankInput, '3');      // Normalized Rank = 98 (100 - (3-1))
      await userEvent.type(cpcInput, '1.25');

      fireEvent.mouseDown(intentSelectTrigger); // Open the select dropdown
      await waitFor(() => screen.getByText('Informational').toBeVisible()); // Wait for options to appear
      fireEvent.click(screen.getByText('Informational'));


      // Expected Score: (50*0.3) + (80*0.3) + (80*0.2) + (98*0.2)
      // = 15 + 24 + 16 + 19.6 = 74.6
      await waitFor(() => {
        const rowWithKeyword = screen.getByDisplayValue('advanced test').closest('tr');
        if (!rowWithKeyword) throw new Error('Keyword row not found');
        expect(within(rowWithKeyword).getByText('74.60')).toBeInTheDocument();
        expect(within(rowWithKeyword).getByDisplayValue('1.25')).toBeInTheDocument(); // Check CPC
        expect(within(rowWithKeyword).getByText('Informational')).toBeInTheDocument(); // Check Intent
      });
    });

    describe('Keyword Score Calculation Edge Cases', () => {
      const testCases = [
        // SV, KD, Relevance (1-10), Rank => Expected Score
        // Formula: (normSV * 0.3) + ((100-KD) * 0.3) + (Rel*10 * 0.2) + (normRank * 0.2)
        { sv: 0, kd: 100, rel: 1, rank: 150, expected: ((0*0.3) + (0*0.3) + (10*0.2) + (0*0.2)).toFixed(2) }, // Min values, rank > 100
        { sv: 100000, kd: 0, rel: 10, rank: 1, expected: ((100*0.3) + (100*0.3) + (100*0.2) + (100*0.2)).toFixed(2) }, // Max values
        { sv: 200000, kd: 50, rel: 5, rank: 10, expected: ((100*0.3) + (50*0.3) + (50*0.2) + (91*0.2)).toFixed(2) }, // SV capped, rank 10 (norm 91)
        { sv: 1000, kd: 70, rel: 3, rank: 50, expected: ((1*0.3) + (30*0.3) + (30*0.2) + (51*0.2)).toFixed(2) }, // Low SV, high KD, mid rank (norm 51)
        { sv: '', kd: '', rel: '', rank: '', expected: ((0*0.3) + (100*0.3) + (0*0.2) + (0*0.2)).toFixed(2) }, // Empty values (normSV=0, KD=0 -> (100-0)*0.3, Rel=0, normRank=0) -> 30.00
      ];

      testCases.forEach(({ sv, kd, rel, rank, expected }, index) => {
        test(`calculates score correctly for case ${index + 1}: SV=${sv}, KD=${kd}, Rel=${rel}, Rank=${rank}`, async () => {
          render(<AdvancedSEOAnalytics />);
          fireEvent.click(screen.getByText('2. Keyword Research and Scoring'));
          await waitFor(() => expect(screen.getByRole('button', { name: /Add New Keyword/i })).toBeVisible());
          fireEvent.click(screen.getByRole('button', { name: /Add New Keyword/i }));

          // Wait for the new row to be added and inputs to be available
          const svInputs = await screen.findAllByPlaceholderText('e.g. 1500');
          const newRowSvInput = svInputs[svInputs.length -1]; // target the last added row
          const newRowRoot = newRowSvInput.closest('tr');
          if (!newRowRoot) throw new Error("Could not find the new keyword row.");

          const kdInput = within(newRowRoot).getByPlaceholderText<HTMLInputElement>('e.g. 30');
          const relevanceInput = within(newRowRoot).getByPlaceholderText<HTMLInputElement>('1-10');
          const rankInput = within(newRowRoot).getByPlaceholderText<HTMLInputElement>('e.g. 5');

          if (sv) await userEvent.type(newRowSvInput, String(sv)); else await userEvent.clear(newRowSvInput);
          if (kd) await userEvent.type(kdInput, String(kd)); else await userEvent.clear(kdInput);
          if (rel) await userEvent.type(relevanceInput, String(rel)); else await userEvent.clear(relevanceInput);
          if (rank) await userEvent.type(rankInput, String(rank)); else await userEvent.clear(rankInput);

          await waitFor(() => {
            expect(within(newRowRoot).getByText(expected)).toBeInTheDocument();
          });
        });
      });
    });

    test('deleting a keyword row removes it from the table', async () => {
      render(<AdvancedSEOAnalytics />);
      fireEvent.click(screen.getByText('2. Keyword Research and Scoring'));
      await waitFor(() => expect(screen.getByLabelText(/Enter Keywords \(one per line\)/i)).toBeVisible());

      await userEvent.type(screen.getByLabelText<HTMLTextAreaElement>(/Enter Keywords \(one per line\)/i), "keyword to delete");
      fireEvent.click(screen.getByRole('button', { name: /Add Keywords to Table/i }));
      await waitFor(() => expect(screen.getByDisplayValue('keyword to delete')).toBeInTheDocument());

      let keywordRow = screen.getByDisplayValue('keyword to delete').closest('tr');
      expect(keywordRow).toBeInTheDocument();

      const deleteButton = within(keywordRow!).getByTestId('trash-icon');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByDisplayValue('keyword to delete')).not.toBeInTheDocument();
      });
    });
  });

  // Placeholder tests for sections 3-8
  const placeholderSections = [
    { name: '3. Technical SEO Audit', inputs: ['Site URL for Audit'] },
    { name: '4. On-Page SEO Analysis', inputs: ['Page URL to Analyze'] },
    { name: '5. Off-Page SEO and Link Analysis', inputs: ['Domain for Backlink Audit'] },
    { name: '6. Content Strategy Development', inputs: ['Content Plan based on Keyword Clusters', 'Publishing Frequency'] },
    { name: '7. Performance Tracking and Reporting', buttons: ['Generate Monthly Report (Mock)'] },
    { name: '8. Continuous Monitoring and Adaptation', inputs: ['Algorithm Update Log & Notes'] },
  ];

  placeholderSections.forEach(section => {
    describe(`${section.name} (Placeholder Section)`, () => {
      test('renders the accordion trigger', () => {
        render(<AdvancedSEOAnalytics />);
        expect(screen.getByText(section.name)).toBeInTheDocument();
      });

      test('renders key input fields/buttons when opened', async () => {
        render(<AdvancedSEOAnalytics />);
        fireEvent.click(screen.getByText(section.name));

        await waitFor(() => {
          (section.inputs || []).forEach(inputLabel => {
            expect(screen.getByLabelText(inputLabel)).toBeInTheDocument();
          });
          (section.buttons || []).forEach(buttonText => {
            expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument();
          });
        });
      });
    });
  });

});
