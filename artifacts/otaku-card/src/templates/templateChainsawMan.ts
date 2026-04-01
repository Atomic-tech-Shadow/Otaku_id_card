import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

function drawBloodSplatter(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#8b0000';
  // Main blob
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  // Drips
  const drips = [[0.3, 1.8, 0.35], [-0.5, 1.6, 0.28], [0.7, 1.4, 0.22], [-0.2, 2.0, 0.18]];
  for (const [dx, dy, dr] of drips) {
    ctx.beginPath();
    ctx.arc(cx + dx * r, cy + dy * r, dr * r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + dx * r * 0.5, cy + r * 0.8);
    ctx.lineTo(cx + dx * r, cy + dy * r);
    ctx.lineWidth = dr * r * 1.5;
    ctx.strokeStyle = '#8b0000';
    ctx.stroke();
  }
  ctx.restore();
}

function drawChainsawChain(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const steps = Math.floor(len / 14);
  const dx = (x2 - x1) / steps;
  const dy = (y2 - y1) / steps;
  for (let i = 0; i < steps; i++) {
    const x = x1 + dx * i;
    const y = y1 + dy * i;
    ctx.fillStyle = i % 2 === 0 ? '#444444' : '#222222';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 0.5;
    ctx.fillRect(x - 4, y - 3, 10, 6);
    ctx.strokeRect(x - 4, y - 3, 10, 6);
  }
  ctx.restore();
}

