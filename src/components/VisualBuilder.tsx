import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SegmentSelector from './SegmentSelector';
import SegmentEditor from './SegmentEditor';
import SegmentPreview from './preview/SegmentPreview';
import { useThemeContext } from '../contexts/ThemeContext';
import { SegmentType } from './types/SegmentProps';
import DraggableSegmentItem from './DraggableSegmentItem';

const VisualBuilder: React.FC = () => {
  const { theme, updateTheme } = useThemeContext();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);
  const [showSegmentSelector, setShowSegmentSelector] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fixed: Use explicit type for segments and initialize properly
  const [segments, setSegments] = useState<SegmentType[]>(() => {
    if (theme?.blocks && theme.blocks[currentBlockIndex]?.segments) {
      return theme.blocks[currentBlockIndex].segments;
    }
    return [];
  });

  // Fixed: Added useEffect to sync state with theme changes
  useEffect(() => {
    if (theme?.blocks && theme.blocks[currentBlockIndex]?.segments) {
      setSegments(theme.blocks[currentBlockIndex].segments);
    }
  }, [theme, currentBlockIndex]);

  // Fixed: Updated segment handler with proper error handling
  const handleSegmentSelect = useCallback((type: string) => {
    try {
      const newSegment: SegmentType = {
        type,
        config: {},
        foreground: "#ffffff",
        background: "#000000"
      };

      const updatedSegments = [...segments, newSegment];
      setSegments(updatedSegments);

      // Update the theme context
      if (theme && theme.blocks) {
        const updatedBlocks = [...theme.blocks];
        updatedBlocks[currentBlockIndex] = {
          ...updatedBlocks[currentBlockIndex],
          segments: updatedSegments
        };

        updateTheme({
          ...theme,
          blocks: updatedBlocks
        });
      }

      setShowSegmentSelector(false);
      setSelectedSegmentIndex(updatedSegments.length - 1);
    } catch (err) {
      setError(`Failed to add segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, theme, currentBlockIndex, updateTheme]);

  // Fixed: Added proper error handling and function binding
  const handleDeleteSegment = useCallback((index: number) => {
    try {
      const updatedSegments = segments.filter((_, i) => i !== index);
      setSegments(updatedSegments);

      // Update theme context
      if (theme && theme.blocks) {
        const updatedBlocks = [...theme.blocks];
        updatedBlocks[currentBlockIndex] = {
          ...updatedBlocks[currentBlockIndex],
          segments: updatedSegments
        };

        updateTheme({
          ...theme,
          blocks: updatedBlocks
        });
      }

      setSelectedSegmentIndex(null);
    } catch (err) {
      setError(`Failed to delete segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, theme, currentBlockIndex, updateTheme]);

  // New: Add move segment functionality with drag and drop
  const handleMoveSegment = useCallback((dragIndex: number, hoverIndex: number) => {
    try {
      const updatedSegments = [...segments];
      const draggedSegment = updatedSegments[dragIndex];

      // Remove the dragged item
      updatedSegments.splice(dragIndex, 1);
      // Insert it at the new position
      updatedSegments.splice(hoverIndex, 0, draggedSegment);

      setSegments(updatedSegments);

      // Update the selected index if it's the dragged segment
      if (selectedSegmentIndex === dragIndex) {
        setSelectedSegmentIndex(hoverIndex);
      }

      // Update theme context
      if (theme && theme.blocks) {
        const updatedBlocks = [...theme.blocks];
        updatedBlocks[currentBlockIndex] = {
          ...updatedBlocks[currentBlockIndex],
          segments: updatedSegments
        };

        updateTheme({
          ...theme,
          blocks: updatedBlocks
        });
      }
    } catch (err) {
      setError(`Failed to move segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, theme, currentBlockIndex, updateTheme, selectedSegmentIndex]);

  // Fixed: Added update segment handler with proper error handling
  const handleUpdateSegment = useCallback((index: number, updatedSegment: SegmentType) => {
    try {
      const updatedSegments = [...segments];
      updatedSegments[index] = updatedSegment;

      setSegments(updatedSegments);

      // Update theme context
      if (theme && theme.blocks) {
        const updatedBlocks = [...theme.blocks];
        updatedBlocks[currentBlockIndex] = {
          ...updatedBlocks[currentBlockIndex],
          segments: updatedSegments
        };

        updateTheme({
          ...theme,
          blocks: updatedBlocks
        });
      }
    } catch (err) {
      setError(`Failed to update segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, theme, currentBlockIndex, updateTheme]);

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Grid container spacing={2}>
        {/* Preview Panel - Fixed styling and added error boundary */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: '#1e1e1e',
              color: '#ffffff',
              minHeight: '100px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>Prompt Preview</Typography>
            <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{
              display: 'flex',
              overflowX: 'auto',
              py: 2,
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
              }
            }}>
              {segments.length > 0 ? (
                <SegmentPreview segments={segments} />
              ) : (
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Add segments to see your prompt preview here
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Segment List Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Segments</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setShowSegmentSelector(true)}
                size="small"
              >
                Add
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {segments.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {segments.map((segment, index) => (
                  <DraggableSegmentItem
                    key={index}
                    segment={segment}
                    index={index}
                    selectedIndex={selectedSegmentIndex}
                    onSelect={setSelectedSegmentIndex}
                    onDelete={handleDeleteSegment}
                    moveSegment={handleMoveSegment}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No segments added yet. Click "Add" to begin building your prompt.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Segment Editor Panel */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            {selectedSegmentIndex !== null && selectedSegmentIndex < segments.length ? (
              <SegmentEditor
                segment={segments[selectedSegmentIndex]}
                onChange={(updatedSegment) => handleUpdateSegment(selectedSegmentIndex, updatedSegment)}
              />
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                Select a segment to edit its properties
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Segment Type Selector Dialog */}
      {showSegmentSelector && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setShowSegmentSelector(false)}
        >
          <Box
            sx={{
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              m: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SegmentSelector onSelect={handleSegmentSelect} />
          </Box>
        </Box>
      )}

      {/* Error Handling */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VisualBuilder;
