import QRCode from 'qrcode';
import { FormData } from '../types';

export function renderShadowGarden(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Void black background
  ctx.fillStyle = '#040408';
  ctx.fillRect(0, 0, w, h);

  // Obsidian center glow
  const centerGlow = ctx.createRadialGradient(w * 0.55, h * 0.5, 0, w * 0.55, h * 0.5, 400);
  centerGlow.addColorStop(0, 'rgba(26, 26, 46, 0.55)');
  centerGlow.addColorStop(1, 'rgba(26, 26, 46, 0)');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, w, h);

  // Purple rim glow top
  const rimTop = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 0, 380);
  rimTop.addColorStop(0, 'rgba(90, 0, 255, 0.14)');
  rimTop.addColorStop(1, 'rgba(90, 0, 255, 0)');
  ctx.fillStyle = rimTop;
  ctx.fillRect(0, 0, w, h);

  // Purple rim glow bottom
  const rimBottom = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, 320);
  rimBottom.addColorStop(0, 'rgba(108, 48, 130, 0.18)');
  rimBottom.addColorStop(1, 'rgba(108, 48, 130, 0)');
  ctx.fillStyle = rimBottom;
  ctx.fillRect(0, 0, w, h);

  // ━━━ I AM ATOMIC — radiating burst lines from card center ━━━
  ctx.save();
  ctx.globalAlpha = 0.042;
  ctx.strokeStyle = '#5A00FF';
  ctx.lineWidth = 0.8;
  const ax = w * 0.5, ay = h * 0.5;
  for (let i = 0; i < 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(ax + Math.cos(angle) * 70, ay + Math.sin(angle) * 70);
    ctx.lineTo(ax + Math.cos(angle) * 900, ay + Math.sin(angle) * 900);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Atomic concentric circles
  ctx.save();
  ctx.globalAlpha = 0.055;
  ctx.strokeStyle = '#C8A8E9';
  ctx.lineWidth = 1;
  for (let r = 55; r <= 330; r += 55) {
    ctx.beginPath();
    ctx.arc(ax, ay, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Shadow tendrils (wave curves)
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.strokeStyle = '#2D1B69';
  ctx.lineWidth = 2;
  for (let t = 0; t < 5; t++) {
    const baseY = 70 + t * 120;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = baseY + Math.sin((x / w) * Math.PI * 5 + t * 1.1) * 22;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Particle field (lavender/silver)
  const particles: [number, number, number, number][] = [
    [118, 44, 1.4, 0.7], [285, 20, 1.0, 0.5], [502, 36, 1.2, 0.6],
    [698, 16, 0.8, 0.4], [882, 40, 1.3, 0.6], [952, 17, 0.7, 0.5],
    [58, 582, 1.0, 0.5], [228, 602, 0.8, 0.4], [448, 614, 1.1, 0.5],
    [662, 596, 0.9, 0.5], [842, 606, 0.7, 0.4], [986, 586, 1.0, 0.4],
    [28, 282, 0.7, 0.4], [992, 318, 0.8, 0.4], [172, 158, 0.6, 0.3],
    [822, 192, 0.9, 0.4], [382, 68, 0.7, 0.4], [762, 52, 0.8, 0.4],
    [44, 148, 0.6, 0.3], [980, 448, 0.7, 0.3],
  ];
  ctx.fillStyle = '#C8A8E9';
  for (const [px, py, pr, pa] of particles) {
    ctx.globalAlpha = pa;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Corner marks (silver with indigo glow)
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    const len = 28;
    ctx.strokeStyle = '#B0B0C8';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#5A00FF';
    ctx.beginPath();
    ctx.moveTo(x + dx * len, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * len);
    ctx.stroke();
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.38;
    ctx.beginPath();
    ctx.moveTo(x + dx * len, y + dy * 6);
    ctx.lineTo(x + dx * 6, y + dy * len);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  drawCorner(12, 12, 1, 1);
  drawCorner(w - 12, 12, -1, 1);
  drawCorner(12, h - 12, 1, -1);
  drawCorner(w - 12, h - 12, -1, -1);

  // "SHADOW GARDEN" watermark top-right
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#2D1B69';
  ctx.textAlign = 'right';
  ctx.fillText('SHADOW GARDEN — 七陰', w - 28, 18);

  // Title with electric indigo glow
  ctx.shadowBlur = 24;
  ctx.shadowColor = '#5A00FF';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;

  // Separator
  ctx.strokeStyle = '#5A00FF';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(50, 88);
  ctx.lineTo(w - 50, 88);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // "I AM ATOMIC" subtle inscription bottom corner
  ctx.save();
  ctx.font = 'italic bold 11px monospace';
  ctx.fillStyle = '#2D1B69';
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#5A00FF';
  ctx.textAlign = 'right';
  ctx.fillText('— I AM ATOMIC —', w - 28, h - 62);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Photo zone
  const photoX = 65, photoY = 116, photoW = 250, photoH = 336;
  ctx.fillStyle = '#04040a';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawFrame = (x: number, y: number, pw: number, ph: number) => {
    const len = 24;
    ctx.strokeStyle = '#B0B0C8';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#5A00FF';
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + pw - len, y); ctx.lineTo(x + pw, y); ctx.lineTo(x + pw, y + len);
    ctx.moveTo(x, y + ph - len); ctx.lineTo(x, y + ph); ctx.lineTo(x + len, y + ph);
    ctx.moveTo(x + pw - len, y + ph); ctx.lineTo(x + pw, y + ph); ctx.lineTo(x + pw, y + ph - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#2D1B69';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.55;
    ctx.strokeRect(x + 3, y + 3, pw - 6, ph - 6);
    ctx.globalAlpha = 1;
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      drawFrame(photoX, photoY, photoW, photoH);
    };
  } else {
    drawFrame(photoX, photoY, photoW, photoH);
  }

  // Data fields
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#C8A8E9';
    ctx.fillText(label, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#e8f4ff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#5A00FF';
    ctx.fillText(value.toUpperCase(), x, y + 30);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#2D1B69';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(x, y + 38);
    ctx.lineTo(x + 530, y + 38);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#C8A8E9';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#e8f4ff';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 263);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 315, 263);

  // Power bar
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#C8A8E9';
  ctx.fillText('NIVEAU DE PUISSANCE', startX, 322);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#08080f';
  ctx.beginPath();
  ctx.roundRect(startX, 332, barWidth, 16, 3);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#2D1B69');
    grad.addColorStop(0.55, '#5A00FF');
    grad.addColorStop(0.88, '#C8A8E9');
    grad.addColorStop(1, '#ffffff');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#5A00FF';
    ctx.roundRect(startX, 332, (barWidth * power) / 100, 16, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // "I AM ATOMIC" flash when power >= 95
  if (power >= 95) {
    ctx.font = 'italic bold 13px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#5A00FF';
    ctx.textAlign = 'right';
    ctx.fillText('I AM ATOMIC', startX + barWidth, 329);
    ctx.textAlign = 'left';
    ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 390);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 458, 22);

  // QR
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#040408';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#5A00FF';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#5A00FF';
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  ctx.shadowBlur = 0;

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#5A00FF', light: '#040408' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#5A00FF';
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // Mini info strip under photo
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#C8A8E9';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#e8f4ff';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#5A00FF';
    ctx.fillText(value.toUpperCase(), x, y + 16);
    ctx.shadowBlur = 0;
  };
  drawMiniField('NAISSANCE', formData.dateNaissance, 70, 470);
  drawMiniField('SEXE', formData.sexe, 215, 470);
  drawMiniField('EXPIRATION', formData.dateExpiration, 70, 505);
  drawMiniField('MEMBRE DEP.', formData.membreDepuis, 215, 505);

  // MRZ
  ctx.fillStyle = 'rgba(0,0,0,0.88)';
  ctx.fillRect(40, 577, w - 80, 43);
  ctx.strokeStyle = '#2D1B69';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;
  ctx.strokeRect(40, 577, w - 80, 43);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#B0B0C8';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(formData.mrzLine, 60, 604);
}
