import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SegmentEditor from './SegmentEditor';
import { SchemaProvider } from '../../contexts/SchemaContext';
import { ValidationProvider } from '../../contexts/ValidationContext';
import { SegmentType } from '../../types/schema/segmentProps';

// Mock the external dependencies
jest.mock('../../generated/segmentTypes', () => ({
  getSegmentDisplayName: (type: string) => `${type.charAt(0).toUpperCase() + type.slice(1)} Segment`
}));

// Mock the SchemaBasedConfigFactory component
jest.mock('../factories/SchemaBasedConfigFactory', () => {
  return {
    __esModule: true,
    default: ({ type, onChange }: any) => (
      <div data-testid="schema-based-config">
        <div>Type: {type}</div>
        <button
          onClick={() => onChange({ type, properties: { customProp: 'test' } })}
          data-testid="update-properties-btn"
        >
          Update Properties
        </button>
      </div>
    )
  };
});

const mockSegment: SegmentType = {
  type: 'git',
  foreground: '#ff0000',
  background: '#000000',
  style: 'powerline',
  powerline_symbol: true
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <SchemaProvider>
      <ValidationProvider>
        {ui}
      </ValidationProvider>
    </SchemaProvider>
  );
};

describe('SegmentEditor', () => {
  const handleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the editor with correct segment title', () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Edit Git Segment')).toBeInTheDocument();
  });

  test('renders appearance tab with color pickers', () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Foreground Color')).toBeInTheDocument();
    expect(screen.getByText('Background Color')).toBeInTheDocument();
  });

  test('renders style settings with correct options', () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Style Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Style')).toHaveValue('powerline');
  });

  test('shows powerline settings when powerline style is selected', () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    expect(screen.getByLabelText('Show powerline symbol')).toBeInTheDocument();
  });

  test('shows diamond settings when diamond style is selected', () => {
    renderWithProviders(
      <SegmentEditor
        segment={{ ...mockSegment, style: 'diamond' }}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    expect(screen.getByLabelText('Leading Diamond')).toBeInTheDocument();
    expect(screen.getByLabelText('Trailing Diamond')).toBeInTheDocument();
  });

  test('switches to content tab and shows schema-based config', async () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    // Click the Content tab
    const contentTab = screen.getByRole('tab', { name: /content/i });
    fireEvent.click(contentTab);

    // Verify schema-based config is displayed
    await waitFor(() => {
      expect(screen.getByTestId('schema-based-config')).toBeInTheDocument();
    });
  });

  test('switches to advanced tab and shows template options', () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    // Click the Advanced tab
    const advancedTab = screen.getByRole('tab', { name: /advanced/i });
    fireEvent.click(advancedTab);

    // Verify template options are displayed
    expect(screen.getByLabelText('Use custom template')).toBeInTheDocument();
  });

  test('enables template field when toggle is clicked', () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    // Click the Advanced tab
    const advancedTab = screen.getByRole('tab', { name: /advanced/i });
    fireEvent.click(advancedTab);

    // Toggle template on
    const templateToggle = screen.getByLabelText('Use custom template');
    fireEvent.click(templateToggle);

    // Expect the onChange function to be called with template property added
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        template: "{{ .Text }}"
      })
    );
  });

  test('updates segment when property is changed', async () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    // Click the Content tab
    const contentTab = screen.getByRole('tab', { name: /content/i });
    fireEvent.click(contentTab);

    // Find and click the update properties button in the mocked component
    await waitFor(() => {
      const updateButton = screen.getByTestId('update-properties-btn');
      fireEvent.click(updateButton);
    });

    // Expect the onChange function to be called with updated properties
    expect(handleChange).toHaveBeenCalled();
  });

  test('changes style when style dropdown is changed', () => {
    renderWithProviders(
      <SegmentEditor
        segment={mockSegment}
        segmentIndex={0}
        blockIndex={0}
        onChange={handleChange}
      />
    );

    // Find style dropdown and change to diamond
    const styleSelect = screen.getByLabelText('Style');
    fireEvent.change(styleSelect, { target: { value: 'diamond' } });

    // Expect onChange to be called with updated style
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        style: 'diamond'
      })
    );
  });
});