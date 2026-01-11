
import React from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated, loading, signOut } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-brand-primary animate-spin" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        <DashboardPage onLogout={signOut} />
      ) : (
        <LoginPage onLoginSuccess={() => {}} />
      )}
    </div>
  );
};

export default App;
