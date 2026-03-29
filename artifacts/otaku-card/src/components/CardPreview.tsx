import React from 'react';
import { StatsBar } from './StatsBar';

interface CardPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function CardPreview({ canvasRef }: CardPreviewProps) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-6 h-full">
      <div className="oia-panel flex-grow flex flex-col">
        {/* Header / Document Holder top */}
        <div className="bg-[#0a0f1e] border-b border-slate-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#b91c1c]"></div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">APERÇU — DOCUMENT OFFICIEL</h3>
              <p className="text-[10px] font-mono text-slate-500">FORMAT STANDARD ISO/IEC 7810 ID-1</p>
            </div>
          </div>
          <div className="border border-red-800 text-red-500 text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            [CONFIDENTIEL]
          </div>
        </div>

        {/* Canvas wrapper */}
        <div className="flex-grow p-4 md:p-8 flex items-center justify-center bg-[#0d1222] relative overflow-hidden">
          {/* subtle grid background for the holding area */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: `20px 20px`
          }}></div>
          
          <div className="relative group w-full max-w-[800px] mx-auto flex justify-center">
            {/* The secure document holder aesthetic */}
            <div className="relative p-2 bg-slate-800 rounded-sm shadow-2xl border border-slate-700">
              {/* Corner clips */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-400"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-400"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-400"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-400"></div>

              <div className="bg-black relative shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={1011}
                  height={638}
                  className="w-full h-auto block rounded-sm"
                  style={{ maxWidth: '100%', objectFit: 'contain' }}
                />
                
                {/* Protective watermark overlay */}
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-10 flex items-center justify-center">
                  <span className="text-white text-6xl font-black uppercase tracking-widest rotate-[-30deg]">O.I.A. SECURE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <StatsBar />
    </div>
  );
}