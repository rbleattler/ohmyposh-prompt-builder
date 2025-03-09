import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicSegmentFactory from './DynamicSegmentFactory';

// Mock getSegmentDisplayName from segmentTypes
jest.mock('../../generated/segmentTypes', () => ({
  getSegmentDisplayName: (type: string) => type
}));

// Mock sample schema for testing
const mockSchema = {
  definitions: {
    segment: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        style: { type: 'string' },
        foreground: { type: 'string' },
        background: { type: 'string' },
      }
    },
    gitSegment: {
      allOf: [
        { $ref: '#/definitions/segment' },
        {
          type: 'object',
          properties: {
            properties: {
              type: 'object',
              properties: {
                branch_icon: {
                  type: 'string',
                  description: 'Icon to display before branch name'
                },
                display_status: {
                  type: 'boolean',
                  description: 'Show changes, additions, deletions',
                  default: true
                }
              }
            }
          }
        }
      ]
    }
  }
};

// Mock the IconRenderer component
jest.mock('../IconRenderer', () => ({
  __esModule: true,
  default: ({ iconValue }: { iconValue: string }) => <span data-testid="mocked-icon">{iconValue}</span>
}));

describe('DynamicSegmentFactory', () => {
  test('renders git segment with branch icon and status', () => {
    const config = {
      properties: {
        branch_icon: '\ue725 ',
        display_status: true
      }
    };

    render(
      <DynamicSegmentFactory
        type="git"
        config={config}
        foreground="#ffffff"
        background="#6495ED"
        schema={mockSchema}
      />
    );

    // Verify that the component renders with the expected content
    const mainElement = screen.getByText('main');
    expect(mainElement).toBeTruthy();

    const statusElement = screen.getByText('+2 ~1 -0');
    expect(statusElement).toBeTruthy();
  });

  test('renders os segment with icon', () => {
    const config = {
      properties: {
        windows: '\uf17a'
      }
    };

    render(
      <DynamicSegmentFactory
        type="os"
        config={config}
        foreground="#ffffff"
        background="#E06C75"
        schema={mockSchema}
      />
    );

    // Verify that the component renders with the expected content
    const icon = screen.getByTestId('mocked-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toBe('\uf17a');
  });

  test('renders text segment with prefix and suffix', () => {
    const config = {
      text: 'Sample Text',
      prefix: 'PREFIX:',
      suffix: '!'
    };

    render(
      <DynamicSegmentFactory
        type="text"
        config={config}
        foreground="#ffffff"
        background="#56B6C2"
        schema={mockSchema}
      />
    );

    // Verify that the component renders with the expected content
    const prefixElement = screen.getByText('PREFIX:');
    expect(prefixElement).toBeTruthy();

    const textElement = screen.getByText('Sample Text');
    expect(textElement).toBeTruthy();

    const suffixElement = screen.getByText('!');
    expect(suffixElement).toBeTruthy();
  });

  test('renders unknown segment type with display name', () => {
    render(
      <DynamicSegmentFactory
        type="unknown"
        config={{}}
        foreground="#ffffff"
        background="#000000"
        schema={mockSchema}
      />
    );

    // Verify that the component renders a fallback for unknown types
    const unknownElement = screen.getByText('unknown');
    expect(unknownElement).toBeTruthy();
  });
});