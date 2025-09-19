import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-red-200 p-8 max-w-lg w-full">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800">Something went wrong</h2>
                <p className="text-red-600">
                  {this.state.error ? this.state.error.toString() : 'An unexpected error occurred'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 overflow-auto max-h-40">
              <pre className="text-xs text-gray-700">
                {this.state.errorInfo?.componentStack || 'No detailed information available'}
              </pre>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Reload Page
              </button>
              
              <Link
                to="/"
                className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;