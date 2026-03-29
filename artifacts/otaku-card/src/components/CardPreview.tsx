import React from 'react';
import { StatsBar } from './StatsBar';

interface CardPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function CardPreview({ canvasRef }: CardPreviewProps) {
  return (
    <div className="lg:col-span-8 flex flex-col items-center">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-black rounded-3xl p-2 border border-slate-800">
          <canvas
            ref={canvasRef}
            width={1011}
            height={638}
            className="w-full h-auto rounded-2xl shadow-2xl"
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div>
      <StatsBar />
    </div>
  );
}
