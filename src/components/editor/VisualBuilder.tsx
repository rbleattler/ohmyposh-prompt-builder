import React, { useState } from 'react';
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
  ToggleButton,
  Collapse
} from '@mui/material';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import TerminalIcon from '@mui/icons-material/Terminal';
import AddIcon from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';
import { useTheme } from '../../contexts/ThemeContext';
import { useValidation } from '../../contexts/ValidationContext';
import ValidationErrorDisplay from '../ValidationErrorDisplay';

// Import the BlockConfig interface from types instead of redefining it
import { BlockConfig } from '../../types/BlockConfig';
import { SegmentType } from '../../types/schema/segmentProps';

// Import missing components or define them
import BlockPreview from '../preview/BlockPreview';
import CommandPreview from '../preview/CommandPreview';
import SegmentSelector from '../segments/SegmentSelector';
import BlockSelector from '../blocks/BlockSelector';
import { createSegmentConfig } from '../factories/SegmentConfigFactory';

// Define Block and Segment types for type assertions
interface Block {
  type: string;
  alignment?: 'left' | 'right';
  segments?: any[];
  newline?: boolean;
  [key: string]: any;
}

interface Segment {
  type: string;
  style?: 'plain' | 'diamond' | 'powerline';
  foreground?: string;
  background?: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `vertical-tabpanel-${index}` }
      aria-labelledby={ `vertical-tab-${index}` }
      style={ { width: '100%' } }
      { ...other }
    >
      { value === index && <Box sx={ { pt: 2 } }>{ children }</Box> }
    </div>
  );
};

// Simple segment editor component with required props
const SegmentEditor: React.FC<{
  segment: SegmentType;
  segmentIndex: number;
  blockIndex: number;
  onChange: (updatedSegment: SegmentType) => void;
}> = ({ segment }) => {
  return (
    <Box>
      <Typography variant="h6">Edit { segment.type } Segment</Typography>
      {/* Implement segment editor UI here */ }
    </Box>
  );
};

// Simple block list component
const BlockList: React.FC<{
  blocks: BlockConfig[];
  selectedBlockIndex: number;
  onSelectBlock: (index: number) => void;
  onAddBlock: () => void;
  onDeleteBlock: (index: number) => void;
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void;
}> = ({ blocks, selectedBlockIndex, onSelectBlock, onAddBlock }) => {
  return (
    <Box>
      { blocks.map((block, index) => (
        <Box
          key={ index }
          sx={ {
            p: 1,
            mb: 1,
            bgcolor: selectedBlockIndex === index ? 'primary.dark' : 'background.paper',
            borderRadius: 1,
            cursor: 'pointer'
          } }
          onClick={ () => onSelectBlock(index) }
        >
          <Typography>Block { index + 1 }: { block.type }</Typography>
        </Box>
      )) }
      <Button
        variant="outlined"
        fullWidth
        startIcon={ <AddIcon /> }
        onClick={ onAddBlock }
        sx={ { mt: 1 } }
      >
        Add Block
      </Button>
    </Box>
  );
};

// Simple block editor component
const BlockEditor: React.FC<{
  block: BlockConfig;
  onChange: (updatedBlock: BlockConfig) => void;
}> = ({ block }) => {
  return (
    <Box>
      <Typography variant="h6">Edit { block.type } Block</Typography>
      {/* Implement block editor UI here */ }
    </Box>
  );
};

// DraggableSegmentItem component
const DraggableSegmentItem: React.FC<{
  segment: SegmentType;
  index: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  moveSegment: (dragIndex: number, hoverIndex: number) => void;
}> = ({ segment, index, selectedIndex, onSelect }) => {
  return (
    <Box
      sx={ {
        p: 1,
        mb: 1,
        bgcolor: selectedIndex === index ? 'primary.dark' : 'background.paper',
        borderRadius: 1,
        cursor: 'pointer'
      } }
      onClick={ () => onSelect(index) }
    >
      <Typography>{ segment.type } Segment</Typography>
    </Box>
  );
};

