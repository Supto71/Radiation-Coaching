import React, { useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';

/**
 * OcrUploader — ছবি থেকে OCR করে text বের করে
 * 
 * Props:
 *   onText(text: string) — recognized text callback
 */
export default function OcrUploader({ onText }) {
  const [phase, setPhase]       = useState('idle'); // idle | loading | done | error
  const [progress, setProgress] = useState(0);
  const [preview, setPreview]   = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const processImage = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setPhase('error');
      return;
    }
    setPreview(URL.createObjectURL(file));
    setPhase('loading');
    setProgress(0);

    try {
      const result = await Tesseract.recognize(
        file,
        'ben+eng',  // বাংলা + ইংরেজি
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
        }
      );
      const text = result.data.text.trim();
      setPhase('done');
      if (onText) onText(text);
    } catch (err) {
      console.error('OCR error', err);
      setPhase('error');
    }
  }, [onText]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) { processImage(file); return; }
      }
    }
  }, [processImage]);

  const reset = () => {
    setPhase('idle');
    setPreview(null);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  const boxStyle = {
    border: isDragging ? '2px dashed #2563eb' : phase === 'done' ? '2px solid #22c55e' : phase === 'error' ? '2px solid #ef4444' : '2px dashed #cbd5e1',
    borderRadius: '1rem',
    padding: '1rem 1.25rem',
    background: isDragging ? '#dbeafe' : phase === 'done' ? '#f0fdf4' : phase === 'error' ? '#fef2f2' : '#f8fafc',
    cursor: phase === 'idle' ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    minHeight: '64px',
  };

  return (
    <div
      style={boxStyle}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <style>{'@keyframes ocr-spin { to { transform: rotate(360deg); } }'}</style>

      {/* Idle / drag state */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }} onClick={() => fileRef.current?.click()}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>📷</span>
          <div>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>ছবি থেকে টেক্সট বের করুন (OCR)</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0' }}>ক্লিক করুন, ছবি টেনে আনুন অথবা Ctrl+V দিয়ে পেস্ট করুন (বাংলা ও ইংরেজি)</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {phase === 'loading' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
          {preview && <img src={preview} alt="preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e2e8f0', flexShrink: 0 }} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #cbd5e1', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'ocr-spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>OCR চলছে… {progress}%</span>
            </div>
            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#3b82f6', borderRadius: '99px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>
      )}

      {/* Done */}
      {phase === 'done' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%' }}>
          <span style={{ fontSize: '0.85rem', background: '#22c55e', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>✓</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', flex: 1 }}>OCR সফল! প্রশ্নের বক্সে টেক্সট চলে এসেছে।</span>
          <button type="button" onClick={reset} style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>আবার করুন</button>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%' }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#991b1b', flex: 1 }}>OCR ব্যর্থ হয়েছে। পরিষ্কার ছবি দিয়ে আবার চেষ্টা করুন।</span>
          <button type="button" onClick={reset} style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>আবার করুন</button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
