import QRCode from 'qrcode';
import { FormData } from '../types';

export function renderMugiwara(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Deep ocean background
  const bgGradient = ctx.createLinearGradient(0, 0, w, h);
  bgGradient.addColorStop(0, '#020b18');
  bgGradient.addColorStop(0.5, '#061228');
  bgGradient.addColorStop(1, '#020b18');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, w, h);

  // Ocean depth glow
  const oceanGlow = ctx.createRadialGradient(w * 0.5, h * 0.65, 0, w * 0.5, h * 0.65, 480);
  oceanGlow.addColorStop(0, 'rgba(6, 25, 70, 0.55)');
  oceanGlow.addColorStop(1, 'rgba(6, 25, 70, 0)');
  ctx.fillStyle = oceanGlow;
  ctx.fillRect(0, 0, w, h);

  // Wave texture
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 1.5;
  for (let wave = 0; wave < 9; wave++) {
    const baseY = 50 + wave * 75;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = baseY + Math.sin((x / w) * Math.PI * 9 + wave * 0.6) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Gold particle field
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < w; i += 20) {
    for (let j = 0; j < h; j += 20) {
      ctx.beginPath();
      ctx.arc(i, j, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Red corner triangles (pirate flag)
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(170, 0); ctx.lineTo(0, 170);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w, h); ctx.lineTo(w - 170, h); ctx.lineTo(w, h - 170);
  ctx.fill();

  // Gold corner accents
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(55, 0); ctx.lineTo(0, 55);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w, h); ctx.lineTo(w - 55, h); ctx.lineTo(w, h - 55);
  ctx.fill();

  // Anchor icon top-left corner
  ctx.save();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#fbbf24';
  ctx.lineCap = 'round';
  // Vertical bar
  ctx.beginPath();
  ctx.moveTo(26, 10); ctx.lineTo(26, 40);
  // Crossbar
  ctx.moveTo(16, 18); ctx.lineTo(36, 18);
  // Circle top
  ctx.arc(26, 12, 4, 0, Math.PI * 2);
  // Left curve
  ctx.moveTo(16, 40); ctx.bezierCurveTo(16, 50, 26, 50, 26, 40);
  // Right curve
  ctx.moveTo(36, 40); ctx.bezierCurveTo(36, 50, 26, 50, 26, 40);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // MUGIWARA watermark
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'right';
  ctx.fillText('MUGIWARA — 麦わら海賊団', w - 28, 18);

  // Title
  ctx.shadowBlur = 22;
  ctx.shadowColor = '#fbbf24';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;

  // Gold separator
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.moveTo(50, 88); ctx.lineTo(w - 50, 88);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Photo zone
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#020b18';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawPirateCorners = (x: number, y: number, pw: number, ph: number) => {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fbbf24';
    const len = 28;
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + pw - len, y); ctx.lineTo(x + pw, y); ctx.lineTo(x + pw, y + len);
    ctx.moveTo(x, y + ph - len); ctx.lineTo(x, y + ph); ctx.lineTo(x + len, y + ph);
    ctx.moveTo(x + pw - len, y + ph); ctx.lineTo(x + pw, y + ph); ctx.lineTo(x + pw, y + ph - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.strokeRect(x + 4, y + 4, pw - 8, ph - 8);
    ctx.globalAlpha = 1;
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      drawPirateCorners(photoX, photoY, photoW, photoH);
    };
  } else {
    drawPirateCorners(photoX, photoY, photoW, photoH);
  }

  // Data fields
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`⚓ ${label}`, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#f8fafc';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#fbbf24';
    ctx.fillText(value.toUpperCase(), x, y + 30);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#0f2a4a';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(x, y + 38); ctx.lineTo(x + 540, y + 38);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`⚓ ${label}`, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 315, 263);

  // Power bar
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('⚓ NIVEAU DE PUISSANCE', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#050d18';
  ctx.beginPath();
  ctx.roundRect(startX, 332, barWidth, 16, 3);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#dc2626');
    grad.addColorStop(0.5, '#f97316');
    grad.addColorStop(1, '#fbbf24');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#fbbf24';
    ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // "KING OF PIRATES" à 100
  if (power >= 100) {
    ctx.font = 'italic bold 13px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#fbbf24';
    ctx.textAlign = 'right';
    ctx.fillText('KING OF PIRATES 👑', startX + barWidth, 329);
    ctx.textAlign = 'left';
    ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // QR Code
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#020b18';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#fbbf24';
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  ctx.shadowBlur = 0;

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#fbbf24', light: '#020b18' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // Mini info strip under photo
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#fbbf24';
    ctx.fillText(value.toUpperCase(), x, y + 16);
    ctx.shadowBlur = 0;
  };

  drawMiniField('⚓ NAISSANCE', formData.dateNaissance, 70, 470);
  drawMiniField('⚓ SEXE', formData.sexe, 215, 470);
  drawMiniField('⚓ EXPIRATION', formData.dateExpiration, 70, 505);
  drawMiniField('⚓ MEMBRE DEP.', formData.membreDepuis, 215, 505);

  // MRZ band
  ctx.fillStyle = 'rgba(0,0,0,0.88)';
  ctx.fillRect(40, 577, w - 80, 43);
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.strokeRect(40, 577, w - 80, 43);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fbbf24';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(formData.mrzLine, 60, 604);
}
