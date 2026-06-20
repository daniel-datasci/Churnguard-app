import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import { useCustomers } from '../context/CustomerContext';
import { useUIContext } from '../context/UIContext';
import { fmtPct } from '../utils/format';

/* ─────────────────────────────────────────────
   ADVANCED DECORATIVE COMPONENTS
   ───────────────────────────────────────────── */

/** Subtle grain texture overlay */
function GrainOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

/** Particle field – tiny dots floating in background */
function ParticleField({ count = 30 }) {
  const particles = useRef([...Array(count)].map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 5,
  })));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.current.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: `${p.y}%`,
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--gold)',
            opacity: 0.15,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/** Animated gradient orb that follows mouse (on desktop) – FIXED */
function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [isDesktop]);

  // 🔧 Moved BEFORE the early return to satisfy hooks rules
  const background = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(201,168,124,0.12) 0%, transparent 50%)`;

  if (!isDesktop) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        background,
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   GROWTH STORY SECTION – 3D PERSPECTIVE CHART
   ───────────────────────────────────────────── */
function GrowthStorySection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [hoveredBar, setHoveredBar] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bars = [
    { value: 18, label: 'Jan' }, { value: 22, label: 'Feb' }, { value: 20, label: 'Mar' },
    { value: 24, label: 'Apr' }, { value: 28, label: 'May' }, { value: 30, label: 'Jun' },
    { value: 35, label: 'Jul' }, { value: 42, label: 'Aug' }, { value: 55, label: 'Sep' },
    { value: 68, label: 'Oct' }, { value: 82, label: 'Nov' }, { value: 100, label: 'Dec' },
  ];

  const getBarColor = (index, total) => {
    const t = index / (total - 1);
    return `rgba(201, 168, 124, ${0.2 + t * 0.7})`;
  };

  return (
    <motion.div
      ref={ref}
      style={{ padding: 'clamp(60px, 10vw, 10px) 20px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', scale, opacity }}
    >
      <ParticleField count={15} />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div style={{ textAlign: 'center', marginBottom: 60, position: 'relative', zIndex: 1 }}>
          <motion.div
            className="section-tag"
            style={{ marginBottom: 12 }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            The ChurnGuard Effect
          </motion.div>
          <motion.h2
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--cream)',
              lineHeight: 1.2,
              marginBottom: 16,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            When teams understand which customers are likely to leave and why,<br />
            <span style={{ color: 'var(--gold)' }}>retention becomes predictable.</span>
          </motion.h2>
          <motion.p
            style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', maxWidth: 600, margin: '0 auto' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Revenue Protected Over Time
          </motion.p>
        </div>

        <div style={{ position: 'relative', width: '100%', margin: '0 auto', height: isMobile ? 200 : 340, perspective: '600px' }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(201,168,124,0.1) 0%, transparent 70%)',
            zIndex: 0,
          }} />
          <motion.div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              height: '100%', position: 'relative', zIndex: 1, gap: 2,
              transformStyle: 'preserve-3d',
              transform: 'rotateX(2deg)',
            }}
            initial={{ rotateX: 4 }}
            animate={isInView ? { rotateX: 2 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {bars.map((bar, i) => (
              <motion.div
                key={i}
                style={{
                  flex: 1,
                  background: hoveredBar === i
                    ? `linear-gradient(to top, rgba(212,184,150,0.95), rgba(201,168,124,0.85))`
                    : `linear-gradient(to top, ${getBarColor(i, bars.length)}, rgba(201,168,124,0.3))`,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  boxShadow: hoveredBar === i ? '0 0 30px rgba(201,168,124,0.5)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.3s, box-shadow 0.3s',
                  position: 'relative',
                  transformOrigin: 'bottom center',
                }}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${bar.value}%` } : { height: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {hoveredBar === i && (
                  <motion.span
                    style={{
                      position: 'absolute',
                      top: -28,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.75rem',
                      color: 'var(--gold)',
                      whiteSpace: 'nowrap',
                      background: 'rgba(15,15,15,0.85)',
                      padding: '2px 10px',
                      borderRadius: 4,
                      backdropFilter: 'blur(4px)',
                    }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {bar.label}: {bar.value}%
                  </motion.span>
                )}
              </motion.div>
            ))}
          </motion.div>

          {!isMobile && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
              <motion.g
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <text x="60" y="150" fill="var(--text-secondary)" fontSize="12" fontFamily="var(--body)" dominantBaseline="middle">
                  <tspan x="50" dy="0">Teams rely on</tspan>
                  <tspan x="50" dy="22">spreadsheets, dashboards,</tspan>
                  <tspan x="50" dy="22">and gut feeling.</tspan>
                </text>
              </motion.g>
              <motion.g
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <motion.path
                  d="M 380 80 Q 400 50, 440 40"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: 1.8 }}
                />
                <text x="450" y="35" fill="var(--gold)" fontSize="14" fontFamily="var(--display)" fontWeight="600">
                  Add ChurnGuard
                </text>
              </motion.g>
            </svg>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT SLIDER SECTION – 3D CARD WITH REFLECTION
   ───────────────────────────────────────────── */
