import { motion } from 'framer-motion';
import { ParticleField } from '../components/Decorations';

const progData = [
  { name:'Phase 1 — Demographics only', score:.5201, tag:'Train C', winner:false, color:'#8a7058' },
  { name:'Phase 1 — + signup_year',     score:.6813, tag:'Train C', winner:false, color:'#a08c6c' },
  { name:'Phase 1 — XGBoost binary',    score:.4217, tag:'AUC ❌',  winner:false, color:'#c2543d' },
  { name:'Phase 1 — XGBoost-Cox',       score:.5543, tag:'Train C', winner:false, color:'#a08c6c' },
  { name:'Phase 2 — Cox + Behavioural', score:.9527, tag:'CV C ✅', winner:false, color:'#c9a87c' },
  { name:'Phase 2 — XGBoost-Cox',       score:.9784, tag:'CV C 🏆', winner:true,  color:'#7a9e7e' },
];

const feats = [
  { n:'session_dur_trend', d:'Declining session duration = losing product value', cat:'Engagement', d_val:-2.476, color:'#c9a87c' },
  { n:'days_since_last_login', d:'Every silent day multiplies churn hazard by 4%', cat:'Recency', d_val:+1.870, color:'#c2543d' },
  { n:'usage_last_30d', d:'#1 XGBoost feature – stops using → stops paying', cat:'Engagement', d_val:-1.596, color:'#c9a87c' },
  { n:'logins_last_30d', d:'Recent login frequency reveals habit strength', cat:'Recency', d_val:-1.536, color:'#c9a87c' },
  { n:'tickets_last_60d', d:'Recent ticket spike signals building frustration', cat:'Support', d_val:+0.890, color:'#c2543d' },
  { n:'unique_features_used', d:'Narrow usage = shallow integration = easy to leave', cat:'Depth', d_val:-0.856, color:'#7a9e7e' },
];

const warns = [
  { cls:'critical', level:'🔴 Critical', trigger:'session_dur_trend < 0.5 for 2+ weeks', reason:'Session quality collapsing', action:'Immediate CSM call + in‑app health check' },
  { cls:'critical', level:'🔴 Critical', trigger:'days_since_last_login > 14', reason:'Two weeks silence', action:'Automated re‑engagement sequence' },
  { cls:'warning',  level:'🟡 Warning', trigger:'usage_last_30d drops > 50% vs prior 30d', reason:'Feature usage halved', action:'In‑app tips prompt + email campaign' },
  { cls:'warning',  level:'🟡 Warning', trigger:'billing_issue ticket opened', reason:'Financial friction detected', action:'Finance team priority review' },
  { cls:'warning',  level:'🟡 Warning', trigger:'2025 cohort at 60‑day mark with < 5 logins', reason:'Onboarding failure pattern', action:'Dedicated onboarding success call' },
  { cls:'monitor',  level:'ℹ️ Monitor', trigger:'logins_last_30d < 50% of personal average', reason:'Relative decline from baseline', action:'Personalised activity recap email' },
];

export function Insights() {
  return (
    <motion.section
      id="insights"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <ParticleField count={10} />
      <div className="section-head" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>Model Insights</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>How the Model Works</motion.h2>
        <motion.p className="section-sub" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>From coin‑flip to 0.9784 concordance — the complete journey.</motion.p>
      </div>

      <motion.div className="charts-grid" style={{ position: 'relative', zIndex: 1 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        <div className="chart-card">
          <div className="chart-head"><div className="chart-title">Concordance Progression</div></div>
          <div className="progression">
            {progData.map((p, i) => (
              <motion.div
                key={i}
                className={`prog-row ${p.winner ? 'winner' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="prog-name">{p.name}</span>
                <div className="prog-bar-wrap">
                  <motion.div
                    className="prog-bar"
                    style={{ background: p.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.score * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
                <span className="prog-val" style={{ color: p.color }}>{p.score.toFixed(4)}</span>
                <span className="prog-tag" style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}>{p.tag}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-head"><div className="chart-title">Top Predictive Features</div></div>
          <div className="features-grid">
            {feats.map((f, i) => (
              <motion.div
                key={i}
                className="feat-item"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="feat-rank">#{i+1}</span>
                <div>
                  <div className="feat-name" style={{ color: f.color }}>{f.n}</div>
                  <div className="feat-desc">{f.d}</div>
                  <div className="feat-d" style={{ color: f.d_val < 0 ? 'var(--low)' : 'var(--high)' }}>Cohen's d = {f.d_val > 0 ? '+' : ''}{f.d_val}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div style={{ marginTop: 40, position: 'relative', zIndex: 1 }}>
        <div className="section-head"><div className="section-tag">Early Warning System</div></div>
        <div className="warnings">
          {warns.map((w, i) => (
            <motion.div
              key={i}
              className={`warn ${w.cls}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.01, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
            >
              <span className="warn-level">{w.level}</span>
              <div className="warn-body">
                <div className="warn-trigger">{w.trigger}</div>
                <div className="warn-reason">{w.reason}</div>
                <div className="warn-action">→ {w.action}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}