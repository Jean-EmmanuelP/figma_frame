'use client';

import { useState, useEffect } from 'react';
import { fetchProfile, UnauthenticatedError } from './api';

const BASE = process.env.NEXT_PUBLIC_API_URL!;

// Cache global pour éviter les rechargements inutiles
let authCache: {
  user: any | null;
  authenticated: boolean | 'loading';
  lastCheck: number;
} = {
  user: null,
  authenticated: 'loading',
  lastCheck: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function checkAuth(): Promise<boolean> {
  try {
    console.log('🔍 [AUTH] Checking authentication status...');
    const profile = await fetchProfile();
    console.log('✅ [AUTH] User is authenticated:', profile);
    return true;
  } catch (error) {
    console.log('❌ [AUTH] Authentication check failed:', error);
    if (error instanceof UnauthenticatedError) {
      console.log('🚫 [AUTH] User not authenticated (401)');
      return false;
    }
    console.log('⚠️ [AUTH] Other error occurred:', error);
    // Si c'est une autre erreur (réseau, etc.), on considère qu'on ne sait pas
    return false;
  }
}

export function login() {
  console.log('🚀 [AUTH] Starting login process...');
  console.log('🔗 [AUTH] Redirecting to:', `${BASE}/auth/figma`);
  window.location.href = `${BASE}/auth/figma`;
}

export async function logout() {
  console.log('🚪 [AUTH] Initiating logout...');
  
  try {
    console.log('📡 [AUTH] Calling logout endpoint...');
    const response = await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      credentials: "include", // important pour les cookies de session
    });
    
    console.log('📊 [AUTH] Logout response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ [AUTH] Logout successful:', data);
    } else {
      console.warn('⚠️ [AUTH] Logout response not OK, but proceeding...');
    }
  } catch (error) {
    console.error('❌ [AUTH] Logout request failed:', error);
    // Continue with cleanup even if request fails
  }
  
  // Nettoyage local et invalidation du cache
  console.log('🧹 [AUTH] Cleaning up cache and redirecting to home...');
  authCache = {
    user: null,
    authenticated: false,
    lastCheck: 0 // Force une nouvelle vérification au prochain chargement
  };
  
  window.location.href = "/";
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | 'loading'>(authCache.authenticated);
  const [user, setUser] = useState<any>(authCache.user);

  useEffect(() => {
    console.log('🎯 [AUTH] useAuth hook initializing...');
    
    const now = Date.now();
    const isCacheValid = (now - authCache.lastCheck) < CACHE_DURATION;
    
    // Si le cache est valide et qu'on a déjà des données, on les utilise
    if (isCacheValid && authCache.lastCheck > 0) {
      console.log('📦 [AUTH] Using cached auth data');
      setAuthenticated(authCache.authenticated);
      setUser(authCache.user);
      return;
    }
    
    console.log('🔄 [AUTH] Cache expired or first load, fetching fresh data...');
    
    const loadAuthAndProfile = async () => {
      try {
        const profile = await fetchProfile();
        console.log('✅ [AUTH] User profile loaded:', profile);
        
        // Mettre à jour le cache global
        authCache = {
          user: profile,
          authenticated: true,
          lastCheck: Date.now()
        };
        
        setUser(profile);
        setAuthenticated(true);
      } catch (error) {
        console.log('❌ [AUTH] Authentication failed:', error);
        
        // Mettre à jour le cache global
        authCache = {
          user: null,
          authenticated: false,
          lastCheck: Date.now()
        };
        
        setUser(null);
        setAuthenticated(false);
      }
    };

    loadAuthAndProfile();
  }, []);

  const refreshAuth = async () => {
    console.log('🔄 [AUTH] Refreshing authentication...');
    setAuthenticated('loading');
    
    try {
      const profile = await fetchProfile();
      console.log('🔄 [AUTH] Refresh successful:', profile);
      
      // Mettre à jour le cache global
      authCache = {
        user: profile,
        authenticated: true,
        lastCheck: Date.now()
      };
      
      setUser(profile);
      setAuthenticated(true);
    } catch (error) {
      console.log('🔄 [AUTH] Refresh failed:', error);
      
      // Mettre à jour le cache global
      authCache = {
        user: null,
        authenticated: false,
        lastCheck: Date.now()
      };
      
      setUser(null);
      setAuthenticated(false);
    }
  };

  return {
    authenticated,
    user,
    login,
    logout,
    refreshAuth
  };
}