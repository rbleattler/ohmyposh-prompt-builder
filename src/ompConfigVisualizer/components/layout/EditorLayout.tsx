import React from 'react';
import { Grid, Box } from '@mui/material';

interface EditorLayoutProps {
  /**
   * The preview panel component
   */
  previewPanel: React.ReactNode;
  /**
   * The left sidebar component (typically for navigation/selection)
   */
  leftSidebar: React.ReactNode;
  /**
   * The main content area component
   */
  mainContent: React.ReactNode;
  /**
   * Optional footer component
   */
  footer?: React.ReactNode;
}

/**
 * Layout component for the editor that structures the UI into preview, sidebar, and main content areas
 */
const EditorLayout: React.FC<EditorLayoutProps> = ({
  previewPanel,
  leftSidebar,
  mainContent,
  footer
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Preview Area */}
      {previewPanel}

      {/* Main Editor Section with sidebar and content */}
      <Grid container spacing={2}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4}>
          {leftSidebar}
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {mainContent}
        </Grid>
      </Grid>

      {/* Footer/Validation Area */}
      {footer}
    </Box>
  );
};

export default EditorLayout;