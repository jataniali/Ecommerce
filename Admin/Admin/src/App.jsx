import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ShopcontextProvider from '../../../frontend/src/context/ShopConext';
import Admin from './pages/Admin/Admin';

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              An error occurred in the application. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <Router basename="/admin">
      <ShopcontextProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                  {/* All admin routes are nested under the Admin component */}
                  <Route path="/*" element={<Admin />} />
                  {/* Catch-all route redirects to admin */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </ErrorBoundary>
      </ShopcontextProvider>
    </Router>
  );
};

export default App;
