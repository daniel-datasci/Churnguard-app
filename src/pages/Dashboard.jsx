import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { KPIGrid } from '../components/KPIGrid';
import { TierBands } from '../components/TierBands';
import { DonutChart } from '../components/charts/DonutChart';
import { RevenueBarChart } from '../components/charts/RevenueBarChart';
import { HeatChart } from '../components/charts/HeatChart';
import { Histogram } from '../components/charts/Histogram';
import { ParticleField } from '../components/Decorations';

export function Dashboard() {
  const { meta, customers } = useCustomers();
  const { setTierFilter } = useUIContext();
  const highPct = ((meta.tiers.High / meta.total) * 100).toFixed(0);

  const handleFilter = (tier) => {
    setTierFilter(tier);
  };

  return (
    <motion.section
      id="dashboard"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <ParticleField count={20} />
      <div className="section-head" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="section-tag"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Executive Dashboard
        </motion.div>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Retention Intelligence Overview
        </motion.h2>
        <motion.p
          className="section-sub"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Live risk metrics across your entire customer base.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <KPIGrid meta={meta} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <TierBands onFilter={handleFilter} />
      </motion.div>

      <motion.div
        className="charts-grid"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="chart-card">
          <div className="chart-head">
            <div className="chart-title">Active Customers by Risk Tier</div>
            <div className="chart-desc">Click a slice to filter the explorer</div>
          </div>
          <div className="chart-wrap"><DonutChart /></div>
          <div className="insight">
            <span className="ipill">Key Insight</span>
            <span><strong>{highPct}%</strong> of your base is High Risk — immediate outreach needed.</span>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-head">
            <div className="chart-title">Annual Revenue at Risk vs Expected Loss</div>
            <div className="chart-desc">Click a bar to filter by tier</div>
          </div>
          <div className="chart-wrap"><RevenueBarChart /></div>
          <div className="insight">
            <span className="ipill">Action</span>
            <span>Every 1% reduction in High Risk churn = retained revenue.</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="charts-grid"
        style={{ marginTop: 1, position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.65, duration: 0.6 }}
      >
        <div className="chart-card"><div className="chart-head"><div className="chart-title">Churn Risk by Plan × Cohort</div></div><HeatChart /></div>
        <div className="chart-card"><div className="chart-head"><div className="chart-title">30‑Day Risk Distribution</div></div><Histogram /></div>
      </motion.div>
    </motion.section>
  );
}