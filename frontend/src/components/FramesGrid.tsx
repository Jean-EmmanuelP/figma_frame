import { FrameSummary } from '@/lib/types';
import FrameCard from './FrameCard';

interface FramesGridProps {
  frames: FrameSummary[];
}

export default function FramesGrid({ frames }: FramesGridProps) {
  if (frames.length === 0) {
    return (
      <div className="text-center py-16 text-[#666666]">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1F1F1F] flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-light">Aucune frame trouvée</p>
        <p className="text-sm text-[#A3A3A3] mt-2">Vérifiez l'URL de votre fichier Figma</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-12 w-full mx-auto">
      {frames.map((frame, index) => (
        <div key={frame.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <FrameCard frame={frame} />
        </div>
      ))}
    </div>
  );
}