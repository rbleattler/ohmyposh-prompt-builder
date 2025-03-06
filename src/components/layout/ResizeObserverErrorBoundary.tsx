import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ResizeObserverErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: false }; // Don't update state, just suppress the error
  }

  componentDidCatch(error: Error, _: ErrorInfo) {
    console.log("Error: ", error);
    // Suppress ResizeObserver loop errors in both development and production
    if (error.message.includes('ResizeObserver loop completed with undelivered notifications.')) {
      return;
    }

    // Only log other errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ResizeObserverErrorBoundary caught an error:', error);
    }
  }

  render() {
    return this.props.children;
  }
}

export default ResizeObserverErrorBoundary;