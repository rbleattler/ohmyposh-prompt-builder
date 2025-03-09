import React from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
  Divider
} from '@mui/material';

interface GitSegmentConfigProps {
  config: any;
  onChange: (config: any) => void;
}

export const GitSegmentConfig: React.FC<GitSegmentConfigProps> = ({ config, onChange }) => {
  const handleChange = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleNumberChange = (key: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      handleChange(key, numValue);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Git Status Configuration</Typography>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Branch Name"
          value={config.branch || ''}
          onChange={(e) => handleChange('branch', e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Ahead Count"
          type="number"
          value={config.ahead || 0}
          onChange={(e) => handleNumberChange('ahead', e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Behind Count"
          type="number"
          value={config.behind || 0}
          onChange={(e) => handleNumberChange('behind', e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Added"
          type="number"
          value={config.added || 0}
          onChange={(e) => handleNumberChange('added', e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Modified"
          type="number"
          value={config.modified || 0}
          onChange={(e) => handleNumberChange('modified', e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Deleted"
          type="number"
          value={config.deleted || 0}
          onChange={(e) => handleNumberChange('deleted', e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Stash Count"
          type="number"
          value={config.stashCount || 0}
          onChange={(e) => handleNumberChange('stashCount', e.target.value)}
          variant="outlined"
          size="small"
        />
      </Grid>

      <Grid item xs={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={config.dirty || false}
                onChange={(e) => handleChange('dirty', e.target.checked)}
              />
            }
            label="Working Directory Dirty"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={config.showStatus !== false}
                onChange={(e) => handleChange('showStatus', e.target.checked)}
              />
            }
            label="Show File Status"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={config.showAheadBehind !== false}
                onChange={(e) => handleChange('showAheadBehind', e.target.checked)}
              />
            }
            label="Show Ahead/Behind"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={config.showStashCount || false}
                onChange={(e) => handleChange('showStashCount', e.target.checked)}
              />
            }
            label="Show Stash Count"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default GitSegmentConfig;
