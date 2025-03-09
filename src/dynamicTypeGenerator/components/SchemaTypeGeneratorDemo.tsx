import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  TextField,
  Grid
} from '@mui/material';
import { compile } from 'json-schema-to-typescript';
import sampleSchema from './schema.json';

const SchemaTypeGeneratorDemo: React.FC = () => {
  const [schema, setSchema] = useState<string>(JSON.stringify(sampleSchema, null, 2));
  const [generatedTypes, setGeneratedTypes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const parsedSchema = JSON.parse(schema);
      const result = await compile(parsedSchema, 'GeneratedType', {
        bannerComment: '',
        style: {
          singleQuote: true,
        }
      });

      setGeneratedTypes(result);
    } catch (err) {
      console.error('Error generating types:', err);
      setError(`Error generating types: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate types on component mount
    generateTypes();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON Schema to TypeScript Demo
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            JSON Schema
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={20}
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            variant="outlined"
            sx={{ fontFamily: 'monospace' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Generated TypeScript
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Box
              sx={{
                bgcolor: 'background.paper',
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                height: '452px',
                overflow: 'auto',
                whiteSpace: 'pre'
              }}
            >
              {generatedTypes}
            </Box>
          )}
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={generateTypes}
          disabled={loading}
        >
          Generate Types
        </Button>
      </Box>
    </Paper>
  );
};

export default SchemaTypeGeneratorDemo;
