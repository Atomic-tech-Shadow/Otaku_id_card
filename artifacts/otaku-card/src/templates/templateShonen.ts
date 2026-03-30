import QRCode from 'qrcode';
import { FormData } from '../types';

export function renderShonen(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const bgGradient = ctx.createLinearGradient(0, 0, w, h);
  bgGradient.addColorStop(0, '#0c0400');
  bgGradient.addColorStop(0.5, '#170900');
  bgGradient.addColorStop(1, '#0a0300');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, w, h);

  const aura = ctx.createRadialGradient(w * 0.65, h * 0.5, 30, w * 0.65, h * 0.5, 420);
  aura.addColorStop(0, 'rgba(249, 115, 22, 0.10)');
  aura.addColorStop(1, 'rgba(249, 115, 22, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.055;
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1;
  const cx = w * 0.15, cy = h * 0.5;
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * w * 2, cy + Math.sin(angle) * h * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#f97316';
  for (let i = 0; i < w; i += 20) {
    for (let j = 0; j < h; j += 20) {
      ctx.beginPath();
      ctx.arc(i, j, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(190, 0);
  ctx.lineTo(0, 190);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - 190, h);
  ctx.lineTo(w, h - 190);
  ctx.fill();

  ctx.shadowBlur = 25;
  ctx.shadowColor = '#f97316';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 88);
  ctx.lineTo(w - 50, 88);
  ctx.stroke();

  const photoX = 62, photoY = 125, photoW = 252, photoH = 335;
  ctx.fillStyle = '#0a0200';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawOrangeCorners = (x: number, y: number, pw: number, ph: number) => {
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#f97316';
    const len = 32;
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + pw - len, y); ctx.lineTo(x + pw, y); ctx.lineTo(x + pw, y + len);
    ctx.moveTo(x, y + ph - len); ctx.lineTo(x, y + ph); ctx.lineTo(x + len, y + ph);
    ctx.moveTo(x + pw - len, y + ph); ctx.lineTo(x + pw, y + ph); ctx.lineTo(x + pw, y + ph - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      drawOrangeCorners(photoX, photoY, photoW, photoH);
    };
  } else {
    drawOrangeCorners(photoX, photoY, photoW, photoH);
  }

  ctx.textAlign = 'left';
  const startX = 362;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f97316';
    ctx.fillText(`▸ ${label}`, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#f97316';
    ctx.fillText(value.toUpperCase(), x, y + 30);
    ctx.shadowBlur = 0;
  };

  drawField('COMBATTANT', `${formData.nom} ${formData.prenom}`, startX, 152);
  drawField('ORIGINE', formData.nationalite, startX, 228);
  drawField('ID NO.', formData.noCarte, startX + 295, 228, 19);

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#f97316';
  ctx.fillText('▸ NIVEAU DE PUISSANCE / KI', startX, 308);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#1a0800';
  ctx.beginPath();
  ctx.roundRect(startX, 318, barWidth, 18, 4);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.5, '#f97316');
    grad.addColorStop(1, '#ef4444');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#f97316';
    ctx.roundRect(startX, 318, (barWidth * power) / 100, 18, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'right';
  ctx.fillText(`${power} / 100`, startX + barWidth, 315);
  ctx.textAlign = 'left';

  drawField('RANG', formData.classe, startX, 385);
  drawField('TECHNIQUE SIGNATURE', formData.expertise, startX, 460, 22);

  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#0a0200';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#f97316', light: '#0a0200' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // Mini info strip under photo
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#f97316';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#f97316';
    ctx.fillText(value.toUpperCase(), x, y + 16);
    ctx.shadowBlur = 0;
  };
  drawMiniField('▸ NAISSANCE', formData.dateNaissance, 70, 478);
  drawMiniField('▸ SEXE', formData.sexe, 215, 478);
  drawMiniField('▸ EXPIRATION', formData.dateExpiration, 70, 513);
  drawMiniField('▸ MEMBRE DEP.', formData.membreDepuis, 215, 513);

  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(40, 575, w - 80, 45);
  ctx.fillStyle = '#f97316';
  ctx.font = '19px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(formData.mrzLine, 60, 604);
}
