import React from 'react';
import { Box, styled } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const TerminalWindow = styled(Box)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#1e1e1e',
  borderRadius: '6px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  border: '1px solid #333'
}));

const TerminalHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#323233',
  height: '32px',
  padding: '0 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  userSelect: 'none'
}));

const TerminalButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px',
}));

const CircleButton = styled(Box)<{ color: string }>(({ color }) => ({
  width: '12px',
  height: '12px',
  backgroundColor: color,
  borderRadius: '50%',
  '&:hover': {
    filter: 'brightness(0.8)',
  },
}));

const TerminalTitle = styled(Box)(({ theme }) => ({
  color: '#fff',
  opacity: 0.8,
  fontSize: '14px',
  textAlign: 'center',
  flex: 1
}));

const TerminalBody = styled(Box)(({ theme }) => ({
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

const Prompt = styled(Box)(({ theme }) => ({
  marginBottom: '6px',
  display: 'flex',
  flexDirection: 'column',
}));

const PromptSegments = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const CommandInput = styled(Box)(({ theme }) => ({
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
}));

const TerminalPreview: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <TerminalWindow>
      <TerminalHeader>
        <TerminalButtons>
          <CircleButton color="#FF5F56" /> {/* Close */}
          <CircleButton color="#FFBD2E" /> {/* Minimize */}
          <CircleButton color="#27C93F" /> {/* Maximize */}
        </TerminalButtons>
        <TerminalTitle>Terminal</TerminalTitle>
        <Box width="48px" /> {/* Empty space to balance the buttons */}
      </TerminalHeader>

      <TerminalBody>
        <Prompt>
          <Box sx={{ color: '#87D441' }}>
            Last login: {new Date().toDateString()} {new Date().toLocaleTimeString()}
          </Box>
        </Prompt>

        <Prompt>
          <PromptSegments>
            <Box component="span" sx={{ color: '#56C1D6' }}>user@hostname</Box>
            <Box component="span" sx={{ mx: 0.5 }}>:</Box>
            <Box component="span" sx={{ color: '#B166DB' }}>~/projects/oh-my-posh</Box>
            <Box component="span" sx={{ ml: 0.5, color: '#56C1D6' }}>$</Box>
          </PromptSegments>
          <CommandInput>oh-my-posh preview</CommandInput>
        </Prompt>

        <Prompt sx={{ mt: 2 }}>
          <Box sx={{ fontWeight: 'bold', color: '#F6DC8D', mb: 1 }}>Oh My Posh Preview</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* This is where the actual prompt preview will render */}
            <Box sx={{
              backgroundColor: '#303030',
              color: 'white',
              px: 1.5, py: 0.5,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px 0 0 4px'
            }}>
              ~/Projects/oh-my-posh
            </Box>
            <Box sx={{
              backgroundColor: '#4E5BA6',
              color: 'white',
              px: 1.5, py: 0.5,
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '6px' }}>main</span>
              <span style={{ opacity: 0.7 }}>+2 ~1</span>
            </Box>
          </Box>
        </Prompt>
      </TerminalBody>
    </TerminalWindow>
  );
};

export default TerminalPreview;
