import React, { Component } from "react";

class ErrorBoundary extends Component<{}, { hasError: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: string) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <></>;
    }
    // @ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
