import QRCode from 'qrcode';
import { FormData } from '../types';

export function renderDemon(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const bgGradient = ctx.createLinearGradient(0, 0, w, h);
  bgGradient.addColorStop(0, '#050008');
  bgGradient.addColorStop(0.5, '#0b0012');
  bgGradient.addColorStop(1, '#040006');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, w, h);

  const vigLeft = ctx.createRadialGradient(0, h / 2, 0, 0, h / 2, 320);
  vigLeft.addColorStop(0, 'rgba(127, 29, 29, 0.35)');
  vigLeft.addColorStop(1, 'rgba(127, 29, 29, 0)');
  ctx.fillStyle = vigLeft;
  ctx.fillRect(0, 0, w, h);

  const vigRight = ctx.createRadialGradient(w, h / 2, 0, w, h / 2, 320);
  vigRight.addColorStop(0, 'rgba(127, 29, 29, 0.35)');
  vigRight.addColorStop(1, 'rgba(127, 29, 29, 0)');
  ctx.fillStyle = vigRight;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 1.5;
  for (let wave = 0; wave < 6; wave++) {
    const baseY = 100 + wave * 90;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = baseY + Math.sin((x / w) * Math.PI * 7 + wave * 0.8) * 18;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#7c3aed';
  for (let i = 0; i < w; i += 18) {
    for (let j = 0; j < h; j += 18) {
      ctx.beginPath();
      ctx.arc(i, j, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(170, 0);
  ctx.lineTo(0, 170);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - 170, h);
  ctx.lineTo(w, h - 170);
  ctx.fill();

  ctx.shadowBlur = 22;
  ctx.shadowColor = '#be123c';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(50, 93);
  ctx.lineTo(w - 50, 93);
  ctx.stroke();

  const photoX = 65, photoY = 128, photoW = 254, photoH = 332;
  ctx.fillStyle = '#030005';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawDemonCorners = (x: number, y: number, pw: number, ph: number) => {
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#be123c';
    const len = 28;
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
      drawDemonCorners(photoX, photoY, photoW, photoH);
    };
  } else {
    drawDemonCorners(photoX, photoY, photoW, photoH);
  }

  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#be123c';
    ctx.fillText(`⟦ ${label} ⟧`, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(value.toUpperCase(), x, y + 30);
  };

  drawField('CHASSEUR', `${formData.nom} ${formData.prenom}`, startX, 152);
  drawField('ORIGINE', formData.nationalite, startX, 228);
  drawField('MATRICULE', formData.noCarte, startX + 295, 228, 19);

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#be123c';
  ctx.fillText('⟦ NIVEAU DE PUISSANCE ⟧', startX, 308);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#0d0010';
  ctx.beginPath();
  ctx.roundRect(startX, 318, barWidth, 16, 3);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#4c1d95');
    grad.addColorStop(0.5, '#991b1b');
    grad.addColorStop(1, '#be123c');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.roundRect(startX, 318, (barWidth * power) / 100, 16, 3);
    ctx.fill();
  }

  drawField('RANG', formData.classe, startX, 383);
  drawField('RESPIRATION', formData.expertise, startX, 458, 22);

  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#050008';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#be123c', light: '#050008' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // Mini info strip under photo
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#be123c';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(value.toUpperCase(), x, y + 16);
  };
  drawMiniField('⟦ NAISSANCE ⟧', formData.dateNaissance, 70, 478);
  drawMiniField('⟦ SEXE ⟧', formData.sexe, 215, 478);
  drawMiniField('⟦ EXPIRATION ⟧', formData.dateExpiration, 70, 513);
  drawMiniField('⟦ MEMBRE DEP. ⟧', formData.membreDepuis, 215, 513);

  ctx.fillStyle = 'rgba(0,0,0,0.70)';
  ctx.fillRect(40, 575, w - 80, 45);
  ctx.fillStyle = '#be123c';
  ctx.font = '19px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(formData.mrzLine, 60, 604);
}
