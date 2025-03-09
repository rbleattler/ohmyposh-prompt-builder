import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { Resizable } from 're-resizable';
import ResizeObserverErrorBoundary from './ResizeObserverErrorBoundary';

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
  const resizeTracking = useRef({ index: -1, startSize: 0, nextStartSize: 0 });
  const rafId = useRef<number>();
  const isResizing = useRef(false);

  // Debounced update function using requestAnimationFrame
  const updateContainerSize = useCallback(() => {
    if (!containerRef.current || isResizing.current) return;

    const doUpdate = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      const totalSize = direction === 'horizontal' ? width : height;
      setContainerSize(totalSize);

      // Only update sizes if we have a significant change
      if (Math.abs(totalSize - containerSize) < 1) return;

      const childCount = React.Children.count(children);
      if (childCount === 0) return;

      // Calculate total of minimum sizes
      const totalMinSize = minSizes.reduce((sum, size, i) =>
        sum + (i < childCount ? (size || 100) : 0), 0);

      // Calculate available space after accounting for minimum sizes
      const availableSpace = Math.max(0, totalSize - totalMinSize);

      // Calculate initial proportions
      const totalInitialSize = initialSizes
        .slice(0, childCount)
        .reduce((sum, size) => sum + size, 0);

      // Create new sizes that respect minimum sizes and proportions
      const newSizes = Array(childCount).fill(0).map((_, i) => {
        const minSize = minSizes[i] || 100;
        if (totalInitialSize === 0) {
          // Equal distribution if no initial sizes
          return minSize + (availableSpace / childCount);
        } else {
          // Proportional distribution based on initial sizes
          const proportion = initialSizes[i] / totalInitialSize;
          return minSize + (proportion * availableSpace);
        }
      });

      setSizes(newSizes);
    };

    // Cancel any pending animation frame
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    // Schedule the update
    rafId.current = requestAnimationFrame(doUpdate);
  }, [direction, children, containerSize, initialSizes, minSizes]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateContainerSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [updateContainerSize]);

  // Handle resize of a pane
  const handleResize = (index: number, delta: number) => {
    setSizes(prevSizes => {
      const newSizes = [...prevSizes];

      // Get the actual current sizes for the affected panes
      const currentSize = resizeTracking.current.index === index
        ? resizeTracking.current.startSize + delta
        : newSizes[index];

      const nextCurrentSize = index < newSizes.length - 1
        ? (resizeTracking.current.index === index
          ? resizeTracking.current.nextStartSize - delta
          : newSizes[index + 1])
        : 0;

      // Apply minimum size constraints
      const effectiveMinSize = minSizes[index] || 100;
      const nextMinSize = index < newSizes.length - 1 ? (minSizes[index + 1] || 100) : 0;

      // Calculate the maximum allowed delta
      const maxDelta = Math.min(
        nextCurrentSize - nextMinSize,
        currentSize - effectiveMinSize
      );

      // Apply the constrained delta
      const constrainedDelta = Math.max(-maxDelta, Math.min(delta, maxDelta));
      if (Math.abs(constrainedDelta) < 1) return prevSizes;

      // Update sizes with constrained delta
      newSizes[index] = resizeTracking.current.startSize + constrainedDelta;
      if (index < newSizes.length - 1) {
        newSizes[index + 1] = resizeTracking.current.nextStartSize - constrainedDelta;
      }

      return newSizes;
    });
  };

  const handleResizeStart = (index: number) => {
    isResizing.current = true;
    resizeTracking.current = {
      index,
      startSize: sizes[index],
      nextStartSize: index < sizes.length - 1 ? sizes[index + 1] : 0
    };
  };

  const handleResizeStop = () => {
    isResizing.current = false;
    resizeTracking.current = { index: -1, startSize: 0, nextStartSize: 0 };
    // Trigger one final update
    updateContainerSize();
  };

  return (
    <ResizeObserverErrorBoundary>
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
          const maxSize = containerSize - (React.Children.count(children) - 1) * minSize;

          return (
            <Resizable
              size={{
                width: direction === 'horizontal' ? size : '100%',
                height: direction === 'vertical' ? size : '100%'
              }}
              minWidth={direction === 'horizontal' ? minSize : '100%'}
              minHeight={direction === 'vertical' ? minSize : '100%'}
              maxWidth={direction === 'horizontal' ? maxSize : '100%'}
              maxHeight={direction === 'vertical' ? maxSize : '100%'}
              enable={{
                top: false,
                right: direction === 'horizontal' && !isLastPane,
                bottom: direction === 'vertical' && !isLastPane,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false
              }}
              handleStyles={{
                right: direction === 'horizontal' ? {
                  width: '8px',
                  right: '-4px',
                  cursor: 'col-resize',
                  backgroundColor: 'rgba(128, 128, 128, 0.2)'
                } : {},
                bottom: direction === 'vertical' ? {
                  height: '8px',
                  bottom: '-4px',
                  cursor: 'row-resize',
                  backgroundColor: 'rgba(128, 128, 128, 0.2)'
                } : {}
              }}
              handleClasses={{
                right: 'resizer-right',
                bottom: 'resizer-bottom'
              }}
              onResizeStart={() => handleResizeStart(index)}
              onResize={(_, resizeDirection, __, d) => {
                const delta = resizeDirection === 'right' || resizeDirection === 'bottom'
                  ? d.width || d.height
                  : -(d.width || d.height);
                handleResize(index, delta);
              }}
              onResizeStop={handleResizeStop}
              style={{ overflow: 'hidden' }}
            >
              {child}
            </Resizable>
          );
        })}
      </Box>
    </ResizeObserverErrorBoundary>
  );
};

export default ResizableLayout;
