import React from 'react';
import { SegmentFactoryWrapper } from '../factories/SegmentFactoryWrapper';

interface SegmentFactoryProps {
  type: string;
  config?: any;
  foreground: string;
  background: string;
  style?: string;
}

/**
 * Factory component to render appropriate segment based on type
 * This is now a wrapper around the dynamic segment factory
 */
const SegmentFactory: React.FC<SegmentFactoryProps> = (props) => {
  return <SegmentFactoryWrapper {...props} />;
};

export default SegmentFactory;
