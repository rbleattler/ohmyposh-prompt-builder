import React from 'react';
import SchemaBasedSegmentFactory from '../factories/SchemaBasedSegmentFactory';

interface SegmentEditorWrapperProps {
  segment: any;
  segmentIndex: number;
  blockIndex: number;
  onChange: (updatedSegment: any) => void;
}

/**
 * This component replaces the old hardcoded segment editors with the new dynamic schema-based editor
 * It serves as a compatibility layer to ease the transition from hardcoded to dynamic segment editors
 */
const SegmentEditorWrapper: React.FC<SegmentEditorWrapperProps> = ({
  segment,
  segmentIndex,
  blockIndex,
  onChange
}) => {
  // SchemaBasedSegmentFactory expects different props, so we adapt them here
  return (
    <SchemaBasedSegmentFactory
      type={segment.type}
      config={segment}  // Changed from segmentConfig to config to match the expected prop name
      foreground={segment.foreground || '#ffffff'}
      background={segment.background || '#000000'}
      style={segment.style || 'powerline'}
    />
  );
};

export default SegmentEditorWrapper;
