import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Alert,
} from '@mui/material';
import { SchemaControlMapper } from './SchemaControlMapper';
import SchemaControlFactory from '../components/factories/SchemaControlFactory';

/**
 * Test utility to demonstrate schema property mapping
 */
const PropertyMapperTester: React.FC = () => {
  // Sample schema for testing
  const [schema, setSchema] = useState<any>({
    definitions: {
      segment: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { type: 'string' },
          style: {
            type: 'string',
            enum: ['plain', 'diamond', 'powerline'],
            default: 'powerline',
          },
          foreground: {
            type: 'string',
            format: 'color',
            default: '#ffffff',
          },
          background: {
            type: 'string',
            format: 'color',
            default: '#000000',
          },
          properties: {
            type: 'object',
            properties: {},
          },
        },
      },
      gitSegment: {
        allOf: [
          { $ref: '#/definitions/segment' },
          {
            type: 'object',
            properties: {
              properties: {
                type: 'object',
                properties: {
                  branch_icon: {
                    type: 'string',
                    description: 'Icon to display before branch name',
                  },
                  display_status: {
                    type: 'boolean',
                    description: 'Show changes, additions, deletions',
                    default: true,
                  },
                  display_stash_count: {
                    type: 'boolean',
                    description: 'Display stash count',
                    default: false,
                  },
                  status_colors: {
                    type: 'object',
                    description: 'Colors for different git statuses',
                    properties: {
                      clean: {
                        type: 'string',
                        format: 'color',
                        default: '#00ff00',
                      },
                      modified: {
                        type: 'string',
                        format: 'color',
                        default: '#ff9900',
                      },
                    },
                  },
                  icons: {
                    type: 'array',
                    description: 'Custom icons for git status',
                    items: {
                      type: 'object',
                      properties: {
                        status: {
                          type: 'string',
                          enum: ['added', 'modified', 'deleted', 'renamed', 'untracked'],
                        },
                        icon: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  });

  const [schemaJson, setSchemaJson] = useState<string>(JSON.stringify(schema, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState<string>('git');
  const [propertySchema, setPropertySchema] = useState<any>({
    $ref: '#/definitions/gitSegment',
  });
  const [propertyValue, setPropertyValue] = useState<any>({
    type: 'git',
    style: 'powerline',
    foreground: '#ffffff',
    background: '#6495ED',
    properties: {
      branch_icon: '\ue725 ',
      display_status: true,
      display_stash_count: false,
      status_colors: {
        clean: '#00ff00',
        modified: '#ff9900',
      },
      icons: [
        { status: 'added', icon: '+' },
        { status: 'modified', icon: '!' },
      ],
    },
  });

  // Update schema when JSON changes
  useEffect(() => {
    try {
      const parsedSchema = JSON.parse(schemaJson);
      setSchema(parsedSchema);
      setError(null);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  }, [schemaJson]);

  // Function to handle control value changes
  const handleValueChange = (newValue: any) => {
    setPropertyValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Schema Property Mapper Tester
      </Typography>
      <Typography variant="body1" paragraph>
        This utility demonstrates how the schema property mapper works by allowing you to test
        schema definitions and see the resulting UI controls.
      </Typography>

      <Grid container spacing={2}>
        {/* Schema Editor */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Schema (JSON)
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={15}
              value={schemaJson}
              onChange={(e) => setSchemaJson(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Property Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Property Schema
              </Typography>
              <TextField
                multiline
                fullWidth
                rows={5}
                value={JSON.stringify(propertySchema, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setPropertySchema(parsed);
                    setError(null);
                  } catch (err) {
                    setError(`Invalid property schema JSON: ${(err as Error).message}`);
                  }
                }}
                error={!!error}
                helperText={error}
                sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Generated Controls */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Generated Control
            </Typography>

            {error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Box>
                <SchemaControlFactory
                  schema={schema}
                  propertyName={propertyName}
                  propertySchema={propertySchema}
                  value={propertyValue}
                  onChange={handleValueChange}
                  validationPath="test"
                />
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Value:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: '#f5f5f5',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(propertyValue, null, 2)}
                </pre>
              </Paper>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Mapped PropertyDefinition:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: '#f5f5f5',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              >
                {error ? (
                  <Typography color="error">Cannot generate mapping with invalid schema</Typography>
                ) : (
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(
                      new SchemaControlMapper(schema).mapSchemaToPropertyDefinition(
                        propertyName,
                        propertySchema
                      ),
                      null,
                      2
                    )}
                  </pre>
                )}
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyMapperTester;