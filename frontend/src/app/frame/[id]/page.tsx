"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchFrameNode,
  fetchFrameCode,
  selectFrame,
  clearFrameCode,
  fetchFrames,
} from "@/lib/redux/figmaSlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";

export default function FrameDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const id = decodeURIComponent(params.id as string);
  const urlParam = searchParams.get("url");

  const {
    currentUrl,
    selectedFrame,
    loading: { frameNode: loadingNode, frameCode: loadingCode },
    errors: { frameNode: errorNode, frameCode: errorCode },
  } = useAppSelector((state) => state.figma);

  // Utilise l'URL des paramètres ou celle de Redux
  const effectiveUrl = urlParam || currentUrl;

  useEffect(() => {
    if (effectiveUrl && id) {
      // Si on a une URL en paramètre mais pas dans Redux, on charge d'abord les frames
      if (urlParam && urlParam !== currentUrl) {
        dispatch(fetchFrames(urlParam));
      }

      if (!selectedFrame || selectedFrame.id !== id) {
        dispatch(selectFrame({ id }));
      }
      if (effectiveUrl && (!selectedFrame?.data || selectedFrame.id !== id)) {
        dispatch(fetchFrameNode({ url: effectiveUrl, id }));
      }

      // Générer automatiquement le code HTML dès qu'on a l'URL et l'ID
      if (
        effectiveUrl &&
        id &&
        (!selectedFrame?.code || selectedFrame.id !== id)
      ) {
        dispatch(clearFrameCode());
        dispatch(fetchFrameCode({ url: effectiveUrl, id }));
      }
    }
  }, [effectiveUrl, currentUrl, urlParam, id, selectedFrame, dispatch]);

  if (!effectiveUrl) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <ErrorMessage
              title="Aucune URL Figma"
              message="Veuillez d'abord sélectionner un fichier Figma depuis l'accueil"
              variant="centered"
              className="mb-8"
            />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#A3A3A3] hover:text-[#EAEAEA] transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Retour aux frames
              </Link>
            </div>

            {selectedFrame?.data?.name && (
              <h1 className="text-3xl lg:text-4xl font-light text-[#EAEAEA] mb-2">
                {selectedFrame.data.name}
              </h1>
            )}

            {selectedFrame?.data?.absoluteBoundingBox && (
              <p className="text-[#A3A3A3] font-mono text-sm">
                {Math.round(selectedFrame.data.absoluteBoundingBox.width)} ×{" "}
                {Math.round(selectedFrame.data.absoluteBoundingBox.height)} px
              </p>
            )}
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
            {/* Left Side - Frame Preview */}
            <div className="space-y-6">
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8">
                <h2 className="text-xl font-medium text-[#EAEAEA] mb-6">
                  Aperçu de la frame
                </h2>

                <div className="aspect-[4/3] bg-[#0A0A0A] rounded-xl overflow-hidden border border-[#1F1F1F] relative">
                  {loadingNode ? (
                    <div className="w-full h-full flex items-center justify-center">
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
                  ) : errorNode ? (
                    <div className="w-full h-full flex items-center justify-center text-[#666666]">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="text-sm">Erreur de chargement</div>
                      </div>
                    </div>
                  ) : selectedFrame?.data?.previewUrl ? (
                    <Image
                      src={selectedFrame.data.previewUrl}
                      alt={`Aperçu de ${selectedFrame.data.name || "la frame"}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#666666]">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="text-sm">
                          Pas d&apos;aperçu disponible
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Code & Preview */}
            <div className="space-y-6">
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8">
                <h2 className="text-xl font-medium text-[#EAEAEA] mb-6">
                  Code HTML
                </h2>

                <div className="space-y-6">
                  {loadingCode ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        </div>
                        <p className="text-[#A3A3A3]">
                          Génération du code en cours...
                        </p>
                      </div>
                    </div>
                  ) : selectedFrame?.code ? (
                    <Button
                      asChild
                      className="w-full bg-white hover:bg-gray-100 font-medium h-14 text-lg"
                      size="lg"
                    >
                      <Link
                        href={`/frame/${encodeURIComponent(id)}/view${
                          effectiveUrl
                            ? `?url=${encodeURIComponent(effectiveUrl)}`
                            : ""
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="black"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="text-black">
                          Prévisualiser dans le viewer
                        </span>
                      </Link>
                    </Button>
                  ) : errorCode ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-red-300 font-medium mb-1">
                        Erreur de génération
                      </p>
                      <p className="text-red-200/80 text-sm">{errorCode}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-[#666666]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </div>
                      <p className="text-[#A3A3A3]">
                        En attente de génération...
                      </p>
                    </div>
                  )}

                  {selectedFrame?.code && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-[#EAEAEA]">
                          Code généré
                        </h3>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              selectedFrame.code || ""
                            )
                          }
                          className="px-3 py-2 text-[#A3A3A3] hover:text-[#EAEAEA] border border-[#333333] hover:border-[#666666] rounded-lg transition-all duration-200 text-sm flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copier le code
                        </button>
                      </div>

                      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-4 max-h-96 overflow-auto">
                        <pre className="text-sm text-[#EAEAEA] whitespace-pre-wrap break-words font-mono">
                          <code>{selectedFrame.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
