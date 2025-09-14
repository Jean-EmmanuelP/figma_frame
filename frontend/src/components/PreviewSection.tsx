import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import JsonViewer from './JsonViewer';

interface PreviewSectionProps {
  loading?: boolean;
  error?: string | null;
  frameData?: {
    name?: string;
    absoluteBoundingBox?: {
      width: number;
      height: number;
    };
    fills?: Array<{
      type: string;
      color?: {
        r: number;
        g: number;
        b: number;
        a?: number;
      };
    }>;
  };
  className?: string;
}

export default function PreviewSection({ 
  loading = false, 
  error = null, 
  frameData,
  className = '' 
}: PreviewSectionProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <h2 className="text-2xl font-light text-[#EAEAEA] mb-8">Aperçu</h2>
      
      {loading ? (
        <div className="aspect-video bg-[#111111] border border-[#1F1F1F] rounded-2xl flex items-center justify-center">
          <LoadingSpinner size="lg" text="Chargement..." />
        </div>
      ) : error ? (
        <div className="aspect-video bg-[#111111] border border-red-900/50 rounded-2xl flex items-center justify-center">
          <ErrorMessage 
            title="Erreur de chargement" 
            message={error} 
            variant="centered" 
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Frame Preview Image */}
          <div className="aspect-video bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden">
            {frameData?.absoluteBoundingBox ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div 
                  className="bg-white rounded-lg shadow-2xl max-w-full max-h-full"
                  style={{
                    width: Math.min(frameData.absoluteBoundingBox.width, 600),
                    height: Math.min(frameData.absoluteBoundingBox.height, 400),
                    aspectRatio: `${frameData.absoluteBoundingBox.width} / ${frameData.absoluteBoundingBox.height}`
                  }}
                >
                  {frameData.fills && frameData.fills.length > 0 && frameData.fills[0].type === 'SOLID' && (
                    <div 
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: frameData.fills[0].color ? 
                          `rgba(${Math.round(frameData.fills[0].color.r * 255)}, ${Math.round(frameData.fills[0].color.g * 255)}, ${Math.round(frameData.fills[0].color.b * 255)}, ${frameData.fills[0].color.a || 1})` 
                          : '#FFFFFF'
                      }}
                    >
                      <div className="text-center text-gray-600">
                        <div className="text-2xl font-light mb-2">{frameData.name}</div>
                        <div className="text-sm opacity-75">
                          {frameData.absoluteBoundingBox.width} × {frameData.absoluteBoundingBox.height}
                        </div>
                      </div>
                    </div>
                  )}
                  {(!frameData.fills || frameData.fills.length === 0) && (
                    <div className="w-full h-full rounded-lg flex items-center justify-center bg-gray-100">
                      <div className="text-center text-gray-600">
                        <div className="text-2xl font-light mb-2">{frameData.name}</div>
                        <div className="text-sm opacity-75">
                          {frameData.absoluteBoundingBox.width} × {frameData.absoluteBoundingBox.height}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-[#666666]">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#1F1F1F] flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-light mb-3 text-lg">Aperçu en cours de chargement...</p>
                  <p className="text-[#A3A3A3]">La prévisualisation apparaîtra ici</p>
                </div>
              </div>
            )}
          </div>
          
          {frameData && (
            <JsonViewer data={frameData} />
          )}
        </div>
      )}
    </div>
  );
}