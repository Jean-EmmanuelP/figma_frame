'use client';

import { useState } from 'react';
import AnimatedHeadline from './AnimatedHeadline';

interface UrlFormProps {
  initialUrl?: string;
  onSubmit: (url: string) => void;
  loading?: boolean;
  title?: string;
}

export default function UrlForm({ initialUrl = '', onSubmit, loading = false, title }: UrlFormProps) {
  const [url, setUrl] = useState(initialUrl);

  // Validation function for Figma URL format
  const isValidFigmaUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString.trim());
      
      // Check if it's a Figma URL
      if (urlObj.hostname !== 'www.figma.com') {
        return false;
      }
      
      // Check if it matches the design format: /design/[fileId]/[fileName]
      const designPattern = /^\/design\/[a-zA-Z0-9]+\/[^/]+/;
      
      return designPattern.test(urlObj.pathname);
    } catch {
      return false;
    }
  };

  const isUrlValid = isValidFigmaUrl(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && isUrlValid) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-[80vw] sm:max-w-none mx-auto">
      {title && (
        <div className="flex items-center gap-3 sm:gap-4 flex-col sm:flex-row text-center sm:text-left">
          <AnimatedHeadline
            text={title}
            delay={0.3}
            durationPerWord={0.5}
            stagger={0.12}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-[#EAEAEA] tracking-tight max-w-[80vw] sm:max-w-none mx-auto"
          />
        </div>
      )}
      
      <div className="relative w-full max-w-[80vw] sm:max-w-none mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className="border border-[#333333] rounded-3xl relative z-10 bg-[#111111] text-white"
        >
        <div className="relative z-10 rounded-3xl">
          <div className="relative flex-1">
            <textarea
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.figma.com/design/..."
              rows={1}
              className="resize-none placeholder:text-[#666666] w-full bg-transparent text-sm sm:text-md outline-none ring-0 min-h-[51px] rounded-3xl focus:border-none focus:outline-none focus:ring-0 pr-14 pl-4 py-4"
              disabled={loading}
              required
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.max(51, target.scrollHeight) + 'px';
              }}
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
            />
          </div>
          
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            <button
              type="submit"
              disabled={loading || !url.trim() || !isUrlValid}
              className="bg-white text-black inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 h-8 w-8 rounded-full p-0 hover:bg-gray-100 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        </form>
        
        {/* Validation message */}
        {url.trim() && !isUrlValid && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg max-w-[80vw] sm:max-w-none mx-auto">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm max-w-[80vw] sm:max-w-none">
                <p className="text-red-300 font-medium mb-1">Format URL incorrect</p>
                <p className="text-red-200/80">
                  Veuillez utiliser une URL Figma au format :<br />
                  <code className="text-xs bg-red-500/20 px-1 py-0.5 rounded break-all">
                    https://www.figma.com/design/[fileId]/[fileName]
                  </code>
                </p>
                <p className="text-red-200/60 text-xs mt-1 break-all">
                  Exemple : https://www.figma.com/design/0WsMTA8BmYHCNOqL6G1GGQ/Untitled
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}