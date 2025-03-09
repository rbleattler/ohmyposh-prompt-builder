import React from 'react';
import { Box, styled } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import { Segment } from '../../types/schema';

// Define props interface
interface SegmentPreviewProps {
  segment: Segment & { powerline_symbol?: string }; // Add the powerline_symbol property
  isFirst: boolean;
  isLast: boolean;
}

// Styled segment component
const SegmentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'fg' && prop !== 'isPlain'
})<{
  bg: string;
  fg: string;
  isPlain: boolean;
}>(({ bg, fg, isPlain }) => ({
  backgroundColor: bg,
  color: fg,
  padding: '4px 8px',
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  height: '32px',
  borderRadius: isPlain ? '4px' : 0,
  margin: isPlain ? '0 2px' : 0,
}));

const SegmentPreview: React.FC<SegmentPreviewProps> = ({ segment, isFirst, isLast }) => {
  // Use the theme context
  const { themeConfig } = useTheme();

  const background = segment.background || '#000000';
  const foreground = segment.foreground || '#ffffff';
  const style = segment.style || 'plain';
  const isPlain = style === 'plain';

  // Get the content based on segment type
  const getSegmentContent = () => {
    switch (segment.type) {
      case 'path':
        return '~/projects/oh-my-posh';
      case 'git':
        return segment.properties?.branch_icon ? `${segment.properties.branch_icon} main` : 'main';
      case 'text':
        return segment.properties?.text || 'Text';
      case 'time':
        return new Date().toLocaleTimeString();
      case 'battery':
        return '100%';
      case 'os':
        return 'Windows';
      default:
        return segment.type || 'segment';
    }
  };

  // Render powerline divider if needed
  const renderPowerlineDivider = () => {
    if (style !== 'powerline' || isLast) return null;

    // Use the powerline_symbol from segment or a default
    const symbol = segment.powerline_symbol || '\uE0B0';

    return (
      <Box
        sx={{
          position: 'absolute',
          right: '-1em',
          zIndex: 1,
          color: background,
          fontSize: '16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {symbol}
      </Box>
    );
  };

  // Render diamond left/right parts if needed
  const renderDiamondPart = (side: 'left' | 'right') => {
    if (style !== 'diamond') return null;

    const symbol = side === 'left' ? '\uE0B6' : '\uE0B4';

    return (
      <Box
        sx={{
          position: 'absolute',
          [side]: side === 'left' ? '-8px' : '-8px',
          zIndex: 1,
          color: background,
          fontSize: '16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {symbol}
      </Box>
    );
  };

  return (
    <SegmentContainer bg={background} fg={foreground} isPlain={isPlain}>
      {getSegmentContent()}
      {renderPowerlineDivider()}
      {renderDiamondPart('left')}
      {renderDiamondPart('right')}
    </SegmentContainer>
  );
};

export default SegmentPreview;
