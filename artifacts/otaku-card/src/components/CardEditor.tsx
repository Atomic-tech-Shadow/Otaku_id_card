import React from 'react';
import { Camera, Download, Cpu, Fingerprint, Crosshair, UserSquare2 } from 'lucide-react';
import { FormData } from '../types';

interface CardEditorProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPhotoChange: (dataUrl: string) => void;
  onDownload: () => void;
}

export function CardEditor({ formData, onChange, onPhotoChange, onDownload }: CardEditorProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) onPhotoChange(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="lg:col-span-4 flex flex-col h-full gap-6">
      <div className="hud-panel p-6 flex-grow rounded-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#00d4ff]/20 pb-4">
          <h2 className="text-lg font-bold text-[#00d4ff] flex items-center gap-2 uppercase tracking-widest font-mono">
            <Cpu className="w-5 h-5" /> PARAMETERS
          </h2>
          <div className="text-[10px] text-[#00d4ff]/60 font-mono animate-pulse">INPUT_REQUIRED</div>
        </div>

        <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {/* Identity Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-white/50 uppercase font-bold tracking-widest border-l-2 border-white/20 pl-2">
              <UserSquare2 className="w-4 h-4" /> Identity Data
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="cyber-label block text-[10px] font-bold text-[#00d4ff]/80 uppercase mb-1">Nom (Last Name)</label>
                <input
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={onChange}
                  className="cyber-input w-full p-2.5 text-sm font-mono uppercase"
                />
              </div>
              <div className="group">
                <label className="cyber-label block text-[10px] font-bold text-[#00d4ff]/80 uppercase mb-1">Prénom (First Name)</label>
                <input
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={onChange}
                  className="cyber-input w-full p-2.5 text-sm font-mono uppercase"
                />
              </div>
            </div>

            <div className="group">
              <label className="cyber-label block text-[10px] font-bold text-[#00d4ff]/80 uppercase mb-1">Nationalité</label>
              <input
                name="nationalite"
                value={formData.nationalite}
                onChange={onChange}
                className="cyber-input w-full p-2.5 text-sm font-mono uppercase"
              />
            </div>
          </div>

          {/* Combat Stats Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-white/50 uppercase font-bold tracking-widest border-l-2 border-[#b026ff]/50 pl-2 mt-6">
              <Crosshair className="w-4 h-4 text-[#b026ff]" /> Combat Profile
            </div>

            <div className="group">
              <label className="cyber-label block text-[10px] font-bold text-[#b026ff]/80 uppercase mb-1">Expertise / Pouvoirs</label>
              <input
                name="expertise"
                value={formData.expertise}
                onChange={onChange}
                className="cyber-input w-full p-2.5 text-sm font-mono focus:border-[#b026ff] focus:shadow-[0_0_10px_rgba(176,38,255,0.3)] uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="cyber-label block text-[10px] font-bold text-[#b026ff]/80 uppercase mb-1">Classe</label>
                <select
                  name="classe"
                  value={formData.classe}
                  onChange={onChange}
                  className="cyber-input w-full p-2.5 text-sm font-mono appearance-none focus:border-[#b026ff] focus:shadow-[0_0_10px_rgba(176,38,255,0.3)] uppercase"
                >
                  <option>S-CLASS</option>
                  <option>A-CLASS</option>
                  <option>B-CLASS</option>
                  <option>GOD TIER</option>
                </select>
              </div>
              <div className="group">
                <label className="cyber-label block text-[10px] font-bold text-[#b026ff]/80 uppercase mb-1">Niveau (0-100)</label>
                <input
                  type="number"
                  name="powerLevel"
                  min="0"
                  max="100"
                  value={formData.powerLevel}
                  onChange={onChange}
                  className="cyber-input w-full p-2.5 text-sm font-mono focus:border-[#b026ff] focus:shadow-[0_0_10px_rgba(176,38,255,0.3)] uppercase"
                />
              </div>
            </div>
          </div>

          {/* Biometrics */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/50 uppercase font-bold tracking-widest border-l-2 border-[#00ff9d]/50 pl-2">
              <Fingerprint className="w-4 h-4 text-[#00ff9d]" /> Biometrics
            </div>
            
            <label className="relative flex w-full cursor-pointer bg-black/40 border border-[#00ff9d]/30 p-4 items-center justify-center gap-3 transition-all group overflow-hidden cyber-input hover:border-[#00ff9d]/80 hover:bg-[#00ff9d]/10 hover:shadow-[0_0_15px_rgba(0,255,157,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff9d]/10 to-transparent -translate-x-full group-hover:animate-[scan-vertical_2s_ease-in-out_infinite]"></div>
              <Camera className="w-5 h-5 text-[#00ff9d] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest text-[#00ff9d] font-mono">UPLOAD_PORTRAIT</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={onDownload}
        className="cyber-button w-full bg-[#00d4ff] hover:bg-white text-black font-black py-4 flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] group font-mono"
      >
        <Download className="w-5 h-5 group-hover:animate-bounce" /> 
        <span>INITIALIZE_PRINT</span>
      </button>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 212, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.6);
        }
      `}</style>
    </div>
  );
}
