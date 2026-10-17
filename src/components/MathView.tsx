import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Pre-cleans common LaTeX / OCR quirks from engineering slide PDFs:
 * - Fixes {\f\overline{...}} or \f\overline to standard \overline{...}
 * - Cleans up stray \f commands
 * - Normalizes arrows and logic operators
 */
function sanitizeLatex(raw: string): string {
  if (!raw) return '';

  let cleaned = raw.trim();

  // Fix {\f\overline{...}} and \f\overline{...}
  cleaned = cleaned
    .replace(/\{\\f\\overline\{([^}]+)\}\}/g, '\\overline{$1}')
    .replace(/\\f\\overline\{([^}]+)\}/g, '\\overline{$1}')
    .replace(/\{\\f\\overline\s+([^}]+)\}/g, '\\overline{$1}')
    .replace(/\\f\\overline/g, '\\overline')
    .replace(/\\f\s*([a-zA-Z]+)/g, '$1');

  // Clean up broken \text{...} or non-standard commands
  cleaned = cleaned
    .replace(/\\text\{([A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s,\.\-]+)\}/g, (match, p1) => {
      // In KaTeX, keep \text if simple, or clean
      return `\\text{${p1}}`;
    });

  return cleaned;
}

/**
 * Formats a mathematical string into clean, readable Unicode / HTML
 * when KaTeX encounters syntax it cannot parse or when text mode is preferred.
 */
function formatMathFallback(raw: string): string {
  return raw
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\overline\{([^}]+)\}/g, '$1̄')
    .replace(/\\bar\{([^}]+)\}/g, '$1̄')
    .replace(/\\Longrightarrow/g, ' ⟹ ')
    .replace(/\\implies/g, ' ⟹ ')
    .replace(/\\Longleftrightarrow/g, ' ⟺ ')
    .replace(/\\iff/g, ' ⟺ ')
    .replace(/\\to/g, ' → ')
    .replace(/\\le/g, ' ≤ ')
    .replace(/\\ge/g, ' ≥ ')
    .replace(/\\ne/g, ' ≠ ')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\oplus/g, ' ⊕ ')
    .replace(/\\odot/g, ' ⊙ ')
    .replace(/\\land/g, ' ∧ ')
    .replace(/\\lor/g, ' ∨ ')
    .replace(/\\neg/g, ' ¬ ')
    .replace(/\\in/g, ' ∈ ')
    .replace(/\\notin/g, ' ∉ ')
    .replace(/\\subset/g, ' ⊂ ')
    .replace(/\\subseteq/g, ' ⊆ ')
    .replace(/\\sum/g, ' ∑ ')
    .replace(/\\int/g, ' ∫ ')
    .replace(/\\infty/g, ' ∞ ')
    .replace(/\\mathbb\{([A-Z])\}/g, '$1')
    .replace(/\\Sigma/g, ' Σ ')
    .replace(/\\varphi/g, ' φ ')
    .replace(/\\quad/g, '  ')
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\dots/g, '…')
    .replace(/\\pm/g, '±')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\{|\}/g, '');
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const result = useMemo(() => {
    if (!math) return { type: 'empty', content: '' };

    const sanitized = sanitizeLatex(math);

    // If string is pure explanatory text without math markers, format cleanly
    if (!sanitized.includes('\\') && !sanitized.includes('^') && !sanitized.includes('_')) {
      return { type: 'text', content: sanitized };
    }

    try {
      // Try strict parsing first to ensure no broken error badges
      const html = katex.renderToString(sanitized, {
        displayMode: block,
        throwOnError: true,
        output: 'htmlAndMathml'
      });

      return { type: 'katex', content: html };
    } catch {
      // Fallback: strip LaTeX braces and render formatted Unicode typography
      const fallback = formatMathFallback(sanitized);
      return { type: 'fallback', content: fallback };
    }
  }, [math, block]);

  if (result.type === 'empty') return null;

  if (result.type === 'katex') {
    return (
      <span
        className={`${block ? 'block my-1.5' : 'inline-block'} font-sans ${className}`}
        dangerouslySetInnerHTML={{ __html: result.content }}
      />
    );
  }

  return (
    <span
      className={`${block ? 'block my-1.5' : 'inline'} font-mono text-xs sm:text-sm tracking-tight ${className}`}
    >
      {result.content}
    </span>
  );
};
