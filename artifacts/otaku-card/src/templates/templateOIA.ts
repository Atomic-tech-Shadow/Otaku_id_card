import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ } from '../lib/mrz';

export function renderOIA(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const bgGradient = ctx.createLinearGradient(0, 0, w, h);
  bgGradient.addColorStop(0, '#0f172a');
  bgGradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bgGradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 25);
  ctx.fill();

  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < w; i += 15) {
    for (let j = 0; j < h; j += 15) {
      ctx.beginPath();
      ctx.arc(i, j, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1.0;

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 100);
  ctx.lineTo(w - 50, 100);
  ctx.stroke();

  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(150, 0);
  ctx.lineTo(0, 150);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - 150, h);
  ctx.lineTo(w, h - 150);
  ctx.fill();

  ctx.shadowBlur = 15;
  ctx.shadowColor = '#60a5fa';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 70);
  ctx.shadowBlur = 0;

  const photoX = 70;
  const photoY = 140;
  const photoW = 260;
  const photoH = 340;

  ctx.fillStyle = '#000';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      const len = 30;
      ctx.beginPath();
      ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
      ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
      ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
      ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
      ctx.stroke();
    };
  }

  ctx.textAlign = 'left';
  const startX = 380;

  const drawHudField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`[ ${label} ]`, x, y);
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(value.toUpperCase(), x, y + 35);
  };

  drawHudField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 155);
  drawHudField('PSEUDO', formData.pseudo, startX, 215);
  drawHudField('NATIONALITÉ', formData.nationalite, startX, 278);
  drawHudField('NO. DE SÉRIE', formData.noCarte, startX + 300, 278);

  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#60a5fa';
  ctx.fillText('[ NIVEAU DE PUISSANCE ]', startX, 348);

  const barWidth = 550;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.beginPath();
  ctx.fillStyle = '#1e293b';
  ctx.roundRect(startX, 363, barWidth, 15, 5);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(1, '#f43f5e');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.roundRect(startX, 363, (barWidth * power) / 100, 15, 5);
    ctx.fill();
  }

  drawHudField('CLASSE DE COMBAT', formData.classe, startX, 428);
  drawHudField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 502);

  const qrX = 830, qrY = 430, qrSize = 130;

  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#60a5fa', light: '#0a0f1e' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {
    ctx.fillStyle = '#f43f5e';
    ctx.font = '10px monospace';
    ctx.fillText('URL INVALIDE', qrX + 10, qrY + 65);
  });

  // Mini info strip under photo
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value.toUpperCase(), x, y + 16);
  };
  drawMiniField('[ NAISSANCE ]', formData.dateNaissance, 70, 498);
  drawMiniField('[ SEXE ]', formData.sexe, 215, 498);
  drawMiniField('[ EXPIRATION ]', formData.dateExpiration, 70, 533);
  drawMiniField('[ MEMBRE DEP. ]', formData.membreDepuis, 215, 533);

  const { line1: mrzLine1, line2: mrzLine2 } = generateMRZ(formData);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(40, 563, w - 80, 62);
  ctx.fillStyle = '#fff';
  ctx.font = '15px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(mrzLine1, 60, 583);
  ctx.fillText(mrzLine2, 60, 607);
}
