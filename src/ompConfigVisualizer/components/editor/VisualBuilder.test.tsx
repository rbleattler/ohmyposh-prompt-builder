import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VisualBuilder from './VisualBuilder';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ValidationProvider } from '../../contexts/ValidationContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <ValidationProvider>
        {ui}
      </ValidationProvider>
    </ThemeProvider>
  );
};

describe('VisualBuilder', () => {
  test('renders without crashing', () => {
    renderWithProviders(<VisualBuilder />);
    expect(screen.getByText('Prompt Preview')).toBeInTheDocument();
  });

  test('can add a new block', () => {
    renderWithProviders(<VisualBuilder />);
    fireEvent.click(screen.getByText('Add Block'));
    expect(screen.getByText('Block 2: prompt')).toBeInTheDocument();
  });

  test('can delete a block', () => {
    renderWithProviders(<VisualBuilder />);
    fireEvent.click(screen.getByText('Add Block'));
    fireEvent.click(screen.getByText('Block 2: prompt'));
    fireEvent.click(screen.getByText('Delete Block'));
    expect(screen.queryByText('Block 2: prompt')).not.toBeInTheDocument();
  });

  test('can add a new segment', () => {
    renderWithProviders(<VisualBuilder />);
    fireEvent.click(screen.getByText('Add Segment'));
    expect(screen.getByText('Segment 1: prompt')).toBeInTheDocument();
  });

  test('can delete a segment', () => {
    renderWithProviders(<VisualBuilder />);
    fireEvent.click(screen.getByText('Add Segment'));
    fireEvent.click(screen.getByText('Segment 1: prompt'));
    fireEvent.click(screen.getByText('Delete Segment'));
    expect(screen.queryByText('Segment 1: prompt')).not.toBeInTheDocument();
  });

  // New tests for SegmentEditor
  describe('SegmentEditor', () => {
    beforeEach(() => {
      renderWithProviders(<VisualBuilder />);
      // Add a segment and select it to show the segment editor
      fireEvent.click(screen.getByText('Add Segment'));
      fireEvent.click(screen.getByText('Segment 1: prompt'));
    });

    test('displays segment editor when segment is selected', () => {
      expect(screen.getByText('Edit prompt Segment')).toBeInTheDocument();
    });

    test('allows changing segment foreground color', () => {
      const foregroundInput = screen.getByLabelText('Foreground Color');
      fireEvent.change(foregroundInput, { target: { value: '#ff5500' } });
      expect(foregroundInput).toHaveValue('#ff5500');
    });

    test('allows changing segment style', () => {
      const styleSelect = screen.getByLabelText('Style');
      fireEvent.mouseDown(styleSelect);
      const options = screen.getAllByRole('option');
      fireEvent.click(options[1]); // Select Diamond style
      expect(screen.getByText('Leading Text')).not.toBeDisabled();
    });

    test('enables diamond properties when diamond style is selected', () => {
      const styleSelect = screen.getByLabelText('Style');
      fireEvent.mouseDown(styleSelect);
      const options = screen.getAllByRole('option');
      fireEvent.click(options[1]); // Select Diamond style

      const leadingInput = screen.getByLabelText('Leading Text');
      expect(leadingInput).not.toBeDisabled();

      const trailingInput = screen.getByLabelText('Trailing Text');
      expect(trailingInput).not.toBeDisabled();
    });

    test('shows template field when use custom template is checked', () => {
      const templateCheckbox = screen.getByLabelText('Use Custom Template');
      fireEvent.click(templateCheckbox);
      expect(screen.getByLabelText('Template')).toBeInTheDocument();
    });
  });

  // New tests for BlockEditor
  describe('BlockEditor', () => {
    beforeEach(() => {
      renderWithProviders(<VisualBuilder />);
      // Make sure we're on the blocks tab and have a block selected
      const blocksTab = screen.getByText('Blocks');
      fireEvent.click(blocksTab);
    });

    test('displays block editor when a block is selected', () => {
      expect(screen.getByText(/Edit .* Block/)).toBeInTheDocument();
    });

    test('allows changing block type', () => {
      const typeSelect = screen.getByLabelText('Block Type');
      fireEvent.mouseDown(typeSelect);
      const options = screen.getAllByRole('option');
      fireEvent.click(options[1]); // Select Right Prompt
      expect(screen.getByText('Edit rprompt Block')).toBeInTheDocument();
    });

    test('allows changing block alignment', () => {
      const alignmentSelect = screen.getByLabelText('Alignment');
      fireEvent.mouseDown(alignmentSelect);
      const options = screen.getAllByRole('option');
      fireEvent.click(options[1]); // Select Right alignment
      expect(alignmentSelect).toHaveTextContent('Right');
    });

    test('allows toggling newline option', () => {
      const newlineCheckbox = screen.getByLabelText('Start on a new line');
      fireEvent.click(newlineCheckbox);
      expect(newlineCheckbox).toBeChecked();
    });

    test('allows toggling vertical display option', () => {
      const verticalCheckbox = screen.getByLabelText('Vertical display (stack segments vertically)');
      fireEvent.click(verticalCheckbox);
      expect(verticalCheckbox).toBeChecked();
    });

    test('shows max width field when hide overflow is checked', () => {
      const overflowCheckbox = screen.getByLabelText('Hide overflow content');
      fireEvent.click(overflowCheckbox);
      expect(screen.getByLabelText('Max Width')).toBeInTheDocument();
    });
  });
});
