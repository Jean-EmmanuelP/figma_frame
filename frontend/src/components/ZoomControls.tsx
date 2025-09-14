type Props = {
  zoom: number; 
  setZoom: (z: number) => void;
  onFit: () => void; 
  onFitWidth: () => void;
};

export default function ZoomControls({ zoom, setZoom, onFit, onFitWidth }: Props) {
  const presets = [0.25, 0.5, 0.75, 1, 1.5, 2];
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <button 
        onClick={onFit} 
        className="px-3 py-1.5 border border-[#333333] hover:border-[#666666] rounded-lg bg-[#111111] text-[#EAEAEA] hover:bg-[#1F1F1F] transition-all duration-200"
      >
        Ajuster
      </button>
      <button 
        onClick={onFitWidth} 
        className="px-3 py-1.5 border border-[#333333] hover:border-[#666666] rounded-lg bg-[#111111] text-[#EAEAEA] hover:bg-[#1F1F1F] transition-all duration-200"
      >
        Largeur
      </button>
      
      <div className="flex gap-1">
        {presets.map(p => (
          <button 
            key={p} 
            onClick={() => setZoom(p)} 
            className={`px-2 py-1.5 border rounded-lg transition-all duration-200 ${
              Math.abs(zoom - p) < 0.01 
                ? 'bg-[#333333] border-[#666666] text-white' 
                : 'border-[#333333] hover:border-[#666666] bg-[#111111] text-[#EAEAEA] hover:bg-[#1F1F1F]'
            }`}
          >
            {Math.round(p * 100)}%
          </button>
        ))}
      </div>
    </div>
  );
}