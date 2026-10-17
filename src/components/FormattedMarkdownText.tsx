import React, { useMemo } from 'react';
import katex from 'katex';

interface FormattedMarkdownTextProps {
  content: string;
  className?: string;
}

/**
 * Cleanly strips unrendered LaTeX artifacts and formats \text{...}
 */
export function cleanRawLatexText(text: string): string {
  if (!text) return '';
  return text
    // Replace \text{Adición} with Adición
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    // Normalize logic / math symbols if outside katex
    .replace(/\\implies/g, ' ⟹ ')
    .replace(/\\iff/g, ' ⟺ ')
    .replace(/\\le/g, ' ≤ ')
    .replace(/\\ge/g, ' ≥ ')
    .replace(/\\ne/g, ' ≠ ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\times/g, ' × ')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\land/g, ' ∧ ')
    .replace(/\\lor/g, ' ∨ ')
    .replace(/\\neg/g, ' ¬ ')
    .replace(/\\oplus/g, ' ⊕ ')
    .replace(/\\in/g, ' ∈ ')
    .replace(/\\notin/g, ' ∉ ')
    .replace(/\\to/g, ' → ')
    .replace(/\\sum/g, ' ∑ ')
    .replace(/\\int/g, ' ∫ ')
    .replace(/\\infty/g, ' ∞ ')
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\mathbb\{Z\}/g, 'ℤ')
    .replace(/\\mathbb\{N\}/g, 'ℕ')
    .replace(/\\mathbb\{Q\}/g, 'ℚ')
    .replace(/\\mathbb\{C\}/g, 'ℂ')
    .replace(/\\pmod\{([^}]+)\}/g, ' (mod $1)')
    .replace(/\\mod\{([^}]+)\}/g, ' mod $1');
}

/**
 * Renders inline math or displays clean fallback
 */
function renderInlineKaTeX(mathExpr: string): string {
  try {
    return katex.renderToString(mathExpr, {
      displayMode: false,
      throwOnError: false,
      output: 'htmlAndMathml'
    });
  } catch {
    return cleanRawLatexText(mathExpr);
  }
}

/**
 * Renders block math or displays clean fallback
 */
function renderBlockKaTeX(mathExpr: string): string {
  try {
    return katex.renderToString(mathExpr, {
      displayMode: true,
      throwOnError: false,
      output: 'htmlAndMathml'
    });
  } catch {
    return `<div class="font-mono text-center my-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">${cleanRawLatexText(
      mathExpr
    )}</div>`;
  }
}

/**
 * Component that parses Markdown blocks, headers, bullet lists, code blocks,
 * and LaTeX math ($$ ... $$, $ ... $, \text{...}) cleanly and beautifully.
 */
