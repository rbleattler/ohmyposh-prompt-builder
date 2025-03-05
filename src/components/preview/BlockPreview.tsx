import React from 'react';
import { Box, Paper, styled } from '@mui/material';
import SegmentPreview from './SegmentPreview';

interface BlockPreviewProps {
  block: any;
  isActive: boolean;
  onClick?: () => void;
}

const BlockContainer = styled(Box)<{ alignment: string }>(({ alignment }) => ({
  display: 'flex',
  justifyContent: alignment === 'right' ? 'flex-end' : 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '8px',
  flexWrap: 'wrap',
}));

const BlockPreview: React.FC<BlockPreviewProps> = ({ block, isActive, onClick }) => {
  const alignment = block.alignment || 'left';

  return (
    <BlockContainer
      alignment={alignment}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '4px',
        border: isActive ? '1px dashed #1976d2' : '1px solid transparent',
        borderRadius: '4px',
      }}
    >
      {block.segments?.map((segment: any, index: number) => (
        <SegmentPreview
          key={index}
          segment={segment}
          isFirst={index === 0}
          isLast={index === block.segments.length - 1}
        />
      ))}
    </BlockContainer>
  );
};

export default BlockPreview;
