import { motion, AnimatePresence } from 'framer-motion';
import { useUIContext } from '../context/UIContext';
import { NotificationBell } from './NotificationBell';

const navItems = [
  'dashboard', 'explorer', 'survival', 'playbook',
  'benchmarking', 'alerts', 'insights',
];

export function Navbar() {
  const {
    activeSection,
    mobileMenuOpen,
    setMobileMenuOpen,
    setOnboardingStarted,
    setOnboardingComplete,
  } = useUIContext();

  const goHome = () => {
    // Reset onboarding state so the Home page renders
    setOnboardingStarted(false);
    setOnboardingComplete(false);
    // Scroll to top in case we are scrolled down
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      {/* Clickable logo */}
      <motion.div
        className="nav-logo"
        onClick={goHome}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="logo-mark" /> ChurnGuard
      </motion.div>

      <div className="nav-links">
        {navItems.map((section) => (
          <a
            key={section}
            href={`#${section}`}
            className={`nav-link ${activeSection === section ? 'active' : ''}`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </a>
        ))}
      </div>

      <div className="nav-right">
        <NotificationBell />
        <div className="nav-badge">
          <span className="pulse-dot" /> CV 0.9784
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navItems.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}