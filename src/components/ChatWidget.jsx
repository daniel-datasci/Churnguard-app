import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello. I'm Daniel's AI assistant. Ask me anything about churn, this dashboard, or retention strategy." }
  ]);
  const [input, setInput] = useState('');
  const { meta } = useCustomers();

  const chatResponses = {
    churn: "Churn is when a customer stops using your product. It's measured monthly or annually.",
    'churn rate': 'Your annual churn is ~6.2%, slightly above the SaaS average of 5%.',
    'reduce churn': '1. Identify at-risk customers early. 2. Reach out personally (see Playbook). 3. Offer onboarding help. 4. Improve product stickiness.',
    'health score': `Your Retention Health Score is ${Math.round(100 - (meta.expectedLoss / meta.arr) * 100)}/100. Aim for 80+.`,
    arr: 'ARR = Annual Recurring Revenue — your yearly subscription revenue.',
    'survival analysis': 'Survival analysis estimates how long customers stay before churning.',
    'kaplan meier': 'The Kaplan‑Meier curve shows the % of customers still active over time.',
    'cox model': 'A statistical method that predicts churn timing. We combine it with XGBoost.',
    xgboost: 'XGBoost is a powerful ML algorithm that learns complex behavior patterns.',
    'cv concordance': 'A 0‑1 score measuring ranking accuracy. Ours: 0.9784 — near perfect.',
    dashboard: 'The dashboard shows live churn risk, ARR at risk, and recommended actions.',
    explorer: 'Use the Customer Explorer to search, filter, sort, and click for details.',
    playbook: 'The Playbook provides step‑by‑step retention actions per risk tier.',
    'weekly report': "Click 'Weekly Executive Summary' in the hero section.",
    'arr rescue': 'The ARR Rescue Calculator shows savings from reducing high‑risk churn.',
    compare: "Select two customers with checkboxes, then click 'Compare'.",
    flag: "Select customers and click 'Flag' to highlight them.",
    export: "Click 'Export CSV' to download the filtered list.",
    share: "Click 'Share View' to copy a link with your filters.",
    model: 'The model combines behavioral features with demographics to predict churn.',
    'who built': 'Built by Daniel Ifediba, a data scientist specializing in churn prediction.',
    hire: 'Daniel is available. Contact: danifedibah@gmail.com | LinkedIn: https://linkedin.com/in/daniel-ifediba',
    email: "Daniel's email: danifedibah@gmail.com",
    linkedin: "Daniel's LinkedIn: https://linkedin.com/in/daniel-ifediba",
    contact: 'Contact Daniel: danifedibah@gmail.com | LinkedIn: https://linkedin.com/in/daniel-ifediba',
    help: 'I can answer questions about churn, the dashboard, or Daniel. Try asking!',
    benchmarking: 'Benchmarking compares your metrics against SaaS industry averages.',
    accuracy: 'The model has a CV Concordance of 0.9784 — extremely reliable.',
    'risk tiers': 'High (>35% 1yr), Medium (15‑35%), Low (<15%).',
    'high risk': `Currently ${meta.tiers.High} out of ${meta.total} customers are High Risk.`,
  };

  const getAnswer = (question) => {
    const q = question.toLowerCase();
    for (const [key, val] of Object.entries(chatResponses)) {
      if (q.includes(key)) return val;
    }
    return "I'm learning. Ask about churn, the dashboard, or Daniel. Contact: danifedibah@gmail.com";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    const botReply = { from: 'bot', text: getAnswer(input) };
    setMessages([...messages, userMsg]);
    setTimeout(() => setMessages(prev => [...prev, botReply]), 400);
    setInput('');
  };

  return (
    <>
      <motion.button
        className="chat-trigger"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        💬
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="chat-header">
              <span>Ask Daniel</span>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-message ${m.from}`}>{m.text}</div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question…"
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}