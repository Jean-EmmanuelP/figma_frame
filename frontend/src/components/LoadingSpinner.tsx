interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-[#3B82F6]/20 border-t-[#3B82F6]',
    white: 'border-white/20 border-t-white'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`text-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin mx-auto ${text ? 'mb-6' : ''}`}></div>
      {text && (
        <p className={`text-[#A3A3A3] font-light ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}