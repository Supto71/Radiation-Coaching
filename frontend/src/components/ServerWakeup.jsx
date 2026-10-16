import React, { useState, useEffect } from 'react';

const MAX_WAIT_MS  = 90000;
const POLL_MS      = 3000;
const HIDE_DELAY   = 1500;

export default function ServerWakeupToast() {
  const [phase, setPhase]     = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled  = false;
    const t0       = Date.now();
    let pollTimer  = null;
    let elapsedInt = null;
    let hideTimer  = null;
    const sec = () => Math.floor((Date.now() - t0) / 1000);

    function cleanup() {
      cancelled = true;
      clearInterval(elapsedInt);
      clearTimeout(pollTimer);
      clearTimeout(hideTimer);
    }

    function markAwake() {
      if (cancelled) return;
      setPhase('awake');
      setVisible(false);
      hideTimer = setTimeout(() => setPhase(null), HIDE_DELAY + 400);
      cleanup();
    }

    async function ping() {
      if (cancelled) return;
      try {
        const ctrl = new AbortController();
        const tid  = setTimeout(() => ctrl.abort(), 5000);
        const res  = await fetch('/api/students/', { signal: ctrl.signal });
        clearTimeout(tid);
        if (!cancelled && res && res.status < 500) { markAwake(); return; }
      } catch (_) { /* sleeping */ }
      if (cancelled) return;
      if (Date.now() - t0 > MAX_WAIT_MS) { setPhase('timeout'); cleanup(); return; }
      pollTimer = setTimeout(ping, POLL_MS);
    }

    (async () => {
      try {
        const ctrl = new AbortController();
        const tid  = setTimeout(() => ctrl.abort(), 4000);
        const res  = await fetch('/api/students/', { signal: ctrl.signal });
        clearTimeout(tid);
        if (!cancelled && res && res.status < 500) { setPhase(null); return; }
      } catch (_) { /* sleeping */ }
      if (cancelled) return;
      setPhase('waking');
      setVisible(true);
      elapsedInt = setInterval(() => { if (!cancelled) setElapsed(sec()); }, 1000);
      pollTimer = setTimeout(ping, POLL_MS);
    })();

    return cleanup;
  }, []);

  if (!phase) return null;

  const S = {
    toast: {
      position: 'fixed', bottom: '1.25rem', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(120px)',
      opacity: visible ? 1 : 0,
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.75rem',
      background: '#1e293b',
      border: phase === 'awake'   ? '1px solid rgba(34,197,94,.4)' :
              phase === 'timeout' ? '1px solid rgba(239,68,68,.4)' :
                                    '1px solid rgba(255,255,255,0.12)',
      color: '#f1f5f9', padding: '0.75rem 1.25rem', borderRadius: '2rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif",
      fontSize: '0.85rem', minWidth: '260px', maxWidth: '92vw',
      transition: 'transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease',
    },
    spinner: {
      flexShrink: 0, width: '20px', height: '20px',
      border: '2.5px solid rgba(255,255,255,0.15)',
      borderTopColor: '#d32f2f', borderRadius: '50%',
      animation: 'rc-spin 0.9s linear infinite', display: 'inline-block',
    },
    textBox: { display: 'flex', flexDirection: 'column', gap: '0.1rem', lineHeight: 1.3 },
    strong:  { fontWeight: 700, fontSize: '0.88rem' },
    sub:     { color: '#94a3b8', fontSize: '0.78rem' },
    checkIcon: {
      flexShrink: 0, width: '22px', height: '22px', background: '#22c55e',
      borderRadius: '50%', display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 900,
    },
    retryBtn: {
      marginLeft: 'auto', flexShrink: 0, background: '#d32f2f', color: '#fff',
      border: 'none', borderRadius: '1rem', padding: '0.3rem 0.85rem',
      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
    },
  };

  return (
    <>
      <style>{'@keyframes rc-spin{to{transform:rotate(360deg)}}'}</style>
      <div style={S.toast}>
        {phase === 'waking' && (
          <>
            <span style={S.spinner} />
            <div style={S.textBox}>
              <strong style={S.strong}>সার্ভার জাগছে...</strong>
              <span style={S.sub}>ডেটা লোড হতে একটু সময় লাগবে ({elapsed}s)</span>
            </div>
          </>
        )}
        {phase === 'awake' && (
          <>
            <span style={S.checkIcon}>✓</span>
            <div style={S.textBox}>
              <strong style={S.strong}>সার্ভার প্রস্তুত!</strong>
              <span style={S.sub}>ডেটা লোড হচ্ছে…</span>
            </div>
          </>
        )}
        {phase === 'timeout' && (
          <>
            <span style={{ flexShrink: 0, fontSize: '1.1rem' }}>⚠️</span>
            <div style={{ ...S.textBox, flex: 1 }}>
              <strong style={S.strong}>সার্ভার সাড়া দিচ্ছে না</strong>
              <span style={S.sub}>পেজ রিফ্রেশ করে আবার চেষ্টা করুন</span>
            </div>
            <button style={S.retryBtn} onClick={() => window.location.reload()}>রিফ্রেশ</button>
          </>
        )}
      </div>
    </>
  );
}
