import React, { useState } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  Collapse,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useValidation } from '../../contexts/ValidationContext';
import ValidationErrorDisplay from '../ValidationErrorDisplay';

// Import the layout and panel components
import EditorLayout from '../layout/EditorLayout';
import BlocksPanel from '../blocks/BlocksPanel';
import SegmentsPanel from '../segments/SegmentsPanel';
import PreviewPanel from '../preview/PreviewPanel';
import PropertiesPanel from './PropertiesPanel';
import ModalDialog from '../common/ModalDialog';

// Import other necessary components and types
import SegmentSelector from '../segments/SegmentSelector';
import BlockSelector from '../blocks/BlockSelector';
import { createSegmentConfig } from '../factories/SegmentConfigFactory';

// Import custom hooks
import useBlocks from '../../hooks/useBlocks';
import useSegments from '../../hooks/useSegments';

/**
 * VisualBuilder component that orchestrates the visual editor for oh-my-posh themes
 */
const VisualBuilder: React.FC = () => {
  // Use custom hooks for state management
  const {
    blocks,
    selectedBlockIndex,
    error: blockError,
    clearError: clearBlockError,
    addBlock,
    deleteBlock,
    moveBlock,
    selectBlock
  } = useBlocks();

  const {
    segments,
    selectedSegmentIndex,
    error: segmentError,
    clearError: clearSegmentError,
    addSegment,
    deleteSegment,
    moveSegment,
    selectSegment,
    updateSegment
  } = useSegments(selectedBlockIndex);

  // UI state
  const [tabValue, setTabValue] = useState(0);
  const [showSegmentSelector, setShowSegmentSelector] = useState(false);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [showGlobalErrors, setShowGlobalErrors] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get validation errors from context
  const { errors } = useValidation();

  // Count errors not associated with specific blocks
  const globalErrors = errors.filter(error =>
    !error.path.startsWith('/blocks/') &&
    error.path !== 'blocks' &&
    error.path !== '/blocks'
  );

  const hasGlobalErrors = globalErrors.length > 0;

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Event handlers
  const handleAddBlock = () => {
    setShowBlockSelector(true);
  };

  const handleSelectBlock = (blockType: any) => {
    const newBlockIndex = addBlock(blockType);
    if (newBlockIndex >= 0) {
      setTabValue(0); // Switch to Blocks tab
    }
    setShowBlockSelector(false);
  };

  const handleAddSegment = () => {
    setShowSegmentSelector(true);
  };

  const handleSegmentSelect = (type: string) => {
    try {
      // Use the segment config factory to create a properly configured segment
      const rawSegment = createSegmentConfig(type);

      // Ensure segment has the config property required by SegmentType
      const newSegment = {
        ...rawSegment,
        config: rawSegment.properties || {}
      };

      addSegment(newSegment);
      setShowSegmentSelector(false);
    } catch (err) {
      setError(`Failed to add segment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Combine errors from different sources
  const handleError = () => {
    if (blockError) {
      setError(blockError);
      clearBlockError();
    } else if (segmentError) {
      setError(segmentError);
      clearSegmentError();
    }
  };

  // Handle errors from hooks
  React.useEffect(handleError, [blockError, segmentError, clearBlockError, clearSegmentError]);

  // Prepare components for layout
  const previewPanelComponent = (
    <PreviewPanel
      selectedBlockIndex={selectedBlockIndex}
      blocks={blocks}
      onSelectBlock={selectBlock}
    />
  );

  const segmentsPanelComponent = (
    <SegmentsPanel
      segments={segments}
      selectedSegmentIndex={selectedSegmentIndex}
      onSelectSegment={selectSegment}
      onDeleteSegment={deleteSegment}
      onMoveSegment={moveSegment}
      onAddSegment={handleAddSegment}
    />
  );

  const blocksPanelComponent = (
    <BlocksPanel
      blocks={blocks}
      selectedBlockIndex={selectedBlockIndex}
      tabValue={tabValue}
      onTabChange={handleTabChange}
      onSelectBlock={selectBlock}
      onAddBlock={handleAddBlock}
      onDeleteBlock={deleteBlock}
      onMoveBlock={moveBlock}
      segmentsPanel={segmentsPanelComponent}
    />
  );

  const propertiesPanelComponent = (
    <PropertiesPanel
      activeTab={tabValue}
      selectedBlock={blocks[selectedBlockIndex]}
      selectedBlockIndex={selectedBlockIndex}
      selectedSegment={selectedSegmentIndex !== null ? segments[selectedSegmentIndex] : undefined}
      selectedSegmentIndex={selectedSegmentIndex}
      onUpdateSegment={updateSegment}
    />
  );

  // Validation errors footer component
  const validationErrorsComponent = hasGlobalErrors ? (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity="error"
        icon={<ErrorIcon fontSize="inherit" />}
        action={
          <Box
            component="button"
            onClick={() => setShowGlobalErrors(!showGlobalErrors)}
            sx={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontSize: '0.875rem',
              p: 0.5,
            }}
          >
            {showGlobalErrors ? 'Hide' : 'Show'} Details
          </Box>
        }
        sx={{ mb: 1 }}
      >
        Your theme has {globalErrors.length} validation {globalErrors.length === 1 ? 'issue' : 'issues'}
      </Alert>
      <Collapse in={showGlobalErrors}>
        <ValidationErrorDisplay maxHeight={150} />
      </Collapse>
    </Box>
  ) : null;

  return (
    <>
      <EditorLayout
        previewPanel={previewPanelComponent}
        leftSidebar={blocksPanelComponent}
        mainContent={propertiesPanelComponent}
        footer={validationErrorsComponent}
      />

      {/* Modal Dialogs */}
      <ModalDialog
        open={showSegmentSelector}
        onClose={() => setShowSegmentSelector(false)}
      >
        <SegmentSelector onSelect={handleSegmentSelect} />
      </ModalDialog>

      <ModalDialog
        open={showBlockSelector}
        onClose={() => setShowBlockSelector(false)}
      >
        <BlockSelector onSelect={handleSelectBlock} />
      </ModalDialog>

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
    </>
  );
};

export default VisualBuilder;