export const FormattedMarkdownText: React.FC<FormattedMarkdownTextProps> = ({
  content,
  className = ''
}) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // First, split content by block math: $$ ... $$ or \[ ... \]
    const blockMathRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
    const parts = content.split(blockMathRegex);

    return parts.map((part, pIdx) => {
      // Is this a block math block?
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathContent = part.slice(2, -2).trim();
        const html = renderBlockKaTeX(mathContent);
        return (
          <div
            key={`block-math-${pIdx}`}
            className="my-3 overflow-x-auto text-center py-2 px-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const mathContent = part.slice(2, -2).trim();
        const html = renderBlockKaTeX(mathContent);
        return (
          <div
            key={`block-math-brack-${pIdx}`}
            className="my-3 overflow-x-auto text-center py-2 px-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      // Ordinary text paragraphs and markdown blocks
      const lines = part.split('\n');
      const blockElements: React.ReactNode[] = [];
      let inCodeBlock = false;
      let codeBlockContent: string[] = [];
      let codeBlockLang = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code block toggle
        if (line.trim().startsWith('```')) {
          if (inCodeBlock) {
            inCodeBlock = false;
            blockElements.push(
              <div
                key={`code-${pIdx}-${i}`}
                className="my-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner"
              >
                {codeBlockLang && (
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5 pb-1 border-b border-slate-800">
                    {codeBlockLang}
                  </div>
                )}
                <pre>{codeBlockContent.join('\n')}</pre>
              </div>
            );
            codeBlockContent = [];
            codeBlockLang = '';
          } else {
            inCodeBlock = true;
            codeBlockLang = line.trim().replace(/^```/, '').trim();
          }
          continue;
        }

        if (inCodeBlock) {
          codeBlockContent.push(line);
          continue;
        }

        // Markdown Headers
        if (line.startsWith('### ')) {
          blockElements.push(
            <h4
              key={`h4-${pIdx}-${i}`}
              className="text-sm font-bold text-slate-900 dark:text-white mt-4 mb-2 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
              <span>{formatInlineText(line.replace('### ', ''))}</span>
            </h4>
          );
          continue;
        }

        if (line.startsWith('## ')) {
          blockElements.push(
            <h3
              key={`h3-${pIdx}-${i}`}
              className="text-base font-bold text-slate-900 dark:text-white mt-5 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800"
            >
              {formatInlineText(line.replace('## ', ''))}
            </h3>
          );
          continue;
        }

        if (line.startsWith('# ')) {
          blockElements.push(
            <h2
              key={`h2-${pIdx}-${i}`}
              className="text-lg font-extrabold text-slate-900 dark:text-white mt-6 mb-3"
            >
              {formatInlineText(line.replace('# ', ''))}
            </h2>
          );
          continue;
        }

        // Horizontal rule
        if (line.trim() === '---' || line.trim() === '***') {
          blockElements.push(
            <hr
              key={`hr-${pIdx}-${i}`}
              className="my-4 border-slate-200 dark:border-slate-800"
            />
          );
          continue;
        }

        // List item bullet
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const itemText = line.trim().substring(2);
          blockElements.push(
            <div
              key={`li-${pIdx}-${i}`}
              className="flex items-start gap-2 my-1 pl-1 text-slate-800 dark:text-slate-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <div className="flex-1">{formatInlineText(itemText)}</div>
            </div>
          );
          continue;
        }

        // Numbered list item
        const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          blockElements.push(
            <div
              key={`nli-${pIdx}-${i}`}
              className="flex items-start gap-2.5 my-1 pl-1 text-slate-800 dark:text-slate-200"
            >
              <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 shrink-0 font-mono mt-0.5">
                {numberedMatch[1]}.
              </span>
              <div className="flex-1">{formatInlineText(numberedMatch[2])}</div>
            </div>
          );
          continue;
        }

        // Markdown Table Row detection
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          // If it's a separator line |---|---| ignore or style
          if (/^\|[-:\s|]+\|$/.test(line.trim())) {
            continue;
          }
          const cells = line
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim());
          blockElements.push(
            <div
              key={`tbl-${pIdx}-${i}`}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1.5 px-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg my-1 text-xs border border-slate-200/50 dark:border-slate-700/50"
            >
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="font-medium text-slate-700 dark:text-slate-300">
                  {formatInlineText(cell)}
                </div>
              ))}
            </div>
          );
          continue;
        }

        // Empty line
        if (!line.trim()) {
          blockElements.push(<div key={`sp-${pIdx}-${i}`} className="h-2" />);
          continue;
        }

        // Standard paragraph line
        blockElements.push(
          <p key={`p-${pIdx}-${i}`} className="my-1.5 text-slate-800 dark:text-slate-200 leading-relaxed">
            {formatInlineText(line)}
          </p>
        );
      }

      return <div key={`chunk-${pIdx}`}>{blockElements}</div>;
    });
  }, [content]);

  return <div className={`space-y-1 ${className}`}>{renderedElements}</div>;
};

/**
 * Formats inline Markdown (**bold**, *italic*, `code`, and $math$)
 */
function formatInlineText(text: string): React.ReactNode {
  if (!text) return null;

  // Split by inline math: $ ... $ or \( ... \)
  const inlineMathRegex = /(\$[^\$\n]+?\$|\\\([^\n]+?\\\))/g;
  const segments = text.split(inlineMathRegex);

  return segments.map((seg, sIdx) => {
    // Check if inline math
    if ((seg.startsWith('$') && seg.endsWith('$') && seg.length > 2) ||
        (seg.startsWith('\\(') && seg.endsWith('\\)'))) {
      const mathRaw = seg.startsWith('$') ? seg.slice(1, -1) : seg.slice(2, -2);
      const renderedHtml = renderInlineKaTeX(mathRaw);
      return (
        <span
          key={`inline-math-${sIdx}`}
          className="inline-block px-1 font-sans"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      );
    }

    // Process bold, italic, code tags, and strip stray \text{...}
    let processed = cleanRawLatexText(seg);

    // Split for bold **text**
    const boldParts = processed.split(/(\*\*[^*]+?\*\*)/g);

    return (
      <span key={`text-seg-${sIdx}`}>
        {boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith('**') && bPart.endsWith('**')) {
            const inner = bPart.slice(2, -2);
            return (
              <strong
                key={`b-${bIdx}`}
                className="font-bold text-slate-900 dark:text-white"
              >
                {inner}
              </strong>
            );
          }

          // Split for inline `code`
          const codeParts = bPart.split(/(`[^`]+?`)/g);
          return (
            <span key={`c-${bIdx}`}>
              {codeParts.map((cPart, cIdx) => {
                if (cPart.startsWith('`') && cPart.endsWith('`')) {
                  return (
                    <code
                      key={`cd-${cIdx}`}
                      className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] border border-slate-200 dark:border-slate-700"
                    >
                      {cPart.slice(1, -1)}
                    </code>
                  );
                }
                return cPart;
              })}
            </span>
          );
        })}
      </span>
    );
  });
}
