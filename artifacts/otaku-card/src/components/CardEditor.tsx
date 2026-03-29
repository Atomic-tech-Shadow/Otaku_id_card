import React from 'react';
import { Camera, FileText, Database, Shield, AlertTriangle } from 'lucide-react';
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

  const InputField = ({ label, code, name, value, type = 'text', required = true, isSelect = false, options = [] }: any) => (
    <div className="group flex flex-col gap-1.5">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        {required && <span className="text-[8px] font-mono text-[#b91c1c]">CHAMP OBLIGATOIRE</span>}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <span className="text-[9px] font-mono text-slate-600">{code}</span>
        </div>
        {isSelect ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="oia-input w-full p-2.5 pl-16 text-sm font-mono uppercase appearance-none"
          >
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="oia-input w-full p-2.5 pl-16 text-sm font-mono uppercase"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="lg:col-span-5 flex flex-col h-full gap-6">
      <div className="oia-panel p-6 flex-grow flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 uppercase tracking-widest">
            <FileText className="w-5 h-5 text-[#d4af37]" /> DOSSIER D'ENREGISTREMENT
          </h2>
          <div className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-1 rounded-sm border border-slate-700">
            FORM-ID: 72-A
          </div>
        </div>

        <div className="space-y-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Identity Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Database className="w-3.5 h-3.5" /> DONNÉES D'IDENTITÉ
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Nom de famille" code="F01" name="nom" value={formData.nom} />
              <InputField label="Prénom" code="F02" name="prenom" value={formData.prenom} />
            </div>

            <InputField label="Nationalité" code="F03" name="nationalite" value={formData.nationalite} />
          </div>

          {/* Combat Stats Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Shield className="w-3.5 h-3.5" /> PROFIL TACTIQUE
            </div>

            <InputField label="Expertise / Pouvoirs" code="T01" name="expertise" value={formData.expertise} />

            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Classification" 
                code="T02" 
                name="classe" 
                value={formData.classe} 
                isSelect={true}
                options={['S-CLASS', 'A-CLASS', 'B-CLASS', 'GOD TIER', 'CIVILIAN']}
              />
              <InputField label="Niveau (0-100)" code="T03" name="powerLevel" type="number" value={formData.powerLevel} />
            </div>
          </div>

          {/* Biometrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Camera className="w-3.5 h-3.5" /> BIOMÉTRIE
            </div>
            
            <label className="relative flex w-full cursor-pointer bg-[#0a0f1e] border border-slate-700 border-dashed p-4 items-center justify-center gap-3 transition-all hover:border-slate-500 hover:bg-slate-800/50">
              <Camera className="w-5 h-5 text-slate-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-300">SOUMETTRE PORTRAIT</span>
                <span className="text-[9px] font-mono text-slate-500">FORMAT: JPG/PNG (RATIO 3:4 RECOMMANDÉ)</span>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2 text-[#b91c1c] text-[10px] font-mono leading-tight bg-red-950/20 p-3 border border-red-900/30 rounded-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p>AVERTISSEMENT: Toute falsification de document officiel est passible de sanctions selon la directive OIA-402. La soumission de ce dossier vaut déclaration sur l'honneur.</p>
        </div>

        <button
          onClick={onDownload}
          className="oia-button w-full py-4 flex items-center justify-center gap-3 shadow-lg"
        >
          <FileText className="w-5 h-5" /> 
          <span className="tracking-[0.2em]">ÉMETTRE CARTE OFFICIELLE</span>
        </button>
      </div>
    </div>
  );
}