const VisualBuilder: React.FC = () => {
  // Fix: use useTheme instead of useThemeContext
  const { themeConfig, updateTheme } = useTheme();
  const { errors } = useValidation();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [showSegmentSelector, setShowSegmentSelector] = useState(false);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [previewMode, setPreviewMode] = useState<'blocks' | 'terminal'>('blocks');
  const [showGlobalErrors, setShowGlobalErrors] = useState(false);

  // Count errors not associated with specific blocks
  const globalErrors = errors.filter(error =>
    !error.path.startsWith('/blocks/') &&
    error.path !== 'blocks' &&
    error.path !== '/blocks'
  );

  const hasGlobalErrors = globalErrors.length > 0;

  // Managing blocks state
  const [blocks, setBlocks] = useState<BlockConfig[]>(() => {
    if (themeConfig?.blocks) {
      return themeConfig.blocks as unknown as BlockConfig[];
    }
    // Default to a single left-aligned block if none exists
    return [{ type: "prompt", alignment: 'left', segments: [] }];
  });

  // Managing current block's segments
  const [segments, setSegments] = useState<SegmentType[]>(() => {
    if (blocks[selectedBlockIndex]?.segments) {
      // Make sure segments have the required config property
      return (blocks[selectedBlockIndex].segments || []).map(seg => ({
        ...seg,
        config: seg.config || (seg as any).properties || {}  // Use type assertion to avoid TS error
      })) as SegmentType[];
    }
    return [];
  });

  // Sync blocks with theme
  React.useEffect(() => {
    if (themeConfig?.blocks) {
      setBlocks(themeConfig.blocks as unknown as BlockConfig[]);
      // If selected block index is out of bounds, reset it
      if (selectedBlockIndex >= themeConfig.blocks.length) {
        setSelectedBlockIndex(Math.max(0, themeConfig.blocks.length - 1));
      }
    }
  }, [themeConfig, selectedBlockIndex]);

  // Sync segments with selected block
  React.useEffect(() => {
    if (blocks[selectedBlockIndex]?.segments) {
      // Make sure segments have the required config property
      const mappedSegments = (blocks[selectedBlockIndex].segments || []).map(seg => ({
        ...seg,
        config: seg.config || (seg as any).properties || {}  // Use type assertion to avoid TS error
      }));

      setSegments(mappedSegments as SegmentType[]);
    } else {
      setSegments([]);
    }
  }, [blocks, selectedBlockIndex]);

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle preview mode toggle
  const handlePreviewModeChange = (
    _: React.MouseEvent<HTMLElement>,
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
      const newBlock: BlockConfig = {
        ...blockType,
        segments: blockType.segments || []
      };

      // Add the new block to the theme
      const updatedBlocks: BlockConfig[] = [...blocks, newBlock];
      setBlocks(updatedBlocks);

      // Update the theme context
      updateTheme({
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
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
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
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
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
      });
    } catch (err) {
      setError(`Failed to update block: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Segment management functions
  const handleSegmentSelect = (type: string) => {
    try {
      // Use the segment config factory to create a properly configured segment
      const rawSegment = createSegmentConfig(type);

      // Ensure segment has the config property required by SegmentType
      const newSegment: SegmentType = {
        ...rawSegment,
        config: rawSegment.properties || {}
      } as SegmentType;

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
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
      });

      setShowSegmentSelector(false);
      setSelectedSegmentIndex(updatedSegments.length - 1);
    } catch (err) {
      setError(`Failed to add segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteSegment = (index: number) => {
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
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
      });

      setSelectedSegmentIndex(null);
    } catch (err) {
      setError(`Failed to delete segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleMoveSegment = (dragIndex: number, hoverIndex: number) => {
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
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
      });
    } catch (err) {
      setError(`Failed to move segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleUpdateSegment = (index: number, updatedSegment: SegmentType) => {
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
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
      });
    } catch (err) {
      setError(`Failed to update segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Add new function to handle block reordering
  const handleMoveBlock = (dragIndex: number, hoverIndex: number) => {
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
        ...themeConfig,
        blocks: updatedBlocks as unknown as Block[]
      });
    } catch (err) {
      setError(`Failed to reorder blocks: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

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
                block={{
                  type: blocks[selectedBlockIndex]?.type || 'prompt',
                  alignment: blocks[selectedBlockIndex]?.alignment as 'left' | 'right' | undefined,
                  segments: blocks[selectedBlockIndex]?.segments || []
                }}
                isActive={true}
                onClick={() => setSelectedBlockIndex(selectedBlockIndex)}
              />
            ) : (
              <CommandPreview
                selectedBlockIndex={selectedBlockIndex}
                onSelectBlock={(index: number) => {
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
                  segmentIndex={selectedSegmentIndex}
                  blockIndex={selectedBlockIndex}
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

      {/* Global validation errors */}
      {
        hasGlobalErrors && (
          <Box sx={{ mb: 2 }}>
            <Alert
              severity="error"
              icon={<ErrorIcon fontSize="inherit" />}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setShowGlobalErrors(!showGlobalErrors)}
                >
                  {showGlobalErrors ? 'Hide' : 'Show'} Details
                </Button>
              }
            >
              Your theme has {globalErrors.length} validation {globalErrors.length === 1 ? 'issue' : 'issues'}
            </Alert>
            <Collapse in={showGlobalErrors}>
              <ValidationErrorDisplay maxHeight={150} />
            </Collapse>
          </Box>
        )
      }

      {/* Segment Type Selector Dialog */}
      {
        showSegmentSelector && (
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
        )
      }

      {/* Block Type Selector Dialog */}
      {
        showBlockSelector && (
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
        )
      }

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
