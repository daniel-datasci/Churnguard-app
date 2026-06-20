import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIContext } from '../context/UIContext';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgkjegg'; // your endpoint

export function Onboarding() {
  const { onboardingStarted, onboardingComplete, setOnboardingComplete } = useUIContext();
  const [step, setStep] = useState(2); // start at step 2 (name / email)
  const [founderStatus, setFounderStatus] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startupName, setStartupName] = useState('');

  const sendLog = async (data) => {
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {}
  };

  const goNext = () => {
    if (step === 2) {
      if (!name.trim() || !email.trim()) {
        alert('Please fill in both fields.');
        return;
      }
      sendLog({ step: 'Name & Email', name, email });
    } else if (step === 3) {
      sendLog({ step: 'Founder', isFounder: founderStatus, startup: founderStatus ? startupName : 'N/A' });
    } else if (step === 4) sendLog({ step: 'Story' });
    else if (step === 5) sendLog({ step: 'Terms' });

    if (step < 5) setStep(step + 1);
    else finish();
  };

  const finish = () => {
    sendLog({ step: 'Finished' });
    setOnboardingComplete(true);
  };

  // Don't render if onboarding hasn't been started or is already complete
  if (!onboardingStarted || onboardingComplete) return null;

  return (
    <motion.div
      id="onboarding"
      initial={{ opacity: 1 }}
      animate={{ opacity: onboardingComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1000,
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="onboarding-container">
        <AnimatePresence mode="wait">
          {/* STEP 2 – NAME & EMAIL */}
          {step === 2 && (
            <motion.div
              key="step2"
              className="onboarding-step active"
              initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <h2>May we know <span>who you are</span>?</h2>
              <p>Your name and email — we'll remember your journey.</p>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="btn-group">
                <button className="btn btn-primary" onClick={goNext}>
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 – FOUNDER */}
          {step === 3 && (
            <motion.div
              key="step3"
              className="onboarding-step active"
              initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <h2>Are you a <span>founder</span> or <span>exploring</span>?</h2>
              <div className="founder-toggle">
                <button
                  className={founderStatus === true ? 'selected' : ''}
                  onClick={() => setFounderStatus(true)}
                >
                  I'm a founder
                </button>
                <button
                  className={founderStatus === false ? 'selected' : ''}
                  onClick={() => setFounderStatus(false)}
                >
                  Just exploring
                </button>
              </div>
              {founderStatus && (
                <div className="startup-input show">
                  <input
                    type="text"
                    placeholder="Your startup's name"
                    value={startupName}
                    onChange={e => setStartupName(e.target.value)}
                  />
                </div>
              )}
              <div className="btn-group">
                <button className="btn btn-primary" onClick={goNext}>
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 – STORY */}
          {step === 4 && (
            <motion.div
              key="step4"
              className="onboarding-step active"
              initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <h2>The <span>problem</span> we solved</h2>
              <p style={{ textAlign: 'left', fontSize: '0.95rem' }}>
                A growing startup was bleeding customers monthly with no warning. They turned to{' '}
                <strong style={{ color: 'var(--gold)' }}>Daniel Ifediba</strong>, a data scientist
                specializing in churn prediction, to save their ARR.
                <br />
                <br />
                The questions: <em>Who will churn? When? What's their 30/90/180/365‑day risk? Can we
                group them into tiers for precise action?</em>
              </p>
              <p style={{ marginTop: 14, color: 'var(--gold-muted)' }}>
                Before we proceed — a few terms.
              </p>
              <div className="btn-group">
                <button className="btn btn-primary" onClick={goNext}>
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5 – KEY CONCEPTS */}
          {step === 5 && (
            <motion.div
              key="step5"
              className="onboarding-step active"
              initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <h2>Key <span>concepts</span></h2>
              <div className="terms-list">
                <div className="term-item">
                  <h4>Churn</h4>
                  <p>When a customer stops using your product — the silent killer of recurring revenue.</p>
                </div>
                <div className="term-item">
                  <h4>Survival Analysis</h4>
                  <p>Statistical methods that estimate how long a customer stays before churning.</p>
                </div>
                <div className="term-item">
                  <h4>Kaplan‑Meier Curve</h4>
                  <p>A chart showing the percentage of customers still active over time, by risk tier.</p>
                </div>
                <div className="term-item">
                  <h4>Cox & XGBoost‑Cox</h4>
                  <p>Statistical + machine learning models that predict churn timing with precision.</p>
                </div>
                <div className="term-item">
                  <h4>CV Concordance</h4>
                  <p>A 0‑1 score measuring ranking accuracy. Ours: 0.9784 — near perfect.</p>
                </div>
              </div>
              <div className="btn-group">
                <button className="btn btn-primary" onClick={finish}>
                  Enter Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}