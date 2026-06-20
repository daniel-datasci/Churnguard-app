import { fmt$ } from '../utils/format';

export function KPIGrid({ meta }) {
  const kpis = [
    { label: 'Active Customers', val: meta.total.toLocaleString(), sub: `${meta.tiers.High} flagged High Risk`, accent: '#c9a87c' },
    { label: 'Total Active ARR', val: fmt$(meta.arr), sub: 'Annual recurring revenue', accent: '#7a9e7e' },
    { label: 'Expected Annual Loss', val: fmt$(meta.expectedLoss), sub: 'Model-projected churn cost', accent: '#c2543d' },
    { label: 'Model Concordance', val: '0.9784', sub: 'XGBoost-Cox · 5-fold CV', accent: '#c9a87c' },
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="kpi">
          <div className="kpi-accent-line" style={{ background: kpi.accent }} />
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-val">{kpi.val}</div>
          <div className="kpi-sub">{kpi.sub}</div>
        </div>
      ))}
    </div>
  );
}