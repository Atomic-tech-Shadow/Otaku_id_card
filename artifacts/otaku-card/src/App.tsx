import React, { useState, useRef } from 'react';
import { CardEditor } from './components/CardEditor';
import { CardPreview } from './components/CardPreview';
import { useCardRenderer } from './hooks/useCardRenderer';
import { FormData } from './types';

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
    <div className="min-h-screen bg-black text-slate-200 p-4 font-sans">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        <CardEditor
          formData={formData}
          onChange={handleInputChange}
          onPhotoChange={setPhoto}
          onDownload={handleDownload}
        />
        <CardPreview canvasRef={canvasRef} />
      </div>
    </div>
  );
}
