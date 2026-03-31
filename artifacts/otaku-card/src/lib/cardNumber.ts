import { TemplateId } from '../types';

const TEMPLATE_PREFIX: Record<TemplateId, string> = {
  OIA: 'OA',
  SHONEN: 'BR',
  DEMON: 'DS',
  MAGICAL: 'MS',
  SPACE: 'VR',
  SHADOW: 'SG',
  MUGIWARA: 'MW',
  SOLO: 'SL',
  JJK: 'JK',
  HERO: 'HB',
};

const NATIONALITY_CODES: Record<string, string> = {
  JAPONAISE: 'JP',
  JAPONAIS: 'JP',
  JAPAN: 'JP',
  FRANÇAISE: 'FR',
  FRANCAISE: 'FR',
  FRENCH: 'FR',
  AMERICAINE: 'US',
  AMÉRICAINE: 'US',
  AMERICAN: 'US',
  CORÉENNE: 'KR',
  COREENNE: 'KR',
  KOREAN: 'KR',
  CHINOISE: 'CN',
  CHINESE: 'CN',
  BRITANNIQUE: 'GB',
  BRITISH: 'GB',
  ALLEMANDE: 'DE',
  GERMAN: 'DE',
  ITALIENNE: 'IT',
  ITALIAN: 'IT',
  ESPAGNOLE: 'ES',
  SPANISH: 'ES',
  BRÉSILIENNE: 'BR',
  BRESILIENNE: 'BR',
  BRAZILIAN: 'BR',
  RUSSE: 'RU',
  RUSSIAN: 'RU',
  INCONNUE: 'XX',
  UNKNOWN: 'XX',
};

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash;
}

function getNationalityCode(nationalite: string): string {
  const key = nationalite.toUpperCase().trim();
  if (NATIONALITY_CODES[key]) return NATIONALITY_CODES[key];
  const cleaned = key.replace(/[^A-Z]/g, '');
  return cleaned.slice(0, 2).padEnd(2, 'X');
}

export function generateCardNumber(
  nom: string,
  prenom: string,
  nationalite: string,
  template: TemplateId
): string {
  const prefix = TEMPLATE_PREFIX[template] ?? 'OA';
  const natCode = getNationalityCode(nationalite);
  const seed = `${nom}|${prenom}|${nationalite}|${template}`;
  const hash = hashString(seed);
  const number = String(hash % 10000000).padStart(7, '0');
  return `${prefix}-${natCode}-${number}`;
}
