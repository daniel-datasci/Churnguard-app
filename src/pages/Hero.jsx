import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { fmt$ } from '../utils/format';

export function Hero() {
  const { meta } = useCustomers();
  const { setSummaryOpen } = useUIContext();
  const healthScore = Math.round(100 - (meta.expectedLoss / meta.arr) * 100);
  const [rescuePct, setRescuePct] = useState(0);

  return (
    <motion.div
      className="hero"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className="hero-content">
        <div className="hero-tag">Survival Analysis · XGBoost‑Cox · Real‑Time Intelligence</div>
        <h1 className="hero-title">Predict churn<br />before it <em>happens</em></h1>
        <p className="hero-sub">
          ChurnGuard combines high predictive models — ranking active customers by exact churn risk, days to churn, and revenue impact.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#dashboard">Open Dashboard</a>
          <a className="btn btn-ghost" href="#explorer">Explore Customers →</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="hs-val">{meta.total.toLocaleString()}</div><div className="hs-label">Active</div></div>
          <div className="hero-stat"><div className="hs-val hs-accent">0.9784</div><div className="hs-label">Concordance</div></div>
          <div className="hero-stat"><div className="hs-val">{fmt$(meta.arr)}</div><div className="hs-label">Active ARR</div></div>
          <div className="hero-stat"><div className="hs-val">{fmt$(meta.expectedLoss)}</div><div className="hs-label">Annual Loss</div></div>
        </div>
        <div className="health-score">
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Retention Health Score</div>
          <div className="score-val">{healthScore}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>out of 100</div>
        </div>
        <div className="arr-calculator">
          <h3>ARR Rescue Calculator</h3>
          <div className="slider-container">
            <label>Reduce High‑Risk Churn by</label>
            <input type="range" min="0" max="100" value={rescuePct} onChange={e => setRescuePct(Number(e.target.value))} />
            <span>{rescuePct}%</span>
          </div>
          <div className="saved-amount">{fmt$(Math.round(meta.expectedLoss * (rescuePct / 100)))}/year saved</div>
          <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={() => setSummaryOpen(true)}>
            Weekly Executive Summary →
          </button>
        </div>
      </div>
    </motion.div>
  );
}