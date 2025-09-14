'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { authenticated, user, login, logout } = useAuth();

  return (
    <nav className="bg-[#0A0A0A] border-b border-[#1F1F1F] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4] rounded-lg flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" 
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-[#EAEAEA]">
            Figma Frame
          </span>
        </Link>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
                {user?.img_url ? (
                  <>
                    <img
                      src={user.img_url}
                      alt={user.handle || user.email || 'User'}
                      className="w-8 h-8 rounded-full border border-[#333333]"
                    />
                    <span className="text-sm text-[#EAEAEA] hidden sm:block">
                      {user.handle || user.email}
                    </span>
                    <svg className="w-4 h-4 text-[#A3A3A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-[#22C55E]">
                    <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                    <span className="text-sm">Connecté à Figma</span>
                    <svg className="w-4 h-4 text-[#A3A3A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#111111] border-[#333333]">
                <DropdownMenuLabel className="text-[#EAEAEA]">
                  {user?.handle || user?.email || 'Mon compte'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#333333]" />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-[#A3A3A3] hover:text-[#EAEAEA] hover:bg-[#1F1F1F] focus:bg-[#1F1F1F] focus:text-[#EAEAEA] cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={login}
              className="px-4 py-2 bg-[#666666] hover:bg-[#777777] text-white rounded-lg transition-all duration-200 text-sm"
            >
              Se connecter avec Figma
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}