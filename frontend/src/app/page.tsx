"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchFrames, clearErrors } from "@/lib/redux/figmaSlice";
import UrlForm from "@/components/UrlForm";
import HeroSection from "@/components/HeroSection";
import ResultsSection from "@/components/ResultsSection";

export default function Home() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const dispatch = useAppDispatch();

  const {
    currentUrl,
    framesData,
    loading: { frames: loading },
    errors: { frames: error },
  } = useAppSelector((state) => state.figma);

  useEffect(() => {
    if (urlParam && urlParam !== currentUrl) {
      dispatch(fetchFrames(urlParam));
    }
  }, [urlParam, currentUrl, dispatch]);

  const handleFetchFrames = (figmaUrl: string) => {
    dispatch(clearErrors());
    dispatch(fetchFrames(figmaUrl));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      {!loading && !framesData && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-5xl mx-auto px-8">
            <div className="flex flex-col gap-10">
              <HeroSection
                error={error}
              />
              <div className="flex justify-center w-[50vw]">
                <div className="w-full">
                  <UrlForm
                    title="Entrez votre lien figma"
                    initialUrl={currentUrl || ""}
                    onSubmit={handleFetchFrames}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(loading || framesData) && (
        <div className="w-full max-w-[70vw] mx-auto px-8 flex flex-col gap-10">
          <div className="flex flex-col gap-10 fixed top-0 left-1/2 -translate-x-1/2 w-full">
          <div className="text-center">
            <HeroSection
              error={error}
            />
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <UrlForm
                title="Entre un nouveau lien figma"
                initialUrl={currentUrl || ""}
                onSubmit={handleFetchFrames}
                loading={loading}
              />
            </div>
          </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          {framesData && (
            <ResultsSection
              frames={framesData.frames}
              fileKey={framesData.fileKey}
            />
          )}
        </div>
      )}
    </div>
  );
}
