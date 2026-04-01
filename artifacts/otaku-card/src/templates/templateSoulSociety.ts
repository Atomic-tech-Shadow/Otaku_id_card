import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

function drawSoulSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#c0c0c0';
  ctx.lineWidth = 1.2;
  // Outer octagon
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 8;
    i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
            : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath(); ctx.stroke();
  // Inner circle
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2); ctx.stroke();
  // Cross
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, cy); ctx.lineTo(cx + r * 0.45, cy);
  ctx.moveTo(cx, cy - r * 0.45); ctx.lineTo(cx, cy + r * 0.45);
  ctx.stroke();
  // Diagonal lines
  ctx.globalAlpha = alpha * 0.5;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.65 * Math.cos(a), cy + r * 0.65 * Math.sin(a));
    ctx.lineTo(cx + r * Math.cos(a - Math.PI / 8), cy + r * Math.sin(a - Math.PI / 8));
    ctx.stroke();
  }
  ctx.restore();
}

export function renderSoulSociety(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 18);
  ctx.clip();

  // ── BACKGROUND ───────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#06080a');
  bgGrad.addColorStop(0.5, '#090b0e');
  bgGrad.addColorStop(1, '#05080a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle white top glow
  const glow1 = ctx.createRadialGradient(w / 2, -80, 0, w / 2, -80, 500);
  glow1.addColorStop(0, 'rgba(200, 200, 220, 0.10)');
  glow1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow1; ctx.fillRect(0, 0, w, h);

  // Red accent glow bottom right
  const glow2 = ctx.createRadialGradient(w, h, 0, w, h, 380);
  glow2.addColorStop(0, 'rgba(160, 0, 0, 0.12)');
  glow2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow2; ctx.fillRect(0, 0, w, h);

  // ── SOUL SEAL WATERMARKS ─────────────────────────────────────
  drawSoulSeal(ctx, w * 0.62, h * 0.5, 150, 0.05);
  drawSoulSeal(ctx, 48, 48, 52, 0.08);
  drawSoulSeal(ctx, w - 60, h - 60, 48, 0.07);

  // ── CALLIGRAPHY KANJI WATERMARK ───────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 280px serif';
  ctx.textAlign = 'center';
  ctx.fillText('魂', w * 0.62, h * 0.72);
  ctx.restore();

  // ── FINE GRID ────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.strokeStyle = '#8888aa';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < w; i += 30) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
  }
  for (let j = 0; j < h; j += 30) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
  }
  ctx.restore();

  // ── CORNER MARKS ─────────────────────────────────────────────
  [[8, 8, 1, 1], [w - 8, 8, -1, 1], [8, h - 8, 1, -1], [w - 8, h - 8, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 2;
    ctx.shadowBlur = 6; ctx.shadowColor = '#ffffff44';
    ctx.beginPath();
    ctx.moveTo(cx + dx * 22, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * 22);
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#aa000055'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx + dx * 22, cy + dy * 5); ctx.lineTo(cx + dx * 5, cy + dy * 22);
    ctx.stroke();
  });

  // ── TITLE ─────────────────────────────────────────────────────
  ctx.save();
  ctx.shadowBlur = 14; ctx.shadowColor = '#ffffff44';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#2a2a3a';
  ctx.textAlign = 'right';
  ctx.fillText('尸魂界 — SOUL SOCIETY — REGISTRE OFFICIEL', w - 28, 18);

  const sepG = ctx.createLinearGradient(50, 0, w - 50, 0);
  sepG.addColorStop(0, 'transparent');
  sepG.addColorStop(0.3, '#888888');
  sepG.addColorStop(0.5, '#cc0000');
  sepG.addColorStop(0.7, '#888888');
  sepG.addColorStop(1, 'transparent');
  ctx.strokeStyle = sepG; ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.55;
  ctx.beginPath(); ctx.moveTo(50, 88); ctx.lineTo(w - 50, 88); ctx.stroke();
  ctx.globalAlpha = 1;

  // ── PHOTO ZONE ───────────────────────────────────────────────
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#08090c'; ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawFrame = () => {
    const len = 24;
    ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 2;
    ctx.shadowBlur = 8; ctx.shadowColor = '#ffffff33';
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
    ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
    ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
    ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
    ctx.stroke(); ctx.shadowBlur = 0;
    // Red inner line
    ctx.strokeStyle = '#cc000055'; ctx.lineWidth = 0.8;
    ctx.strokeRect(photoX + 6, photoY + 6, photoW - 12, photoH - 12);
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => { ctx.drawImage(img, photoX, photoY, photoW, photoH); drawFrame(); };
  } else { drawFrame(); }

  // Division seal on photo
  drawSoulSeal(ctx, photoX + photoW - 28, photoY + photoH - 28, 20, 0.5);

  // ── DATA FIELDS ───────────────────────────────────────────────
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#666688';
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#e8e8f0';
    ctx.shadowBlur = 3; ctx.shadowColor = '#ffffff22';
    ctx.fillText(value.toUpperCase(), x, y + 30); ctx.shadowBlur = 0;
    const lg = ctx.createLinearGradient(x, 0, x + 590, 0);
    lg.addColorStop(0, '#cc000033'); lg.addColorStop(0.5, '#88888833'); lg.addColorStop(1, 'transparent');
    ctx.strokeStyle = lg; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(x, y + 38); ctx.lineTo(x + 590, y + 38); ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#666688';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#e8e8f0';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 315, 263);

  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillStyle = '#666688';
  ctx.fillText('REIATSU / PRESSION SPIRITUELLE', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));
  ctx.fillStyle = '#08090c'; ctx.strokeStyle = '#1a1a22'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(startX, 332, barWidth, 16, 3); ctx.fill(); ctx.stroke();

  if (power > 0) {
    const bg = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    bg.addColorStop(0, '#220022'); bg.addColorStop(0.4, '#660066');
    bg.addColorStop(0.75, '#aaaacc'); bg.addColorStop(1, '#ffffff');
    ctx.fillStyle = bg;
    ctx.shadowBlur = 12; ctx.shadowColor = '#aaaacc55';
    ctx.beginPath(); ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3); ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (power >= 95) {
    ctx.font = 'italic bold 12px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 14; ctx.shadowColor = '#cc0000';
    ctx.textAlign = 'right';
    ctx.fillText('— BANKAI —', startX + barWidth, 328);
    ctx.textAlign = 'left'; ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // ── QR CODE ──────────────────────────────────────────────────
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#08090c'; ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#888888'; ctx.lineWidth = 1;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  drawSoulSeal(ctx, qrX + qrSize / 2, qrY - 20, 14, 0.7);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#ccccdd', light: '#08090c' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#888888'; ctx.lineWidth = 1;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ── MINI FIELDS ──────────────────────────────────────────────
  const drawMini = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#555577';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#c8c8d8';
    ctx.fillText(value.toUpperCase(), x, y + 16);
  };
  drawMini('[ NAISSANCE ]', formData.dateNaissance, 70, 470);
  drawMini('[ SEXE ]', formData.sexe, 215, 470);
  drawMini('[ EXPIRATION ]', formData.dateExpiration, 70, 505);
  drawMini('[ MEMBRE DEP. ]', formData.membreDepuis, 215, 505);

  // ── MRZ ──────────────────────────────────────────────────────
  const { line2: mrzLine } = generateMRZ(formData);
  ctx.fillStyle = 'rgba(0,0,0,0.95)'; ctx.fillRect(40, 577, w - 80, 43);
  const mrzG = ctx.createLinearGradient(40, 0, 40 + (w - 80), 0);
  mrzG.addColorStop(0, 'transparent'); mrzG.addColorStop(0.3, '#cc0000');
  mrzG.addColorStop(0.7, '#888888'); mrzG.addColorStop(1, 'transparent');
  ctx.strokeStyle = mrzG; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 4; ctx.shadowColor = '#cc000088';
  ctx.beginPath(); ctx.moveTo(40, 577); ctx.lineTo(40 + (w - 80), 577); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#c8c8dd';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  ctx.restore();
}
