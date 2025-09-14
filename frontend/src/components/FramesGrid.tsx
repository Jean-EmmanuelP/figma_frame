import { FrameSummary } from '@/lib/types';
import FrameCard from './FrameCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FramesGridProps {
  frames: FrameSummary[];
}

export default function FramesGrid({ frames }: FramesGridProps) {
  if (frames.length === 0) {
    return (
      <div className="text-center py-16 text-[#666666] max-w-[80vw] sm:max-w-none mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1F1F1F] flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-light max-w-[80vw] sm:max-w-none mx-auto">Aucune frame trouvée</p>
        <p className="text-sm text-[#A3A3A3] mt-2 max-w-[80vw] sm:max-w-none mx-auto">Vérifiez l&apos;URL de votre fichier Figma</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[80vw] sm:max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-[80vw] sm:max-w-none mx-auto"
      >
        <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
          {frames.map((frame, index) => (
            <CarouselItem 
              key={frame.id} 
              className="pl-2 sm:pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <FrameCard frame={frame} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-[#1F1F1F] border-[#333333] text-white hover:bg-[#2F2F2F] hidden sm:flex -left-2 sm:-left-4" />
        <CarouselNext className="bg-[#1F1F1F] border-[#333333] text-white hover:bg-[#2F2F2F] hidden sm:flex -right-2 sm:-right-4" />
      </Carousel>
    </div>
  );
}