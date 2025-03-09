import React from 'react';
import { Alert, Button, Snackbar, Typography } from '@mui/material';
import { useSchemaVersion, getLastUpdatedFormatted } from '../services/SchemaService';

interface SchemaUpdateNotificationProps {
  onUpdateClick?: () => void;
}

/**
 * Component to show notification about schema updates
 */
const SchemaUpdateNotification: React.FC<SchemaUpdateNotificationProps> = ({ onUpdateClick }) => {
  const { schemaInfo, isLoading, error } = useSchemaVersion();
  const [open, setOpen] = React.useState(false);

  // Show notification when schema is outdated
  React.useEffect(() => {
    if (schemaInfo?.isOutdated) {
      setOpen(true);
    }
  }, [schemaInfo]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleUpdateClick = () => {
    setOpen(false);
    if (onUpdateClick) {
      onUpdateClick();
    }
  };

  if (isLoading || !schemaInfo || error || !schemaInfo.isOutdated) {
    return null;
  }

  return (
    <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="info"
        variant="filled"
        action={
          <Button color="inherit" size="small" onClick={handleUpdateClick}>
            Update
          </Button>
        }
      >
        <Typography variant="body2">
          Schema may be outdated. Last checked: {getLastUpdatedFormatted(schemaInfo.lastChecked)}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default SchemaUpdateNotification;
