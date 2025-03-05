import React from 'react';
import { getSegmentDefaultProperties, getSegmentDisplayName } from '../generated/segmentTypes';
import { SegmentConfigFactoryWrapper } from './factories/SegmentFactoryWrapper';

interface SegmentConfigFactoryProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
  foreground: string;
  background: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

interface SegmentConfig {
  type: string;
  style?: 'plain' | 'powerline' | 'diamond';
  foreground?: string;
  background?: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

/**
 * Create a new segment configuration based on the segment type
 */
export const createSegmentConfig = (type: string): SegmentConfig => {
  // Create a default configuration using the auto-generated default properties
  const config: SegmentConfig = {
    type,
    style: 'powerline',
    foreground: '#ffffff',
    background: getDefaultBackgroundColor(type),
    properties: getSegmentDefaultProperties(type)
  };

  return config;
};

/**
 * Get a default background color based on segment type
 */
const getDefaultBackgroundColor = (type: string): string => {
  // Each segment type gets its own default color for visual distinction
  switch (type) {
    case 'path':
      return '#61AFEF'; // Blue
    case 'git':
      return '#C678DD'; // Purple
    case 'time':
      return '#98C379'; // Green
    case 'battery':
      return '#E5C07B'; // Yellow
    case 'os':
      return '#E06C75'; // Red
    case 'text':
      return '#56B6C2'; // Cyan
    case 'command':
      return '#ABB2BF'; // Grey
    case 'node':
      return '#689F63'; // Node.js green
    case 'npm':
      return '#CB3837'; // NPM red
    case 'aws':
      return '#FF9900'; // AWS orange
    case 'azure':
      return '#0078D4'; // Azure blue
    default:
      return '#444444'; // Default dark grey
  }
};

/**
 * Factory component to render appropriate configuration form based on segment type
 * This is now a wrapper around the dynamic segment config factory
 */
const SegmentConfigFactory: React.FC<SegmentConfigFactoryProps> = (props) => {
  return <SegmentConfigFactoryWrapper {...props} />;
};

export default SegmentConfigFactory;
