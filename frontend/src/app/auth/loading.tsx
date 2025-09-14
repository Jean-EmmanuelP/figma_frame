export default function AuthLoading() {
  console.log('🔄 [AUTH] Auth loading page rendered');
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="flex space-x-1 mb-4">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
        <p className="text-[#EAEAEA] text-lg">Connexion en cours...</p>
        <p className="text-[#A3A3A3] text-sm mt-2">Redirection depuis Figma...</p>
      </div>
    </div>
  );
}