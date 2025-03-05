import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Divider,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import TerminalIcon from '@mui/icons-material/Terminal';
import AddIcon from '@mui/icons-material/Add';
import { useThemeContext } from '../contexts/ThemeContext';
import { SegmentType } from './types/SegmentProps';
import { BlockConfig } from '../types/BlockConfig';
import DraggableSegmentItem from './DraggableSegmentItem';
import SegmentSelector from './SegmentSelector';
import SegmentEditor from './SegmentEditor';
import BlockList from './blocks/BlockList';
import BlockEditor from './blocks/BlockEditor';
import BlockSelector from './blocks/BlockSelector';
import BlockPreview from './preview/BlockPreview';
import CommandPreview from './preview/CommandPreview';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const VisualBuilder: React.FC = () => {
  const { theme, updateTheme } = useThemeContext();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [showSegmentSelector, setShowSegmentSelector] = useState(false);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [previewMode, setPreviewMode] = useState<'blocks' | 'terminal'>('blocks');

  // Managing blocks state
  const [blocks, setBlocks] = useState<BlockConfig[]>(() => {
    if (theme?.blocks) {
      return theme.blocks;
    }
    // Default to a single left-aligned block if none exists
    return [{ type: 'prompt', alignment: 'left', segments: [] }];
  });

  // Managing current block's segments
  const [segments, setSegments] = useState<SegmentType[]>(() => {
    if (blocks[selectedBlockIndex]?.segments) {
      return blocks[selectedBlockIndex].segments || [];
    }
    return [];
  });

  // Sync blocks with theme
  useEffect(() => {
    if (theme?.blocks) {
      setBlocks(theme.blocks);
      // If selected block index is out of bounds, reset it
      if (selectedBlockIndex >= theme.blocks.length) {
        setSelectedBlockIndex(Math.max(0, theme.blocks.length - 1));
      }
    }
  }, [theme, selectedBlockIndex]);

  // Sync segments with selected block
  useEffect(() => {
    if (blocks[selectedBlockIndex]?.segments) {
      setSegments(blocks[selectedBlockIndex].segments || []);
    } else {
      setSegments([]);
    }
  }, [blocks, selectedBlockIndex]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle preview mode toggle
  const handlePreviewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'blocks' | 'terminal' | null
  ) => {
    if (newMode !== null) {
      setPreviewMode(newMode);
    }
  };

  // Block management functions
  const handleAddBlock = () => {
    setShowBlockSelector(true);
  };

  const handleSelectBlock = (blockType: BlockConfig) => {
    try {
      // Create a new block with the selected type
      const newBlock = {
        ...blockType,
        segments: blockType.segments || []
      };

      // Add the new block to the theme
      const updatedBlocks = [...blocks, newBlock];
      setBlocks(updatedBlocks);

      // Update the theme context
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });

      // Select the new block
      setSelectedBlockIndex(updatedBlocks.length - 1);
      setTabValue(0); // Switch to Blocks tab
      setShowBlockSelector(false);
    } catch (err) {
      setError(`Failed to add block: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteBlock = (index: number) => {
    try {
      // Prevent deleting the last block
      if (blocks.length <= 1) {
        setError("Cannot delete the last block. At least one block is required.");
        return;
      }

      const updatedBlocks = blocks.filter((_, i) => i !== index);
      setBlocks(updatedBlocks);

      // Update theme context
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });

      // If the deleted block was selected, select the first block
      if (selectedBlockIndex === index) {
        setSelectedBlockIndex(0);
      }
      // If the deleted block was before the selected one, adjust the index
      else if (selectedBlockIndex > index) {
        setSelectedBlockIndex(selectedBlockIndex - 1);
      }
    } catch (err) {
      setError(`Failed to delete block: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleUpdateBlock = (updatedBlock: BlockConfig) => {
    try {
      const updatedBlocks = [...blocks];
      updatedBlocks[selectedBlockIndex] = updatedBlock;

      setBlocks(updatedBlocks);

      // Update theme context
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });
    } catch (err) {
      setError(`Failed to update block: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Segment management functions
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

      // Update the block with the new segment
      const updatedBlocks = [...blocks];
      updatedBlocks[selectedBlockIndex] = {
        ...updatedBlocks[selectedBlockIndex],
        segments: updatedSegments
      };

      // Update the theme
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });

      setShowSegmentSelector(false);
      setSelectedSegmentIndex(updatedSegments.length - 1);
    } catch (err) {
      setError(`Failed to add segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, blocks, selectedBlockIndex, theme, updateTheme]);

  const handleDeleteSegment = useCallback((index: number) => {
    try {
      const updatedSegments = segments.filter((_, i) => i !== index);
      setSegments(updatedSegments);

      // Update the block with the updated segments
      const updatedBlocks = [...blocks];
      updatedBlocks[selectedBlockIndex] = {
        ...updatedBlocks[selectedBlockIndex],
        segments: updatedSegments
      };

      // Update the theme
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });

      setSelectedSegmentIndex(null);
    } catch (err) {
      setError(`Failed to delete segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, blocks, selectedBlockIndex, theme, updateTheme]);

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

      // Update the block with the reordered segments
      const updatedBlocks = [...blocks];
      updatedBlocks[selectedBlockIndex] = {
        ...updatedBlocks[selectedBlockIndex],
        segments: updatedSegments
      };

      // Update the theme
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });
    } catch (err) {
      setError(`Failed to move segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, blocks, selectedBlockIndex, selectedSegmentIndex, theme, updateTheme]);

  const handleUpdateSegment = useCallback((index: number, updatedSegment: SegmentType) => {
    try {
      const updatedSegments = [...segments];
      updatedSegments[index] = updatedSegment;

      setSegments(updatedSegments);

      // Update the block with the updated segment
      const updatedBlocks = [...blocks];
      updatedBlocks[selectedBlockIndex] = {
        ...updatedBlocks[selectedBlockIndex],
        segments: updatedSegments
      };

      // Update the theme
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });
    } catch (err) {
      setError(`Failed to update segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [segments, blocks, selectedBlockIndex, theme, updateTheme]);

  // Add new function to handle block reordering
  const handleMoveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    try {
      // Create a copy of the blocks array
      const updatedBlocks = [...blocks];

      // Remove the dragged block
      const [draggedBlock] = updatedBlocks.splice(dragIndex, 1);

      // Insert it at the new position
      updatedBlocks.splice(hoverIndex, 0, draggedBlock);

      // Update the blocks state
      setBlocks(updatedBlocks);

      // If the selected block is being moved, update the selected block index
      if (selectedBlockIndex === dragIndex) {
        setSelectedBlockIndex(hoverIndex);
      }
      // Otherwise, if we're moving a block across the selected block, adjust the index
      else if (
        (dragIndex < selectedBlockIndex && hoverIndex >= selectedBlockIndex) ||
        (dragIndex > selectedBlockIndex && hoverIndex <= selectedBlockIndex)
      ) {
        // If dragging from before to after the selected, move selection down
        if (dragIndex < selectedBlockIndex) {
          setSelectedBlockIndex(selectedBlockIndex - 1);
        }
        // If dragging from after to before the selected, move selection up
        else {
          setSelectedBlockIndex(selectedBlockIndex + 1);
        }
      }

      // Update the theme context
      updateTheme({
        ...theme,
        blocks: updatedBlocks
      });
    } catch (err) {
      setError(`Failed to reorder blocks: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [blocks, selectedBlockIndex, theme, updateTheme]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Preview Panel */}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Prompt Preview</Typography>
            <ToggleButtonGroup
              value={previewMode}
              exclusive
              onChange={handlePreviewModeChange}
              size="small"
              aria-label="preview mode"
            >
              <ToggleButton value="blocks" aria-label="blocks view">
                <ViewQuiltIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="terminal" aria-label="terminal view">
                <TerminalIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

          <Box
            sx={{
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
              }
            }}
          >
            {previewMode === 'blocks' ? (
              <BlockPreview
                blocks={blocks}
                selectedBlockIndex={selectedBlockIndex}
                onSelectBlock={(index) => {
                  setSelectedBlockIndex(index);
                  setTabValue(0); // Switch to Blocks tab when selecting a block
                }}
              />
            ) : (
              <CommandPreview
                blocks={blocks}
                selectedBlockIndex={selectedBlockIndex}
                onSelectBlock={(index) => {
                  setSelectedBlockIndex(index);
                  setTabValue(0); // Switch to Blocks tab when selecting a block
                }}
              />
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Main Editor Section with Tabs */}
      <Grid container spacing={2}>
        {/* Left Panel with Tabs for Blocks and Segments */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="editor tabs"
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab label="Blocks" />
              <Tab label="Segments" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <BlockList
                blocks={blocks}
                selectedBlockIndex={selectedBlockIndex}
                onSelectBlock={setSelectedBlockIndex}
                onAddBlock={handleAddBlock}
                onDeleteBlock={handleDeleteBlock}
                onMoveBlock={handleMoveBlock}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
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
                  No segments in this block. Click "Add" to begin building your prompt.
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>

        {/* Right Panel for Editor */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            {tabValue === 0 ? (
              blocks[selectedBlockIndex] ? (
                <BlockEditor
                  block={blocks[selectedBlockIndex]}
                  onChange={handleUpdateBlock}
                />
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  No block selected. Add or select a block to edit its properties.
                </Typography>
              )
            ) : (
              selectedSegmentIndex !== null && selectedSegmentIndex < segments.length ? (
                <SegmentEditor
                  segment={segments[selectedSegmentIndex]}
                  onChange={(updatedSegment) => handleUpdateSegment(selectedSegmentIndex, updatedSegment)}
                />
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Select a segment to edit its properties or add a new segment.
                </Typography>
              )
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

      {/* Block Type Selector Dialog */}
      {showBlockSelector && (
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
          onClick={() => setShowBlockSelector(false)}
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
            <BlockSelector onSelect={handleSelectBlock} />
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
)};

export default VisualBuilder;
