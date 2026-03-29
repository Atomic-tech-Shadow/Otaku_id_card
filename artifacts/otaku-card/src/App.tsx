import React, { useState, useRef } from 'react';
import { CardEditor } from './components/CardEditor';
import { CardPreview } from './components/CardPreview';
import { useCardRenderer } from './hooks/useCardRenderer';
import { FormData } from './types';
import { Terminal, ShieldAlert } from 'lucide-react';

const DEFAULT_FORM_DATA: FormData = {
  nom: 'SAITAMA',
  prenom: 'GENOS',
  dateNaissance: '19 MAI 2005',
  sexe: 'M',
  nationalite: 'JAPONAISE',
  noCarte: 'OA-JP-9928102',
  dateExpiration: '31 DÉC 2030',
  classe: 'S-CLASS',
  expertise: 'CYBORG, INCINÉRATION',
  membreDepuis: '05 JUIN 2022',
  powerLevel: 95,
  mrzLine: 'P<OTAKU<SAITAMA<<<<GENOS<<<0A9928102M1905051<<<JP<<<9',
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [photo, setPhoto] = useState<string | null>(null);

  useCardRenderer(canvasRef, formData, photo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'powerLevel' ? Number(value) : value,
    }));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `otaku-card-${formData.nom}.png`;
    link.href = canvasRef.current!.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid z-0"></div>
      <div className="bg-grid-glow z-0"></div>
      <div className="scanlines"></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
        {/* Header HUD */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#00d4ff]/30 pb-6 mb-4 relative">
          <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-[#00d4ff] to-transparent shadow-[0_0_10px_#00d4ff]"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00d4ff]/10 border border-[#00d4ff]/50 rounded-sm flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#00d4ff]/20 animate-pulse"></div>
              <ShieldAlert className="text-[#00d4ff] relative z-10 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                OTAKU_SYS
              </h1>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff]/80">
                <Terminal className="w-3 h-3" />
                <span>TERMINAL_ACCESS: GRANTED // ID_GENERATOR_V2</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden md:flex flex-col items-end text-slate-500">
              <span>SYS.TEMP: 34.2°C</span>
              <span>UPLINK: STABLE</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-800 hidden md:block"></div>
            <div className="text-right">
              <div className="text-[#00d4ff]">ENCRYPTION: ACTIVE</div>
              <div className="text-slate-400">SESSION: {Math.random().toString(36).substring(7).toUpperCase()}</div>
            </div>
          </div>
        </header>

        <main className="grid lg:grid-cols-12 gap-8">
          <CardEditor
            formData={formData}
            onChange={handleInputChange}
            onPhotoChange={setPhoto}
            onDownload={handleDownload}
          />
          <CardPreview canvasRef={canvasRef} />
        </main>
      </div>
    </div>
  );
}
