"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";
import { fetchFrameHtml } from "@/lib/api";
import { extractSizeFromCode } from "@/lib/parse";
import FrameViewer from "@/components/FrameViewer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FrameViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = decodeURIComponent(params.id as string);
  const urlParam = searchParams.get('url');
  
  const { currentUrl, selectedFrame } = useAppSelector((state) => state.figma);
  const url = urlParam || currentUrl;

  const [code, setCode] = useState<string>("");
  const [size, setSize] = useState<{ width: number; height: number }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !id) {
      setError("URL Figma ou ID de frame manquant");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchFrameHtml(url, id, { 
          fragment: true, 
          includeFonts: true, 
          scale: 2 
        });
        
        setCode(result.code);
        
        // Utilise les meta du backend ou extrait depuis le code
        const meta = result.meta ?? extractSizeFromCode(result.code);
        if (meta) {
          setSize(meta);
        } else {
          // Fallback avec dimensions par défaut
          setSize({ width: 375, height: 667 });
        }
      } catch (err) {
        console.error('❌ [VIEWER] Failed to fetch frame HTML:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    })();
  }, [url, id]);

  if (!url) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#1F1F1F] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-[#EAEAEA] mb-2">URL Figma manquante</h1>
            <p className="text-[#A3A3A3] mb-6">Veuillez d'abord sélectionner un fichier Figma depuis l'accueil</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
            <p className="text-[#EAEAEA] text-lg">Chargement du viewer...</p>
            <p className="text-[#A3A3A3] text-sm mt-2">Génération de l&apos;aperçu interactif</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-[#EAEAEA] mb-2">Erreur de chargement</h1>
            <p className="text-[#A3A3A3] mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Retour à l&apos;accueil
              </Link>
              <Link 
                href={`/frame/${encodeURIComponent(id)}${url ? `?url=${encodeURIComponent(url)}` : ''}`}
                className="inline-flex items-center gap-2 text-[#A3A3A3] hover:text-[#EAEAEA] transition-all duration-200"
              >
                Retour aux détails
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!code || !size) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#1F1F1F] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[#EAEAEA] text-lg">Aucun contenu à afficher</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="border-b border-[#1F1F1F] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/frame/${encodeURIComponent(id)}${url ? `?url=${encodeURIComponent(url)}` : ''}`}
              className="inline-flex items-center gap-2 text-[#A3A3A3] hover:text-[#EAEAEA] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux détails
            </Link>
            
            {selectedFrame?.data?.name && (
              <div className="hidden sm:block">
                <h1 className="text-lg font-medium text-[#EAEAEA]">
                  Viewer: {selectedFrame.data.name}
                </h1>
              </div>
            )}
          </div>
          
          <div className="text-sm text-[#A3A3A3]">
            Mode interactif
          </div>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto h-full">
          <FrameViewer 
            fragmentHtml={code} 
            baseWidth={size.width} 
            baseHeight={size.height}
            className="h-full"
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}