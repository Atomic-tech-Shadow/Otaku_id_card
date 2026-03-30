import { FormData } from '../types';

const CHAR_VALUES: Record<string, number> = {};
const ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
for (let i = 0; i < ALPHA.length; i++) CHAR_VALUES[ALPHA[i]] = i;
CHAR_VALUES['<'] = 0;

function checkDigit(str: string): string {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    const v = CHAR_VALUES[str[i].toUpperCase()] ?? 0;
    sum += v * weights[i % 3];
  }
  return String(sum % 10);
}

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9 ]/gi, '')
    .toUpperCase();
}

function toMrzName(str: string): string {
  return removeAccents(str).replace(/\s+/g, '<').replace(/[^A-Z<]/g, '');
}

function padRight(str: string, len: number, char = '<'): string {
  return (str + char.repeat(len)).slice(0, len);
}

const FRENCH_MONTHS: Record<string, string> = {
  JAN: '01', FÉV: '02', FEV: '02', MAR: '03', AVR: '04',
  MAI: '05', JUN: '06', JUL: '07', AOÛ: '08', AOU: '08',
  SEP: '09', OCT: '10', NOV: '11', DÉC: '12', DEC: '12',
};

function parseFrenchDate(dateStr: string): string {
  const parts = dateStr.trim().toUpperCase().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const monthRaw = parts[1].substring(0, 3).toUpperCase();
    const month = FRENCH_MONTHS[monthRaw] ?? '01';
    const year = parts[2].slice(-2);
    return year + month + day;
  }
  return '000000';
}

const NATIONALITY_MAP: Record<string, string> = {
  JAPONAISE: 'JPN', JAPONAIS: 'JPN',
  FRANÇAISE: 'FRA', FRANCAISE: 'FRA', FRANÇAIS: 'FRA', FRANCAIS: 'FRA',
  AMÉRICAINE: 'USA', AMERICAINE: 'USA', AMÉRICAIN: 'USA', AMERICAIN: 'USA',
  BRITANNIQUE: 'GBR',
  CORÉENNE: 'KOR', COREENNE: 'KOR', CORÉEN: 'KOR', COREEN: 'KOR',
  CHINOISE: 'CHN', CHINOIS: 'CHN',
  ITALIENNE: 'ITA', ITALIEN: 'ITA',
  ESPAGNOLE: 'ESP', ESPAGNOL: 'ESP',
  ALLEMANDE: 'DEU', ALLEMAND: 'DEU',
  BRÉSILIENNE: 'BRA', BRESILIENNE: 'BRA', BRÉSILIEN: 'BRA', BRESILIEN: 'BRA',
  RUSSE: 'RUS',
  CANADIENNE: 'CAN', CANADIEN: 'CAN',
  MEXICAINE: 'MEX', MEXICAIN: 'MEX',
  AUSTRALIENNE: 'AUS', AUSTRALIEN: 'AUS',
  INDIENNE: 'IND', INDIEN: 'IND',
  OTAKU: 'OTK',
};

function toNatCode(nationalite: string): string {
  const key = removeAccents(nationalite.trim().toUpperCase());
  return NATIONALITY_MAP[key] ?? padRight(key.replace(/[^A-Z]/g, ''), 3, '<').slice(0, 3);
}

function sanitizeDocNumber(noCarte: string): string {
  const cleaned = removeAccents(noCarte).replace(/[^A-Z0-9]/g, '');
  return padRight(cleaned, 9);
}

export function generateMRZ(formData: FormData): { line1: string; line2: string } {
  const nat3 = toNatCode(formData.nationalite);

  const surname = toMrzName(formData.nom);
  const firstname = toMrzName(formData.prenom);
  const nameField = padRight(`${surname}<<${firstname}`, 39);
  const line1 = `P<${nat3}${nameField}`.slice(0, 44);

  const docNum9 = sanitizeDocNumber(formData.noCarte);
  const docCd = checkDigit(docNum9);

  const birthDate = parseFrenchDate(formData.dateNaissance);
  const birthCd = checkDigit(birthDate);

  const sex = formData.sexe === 'F' ? 'F' : 'M';

  const expiryDate = parseFrenchDate(formData.dateExpiration);
  const expiryCd = checkDigit(expiryDate);

  const optional = '<<<<<<<<<<<<<<';
  const core = `${docNum9}${docCd}${nat3}${birthDate}${birthCd}${sex}${expiryDate}${expiryCd}${optional}`;
  const compositeSrc = `${docNum9}${docCd}${birthDate}${birthCd}${expiryDate}${expiryCd}${optional}`;
  const compositeCd = checkDigit(compositeSrc);
  const line2 = `${core}${compositeCd}`.slice(0, 44);

  return { line1, line2 };
}