const slidesData = [
  { step: '01', title: 'Understand Customer Churn', description: 'Identify which customers are likely to leave, when, and why. Our survival analysis models give you a clear, data‑driven view of churn risk.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop' },
  { step: '02', title: 'Prioritise High‑Risk Accounts', description: 'Focus your retention efforts where they matter most. Automatically segment customers into risk tiers so you know exactly who to reach out to first.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop' },
  { step: '03', title: 'Take Action with Playbooks', description: 'Every risk tier comes with a tailored retention playbook, including email templates, checklists, and recommended actions.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop' },
  { step: '04', title: 'Monitor & Optimise', description: 'Real‑time Slack alerts and weekly executive summaries keep you informed, while benchmarking shows you how you stack up against the industry.', image: 'https://images.unsplash.com/photo-1553484771-3718a22e1c9a?w=800&auto=format&fit=crop' },
];

function AboutSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [8, -8]);
  const rotateY = useTransform(mouseX, [-200, 200], [-8, 8]);
  const totalSlides = slidesData.length;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goNext = () => { setDirection(1); setCurrent((prev) => (prev + 1) % totalSlides); };
  const goPrev = () => { setDirection(-1); setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1)); };

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const stackCards = [
    { offset: -16, opacity: 0.4, scale: 0.96 },
    { offset: -32, opacity: 0.2, scale: 0.92 },
  ];

  return (
    <div style={{ padding: 'clamp(100px, 10vw, 120px) 20px', maxWidth: 1240, margin: '0 auto', position: 'relative' }}>
      <ParticleField count={10} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={{ display: 'flex', gap: isMobile ? 30 : 60, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}
      >
        <div style={{ flex: isMobile ? '1 1 100%' : '1 1 35%', minWidth: 0, textAlign: 'center' }}>
          <motion.h2
            style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--cream)', marginBottom: 20 }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span style={{ color: 'var(--gold)' }}>Retention Intelligence</span>{' '} for Customer‑Obsessed Teams
          </motion.h2>
          <motion.p
            style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            ChurnGuard gives you the early‑warning system you need to keep customers longer. From predictive risk scoring to automated playbooks, everything is designed for fast‑moving startup teams.
          </motion.p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 24 : 0 }}>
            {slidesData.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                style={{ width: i === current ? 32 : 8, height: 8, borderRadius: 4, background: i === current ? 'var(--gold)' : 'var(--border)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        <div style={{ flex: isMobile ? '1 1 100%' : '1 1 65%', minWidth: 0, position: 'relative', perspective: 1000 }}>
          {!isMobile && stackCards.map((card, i) => (
            <div key={i} style={{ position: 'absolute', top: card.offset, left: card.offset, right: card.offset, bottom: card.offset, background: 'var(--card)', borderRadius: 24, border: '1px solid var(--border)', opacity: card.opacity, transform: `scale(${card.scale})`, transformOrigin: 'center center', zIndex: 0, pointerEvents: 'none' }} />
          ))}

          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'relative', zIndex: 1, background: 'linear-gradient(145deg, var(--card) 0%, rgba(26,26,26,0.9) 100%)',
              borderRadius: 24,
              border: '1px solid var(--border-h)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(12px)',
              rotateX: isMobile ? 0 : rotateX,
              rotateY: isMobile ? 0 : rotateY,
              transition: 'rotate 0.1s ease',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: isMobile ? 'column-reverse' : 'row' }}>
              <div style={{ flex: '1 1 55%', padding: isMobile ? 24 : 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', gap: 12, marginBottom: 24 }}>
                  <motion.button onClick={goPrev} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem' }} whileHover={{ borderColor: 'var(--gold)', color: 'var(--gold)' }} whileTap={{ scale: 0.9 }}>←</motion.button>
                  <motion.button onClick={goNext} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem' }} whileHover={{ borderColor: 'var(--gold)', color: 'var(--gold)' }} whileTap={{ scale: 0.9 }}>→</motion.button>
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 50, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: direction * -50, filter: 'blur(4px)' }}
                    transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                  >
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 12 }}>STEP {slidesData[current].step}</div>
                    <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 600, color: 'var(--cream)', marginBottom: 16 }}>{slidesData[current].title}</h3>
                    <p style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>{slidesData[current].description}</p>
                  </motion.div>
                </AnimatePresence>

                <motion.button onClick={goNext} className="btn btn-primary" style={{ alignSelf: 'flex-start' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Next Step →
                </motion.button>
              </div>
              <motion.div
                style={{
                  flex: '1 1 45%', minHeight: isMobile ? 200 : 320,
                  backgroundImage: `url(${slidesData[current].image})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  position: 'relative',
                }}
                animate={{ backgroundImage: `url(${slidesData[current].image})` }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 50%, var(--card) 100%)' }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ONE PLATFORM SECTION – ANIMATED ICON CARDS
   ───────────────────────────────────────────── */
function OnePlatformSection() {
  const cardData = [
    { label: 'CUSTOMER SUCCESS', title: 'Get ahead of churn', bullets: ['Risk scoring per customer', 'Intervene and improve outcomes', 'Smart customer segmentation'] },
    { label: 'REVENUE & REAL TIME ALERTS', title: 'How it impacts your revenue', bullets: ['Instantly see ARR at risk', 'Instant alerts when churn risk spikes', 'Weekly reports with key metrics'] },
    { label: 'DATA & MANAGEMENT', title: 'All your data in one place', bullets: ['Centralize data from multiple sources', 'Build reporting and analytics pipelines', 'Connect disconnected business tools'] },
  ];

  return (
    <div style={{ background: 'var(--bg-deep)', padding: 'clamp(60px, 10vw, 120px) 20px', position: 'relative', overflow: 'hidden' }}>
      <ParticleField count={12} />
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--cream)', lineHeight: 1.2, marginBottom: 16 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            One platform,{' '}<span style={{ color: 'var(--gold)' }}>every business</span>
          </motion.h2>
          <motion.p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
            Helping organizations streamline operations, uncover insights, and scale faster with AI, data, and automation.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 80 }}>
          {cardData.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.4)', borderColor: 'var(--gold)' }}
              style={{ background: 'linear-gradient(135deg, var(--card) 0%, rgba(26,26,26,0.9) 100%)', border: '1px solid var(--border)', borderRadius: 18, padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transition: 'all 0.35s ease', cursor: 'default', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>{card.label}</div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', fontWeight: 600, color: 'var(--cream)', lineHeight: 1.3, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>{card.title}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {card.bullets.map((bullet, i) => (
                  <motion.li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + idx * 0.1 + i * 0.1 }}>
                    <motion.span
                      style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--low-bg)', display: 'inline-flex',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: 'var(--low)', fontSize: '0.8rem',
                      }}
                      whileHover={{ scale: 1.2, background: 'var(--low)', color: '#fff' }}
                    >
                      ✓
                    </motion.span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.7rem, 1vw, 0.75rem)', lineHeight: 1.5 }}>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,124,0.06), rgba(15,15,15,0.95))',
            borderRadius: 24,
            padding: 'clamp(40px, 8vw, 80px) 20px',
            textAlign: 'center',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(201,168,124,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--cream)', marginBottom: 16, lineHeight: 1.2, position: 'relative' }}>
            You're closer to <span style={{ color: 'var(--gold)' }}>scalable growth</span> than you think.
          </h3>
          <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto 32px', lineHeight: 1.7, position: 'relative' }}>
            See how you can tackle churn, expand revenue, and find opportunities hidden within your product usage data.
          </p>
          <motion.button
            onClick={() => { const contactEl = document.getElementById('contact'); contactEl?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{ background: 'var(--gold)', color: '#0B0B0F', fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em', padding: '14px 32px', borderRadius: 3, border: 'none', cursor: 'pointer', position: 'relative' }}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 35px rgba(201,168,124,0.35)' }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Talk →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME COMPONENT – MAIN EXPORT
   ───────────────────────────────────────────── */
export function Home() {
  const { customers } = useCustomers();
  const { onboardingStarted, setOnboardingStarted } = useUIContext();
  const [alertCustomer, setAlertCustomer] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', companyStage: '', monthlyChurn: '', message: '' });
  const [heroLoaded, setHeroLoaded] = useState(false);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const navBgOpacity = useTransform(scrollY, [0, 100], [0.85, 0.95]);

  useEffect(() => { setHeroLoaded(true); }, []);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const highRisk = customers.filter(c => c.tier === 'High');
    if (highRisk.length === 0) return;
    const showNext = () => {
      const random = highRisk[Math.floor(Math.random() * highRisk.length)];
      setAlertCustomer(random);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3500);
    };
    showNext();
    const interval = setInterval(showNext, 4500);
    return () => clearInterval(interval);
  }, [customers]);

  const planCounts = customers.reduce((acc, c) => { acc[c.plan] = (acc[c.plan] || 0) + 1; return acc; }, {});
  const barData = { labels: Object.keys(planCounts), datasets: [{ label: 'Customers', data: Object.values(planCounts), backgroundColor: ['rgba(201,168,124,0.85)', 'rgba(194,84,61,0.85)', 'rgba(122,158,126,0.85)'], borderColor: '#1a1a1a', borderWidth: 2, borderRadius: 4 }] };
  const barOptions = { responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } };

  const highRiskCustomers = customers.filter(c => c.tier === 'High');
  const averageSurvival = [];
  if (highRiskCustomers.length > 0) {
    [0, 30, 90, 180, 270, 365].forEach(t => { averageSurvival.push(highRiskCustomers.reduce((s, c) => s + Math.exp(-c.hazard * t), 0) / highRiskCustomers.length); });
  }
  const survivalData = { labels: ['0', '30d', '90d', '180d', '270d', '365d'], datasets: [{ label: 'High Risk', data: averageSurvival, borderColor: '#c2543d', backgroundColor: 'transparent', tension: 0.4, pointRadius: 0, borderWidth: 2 }] };
  const survivalOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false, min: 0.4, max: 1 } } };

  const scrollToSection = (ref) => { ref.current?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://formspree.io/f/mlgkjegg', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'contact', ...formData }) });
      alert('Message sent! We will be in touch soon.');
      setFormData({ fullName: '', email: '', companyStage: '', monthlyChurn: '', message: '' });
    } catch { alert('Failed to send. Please try again.'); }
  };

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  if (onboardingStarted) return null;

  const containerStyle = { background: 'var(--bg-deep)', minHeight: '100vh', color: 'var(--text)', position: 'relative', overflowX: 'hidden' };

  return (
    <div style={containerStyle}>
      <GrainOverlay />
      <MouseGlow />

      {/* Nav */}
      <motion.nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', height: 60, background: `rgba(15,15,15,${navBgOpacity})`, backdropFilter: 'blur(24px) saturate(120%)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.span style={{ width: 8, height: 8, background: 'var(--gold)', borderRadius: '50%', boxShadow: '0 0 12px var(--gold-glow)' }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            ChurnGuard
          </div>
        </div>
        {isDesktop && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {['Home', 'About', 'Get in touch'].map((label, i) => (
              <motion.button
                key={label}
                className="nav-link"
                onClick={() => {
                  if (i === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
                  else if (i === 1) scrollToSection(aboutRef);
                  else scrollToSection(contactRef);
                }}
                whileHover={{ color: 'var(--gold)', scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ position: 'relative' }}
              >
                {label}
                <motion.div
                  className="nav-link-underline"
                  style={{ position: 'absolute', bottom: -2, left: '50%', width: 0, height: 1, background: 'var(--gold)' }}
                  whileHover={{ width: '100%', left: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        )}
        {!isDesktop && (
          <motion.button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '1.4rem', cursor: 'pointer' }} whileTap={{ scale: 0.8 }}>
            {mobileMenuOpen ? '✕' : '☰'}
          </motion.button>
        )}
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {!isDesktop && mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ position: 'fixed', top: 60, left: 0, right: 0, background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 99, overflow: 'hidden' }}>
            {['Home', 'About', 'Get in touch'].map((label, i) => (
              <button key={label} className="nav-link" style={{ textAlign: 'left', fontSize: '0.9rem' }} onClick={() => { if (i === 0) window.scrollTo({ top: 0, behavior: 'smooth' }); else if (i === 1) scrollToSection(aboutRef); else scrollToSection(contactRef); }}>
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <motion.div ref={heroRef} id="home" style={{ position: 'relative', minHeight: isDesktop ? '100vh' : 'auto', overflow: 'hidden', paddingTop: 20, display: 'flex', alignItems: isDesktop ? 'center' : 'flex-start', justifyContent: 'center', opacity: heroOpacity, scale: heroScale }}>
        <ParticleField count={25} />
        {isDesktop && (
          <AnimatePresence>
            {alertVisible && alertCustomer && (
              <>
                <motion.div key={`risk-${alertCustomer.id}`} style={{ position: 'absolute', top: '18%', right: '6%', width: 260, background: 'rgba(26,26,26,0.9)', border: '1px solid var(--high-border)', borderRadius: 16, padding: 20, fontSize: '0.8rem', color: 'var(--text)', fontFamily: 'var(--mono)', zIndex: 10, backdropFilter: 'blur(16px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                  initial={{ opacity: 0, x: 60, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}>
                  <div style={{ color: 'var(--high)', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🚨</motion.span> High Risk Alert
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', lineHeight: 1.6 }}>
                    Customer #{alertCustomer.id} ({alertCustomer.plan})<br />
                    90‑day risk: <strong style={{ color: 'var(--high)' }}>{fmtPct(alertCustomer.p90)}</strong><br />
                    Cohort: {alertCustomer.year}
                  </div>
                </motion.div>
                <motion.div key={`revenue-${alertCustomer.id}`} style={{ position: 'absolute', top: '42%', left: '70%', width: 260, background: 'rgba(26,26,26,0.9)', border: '1px solid var(--high-border)', borderRadius: 16, padding: 20, fontSize: '0.8rem', color: 'var(--text)', fontFamily: 'var(--mono)', zIndex: 10, backdropFilter: 'blur(16px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                  initial={{ opacity: 0, x: 60, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 0.61, 0.36, 1] }}>
                  <div style={{ color: 'var(--high)', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>💸</motion.span> Revenue Alert
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', lineHeight: 1.6 }}>
                    Customer #{alertCustomer.id} ({alertCustomer.plan})<br />
                    MRR at risk: ${alertCustomer.fee}/mo<br />
                    ARR at risk: ${alertCustomer.fee * 12}/yr
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        )}
        {isDesktop && (
          <>
            <motion.div style={{ position: 'absolute', bottom: '5%', left: '3%', width: 180, opacity: 0.45, zIndex: 0 }} initial={{ y: 40, opacity: 0 }} animate={{ y: [0, -14, 0], opacity: 0.5 }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}>
              <Bar data={barData} options={barOptions} />
            </motion.div>
            <motion.div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 200, opacity: 0.4, zIndex: 0 }} initial={{ y: 30, opacity: 0 }} animate={{ y: [0, -12, 0], opacity: 0.45 }} transition={{ repeat: Infinity, duration: 9, delay: 1, ease: 'easeInOut' }}>
              <Line data={survivalData} options={survivalOptions} />
            </motion.div>
          </>
        )}
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: isDesktop ? '0 20px' : 'clamp(180px, 20vh, 220px) 20px 120px', width: '100%', maxWidth: 800, margin: '0 auto' }}>
          <motion.h1
            style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--cream)', lineHeight: 1.1, marginBottom: 24 }}
            initial="hidden"
            animate={heroLoaded ? 'visible' : 'hidden'}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {[
              [{ text: 'Retention ', gold: true }, { text: 'Intelligence and', gold: false }],
              [{ text: ' Early‑Warning ', gold: true }, { text: ' System for', gold: false }],
              [{ text: ' Customer Obsessed ', gold: true }, { text: ' Teams', gold: false }],
            ].map((line, li) => (
              <span key={li}>
                {line.map((part, pi) => (
                  <motion.span
                    key={pi}
                    style={{ color: part.gold ? 'var(--gold)' : 'inherit', fontStyle: part.gold ? 'italic' : 'italic' }}
                    variants={{ hidden: { opacity: 0, y: 50, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
                    transition={{ duration: 0.75, ease: [0.22, 0.61, 0.36, 1] }}
                  >
                    {part.text}
                  </motion.span>
                ))}
                <br />
              </span>
            ))}
          </motion.h1>
          <motion.p
            style={{ fontFamily: 'var(--display)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'var(--text-secondary)', marginBottom: 28, letterSpacing: '0.02em', maxWidth: 550 }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            ChurnGuard predicts which customers are likely to leave, exactly when, and why – before your revenue feels the impact.
          </motion.p>
          <motion.div
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <motion.button className="btn btn-primary" onClick={() => setOnboardingStarted(true)} whileHover={{ scale: 1.06, boxShadow: '0 14px 40px rgba(201,168,124,0.4)' }} whileTap={{ scale: 0.94 }} style={{ position: 'relative', overflow: 'hidden' }}>
              See how it works →
              <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.08), transparent)', left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
            </motion.button>
            <motion.button className="btn btn-ghost" onClick={() => scrollToSection(aboutRef)} whileHover={{ borderColor: 'var(--gold)', color: 'var(--gold)', scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* About */}
      <div ref={aboutRef} id="about">
        <div style={{ padding: 'clamp(60px, 10vw, 80px) 20px 80px', maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} style={{ textAlign: 'center' }}>
            <motion.div className="section-tag" style={{ marginBottom: 16 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>About ChurnGuard</motion.div>
            <motion.p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 40 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
              ChurnGuard is a retention intelligence platform that combines survival analysis and machine learning to give startup teams an <strong style={{ color: 'var(--gold)' }}>early‑warning system</strong> for customer churn. It ranks every customer by their exact risk of leaving, predicts how soon it will happen, and calculates the revenue impact – all in a simple, actionable dashboard.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <GrowthStorySection />
      <AboutSlider />
      <OnePlatformSection />

      {/* Contact */}
      <div ref={contactRef} id="contact" style={{ padding: 'clamp(60px, 10vw, 120px) 20px', maxWidth: 700, margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}>
          <div className="section-tag">Get in touch</div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: 24, color: 'var(--cream)' }}>Contact the ChurnGuard Team</h2>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <motion.input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 'clamp(0.85rem, 1vw, 0.9rem)', color: 'var(--text)', borderRadius: 'var(--r)', outline: 'none', width: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' }} whileFocus={{ borderColor: 'var(--gold)', boxShadow: '0 0 0 2px rgba(201,168,124,0.2)' }} />
            <motion.input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 'clamp(0.85rem, 1vw, 0.9rem)', color: 'var(--text)', borderRadius: 'var(--r)', outline: 'none', width: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' }} whileFocus={{ borderColor: 'var(--gold)', boxShadow: '0 0 0 2px rgba(201,168,124,0.2)' }} />
            <motion.select name="companyStage" required value={formData.companyStage} onChange={handleChange} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 'clamp(0.85rem, 1vw, 0.9rem)', color: 'var(--text)', borderRadius: 'var(--r)', outline: 'none', width: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' }} whileFocus={{ borderColor: 'var(--gold)', boxShadow: '0 0 0 2px rgba(201,168,124,0.2)' }}>
              <option value="">Select Company Stage</option>
              <option>Pre‑seed</option><option>Seed</option><option>Series A</option><option>Series B</option><option>Series C</option><option>IPO</option><option>Other</option>
            </motion.select>
            <motion.select name="monthlyChurn" required value={formData.monthlyChurn} onChange={handleChange} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 'clamp(0.85rem, 1vw, 0.9rem)', color: 'var(--text)', borderRadius: 'var(--r)', outline: 'none', width: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' }} whileFocus={{ borderColor: 'var(--gold)', boxShadow: '0 0 0 2px rgba(201,168,124,0.2)' }}>
              <option value="">Current Monthly Churn</option>
              <option>$0 - $10k</option><option>$10k - $20k</option><option>$20k - $40k</option><option>$40k and above</option>
            </motion.select>
            <motion.textarea name="message" placeholder="What other information would you like to tell us?" rows={4} value={formData.message} onChange={handleChange} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 'clamp(0.85rem, 1vw, 0.9rem)', color: 'var(--text)', borderRadius: 'var(--r)', outline: 'none', resize: 'vertical', width: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' }} whileFocus={{ borderColor: 'var(--gold)', boxShadow: '0 0 0 2px rgba(201,168,124,0.2)' }} />
            <motion.button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', position: 'relative', overflow: 'hidden' }} whileHover={{ scale: 1.05, boxShadow: '0 12px 35px rgba(201,168,124,0.35)' }} whileTap={{ scale: 0.95 }}>
              Send Message
              <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)', left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
            </motion.button>
          </form>
        </motion.div>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 20px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 'clamp(0.65rem, 1vw, 0.7rem)', color: 'var(--muted)', letterSpacing: '0.05em' }}>
        ChurnGuard · Retention Intelligence for ambitious startups
      </footer>
    </div>
  );
}