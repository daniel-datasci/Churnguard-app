import { BrowserRouter } from 'react-router-dom';
import { CustomerProvider } from './context/CustomerContext';
import { UIProvider, useUIContext } from './context/UIContext';
import { Navbar } from './components/Navbar';
import { Hero } from './pages/Hero';
import { Dashboard } from './pages/Dashboard';
import { Explorer } from './pages/Explorer';
import { Survival } from './pages/Survival';
import { Playbook } from './pages/Playbook';
import { Benchmarking } from './pages/Benchmarking';
import { Alerts } from './pages/Alerts';
import { Insights } from './pages/Insights';
import { ChatWidget } from './components/ChatWidget';
import { BackToTop } from './components/BackToTop';
import { Onboarding } from './pages/Onboarding';
import { WeeklySummaryModal } from './components/WeeklySummaryModal';
import { CompareModal } from './components/CompareModal';
import { CustomerSpotlightModal } from './components/CustomerSpotlightModal';
import { Home } from './pages/Home';
import { GrainOverlay, MouseGlow } from './components/Decorations';

// Internal component that decides what to show based on onboarding state
function AppContent() {
  const { onboardingStarted, onboardingComplete } = useUIContext();

  // Home page → Onboarding → Dashboard
  if (!onboardingStarted) return <Home />;
  if (!onboardingComplete) return <Onboarding />;

  // Dashboard (original app)
  return (
    <div className="theme-dark">
      <GrainOverlay />
      <MouseGlow />
      <Navbar />
      <Hero />
      <Dashboard />
      <Explorer />
      <Survival />
      <Playbook />
      <Benchmarking />
      <Alerts />
      <Insights />
      <ChatWidget />
      <BackToTop />
      <CustomerSpotlightModal />
      <CompareModal />
      <WeeklySummaryModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomerProvider>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </CustomerProvider>
    </BrowserRouter>
  );
}