import ErrorMessage from './ErrorMessage';

interface HeroSectionProps {
  error?: string | null;
  className?: string;
}

export default function HeroSection({ 
  error = null,
  className = '' 
}: HeroSectionProps) {
  return (
    <div className={`flex flex-col gap-10 items-center justify-center text-center px-4 sm:px-6 md:px-8 max-w-[80vw] sm:max-w-none mx-auto ${className}`}>
      {/* Error State */}
      {error && (
        <div className="p-6 sm:p-8 bg-[#1A1A1A] border border-red-900/50 rounded-xl max-w-[80vw] sm:max-w-lg w-full fade-in">
          <ErrorMessage 
            title="Erreur" 
            message={error} 
            variant="inline" 
          />
        </div>
      )}
    </div>
  );
}