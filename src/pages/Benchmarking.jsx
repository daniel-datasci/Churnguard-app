import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { fmt$ } from '../utils/format';
import { ParticleField } from '../components/Decorations';

export function Benchmarking() {
  const { meta } = useCustomers();
  const health = Math.round(100 - (meta.expectedLoss / meta.arr) * 100);

  return (
    <motion.section
      id="benchmarking"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <ParticleField count={8} />
      <div className="section-head" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Benchmarking</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>How You Compare</motion.h2>
        <motion.p className="section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>Simulated SaaS industry benchmarks.</motion.p>
      </div>

      <motion.div className="benchmark-grid" style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        <motion.div className="benchmark-card" whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
          <h3>Churn Rate</h3>
          <div className="metric-row"><span>Your annual churn</span><strong className="above-avg">6.2%</strong></div>
          <div className="metric-row"><span>Industry average</span><strong>5.0%</strong></div>
        </motion.div>
        <motion.div className="benchmark-card" whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
          <h3>ARR at Risk</h3>
          <div className="metric-row"><span>Your ARR at risk</span><strong className="above-avg">{fmt$(meta.arrByTier.High)}</strong></div>
          <div className="metric-row"><span>Industry median</span><strong>$1.2M</strong></div>
        </motion.div>
        <motion.div className="benchmark-card" whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
          <h3>Health Score</h3>
          <div className="metric-row"><span>Your score</span><strong>{health}/100</strong></div>
          <div className="metric-row"><span>Industry avg</span><strong>78/100</strong></div>
        </motion.div>
        <motion.div className="benchmark-card" whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
          <h3>Support Tickets</h3>
          <div className="metric-row"><span>High‑risk w/ tickets</span><strong>45%</strong></div>
          <div className="metric-row"><span>Industry avg</span><strong>30%</strong></div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}