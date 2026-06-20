import { motion } from 'framer-motion';
import { SurvivalChart } from '../components/charts/SurvivalChart';
import { CohortSurvivalChart } from '../components/charts/CohortSurvivalChart';
import { DaysToChurnChart } from '../components/charts/DaysToChurnChart';
import { MilestoneTable } from '../components/MilestoneTable';
import { ParticleField } from '../components/Decorations';

export function Survival() {
  return (
    <motion.section
      id="survival"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <ParticleField count={12} />
      <div className="section-head" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Survival Analysis</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>Customer Survival Curves</motion.h2>
        <motion.p className="section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>Kaplan‑Meier style survival probability over time, stratified by risk tier.</motion.p>
      </div>

      <motion.div className="chart-card" style={{ marginBottom: 1, position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        <div className="chart-head"><div className="chart-title">Survival Probability by Risk Tier</div></div>
        <SurvivalChart />
      </motion.div>

      <motion.div className="charts-grid-3" style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.55 }}>
        <div className="chart-card"><div className="chart-head"><div className="chart-title">Churn at Milestones</div></div><MilestoneTable /></div>
        <div className="chart-card"><div className="chart-head"><div className="chart-title">Cohort: 2024 vs 2025</div></div><CohortSurvivalChart /></div>
        <div className="chart-card"><div className="chart-head"><div className="chart-title">Days to Churn</div></div><DaysToChurnChart /></div>
      </motion.div>
    </motion.section>
  );
}