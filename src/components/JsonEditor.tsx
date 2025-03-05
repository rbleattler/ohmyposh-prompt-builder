import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { useThemeContext } from '../contexts/ThemeContext';

const JsonEditor: React.FC = () => {
  const { theme, updateTheme, resetTheme } = useThemeContext();
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState<string>('');

  // Convert theme object to editor content with visible escape sequences
  useEffect(() => {
    // Special function to preserve Unicode escapes as visible text
    const preserveUnicodeAsText = (obj: any): string => {
      // First convert to JSON string
      const jsonString = JSON.stringify(obj, null, 2);

      // Function to replace Unicode characters with their escape sequences
      const replaceUnicodeWithEscapes = (str: string): string => {
        return str.replace(/[\u007F-\uFFFF]/g, (char) => {
          const hex = char.charCodeAt(0).toString(16).padStart(4, '0');
          return `\\u${hex}`;
        });
      };

      return replaceUnicodeWithEscapes(jsonString);
    };

    setEditorContent(preserveUnicodeAsText(theme));
  }, [theme]);

  // Setup the editor when it's mounted
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Set up JSON schema validation
    setupJsonValidation(monaco);

    // Set focus to the editor
    editor.focus();
  };

  // Set up JSON schema validation
  const setupJsonValidation = (monaco: Monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json',
          fileMatch: ['*'],
          schema: {
            type: 'object',
            properties: {
              blocks: {
                type: 'array',
                items: { type: 'object' }
              },
              version: { type: 'number' }
            }
          }
        }
      ]
    });
  };

  // Handle the update button click - parse JSON with proper escape handling
  const handleUpdate = () => {
    try {
      if (editorRef.current) {
        const value = editorRef.current.getValue();

        // Parse the JSON while correctly handling Unicode escape sequences
        const parsedJson = JSON.parse(value);
        updateTheme(parsedJson);
      }
    } catch (error) {
      console.error('Invalid JSON', error);
      // You could show an error message to the user here
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">JSON Editor</Typography>
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={handleUpdate}
            sx={{ mr: 1 }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={resetTheme}
          >
            Reset
          </Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, border: '1px solid #333', borderRadius: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={editorContent}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'same',
            automaticLayout: true,
            tabSize: 2,
            fontSize: 14,
            renderLineHighlight: 'all',
          }}
          onMount={handleEditorDidMount}
        />
      </Box>
    </Box>
  );
};

export default JsonEditor;
