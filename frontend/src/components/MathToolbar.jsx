import React, { useState } from 'react';

/**
 * MathToolbar - টুলবার যেখান থেকে subscript, superscript, এবং math symbols
 * সহজে insert করা যায়। textarea-এর ref দিয়ে কাজ করে।
 * 
 * Props:
 * - textareaRef: ref to the target textarea element
 * - value: current textarea value
 * - onChange: callback(newValue) when text changes
 */

const MATH_SYMBOLS = [
  { label: '√', value: '√', title: 'Square root' },
  { label: 'π', value: 'π', title: 'Pi' },
  { label: 'θ', value: 'θ', title: 'Theta' },
  { label: 'α', value: 'α', title: 'Alpha' },
  { label: 'β', value: 'β', title: 'Beta' },
  { label: 'γ', value: 'γ', title: 'Gamma' },
  { label: 'δ', value: 'δ', title: 'Delta' },
  { label: 'λ', value: 'λ', title: 'Lambda' },
  { label: 'μ', value: 'μ', title: 'Mu' },
  { label: 'σ', value: 'σ', title: 'Sigma' },
  { label: 'ω', value: 'ω', title: 'Omega' },
  { label: 'Δ', value: 'Δ', title: 'Delta (capital)' },
  { label: 'Σ', value: 'Σ', title: 'Sigma (capital)' },
  { label: 'Ω', value: 'Ω', title: 'Omega (capital)' },
  { label: '±', value: '±', title: 'Plus-Minus' },
  { label: '×', value: '×', title: 'Multiplication' },
  { label: '÷', value: '÷', title: 'Division' },
  { label: '≤', value: '≤', title: 'Less than or equal' },
  { label: '≥', value: '≥', title: 'Greater than or equal' },
  { label: '≠', value: '≠', title: 'Not equal' },
  { label: '∞', value: '∞', title: 'Infinity' },
  { label: '°', value: '°', title: 'Degree' },
  { label: '→', value: '→', title: 'Right arrow' },
  { label: '⇌', value: '⇌', title: 'Equilibrium' },
  { label: '∫', value: '∫', title: 'Integral' },
  { label: '∂', value: '∂', title: 'Partial derivative' },
  { label: '∑', value: '∑', title: 'Summation' },
  { label: '∏', value: '∏', title: 'Product' },
  { label: '⁰', value: '⁰', title: 'Superscript 0' },
  { label: '¹', value: '¹', title: 'Superscript 1' },
  { label: '²', value: '²', title: 'Superscript 2' },
  { label: '³', value: '³', title: 'Superscript 3' },
  { label: '⁴', value: '⁴', title: 'Superscript 4' },
  { label: '⁵', value: '⁵', title: 'Superscript 5' },
  { label: '⁶', value: '⁶', title: 'Superscript 6' },
  { label: '⁷', value: '⁷', title: 'Superscript 7' },
  { label: '⁸', value: '⁸', title: 'Superscript 8' },
  { label: '⁹', value: '⁹', title: 'Superscript 9' },
  { label: 'ⁿ', value: 'ⁿ', title: 'Superscript n' },
  { label: '⁻', value: '⁻', title: 'Superscript minus' },
  { label: '⁺', value: '⁺', title: 'Superscript plus' },
  { label: '₀', value: '₀', title: 'Subscript 0' },
  { label: '₁', value: '₁', title: 'Subscript 1' },
  { label: '₂', value: '₂', title: 'Subscript 2' },
  { label: '₃', value: '₃', title: 'Subscript 3' },
  { label: '₄', value: '₄', title: 'Subscript 4' },
  { label: '₅', value: '₅', title: 'Subscript 5' },
  { label: '₆', value: '₆', title: 'Subscript 6' },
  { label: '₇', value: '₇', title: 'Subscript 7' },
  { label: '₈', value: '₈', title: 'Subscript 8' },
  { label: '₉', value: '₉', title: 'Subscript 9' },
];

// Quick-access frequently used in science
const QUICK_FORMULAS = [
  { label: 'H₂O', value: 'H₂O', title: 'Water' },
  { label: 'CO₂', value: 'CO₂', title: 'Carbon Dioxide' },
  { label: 'O₂', value: 'O₂', title: 'Oxygen' },
  { label: 'N₂', value: 'N₂', title: 'Nitrogen' },
  { label: 'H₂SO₄', value: 'H₂SO₄', title: 'Sulfuric Acid' },
  { label: 'NaOH', value: 'NaOH', title: 'Sodium Hydroxide' },
  { label: 'x²', value: 'x²', title: 'x squared' },
  { label: 'x³', value: 'x³', title: 'x cubed' },
  { label: 'xⁿ', value: 'xⁿ', title: 'x to the n' },
  { label: 'x⁻¹', value: 'x⁻¹', title: 'x inverse' },
  { label: 'cm²', value: 'cm²', title: 'Square cm' },
  { label: 'cm³', value: 'cm³', title: 'Cubic cm' },
  { label: 'm/s²', value: 'm/s²', title: 'Acceleration' },
  { label: '°C', value: '°C', title: 'Degree Celsius' },
];

