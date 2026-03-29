import React from 'react';
import { StatsBar } from './StatsBar';

interface CardPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function CardPreview({ canvasRef }: CardPreviewProps) {
  return (
    <div className="lg:col-span-8 flex flex-col items-center gap-8 h-full">
      <div className="hud-panel w-full p-2 md:p-8 flex-grow flex items-center justify-center relative">
        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#00d4ff]/40 opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#00d4ff]/40 opacity-50"></div>
        
        <div className="absolute top-4 right-4 text-xs font-mono text-[#00d4ff]/40 tracking-widest">OUTPUT_PREVIEW // V.2.0.4</div>
        <div className="absolute bottom-4 left-4 text-xs font-mono text-[#00d4ff]/40 tracking-widest">RENDER_STATUS: NOMINAL</div>
        
        <div className="relative group w-full max-w-4xl mx-auto flex justify-center">
          {/* Glowing backdrop for the card */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#00d4ff]/20 via-[#b026ff]/20 to-[#00d4ff]/20 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 rounded-[2rem] pointer-events-none"></div>
          
          <div className="relative p-1 bg-gradient-to-b from-white/20 to-white/5 rounded-2xl shadow-2xl shadow-[#00d4ff]/10">
            <div className="bg-black/90 rounded-xl p-2 border border-white/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
              <canvas
                ref={canvasRef}
                width={1011}
                height={638}
                className="w-full h-auto rounded-lg shadow-2xl relative z-10 block"
                style={{ maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <StatsBar />
    </div>
  );
}
