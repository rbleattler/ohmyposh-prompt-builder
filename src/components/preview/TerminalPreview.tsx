import React from 'react';
import { Box, Typography, styled, Theme } from '@mui/material'; // Add the proper imports
import { useTheme } from '../../contexts/ThemeContext';

// Define styled components with proper types
const Terminal = styled(Box)(({ theme }: { theme: Theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  fontFamily: '"Cascadia Code", "Source Code Pro", Menlo, Monaco, Consolas, monospace',
  borderRadius: '4px',
  padding: '12px',
  width: '100%',
  overflow: 'auto',
  whiteSpace: 'nowrap',
  height: '100%',
  boxSizing: 'border-box',
  position: 'relative',
}));

const TerminalHeader = styled(Box)(({ theme }: { theme: Theme }) => ({
  backgroundColor: '#323233',
  height: '32px',
  padding: '0 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  userSelect: 'none',
  marginBottom: '10px',
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
}));

const TerminalButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
});

interface CircleButtonProps {
  color: string;
}

const CircleButton = styled(Box)<CircleButtonProps>(({ color }) => ({
  width: '12px',
  height: '12px',
  backgroundColor: color,
  borderRadius: '50%',
  '&:hover': {
    filter: 'brightness(0.8)',
  },
}));

const TerminalTitle = styled(Box)({
  color: '#fff',
  opacity: 0.8,
  fontSize: '14px',
  textAlign: 'center',
  flex: 1,
});

const TerminalBody = styled(Box)(({ theme }: { theme: Theme }) => ({
  backgroundColor: '#000',
  flex: 1,
  padding: '12px',
  fontFamily: 'MonoLisa, Menlo, Monaco, "Courier New", monospace',
  fontSize: '14px',
  color: '#f1f1f1',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#191919',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#4d4d4d',
    borderRadius: '4px',
  },
}));

const Prompt = styled(Box)({
  marginBottom: '6px',
  display: 'flex',
  flexDirection: 'column',
});

const PromptSegments = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const CommandInput = styled(Box)({
  marginTop: '6px',
  display: 'flex',
  alignItems: 'center',
  '&::after': {
    content: '""',
    width: '8px',
    height: '18px',
    backgroundColor: '#f1f1f1',
    animation: 'blink 1s step-end infinite',
    marginLeft: '4px',
    opacity: 0.7,
  },
  '@keyframes blink': {
    '0%, 100%': {
      opacity: 0.7,
    },
    '50%': {
      opacity: 0,
    },
  },
});

const TerminalPreview: React.FC = () => {
  const { themeConfig } = useTheme();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Terminal Preview</Typography>
      <Terminal>
        <TerminalHeader>
          <TerminalButtons>
            <CircleButton color="#ff5f57" />
            <CircleButton color="#febc2e" />
            <CircleButton color="#28c840" />
          </TerminalButtons>
          <TerminalTitle>terminal</TerminalTitle>
          <Box sx={{ width: '50px' }} /> {/* Spacer to center the title */}
        </TerminalHeader>

        <TerminalBody>
          {/* Simple rendering of blocks */}
          {themeConfig?.blocks?.map((block: any, blockIndex: number) => (
            <Prompt key={blockIndex}>
              {/* Simple rendering of segments */}
              <PromptSegments>
                {block?.segments?.map((segment: any, segmentIndex: number) => (
                  <Box
                    key={segmentIndex}
                    sx={{
                      bgcolor: segment.background || '#000',
                      color: segment.foreground || '#fff',
                      px: 1,
                      py: 0.5,
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {segment.type === 'path' && '~/Projects/oh-my-posh-builder'}
                    {segment.type === 'git' && '(main)'}
                    {segment.type === 'text' && (segment.properties?.text || 'Text')}
                    {segment.type === 'time' && new Date().toLocaleTimeString()}
                    {segment.type === 'battery' && '100%'}
                    {segment.type === 'os' && 'Windows'}
                    {!['path', 'git', 'text', 'time', 'battery', 'os'].includes(segment.type) && segment.type}
                  </Box>
                ))}
              </PromptSegments>

              {/* Simulate command input */}
              {blockIndex === (themeConfig?.blocks?.length || 0) - 1 && (
                <CommandInput>
                  $ npm start
                </CommandInput>
              )}
            </Prompt>
          ))}

          {/* Sample output */}
          <Box sx={{ color: '#8BC34A', mt: 1 }}>
            &gt; oh-my-posh-profile-builder@0.1.0 start<br />
            &gt; react-scripts start
          </Box>

          <Box sx={{ color: '#CDDC39', mt: 1 }}>
            Starting the development server...<br />
            Compiled successfully!
          </Box>

          <Box sx={{ color: '#fff', mt: 1 }}>
            You can now view oh-my-posh-profile-builder in the browser.<br /><br />
            Local:            http://localhost:3000<br />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box component="span" sx={{ color: '#4CAF50' }}>$ _</Box>
          </Box>
        </TerminalBody>
      </Terminal>
    </Box>
  );
};

export default TerminalPreview;
