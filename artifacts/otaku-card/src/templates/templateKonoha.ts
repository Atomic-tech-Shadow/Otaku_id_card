import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

function drawLeafSpiral(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#e85c00';
  ctx.lineWidth = 1.5;

  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Spiral inside
  ctx.beginPath();
  for (let i = 0; i <= 360 * 3; i += 2) {
    const angle = (i * Math.PI) / 180;
    const radius = (r * 0.85 * i) / (360 * 3);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Small dot center
  ctx.fillStyle = '#e85c00';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function renderKonoha(
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
  bgGrad.addColorStop(0, '#0d0a06');
  bgGrad.addColorStop(0.5, '#120e08');
  bgGrad.addColorStop(1, '#0a0c0d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Orange warm glow top center
  const glow1 = ctx.createRadialGradient(w / 2, -60, 0, w / 2, -60, 500);
  glow1.addColorStop(0, 'rgba(220, 80, 0, 0.18)');
  glow1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, w, h);

  // Dark red glow bottom right
  const glow2 = ctx.createRadialGradient(w, h, 0, w, h, 400);
  glow2.addColorStop(0, 'rgba(180, 30, 0, 0.14)');
  glow2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

  // ── BIG SPIRAL WATERMARK ─────────────────────────────────────
  drawLeafSpiral(ctx, w * 0.62, h * 0.5, 160, 0.05);
  drawLeafSpiral(ctx, 40, 40, 55, 0.07);
  drawLeafSpiral(ctx, w - 60, h - 60, 50, 0.06);

  // ── HORIZONTAL SCRATCH LINES ──────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = '#ff6600';
  ctx.lineWidth = 0.6;
  for (let y = 0; y < h; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // ── CORNER MARKS ─────────────────────────────────────────────
  [[8, 8, 1, 1], [w - 8, 8, -1, 1], [8, h - 8, 1, -1], [w - 8, h - 8, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    ctx.strokeStyle = '#e85c00';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff6600';
    ctx.beginPath();
    ctx.moveTo(cx + dx * 22, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * 22);
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  // ── PARTICLES ────────────────────────────────────────────────
  [[90,30,1.2,0.5,'#ff6600'],[220,18,0.9,0.4,'#ff8800'],[400,36,1.1,0.45,'#ff6600'],
   [620,20,1.0,0.5,'#ff8800'],[800,34,1.2,0.45,'#ff6600'],[960,22,0.8,0.4,'#ff8800'],
   [44,180,0.9,0.4,'#ff6600'],[30,400,1.0,0.4,'#ff8800'],[988,300,0.8,0.38,'#ff6600']
  ].forEach(([px,py,pr,pa,col]) => {
    ctx.globalAlpha = pa as number;
    ctx.fillStyle = col as string;
    ctx.beginPath(); ctx.arc(px as number, py as number, pr as number, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;

  // ── TITLE ─────────────────────────────────────────────────────
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#e85c00';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Subtitle top right
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#3d1a00';
  ctx.textAlign = 'right';
  ctx.fillText('木ノ葉隠れの里 — REGISTRE DES SHINOBI', w - 28, 18);

  // Separator
  const sepG = ctx.createLinearGradient(50, 0, w - 50, 0);
  sepG.addColorStop(0, 'transparent');
  sepG.addColorStop(0.3, '#e85c00');
  sepG.addColorStop(0.7, '#ff8800');
  sepG.addColorStop(1, 'transparent');
  ctx.strokeStyle = sepG;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#e85c00';
  ctx.beginPath();
  ctx.moveTo(50, 88); ctx.lineTo(w - 50, 88);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // ── PHOTO ZONE ───────────────────────────────────────────────
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#0d0804';
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.strokeStyle = '#1a0d00';
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.55;
  ctx.strokeRect(photoX + 3, photoY + 3, photoW - 6, photoH - 6);
  ctx.globalAlpha = 1;

  const drawFrame = () => {
    const len = 24;
    ctx.strokeStyle = '#e85c00';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff6600';
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
    ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
    ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
    ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#e85c0044';
    ctx.lineWidth = 1;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => { ctx.drawImage(img, photoX, photoY, photoW, photoH); drawFrame(); };
  } else { drawFrame(); }

  // ── DATA FIELDS ───────────────────────────────────────────────
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#994400';
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#f5e6d0';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#ff660033';
    ctx.fillText(value.toUpperCase(), x, y + 30);
    ctx.shadowBlur = 0;
    const lg = ctx.createLinearGradient(x, 0, x + 590, 0);
    lg.addColorStop(0, '#e85c0055'); lg.addColorStop(1, 'transparent');
    ctx.strokeStyle = lg; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(x, y + 38); ctx.lineTo(x + 590, y + 38); ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#994400';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#f5e6d0';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO / NOM DE CODE', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 315, 263);

  // Power bar
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillStyle = '#994400';
  ctx.fillText('NIVEAU DE CHAKRA', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));
  ctx.fillStyle = '#0d0804'; ctx.strokeStyle = '#1a0d00'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(startX, 332, barWidth, 16, 3); ctx.fill(); ctx.stroke();

  if (power > 0) {
    const bg = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    bg.addColorStop(0, '#cc3300'); bg.addColorStop(0.5, '#e85c00'); bg.addColorStop(1, '#ff9900');
    ctx.fillStyle = bg;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#e85c00';
    ctx.beginPath(); ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3); ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // ── QR CODE ──────────────────────────────────────────────────
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#0a0600'; ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#e85c00'; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8; ctx.shadowColor = '#ff6600';
  ctx.strokeRect(qrX, qrY, qrSize, qrSize); ctx.shadowBlur = 0;

  // Spiral emblem above QR
  drawLeafSpiral(ctx, qrX + qrSize / 2, qrY - 22, 14, 0.6);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#e85c00', light: '#0a0600' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#e85c00'; ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6; ctx.shadowColor = '#ff6600';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize); ctx.shadowBlur = 0;
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ── MINI FIELDS ──────────────────────────────────────────────
  const drawMini = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#994400';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#f5d0a0';
    ctx.fillText(value.toUpperCase(), x, y + 16);
  };
  drawMini('[ NAISSANCE ]', formData.dateNaissance, 70, 470);
  drawMini('[ SEXE ]', formData.sexe, 215, 470);
  drawMini('[ EXPIRATION ]', formData.dateExpiration, 70, 505);
  drawMini('[ MEMBRE DEP. ]', formData.membreDepuis, 215, 505);

  // ── MRZ ──────────────────────────────────────────────────────
  const { line2: mrzLine } = generateMRZ(formData);
  ctx.fillStyle = 'rgba(0,0,0,0.92)';
  ctx.fillRect(40, 577, w - 80, 43);
  const mrzG = ctx.createLinearGradient(40, 0, 40 + (w - 80), 0);
  mrzG.addColorStop(0, 'transparent'); mrzG.addColorStop(0.25, '#e85c00');
  mrzG.addColorStop(0.75, '#ff9900'); mrzG.addColorStop(1, 'transparent');
  ctx.strokeStyle = mrzG; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 5; ctx.shadowColor = '#e85c00';
  ctx.beginPath(); ctx.moveTo(40, 577); ctx.lineTo(40 + (w - 80), 577); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffaa44';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  ctx.restore();
}
