/**
 * parseBulkQuestions — একসাথে অনেক MCQ paste করলে parse করে
 *
 * Supported formats:
 * - Numbered questions: 1., (1), 1), ১., (১), ১), প্রশ্ন ১:, Q1:
 * - UNNUMBERED questions (e.g. "পানির রাসায়নিক সংকেত কোনটি?" followed by options)
 * - English & Bengali options:
 *     A. / B. / C. / D.
 *     (a) / (b) / (c) / (d)
 *     a) / b) / c) / d)
 *     ক. / খ. / গ. / ঘ.
 *     (ক) / (খ) / (গ) / (ঘ)
 *     ক) / খ) / গ) / ঘ)
 * - Single-line options or separate-line options
 * - Answers:
 *     Answer: B / Ans: B / উত্তর: খ / উঃ খ / সঠিক উত্তর: ক / Ans: 2
 *
 * Returns: Array of { text, options: [str, str, str, str], correct: number (0-3) }
 */

export function parseBulkQuestions(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const LETTER_MAP = {
    'a': 0, 'b': 1, 'c': 2, 'd': 3,
    '1': 0, '2': 1, '3': 2, '4': 3,
    'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3,
    '১': 0, '২': 1, '৩': 2, '৪': 3,
    'i': 0, 'ii': 1, 'iii': 2, 'iv': 3,
  };

  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const isOptStart = (line) => /^(?:\(?([A-Da-dক-ঘ1-4১-৪])[\.\)\-]\)?)\s+/i.test(line);
  const isAnsLine = (line) => /^(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?/i.test(line);
  const isNumberedQ = (line) => /^(?:(?:প্রশ্ন|question|q)\s*[-:]?\s*)?(?:\(?[\d০-৯]+[\.\)\:\-]\)?)\s+/i.test(line);

  const questions = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isAnsLine(line)) {
      i++;
      continue;
    }

    let questionText = '';
    
    if (isNumberedQ(line)) {
      const qMatch = line.match(/^(?:(?:প্রশ্ন|question|q)\s*[-:]?\s*)?(?:\(?[\d০-৯]+[\.\)\:\-]\)?)\s+(.+)/i);
      questionText = qMatch ? qMatch[1].trim() : line;
      i++;
      while (i < lines.length && !isOptStart(lines[i]) && !isAnsLine(lines[i]) && !isNumberedQ(lines[i])) {
        if (/(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)/i.test(lines[i])) break;
        questionText += ' ' + lines[i];
        i++;
      }
    } else if (!isOptStart(line) && !isAnsLine(line)) {
      let foundOpt = false;
      if (/(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)/i.test(line)) {
        foundOpt = true;
      } else {
        for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
          if (isOptStart(lines[j]) || /(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)/i.test(lines[j])) {
            foundOpt = true;
            break;
          }
          if (isNumberedQ(lines[j])) break;
        }
      }

      if (foundOpt) {
        questionText = line;
        i++;
        while (i < lines.length && !isOptStart(lines[i]) && !isAnsLine(lines[i]) && !isNumberedQ(lines[i])) {
          if (/(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)/i.test(lines[i])) break;
          questionText += ' ' + lines[i];
          i++;
        }
      } else {
        i++;
        continue;
      }
    } else {
      i++;
      continue;
    }

    const opts = ['', '', '', ''];
    let correct = 0;
    let foundOpts = 0;

    const inlineMarkerMatch = questionText.search(/(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)/i);
    let optSearchStr = '';
    if (inlineMarkerMatch !== -1) {
      optSearchStr = questionText.slice(inlineMarkerMatch);
      questionText = questionText.slice(0, inlineMarkerMatch).trim();
    }

    while (i < lines.length) {
      const cur = lines[i];

      if (isAnsLine(cur)) {
        const ansMatch = cur.match(/(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?\s*\(?([A-Da-dক-ঘ1-4১-৪])\)?/i);
        if (ansMatch) {
          const key = ansMatch[1].toLowerCase();
          if (LETTER_MAP[key] !== undefined) correct = LETTER_MAP[key];
        }
        i++;
        break;
      }

      if (isNumberedQ(cur)) break;

      if (!isOptStart(cur) && !isAnsLine(cur)) {
        let isNextQ = false;
        for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
          if (isOptStart(lines[j])) { isNextQ = true; break; }
        }
        if (isNextQ) break;
      }

      optSearchStr += ' ' + cur;
      i++;
    }

    const optRegex = /(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)([\s\S]*?)(?=(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)|(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)|$)/gi;
    let m;
    while ((m = optRegex.exec(optSearchStr)) !== null) {
      const marker = m[1].toLowerCase();
      let val = m[2].trim();
      val = val.replace(/(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?\s*\(?([A-Da-dক-ঘ1-4১-৪])\)?/gi, '').trim();
      const idx = LETTER_MAP[marker];
      if (idx !== undefined && idx >= 0 && idx < 4) {
        opts[idx] = val;
        foundOpts++;
      }
    }

    const inlineAnsMatch = optSearchStr.match(/(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?\s*\(?([A-Da-dক-ঘ1-4১-৪])\)?/i);
    if (inlineAnsMatch) {
      const key = inlineAnsMatch[1].toLowerCase();
      if (LETTER_MAP[key] !== undefined) correct = LETTER_MAP[key];
    }

    if (i < lines.length && isAnsLine(lines[i])) {
      const ansMatch = lines[i].match(/(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?\s*\(?([A-Da-dক-ঘ1-4১-৪])\)?/i);
      if (ansMatch) {
        const key = ansMatch[1].toLowerCase();
        if (LETTER_MAP[key] !== undefined) correct = LETTER_MAP[key];
      }
      i++;
    }

    if (questionText && foundOpts >= 2) {
      questions.push({
        text: questionText,
        options: opts,
        correct: Math.min(Math.max(correct, 0), 3)
      });
    }
  }

  return questions;
}
