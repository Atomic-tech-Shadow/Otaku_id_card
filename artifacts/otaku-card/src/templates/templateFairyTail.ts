import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

function drawFairyWing(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, alpha: number, flip = false) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#e8a020';
  ctx.fillStyle = '#e8a02015';
  ctx.lineWidth = 1.2;
  const s = flip ? -1 : 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx + s * size * 0.8, cy - size * 0.6, cx + s * size * 1.2, cy - size * 0.9, cx + s * size * 0.6, cy - size * 1.1);
  ctx.bezierCurveTo(cx + s * size * 0.1, cy - size * 0.9, cx + s * size * 0.3, cy - size * 0.4, cx, cy);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx + s * size * 0.6, cy + size * 0.2, cx + s * size * 1.0, cy + size * 0.1, cx + s * size * 0.7, cy - size * 0.3);
  ctx.bezierCurveTo(cx + s * size * 0.3, cy - size * 0.15, cx + s * size * 0.2, cy + size * 0.1, cx, cy);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

export function renderFairyTail(
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
  bgGrad.addColorStop(0, '#0d080e');
  bgGrad.addColorStop(0.5, '#120a0e');
  bgGrad.addColorStop(1, '#0a080d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Warm red glow top
  const glow1 = ctx.createRadialGradient(w * 0.4, -60, 0, w * 0.4, -60, 500);
  glow1.addColorStop(0, 'rgba(200, 40, 40, 0.18)');
  glow1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow1; ctx.fillRect(0, 0, w, h);

  // Blue glow right
  const glow2 = ctx.createRadialGradient(w, h * 0.4, 0, w, h * 0.4, 400);
  glow2.addColorStop(0, 'rgba(30, 80, 180, 0.15)');
  glow2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow2; ctx.fillRect(0, 0, w, h);

  // Gold glow bottom left
  const glow3 = ctx.createRadialGradient(0, h, 0, 0, h, 300);
  glow3.addColorStop(0, 'rgba(220, 160, 30, 0.12)');
  glow3.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow3; ctx.fillRect(0, 0, w, h);

  // ── FAIRY WING WATERMARKS ─────────────────────────────────────
  drawFairyWing(ctx, w * 0.6, h * 0.5, 120, 0.04);
  drawFairyWing(ctx, w * 0.6, h * 0.5, 120, 0.04, true);
  drawFairyWing(ctx, 80, 80, 45, 0.07);
  drawFairyWing(ctx, 80, 80, 45, 0.07, true);

  // ── STAR PARTICLES ───────────────────────────────────────────
  const stars = [
    [120, 25, 1.5, '#e8a020'], [280, 15, 1.0, '#5588ff'], [450, 30, 1.2, '#e8a020'],
    [650, 18, 0.9, '#ff6060'], [820, 28, 1.3, '#e8a020'], [960, 14, 0.8, '#5588ff'],
    [40, 160, 1.0, '#ff6060'], [995, 320, 0.9, '#e8a020'], [25, 480, 1.1, '#5588ff'],
    [200, 35, 0.8, '#ffffff'], [500, 12, 0.6, '#ffffff'], [750, 40, 0.7, '#ffffff'],
  ];
  for (const [px, py, pr, col] of stars) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = col as string;
    ctx.beginPath(); ctx.arc(px as number, py as number, pr as number, 0, Math.PI * 2); ctx.fill();
    // Star glow
    ctx.globalAlpha = 0.15;
    ctx.beginPath(); ctx.arc(px as number, py as number, (pr as number) * 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── CORNER MARKS ─────────────────────────────────────────────
  const cornerColors = ['#e82020', '#5588ff', '#e82020', '#e8a020'];
  [[8, 8, 1, 1], [w - 8, 8, -1, 1], [8, h - 8, 1, -1], [w - 8, h - 8, -1, -1]].forEach(([cx, cy, dx, dy], i) => {
    ctx.strokeStyle = cornerColors[i]; ctx.lineWidth = 2;
    ctx.shadowBlur = 8; ctx.shadowColor = cornerColors[i];
    ctx.beginPath();
    ctx.moveTo(cx + dx * 22, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * 22);
    ctx.stroke(); ctx.shadowBlur = 0;
  });

  // ── TITLE ─────────────────────────────────────────────────────
  ctx.save();
  ctx.shadowBlur = 20; ctx.shadowColor = '#e82020';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#2a1010';
  ctx.textAlign = 'right';
  ctx.fillText('フェアリーテイル — GUILDE DES MAGES', w - 28, 18);

  // Tricolor separator
  const seg = (w - 100) / 3;
  [['#e82020', 50], ['#5588ff', 50 + seg], ['#e8a020', 50 + seg * 2]].forEach(([col, x]) => {
    ctx.strokeStyle = col as string; ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7; ctx.shadowBlur = 6; ctx.shadowColor = col as string;
    ctx.beginPath(); ctx.moveTo(x as number, 88); ctx.lineTo((x as number) + seg, 88); ctx.stroke();
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  });

  // ── PHOTO ZONE ───────────────────────────────────────────────
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#0d0810'; ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawFrame = () => {
    const len = 24;
    // Top-left red, top-right blue, bottom-left gold, bottom-right red
    const corners: [number, number, number, number, string][] = [
      [photoX, photoY, 1, 1, '#e82020'],
      [photoX + photoW, photoY, -1, 1, '#5588ff'],
      [photoX, photoY + photoH, 1, -1, '#e8a020'],
      [photoX + photoW, photoY + photoH, -1, -1, '#e82020'],
    ];
    corners.forEach(([cx, cy, dx, dy, col]) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10; ctx.shadowColor = col;
      ctx.beginPath();
      ctx.moveTo(cx + dx * len, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * len);
      ctx.stroke(); ctx.shadowBlur = 0;
    });
    ctx.strokeStyle = '#ffffff22'; ctx.lineWidth = 0.8;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => { ctx.drawImage(img, photoX, photoY, photoW, photoH); drawFrame(); };
  } else { drawFrame(); }

  // Fairy wings on photo corner
  drawFairyWing(ctx, photoX + photoW - 16, photoY + photoH - 16, 18, 0.55);
  drawFairyWing(ctx, photoX + photoW - 16, photoY + photoH - 16, 18, 0.55, true);

  // ── DATA FIELDS ───────────────────────────────────────────────
  ctx.textAlign = 'left';
  const startX = 368;
  const labelColors = ['#e82020', '#5588ff', '#e8a020'];
  let lci = 0;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    const col = labelColors[lci++ % 3];
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = col;
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#f0e8ff';
    ctx.shadowBlur = 3; ctx.shadowColor = col + '44';
    ctx.fillText(value.toUpperCase(), x, y + 30); ctx.shadowBlur = 0;
    const lg = ctx.createLinearGradient(x, 0, x + 590, 0);
    lg.addColorStop(0, col + '55'); lg.addColorStop(1, 'transparent');
    ctx.strokeStyle = lg; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(x, y + 38); ctx.lineTo(x + 590, y + 38); ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#e8a020';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#f0e8ff';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 315, 263);

  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillStyle = '#5588ff';
  ctx.fillText('POUVOIR MAGIQUE', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));
  ctx.fillStyle = '#0d0810'; ctx.strokeStyle = '#1a1022'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(startX, 332, barWidth, 16, 3); ctx.fill(); ctx.stroke();

  if (power > 0) {
    const bg = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    bg.addColorStop(0, '#cc0020'); bg.addColorStop(0.35, '#5566ff');
    bg.addColorStop(0.7, '#e8a020'); bg.addColorStop(1, '#ffffff');
    ctx.fillStyle = bg;
    ctx.shadowBlur = 14; ctx.shadowColor = '#e8a02066';
    ctx.beginPath(); ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3); ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // ── QR CODE ──────────────────────────────────────────────────
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#0d0810'; ctx.fillRect(qrX, qrY, qrSize, qrSize);
  // Tricolor border
  const sides: [number, number, number, number, string][] = [
    [qrX, qrY, qrX + qrSize, qrY, '#e82020'],
    [qrX + qrSize, qrY, qrX + qrSize, qrY + qrSize, '#5588ff'],
    [qrX, qrY + qrSize, qrX + qrSize, qrY + qrSize, '#e8a020'],
    [qrX, qrY, qrX, qrY + qrSize, '#e82020'],
  ];
  sides.forEach(([x1, y1, x2, y2, col]) => {
    ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6; ctx.shadowColor = col;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.shadowBlur = 0;
  });
  // Wing above QR
  drawFairyWing(ctx, qrX + qrSize / 2, qrY - 18, 12, 0.65);
  drawFairyWing(ctx, qrX + qrSize / 2, qrY - 18, 12, 0.65, true);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#e8a020', light: '#0d0810' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => { ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize); };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ── MINI FIELDS ──────────────────────────────────────────────
  const miniColors = ['#e82020', '#e82020', '#5588ff', '#5588ff'];
  ['[ NAISSANCE ]', '[ SEXE ]', '[ EXPIRATION ]', '[ MEMBRE DEP. ]'].forEach((label, i) => {
    const x = i % 2 === 0 ? 70 : 215;
    const y = i < 2 ? 470 : 505;
    const val = [formData.dateNaissance, formData.sexe, formData.dateExpiration, formData.membreDepuis][i];
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = miniColors[i];
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#f0e0ff';
    ctx.fillText(val.toUpperCase(), x, y + 16);
  });

  // ── MRZ ──────────────────────────────────────────────────────
  const { line2: mrzLine } = generateMRZ(formData);
  ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(40, 577, w - 80, 43);
  const seg2 = (w - 80) / 3;
  [['#e82020', 40], ['#5588ff', 40 + seg2], ['#e8a020', 40 + seg2 * 2]].forEach(([col, x]) => {
    ctx.strokeStyle = col as string; ctx.lineWidth = 1.5;
    ctx.shadowBlur = 4; ctx.shadowColor = col as string;
    ctx.beginPath(); ctx.moveTo(x as number, 577); ctx.lineTo((x as number) + seg2, 577); ctx.stroke();
    ctx.shadowBlur = 0;
  });
  ctx.fillStyle = '#e8c880';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  ctx.restore();
}
