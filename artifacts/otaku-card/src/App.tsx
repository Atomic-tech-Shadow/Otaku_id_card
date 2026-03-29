import React, { useState, useRef } from 'react';
import { CardEditor } from './components/CardEditor';
import { CardPreview } from './components/CardPreview';
import { useCardRenderer } from './hooks/useCardRenderer';
import { FormData } from './types';
import { ShieldAlert, Hexagon, Lock } from 'lucide-react';

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
      <nav className="border-b border-slate-800 bg-[#0f1629] relative z-20 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Hexagon className="w-8 h-8 text-[#b91c1c]" fill="currentColor" fillOpacity={0.2} strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-widest text-slate-100 flex items-center gap-2">
              ⬡ O.I.A.
            </span>
            <span className="text-[9px] font-medium tracking-[0.2em] text-slate-500 uppercase">
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

        <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/50 px-3 py-1.5 rounded-sm animate-slow-pulse">
          <Lock className="w-3.5 h-3.5 text-red-500" />
          <span className="text-xs font-bold tracking-widest text-red-500">CLASSIFICATION: SECRET</span>
        </div>
      </nav>

      <main className="flex-grow relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        
        {/* Hero Banner */}
        <header className="flex flex-col gap-2 border-l-4 border-[#b91c1c] pl-6 py-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-slate-100 uppercase">
            SYSTÈME D'IDENTIFICATION OFFICIEL
          </h1>
          <p className="text-sm font-mono text-slate-400 tracking-wide">
            Émission de cartes d'identification certifiées — Niveau Accréditation ALPHA
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <CardEditor
            formData={formData}
            onChange={handleInputChange}
            onPhotoChange={setPhoto}
            onDownload={handleDownload}
          />
          <CardPreview canvasRef={canvasRef} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#0f1629] py-6 px-6 relative z-20 text-xs font-mono text-slate-500 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <div>© {new Date().getFullYear()} OTAKU INTERNATIONAL AGENCY. TOUS DROITS RÉSERVÉS.</div>
        <div className="flex gap-6">
          <span>VER: 4.2.9-STABLE</span>
          <span>DOMAINE: SECURE-NET</span>
          <span className="text-[#b91c1c]">RESTRICTED ACCESS</span>
        </div>
      </footer>
    </div>
  );
}