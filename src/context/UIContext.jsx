import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingStarted, setOnboardingStarted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [slackWebhookURL, setSlackWebhookURL] = useState(
    () => localStorage.getItem('churnguard_slack_webhook') || ''
  );
  const [autoAlertInterval, setAutoAlertInterval] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());
  const [spotlightCustomerId, setSpotlightCustomerId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Explorer filter state
  const [tierFilter, setTierFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll spy
  useEffect(() => {
    const sections = ['dashboard','explorer','survival','playbook','benchmarking','alerts','insights'];
    const handleScroll = () => {
      const sy = window.scrollY + 100;
      let current = sections[0];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && sy >= el.offsetTop) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <UIContext.Provider
      value={{
        activeSection,
        setActiveSection,
        mobileMenuOpen,
        setMobileMenuOpen,
        onboardingStarted,
        setOnboardingStarted,
        onboardingComplete,
        setOnboardingComplete,
        slackWebhookURL,
        setSlackWebhookURL,
        autoAlertInterval,
        setAutoAlertInterval,
        selectedCustomers,
        setSelectedCustomers,
        spotlightCustomerId,
        setSpotlightCustomerId,
        compareIds,
        setCompareIds,
        summaryOpen,
        setSummaryOpen,
        tierFilter,
        setTierFilter,
        planFilter,
        setPlanFilter,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  return useContext(UIContext);
}