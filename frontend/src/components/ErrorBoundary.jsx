

import { Component } from "react";
import { Button } from "daisyui/"; // Or your Button component
import PageLoader from "./PageLoader.jsx"; // Reuse existing loader

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 p-4">
    <div className="card bg-base-100/80 backdrop-blur-sm max-w-md w-full shadow-2xl rounded-3xl text-center space-y-4 p-8">
      <div className="text-error">
        <svg className="mx-auto size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-base-content">Oops! Something went wrong</h2>
      <p className="text-sm opacity-70">{error?.message || "An unexpected error occurred."}</p>
      <div className="space-y-2">
        <Button onClick={resetErrorBoundary} className="btn-primary w-full">
          Try Again
        </Button>
        <Button onClick={() => window.location.reload()} variant="ghost" className="w-full">
          Reload Page
        </Button>
      </div>
    </div>
  </div>
);

export default ErrorFallback;

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // Optional: Send to Sentry/Analytics
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback?.({ error: this.state.error, resetErrorBoundary: this.resetError }) || <PageLoader />; // Default to loader
    }
    return this.props.children;
  }
}