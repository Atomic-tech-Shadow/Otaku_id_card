import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, innerR: number, points: number) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : innerR;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawHeroEmblem(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Outer ring
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  // Star
  ctx.fillStyle = '#b8860b';
  drawStar(ctx, cx, cy, r * 0.62, r * 0.28, 5);
  ctx.fill();

  // Tick marks around outer ring
  for (let i = 0; i < 24; i++) {
    const a = (Math.PI * 2 / 24) * i;
    const isLong = i % 6 === 0;
    ctx.lineWidth = isLong ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + (r + 2) * Math.cos(a), cy + (r + 2) * Math.sin(a));
    ctx.lineTo(cx + (r - (isLong ? 8 : 4)) * Math.cos(a), cy + (r - (isLong ? 8 : 4)) * Math.sin(a));
    ctx.stroke();
  }

  ctx.restore();
}

export function renderHero(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // ════════════════════════════════════════════════════════════
  //  CLIP
  // ════════════════════════════════════════════════════════════
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 18);
  ctx.clip();

  // ════════════════════════════════════════════════════════════
  //  BACKGROUND — clean official cream-white
  // ════════════════════════════════════════════════════════════
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#edf0fa');
  bgGrad.addColorStop(0.5, '#f4f6fd');
  bgGrad.addColorStop(1, '#e8ecf8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle diagonal lines texture
  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.strokeStyle = '#0f2057';
  ctx.lineWidth = 0.8;
  for (let i = -h; i < w + h; i += 18) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.stroke();
  }
  ctx.restore();

  // ── NAVY HEADER BAND ────────────────────────────────────────
  const headerH = 92;
  const headerGrad = ctx.createLinearGradient(0, 0, w, headerH);
  headerGrad.addColorStop(0, '#0a1a4a');
  headerGrad.addColorStop(0.5, '#0f2057');
  headerGrad.addColorStop(1, '#0a1a4a');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, w, headerH);

  // Gold accent line under header
  const goldLine = ctx.createLinearGradient(0, 0, w, 0);
  goldLine.addColorStop(0, 'transparent');
  goldLine.addColorStop(0.15, '#b8860b');
  goldLine.addColorStop(0.85, '#d4af37');
  goldLine.addColorStop(1, 'transparent');
  ctx.strokeStyle = goldLine;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, headerH);
  ctx.lineTo(w, headerH);
  ctx.stroke();

  // Second thinner gold line
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, headerH + 3);
  ctx.lineTo(w, headerH + 3);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Header text — main title
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 22px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.15em';
  ctx.fillText('HERO PUBLIC SAFETY COMMISSION', w / 2, 36);

  // Header subtitle
  ctx.fillStyle = '#a89040';
  ctx.font = 'bold 13px serif';
  ctx.fillText('英雄公安委員会 — CARTE DE LICENCE PROFESSIONNELLE', w / 2, 58);

  // Document type label
  ctx.fillStyle = '#8a7030';
  ctx.font = '10px "Courier New", monospace';
  ctx.fillText('OFFICIAL HERO IDENTIFICATION DOCUMENT — RESTRICTED', w / 2, 78);

  // Emblem left in header
  drawHeroEmblem(ctx, 58, headerH / 2, 34, 0.85);

  // Emblem right in header
  drawHeroEmblem(ctx, w - 58, headerH / 2, 34, 0.85);

  // ── LEFT RED ACCENT STRIPE ───────────────────────────────────
  const stripe = ctx.createLinearGradient(0, 0, 0, h);
  stripe.addColorStop(0, '#cc0020');
  stripe.addColorStop(0.5, '#e8001a');
  stripe.addColorStop(1, '#cc0020');
  ctx.fillStyle = stripe;
  ctx.fillRect(0, headerH + 4, 7, h - headerH - 4);

  // ── WATERMARK EMBLEM — center background ─────────────────────
  drawHeroEmblem(ctx, w * 0.62, h * 0.5, 130, 0.04);

  // Small decorative emblem watermark top right content area
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#0f2057';
  ctx.font = 'bold 70px serif';
  ctx.textAlign = 'right';
  ctx.fillText('英', w - 30, 170);
  ctx.restore();

  // ════════════════════════════════════════════════════════════
  //  TITLE ROW — below header
  // ════════════════════════════════════════════════════════════
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0f2057';
  ctx.font = 'bold 44px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 148);
  ctx.restore();

  // Subtitle tag line
  ctx.fillStyle = '#cc0020';
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('HERO BUREAU — LICENCE PROFESSIONNELLE N° CERTIFIÉE', w - 28, 108);

  // ── TOP SEPARATOR under title ────────────────────────────────
  ctx.strokeStyle = '#cc0020';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(50, 158);
  ctx.lineTo(w - 50, 158);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // ════════════════════════════════════════════════════════════
  //  PHOTO ZONE — x=65 y=172 w=250 h=290 (tighter, official style)
  // ════════════════════════════════════════════════════════════
  const photoX = 65, photoY = 172, photoW = 250, photoH = 290;

  // Photo background
  ctx.fillStyle = '#d8dcea';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Inner border
  ctx.strokeStyle = '#aab2cc';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;
  ctx.strokeRect(photoX + 2, photoY + 2, photoW - 4, photoH - 4);
  ctx.globalAlpha = 1;

  const drawPhotoFrame = () => {
    // Red corner marks
    const len = 22;
    ctx.strokeStyle = '#cc0020';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
    ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
    ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
    ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
    ctx.stroke();

    // Outer thin navy border
    ctx.strokeStyle = '#0f2057';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
    ctx.globalAlpha = 1;
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      drawPhotoFrame();
    };
  } else {
    drawPhotoFrame();
  }

  // "PHOTO" placeholder label
  if (!photo) {
    ctx.fillStyle = '#8892aa';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO OFFICIELLE', photoX + photoW / 2, photoY + photoH / 2);
  }

  // ── BIOMETRIC STRIP under photo ──────────────────────────────
  const bioY = photoY + photoH + 6;
  ctx.fillStyle = '#0f2057';
  ctx.fillRect(photoX, bioY, photoW, 22);
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DONNÉES BIOMÉTRIQUES CERTIFIÉES', photoX + photoW / 2, bioY + 14);

  // ════════════════════════════════════════════════════════════
  //  DATA FIELDS — startX = 370
  // ════════════════════════════════════════════════════════════
  ctx.textAlign = 'left';
  const startX = 370;

  const drawField = (label: string, value: string, x: number, y: number, size = 24) => {
    // Label background tab
    ctx.fillStyle = '#0f2057';
    ctx.fillRect(x, y - 13, ctx.measureText(label).width + 14, 16);

    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#d4af37';
    ctx.fillText(label, x + 6, y);

    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#0a0f2e';
    ctx.fillText(value.toUpperCase(), x, y + 28);

    // Thin red underline
    ctx.strokeStyle = '#cc0020';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y + 36);
    ctx.lineTo(x + 590, y + 36);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.fillStyle = '#0f2057';
    ctx.fillRect(x, y - 13, ctx.measureText(label).width + 14, 16);
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#d4af37';
    ctx.fillText(label, x + 6, y);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#0a0f2e';
    ctx.fillText(value.toUpperCase(), x, y + 23);
  };

  drawField('NOM DE HÉROS', formData.pseudo, startX, 195);
  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 258);
  drawField('NATIONALITÉ', formData.nationalite, startX, 318);
  drawFieldSmall('NO. LICENCE', formData.noCarte, startX + 310, 318);

  // ── POWER LEVEL BAR ─────────────────────────────────────────
  ctx.fillStyle = '#0f2057';
  ctx.fillRect(startX, 367 - 13, 190, 16);
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('NIVEAU DE PUISSANCE', startX + 6, 367);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  // Bar background
  ctx.fillStyle = '#c8ccdc';
  ctx.strokeStyle = '#aab0c8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(startX, 377, barWidth, 14, 3);
  ctx.fill();
  ctx.stroke();

  if (power > 0) {
    const barGrad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    barGrad.addColorStop(0, '#0f4cb8');
    barGrad.addColorStop(0.55, '#0f2057');
    barGrad.addColorStop(0.85, '#8b0010');
    barGrad.addColorStop(1, '#cc0020');
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(startX, 377, (barWidth * power) / 100, 14, 3);
    ctx.fill();
  }

  // Power percentage label
  ctx.fillStyle = '#0f2057';
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${power}%`, startX + barWidth, 374);
  ctx.textAlign = 'left';

  drawField('RANG HÉROÏQUE', formData.classe, startX, 423);
  drawField('APTITUDE / QUIRK', formData.expertise, startX, 490, 20);

  // ════════════════════════════════════════════════════════════
  //  QR CODE — official style
  // ════════════════════════════════════════════════════════════
  const qrX = 842, qrY = 456, qrSize = 110;

  // QR background plate
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f2057';
  ctx.lineWidth = 2;
  ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);
  ctx.strokeRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);

  // Corner red marks on QR plate
  const qcLen = 10;
  ctx.strokeStyle = '#cc0020';
  ctx.lineWidth = 2;
  [[qrX - 4, qrY - 4, 1, 1], [qrX + qrSize + 4, qrY - 4, -1, 1], [qrX - 4, qrY + qrSize + 4, 1, -1], [qrX + qrSize + 4, qrY + qrSize + 4, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(cx as number + (dx as number) * qcLen, cy as number);
    ctx.lineTo(cx as number, cy as number);
    ctx.lineTo(cx as number, cy as number + (dy as number) * qcLen);
    ctx.stroke();
  });

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#0f2057', light: '#ffffff' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#0f2057';
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // QR label
  ctx.fillStyle = '#0f2057';
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VÉRIFICATION', qrX + qrSize / 2, qrY + qrSize + 18);
  ctx.textAlign = 'left';

  // ════════════════════════════════════════════════════════════
  //  HOLOGRAPHIC STAMP — 認定済 bottom left of QR area
  // ════════════════════════════════════════════════════════════
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.strokeStyle = '#007700';
  ctx.lineWidth = 2;
  const stX = 840, stY = 390;
  ctx.beginPath();
  ctx.arc(stX, stY, 44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(stX, stY, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#007700';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('認定済', stX, stY + 8);
  ctx.font = 'bold 8px "Courier New", monospace';
  ctx.fillText('CERTIFIED', stX, stY + 28);
  ctx.restore();

  // ════════════════════════════════════════════════════════════
  //  MINI FIELDS under photo
  // ════════════════════════════════════════════════════════════
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.fillStyle = '#0f2057';
    ctx.fillRect(x, y - 11, 88, 13);
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 4, y);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#0a0f2e';
    ctx.fillText(value.toUpperCase(), x, y + 14);
  };

  drawMiniField('NAISSANCE', formData.dateNaissance, 72, 487);
  drawMiniField('SEXE', formData.sexe, 240, 487);
  drawMiniField('EXPIRATION', formData.dateExpiration, 72, 518);
  drawMiniField('MEMBRE DEP.', formData.membreDepuis, 240, 518);

  // ════════════════════════════════════════════════════════════
  //  MRZ ZONE — navy background, official style
  // ════════════════════════════════════════════════════════════
  const { line2: mrzLine } = generateMRZ(formData);

  // MRZ background
  ctx.fillStyle = '#0f2057';
  ctx.fillRect(40, 577, w - 80, 43);

  // Gold top border on MRZ
  const mrzGold = ctx.createLinearGradient(40, 0, 40 + (w - 80), 0);
  mrzGold.addColorStop(0, 'transparent');
  mrzGold.addColorStop(0.2, '#b8860b');
  mrzGold.addColorStop(0.8, '#d4af37');
  mrzGold.addColorStop(1, 'transparent');
  ctx.strokeStyle = mrzGold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 577);
  ctx.lineTo(40 + (w - 80), 577);
  ctx.stroke();

  // MRZ text
  ctx.fillStyle = '#e8f0ff';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  // "MRZ" label right side
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 8px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ZONE LISIBLE PAR MACHINE', w - 44, 590);

  ctx.restore(); // end clip
}
