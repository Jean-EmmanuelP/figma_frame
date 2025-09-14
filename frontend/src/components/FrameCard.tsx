'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FrameSummary } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectFrame } from '@/lib/redux/figmaSlice';

interface FrameCardProps {
  frame: FrameSummary;
}

export default function FrameCard({ frame }: FrameCardProps) {
  const dispatch = useAppDispatch();
  const { currentUrl } = useAppSelector((state) => state.figma);
  const href = `/frame/${encodeURIComponent(frame.id)}?url=${encodeURIComponent(currentUrl || '')}`;
  
  const handleClick = () => {
    dispatch(selectFrame({ id: frame.id, data: { ...frame, previewUrl: frame.previewUrl } }));
  };
  
  return (
    <Link
      href={href}
      onClick={handleClick}
      className="block group transition-smooth hover:scale-[1.02]"
      aria-label={`Voir les détails de ${frame.name}`}
    >
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8 
                      hover:border-white hover:bg-[#1A1A1A] 
                      transition-smooth cursor-pointer">
        
        {/* Preview */}
        <div className="aspect-video bg-[#0A0A0A] rounded-xl mb-6 overflow-hidden border border-[#1F1F1F] relative">
          {frame.previewUrl ? (
            <Image
              src={frame.previewUrl}
              alt={`Aperçu de ${frame.name}`}
              fill
              className="object-cover transition-smooth group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHBwtH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0s8UR0XS4Tv5ZmREP2v3v+nP/9k="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#666666]">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[#1F1F1F] flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm font-light">Pas d&apos;aperçu</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="space-y-3">
          <h3 className="font-medium text-[#EAEAEA] line-clamp-2 leading-tight text-lg">
            {frame.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-base text-[#A3A3A3] font-light">{frame.page}</p>
            {frame.width && frame.height && (
              <p className="text-sm text-[#666666] font-mono">
                {frame.width} × {frame.height}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}