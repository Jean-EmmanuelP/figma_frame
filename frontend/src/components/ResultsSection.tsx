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
    <div className={`w-full flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-16 mx-auto pb-16 sm:pb-24 md:pb-32 max-w-[80vw] sm:max-w-none ${className}`}>
      <div className="text-center slide-up px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#EAEAEA] mb-4 sm:mb-6 max-w-[80vw] sm:max-w-none mx-auto">
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