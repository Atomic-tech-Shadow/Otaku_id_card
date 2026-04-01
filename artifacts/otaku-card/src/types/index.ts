export type TemplateId = 'OIA' | 'SHONEN' | 'DEMON' | 'MAGICAL' | 'SPACE' | 'SHADOW' | 'MUGIWARA' | 'SOLO' | 'JJK' | 'HERO' | 'KONOHA' | 'DBZ' | 'SOUL' | 'FAIRY' | 'CSM';

export interface FormData {
  nom: string;
  prenom: string;
  pseudo: string;
  dateNaissance: string;
  sexe: string;
  nationalite: string;
  noCarte: string;
  dateExpiration: string;
  classe: string;
  expertise: string;
  membreDepuis: string;
  powerLevel: number;
  qrUrl: string;
  template: TemplateId;
}
