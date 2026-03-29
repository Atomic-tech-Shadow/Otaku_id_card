import React from 'react';
import { Camera, Download, Zap } from 'lucide-react';
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
    <div className="lg:col-span-4 space-y-4">
      <div className="bg-slate-900 border border-blue-900/50 p-6 rounded-2xl shadow-blue-900/20 shadow-lg">
        <h2 className="text-xl font-black mb-6 text-blue-400 flex items-center gap-2 uppercase tracking-tighter">
          <Zap className="fill-current" /> Éditeur d'Agent
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom Complet</label>
            <div className="flex gap-2">
              <input
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={onChange}
                className="w-1/2 bg-black border border-slate-800 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={onChange}
                className="w-1/2 bg-black border border-slate-800 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expertise / Pouvoirs</label>
            <input
              name="expertise"
              value={formData.expertise}
              onChange={onChange}
              className="w-full bg-black border border-slate-800 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Classe</label>
              <select
                name="classe"
                value={formData.classe}
                onChange={onChange}
                className="w-full bg-black border border-slate-800 rounded-lg p-2 text-sm outline-none"
              >
                <option>S-CLASS</option>
                <option>A-CLASS</option>
                <option>B-CLASS</option>
                <option>GOD TIER</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Niveau (0-100)</label>
              <input
                type="number"
                name="powerLevel"
                value={formData.powerLevel}
                onChange={onChange}
                className="w-full bg-black border border-slate-800 rounded-lg p-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <label className="flex w-full cursor-pointer bg-blue-900/30 hover:bg-blue-800/40 border border-blue-500/50 p-3 rounded-xl items-center justify-center gap-2 transition-all group">
              <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase">Scanner Portrait</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={onDownload}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-95"
      >
        <Download /> GÉNÉRER LA CARTE
      </button>
    </div>
  );
}
