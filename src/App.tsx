import React from 'react';
import { Box, CssBaseline, ThemeProvider as MuiThemeProvider, createTheme, Paper } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { SchemaProvider } from './contexts/SchemaContext';
import VisualBuilder from './components/VisualBuilder';
import JsonEditor from './components/JsonEditor';
import TerminalPreview from './components/TerminalPreview';
import ResizableLayout from './components/ResizableLayout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SchemaUpdateNotification from './components/SchemaUpdateNotification';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const App: React.FC = () => {
  // Function to handle schema update button clicks
  const handleSchemaUpdateClick = () => {
    // In a real app, this would trigger the schema update process
    // For now, we just show an alert
    alert('In a production environment, this would update the schema. Please run "npm run update-schema" in your terminal.');
  };

  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider>
          <SchemaProvider>
            {/* Add schema update notification */}
            <SchemaUpdateNotification onUpdateClick={handleSchemaUpdateClick} />

            <Box sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: 'background.default',
              color: 'text.primary',
            }}>
              <ResizableLayout
                direction="horizontal"
                initialSizes={[500, 300]}
                minSizes={[200, 200]}
              >
                {/* Top section with editor and preview */}
                <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
                  <ResizableLayout
                    direction="vertical"
                    initialSizes={[600, 400]}
                    minSizes={[300, 300]}
                  >
                    {/* JSON Editor */}
                    <Box sx={{ width: '100%', height: '100%', p: 1 }}>
                      <Paper sx={{ height: '100%', p: 2, overflow: 'hidden' }}>
                        <JsonEditor />
                      </Paper>
                    </Box>

                    {/* Terminal Preview */}
                    <Box sx={{ width: '100%', height: '100%', p: 1 }}>
                      <Paper sx={{ height: '100%', p: 2, overflow: 'hidden' }}>
                        <TerminalPreview />
                      </Paper>
                    </Box>
                  </ResizableLayout>
                </Box>

                {/* Visual Builder */}
                <Box sx={{ width: '100%', height: '100%', p: 1, overflowY: 'auto' }}>
                  <Paper sx={{ p: 2, minHeight: '100%' }}>
                    <VisualBuilder />
                  </Paper>
                </Box>
              </ResizableLayout>
            </Box>
          </SchemaProvider>
        </ThemeProvider>
      </DndProvider>
    </MuiThemeProvider>
  );
};

export default App;
