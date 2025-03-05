import React from 'react';
import { Typography } from '@mui/material';

interface IconRendererProps {
  iconValue: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Component for rendering icons from various sources
 * Supports emoji and Nerd Font unicode characters
 */
const IconRenderer: React.FC<IconRendererProps> = ({ iconValue, size = 'md' }) => {
  // If no icon value is provided, return null
  if (!iconValue) return null;

  // Font sizes for different size options
  const fontSizes = {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.5rem',
  };

  // For raw string, just render it directly (likely a nerd font glyph)
  return <Typography component="span" sx={{ fontSize: fontSizes[size] }}>
    {iconValue}
  </Typography>;
};

export default IconRenderer;