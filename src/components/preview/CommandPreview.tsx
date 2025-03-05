import React from 'react';
import { Box, styled } from '@mui/material';
import BlockPreview from './BlockPreview';
import { useTheme } from '../../contexts/ThemeContext';

interface CommandPreviewProps {
  selectedBlockIndex?: number;
  onSelectBlock?: (index: number) => void;
}

const Terminal = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  fontFamily: '"Cascadia Code", "Source Code Pro", Menlo, Monaco, Consolas, monospace',
  borderRadius: '4px',
  padding: '12px',
  width: '100%',
  overflow: 'auto',
  whiteSpace: 'nowrap',
}));

const CommandPreview: React.FC<CommandPreviewProps> = ({ selectedBlockIndex, onSelectBlock }) => {
  const { themeConfig } = useTheme();

  if (!themeConfig || !themeConfig.blocks) {
    return <Terminal>No blocks configured</Terminal>;
  }

  const handleSelectBlock = (index: number) => {
    if (onSelectBlock) {
      onSelectBlock(index);
    }
  };

  return (
    <Terminal>
      {themeConfig.blocks.map((block: any, index: number) => (
        <React.Fragment key={index}>
          <BlockPreview
            block={block}
            isActive={selectedBlockIndex === index}
            onClick={() => handleSelectBlock(index)}
          />
          {block.newline && <Box sx={{ width: '100%', height: '4px' }} />}
        </React.Fragment>
      ))}
      <Box component="span" sx={{ color: '#4caf50' }}>$ _</Box>
    </Terminal>
  );
};

export default CommandPreview;
