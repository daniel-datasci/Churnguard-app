import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleField } from '../components/Decorations';

export function Playbook() {
  const [activeTier, setActiveTier] = useState('high');

  const content = {
    high: (
      <div className="playbook-card">
        <div className="playbook-step"><div className="step-number">1</div><div className="step-content"><h4>Immediate Outreach</h4><p>Contact within 24 hours. Use the template below or schedule a CSM call.</p><div className="email-template">Subject: Quick check‑in – how are things going?\n\nHi [Name],\n\nI noticed you haven't used [Product] much recently — I wanted to personally check if everything is okay. Could we set up a 15‑minute call this week?\n\nBest,\n[Your Name]</div></div></div>
        <div className="playbook-step"><div className="step-number">2</div><div className="step-content"><h4>In‑App Engagement</h4><p>Send a targeted notification highlighting an unused feature or offer a personalised onboarding session.</p></div></div>
        <div className="playbook-step"><div className="step-number">3</div><div className="step-content"><h4>Offer Incentive</h4><p>Consider a discount for the next billing cycle or a free month in exchange for a feedback call.</p></div></div>
        <ul className="checklist"><li>Send outreach email</li><li>Schedule CSM call</li><li>Review support history</li><li>Notify product team</li></ul>
      </div>
    ),
    medium: (
      <div className="playbook-card">
        <div className="playbook-step"><div className="step-number">1</div><div className="step-content"><h4>Proactive Check‑in</h4><p>Send a friendly email offering tips. Template:</p><div className="email-template">Subject: We've got some tips for you!\n\nHi [Name],\n\nYou might not be using [Feature X] to its full potential. Here's a quick guide. Let us know if you'd like a walk‑through!\n\nCheers,\n[Your Name]</div></div></div>
        <div className="playbook-step"><div className="step-number">2</div><div className="step-content"><h4>Feedback Request</h4><p>Show a subtle NPS survey or a "How are we doing?" prompt.</p></div></div>
        <ul className="checklist"><li>Send tip email</li><li>Monitor logins for 7 days</li><li>Add to watchlist</li></ul>
      </div>
    ),
    low: (
      <div className="playbook-card">
        <div className="playbook-step"><div className="step-number">1</div><div className="step-content"><h4>Maintain Engagement</h4><p>Keep them happy with regular feature updates and community invites.</p></div></div>
        <div className="playbook-step"><div className="step-number">2</div><div className="step-content"><h4>Upsell Opportunity</h4><p>If stable for 6+ months, introduce a higher‑value plan or add‑on.</p></div></div>
        <ul className="checklist"><li>Add to newsletter</li><li>Invite to beta features</li></ul>
      </div>
    ),
  };

  return (
    <motion.section
      id="playbook"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <ParticleField count={10} />
      <div className="section-head" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Retention Playbook</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>Step‑by‑Step Retention Actions</motion.h2>
        <motion.p className="section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>Tailored strategies for each risk tier — turn insights into action.</motion.p>
      </div>

      <div className="playbook-tabs" style={{ position: 'relative', zIndex: 1 }}>
        {['high', 'medium', 'low'].map(tier => (
          <button
            key={tier}
            className={`playbook-tab ${activeTier === tier ? 'active' : ''}`}
            onClick={() => setActiveTier(tier)}
          >
            {tier} Risk
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTier}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {content[activeTier]}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}