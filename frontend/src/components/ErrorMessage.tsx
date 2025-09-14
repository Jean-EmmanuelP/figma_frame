interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'inline' | 'card' | 'centered';
  className?: string;
}

export default function ErrorMessage({ 
  title = 'Erreur', 
  message, 
  variant = 'card',
  className = '' 
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="text-red-400 text-lg">⚠</div>
        <div>
          <h3 className="text-red-400 font-medium mb-1">{title}</h3>
          <p className="text-[#A3A3A3]">{message}</p>
        </div>
      </div>
    );
  }

  if (variant === 'centered') {
    return (
      <div className={`text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-400 font-medium mb-3 text-lg">{title}</p>
        <p className="text-[#A3A3A3]">{message}</p>
      </div>
    );
  }

  // variant === 'card'
  return (
    <div className={`p-8 bg-[#1A1A1A] border border-red-900/50 rounded-2xl fade-in ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-red-400 font-medium mb-2 text-lg">{title}</h3>
          <p className="text-[#A3A3A3]">{message}</p>
        </div>
      </div>
    </div>
  );
}