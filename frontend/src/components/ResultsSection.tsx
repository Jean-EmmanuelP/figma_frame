import FramesGrid from './FramesGrid';
import { FrameSummary } from '@/lib/types';

interface ResultsSectionProps {
  frames: FrameSummary[];
  fileKey: string;
  className?: string;
}

export default function ResultsSection({ 
  frames, 
  className = '' 
}: ResultsSectionProps) {
  return (
    <div className={`w-full flex flex-col gap-[4vh] mx-auto px-8 pb-32 ${className}`}>
      <div className="text-center slide-up">
        <h2 className="text-4xl font-light text-[#EAEAEA] mb-6">
          {frames.length} frame{frames.length > 1 ? 's' : ''} trouvée{frames.length > 1 ? 's' : ''}
        </h2>
        {/* <p className="text-[#A3A3A3] text-xl">
          {fileKey} • {new Date(lastModified).toLocaleDateString('fr-FR')}
        </p> */}
      </div>
      <FramesGrid frames={frames} />
    </div>
  );
}