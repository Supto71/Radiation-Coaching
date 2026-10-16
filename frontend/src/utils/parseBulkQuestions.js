/**
 * parseBulkQuestions — একসাথে অনেক MCQ paste করলে parse করে
 *
 * Supported formats:
 *
 * Format 1 (numbered):
 *   1. What is H2O?
 *   A. Hydrogen   B. Water   C. Oxygen   D. Salt
 *   Answer: B
 *
 * Format 2 (bracket):
 *   (1) What is photosynthesis?
 *   (a) Process of eating  (b) Process of making food  (c) Digestion  (d) None
 *   Ans: b
 *
 * Returns: Array of { text, options[4], correct(0-3) }
 */

export function parseBulkQuestions(rawText) {
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const questions = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect question line: starts with number + . or ) or (n)
    const qMatch = line.match(/^(?:\(?\d+[\.\)]\)?)\s+(.+)/);
    if (!qMatch) { i++; continue; }

    const questionText = qMatch[1].trim();
    i++;

    // Next line(s): options
    let optionsLine = '';
    // Collect lines until we hit an Answer/Ans line or next question or end
    while (i < lines.length) {
      const next = lines[i];
      if (/^(?:ans(?:wer)?[:.\s]|উত্তর[:.\s])/i.test(next)) break;
      if (/^(?:\(?\d+[\.\)]\)?)\s+/.test(next)) break; // next question
      optionsLine += ' ' + next;
      i++;
    }

    // Parse options from optionsLine
    // Handles: A. text B. text C. text D. text
    //          a) text b) text c) text d) text
    //          (a) text (b) text ...
    const opts = ['', '', '', ''];
    const optPattern = /(?:\(?([A-Da-d])[\.\)]\)?\s+)([\s\S]*?)(?=\(?[A-Da-d][\.\)]|$)/g;
    let m;
    while ((m = optPattern.exec(optionsLine)) !== null) {
      const idx = m[1].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
      if (idx >= 0 && idx < 4) {
        opts[idx] = m[2].trim();
      }
    }

    // Parse answer
    let correct = 0;
    if (i < lines.length) {
      const ansLine = lines[i];
      const ansMatch = ansLine.match(/(?:ans(?:wer)?[:.\s]|উত্তর[:.\s])\s*([A-Da-d1-4])/i);
      if (ansMatch) {
        const raw = ansMatch[1].toLowerCase();
        if (['a','b','c','d'].includes(raw)) {
          correct = raw.charCodeAt(0) - 'a'.charCodeAt(0);
        } else {
          correct = parseInt(raw, 10) - 1;
        }
        i++;
      }
    }

    if (questionText && opts.some(o => o)) {
      questions.push({ text: questionText, options: opts, correct });
    }
  }

  return questions;
}
