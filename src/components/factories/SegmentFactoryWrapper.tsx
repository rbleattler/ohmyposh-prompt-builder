import React from 'react';
import SchemaBasedSegmentFactory from './SchemaBasedSegmentFactory';
import SchemaBasedConfigFactory from './SchemaBasedConfigFactory';

interface SegmentFactoryWrapperProps {
  type: string;
  config?: any;
  foreground: string;
  background: string;
  style?: string;
}

interface SegmentConfigFactoryWrapperProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
  foreground: string;
  background: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

/**
 * Wrapper for segment visualization that uses the schema-based factory
 */
export const SegmentFactoryWrapper: React.FC<SegmentFactoryWrapperProps> = (props) => {
  return <SchemaBasedSegmentFactory {...props} />;
};

/**
 * Wrapper for segment configuration that uses the schema-based factory
 */
export const SegmentConfigFactoryWrapper: React.FC<SegmentConfigFactoryWrapperProps> = (props) => {
  return <SchemaBasedConfigFactory {...props} />;
};

// Create a wrapper object for default export
const FactoryWrappers = {
  SegmentFactoryWrapper,
  SegmentConfigFactoryWrapper
};

export default FactoryWrappers;