import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Resizable } from 're-resizable';

interface ResizableLayoutProps {
  direction: 'horizontal' | 'vertical';
  initialSizes: number[];
  minSizes?: number[];
  children: React.ReactNode[];
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  direction,
  initialSizes,
  minSizes = [],
  children
}) => {
  const [sizes, setSizes] = useState<number[]>(initialSizes);
  const [containerSize, setContainerSize] = useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Initialize container size
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize(direction === 'horizontal' ? width : height);
    }

    // Add window resize listener
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize(direction === 'horizontal' ? width : height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [direction]);

  // Handle resize of a pane
  const handleResize = (index: number, size: number) => {
    const newSizes = [...sizes];
    const oldSize = newSizes[index];
    newSizes[index] = size;

    // Adjust the next pane to maintain total size
    if (index < newSizes.length - 1) {
      newSizes[index + 1] += (oldSize - size);
    }

    setSizes(newSizes);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (!child) return null;

        const isLastPane = index === React.Children.count(children) - 1;
        const size = sizes[index] || 0;
        const minSize = minSizes[index] || 100;

        return (
          <Resizable
            size={{
              width: direction === 'horizontal' ? size : '100%',
              height: direction === 'vertical' ? size : '100%'
            }}
            minWidth={direction === 'horizontal' ? minSize : '100%'}
            minHeight={direction === 'vertical' ? minSize : '100%'}
            enable={{
              top: direction === 'vertical' && index !== 0,
              right: direction === 'horizontal' && !isLastPane,
              bottom: direction === 'vertical' && !isLastPane,
              left: direction === 'horizontal' && index !== 0,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            onResizeStop={(e, resizeDirection, ref, d) => {
              const newSize = direction === 'horizontal'
                ? size + d.width
                : size + d.height;
              handleResize(index, newSize);
            }}
            style={{ overflow: 'hidden' }}
          >
            {child}
          </Resizable>
        );
      })}
    </Box>
  );
};

export default ResizableLayout;
