import React from 'react';
import { Camera, FileText, Database, Shield, AlertTriangle, Layers, CreditCard } from 'lucide-react';
import { FormData, TemplateId } from '../types';

const TEMPLATES: { id: TemplateId; name: string; genre: string; color: string }[] = [
  { id: 'OIA',     name: 'O.I.A STANDARD', genre: 'Mecha / Cyber',    color: '#3b82f6' },
  { id: 'SHONEN',  name: 'BATTLE RECORD',  genre: 'Shōnen / Combat',  color: '#f97316' },
  { id: 'DEMON',   name: 'DEMON SLAYER',   genre: 'Dark Fantasy',     color: '#be123c' },
  { id: 'MAGICAL', name: 'MAGICAL SOUL',   genre: 'Mahou Shoujo',     color: '#ec4899' },
  { id: 'SPACE',   name: 'VOID RUNNER',    genre: 'Space Opera',      color: '#06b6d4' },
  { id: 'SHADOW',  name: 'SHADOW GARDEN',  genre: 'Eminence in Shadow', color: '#5A00FF' },
  { id: 'MUGIWARA', name: 'MUGIWARA',      genre: 'One Piece',          color: '#fbbf24' },
  { id: 'SOLO',     name: 'SOLO LEVELING', genre: 'Hunter System',      color: '#00b4ff' },
];

interface InputFieldProps {
  label: string;
  code: string;
  name: string;
  value: string | number;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  required?: boolean;
  isSelect?: boolean;
  options?: string[];
  uppercase?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

function InputField({ label, code, name, value, type = 'text', inputMode, pattern, required = true, isSelect = false, options = [], uppercase = true, onChange }: InputFieldProps) {
  return (
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
            className="oia-input w-full p-2.5 pl-12 sm:pl-16 text-sm font-mono uppercase appearance-none touch-manipulation"
          >
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            inputMode={inputMode}
            pattern={pattern}
            name={name}
            value={value}
            onChange={onChange}
            className={`oia-input w-full p-2.5 pl-12 sm:pl-16 text-sm font-mono touch-manipulation ${uppercase ? 'uppercase' : 'lowercase'}`}
          />
        )}
      </div>
    </div>
  );
}

interface CardEditorProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPhotoChange: (dataUrl: string) => void;
  onDownload: () => void;
  onTemplateChange: (template: TemplateId) => void;
}

export function CardEditor({ formData, onChange, onPhotoChange, onDownload, onTemplateChange }: CardEditorProps) {
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
    <div className="flex flex-col gap-4">
      <div className="oia-panel p-4 sm:p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 uppercase tracking-widest">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37]" /> DOSSIER D'ENREGISTREMENT
          </h2>
          <div className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-1 rounded-sm border border-slate-700 shrink-0">
            FORM-ID: 72-A
          </div>
        </div>

        <div className="space-y-6">

          {/* Template Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Layers className="w-3.5 h-3.5" /> TEMPLATE DE CARTE
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => {
                const isActive = formData.template === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onTemplateChange(t.id)}
                    className="relative flex flex-col items-start p-3 border transition-all duration-200 text-left touch-manipulation overflow-hidden"
                    style={{
                      background: isActive ? `${t.color}18` : '#0a0f1e',
                      borderColor: isActive ? t.color : '#1e293b',
                      boxShadow: isActive ? `0 0 14px ${t.color}35` : 'none',
                    }}
                  >
                    {/* Barre couleur en haut */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-200"
                      style={{ background: isActive ? t.color : '#1e293b' }}
                    />

                    {/* Point actif en haut à droite */}
                    {isActive && (
                      <div
                        className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                        style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
                      />
                    )}

                    {/* Nom du template */}
                    <div className="flex items-center gap-1.5 mt-1 pr-4">
                      <div
                        className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
                        style={{
                          background: t.color,
                          opacity: isActive ? 1 : 0.35,
                          boxShadow: isActive ? `0 0 6px ${t.color}` : 'none',
                        }}
                      />
                      <span
                        className="text-[10px] font-mono font-bold tracking-widest uppercase leading-tight transition-colors duration-200"
                        style={{ color: isActive ? t.color : '#475569' }}
                      >
                        {t.name}
                      </span>
                    </div>

                    {/* Genre */}
                    <span className="text-[8px] font-mono uppercase tracking-wide mt-1.5 leading-tight transition-colors duration-200"
                      style={{ color: isActive ? `${t.color}99` : '#334155' }}
                    >
                      {t.genre}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Identity Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Database className="w-3.5 h-3.5" /> DONNÉES D'IDENTITÉ
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="Nom de famille" code="F01" name="nom" value={formData.nom} onChange={onChange} />
              <InputField label="Prénom" code="F02" name="prenom" value={formData.prenom} onChange={onChange} />
            </div>

            <InputField label="Pseudo / Alias" code="F03" name="pseudo" value={formData.pseudo} onChange={onChange} />

            <InputField label="Nationalité" code="F04" name="nationalite" value={formData.nationalite} onChange={onChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="Date de naissance" code="F04" name="dateNaissance" value={formData.dateNaissance} onChange={onChange} />
              <InputField
                label="Sexe"
                code="F05"
                name="sexe"
                value={formData.sexe}
                isSelect={true}
                options={['M', 'F']}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Card Info Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <CreditCard className="w-3.5 h-3.5" /> INFORMATIONS DE CARTE
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="Date d'expiration" code="C01" name="dateExpiration" value={formData.dateExpiration} onChange={onChange} />
              <InputField label="Membre depuis" code="C02" name="membreDepuis" value={formData.membreDepuis} onChange={onChange} />
            </div>

          </div>

          {/* Combat Stats Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Shield className="w-3.5 h-3.5" /> PROFIL TACTIQUE
            </div>

            <InputField label="Expertise / Pouvoirs" code="T01" name="expertise" value={formData.expertise} onChange={onChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Classification"
                code="T02"
                name="classe"
                value={formData.classe}
                isSelect={true}
                options={['S-CLASS', 'A-CLASS', 'B-CLASS', 'GOD TIER', 'CIVILIAN']}
                onChange={onChange}
              />
              <InputField label="Niveau (0-100)" code="T03" name="powerLevel" type="text" inputMode="numeric" pattern="[0-9]*" value={formData.powerLevel} onChange={onChange} />
            </div>
          </div>

          {/* QR Code URL */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Shield className="w-3.5 h-3.5" /> LIEN QR CODE
            </div>
            <InputField label="URL du QR Code" code="Q01" name="qrUrl" value={formData.qrUrl} required={false} uppercase={false} onChange={onChange} />
          </div>

          {/* Biometrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#d4af37] uppercase font-bold tracking-widest border-b border-slate-800 pb-2">
              <Camera className="w-3.5 h-3.5" /> BIOMÉTRIE
            </div>

            <label className="relative flex w-full cursor-pointer bg-[#0a0f1e] border border-slate-700 border-dashed p-4 items-center justify-center gap-3 transition-all hover:border-slate-500 hover:bg-slate-800/50 touch-manipulation">
              <Camera className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-300">SOUMETTRE PORTRAIT</span>
                <span className="text-[9px] font-mono text-slate-500">FORMAT: JPG/PNG (RATIO 3:4 RECOMMANDÉ)</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
