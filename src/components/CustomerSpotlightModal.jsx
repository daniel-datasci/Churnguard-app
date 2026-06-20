import { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { Modal } from './Modal';
import { fmtPct, probColor, tierColor } from '../utils/format';

export function CustomerSpotlightModal() {
  const { customers, survivalCurves } = useCustomers();
  const { spotlightCustomerId, setSpotlightCustomerId } = useUIContext();
  const customer = spotlightCustomerId ? customers.find(c => c.id === spotlightCustomerId) : null;

  const [showAI, setShowAI] = useState(false);
  const [aiText, setAiText] = useState('');
  const [whatifLogins, setWhatifLogins] = useState(5);

  // Reset state when modal opens for a new customer
  useEffect(() => {
    if (customer) {
      setShowAI(false);
      setAiText('');
      setWhatifLogins(5);
    }
  }, [customer]);

  if (!customer) return null;

  const tc = tierColor(customer.tier);
  const custSurv = survivalCurves.times.map(t => Math.exp(-customer.hazard * t));
  const popAvg = survivalCurves.times.map(
    (_, i) => (survivalCurves.High[i] + survivalCurves.Medium[i] + survivalCurves.Low[i]) / 3
  );

  // What‑if calculation (same as original HTML)
  const cohensD = -1.536;
  const scale = 0.03;
  const adjustedP90 = Math.max(0, customer.p90 + cohensD * whatifLogins * scale);
  const predictedRisk = (adjustedP90 * 100).toFixed(1) + '%';

  const signals = [
    { label: 'Risk Percentile', value: `${customer.pct}th`, ok: customer.pct < 33 },
    { label: 'Est. Days Left', value: `${customer.left}d`, ok: customer.left > 180 },
    { label: '90-Day Risk', value: fmtPct(customer.p90), ok: customer.p90 < 0.15 },
    { label: '1-Year Risk', value: fmtPct(customer.p365), ok: customer.p365 < 0.25 },
    { label: 'Tenure', value: `${customer.days}d`, ok: customer.days > 180 },
    { label: 'Cohort', value: customer.year, ok: customer.year === 2024 },
  ];

  const explainFallback = () => {
    const rt = customer.p90 > 0.3 ? 'very high' : customer.p90 > 0.15 ? 'moderate' : 'low';
    let text = `Customer #${customer.id} has a ${rt} risk of churning within 90 days (${fmtPct(customer.p90)}). `;
    text += `Key factors: ${customer.year === 2025 ? '2025 cohort (higher baseline)' : '2024 cohort'}, ${customer.days < 90 ? 'short tenure' : customer.days < 365 ? 'medium tenure' : 'long tenure'}, and ${customer.plan} plan. `;
    text += customer.tier === 'High' ? 'Immediate outreach required. ' : customer.tier === 'Medium' ? 'Monitor closely — consider a check‑in email. ' : 'No immediate action required. ';
    text += `Recommended: ${customer.tier === 'High' ? 'schedule a CSM call and send a re‑engagement email.' : customer.tier === 'Medium' ? 'send an in‑app feedback request.' : 'maintain regular communication.'}`;
    setAiText(text);
    setShowAI(true);
  };

  const explainViaWorker = async () => {
    const workerUrl = ''; // 👈 put your Cloudflare Worker URL here if you have one
    if (!workerUrl) {
      explainFallback();
      return;
    }
    try {
      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      const data = await res.json();
      setAiText(data.reply);
      setShowAI(true);
    } catch {
      explainFallback();
    }
  };

  return (
    <Modal isOpen={!!spotlightCustomerId} onClose={() => { setSpotlightCustomerId(null); setShowAI(false); }}>
      <div className="modal-header">
        <div className="modal-title-row">
          <div className="modal-avatar" style={{ color: tc, borderColor: tc + '40', background: tc + '10' }}>
            {customer.tier === 'High' ? '●' : customer.tier === 'Medium' ? '●' : '●'}
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--display)', color: 'var(--cream)' }}>Customer {customer.id}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {customer.plan} · ${customer.fee}/mo · {customer.year} · {customer.days}d tenure · {customer.tier} Risk
            </p>
          </div>
        </div>
        <button className="modal-close" onClick={() => { setSpotlightCustomerId(null); setShowAI(false); }}>✕</button>
      </div>
      <div className="modal-body">
        {/* Probability Gauges */}
        <div className="modal-section">
          <div className="modal-sec-title">Churn Probability by Time Horizon</div>
          <div className="gauge-row">
            {[
              { l: '30 Days', v: customer.p30 },
              { l: '90 Days', v: customer.p90 },
              { l: '180 Days', v: customer.p180 },
              { l: '1 Year', v: customer.p365 },
            ].map((h, i) => (
              <div key={i} className="gauge">
                <div className="gauge-val" style={{ color: probColor(h.v) }}>
                  {fmtPct(h.v)}
                </div>
                <div className="gauge-label">{h.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Survival Chart */}
        <div className="modal-section">
          <div className="modal-sec-title">Survival Trajectory</div>
          <div style={{ height: 160 }}>
            <Line
              data={{
                labels: survivalCurves.times,
                datasets: [
                  {
                    label: 'Average',
                    data: popAvg,
                    borderColor: 'rgba(180,160,140,0.3)',
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false,
                  },
                  {
                    label: `#${customer.id}`,
                    data: custSurv,
                    borderColor: tc,
                    backgroundColor: tc.replace(')', ',0.06)').replace('rgb', 'rgba'),
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
                scales: {
                  x: { grid: { color: 'rgba(180,160,140,0.04)' } },
                  y: {
                    min: 0.3,
                    max: 1.02,
                    ticks: { callback: v => (v * 100).toFixed(0) + '%' },
                    grid: { color: 'rgba(180,160,140,0.04)' },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Risk Signals */}
        <div className="modal-section">
          <div className="modal-sec-title">Risk Signals</div>
          <div className="signals">
            {signals.map((s, i) => (
              <div key={i} className="sig">
                <div className="sig-dot" style={{ background: s.ok ? '#7a9e7e' : '#c2543d' }} />
                <span className="sig-label">{s.label}</span>
                <span className="sig-val" style={{ color: s.ok ? '#7a9e7e' : '#c2543d' }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What‑If Simulator */}
        <div className="whatif-container">
          <label htmlFor="whatifSlider">
            What if they logged in <span>{whatifLogins}</span> more times per month?
          </label>
          <input
            type="range"
            id="whatifSlider"
            min="0"
            max="10"
            value={whatifLogins}
            step="1"
            onChange={e => setWhatifLogins(Number(e.target.value))}
          />
          <div className="whatif-result">
            Predicted 90‑day risk: <strong>{predictedRisk}</strong>
          </div>
        </div>

        {/* AI Explain */}
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={explainViaWorker}>
            🤖 Explain this risk
          </button>
          {showAI && (
            <div
              style={{
                marginTop: 14,
                padding: 16,
                background: 'rgba(201,168,124,0.04)',
                borderLeft: '2px solid var(--gold)',
                fontFamily: 'var(--body)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}
            >
              {aiText}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}