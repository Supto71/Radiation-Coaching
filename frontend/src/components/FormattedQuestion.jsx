import React from 'react';
import { hasHtmlTags, sanitizeHtmlForDisplay, decodeHtmlEntities } from '../utils/textUtils';

/**
 * FormattedQuestion Component
 * Cleanly renders exam question text or options:
 * - Prevents raw HTML tag leaks (renders formatted HTML or decodes text)
 * - Prevents horizontal scrollbars (word-wrap, break-words, overflow-wrap)
 * - Displays multi-line questions vertically top-to-bottom
 */
const FormattedQuestion = ({ content, className = '' }) => {
  if (content === null || content === undefined) return null;

  const stringContent = typeof content === 'string' ? content : String(content);

  // If text contains HTML tags (e.g. <b>, <i>, <sub>, <sup>, <p>, <br>, <img>)
  if (hasHtmlTags(stringContent)) {
    const cleanHtml = sanitizeHtmlForDisplay(stringContent);
    return (
      <div
        className={`formatted-question-content break-words whitespace-normal leading-relaxed text-left [overflow-wrap:anywhere] max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2 [&_table]:w-full [&_table]:border-collapse [&_sub]:text-[0.75em] [&_sup]:text-[0.75em] ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  }

  // Plain text (with line breaks, entities decoded)
  const decodedText = decodeHtmlEntities(stringContent);

  return (
    <div className={`break-words whitespace-pre-wrap leading-relaxed text-left [overflow-wrap:anywhere] max-w-full ${className}`}>
      {decodedText}
    </div>
  );
};

export default FormattedQuestion;
