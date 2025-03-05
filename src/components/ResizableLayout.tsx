import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import { Resizable } from 're-resizable';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ResizeHandle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',

  '&.horizontal': {
    width: '100%',
    height: '10px',
    bottom: '-5px',
    left: 0,
    cursor: 'row-resize',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    '&:hover, &.resizing': {
      backgroundColor: 'rgba(25, 118, 210, 0.2)',
    }
  },

  '&.vertical': {
    width: '10px',
    height: '100%',
    right: '-5px',
    top: 0,
    cursor: 'col-resize',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    '&:hover, &.resizing': {
      backgroundColor: 'rgba(25, 118, 210, 0.2)',
    }
  },

  '& .MuiSvgIcon-root': {
    color: 'rgba(255,255,255,0.4)',
    transition: 'color 0.2s ease',
  },

  '&:hover .MuiSvgIcon-root, &.resizing .MuiSvgIcon-root': {
    color: 'rgba(255,255,255,0.8)',
  },
}));

interface ResizableLayoutProps {
  children: [React.ReactNode, React.ReactNode];
  direction: 'horizontal' | 'vertical';
  initialSizes?: [number, number];
  minSizes?: [number, number];
  maxSizes?: [number | string, number | string];
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  children,
  direction,
  initialSizes = direction === 'horizontal' ? [300, 300] : [400, 400],
  minSizes = [200, 200],
  maxSizes = ['100%', '100%']
}) => {
  const [sizes, setSizes] = useState<[number, number]>(initialSizes);
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStop = (e: any, direction: any, ref: any, d: any) => {
    setIsResizing(false);

    // Update sizes based on direction
    if (direction === 'horizontal') {
      setSizes([
        sizes[0],
        sizes[1] + d.height
      ]);
    } else {
      setSizes([
        sizes[0] + d.width,
        sizes[1]
      ]);
    }
  };

  // Custom handle component with icon indicators
  const renderHandle = (type: 'horizontal' | 'vertical') => (
    <ResizeHandle className={`${type} ${isResizing ? 'resizing' : ''}`}>
      {type === 'horizontal' ? (
        <DragIndicatorIcon fontSize="small" />
      ) : (
        <MoreVertIcon fontSize="small" />
      )}
    </ResizeHandle>
  );

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'column' : 'row',
      position: 'relative',
      width: '100%',
      height: '100%'
    }}>
      <Resizable
        size={{
          width: direction === 'horizontal' ? '100%' : sizes[0],
          height: direction === 'horizontal' ? sizes[0] : '100%'
        }}
        minWidth={direction === 'horizontal' ? '100%' : minSizes[0]}
        minHeight={direction === 'horizontal' ? minSizes[0] : '100%'}
        maxWidth={direction === 'horizontal' ? '100%' : maxSizes[0]}
        maxHeight={direction === 'horizontal' ? maxSizes[0] : '100%'}
        handleComponent={{
          right: direction === 'vertical' ? renderHandle('vertical') : undefined,
          bottom: direction === 'horizontal' ? renderHandle('horizontal') : undefined,
        }}
        handleStyles={{
          right: { width: '10px', right: '-5px' },
          bottom: { height: '10px', bottom: '-5px' }
        }}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={handleResizeStop}
        enable={{
          top: false,
          right: direction === 'vertical',
          bottom: direction === 'horizontal',
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}>
          {children[0]}
        </Box>
      </Resizable>

      <Box sx={{
        flex: 1,
        overflow: 'hidden',
        width: direction === 'vertical' ? 'auto' : '100%',
        height: direction === 'horizontal' ? 'auto' : '100%',
      }}>
        {children[1]}
      </Box>
    </Box>
  );
};

export default ResizableLayout;
