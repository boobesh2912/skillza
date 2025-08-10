import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import Pages
import AuthPage from './pages/AuthPage';
import DiscoverPage from './pages/DiscoverPage';
import OnboardingPage from './pages/OnboardingPage';
import RequestsPage from './pages/RequestsPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import LandingPage from './pages/LandingPage';

// Import Context, Layout, and PrivateRoute
import AuthContext from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './context/PrivateRoute';

const HomePage = () => {
  const { user } = React.useContext(AuthContext);
  return user ? <Navigate to="/dashboard" /> : <LandingPage />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<DiscoverPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;