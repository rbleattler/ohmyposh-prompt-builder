import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid,
  FormHelperText,
  Collapse,
  // Add the proper SelectChangeEvent import
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';
import { useTheme } from '../contexts/ThemeContext';
import { useValidation } from '../contexts/ValidationContext';
import SegmentEditor from './SegmentEditor';
import ValidationErrorDisplay from './ValidationErrorDisplay';
import FormFieldValidation from './FormFieldValidation';

interface BlockEditorProps {
  block: any;
  blockIndex: number;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, blockIndex }) => {
  const { updateBlock, removeBlock, addSegment } = useTheme();
  const { getErrorsForPath } = useValidation();
  const [expanded, setExpanded] = useState(true);
  const [showErrors, setShowErrors] = useState(false);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);

  const blockPath = `/blocks/${blockIndex}`;
  const blockErrors = getErrorsForPath(blockPath);
  const hasErrors = blockErrors.length > 0;

  // Fix the event handler type to use SelectChangeEvent
  const handleTypeChange = (event: SelectChangeEvent<unknown>) => {
    const updatedBlock = { ...block, type: event.target.value as string };
    updateBlock(blockIndex, updatedBlock);
  };

  // Fix the event handler type to use SelectChangeEvent
  const handleAlignmentChange = (event: SelectChangeEvent<unknown>) => {
    const updatedBlock = { ...block, alignment: event.target.value as string };
    updateBlock(blockIndex, updatedBlock);
  };

  const handleNewline = (newlineValue: boolean) => {
    const updatedBlock = { ...block, newline: newlineValue };
    updateBlock(blockIndex, updatedBlock);
  };

  const handleAddSegment = () => {
    addSegment(blockIndex, {
      type: 'path', // Default segment type
      style: 'powerline',
      foreground: '#ffffff',
      background: '#61AFEF',
      properties: {}
    });
  };

  const handleUpdateSegment = (segmentIndex: number, updatedSegment: any) => {
    const updatedSegments = [...(block.segments || [])];
    updatedSegments[segmentIndex] = updatedSegment;

    const updatedBlock = { ...block, segments: updatedSegments };
    updateBlock(blockIndex, updatedBlock);
  };

  const handleRemoveSegment = (segmentIndex: number) => {
    const updatedSegments = [...(block.segments || [])].filter((_, i) => i !== segmentIndex);
    const updatedBlock = { ...block, segments: updatedSegments };
    updateBlock(blockIndex, updatedBlock);

    if (selectedSegmentIndex === segmentIndex) {
      setSelectedSegmentIndex(null);
    } else if (selectedSegmentIndex && selectedSegmentIndex > segmentIndex) {
      setSelectedSegmentIndex(selectedSegmentIndex - 1);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        border: hasErrors ? '1px solid #f44336' : 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: hasErrors ? 'rgba(244, 67, 54, 0.08)' : 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Typography variant="h6" component="div">
            Block {blockIndex + 1}: {block.type || 'Unnamed'}
          </Typography>
          {hasErrors && (
            <Button
              startIcon={<ErrorIcon />}
              color="error"
              size="small"
              onClick={() => setShowErrors(!showErrors)}
              sx={{ ml: 2 }}
            >
              {blockErrors.length} {blockErrors.length === 1 ? 'error' : 'errors'}
            </Button>
          )}
        </Box>
        <IconButton onClick={() => removeBlock(blockIndex)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Show block validation errors */}
      {hasErrors && showErrors && (
        <Box sx={{ px: 2 }}>
          <ValidationErrorDisplay path={blockPath} showTitle={false} />
        </Box>
      )}

      {expanded && (
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" error={!!getErrorsForPath(`${blockPath}/type`).length}>
                <InputLabel id={`block-${blockIndex}-type-label`}>Type</InputLabel>
                <Select
                  labelId={`block-${blockIndex}-type-label`}
                  value={block.type || ''}
                  label="Type"
                  onChange={handleTypeChange}
                  endAdornment={<FormFieldValidation path={`${blockPath}/type`} />}
                >
                  <MenuItem value="prompt">Prompt</MenuItem>
                  <MenuItem value="rprompt">Right Prompt</MenuItem>
                  <MenuItem value="newline">New Line</MenuItem>
                </Select>
                <FormHelperText>
                  Select the block type (required)
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" error={!!getErrorsForPath(`${blockPath}/alignment`).length}>
                <InputLabel id={`block-${blockIndex}-alignment-label`}>Alignment</InputLabel>
                <Select
                  labelId={`block-${blockIndex}-alignment-label`}
                  value={block.alignment || ''}
                  label="Alignment"
                  onChange={handleAlignmentChange}
                  endAdornment={<FormFieldValidation path={`${blockPath}/alignment`} />}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
                <FormHelperText>
                  Horizontal alignment of the block
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" error={!!getErrorsForPath(`${blockPath}/newline`).length}>
                <InputLabel id={`block-${blockIndex}-newline-label`}>New Line</InputLabel>
                {/* Fix the onChange handler to use SelectChangeEvent */}
                <Select
                  labelId={`block-${blockIndex}-newline-label`}
                  value={block.newline === undefined ? "" : block.newline === true ? "true" : "false"}
                  label="New Line"
                  onChange={(e: SelectChangeEvent<unknown>) => handleNewline(e.target.value === "true")}
                  endAdornment={<FormFieldValidation path={`${blockPath}/newline`} />}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
                <FormHelperText>
                  Start this block on a new line
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {/* Segments section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Segments
            </Typography>

            {/* Render segment list */}
            {block.segments && block.segments.length > 0 ? (
              <Box>
                {block.segments.map((segment: any, segmentIndex: number) => (
                  <Card
                    key={segmentIndex}
                    sx={{
                      mb: 2,
                      bgcolor: 'background.paper',
                      border: selectedSegmentIndex === segmentIndex ? '1px solid #1976d2' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedSegmentIndex(segmentIndex === selectedSegmentIndex ? null : segmentIndex)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        bgcolor: segment.background || 'inherit',
                        color: segment.foreground || 'inherit'
                      }}
                    >
                      <Typography variant="body2">
                        {segment.type || 'Unknown segment'} {segmentIndex + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSegment(segmentIndex);
                        }}
                        sx={{ color: 'inherit' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Show segment editor when selected */}
                    <Collapse in={selectedSegmentIndex === segmentIndex}>
                      <CardContent>
                        <SegmentEditor
                          segment={segment}
                          segmentIndex={segmentIndex}
                          blockIndex={blockIndex}
                          onChange={(updatedSegment) => handleUpdateSegment(segmentIndex, updatedSegment)}
                        />
                      </CardContent>
                    </Collapse>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No segments in this block yet. Add a segment to build your prompt.
              </Typography>
            )}

            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddSegment}
              sx={{ mt: 1 }}
            >
              Add Segment
            </Button>

            {/* Validate if the block has segments */}
            {getErrorsForPath(`${blockPath}/segments`).length > 0 && (
              <Box sx={{ mt: 1 }}>
                <FormFieldValidation path={`${blockPath}/segments`} />
                <Typography variant="caption" color="error">
                  This block requires at least one segment
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default BlockEditor;
