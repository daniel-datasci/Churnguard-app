import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUIContext } from '../context/UIContext';
import { useCustomers } from '../context/CustomerContext';
import { fmtPct } from '../utils/format';
import { ParticleField } from '../components/Decorations';

const WORKER_URL = 'https://churnguard-ai.danifedibah.workers.dev/slack';

export function Alerts() {
  const { slackWebhookURL, setSlackWebhookURL } = useUIContext();
  const { customers } = useCustomers();
  const [statusMsg, setStatusMsg] = useState('');
  const [auto, setAuto] = useState(false);
  const [localWebhook, setLocalWebhook] = useState(slackWebhookURL);

  useEffect(() => {
    const saved = localStorage.getItem('churnguard_slack_webhook') || '';
    setSlackWebhookURL(saved);
    setLocalWebhook(saved);
  }, []);

  const saveWebhook = () => {
    localStorage.setItem('churnguard_slack_webhook', localWebhook);
    setSlackWebhookURL(localWebhook);
    setStatusMsg('Saved.');
    setTimeout(() => setStatusMsg(''), 2000);
  };

  const sendSlack = async (payload) => {
    if (!slackWebhookURL) { alert('Save a webhook first.'); return false; }
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook: slackWebhookURL, payload }),
      });
      if (!res.ok) throw new Error('Worker error');
      return true;
    } catch (err) { console.error(err); return false; }
  };

  const testAlert = async () => {
    const ok = await sendSlack({ blocks: [{ type: 'section', text: { type: 'mrkdwn', text: '✅ *Slack integration working!*' } }] });
    setStatusMsg(ok ? 'Sent!' : 'Failed.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const sendTop3 = async () => {
    const top = customers.filter(r => r.tier === 'High').sort((a, b) => b.p90 - a.p90).slice(0, 3);
    if (!top.length) { alert('No high-risk customers.'); return; }
    const ok = await sendSlack({
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: '🚨 Top 3 High‑Risk' } },
        { type: 'section', fields: top.map(r => ({
            type: 'mrkdwn',
            text: `*#${r.id}* (${r.plan})\n90d: ${fmtPct(r.p90)} | MRR: $${r.fee} | ${r.left}d left`
          }))
        },
      ]
    });
    setStatusMsg(ok ? 'Sent!' : 'Failed.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  useEffect(() => {
    let interval;
    if (auto) {
      interval = setInterval(() => {
        const high = customers.filter(r => r.tier === 'High');
        if (high.length) {
          const r = high[Math.floor(Math.random() * high.length)];
          sendSlack({ blocks: [{ type: 'section', text: { type: 'mrkdwn', text: `🔔 *Alert* — #${r.id} (${r.plan}) — 90d: ${fmtPct(r.p90)} | ${r.left}d left | $${r.fee}` } }] });
        }
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [auto, customers]);

  return (
    <motion.section
      id="alerts"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <ParticleField count={8} />
      <div className="section-head" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Real‑Time Alerts</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>Slack Integration</motion.h2>
        <motion.p className="section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>Connect your Slack workspace for automated churn alerts.</motion.p>
      </div>

      <motion.div className="chart-card" style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        <div className="chart-head"><div className="chart-title">Configure Slack Webhook</div></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={localWebhook}
            onChange={e => setLocalWebhook(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            style={{ flex: 1, minWidth: 240, background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text)', borderRadius: 'var(--r)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 2px rgba(201,168,124,0.2)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
          <motion.button className="btn btn-primary" onClick={saveWebhook} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Save</motion.button>
          <motion.button className="btn btn-ghost" onClick={testAlert} whileHover={{ scale: 1.03, borderColor: 'var(--gold)' }} whileTap={{ scale: 0.97 }}>Test</motion.button>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.button className="btn btn-ghost" onClick={sendTop3} whileHover={{ scale: 1.03, borderColor: 'var(--gold)' }} whileTap={{ scale: 0.97 }}>Send Top 3 Alert</motion.button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} /> Auto‑alerts every 30s
          </label>
          {auto && <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>Active</span>}
        </div>
        {statusMsg && <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--muted)' }}>{statusMsg}</div>}
      </motion.div>
    </motion.section>
  );
}