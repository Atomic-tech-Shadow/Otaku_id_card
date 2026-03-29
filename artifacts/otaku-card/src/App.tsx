import React, { useState, useRef } from 'react';
import { CardEditor } from './components/CardEditor';
import { CardPreview } from './components/CardPreview';
import { useCardRenderer } from './hooks/useCardRenderer';
import { FormData } from './types';
import { ShieldAlert, BadgeCheck } from 'lucide-react';
import oiaLogo from './assets/oia-logo.svg';

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
  qrUrl: 'https://otaku-agency.org',
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
      [name]: name === 'powerLevel' ? (parseInt(value, 10) || 0) : value,
    }));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `OIA-ID-${formData.nom}.png`;
    link.href = canvasRef.current!.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-300 font-sans relative flex flex-col">
      {/* Background Effects */}
      <div className="bg-noise"></div>
      <div className="scanlines-subtle"></div>

      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-800 bg-[#0f1629] relative z-20 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={oiaLogo} alt="O.I.A. Logo" className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 drop-shadow-lg" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-bold tracking-widest text-slate-100">
                O.I.A.
              </span>
              <div className="flex items-center gap-1 bg-[#1a1400]/60 border border-[#d4af37]/40 px-1.5 py-0.5 rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.15)] animate-slow-pulse">
                <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#d4af37] shrink-0" strokeWidth={1.5} />
                <span className="text-[7px] sm:text-[8px] font-mono font-black tracking-widest text-[#d4af37] uppercase hidden sm:block whitespace-nowrap">ACCRÉDITÉ ALPHA</span>
              </div>
            </div>
            <span className="text-[8px] sm:text-[9px] font-medium tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 uppercase truncate">
              Otaku International Agency
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-widest text-slate-400">
          <a href="#" className="hover:text-slate-100 transition-colors">ACCUEIL</a>
          <a href="#" className="text-slate-100 border-b-2 border-[#b91c1c] pb-1">IDENTIFICATION</a>
          <a href="#" className="hover:text-slate-100 transition-colors">PROTOCOLES</a>
          <a href="#" className="hover:text-slate-100 transition-colors">CONTACT</a>
        </div>

      </nav>

      <main className="flex-grow relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* Hero Banner */}
        <header className="flex flex-col gap-1 border-l-4 border-[#b91c1c] pl-4 py-2">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-widest text-slate-100 uppercase">
            SYSTÈME D'IDENTIFICATION OFFICIEL
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 tracking-wide">
            Émission de cartes d'identification certifiées — Niveau Accréditation ALPHA
          </p>
        </header>

        {/* Mobile: preview on top, editor below. Desktop: side by side */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
          {/* Preview shown first on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <CardPreview canvasRef={canvasRef} />
          </div>
          {/* Editor below on mobile */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <CardEditor
              formData={formData}
              onChange={handleInputChange}
              onPhotoChange={setPhoto}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#0f1629] py-4 px-4 sm:px-6 relative z-20 text-[10px] sm:text-xs font-mono text-slate-500 text-center flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <div>© {new Date().getFullYear()} OTAKU INTERNATIONAL AGENCY.</div>
        <div className="flex gap-3 sm:gap-6 flex-wrap justify-center">
          <span>VER: 4.2.9-STABLE</span>
          <span className="hidden sm:inline">DOMAINE: SECURE-NET</span>
          <span className="text-[#b91c1c]">RESTRICTED ACCESS</span>
        </div>
        <div className="text-slate-600">
          CONÇU PAR <span className="text-[#d4af37] tracking-widest">DEV CID</span>
        </div>
      </footer>
    </div>
  );
}