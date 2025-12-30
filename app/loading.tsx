export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                {/* Logo Animation */}
                <div className="relative h-24 w-24 mb-8">
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping"></div>
                    <div className="absolute inset-0 rounded-2xl bg-primary flex items-center justify-center shadow-xl">
                        <span className="text-4xl font-bold text-white">H</span>
                    </div>
                </div>

                {/* Text Animation */}
                <div className="space-y-2 text-center">
                    <h2 className="text-xl font-bold text-slate-900 animate-pulse">Houses</h2>
                    <p className="text-sm text-slate-500">Preparing your partner dashboard...</p>
                </div>

                {/* Loading Bar */}
                <div className="w-48 h-1.5 bg-slate-200 rounded-full mt-8 overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '50%' }}></div>
                </div>
            </div>

            <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
        </div>
    );
}
