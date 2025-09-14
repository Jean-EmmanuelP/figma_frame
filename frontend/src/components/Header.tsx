'use client';

import { useAuth } from '@/lib/auth';

export default function Header() {
  const { authenticated, login, logout } = useAuth();

  return (
    <header className="h-14 bg-[#0A0A0A] border-b border-[#1F1F1F] flex items-center justify-between px-6 sm:px-8 md:px-10 lg:px-12">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <svg width="28" height="24" className="sm:w-8 sm:h-7" viewBox="0 0 700 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M247.5 402.5C247.5 374.195 270.445 351.25 298.75 351.25H350V402.5C350 430.805 327.055 453.75 298.75 453.75C270.445 453.75 247.5 430.805 247.5 402.5Z" fill="#0ACF83"/>
          <path d="M350 300C350 271.696 372.945 248.75 401.25 248.75C429.554 248.75 452.5 271.695 452.5 300C452.5 328.305 429.554 351.25 401.25 351.25C372.945 351.25 350 328.304 350 300Z" fill="#1ABCFE"/>
          <path d="M247.5 300C247.5 328.305 270.445 351.25 298.75 351.25H350V248.75H298.75C270.445 248.75 247.5 271.695 247.5 300Z" fill="#A259FF"/>
          <path d="M350 146.25V248.75H401.25C429.555 248.75 452.5 225.805 452.5 197.5C452.5 169.195 429.555 146.25 401.25 146.25H350Z" fill="#FF7262"/>
          <path d="M247.5 197.5C247.5 225.805 270.445 248.75 298.75 248.75H350V146.25H298.75C270.445 146.25 247.5 169.195 247.5 197.5Z" fill="#F24E1E"/>
        </svg>
        <h1 className="text-lg sm:text-xl font-light text-[#EAEAEA] tracking-tight">Figma Frame</h1>
      </div>

      {/* Auth Status */}
      <div className="flex items-center gap-2 sm:gap-4">
        {authenticated === 'loading' ? (
          <div className="flex items-center gap-2 text-[#A3A3A3]">
            <div className="w-4 h-4 border-2 border-[#A3A3A3]/20 border-t-[#A3A3A3] rounded-full animate-spin"></div>
            <span className="text-sm hidden sm:inline">Vérification...</span>
          </div>
        ) : authenticated ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-[#22C55E]">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
              <span className="text-xs sm:text-sm hidden sm:inline">Connecté à Figma</span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-[#A3A3A3] hover:text-white border border-[#1F1F1F] hover:border-[#333333] rounded-lg transition-all duration-200"
            >
              <span className="hidden sm:inline">Déconnexion</span>
              <span className="sm:hidden">⏻</span>
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-all duration-200 text-xs sm:text-sm"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 700 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M247.5 402.5C247.5 374.195 270.445 351.25 298.75 351.25H350V402.5C350 430.805 327.055 453.75 298.75 453.75C270.445 453.75 247.5 430.805 247.5 402.5Z" fill="currentColor"/>
              <path d="M350 300C350 271.696 372.945 248.75 401.25 248.75C429.554 248.75 452.5 271.695 452.5 300C452.5 328.305 429.554 351.25 401.25 351.25C372.945 351.25 350 328.304 350 300Z" fill="currentColor"/>
              <path d="M247.5 300C247.5 328.305 270.445 351.25 298.75 351.25H350V248.75H298.75C270.445 248.75 247.5 271.695 247.5 300Z" fill="currentColor"/>
              <path d="M350 146.25V248.75H401.25C429.555 248.75 452.5 225.805 452.5 197.5C452.5 169.195 429.555 146.25 401.25 146.25H350Z" fill="currentColor"/>
              <path d="M247.5 197.5C247.5 225.805 270.445 248.75 298.75 248.75H350V146.25H298.75C270.445 146.25 247.5 169.195 247.5 197.5Z" fill="currentColor"/>
            </svg>
            <span className="hidden sm:inline">Se connecter avec Figma</span>
            <span className="sm:hidden">Connexion</span>
          </button>
        )}
      </div>
    </header>
  );
}