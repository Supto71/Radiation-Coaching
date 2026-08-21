/**
 * Helper utilities for cleaning, decoding, and formatting question text
 */

// Decode HTML entities
export const decodeHtmlEntities = (text) => {
  if (!text || typeof text !== 'string') return text || '';
  
  // Common entities map
  const entities = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&le;': '≤',
    '&ge;': '≥',
    '&ne;': '≠',
    '&alpha;': 'α',
    '&beta;': 'β',
    '&gamma;': 'γ',
    '&delta;': 'δ',
    '&theta;': 'θ',
    '&lambda;': 'λ',
    '&mu;': 'μ',
    '&pi;': 'π',
    '&sigma;': 'σ',
    '&omega;': 'ω',
    '&deg;': '°',
    '&radic;': '√',
    '&infin;': '∞',
  };

  let decoded = text.replace(/&(?:[a-z]+|#\d+|#x[0-9a-f]+);/gi, (match) => {
    if (entities[match.toLowerCase()]) {
      return entities[match.toLowerCase()];
    }
    if (match.startsWith('&#x') || match.startsWith('&#X')) {
      const code = parseInt(match.slice(3, -1), 16);
      return !isNaN(code) ? String.fromCharCode(code) : match;
    }
    if (match.startsWith('&#')) {
      const code = parseInt(match.slice(2, -1), 10);
      return !isNaN(code) ? String.fromCharCode(code) : match;
    }
    return match;
  });

  return decoded;
};

// Check if string contains HTML tags
export const hasHtmlTags = (str) => {
  if (!str || typeof str !== 'string') return false;
  return /<\/?[a-z][\s\S]*>/i.test(str);
};

// Strip all HTML tags and convert to normal, clean plain text with preserved line breaks
export const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  let text = html;
  
  // Convert block tags and breaks to newlines
  text = text.replace(/<br\s*[\/]?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<\/tr>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n');

  // Strip all other HTML tags
  text = text.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  text = decodeHtmlEntities(text);

  // Normalize excessive blank lines (more than 2 in a row)
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
};

// Clean HTML to make it safe and responsive for rendering
export const sanitizeHtmlForDisplay = (html) => {
  if (!html || typeof html !== 'string') return '';

  let cleaned = decodeHtmlEntities(html);

  // Remove dangerous tags
  cleaned = cleaned.replace(/<(script|style|iframe|object|embed|applet)[\s\S]*?<\/\1>/gi, '');
  cleaned = cleaned.replace(/on\w+="[^"]*"/gi, '');
  cleaned = cleaned.replace(/on\w+='[^']*'/gi, '');
  cleaned = cleaned.replace(/javascript:/gi, '');

  return cleaned;
};
