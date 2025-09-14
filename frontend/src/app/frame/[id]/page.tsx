'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchFrameNode, fetchFrameCode, selectFrame, clearFrameCode } from '@/lib/redux/figmaSlice';
import Navigation from '@/components/Navigation';
import ActionsSection from '@/components/ActionsSection';
import ErrorMessage from '@/components/ErrorMessage';

export default function FrameDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const id = decodeURIComponent(params.id as string);
  const url = searchParams.get('url');
  
  const { 
    selectedFrame,
    loading: { frameCode: loadingCode },
    errors: { frameCode: errorCode }
  } = useAppSelector((state) => state.figma);

  useEffect(() => {
    if (url && id) {
      if (!selectedFrame || selectedFrame.id !== id) {
        dispatch(selectFrame({ id }));
      }
      if (url && (!selectedFrame?.data || selectedFrame.id !== id)) {
        dispatch(fetchFrameNode({ url, id }));
      }
    }
  }, [url, id, selectedFrame, dispatch]);

  const handleGenerateHtml = () => {
    if (url) {
      dispatch(clearFrameCode());
      dispatch(fetchFrameCode({ url, id }));
    }
  };

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ErrorMessage 
            title="URL manquante" 
            message="Aucune URL Figma n'a été fournie" 
            variant="centered" 
            className="mb-8"
          />
          <Link href="/" className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] transition-smooth">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-12 pt-16">
          <div className="max-w-7xl mx-auto px-12">
            <Navigation 
              href={`/?url=${encodeURIComponent(url)}`}
              label="Retour aux frames"
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-12">
{/* 
        <div className="mb-24">
          <FrameHeader 
            name={selectedFrame?.data?.name}
            id={id}
            dimensions={selectedFrame?.data?.absoluteBoundingBox}
          />
        </div> */}

          <div className="space-y-32">
            <div className="w-full">
              {/* <PreviewSection 
                loading={loadingNode}
                error={errorNode}
                frameData={selectedFrame?.data}
              /> */}
            </div>

            <div className="w-full">
              <ActionsSection 
                onGenerateHtml={handleGenerateHtml}
                loading={loadingCode}
                error={errorCode}
                code={selectedFrame?.code}
                frameId={id}
                frameData={selectedFrame?.data}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}