'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  frameId: string;
}

export default function CodeBlock({ code, frameId }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Format HTML with proper indentation
  const formatHtml = (html: string): string => {
    let formatted = '';
    let indent = 0;
    const tab = '  '; // 2 spaces

    const tokens = html.split(/(<[^>]*>)/g).filter(token => token.trim());

    tokens.forEach(token => {
      if (token.startsWith('</')) {
        // Closing tag - decrease indent first, then add
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + token + '\n';
      } else if (token.startsWith('<') && !token.endsWith('/>') && !token.includes('</')) {
        // Opening tag - add then increase indent
        formatted += tab.repeat(indent) + token + '\n';
        // Don't increase indent for self-closing-like tags (img, input, etc.)
        if (!['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'].some(tag => 
            token.toLowerCase().includes(`<${tag}`))) {
          indent++;
        }
      } else if (token.startsWith('<') && token.endsWith('/>')) {
        // Self-closing tag
        formatted += tab.repeat(indent) + token + '\n';
      } else if (token.trim()) {
        // Text content
        formatted += tab.repeat(indent) + token.trim() + '\n';
      }
    });

    return formatted.trim();
  };

  const formattedCode = formatHtml(code);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };


  return (
    <div className="space-y-8 fade-in">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-6">
        <Button
          onClick={copyToClipboard}
          variant="default"
          size="lg"
          className="gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d={copied 
                    ? "M5 13l4 4L19 7"
                    : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  } />
          </svg>
          {copied ? 'Copié' : 'Copier'}
        </Button>
        
        <Button
          onClick={() => window.open('https://build.blackbox.ai/', '_blank')}
          variant="secondary"
          size="lg"
          className="gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Ouvrir dans Blackbox
        </Button>
      </div>
      
      {/* Code Block */}
      <div className="relative">
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <span className="text-sm text-[#666666] font-mono">HTML</span>
          <button
            onClick={copyToClipboard}
            className="p-2 text-[#666666] hover:text-white hover:bg-black rounded-lg transition-smooth"
            title="Copier le code"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        
        <pre className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8 overflow-x-auto text-base min-h-96 max-h-[600px]
                       text-[#A3A3A3] leading-relaxed font-mono">
          <code dangerouslySetInnerHTML={{ __html: formattedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
        </pre>
      </div>
    </div>
  );
}