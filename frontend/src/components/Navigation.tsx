import Link from 'next/link';

interface NavigationProps {
  href: string;
  label: string;
  className?: string;
}

export default function Navigation({ href, label, className = '' }: NavigationProps) {
  return (
    <nav className={`mb-12 ${className}`}>
      <Link 
        href={href} 
        className="inline-flex items-center gap-3 text-[#A3A3A3] hover:text-white transition-smooth font-light text-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        {label}
      </Link>
    </nav>
  );
}