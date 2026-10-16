/**
 * parseBulkQuestions — একসাথে অনেক MCQ paste করলে parse করে
 *
 * Supported formats:
 * - English & Bengali numbering: 1., (1), 1), ১., (১), ১), প্রশ্ন ১:, Q1:
 * - English & Bengali options:
 *     A. / B. / C. / D.
 *     (a) / (b) / (c) / (d)
 *     a) / b) / c) / d)
 *     ক. / খ. / গ. / ঘ.
 *     (ক) / (খ) / (গ) / (ঘ)
 *     ক) / খ) / গ) / ঘ)
 * - Answers:
 *     Answer: B / Ans: B / উত্তর: খ / উঃ খ / সঠিক উত্তর: ক / Ans: 2
 *
 * Returns: Array of { text, options: [str, str, str, str], correct: number (0-3) }
 */

const LETTER_MAP = {
  'a': 0, 'b': 1, 'c': 2, 'd': 3,
  '1': 0, '2': 1, '3': 2, '4': 3,
  'ক': 0, 'খ': 1, 'গ': 2, 'ঘ': 3,
  '১': 0, '২': 1, '৩': 2, '৪': 3,
  'i': 0, 'ii': 1, 'iii': 2, 'iv': 3,
};

// Check if a line starts a new question
function isQuestionStart(line) {
  // e.g. 1. or (1) or 1) or ১. or (১) or ১) or প্রশ্ন ১: or Q1.
  return /^(?:(?:প্রশ্ন|question|q)\s*[-:]?\s*)?(?:\(?[\d০-৯]+[\.\)\:\-]\)?)\s+/i.test(line);
}

// Check if a line is an answer line
function isAnswerLine(line) {
  return /^(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?\s*/i.test(line);
}

export function parseBulkQuestions(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const questions = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!isQuestionStart(line)) {
      i++;
      continue;
    }

    // Extract question text
    const qMatch = line.match(/^(?:(?:প্রশ্ন|question|q)\s*[-:]?\s*)?(?:\(?[\d০-৯]+[\.\)\:\-]\)?)\s+(.+)/i);
    let questionText = qMatch ? qMatch[1].trim() : line;
    i++;

    // Collect subsequent lines until the next question start
    let contentLines = [];
    while (i < lines.length && !isQuestionStart(lines[i])) {
      contentLines.push(lines[i]);
      i++;
    }

    // Separate options lines and answer lines
    let ansLine = '';
    let optLines = [];

    for (const cLine of contentLines) {
      if (isAnswerLine(cLine)) {
        ansLine = cLine;
      } else {
        optLines.push(cLine);
      }
    }

    // Also check if the answer is on the same line as the question or options
    const joinedAll = [questionText, ...optLines].join(' ');

    // Extract options
    // Regex matches markers: A., (A), A), ক., (ক), ক)
    const optRegex = /(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)([\s\S]*?)(?=(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)|(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)|$)/gi;
    
    // We search options in optLines joined together
    let optionsLine = optLines.join(' ');
    
    // If no options found in optLines, maybe options are inline with the question text
    let opts = ['', '', '', ''];
    let foundOpts = 0;

    let m;
    while ((m = optRegex.exec(optionsLine)) !== null) {
      const marker = m[1].toLowerCase();
      const val = m[2].trim();
      const idx = LETTER_MAP[marker];
      if (idx !== undefined && idx >= 0 && idx < 4) {
        opts[idx] = val;
        foundOpts++;
      }
    }

    // If options were not found in separate lines, check if they are inline with the question line
    if (foundOpts < 2) {
      const inlineOptRegex = /(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)([\s\S]*?)(?=(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)|(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)|$)/gi;
      let firstMarkerIndex = -1;
      const markerMatch = questionText.search(/(?:\(?([A-Da-dক-ঘ])[\.\)\-]\)?\s+)/i);
      if (markerMatch !== -1) {
        const potentialQText = questionText.slice(0, markerMatch).trim();
        const optsPart = questionText.slice(markerMatch);
        let m2;
        let tempOpts = ['', '', '', ''];
        let tempFound = 0;
        while ((m2 = inlineOptRegex.exec(optsPart)) !== null) {
          const marker = m2[1].toLowerCase();
          const val = m2[2].trim();
          const idx = LETTER_MAP[marker];
          if (idx !== undefined && idx >= 0 && idx < 4) {
            tempOpts[idx] = val;
            tempFound++;
          }
        }
        if (tempFound >= 2) {
          questionText = potentialQText;
          opts = tempOpts;
          foundOpts = tempFound;
        }
      }
    }

    // Parse correct answer
    let correct = 0; // default to 0 (A / ক)
    const ansTarget = ansLine || joinedAll;
    const ansMatch = ansTarget.match(/(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?\s*\(?([A-Da-dক-ঘ1-4১-৪])\)?/i);
    if (ansMatch) {
      const ansKey = ansMatch[1].toLowerCase();
      if (LETTER_MAP[ansKey] !== undefined) {
        correct = LETTER_MAP[ansKey];
      }
    }

    // Clean any trailing answer text from the last option
    opts = opts.map(o => o.replace(/(?:ans(?:wer)?|উত্তর|উঃ|উ:|সঠিক\s*উত্তর)\s*[:.\-=]?\s*\(?([A-Da-dক-ঘ1-4১-৪])\)?/gi, '').trim());

    if (questionText && opts.filter(Boolean).length >= 2) {
      // Ensure all 4 options exist, pad if only 2 or 3
      while (opts.length < 4) opts.push('');
      questions.push({
        text: questionText,
        options: opts.slice(0, 4),
        correct: Math.min(Math.max(correct, 0), 3),
      });
    }
  }

  return questions;
}
