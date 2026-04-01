import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ, fillMRZText } from '../lib/mrz';

function drawDragonBall(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, stars: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.05, cx, cy, r);
  grad.addColorStop(0, '#ffdd44');
  grad.addColorStop(0.6, '#ff8800');
  grad.addColorStop(1, '#cc4400');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#cc6600'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  // Stars
  ctx.fillStyle = '#cc2200';
  const posMap: Record<number, number[][]> = {
    1: [[0,0]],
    2: [[-r*0.28,0],[r*0.28,0]],
    3: [[-r*0.28,-r*0.15],[r*0.28,-r*0.15],[0,r*0.25]],
    4: [[-r*0.28,-r*0.2],[r*0.28,-r*0.2],[-r*0.28,r*0.2],[r*0.28,r*0.2]],
    5: [[-r*0.28,-r*0.2],[r*0.28,-r*0.2],[0,0],[-r*0.28,r*0.2],[r*0.28,r*0.2]],
    6: [[-r*0.28,-r*0.22],[r*0.28,-r*0.22],[-r*0.4,0],[r*0.4,0],[-r*0.28,r*0.22],[r*0.28,r*0.22]],
    7: [[-r*0.28,-r*0.22],[r*0.28,-r*0.22],[0,-r*0.22],[-r*0.38,r*0.08],[r*0.38,r*0.08],[-r*0.18,r*0.28],[r*0.18,r*0.28]],
  };
  const positions = posMap[stars] || posMap[1];
  for (const [sx, sy] of positions) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const ai = a + Math.PI / 5;
      const pr = r * 0.14;
      const ir = r * 0.06;
      i === 0 ? ctx.moveTo(cx + sx + pr * Math.cos(a), cy + sy + pr * Math.sin(a)) :
        ctx.lineTo(cx + sx + pr * Math.cos(a), cy + sy + pr * Math.sin(a));
      ctx.lineTo(cx + sx + ir * Math.cos(ai), cy + sy + ir * Math.sin(ai));
    }
    ctx.closePath(); ctx.fill();
  }
  // Shine
  ctx.globalAlpha = 0.3;
  const shine = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 0, cx - r * 0.2, cy - r * 0.25, r * 0.5);
  shine.addColorStop(0, '#ffffff'); shine.addColorStop(1, 'transparent');
  ctx.fillStyle = shine;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function renderDragonBall(
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
  bgGrad.addColorStop(0, '#0a0500');
  bgGrad.addColorStop(0.5, '#120900');
  bgGrad.addColorStop(1, '#080400');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Gold aura top center
  const aura = ctx.createRadialGradient(w / 2, -100, 0, w / 2, -100, 600);
  aura.addColorStop(0, 'rgba(255, 200, 0, 0.22)');
  aura.addColorStop(0.5, 'rgba(255, 120, 0, 0.10)');
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, w, h);

  // Orange glow bottom left
  const glow2 = ctx.createRadialGradient(0, h, 0, 0, h, 350);
  glow2.addColorStop(0, 'rgba(200, 80, 0, 0.18)');
  glow2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

  // ── ENERGY BURST RAYS from center ────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 1;
  const bx = w * 0.5, by = h * 0.45;
  for (let i = 0; i < 36; i++) {
    const a = (Math.PI * 2 / 36) * i;
    ctx.beginPath();
    ctx.moveTo(bx + Math.cos(a) * 50, by + Math.sin(a) * 50);
    ctx.lineTo(bx + Math.cos(a) * 800, by + Math.sin(a) * 800);
    ctx.stroke();
  }
  ctx.restore();

  // ── DRAGON BALLS scattered in background ─────────────────────
  drawDragonBall(ctx, 900, 180, 28, 7, 0.12);
  drawDragonBall(ctx, 840, 90, 18, 4, 0.09);
  drawDragonBall(ctx, 950, 380, 14, 2, 0.08);
  drawDragonBall(ctx, 30, 550, 16, 6, 0.08);
  drawDragonBall(ctx, 180, 580, 12, 1, 0.07);

  // ── CORNER MARKS ─────────────────────────────────────────────
  [[8, 8, 1, 1], [w - 8, 8, -1, 1], [8, h - 8, 1, -1], [w - 8, h - 8, -1, -1]].forEach(([cx, cy, dx, dy]) => {
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8; ctx.shadowColor = '#ffdd00';
    ctx.beginPath();
    ctx.moveTo(cx + dx * 22, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * 22);
    ctx.stroke(); ctx.shadowBlur = 0;
  });

  // ── TITLE ─────────────────────────────────────────────────────
  ctx.save();
  ctx.shadowBlur = 24; ctx.shadowColor = '#ffaa00';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#3d1a00';
  ctx.textAlign = 'right';
  ctx.fillText('ドラゴンボール — REGISTRE DES GUERRIERS', w - 28, 18);

  const sepG = ctx.createLinearGradient(50, 0, w - 50, 0);
  sepG.addColorStop(0, 'transparent');
  sepG.addColorStop(0.3, '#ffaa00');
  sepG.addColorStop(0.7, '#ff6600');
  sepG.addColorStop(1, 'transparent');
  ctx.strokeStyle = sepG; ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.65; ctx.shadowBlur = 8; ctx.shadowColor = '#ffaa00';
  ctx.beginPath(); ctx.moveTo(50, 88); ctx.lineTo(w - 50, 88); ctx.stroke();
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;

  // ── PHOTO ZONE ───────────────────────────────────────────────
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#0a0500'; ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawFrame = () => {
    const len = 24;
    ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12; ctx.shadowColor = '#ffdd00';
    ctx.beginPath();
    ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
    ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
    ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
    ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffaa0044'; ctx.lineWidth = 1;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => { ctx.drawImage(img, photoX, photoY, photoW, photoH); drawFrame(); };
  } else { drawFrame(); }

  // Dragon ball decoration on photo frame
  drawDragonBall(ctx, photoX + photoW - 20, photoY + 20, 14, 4, 0.7);

  // ── DATA FIELDS ───────────────────────────────────────────────
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#cc6600';
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#fff5cc';
    ctx.shadowBlur = 4; ctx.shadowColor = '#ffaa0033';
    ctx.fillText(value.toUpperCase(), x, y + 30); ctx.shadowBlur = 0;
    const lg = ctx.createLinearGradient(x, 0, x + 590, 0);
    lg.addColorStop(0, '#ffaa0055'); lg.addColorStop(1, 'transparent');
    ctx.strokeStyle = lg; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(x, y + 38); ctx.lineTo(x + 590, y + 38); ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#cc6600';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#fff5cc';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 315, 263);

  ctx.font = 'bold 11px "Courier New", monospace';
  ctx.fillStyle = '#cc6600';
  ctx.fillText('NIVEAU DE PUISSANCE', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));
  ctx.fillStyle = '#0a0500'; ctx.strokeStyle = '#1a0800'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(startX, 332, barWidth, 16, 3); ctx.fill(); ctx.stroke();

  if (power > 0) {
    const bg = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    bg.addColorStop(0, '#cc4400'); bg.addColorStop(0.4, '#ff8800');
    bg.addColorStop(0.75, '#ffcc00'); bg.addColorStop(1, '#ffffff');
    ctx.fillStyle = bg;
    ctx.shadowBlur = 16; ctx.shadowColor = '#ffaa00';
    ctx.beginPath(); ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3); ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (power >= 95) {
    ctx.font = 'italic bold 13px "Courier New", monospace';
    ctx.fillStyle = '#ffdd00';
    ctx.shadowBlur = 18; ctx.shadowColor = '#ffaa00';
    ctx.textAlign = 'right';
    ctx.fillText('— OVER 9000! —', startX + barWidth, 328);
    ctx.textAlign = 'left'; ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // ── QR CODE ──────────────────────────────────────────────────
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#0a0500'; ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8; ctx.shadowColor = '#ffdd00';
  ctx.strokeRect(qrX, qrY, qrSize, qrSize); ctx.shadowBlur = 0;
  drawDragonBall(ctx, qrX + qrSize / 2, qrY - 20, 12, 7, 0.8);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize, margin: 1,
    color: { dark: '#ffaa00', light: '#0a0500' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6; ctx.shadowColor = '#ffdd00';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize); ctx.shadowBlur = 0;
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ── MINI FIELDS ──────────────────────────────────────────────
  const drawMini = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillStyle = '#cc6600';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ffe090';
    ctx.fillText(value.toUpperCase(), x, y + 16);
  };
  drawMini('[ NAISSANCE ]', formData.dateNaissance, 70, 470);
  drawMini('[ SEXE ]', formData.sexe, 215, 470);
  drawMini('[ EXPIRATION ]', formData.dateExpiration, 70, 505);
  drawMini('[ MEMBRE DEP. ]', formData.membreDepuis, 215, 505);

  // ── MRZ ──────────────────────────────────────────────────────
  const { line2: mrzLine } = generateMRZ(formData);
  ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(40, 577, w - 80, 43);
  const mrzG = ctx.createLinearGradient(40, 0, 40 + (w - 80), 0);
  mrzG.addColorStop(0, 'transparent'); mrzG.addColorStop(0.25, '#ffaa00');
  mrzG.addColorStop(0.75, '#ff6600'); mrzG.addColorStop(1, 'transparent');
  ctx.strokeStyle = mrzG; ctx.lineWidth = 1.5;
  ctx.shadowBlur = 5; ctx.shadowColor = '#ffaa00';
  ctx.beginPath(); ctx.moveTo(40, 577); ctx.lineTo(40 + (w - 80), 577); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffcc55';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  fillMRZText(ctx, mrzLine, 44, 604, w - 92);

  ctx.restore();
}