const MathToolbar = ({ textareaRef, value, onChange }) => {
  const [showSymbols, setShowSymbols] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [activeTab, setActiveTab] = useState('subscript'); // subscript | superscript | greek | math | arrows

  const insertAtCursor = (insertText) => {
    const textarea = textareaRef?.current;
    if (!textarea) {
      // Fallback: append to end
      onChange(value + insertText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + insertText + value.substring(end);
    onChange(newValue);

    // Restore cursor position after React re-renders
    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + insertText.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  const wrapSelection = (before, after) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      // Wrap selected text
      const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      });
    } else {
      // Insert placeholder
      const placeholder = before + '...' + after;
      const newValue = value.substring(0, start) + placeholder + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.focus();
        const selectStart = start + before.length;
        textarea.setSelectionRange(selectStart, selectStart + 3);
      });
    }
  };

  const symbolsByCategory = {
    subscript: MATH_SYMBOLS.filter(s => s.title.startsWith('Subscript')),
    superscript: MATH_SYMBOLS.filter(s => s.title.startsWith('Superscript')),
    greek: MATH_SYMBOLS.filter(s => ['Alpha', 'Beta', 'Gamma', 'Delta', 'Theta', 'Lambda', 'Mu', 'Sigma', 'Omega', 'Pi',
      'Delta (capital)', 'Sigma (capital)', 'Omega (capital)'].includes(s.title)),
    math: MATH_SYMBOLS.filter(s => ['Square root', 'Plus-Minus', 'Multiplication', 'Division', 'Less than or equal',
      'Greater than or equal', 'Not equal', 'Infinity', 'Degree', 'Integral', 'Partial derivative', 'Summation', 'Product'].includes(s.title)),
    arrows: MATH_SYMBOLS.filter(s => ['Right arrow', 'Equilibrium'].includes(s.title)),
  };

  return (
    <div className="math-toolbar">
      {/* Main toolbar buttons */}
      <div className="flex flex-wrap items-center gap-1.5 mb-1">
        {/* Subscript/Superscript HTML tag buttons */}
        <button
          type="button"
          onClick={() => wrapSelection('<sub>', '</sub>')}
          className="px-2.5 py-1.5 text-xs font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg transition-colors border border-blue-200"
          title="সাবস্ক্রিপ্ট (নিচের লেখা) - টেক্সট সিলেক্ট করে ক্লিক করুন (যেমন: H₂O)"
        >
          X<sub className="text-[9px]">2</sub>
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('<sup>', '</sup>')}
          className="px-2.5 py-1.5 text-xs font-bold bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-lg transition-colors border border-purple-200"
          title="সুপারস্ক্রিপ্ট (উপরের লেখা) - টেক্সট সিলেক্ট করে ক্লিক করুন (যেমন: x²)"
        >
          X<sup className="text-[9px]">2</sup>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Quick Unicode symbols */}
        <button
          type="button"
          onClick={() => { setShowSymbols(!showSymbols); setShowFormulas(false); }}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors border ${showSymbols ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200'}`}
          title="গণিত/বিজ্ঞান সিম্বল"
        >
          α √ π ∑
        </button>

        <button
          type="button"
          onClick={() => { setShowFormulas(!showFormulas); setShowSymbols(false); }}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors border ${showFormulas ? 'bg-teal-600 text-white border-teal-700' : 'bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200'}`}
          title="দ্রুত ফর্মুলা (H₂O, x², etc.)"
        >
          H₂O x²
        </button>
      </div>

      {/* Expandable Symbols Panel */}
      {showSymbols && (
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-2 shadow-lg animate-fade-in">
          <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-100 pb-2">
            {[
              { key: 'subscript', label: 'সাবস্ক্রিপ্ট ₁₂₃' },
              { key: 'superscript', label: 'সুপারস্ক্রিপ্ট ¹²³' },
              { key: 'greek', label: 'গ্রীক αβγ' },
              { key: 'math', label: 'গণিত ±√∞' },
              { key: 'arrows', label: 'তীর →⇌' },
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(symbolsByCategory[activeTab] || []).map((sym, i) => (
              <button
                key={i}
                type="button"
                onClick={() => insertAtCursor(sym.value)}
                className="w-9 h-9 flex items-center justify-center text-base font-medium bg-gray-50 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all active:scale-90"
                title={sym.title}
              >
                {sym.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Formulas Panel */}
      {showFormulas && (
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-2 shadow-lg animate-fade-in">
          <p className="text-xs text-gray-500 mb-2 font-medium">দ্রুত ফর্মুলা — ক্লিক করলেই ইনসার্ট হবে:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_FORMULAS.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => insertAtCursor(f.value)}
                className="px-3 py-1.5 text-sm font-medium bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg border border-teal-200 hover:border-teal-400 transition-all active:scale-95"
                title={f.title}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MathToolbar;
