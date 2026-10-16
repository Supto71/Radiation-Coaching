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
      } catch (_) {}

      if (cancelled) return;
      if (Date.now() - t0 > MAX_WAIT_MS) {
        setPhase('timeout'); cleanup(); return;
      }
      pollTimer = setTimeout(ping, POLL_MS);
    }

    (async () => {
      try {
        const ctrl = new AbortController();
        const tid  = setTimeout(() => ctrl.abort(), 4000);
        const res  = await fetch('/api/students/', { signal: ctrl.signal });
        clearTimeout(tid);
        if (!cancelled && res && res.status < 500) {
          setPhase(null);
          return;
        }
      } catch (_) {}

      if (cancelled) return;
      setPhase('waking');
      setVisible(true);
      elapsedInt = setInterval(() => {
        if (!cancelled) setElapsed(sec());
      }, 1000);
      pollTimer = setTimeout(ping, POLL_MS);
    })();

    return cleanup;
  }, []);

  if (!phase) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className={"rc-wakeup-toast " + (visible ? "rc-slide-in" : "rc-slide-out") + (phase === 'awake' ? " rc-awake" : phase === 'timeout' ? " rc-timeout" : "")}>
        {phase === 'waking' && (
          <>
            <span className="rc-spinner" />
            <div className="rc-text">
              <strong>সার্ভার জাগছে...</strong>
              <span>ডেটা লোড হতে একটু সময় লাগবে ({elapsed}s)</span>
            </div>
          </>
        )}
        {phase === 'awake' && (
          <>
            <span className="rc-icon rc-check">✓</span>
            <div className="rc-text">
              <strong>সার্ভার প্রস্তুত!</strong>
              <span>ডেটা লোড হচ্ছে…</span>
            </div>
          </>
        )}
        {phase === 'timeout' && (
          <>
            <span className="rc-icon rc-warn">⚠</span>
            <div className="rc-text">
              <strong>সার্ভার সাড়া দিচ্ছে না</strong>
              <span>পেজ রিফ্রেশ করে আবার চেষ্টা করুন</span>
            </div>
            <button className="rc-retry" onClick={() => window.location.reload()}>রিফ্রেশ</button>
          </>
        )}
      </div>
    </>
  );
}

const CSS = 
  .rc-wakeup-toast {
    position:fixed; bottom:1.25rem; left:50%;
    transform:translateX(-50%) translateY(120px);
    z-index:9999; display:flex; align-items:center; gap:0.75rem;
    background:#1e293b; border:1px solid rgba(255,255,255,0.12);
    color:#f1f5f9; padding:0.75rem 1.25rem; border-radius:2rem;
    box-shadow:0 8px 32px rgba(0,0,0,0.45);
    font-family:'Hind Siliguri','Noto Sans Bengali',sans-serif;
    font-size:0.85rem; min-width:260px; max-width:92vw;
    transition:transform 0.4s cubic-bezier(.34,1.56,.64,1),opacity 0.4s ease;
    opacity:0;
  }
  .rc-wakeup-toast.rc-slide-in  { transform:translateX(-50%) translateY(0); opacity:1; }
  .rc-wakeup-toast.rc-slide-out { transform:translateX(-50%) translateY(120px); opacity:0; }
  .rc-wakeup-toast.rc-awake   { border-color:rgba(34,197,94,.4); }
  .rc-wakeup-toast.rc-timeout { border-color:rgba(239,68,68,.4); }
  .rc-text { display:flex; flex-direction:column; gap:0.1rem; line-height:1.3; }
  .rc-text strong { font-weight:700; font-size:0.88rem; }
  .rc-text span   { color:#94a3b8; font-size:0.78rem; }
  .rc-spinner {
    flex-shrink:0; width:20px; height:20px;
    border:2.5px solid rgba(255,255,255,0.15);
    border-top-color:#d32f2f; border-radius:50%;
    animation:rc-spin 0.9s linear infinite;
  }
  @keyframes rc-spin { to { transform:rotate(360deg); } }
  .rc-icon {
    flex-shrink:0; width:22px; height:22px; border-radius:50%;
    display:inline-flex; align-items:center; justify-content:center;
    font-size:0.75rem; color:#fff; font-weight:900;
  }
  .rc-check { background:#22c55e; }
  .rc-warn  { background:#ef4444; font-size:0.85rem; }
  .rc-retry {
    margin-left:auto; flex-shrink:0;
    background:#d32f2f; color:#fff; border:none; border-radius:1rem;
    padding:0.3rem 0.85rem; font-size:0.78rem; font-weight:700;
    cursor:pointer; font-family:inherit;
  }
  .rc-retry:hover { background:#b71c1c; }
;
