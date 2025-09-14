import Image from 'next/image';
import ErrorMessage from './ErrorMessage';
import CodeBlock from './CodeBlock';

interface ActionsSectionProps {
  onGenerateHtml: () => void;
  loading?: boolean;
  error?: string | null;
  code?: string | null;
  frameId: string;
  frameData?: {
    name?: string;
    previewUrl?: string;
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

export default function ActionsSection({ 
  onGenerateHtml,
  loading = false, 
  error = null, 
  code = null,
  frameId,
  frameData,
  className = '' 
}: ActionsSectionProps) {
  return (
    <div className={`space-y-12 ${className}`}>
      {/* Frame Preview and Generate Button */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Frame Preview */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-light text-[#EAEAEA] mb-6">Aperçu de la frame</h2>
          <div className="aspect-video bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden relative">
            {frameData?.previewUrl ? (
              <Image
                src={frameData.previewUrl}
                alt={`Aperçu de ${frameData.name || 'la frame'}`}
                fill
                className="object-contain rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
            ) : frameData?.absoluteBoundingBox ? (
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
                  <p className="font-light mb-3 text-lg">Frame en cours de chargement...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="lg:col-span-1 flex justify-end">
          <div>
            <h3 className="text-xl font-light text-[#EAEAEA] mb-6 text-right">Actions</h3>
            <button
              onClick={onGenerateHtml}
              disabled={loading}
              className="flex items-center justify-center gap-3 h-12 px-6 bg-white text-black font-medium rounded-xl text-sm
                         transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>Génération...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>Générer HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorMessage 
          title="Erreur lors de la génération" 
          message={error} 
          variant="card" 
        />
      )}

      {/* Code Block */}
      {code && (
        <div className="space-y-6">
          <h3 className="text-2xl font-light text-[#EAEAEA]">Code HTML généré</h3>
          <CodeBlock code={code} frameId={frameId} />
        </div>
      )}
    </div>
  );
}