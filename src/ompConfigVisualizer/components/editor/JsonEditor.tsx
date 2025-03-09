import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Tooltip, IconButton } from '@mui/material';
import Editor, { Monaco } from '@monaco-editor/react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SaveIcon from '@mui/icons-material/Save';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '../../contexts/ThemeContext';
import { useValidation } from '../../contexts/ValidationContext';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import schema from '../../schemas/schema.json';

const JsonEditor: React.FC = () => {
  const { themeConfig, updateTheme } = useTheme();
  const { isValid, validateConfig, errors } = useValidation();
  const [jsonValue, setJsonValue] = useState<string>('');
  const [hasJsonError, setHasJsonError] = useState<boolean>(false);
  const [jsonErrorMessage, setJsonErrorMessage] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const monacoRef = useRef<Monaco | null>(null);

  // Format the theme configuration as JSON
  const formatJson = (json: any): string => {
    return JSON.stringify(json, null, 2);
  };

  // Update the JSON value when the theme changes
  useEffect(() => {
    if (themeConfig) {
      setJsonValue(formatJson(themeConfig));
    }
  }, [themeConfig]);

  // Handle editor initialization
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    try {
      monacoRef.current = monaco;

      // Configure editor settings
      monaco.editor.defineTheme('oh-my-posh-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.lineHighlightBackground': '#2a2a2a',
        }
      });

      monaco.editor.setTheme('oh-my-posh-dark');

      // Configure JSON language to properly display Unicode characters
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        enableSchemaRequest: true,
        allowComments: true,
        trailingCommas: 'ignore',
        schemaValidation: 'error',
        schemas: [
          {
            uri: 'https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json',
            fileMatch: ['*'],
            schema: schema
          }
        ]
      });

      // Configure the JSON editor model to properly display Unicode characters
      const model = editor.getModel();
      if (model) {
        // This forces Monaco to decode Unicode escape sequences when displaying
        model.updateOptions({
          tabSize: 2,
          insertSpaces: true
        });
      }

      // Fix Unicode rendering issue
      const originalStringifyFn = JSON.stringify;
      const enhancedStringifyFn = (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number) => {
        // Use the standard stringify function first
        const jsonStr = originalStringifyFn(value, replacer, space);

        // Return a pre-processed version with Unicode sequences converted
        return jsonStr.replace(/\\u([a-fA-F0-9]{4})/g, (_, code) =>
          String.fromCharCode(parseInt(code, 16))
        );
      };

      // Apply the enhanced stringify when formatting is triggered
      editor.addAction({
        id: 'format-with-unicode',
        label: 'Format with Unicode Characters',
        keybindings: [
          monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF
        ],
        run: () => {
          try {
            const currentValue = editor.getValue();
            const jsonObj = JSON.parse(currentValue);
            const formatted = enhancedStringifyFn(jsonObj, undefined, 2);
            editor.setValue(formatted);
          } catch (e) {
            console.error('Failed to format JSON with Unicode:', e);
          }
        }
      });
    } catch (error) {
      console.log('ResizeObserver loop error:', error);
      console.error('ResizeObserver loop error:', error);
    }
  };

  // Handle changes to the JSON in the editor
  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setJsonValue(value);

    try {
      JSON.parse(value);
      setHasJsonError(false);
      setJsonErrorMessage('');
    } catch (error) {
      setHasJsonError(true);
      setJsonErrorMessage(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle applying changes to the theme
  const handleApply = () => {
    if (hasJsonError) return;

    try {
      const parsedJson = JSON.parse(jsonValue);
      updateTheme(parsedJson);
      validateConfig(); // Validate after applying changes
    } catch (error) {
      console.error('Error applying JSON changes:', error);
    }
  };

  // Format function with Unicode handling
  const handleFormat = () => {
    try {
      const parsedJson = JSON.parse(jsonValue);
      // Format with Unicode character display
      const formattedJson = JSON.stringify(parsedJson, null, 2)
        .replace(/\\u([a-fA-F0-9]{4})/g, (_, code) =>
          String.fromCharCode(parseInt(code, 16))
        );

      setJsonValue(formattedJson);
      setHasJsonError(false);
      setJsonErrorMessage('');
    } catch (error) {
      // If JSON is invalid, don't change anything
      console.error('Error formatting JSON:', error);
    }
  };

  // Handle copying JSON to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonValue).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <Box sx={ { height: '100%', display: 'flex', flexDirection: 'column' } }>
      <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 } }>
        <Typography variant="h6" component="h2">JSON Editor</Typography>
        <Box sx={ { display: 'flex', gap: 1 } }>
          <Tooltip title="Format JSON">
            <span>
              <IconButton
                size="small"
                onClick={ handleFormat }
                disabled={ hasJsonError }
                color="primary"
              >
                <AutoFixHighIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={ isCopied ? "Copied!" : "Copy to clipboard" }>
            <IconButton size="small" onClick={ handleCopy } color="primary">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Show validation status */ }
      <Box sx={ { display: 'flex', alignItems: 'center', mb: 1 } }>
        { isValid ? (
          <Typography
            variant="caption"
            color="success.main"
            sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }
          >
            <CheckCircleIcon fontSize="small" />
            Valid configuration
          </Typography>
        ) : (
          <Typography
            variant="caption"
            color="error"
            sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }
          >
            <ReportProblemIcon fontSize="small" />
            Configuration has { errors.length } validation { errors.length === 1 ? 'error' : 'errors' }
          </Typography>
        ) }
      </Box>

      {/* JSON Editor */ }
      <Box sx={ {
        flexGrow: 1,
        border: hasJsonError ? '1px solid #f44336' : '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '4px',
        overflow: 'hidden'
      } }>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={ jsonValue }
          onChange={ handleEditorChange }
          onMount={ handleEditorDidMount }
          options={ {
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            formatOnPaste: true,
            automaticLayout: true,
          } }
        />
      </Box>

      {/* JSON Error Message */ }
      { hasJsonError && (
        <Typography variant="caption" color="error" sx={ { mt: 1 } }>
          { jsonErrorMessage }
        </Typography>
      ) }

      {/* Validation Errors */ }
      <ValidationErrorDisplay maxHeight={ 150 } />

      <Box sx={ { display: 'flex', justifyContent: 'flex-end', mt: 1 } }>
        <Button
          variant="contained"
          color="primary"
          onClick={ handleApply }
          disabled={ hasJsonError }
          startIcon={ <SaveIcon /> }
        >
          Apply Changes
        </Button>
      </Box>
    </Box>
  );
};

export default JsonEditor;
