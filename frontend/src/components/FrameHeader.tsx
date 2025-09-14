interface FrameHeaderProps {
  name?: string;
  id: string;
  dimensions?: {
    width: number;
    height: number;
  };
  className?: string;
}

export default function FrameHeader({ 
  name, 
  id, 
  dimensions, 
  className = '' 
}: FrameHeaderProps) {
  return (
    <header className={`mb-20 ${className}`}>
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-12">
        <h1 className="text-4xl font-light text-[#EAEAEA] mb-8 tracking-tight">
          {name || `Frame ${id}`}
        </h1>
        <div className="flex flex-wrap gap-8 text-base">
          <div className="flex items-center gap-3">
            <span className="text-[#666666] font-light">ID</span>
            <code className="bg-[#0A0A0A] border border-[#1F1F1F] px-4 py-2 rounded-lg text-[#A3A3A3] font-mono">
              {id}
            </code>
          </div>
          {dimensions && (
            <div className="flex items-center gap-3">
              <span className="text-[#666666] font-light">Dimensions</span>
              <span className="text-[#A3A3A3] font-mono font-medium">
                {dimensions.width} × {dimensions.height}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}