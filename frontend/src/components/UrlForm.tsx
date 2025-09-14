'use client';

import { useState } from 'react';

interface UrlFormProps {
  initialUrl?: string;
  onSubmit: (url: string) => void;
  loading?: boolean;
  title?: string;
}

export default function UrlForm({ initialUrl = '', onSubmit, loading = false, title }: UrlFormProps) {
  const [url, setUrl] = useState(initialUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {title && (
        <div className="flex items-center gap-4">
          <svg width="60" height="52" viewBox="0 0 700 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M247.5 402.5C247.5 374.195 270.445 351.25 298.75 351.25H350V402.5C350 430.805 327.055 453.75 298.75 453.75C270.445 453.75 247.5 430.805 247.5 402.5Z" fill="#0ACF83"/>
            <path d="M350 300C350 271.696 372.945 248.75 401.25 248.75C429.554 248.75 452.5 271.695 452.5 300C452.5 328.305 429.554 351.25 401.25 351.25C372.945 351.25 350 328.304 350 300Z" fill="#1ABCFE"/>
            <path d="M247.5 300C247.5 328.305 270.445 351.25 298.75 351.25H350V248.75H298.75C270.445 248.75 247.5 271.695 247.5 300Z" fill="#A259FF"/>
            <path d="M350 146.25V248.75H401.25C429.555 248.75 452.5 225.805 452.5 197.5C452.5 169.195 429.555 146.25 401.25 146.25H350Z" fill="#FF7262"/>
            <path d="M247.5 197.5C247.5 225.805 270.445 248.75 298.75 248.75H350V146.25H298.75C270.445 146.25 247.5 169.195 247.5 197.5Z" fill="#F24E1E"/>
          </svg>
          <h1 className="text-4xl font-light text-[#EAEAEA] tracking-tight text-left">
            {title}
          </h1>
        </div>
      )}
      
      <div className="relative w-full">
        <form 
          onSubmit={handleSubmit} 
          className="border border-[#333333] rounded-3xl relative z-10 bg-[#111111] text-white"
        >
        <div className="relative z-10 rounded-3xl">
          <div className="relative flex-1 pl-3">
            <textarea
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.figma.com/file/..."
              rows={1}
              className="resize-none placeholder:text-[#666666] border border-gray-300 w-full overflow-auto flex-1 bg-transparent p-3 pb-1.5 pt-[1.3rem] text-md outline-none ring-0 min-h-[10px] rounded-3xl focus:border-none focus:outline-none focus:ring-0"
              disabled={loading}
              required
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.max(51, target.scrollHeight) + 'px';
              }}
              style={{ height: '51px', padding: '0.75rem 1rem', border: 'none', outline: 'none', boxShadow: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
            />
          </div>
          
          <div className="absolute top-4 right-2" style={{ marginRight: '0.3em' }}>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="bg-white text-black inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 h-8 w-8 rounded-full p-0"
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
      </div>
    </div>
  );
}