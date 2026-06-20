import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { TableControls } from '../components/TableControls';
import { CustomerTable } from '../components/CustomerTable';
import { fmt$ } from '../utils/format';
import { ParticleField } from '../components/Decorations';

export function Explorer() {
  const { customers } = useCustomers();
  const {
    tierFilter, setTierFilter,
    planFilter, setPlanFilter,
    searchQuery, setSearchQuery,
    selectedCustomers, setSelectedCustomers,
    setSpotlightCustomerId,
    setCompareIds,
  } = useUIContext();

  const filtered = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    let data = customers;
    if (tierFilter !== 'All') data = data.filter(r => r.tier === tierFilter);
    if (planFilter !== 'All') data = data.filter(r => r.plan === planFilter);
    if (q) data = data.filter(r => String(r.id).includes(q) || r.plan.toLowerCase().includes(q));
    return data;
  }, [customers, tierFilter, planFilter, searchQuery]);

  const filteredARR = filtered.reduce((s, r) => s + r.fee * 12, 0);
  const filteredLoss = filtered.reduce((s, r) => s + r.fee * r.p365 * 12, 0);

  const handleExportCSV = () => {
    const rows = [['ID','Plan','Cohort','Tier','90-Day','1-Year','Days Left','MRR'], ...filtered.map(r => [r.id, r.plan, r.year, r.tier, (r.p90*100).toFixed(1)+'%', (r.p365*100).toFixed(1)+'%', r.left, r.fee])];
    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'churnguard_customers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const handleShareView = () => {
    const params = new URLSearchParams();
    if (tierFilter !== 'All') params.set('tier', tierFilter);
    if (planFilter !== 'All') params.set('plan', planFilter);
    if (searchQuery) params.set('search', searchQuery);
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '?' + params.toString()).then(() => alert('Link copied!'));
  };

  const handleCompare = () => {
    if (selectedCustomers.size === 2) setCompareIds([...selectedCustomers]);
  };

  const handleFlag = () => {
    alert(`${selectedCustomers.size} customers flagged.`);
  };

  return (
    <motion.section
      id="explorer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <ParticleField count={15} />
      <div className="section-head" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Customer Explorer</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>Browse Every Customer's Risk Profile</motion.h2>
        <motion.p className="section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>Search, filter, and click any customer to see their full churn risk profile.</motion.p>
      </div>
      <motion.div style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        <TableControls
          onExportCSV={handleExportCSV}
          onShareView={handleShareView}
          onCompare={handleCompare}
          onFlag={handleFlag}
          showCompare={selectedCustomers.size === 2}
          showFlag={selectedCustomers.size > 0}
        />
      </motion.div>
      <motion.div className="explorer-stats" style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
        <div className="es-item"><span className="es-label">Showing</span><span className="es-val">{filtered.length}</span></div>
        <div className="es-item"><span className="es-label">of</span><span className="es-val">{customers.length}</span></div>
        <div className="es-item"><span className="es-label">Filtered ARR</span><span className="es-val">{fmt$(filteredARR)}</span></div>
        <div className="es-item"><span className="es-label">Expected Loss</span><span className="es-val" style={{ color: 'var(--high)' }}>{fmt$(Math.round(filteredLoss))}/yr</span></div>
      </motion.div>
      <motion.div style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
        <CustomerTable filtered={filtered} onSelectCustomer={(id) => setSpotlightCustomerId(id)} />
      </motion.div>
    </motion.section>
  );
}