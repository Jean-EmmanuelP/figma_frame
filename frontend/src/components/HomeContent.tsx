"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchFrames, clearErrors } from "@/lib/redux/figmaSlice";
import { useAuth } from "@/lib/auth";
import UrlForm from "@/components/UrlForm";
import HeroSection from "@/components/HeroSection";
import ResultsSection from "@/components/ResultsSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import { AppSidebar } from "@/components/AppSidebar";
// import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

export default function HomeContent() {
  const dispatch = useAppDispatch();
  const { authenticated, login } = useAuth();

  const [currentInputUrl, setCurrentInputUrl] = useState("");

  const {
    framesData,
    loading: { frames: loading },
    errors: { frames: error },
  } = useAppSelector((state) => state.figma);

  const handleFetchFrames = (figmaUrl: string) => {
    dispatch(clearErrors());
    dispatch(fetchFrames(figmaUrl));
    setCurrentInputUrl(figmaUrl);
  };

  // const handlePickFile = ({ fileKey, name }: { fileKey: string; name?: string }) => {
  //   const figmaUrl = `https://www.figma.com/design/${fileKey}/${name ? encodeURIComponent(name) : 'Selected'}`;
  //   setCurrentInputUrl(figmaUrl);
  //   handleFetchFrames(figmaUrl);
  // };


  // Loading state
  if (authenticated === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not authenticated state - simple page
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20 px-4 sm:px-6">
          <div className="text-center max-w-[80vw] sm:max-w-none mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#EAEAEA] tracking-tight mb-12 max-w-[80vw] sm:max-w-none mx-auto">
              Transformez vos designs Figma en code
            </h1>
            
            <button
              onClick={login}
              className="px-8 py-4 bg-[#666666] hover:bg-[#777777] text-white font-medium rounded-lg transition-all duration-200 text-lg max-w-[80vw] sm:max-w-none"
            >
              Se connecter avec Figma
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // TODO: Sidebar hidden - waiting for Figma access confirmation
  // Once user approves the OAuth request in Figma, uncomment the sidebar below

  /*
  return (
    <SidebarProvider>
      <AppSidebar authenticated={authenticated} onPickFile={handlePickFile} />
      <SidebarInset>
        <Header />
        
        <div className="flex items-center p-4 border-b border-[#1F1F1F]">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-xl font-semibold text-[#EAEAEA]">Figma Frame Extractor</h1>
        </div>
      
        <div className="border-b border-[#1F1F1F] p-6">
          <div className="max-w-4xl mx-auto">
            <UrlForm
              title="Entrez une URL Figma"
              initialUrl={currentInputUrl}
              onSubmit={handleFetchFrames}
              loading={loading}
            />
            {error && (
              <div className="mt-6">
                <HeroSection error={error} />
              </div>
            )}
          </div>
        </div>

        <div className="min-h-[60vh]">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}

          {framesData && !loading && (
            <div className="p-6">
              <div className="max-w-6xl mx-auto">
                <ResultsSection
                  frames={framesData.frames}
                  fileKey={framesData.fileKey}
                />
              </div>
            </div>
          )}

          {!loading && !framesData && authenticated && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center text-[#666666]">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#1F1F1F] flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-light mb-2 text-[#EAEAEA]">Sélectionnez un fichier</p>
                <p className="text-sm text-[#A3A3A3]">Choisissez un fichier dans la sidebar ou entrez une URL Figma</p>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
  */

  // Authenticated state - simple layout without sidebar
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EAEAEA] flex flex-col">
      <Navbar />
      
      {/* URL Form Section */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div className="max-w-[80vw] sm:max-w-4xl mx-auto">
          <UrlForm
            title="Entrez une URL Figma"
            initialUrl={currentInputUrl}
            onSubmit={handleFetchFrames}
            loading={loading}
          />
          {error && (
            <div className="mt-6 sm:mt-8">
              <HeroSection error={error} />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="min-h-[60vh]">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex space-x-1 max-w-[80vw] sm:max-w-none mx-auto">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}

        {framesData && !loading && (
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <div className="max-w-[80vw] sm:max-w-7xl mx-auto">
              <ResultsSection
                frames={framesData.frames}
                fileKey={framesData.fileKey}
              />
            </div>
          </div>
        )}

        {!loading && !framesData && authenticated && (
          <div className="flex items-center justify-center py-20 px-6 sm:px-8">
            <div className="text-center text-[#666666] max-w-[80vw] sm:max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-[#1F1F1F] flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg sm:text-xl font-light mb-4 text-[#EAEAEA] max-w-[80vw] sm:max-w-none mx-auto">Allez sur votre fichier Figma et copiez l&apos;URL</p>
              <p className="text-sm sm:text-base text-[#A3A3A3] break-all max-w-[80vw] sm:max-w-none mx-auto">EX: https://www.figma.com/design/eWTSCAYKKLl0R1oJR1cW9H/Untitled?node-id=0-1&p=f&t=p6cnYdMxFghBujiR-0</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}