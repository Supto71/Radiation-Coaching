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

  return (
    <div
      className={"ocr-box " + (isDragging ? 'ocr-dragging' : '') + (phase === 'done' ? ' ocr-done' : '') + (phase === 'error' ? ' ocr-err' : '')}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <style>{CSS}</style>

      {/* Idle / drag state */}
      {phase === 'idle' && (
        <div className="ocr-idle-content" onClick={() => fileRef.current?.click()}>
          <span className="ocr-cam-icon">📷</span>
          <div>
            <p className="ocr-main-text">ছবি থেকে টেক্সট বের করুন (OCR)</p>
            <p className="ocr-sub-text">ক্লিক করুন, ছবি টেনে আনুন অথবা Ctrl+V দিয়ে paste করুন</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {phase === 'loading' && (
        <div className="ocr-loading-content">
          {preview && <img src={preview} alt="preview" className="ocr-thumb" />}
          <div className="ocr-progress-wrap">
            <span className="ocr-spinner" />
            <span className="ocr-prog-label">OCR চলছে… {progress}%</span>
            <div className="ocr-track">
              <div className="ocr-fill" style={{ width: progress + '%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Done */}
      {phase === 'done' && (
        <div className="ocr-done-content">
          <span className="ocr-check">✓</span>
          <span className="ocr-done-text">OCR সফল! টেক্সট নিচের ফিল্ডে গেছে।</span>
          <button type="button" className="ocr-reset-btn" onClick={reset}>আবার করুন</button>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && (
        <div className="ocr-done-content">
          <span className="ocr-err-icon">⚠️</span>
          <span className="ocr-done-text">OCR ব্যর্থ হয়েছে। আবার চেষ্টা করুন।</span>
          <button type="button" className="ocr-reset-btn" onClick={reset}>আবার করুন</button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="ocr-file-input"
        onChange={handleFile}
      />
    </div>
  );
}

const CSS = 
  .ocr-box {
    border: 2px dashed #cbd5e1;
    border-radius: 1rem;
    padding: 1rem 1.25rem;
    background: #f8fafc;
    cursor: pointer;
    transition: border-color .2s, background .2s;
    outline: none;
    display: flex;
    align-items: center;
  }
  .ocr-box:focus, .ocr-box:hover { border-color: #3b82f6; background: #eff6ff; }
  .ocr-box.ocr-dragging { border-color: #2563eb; background: #dbeafe; }
  .ocr-box.ocr-done  { border-color: #22c55e; background: #f0fdf4; }
  .ocr-box.ocr-err   { border-color: #ef4444; background: #fef2f2; }

  .ocr-idle-content {
    display: flex; align-items: center; gap: .75rem; width: 100%;
  }
  .ocr-cam-icon { font-size: 1.5rem; flex-shrink: 0; }
  .ocr-main-text { font-size: .85rem; font-weight: 700; color: #1e293b; margin: 0; }
  .ocr-sub-text  { font-size: .72rem; color: #64748b; margin: .15rem 0 0; }

  .ocr-loading-content {
    display: flex; align-items: center; gap: .75rem; width: 100%;
  }
  .ocr-thumb {
    width: 48px; height: 48px; object-fit: cover; border-radius: .5rem;
    border: 1px solid #e2e8f0; flex-shrink: 0;
  }
  .ocr-progress-wrap { flex: 1; min-width: 0; }
  .ocr-spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid #cbd5e1; border-top-color: #3b82f6;
    border-radius: 50%; animation: ocr-spin .8s linear infinite; vertical-align: middle; margin-right: .4rem;
  }
  @keyframes ocr-spin { to { transform: rotate(360deg); } }
  .ocr-prog-label { font-size: .8rem; font-weight: 600; color: #334155; }
  .ocr-track { height: 5px; background: #e2e8f0; border-radius: 99px; margin-top: .4rem; overflow: hidden; }
  .ocr-fill  { height: 100%; background: #3b82f6; border-radius: 99px; transition: width .3s; }

  .ocr-done-content {
    display: flex; align-items: center; gap: .6rem; width: 100%;
  }
  .ocr-check    { font-size: .9rem; background: #22c55e; color: #fff; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; }
  .ocr-err-icon { font-size: 1.1rem; flex-shrink: 0; }
  .ocr-done-text { font-size: .82rem; font-weight: 600; color: #1e293b; flex: 1; }
  .ocr-reset-btn {
    background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0;
    border-radius: .5rem; padding: .3rem .75rem; font-size: .75rem; font-weight: 700; cursor: pointer;
    font-family: inherit; flex-shrink: 0;
  }
  .ocr-reset-btn:hover { background: #e2e8f0; }
  .ocr-file-input { display: none; }
;
