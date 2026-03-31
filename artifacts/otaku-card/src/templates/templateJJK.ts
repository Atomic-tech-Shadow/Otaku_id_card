import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

function getSorcererGrade(power: number): string {
  if (power >= 100) return 'GRADE SPÉCIAL';
  if (power >= 90)  return 'GRADE SPÉCIAL';
  if (power >= 75)  return 'GRADE 1';
  if (power >= 60)  return 'SEMI-GRADE 1';
  if (power >= 40)  return 'GRADE 2';
  if (power >= 20)  return 'GRADE 3';
  return 'GRADE 4';
}

function getSorcererGradeColor(power: number): string {
  if (power >= 90) return '#ff2244';
  if (power >= 75) return '#cc44ff';
  if (power >= 60) return '#aa22dd';
  if (power >= 40) return '#7722aa';
  return '#553388';
}

export function renderJJK(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // ════════════════════════════════════════════════════════════
  //  CLIP to rounded rect
  // ════════════════════════════════════════════════════════════
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 18);
  ctx.clip();

  // ════════════════════════════════════════════════════════════
  //  BACKGROUND — deep obsidian
  // ════════════════════════════════════════════════════════════
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#07050f');
  bgGrad.addColorStop(0.5, '#0d0918');
  bgGrad.addColorStop(1, '#100510');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Purple cursed energy radial — top left
  const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 420);
  glow1.addColorStop(0, 'rgba(90, 0, 160, 0.22)');
  glow1.addColorStop(0.6, 'rgba(60, 0, 100, 0.08)');
  glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, w, h);

  // Dark red cursed glow — bottom right
  const glow2 = ctx.createRadialGradient(w, h, 0, w, h, 380);
  glow2.addColorStop(0, 'rgba(130, 0, 30, 0.20)');
  glow2.addColorStop(0.6, 'rgba(80, 0, 20, 0.07)');
  glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

  // ── CURSED CRACK LINES ──────────────────────────────────────
  const cracks: [number, number, number, number, number][] = [
    [0, 0, 180, 280, 0.09],
    [0, 0, 300, 120, 0.07],
    [w, 0, w - 220, 300, 0.08],
    [w, h, w - 160, h - 260, 0.09],
    [0, h, 200, h - 200, 0.07],
    [w * 0.3, 0, w * 0.4, h * 0.25, 0.04],
    [w * 0.7, h, w * 0.6, h * 0.75, 0.04],
  ];
  cracks.forEach(([x1, y1, x2, y2, alpha]) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#9b22cc';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 40;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 40;
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.stroke();
    ctx.restore();
  });

  // ── LARGE 呪 WATERMARK ───────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#9b22cc';
  ctx.font = 'bold 340px serif';
  ctx.textAlign = 'center';
  ctx.fillText('呪', w * 0.62, h * 0.72);
  ctx.restore();

  // ── CURSED SEAL RING — top-left ─────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = '#7700bb';
  ctx.lineWidth = 1;
  const s1x = 40, s1y = 40;
  [60, 44, 28].forEach(r => {
    ctx.beginPath(); ctx.arc(s1x, s1y, r, 0, Math.PI * 2); ctx.stroke();
  });
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(s1x + 28 * Math.cos(a), s1y + 28 * Math.sin(a));
    ctx.lineTo(s1x + 60 * Math.cos(a), s1y + 60 * Math.sin(a));
    ctx.stroke();
  }
  ctx.restore();

  // ── CURSED SEAL RING — bottom-right ─────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = '#8800cc';
  ctx.lineWidth = 1;
  const s2x = w - 95, s2y = h - 80;
  [100, 74, 50, 28].forEach(r => {
    ctx.beginPath(); ctx.arc(s2x, s2y, r, 0, Math.PI * 2); ctx.stroke();
  });
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 / 12) * i;
    ctx.beginPath();
    ctx.moveTo(s2x + 28 * Math.cos(a), s2y + 28 * Math.sin(a));
    ctx.lineTo(s2x + 100 * Math.cos(a), s2y + 100 * Math.sin(a));
    ctx.stroke();
  }
  // pentagram inside
  for (let i = 0; i < 5; i++) {
    const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const a2 = (Math.PI * 2 / 5) * ((i + 2) % 5) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(s2x + 62 * Math.cos(a1), s2y + 62 * Math.sin(a1));
    ctx.lineTo(s2x + 62 * Math.cos(a2), s2y + 62 * Math.sin(a2));
    ctx.stroke();
  }
  ctx.restore();

  // ── CORNER MARKS ────────────────────────────────────────────
  const drawCorner = (cx: number, cy: number, dx: number, dy: number) => {
    const len = 22;
    ctx.strokeStyle = '#8822cc';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#aa00ff';
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#55006655';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy + dy * 5); ctx.lineTo(cx + dx * 5, cy + dy * len);
    ctx.stroke();
  };
  drawCorner(8, 8, 1, 1);
  drawCorner(w - 8, 8, -1, 1);
  drawCorner(8, h - 8, 1, -1);
  drawCorner(w - 8, h - 8, -1, -1);

  // ── PARTICLES ─────────────────────────────────────────────────
  const particles: [number, number, number, number, string][] = [
    [92, 34, 1.4, 0.55, '#aa22ff'],  [200, 18, 1.0, 0.50, '#cc44ff'],
    [340, 42, 1.2, 0.50, '#aa22ff'], [500, 14, 0.9, 0.45, '#ff2244'],
    [648, 36, 1.3, 0.50, '#aa22ff'], [800, 20, 1.1, 0.50, '#cc44ff'],
    [940, 38, 1.0, 0.50, '#aa22ff'], [44, 200, 0.9, 0.40, '#ff2244'],
    [990, 260, 0.8, 0.40, '#cc44ff'],[20, 400, 1.0, 0.40, '#aa22ff'],
    [995, 450, 0.9, 0.40, '#ff2244'],[50, 580, 1.2, 0.45, '#aa22ff'],
    [730, 520, 1.0, 0.40, '#cc44ff'],[210, 24, 0.6, 0.30, '#ffffff'],
    [562, 22, 0.7, 0.30, '#ffffff'], [860, 30, 0.5, 0.28, '#ffffff'],
  ];
  for (const [px, py, pr, pa, col] of particles) {
    ctx.globalAlpha = pa;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ════════════════════════════════════════════════════════════
  //  TITLE
  // ════════════════════════════════════════════════════════════
  ctx.save();
  ctx.shadowBlur = 24;
  ctx.shadowColor = '#9900cc';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Subtitle — top right
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#3d0066';
  ctx.textAlign = 'right';
  ctx.fillText('呪術高専 — REGISTRE DES SORCIERS', w - 28, 18);

  // Top separator
  const sepGrad = ctx.createLinearGradient(50, 0, w - 50, 0);
  sepGrad.addColorStop(0, 'transparent');
  sepGrad.addColorStop(0.3, '#8822cc');
  sepGrad.addColorStop(0.7, '#cc0033');
  sepGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = sepGrad;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.60;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#aa00ff';
  ctx.beginPath();
  ctx.moveTo(50, 88);
  ctx.lineTo(w - 50, 88);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // ════════════════════════════════════════════════════════════
  //  PHOTO ZONE
  // ════════════════════════════════════════════════════════════
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;

  ctx.fillStyle = '#0a020f';
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.strokeStyle = '#2d0044';
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.55;
  ctx.strokeRect(photoX + 3, photoY + 3, photoW - 6, photoH - 6);
  ctx.globalAlpha = 1;

  const drawPhotoFrame = () => {
    const len = 24;
    ctx.strokeStyle = '#9933cc';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#aa00ff';
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + len);         ctx.lineTo(photoX, photoY);              ctx.lineTo(photoX + len, photoY);
    ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY);   ctx.lineTo(photoX + photoW, photoY + len);
    ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH);   ctx.lineTo(photoX + len, photoY + photoH);
    ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#66009944';
    ctx.lineWidth = 1;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
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

  // ════════════════════════════════════════════════════════════
  //  DATA FIELDS
  // ════════════════════════════════════════════════════════════
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#6600aa';
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#e8ccff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#aa00ff44';
    ctx.fillText(value.toUpperCase(), x, y + 30);
    ctx.shadowBlur = 0;
    const lineG = ctx.createLinearGradient(x, 0, x + 600, 0);
    lineG.addColorStop(0, '#9900cc44');
    lineG.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineG;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 38); ctx.lineTo(x + 600, y + 38);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#6600aa';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#e8ccff';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DOSSIER', formData.noCarte, startX + 315, 263);

  // ── CURSED ENERGY BAR ────────────────────────────────────────
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillStyle = '#6600aa';
  ctx.fillText('VOLUME D\'ÉNERGIE MAUDITE', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#0a0010';
  ctx.strokeStyle = '#2d0044';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(startX, 332, barWidth, 16, 3);
  ctx.fill();
  ctx.stroke();

  if (power > 0) {
    const barGrad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    barGrad.addColorStop(0, '#440088');
    barGrad.addColorStop(0.5, '#9900cc');
    barGrad.addColorStop(0.85, '#cc2299');
    barGrad.addColorStop(1, '#ff0044');
    ctx.fillStyle = barGrad;
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#aa00ff';
    ctx.beginPath();
    ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // GRADE badge — auto from power level
  const grade = getSorcererGrade(power);
  const gradeColor = getSorcererGradeColor(power);
  ctx.save();
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.fillStyle = gradeColor;
  ctx.textAlign = 'right';
  ctx.shadowBlur = 10;
  ctx.shadowColor = gradeColor;
  ctx.fillText(`— ${grade}`, startX + barWidth, 328);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
  ctx.restore();

  drawField('TECHNIQUE MAUDITE', formData.expertise, startX, 390);
  drawField('CLASSIFICATION', formData.classe, startX, 458, 22);

  // ════════════════════════════════════════════════════════════
  //  QR CODE with cursed seal ring
  // ════════════════════════════════════════════════════════════
  const qrX = 840, qrY = 445, qrSize = 118;

  // Outer cursed ring
  ctx.save();
  ctx.strokeStyle = '#7700bb';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#aa00ff';
  ctx.beginPath();
  ctx.arc(qrX + qrSize / 2, qrY + qrSize / 2, qrSize / 2 + 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.fillStyle = '#080010';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#8822cc';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#aa00ff';
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  ctx.shadowBlur = 0;

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#cc44ff', light: '#080010' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#8822cc';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#aa00ff';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      ctx.shadowBlur = 0;
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ════════════════════════════════════════════════════════════
  //  MINI FIELDS under photo
  // ════════════════════════════════════════════════════════════
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#6600aa';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#d8b8ff';
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#aa00ff44';
    ctx.fillText(value.toUpperCase(), x, y + 16);
    ctx.shadowBlur = 0;
  };
  drawMiniField('[ NAISSANCE ]', formData.dateNaissance, 70, 470);
  drawMiniField('[ SEXE ]', formData.sexe, 215, 470);
  drawMiniField('[ EXPIRATION ]', formData.dateExpiration, 70, 505);
  drawMiniField('[ MEMBRE DEP. ]', formData.membreDepuis, 215, 505);

  // ── 極秘 stamp (top secret) ──────────────────────────────────
  ctx.save();
  ctx.translate(w - 200, 200);
  ctx.rotate(-0.38);
  ctx.font = 'bold 38px serif';
  ctx.fillStyle = 'rgba(180, 0, 0, 0.10)';
  ctx.strokeStyle = 'rgba(180, 0, 0, 0.12)';
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';
  ctx.strokeText('極秘', 0, 0);
  ctx.fillText('極秘', 0, 0);
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.strokeText('CLASSIFIÉ', 0, 22);
  ctx.restore();

  // ════════════════════════════════════════════════════════════
  //  MRZ ZONE
  // ════════════════════════════════════════════════════════════
  const { line2: mrzLine } = generateMRZ(formData);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
  ctx.fillRect(40, 577, w - 80, 43);

  const mrzBorderGrad = ctx.createLinearGradient(40, 0, 40 + (w - 80), 0);
  mrzBorderGrad.addColorStop(0, 'transparent');
  mrzBorderGrad.addColorStop(0.25, '#8822cc');
  mrzBorderGrad.addColorStop(0.75, '#cc0033');
  mrzBorderGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = mrzBorderGrad;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#aa00ff';
  ctx.beginPath();
  ctx.moveTo(40, 577);
  ctx.lineTo(40 + (w - 80), 577);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#44006644';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 577, w - 80, 43);

  ctx.fillStyle = '#cc66ff';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  ctx.restore(); // end clip
}
