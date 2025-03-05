import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider
} from '@mui/material';
import SegmentConfigFactory from './SegmentConfigFactory';
import { SegmentType } from './types/SegmentProps';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`segment-editor-tabpanel-${index}`}
      aria-labelledby={`segment-editor-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `segment-editor-tab-${index}`,
    'aria-controls': `segment-editor-tabpanel-${index}`,
  };
};

interface SegmentEditorProps {
  segment: SegmentType;
  onChange: (updatedSegment: SegmentType) => void;
}

/**
 * Component for editing a segment's configuration and appearance
 */
const SegmentEditor: React.FC<SegmentEditorProps> = ({ segment, onChange }) => {
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle configuration changes
  const handleConfigChange = (newConfig: any) => {
    onChange({
      ...segment,
      config: newConfig
    });
  };

  // Handle foreground color changes
  const handleForegroundChange = (color: string) => {
    onChange({
      ...segment,
      foreground: color
    });
  };

  // Handle background color changes
  const handleBackgroundChange = (color: string) => {
    onChange({
      ...segment,
      background: color
    });
  };

  // Handle style changes
  const handleStyleChange = (style: string) => {
    onChange({
      ...segment,
      style: style
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit {segment.type.charAt(0).toUpperCase() + segment.type.slice(1)} Segment
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="segment editor tabs"
          variant="fullWidth"
        >
          <Tab label="Configuration" {...a11yProps(0)} />
        </Tabs>

        <Divider />

        <Box sx={{ p: 2 }}>
          <TabPanel value={tabValue} index={0}>
            <SegmentConfigFactory
              type={segment.type}
              config={segment.config}
              onChange={handleConfigChange}
              foreground={segment.foreground}
              background={segment.background}
              onForegroundChange={handleForegroundChange}
              onBackgroundChange={handleBackgroundChange}
            />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default SegmentEditor;
