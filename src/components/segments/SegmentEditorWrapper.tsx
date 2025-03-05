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
  return (
    <SchemaBasedSegmentFactory
      type={segment.type}
      segmentConfig={segment}
      onChange={onChange}
      segmentIndex={segmentIndex}
      blockIndex={blockIndex}
    />
  );
};

export default SegmentEditorWrapper;
