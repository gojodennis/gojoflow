import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const DemoBackgroundPaths = lazy(() => import('./pages/DemoBackgroundPaths').then(module => ({ default: module.DemoBackgroundPaths })));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const PomodoroPage = lazy(() => import('./pages/PomodoroPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen w-full bg-background text-foreground">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing Pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="demo" element={<DemoBackgroundPaths />} />
        </Route>

        {/* Dashboard Pages - Protected */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="pomodoro" element={<PomodoroPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