export function renderChainsawMan(
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
  bgGrad.addColorStop(0, '#080404');
  bgGrad.addColorStop(0.5, '#0d0505');
  bgGrad.addColorStop(1, '#060303');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Dark red seeping glow
  const glow1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, 400);
  glow1.addColorStop(0, 'rgba(140, 0, 0, 0.18)');
  glow1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow1; ctx.fillRect(0, 0, w, h);

  const glow2 = ctx.createRadialGradient(w * 0.8, h * 0.7, 0, w * 0.8, h * 0.7, 350);
  glow2.addColorStop(0, 'rgba(100, 0, 0, 0.14)');
  glow2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow2; ctx.fillRect(0, 0, w, h);

  // ── BLOOD SPLATTERS ──────────────────────────────────────────
  drawBloodSplatter(ctx, 920, 80, 18, 0.20);
  drawBloodSplatter(ctx, 880, 140, 10, 0.14);
  drawBloodSplatter(ctx, 960, 200, 8, 0.12);
  drawBloodSplatter(ctx, 30, 560, 14, 0.16);
  drawBloodSplatter(ctx, 70, 520, 9, 0.12);
  drawBloodSplatter(ctx, 720, 580, 12, 0.14);
  drawBloodSplatter(ctx, w * 0.55, h * 0.45, 70, 0.03);

  // ── CHAINSAW CHAINS ──────────────────────────────────────────
  drawChainsawChain(ctx, 0, 96, w, 96, 0.18);
  drawChainsawChain(ctx, 0, 571, w, 571, 0.15);

  // ── CRACK LINES ──────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#aa0000';
  ctx.lineWidth = 1;
  const cracks = [[0, 180, 120, 380], [w, 120, w - 140, 340], [200, 0, 320, 160], [w - 180, h, w - 60, h - 200]];
  for (const [x1, y1, x2, y2] of cracks) {
    ctx.beginPath(); ctx.moveTo(x1, y1);
    const mx = (x1 + x2) / 2 + 20; const my = (y1 + y2) / 2 - 20;
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.stroke();
  }
  ctx.restore();

  // ── GOVERNMENT STAMP WATERMARK ────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#cc0000';
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.textAlign = 'left';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 5; col++) {
      ctx.fillText('PUBLIC SAFETY DEVIL HUNTERS', col * 220 - 40, row * 80 + 60);
    }
  }
  ctx.restore();

  // ── CORNER MARKS ─────────────────────────────────────────────
  [[8, 8, 1, 1], [w - 8, 8, -1, 1], [8, h - 8, 1, -1], [w - 8, h - 8, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    ctx.strokeStyle = '#aa0000'; ctx.lineWidth = 2.5;
    ctx.shadowBlur = 8; ctx.shadowColor = '#ff000066';
    ctx.beginPath();
    ctx.moveTo(cx + dx * 22, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * 22);
    ctx.stroke(); ctx.shadowBlur = 0;
  });

  // ── TITLE ─────────────────────────────────────────────────────
  ctx.save();
  ctx.shadowBlur = 18; ctx.shadowColor = '#cc0000';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Overstrike effect on title
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#cc0000';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2 + 2, 70);
  ctx.restore();

  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#2a0000';
  ctx.textAlign = 'right';
  ctx.fillText('公安 — DÉPARTEMENT SÉCURITÉ PUBLIQUE — CHASSEUR DE DÉMONS', w - 28, 18);

  ctx.strokeStyle = '#aa0000'; ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.5; ctx.shadowBlur = 8; ctx.shadowColor = '#cc0000';
  ctx.beginPath(); ctx.moveTo(50, 88); ctx.lineTo(w - 50, 88); ctx.stroke();
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;

  // ── PHOTO ZONE ───────────────────────────────────────────────
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#080404'; ctx.fillRect(photoX, photoY, photoW, photoH);

  // Subtle red inner glow on photo zone
  const photoGlow = ctx.createRadialGradient(photoX + photoW / 2, photoY + photoH, 0, photoX + photoW / 2, photoY + photoH, photoH);
  photoGlow.addColorStop(0, 'rgba(140, 0, 0, 0.15)');
  photoGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = photoGlow; ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawFrame = () => {
    const len = 24;
    ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12; ctx.shadowColor = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
    ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
    ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
    ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#660000'; ctx.lineWidth = 0.8;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => { ctx.drawImage(img, photoX, photoY, photoW, photoH); drawFrame(); };
  } else { drawFrame(); }

  // Slash marks on photo
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(photoX + 10, photoY + 30); ctx.lineTo(photoX + 60, photoY + 10);
  ctx.moveTo(photoX + 20, photoY + 50); ctx.lineTo(photoX + 80, photoY + 25);
  ctx.stroke();
  ctx.restore();

  // ── DATA FIELDS ───────────────────────────────────────────────
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#882222';
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#f0d8d8';
    ctx.shadowBlur = 3; ctx.shadowColor = '#cc000033';
    ctx.fillText(value.toUpperCase(), x, y + 30); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#660000'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(x, y + 38); ctx.lineTo(x + 590, y + 38); ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#882222';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#f0d8d8';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. CONTRAT', formData.noCarte, startX + 315, 263);

  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillStyle = '#882222';
  ctx.fillText('NIVEAU DE MENACE / INDICE DÉMON', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));
  ctx.fillStyle = '#080404'; ctx.strokeStyle = '#220000'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(startX, 332, barWidth, 16, 3); ctx.fill(); ctx.stroke();

  if (power > 0) {
    const bg = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    bg.addColorStop(0, '#440000');
    bg.addColorStop(0.5, '#990000');
    bg.addColorStop(0.85, '#cc2200');
    bg.addColorStop(1, '#ff3300');
    ctx.fillStyle = bg;
    ctx.shadowBlur = 14; ctx.shadowColor = '#cc0000';
    ctx.beginPath(); ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3); ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (power >= 95) {
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillStyle = '#ff2200';
    ctx.shadowBlur = 14; ctx.shadowColor = '#ff0000';
    ctx.textAlign = 'right';
    ctx.fillText('— CHAINSAW —', startX + barWidth, 328);
    ctx.textAlign = 'left'; ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // ── QR CODE ──────────────────────────────────────────────────
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#080404'; ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#aa0000'; ctx.lineWidth = 2;
  ctx.shadowBlur = 8; ctx.shadowColor = '#cc0000';
  ctx.strokeRect(qrX, qrY, qrSize, qrSize); ctx.shadowBlur = 0;
  // Chainsaw chain top of QR
  drawChainsawChain(ctx, qrX, qrY - 10, qrX + qrSize, qrY - 10, 0.65);
  // Blood splatter corner QR
  drawBloodSplatter(ctx, qrX + qrSize - 8, qrY + 8, 8, 0.45);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#cc4444', light: '#080404' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#aa0000'; ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6; ctx.shadowColor = '#cc0000';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize); ctx.shadowBlur = 0;
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ── MINI FIELDS ──────────────────────────────────────────────
  const drawMini = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#661111';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ddbbbb';
    ctx.fillText(value.toUpperCase(), x, y + 16);
  };
  drawMini('[ NAISSANCE ]', formData.dateNaissance, 70, 470);
  drawMini('[ SEXE ]', formData.sexe, 215, 470);
  drawMini('[ EXPIRATION ]', formData.dateExpiration, 70, 505);
  drawMini('[ MEMBRE DEP. ]', formData.membreDepuis, 215, 505);

  // ── MRZ ──────────────────────────────────────────────────────
  const { line2: mrzLine } = generateMRZ(formData);
  ctx.fillStyle = 'rgba(0,0,0,0.95)'; ctx.fillRect(40, 577, w - 80, 43);
  ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 6; ctx.shadowColor = '#ff0000';
  ctx.beginPath(); ctx.moveTo(40, 577); ctx.lineTo(40 + (w - 80), 577); ctx.stroke();
  ctx.shadowBlur = 0;
  drawChainsawChain(ctx, 40, 577, 40 + (w - 80), 577, 0.12);
  ctx.fillStyle = '#cc6666';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  ctx.restore();
}
