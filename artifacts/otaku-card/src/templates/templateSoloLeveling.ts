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
  //  BACKGROUND — Deep void with gate-blue glow
  // ════════════════════════════════════════════════════════════
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#010812');
  bgGrad.addColorStop(0.45, '#030e22');
  bgGrad.addColorStop(1, '#060318');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 18);
  ctx.fill();

  // Clip card shape
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 18);
  ctx.clip();

  // Gate radial glow — top center
  const gateTop = ctx.createRadialGradient(w * 0.5, -60, 0, w * 0.5, -60, 500);
  gateTop.addColorStop(0, 'rgba(0, 110, 255, 0.22)');
  gateTop.addColorStop(0.6, 'rgba(0, 50, 150, 0.08)');
  gateTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gateTop;
  ctx.fillRect(0, 0, w, h);

  // Purple monarch glow — bottom right
  const purpleGlow = ctx.createRadialGradient(w * 0.82, h + 40, 0, w * 0.82, h + 40, 380);
  purpleGlow.addColorStop(0, 'rgba(80, 0, 200, 0.18)');
  purpleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = purpleGlow;
  ctx.fillRect(0, 0, w, h);

  // Blue ambient — left
  const blueLeft = ctx.createRadialGradient(0, h * 0.5, 0, 0, h * 0.5, 280);
  blueLeft.addColorStop(0, 'rgba(0, 80, 200, 0.10)');
  blueLeft.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = blueLeft;
  ctx.fillRect(0, 0, w, h);

  // ── HEX GRID ──────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.048;
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

  // ── VERTICAL SCAN LINES (subtle) ─────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.015;
  ctx.strokeStyle = '#0066ff';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.restore();

  // ── PARTICLES ─────────────────────────────────────────────────
  const pts: [number, number, number, number, string][] = [
    [88, 36, 1.5, 0.6, '#00b4ff'], [168, 20, 1.0, 0.5, '#7b2fff'],
    [310, 44, 1.2, 0.55, '#00b4ff'], [478, 16, 0.9, 0.5, '#00b4ff'],
    [625, 38, 1.3, 0.55, '#7b2fff'], [782, 22, 1.1, 0.5, '#00b4ff'],
    [918, 40, 1.0, 0.55, '#7b2fff'], [48, 188, 0.9, 0.45, '#00b4ff'],
    [992, 248, 0.8, 0.4, '#7b2fff'], [22, 390, 1.0, 0.45, '#00b4ff'],
    [998, 442, 0.9, 0.4, '#7b2fff'], [52, 568, 1.2, 0.5, '#00b4ff'],
    [402, 522, 0.7, 0.4, '#7b2fff'], [724, 512, 1.0, 0.45, '#00b4ff'],
    [962, 558, 0.8, 0.4, '#7b2fff'], [202, 28, 0.6, 0.35, '#ffffff'],
    [558, 26, 0.7, 0.35, '#ffffff'], [852, 32, 0.5, 0.3, '#ffffff'],
    [132, 482, 0.6, 0.35, '#ffffff'], [874, 492, 0.5, 0.3, '#ffffff'],
    [350, 12, 0.8, 0.4, '#00b4ff'], [690, 15, 0.7, 0.35, '#7b2fff'],
    [28, 290, 0.6, 0.35, '#00b4ff'], [985, 355, 0.7, 0.35, '#7b2fff'],
  ];
  for (const [px, py, pr, pa, col] of pts) {
    ctx.globalAlpha = pa;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── MAGIC CIRCLE #1 — bottom-right ───────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.085;
  ctx.strokeStyle = '#3b5bff';
  ctx.lineWidth = 1.1;
  const mc1x = w - 115, mc1y = h - 105;
  [118, 90, 62, 36].forEach(r => {
    ctx.beginPath();
    ctx.arc(mc1x, mc1y, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 / 12) * i;
    ctx.beginPath();
    ctx.moveTo(mc1x + 36 * Math.cos(a), mc1y + 36 * Math.sin(a));
    ctx.lineTo(mc1x + 118 * Math.cos(a), mc1y + 118 * Math.sin(a));
    ctx.stroke();
  }
  // pentagram
  for (let i = 0; i < 5; i++) {
    const a1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const a2 = (Math.PI * 2 / 5) * ((i + 2) % 5) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(mc1x + 74 * Math.cos(a1), mc1y + 74 * Math.sin(a1));
    ctx.lineTo(mc1x + 74 * Math.cos(a2), mc1y + 74 * Math.sin(a2));
    ctx.stroke();
  }
  ctx.restore();

  // ── MAGIC CIRCLE #2 — top-left (partial) ─────────────────────
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = '#4466ff';
  ctx.lineWidth = 1.0;
  const mc2x = 55, mc2y = 55;
  [88, 64, 42].forEach(r => {
    ctx.beginPath();
    ctx.arc(mc2x, mc2y, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(mc2x + 42 * Math.cos(a), mc2y + 42 * Math.sin(a));
    ctx.lineTo(mc2x + 88 * Math.cos(a), mc2y + 88 * Math.sin(a));
    ctx.stroke();
  }
  ctx.restore();

  // ── RADIAL BURST — center (very faint) ───────────────────────
  ctx.save();
  ctx.globalAlpha = 0.028;
  ctx.strokeStyle = '#3366ff';
  ctx.lineWidth = 0.7;
  const bx = w * 0.5, by = h * 0.48;
  for (let i = 0; i < 48; i++) {
    const a = (Math.PI * 2 / 48) * i;
    ctx.beginPath();
    ctx.moveTo(bx + Math.cos(a) * 65, by + Math.sin(a) * 65);
    ctx.lineTo(bx + Math.cos(a) * 650, by + Math.sin(a) * 650);
    ctx.stroke();
  }
  // concentric rings
  [60, 120, 190, 270].forEach(r => {
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  // ── SLASH LINES — top-right corner ───────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = '#00b4ff';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(w - 75 + i * 11, 0);
    ctx.lineTo(w, 75 - i * 11);
    ctx.stroke();
  }
  ctx.restore();

  // ── SLASH LINES — bottom-left corner ─────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = '#7b2fff';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, h - 70 + i * 13);
    ctx.lineTo(70 - i * 13, h);
    ctx.stroke();
  }
  ctx.restore();

  // ════════════════════════════════════════════════════════════
  //  HEADER BAND  (y 0 → 72)
  // ════════════════════════════════════════════════════════════
  const headerH = 72;
  const hBg = ctx.createLinearGradient(0, 0, w, 0);
  hBg.addColorStop(0, 'rgba(0, 6, 28, 0.97)');
  hBg.addColorStop(0.5, 'rgba(0, 22, 72, 0.78)');
  hBg.addColorStop(1, 'rgba(0, 6, 28, 0.97)');
  ctx.fillStyle = hBg;
  ctx.fillRect(0, 0, w, headerH);

  // Top glow line
  const tLine = ctx.createLinearGradient(0, 0, w, 0);
  tLine.addColorStop(0, 'transparent');
  tLine.addColorStop(0.2, '#00b4ff');
  tLine.addColorStop(0.8, '#7b2fff');
  tLine.addColorStop(1, 'transparent');
  ctx.strokeStyle = tLine;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#00b4ff';
  ctx.beginPath();
  ctx.moveTo(0, 1.5);
  ctx.lineTo(w, 1.5);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Header bottom separator
  const hBot = ctx.createLinearGradient(0, 0, w, 0);
  hBot.addColorStop(0, 'transparent');
  hBot.addColorStop(0.25, '#00b4ff88');
  hBot.addColorStop(0.75, '#00b4ff88');
  hBot.addColorStop(1, 'transparent');
  ctx.strokeStyle = hBot;
  ctx.lineWidth = 1;
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#00b4ff';
  ctx.beginPath();
  ctx.moveTo(0, headerH);
  ctx.lineTo(w, headerH);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Left accent bar
  ctx.fillStyle = '#00b4ff';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00b4ff';
  ctx.fillRect(18, 15, 3, 42);
  ctx.shadowBlur = 0;

  // SYSTEM badge pill
  ctx.fillStyle = 'rgba(0, 180, 255, 0.10)';
  ctx.strokeStyle = '#00b4ff66';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.roundRect(26, 15, 88, 14, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#00b4ff';
  ctx.font = '7.5px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('◈  SYSTEM  WINDOW', 31, 25);

  // Main title
  ctx.shadowBlur = 14;
  ctx.shadowColor = '#00b4ff';
  ctx.fillStyle = '#f0f8ff';
  ctx.font = 'bold 23px "Impact", sans-serif';
  ctx.fillText("HUNTER'S IDENTIFICATION CARD", 26, 54);
  ctx.shadowBlur = 0;

  // Authority badge (right)
  ctx.fillStyle = 'rgba(80, 30, 200, 0.22)';
  ctx.strokeStyle = '#7b2fff';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#7b2fff';
  ctx.beginPath();
  ctx.roundRect(w - 220, 14, 206, 44, 4);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#a070ff';
  ctx.font = 'bold 7.5px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KOREAN HUNTERS ASSOCIATION', w - 117, 29);
  ctx.fillStyle = '#d8c8ff';
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.fillText('AUTHORIZED & CERTIFIED DOCUMENT', w - 117, 45);
  ctx.textAlign = 'left';

  // ════════════════════════════════════════════════════════════
  //  PHOTO ZONE  — identical sizing to Shadow Garden
  //  x=65  y=116  w=250  h=336
  // ════════════════════════════════════════════════════════════
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;

  // Photo background
  ctx.fillStyle = '#04091a';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Outer glow frame
  ctx.strokeStyle = '#00b4ff';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 16;
  ctx.shadowColor = '#00b4ff';
  ctx.strokeRect(photoX, photoY, photoW, photoH);
  ctx.shadowBlur = 0;

  // Inner thin border
  ctx.strokeStyle = '#1a3366';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(photoX + 3, photoY + 3, photoW - 6, photoH - 6);

  const drawPhotoCorners = () => {
    const len = 20;
    ctx.strokeStyle = '#00b4ff';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00b4ff';
    // TL
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
    ctx.stroke();
    // TR
    ctx.beginPath();
    ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
    ctx.stroke();
    // BL
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
    ctx.stroke();
    // BR
    ctx.beginPath();
    ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      const ar = img.width / img.height;
      const dr = photoW / photoH;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ar > dr) { sw = img.height * dr; sx = (img.width - sw) / 2; }
      else { sh = img.width / dr; sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
      ctx.restore();
      drawPhotoCorners();
    };
  } else {
    // Shadow silhouette placeholder
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#00b4ff';
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + 105, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(photoX + 20, photoY + photoH);
    ctx.quadraticCurveTo(photoX + photoW / 2, photoY + 158, photoX + photoW - 20, photoY + photoH);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    drawPhotoCorners();
  }

  // ── CORNER MARKS (card corners) ───────────────────────────────
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

  // ── RANK BADGE (below photo) ──────────────────────────────────
  const rankBadgeY = photoY + photoH + 8;
  const rankMap: Record<string, { color: string; label: string }> = {
    'S-CLASS':  { color: '#ffd700', label: '◆ SHADOW MONARCH CLASS ◆' },
    'A-CLASS':  { color: '#ff6622', label: '◆ NATIONAL LEVEL CLASS ◆' },
    'B-CLASS':  { color: '#aa44ff', label: '◆ HIGH GRADE CLASS ◆' },
    'GOD TIER': { color: '#ff2255', label: '⬡  MONARCH  TIER  ⬡' },
    'CIVILIAN': { color: '#4a5e77', label: '○  NON-AWAKENED  ○' },
  };
  const rk = rankMap[formData.classe] ?? { color: '#00b4ff', label: `◆ ${formData.classe} ◆` };

  ctx.fillStyle = `${rk.color}16`;
  ctx.strokeStyle = rk.color;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 12;
  ctx.shadowColor = rk.color;
  ctx.beginPath();
  ctx.roundRect(photoX, rankBadgeY, photoW, 30, 4);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = rk.color;
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.shadowBlur = 8;
  ctx.shadowColor = rk.color;
  ctx.fillText(rk.label, photoX + photoW / 2, rankBadgeY + 20);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';

  // ── MP / POWER BAR ────────────────────────────────────────────
  const barY = rankBadgeY + 40;
  ctx.fillStyle = '#080820';
  ctx.strokeStyle = '#111a33';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(photoX, barY, photoW, 14, 7);
  ctx.fill();
  ctx.stroke();

  const pct = Math.min(Math.max(formData.powerLevel / 100, 0), 1);
  if (pct > 0) {
    const barG = ctx.createLinearGradient(photoX, 0, photoX + photoW, 0);
    barG.addColorStop(0, '#0033ff');
    barG.addColorStop(0.5, '#00b4ff');
    barG.addColorStop(1, '#7b2fff');
    ctx.fillStyle = barG;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00b4ff';
    ctx.beginPath();
    ctx.roundRect(photoX, barY, photoW * pct, 14, 7);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7.5px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`MANA  ${formData.powerLevel} / 100`, photoX + photoW / 2, barY + 10);
  ctx.textAlign = 'left';

  // ── MINI FIELDS under bar ────────────────────────────────────
  const drawMini = (label: string, val: string, x: number, y: number) => {
    ctx.fillStyle = '#2a3a55';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#c8deff';
    ctx.font = 'bold 14px sans-serif';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#00b4ff66';
    ctx.fillText(val.toUpperCase(), x, y + 16);
    ctx.shadowBlur = 0;
  };
  drawMini('[ NAISSANCE ]', formData.dateNaissance, photoX, barY + 32);
  drawMini('[ SEXE ]',      formData.sexe,           photoX + 138, barY + 32);
  drawMini('[ EXPIRATION ]', formData.dateExpiration, photoX, barY + 68);
  drawMini('[ MEMBRE DEP. ]', formData.membreDepuis,  photoX + 138, barY + 68);

  // ── VERTICAL DIVIDER ──────────────────────────────────────────
  const divX = 358;
  const divG = ctx.createLinearGradient(0, headerH, 0, h - 58);
  divG.addColorStop(0, 'transparent');
  divG.addColorStop(0.15, '#00b4ff');
  divG.addColorStop(0.85, '#7b2fff');
  divG.addColorStop(1, 'transparent');
  ctx.strokeStyle = divG;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(divX, headerH + 4);
  ctx.lineTo(divX, h - 60);
  ctx.stroke();

  // ════════════════════════════════════════════════════════════
  //  RIGHT CONTENT  (startX = 380)
  // ════════════════════════════════════════════════════════════
  const startX = 380;

  // ── Name block ───────────────────────────────────────────────
  ctx.fillStyle = '#2a6699';
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillText('[ HUNTER DESIGNATION ]', startX, 134);

  ctx.shadowBlur = 14;
  ctx.shadowColor = 'rgba(0, 140, 255, 0.55)';
  ctx.fillStyle = '#f0f8ff';
  ctx.font = 'bold 30px "Impact", sans-serif';
  ctx.fillText(`${formData.nom}  ${formData.prenom}`, startX, 163);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#00b4ff';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#00b4ff';
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillText(`❖  ${formData.pseudo}`, startX, 184);
  ctx.shadowBlur = 0;

  // Separator
  const sepG = ctx.createLinearGradient(startX, 0, startX + 610, 0);
  sepG.addColorStop(0, '#00b4ff');
  sepG.addColorStop(0.7, '#7b2fff55');
  sepG.addColorStop(1, 'transparent');
  ctx.strokeStyle = sepG;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, 196);
  ctx.lineTo(startX + 610, 196);
  ctx.stroke();

  // ── Field helper ─────────────────────────────────────────────
  const drawField = (label: string, value: string, x: number, y: number, bw: number, accentColor = '#1a3a66') => {
    // Box bg
    ctx.fillStyle = 'rgba(4, 12, 35, 0.80)';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.roundRect(x, y, bw, 44, 3);
    ctx.fill();
    ctx.stroke();
    // Blue top accent line
    const topAccent = ctx.createLinearGradient(x, 0, x + bw, 0);
    topAccent.addColorStop(0, accentColor);
    topAccent.addColorStop(1, 'transparent');
    ctx.strokeStyle = topAccent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 1);
    ctx.lineTo(x + bw * 0.6, y + 1);
    ctx.stroke();
    // Label
    ctx.fillStyle = '#3a6a99';
    ctx.font = '8px "Courier New", monospace';
    ctx.fillText(label.toUpperCase(), x + 8, y + 14);
    // Value
    ctx.fillStyle = '#d0e8ff';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText(value.toUpperCase(), x + 8, y + 33);
  };

  // Field layout — rows at same Y as Shadow Garden for proven sizing
  const totalW = 608; // total right width for fields (excludes QR area right margin)

  // Row 1: NOM & PRÉNOMS (large, full width)
  drawField('NOM & PRÉNOMS', `${formData.nom}  ${formData.prenom}`, startX, 206, totalW, '#1a4a77');

  // Row 2: PSEUDO (full width)
  drawField('PSEUDO / ALIAS', formData.pseudo, startX, 258, totalW, '#1a3a66');

  // Row 3: NATIONALITÉ + NO. DE SÉRIE
  const c3a = 320, c3b = totalW - c3a - 8;
  drawField('NATIONALITÉ', formData.nationalite, startX, 310, c3a, '#1a4466');
  drawField('NO. DE SÉRIE', formData.noCarte, startX + c3a + 8, 310, c3b, '#2a1a55');

  // Power level label + bar
  ctx.fillStyle = '#2a6699';
  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillText('[ NIVEAU DE PUISSANCE / MANA ]', startX, 370);

  const barW2 = totalW;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));
  ctx.fillStyle = '#060f28';
  ctx.strokeStyle = '#1a2a44';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(startX, 378, barW2, 16, 3);
  ctx.fill();
  ctx.stroke();
  if (power > 0) {
    const g = ctx.createLinearGradient(startX, 0, startX + barW2, 0);
    g.addColorStop(0, '#0033ff');
    g.addColorStop(0.5, '#00b4ff');
    g.addColorStop(0.88, '#7b2fff');
    g.addColorStop(1, '#ffffff');
    ctx.fillStyle = g;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#00b4ff';
    ctx.beginPath();
    ctx.roundRect(startX, 378, (barW2 * power) / 100, 16, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  if (power >= 95) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#7b2fff';
    ctx.font = 'italic bold 11px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('— ARISE —', startX + barW2, 374);
    ctx.textAlign = 'left';
    ctx.shadowBlur = 0;
  }

  // Row 4: CLASSE + EXPERTISE
  const c4a = 175, c4b = totalW - c4a - 8;
  drawField('CLASSE DE COMBAT', formData.classe, startX, 404, c4a, '#2a1a55');
  drawField('EXPERTISE / POUVOIRS', formData.expertise, startX + c4a + 8, 404, c4b, '#1a3a66');

  // ── QR CODE ───────────────────────────────────────────────────
  const qrX = 840, qrY = 445, qrSize = 118;

  // QR backdrop
  ctx.fillStyle = '#03081e';
  ctx.strokeStyle = '#00b4ff';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00b4ff';
  ctx.beginPath();
  ctx.roundRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 4);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // QR corner clips
  const qcLen = 10;
  ctx.strokeStyle = '#00b4ff';
  ctx.lineWidth = 1.5;
  [[qrX, qrY, 1, 1], [qrX + qrSize, qrY, -1, 1], [qrX, qrY + qrSize, 1, -1], [qrX + qrSize, qrY + qrSize, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(cx + dx * qcLen, cy as number);
    ctx.lineTo(cx as number, cy as number);
    ctx.lineTo(cx as number, cy + dy * qcLen);
    ctx.stroke();
  });

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#00c8ff', light: '#03081e' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#00b4ff66';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  ctx.fillStyle = '#2a4466';
  ctx.font = '8px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('◈ SYSTEM LINK ◈', qrX + qrSize / 2, qrY + qrSize + 14);
  ctx.textAlign = 'left';

  // ── SOLO LEVELING watermark ────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#3355ff';
  ctx.font = 'bold 52px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SOLO LEVELING', w / 2, h / 2 + 14);
  ctx.restore();

  // ════════════════════════════════════════════════════════════
  //  MRZ ZONE  (y 577 → 638)
  // ════════════════════════════════════════════════════════════
  const { line2: mrzLine } = generateMRZ(formData);
  const mrzY = 577;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
  ctx.fillRect(0, mrzY, w, h - mrzY);

  // MRZ top border glow
  const mrzBG = ctx.createLinearGradient(0, 0, w, 0);
  mrzBG.addColorStop(0, 'transparent');
  mrzBG.addColorStop(0.2, '#00b4ff');
  mrzBG.addColorStop(0.8, '#7b2fff');
  mrzBG.addColorStop(1, 'transparent');
  ctx.strokeStyle = mrzBG;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00b4ff';
  ctx.beginPath();
  ctx.moveTo(0, mrzY);
  ctx.lineTo(w, mrzY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#00c8ff';
  ctx.font = '19px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 20, mrzY + 36, w - 40);

  ctx.restore(); // end card clip
}
