import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

export function renderSoloLeveling(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;   // 1011
  const h = canvas.height;  // 638

  ctx.clearRect(0, 0, w, h);

  // ════════════════════════════════════════════════════════════
  //  BACKGROUND
  // ════════════════════════════════════════════════════════════
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#010812');
  bgGrad.addColorStop(0.45, '#030e22');
  bgGrad.addColorStop(1, '#060318');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 18);
  ctx.clip();

  // Gate radial glow — top center
  const gateTop = ctx.createRadialGradient(w * 0.5, -80, 0, w * 0.5, -80, 520);
  gateTop.addColorStop(0, 'rgba(0, 110, 255, 0.20)');
  gateTop.addColorStop(0.6, 'rgba(0, 50, 150, 0.07)');
  gateTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gateTop;
  ctx.fillRect(0, 0, w, h);

  // Purple monarch glow — bottom right
  const purpleGlow = ctx.createRadialGradient(w * 0.82, h + 40, 0, w * 0.82, h + 40, 360);
  purpleGlow.addColorStop(0, 'rgba(80, 0, 200, 0.16)');
  purpleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = purpleGlow;
  ctx.fillRect(0, 0, w, h);

  // ── HEX GRID ──────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.045;
  ctx.strokeStyle = '#1e90ff';
  ctx.lineWidth = 0.65;
  const hs = 28;
  const hh = hs * Math.sqrt(3);
  for (let row = -1; row < h / hh + 2; row++) {
    for (let col = -1; col < w / (hs * 1.5) + 2; col++) {
      const cx = col * hs * 1.5;
      const cy = row * hh + (col % 2 === 0 ? 0 : hh / 2);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i + Math.PI / 6;
        const px = cx + hs * 0.86 * Math.cos(ang);
        const py = cy + hs * 0.86 * Math.sin(ang);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();

  // ── RADIAL BURST from center ───────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.strokeStyle = '#3366ff';
  ctx.lineWidth = 0.7;
  const bx = w * 0.5, by = h * 0.48;
  for (let i = 0; i < 48; i++) {
    const a = (Math.PI * 2 / 48) * i;
    ctx.beginPath();
    ctx.moveTo(bx + Math.cos(a) * 70, by + Math.sin(a) * 70);
    ctx.lineTo(bx + Math.cos(a) * 700, by + Math.sin(a) * 700);
    ctx.stroke();
  }
  [65, 130, 200, 280].forEach(r => {
    ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.stroke();
  });
  ctx.restore();

  // ── PARTICLES ─────────────────────────────────────────────────
  const pts: [number, number, number, number, string][] = [
    [88, 36, 1.5, 0.6, '#00b4ff'], [168, 20, 1.0, 0.5, '#7b2fff'],
    [310, 44, 1.2, 0.55, '#00b4ff'], [478, 16, 0.9, 0.5, '#00b4ff'],
    [625, 38, 1.3, 0.55, '#7b2fff'], [782, 22, 1.1, 0.5, '#00b4ff'],
    [918, 40, 1.0, 0.55, '#7b2fff'], [48, 188, 0.9, 0.45, '#00b4ff'],
    [992, 248, 0.8, 0.4, '#7b2fff'], [22, 390, 1.0, 0.45, '#00b4ff'],
    [998, 442, 0.9, 0.4, '#7b2fff'], [52, 568, 1.2, 0.5, '#00b4ff'],
    [724, 512, 1.0, 0.45, '#00b4ff'], [202, 28, 0.6, 0.35, '#ffffff'],
    [558, 26, 0.7, 0.35, '#ffffff'], [852, 32, 0.5, 0.3, '#ffffff'],
  ];
  for (const [px, py, pr, pa, col] of pts) {
    ctx.globalAlpha = pa;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── MAGIC CIRCLE — bottom-right ────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#3b5bff';
  ctx.lineWidth = 1.1;
  const mc1x = w - 110, mc1y = h - 100;
  [112, 84, 58, 34].forEach(r => {
    ctx.beginPath(); ctx.arc(mc1x, mc1y, r, 0, Math.PI * 2); ctx.stroke();
  });
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 / 12) * i;
    ctx.beginPath();
    ctx.moveTo(mc1x + 34 * Math.cos(a), mc1y + 34 * Math.sin(a));
    ctx.lineTo(mc1x + 112 * Math.cos(a), mc1y + 112 * Math.sin(a));
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const a2 = (Math.PI * 2 / 5) * ((i + 2) % 5) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(mc1x + 70 * Math.cos(a1), mc1y + 70 * Math.sin(a1));
    ctx.lineTo(mc1x + 70 * Math.cos(a2), mc1y + 70 * Math.sin(a2));
    ctx.stroke();
  }
  ctx.restore();

  // ── MAGIC CIRCLE — top-left ─────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.065;
  ctx.strokeStyle = '#4466ff';
  ctx.lineWidth = 1.0;
  const mc2x = 52, mc2y = 52;
  [82, 60, 38].forEach(r => {
    ctx.beginPath(); ctx.arc(mc2x, mc2y, r, 0, Math.PI * 2); ctx.stroke();
  });
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(mc2x + 38 * Math.cos(a), mc2y + 38 * Math.sin(a));
    ctx.lineTo(mc2x + 82 * Math.cos(a), mc2y + 82 * Math.sin(a));
    ctx.stroke();
  }
  ctx.restore();

  // ── SLASH LINES — top-right corner ──────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.09;
  ctx.strokeStyle = '#00b4ff';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(w - 70 + i * 11, 0);
    ctx.lineTo(w, 70 - i * 11);
    ctx.stroke();
  }
  ctx.restore();

  // ── CORNER MARKS ────────────────────────────────────────────
  const drawCorner = (cx: number, cy: number, dx: number, dy: number) => {
    const len = 22;
    ctx.strokeStyle = '#00b4ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00b4ff';
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#7b2fff44';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy + dy * 5); ctx.lineTo(cx + dx * 5, cy + dy * len);
    ctx.stroke();
  };
  drawCorner(8, 8, 1, 1);
  drawCorner(w - 8, 8, -1, 1);
  drawCorner(8, h - 8, 1, -1);
  drawCorner(w - 8, h - 8, -1, -1);

  // ── SOLO LEVELING watermark ──────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#3355ff';
  ctx.font = 'bold 52px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SOLO LEVELING', w / 2, h / 2 + 14);
  ctx.restore();

  // ════════════════════════════════════════════════════════════
  //  TITLE — same as all other templates
  // ════════════════════════════════════════════════════════════
  ctx.save();
  ctx.shadowBlur = 22;
  ctx.shadowColor = '#00b4ff';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Subtitle watermark top-right
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#1a3a66';
  ctx.textAlign = 'right';
  ctx.fillText('SOLO LEVELING — 헌터 신분증', w - 28, 18);

  // Top separator
  ctx.strokeStyle = '#00b4ff';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.45;
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#00b4ff';
  ctx.beginPath();
  ctx.moveTo(50, 88);
  ctx.lineTo(w - 50, 88);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // ════════════════════════════════════════════════════════════
  //  PHOTO ZONE — x=65 y=116 w=250 h=336  (same as all templates)
  // ════════════════════════════════════════════════════════════
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#04091a';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Inner border
  ctx.strokeStyle = '#1a3366';
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.55;
  ctx.strokeRect(photoX + 3, photoY + 3, photoW - 6, photoH - 6);
  ctx.globalAlpha = 1;

  const drawPhotoFrame = (x: number, y: number, pw: number, ph: number) => {
    const len = 24;
    ctx.strokeStyle = '#00b4ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00b4ff';
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + pw - len, y); ctx.lineTo(x + pw, y); ctx.lineTo(x + pw, y + len);
    ctx.moveTo(x, y + ph - len); ctx.lineTo(x, y + ph); ctx.lineTo(x + len, y + ph);
    ctx.moveTo(x + pw - len, y + ph); ctx.lineTo(x + pw, y + ph); ctx.lineTo(x + pw, y + ph - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Outer glow rect
    ctx.strokeStyle = '#00b4ff44';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, pw, ph);
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      drawPhotoFrame(photoX, photoY, photoW, photoH);
    };
  } else {
    drawPhotoFrame(photoX, photoY, photoW, photoH);
  }

  // ════════════════════════════════════════════════════════════
  //  DATA FIELDS — same positions as Shadow Garden / all templates
  //  startX = 368
  // ════════════════════════════════════════════════════════════
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#2a6699';
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#d8eeff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00b4ff55';
    ctx.fillText(value.toUpperCase(), x, y + 30);
    ctx.shadowBlur = 0;
    // Separator line — blue instead of indigo
    const lineG = ctx.createLinearGradient(x, 0, x + 600, 0);
    lineG.addColorStop(0, '#00b4ff55');
    lineG.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineG;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 38);
    ctx.lineTo(x + 600, y + 38);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#2a6699';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#d8eeff';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 315, 263);

  // Power bar
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillStyle = '#2a6699';
  ctx.fillText('NIVEAU DE PUISSANCE / MANA', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#06101e';
  ctx.strokeStyle = '#1a2a44';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(startX, 332, barWidth, 16, 3);
  ctx.fill();
  ctx.stroke();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#0033ff');
    grad.addColorStop(0.5, '#00b4ff');
    grad.addColorStop(0.88, '#7b2fff');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#00b4ff';
    ctx.beginPath();
    ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // "ARISE" easter egg at 95+
  if (power >= 95) {
    ctx.font = 'italic bold 13px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#7b2fff';
    ctx.textAlign = 'right';
    ctx.fillText('— ARISE —', startX + barWidth, 328);
    ctx.textAlign = 'left';
    ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // ════════════════════════════════════════════════════════════
  //  QR CODE — same position as all templates
  // ════════════════════════════════════════════════════════════
  const qrX = 840, qrY = 445, qrSize = 118;

  ctx.fillStyle = '#03081e';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#00b4ff';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00b4ff';
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  ctx.shadowBlur = 0;

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#00c8ff', light: '#03081e' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#00b4ff';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00b4ff';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      ctx.shadowBlur = 0;
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ════════════════════════════════════════════════════════════
  //  MINI FIELDS under photo — same positions as all templates
  // ════════════════════════════════════════════════════════════
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#2a6699';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#c8deff';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#00b4ff44';
    ctx.fillText(value.toUpperCase(), x, y + 16);
    ctx.shadowBlur = 0;
  };
  drawMiniField('[ NAISSANCE ]', formData.dateNaissance, 70, 470);
  drawMiniField('[ SEXE ]', formData.sexe, 215, 470);
  drawMiniField('[ EXPIRATION ]', formData.dateExpiration, 70, 505);
  drawMiniField('[ MEMBRE DEP. ]', formData.membreDepuis, 215, 505);

  // ── RANK BADGE — Solo Leveling class indicator ───────────────
  const rankMap: Record<string, { color: string; label: string }> = {
    'S-CLASS':  { color: '#ffd700', label: '◆ SHADOW MONARCH ◆' },
    'A-CLASS':  { color: '#ff6622', label: '◆ NATIONAL LEVEL ◆' },
    'B-CLASS':  { color: '#aa44ff', label: '◆ HIGH GRADE ◆' },
    'GOD TIER': { color: '#ff2255', label: '⬡  MONARCH TIER  ⬡' },
    'CIVILIAN': { color: '#4a5e77', label: '○  NON-AWAKENED  ○' },
  };
  const rk = rankMap[formData.classe] ?? { color: '#00b4ff', label: `◆ ${formData.classe} ◆` };

  ctx.fillStyle = `${rk.color}16`;
  ctx.strokeStyle = rk.color;
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 10;
  ctx.shadowColor = rk.color;
  ctx.beginPath();
  ctx.roundRect(70, 530, 245, 26, 4);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = rk.color;
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.shadowBlur = 8;
  ctx.shadowColor = rk.color;
  ctx.fillText(rk.label, 70 + 245 / 2, 530 + 17);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';

  // ════════════════════════════════════════════════════════════
  //  MRZ ZONE — same as all templates (y=577)
  // ════════════════════════════════════════════════════════════
  const { line2: mrzLine } = generateMRZ(formData);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.90)';
  ctx.fillRect(40, 577, w - 80, 43);

  // Border with blue glow
  ctx.strokeStyle = '#00b4ff44';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#00b4ff';
  ctx.strokeRect(40, 577, w - 80, 43);
  ctx.shadowBlur = 0;

  // Top glow line on MRZ
  const mrzTopG = ctx.createLinearGradient(40, 0, 40 + (w - 80), 0);
  mrzTopG.addColorStop(0, 'transparent');
  mrzTopG.addColorStop(0.2, '#00b4ff');
  mrzTopG.addColorStop(0.8, '#7b2fff');
  mrzTopG.addColorStop(1, 'transparent');
  ctx.strokeStyle = mrzTopG;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#00b4ff';
  ctx.beginPath();
  ctx.moveTo(40, 577);
  ctx.lineTo(40 + (w - 80), 577);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#00c8ff';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  ctx.restore(); // end clip
}
