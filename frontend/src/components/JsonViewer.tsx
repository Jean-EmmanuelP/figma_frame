'use client';

import { useState } from 'react';

interface JsonViewerProps {
  data: any;
  className?: string;
}

export default function JsonViewer({ data, className = '' }: JsonViewerProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center gap-3 px-6 py-4 bg-[#111111] border border-[#1F1F1F] text-[#EAEAEA] 
                   rounded-xl hover:bg-[#1A1A1A] hover:border-[#333333] transition-smooth font-light text-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        {isVisible ? 'Masquer JSON' : 'Voir JSON'}
      </button>
      
      {isVisible && (
        <div className="mt-6 fade-in">
          <pre className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-8 overflow-x-auto text-sm max-h-96 
                         text-[#A3A3A3] leading-relaxed font-mono">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}