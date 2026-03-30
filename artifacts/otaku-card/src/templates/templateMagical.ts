import QRCode from 'qrcode';
import { FormData } from '../types';
import { generateMRZ } from '../lib/mrz';

export function renderMagical(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const bgGradient = ctx.createLinearGradient(0, 0, w, h);
  bgGradient.addColorStop(0, '#0e0018');
  bgGradient.addColorStop(0.5, '#180022');
  bgGradient.addColorStop(1, '#0a0015');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, w, h);

  const centerGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 480);
  centerGlow.addColorStop(0, 'rgba(168, 85, 247, 0.09)');
  centerGlow.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
  centerGlow.addColorStop(1, 'rgba(236, 72, 153, 0)');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, w, h);

  const starPositions: [number, number, number, number][] = [
    [80, 38, 1.2, 0.8], [205, 18, 0.8, 0.6], [410, 28, 1.0, 0.7],
    [580, 14, 0.7, 0.5], [720, 42, 1.1, 0.9], [880, 22, 0.9, 0.7],
    [960, 50, 0.8, 0.6], [145, 595, 1.0, 0.7], [340, 612, 0.8, 0.5],
    [530, 598, 1.2, 0.8], [680, 608, 0.7, 0.6], [820, 592, 1.0, 0.7],
    [945, 575, 0.8, 0.5], [30, 310, 0.7, 0.4], [988, 265, 1.0, 0.6],
    [165, 135, 0.7, 0.5], [460, 85, 0.9, 0.7], [790, 72, 1.1, 0.8],
    [55, 480, 0.8, 0.6], [600, 530, 0.7, 0.5], [300, 52, 0.6, 0.4],
    [750, 560, 0.9, 0.6], [870, 320, 0.6, 0.4], [110, 200, 0.7, 0.5],
  ];
  ctx.fillStyle = '#ffffff';
  for (const [sx, sy, sr, sa] of starPositions) {
    ctx.globalAlpha = sa;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const drawSparkle = (x: number, y: number, size: number, color: string) => {
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.28, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size * 0.28, y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  drawSparkle(42, 42, 14, '#ec4899');
  drawSparkle(968, 55, 11, '#a855f7');
  drawSparkle(28, 598, 9, '#ec4899');
  drawSparkle(982, 585, 11, '#a855f7');
  drawSparkle(505, 22, 8, '#f0abfc');
  drawSparkle(190, 618, 7, '#a855f7');
  drawSparkle(800, 32, 6, '#ec4899');

  ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(130, 0);
  ctx.lineTo(0, 130);
  ctx.fill();

  ctx.fillStyle = 'rgba(236, 72, 153, 0.18)';
  ctx.beginPath();
  ctx.moveTo(w, h);
  ctx.lineTo(w - 130, h);
  ctx.lineTo(w, h - 130);
  ctx.fill();

  ctx.shadowBlur = 28;
  ctx.shadowColor = '#ec4899';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.moveTo(80, 95);
  ctx.lineTo(w - 80, 95);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const photoX = 65, photoY = 122, photoW = 250, photoH = 332;

  const photoGlow = ctx.createRadialGradient(photoX + photoW / 2, photoY + photoH / 2, 0, photoX + photoW / 2, photoY + photoH / 2, 200);
  photoGlow.addColorStop(0, 'rgba(236, 72, 153, 0.14)');
  photoGlow.addColorStop(1, 'rgba(236, 72, 153, 0)');
  ctx.fillStyle = photoGlow;
  ctx.fillRect(photoX - 30, photoY - 30, photoW + 60, photoH + 60);

  ctx.fillStyle = '#0d0015';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawMagicalBorder = (x: number, y: number, pw: number, ph: number) => {
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ec4899';
    ctx.strokeRect(x, y, pw, ph);
    ctx.shadowBlur = 0;
    drawSparkle(x, y, 9, '#ec4899');
    drawSparkle(x + pw, y, 9, '#a855f7');
    drawSparkle(x, y + ph, 9, '#a855f7');
    drawSparkle(x + pw, y + ph, 9, '#ec4899');
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      drawMagicalBorder(photoX, photoY, photoW, photoH);
    };
  } else {
    drawMagicalBorder(photoX, photoY, photoW, photoH);
  }

  ctx.textAlign = 'left';
  const startX = 365;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`✦ ${label}`, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#fce7f3';
    ctx.shadowBlur = 7;
    ctx.shadowColor = '#ec4899';
    ctx.fillText(value.toUpperCase(), x, y + 30);
    ctx.shadowBlur = 0;
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 260);
  drawField('NO. DE SÉRIE', formData.noCarte, startX + 295, 260, 18);

  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#a855f7';
  ctx.fillText('✦ NIVEAU DE PUISSANCE', startX, 318);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#0d0018';
  ctx.beginPath();
  ctx.roundRect(startX, 328, barWidth, 16, 8);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#7c3aed');
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#ec4899');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ec4899';
    ctx.roundRect(startX, 328, (barWidth * power) / 100, 16, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 384);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 455, 22);

  const qrX = 838, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#0d0015';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#ec4899', light: '#0d0015' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // Mini info strip under photo
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#fce7f3';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#ec4899';
    ctx.fillText(value.toUpperCase(), x, y + 16);
    ctx.shadowBlur = 0;
  };
  drawMiniField('✦ NAISSANCE', formData.dateNaissance, 70, 472);
  drawMiniField('✦ SEXE', formData.sexe, 215, 472);
  drawMiniField('✦ EXPIRATION', formData.dateExpiration, 70, 507);
  drawMiniField('✦ MEMBRE DEP.', formData.membreDepuis, 215, 507);

  const { line2: mrzLine } = generateMRZ(formData);
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(40, 575, w - 80, 45);
  ctx.fillStyle = '#a855f7';
  ctx.font = '19px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(mrzLine, 44, 604);
}
