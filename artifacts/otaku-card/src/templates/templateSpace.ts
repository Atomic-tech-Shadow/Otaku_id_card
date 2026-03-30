import QRCode from 'qrcode';
import { FormData } from '../types';

export function renderSpace(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  const starData: [number, number, number, number][] = [
    [85, 42, 1.5, 0.9], [210, 18, 1.0, 0.7], [380, 55, 0.8, 0.5],
    [520, 28, 1.2, 0.8], [670, 15, 0.7, 0.6], [820, 48, 1.1, 0.9],
    [950, 32, 0.9, 0.7], [140, 580, 1.0, 0.6], [320, 610, 0.8, 0.8],
    [490, 595, 1.3, 0.7], [650, 605, 0.7, 0.5], [780, 590, 1.0, 0.9],
    [920, 575, 0.8, 0.6], [60, 310, 0.6, 0.4], [990, 280, 1.0, 0.7],
    [175, 120, 0.7, 0.5], [430, 90, 0.9, 0.6], [750, 70, 1.1, 0.8],
    [880, 150, 0.6, 0.5], [35, 480, 0.8, 0.7], [560, 510, 0.7, 0.4],
    [700, 530, 0.9, 0.6], [260, 350, 0.5, 0.3], [940, 420, 0.8, 0.5],
    [120, 390, 0.6, 0.4], [480, 200, 0.7, 0.6], [810, 230, 1.0, 0.7],
    [330, 180, 0.5, 0.3], [640, 170, 0.8, 0.5], [55, 150, 0.6, 0.4],
    [970, 130, 0.7, 0.5], [290, 490, 0.6, 0.4], [750, 480, 0.8, 0.5],
  ];

  ctx.fillStyle = '#ffffff';
  for (const [sx, sy, sr, sa] of starData) {
    ctx.globalAlpha = sa;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.025;
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1;
  for (let y = 60; y < h; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 60; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const drawCornerMark = (x: number, y: number, dx: number, dy: number) => {
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#06b6d4';
    const len = 22;
    ctx.beginPath();
    ctx.moveTo(x + dx * len, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * len);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  drawCornerMark(12, 12, 1, 1);
  drawCornerMark(w - 12, 12, -1, 1);
  drawCornerMark(12, h - 12, 1, -1);
  drawCornerMark(w - 12, h - 12, -1, -1);

  ctx.shadowBlur = 18;
  ctx.shadowColor = '#06b6d4';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.moveTo(50, 93);
  ctx.lineTo(w - 50, 93);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const photoX = 65, photoY = 118, photoW = 250, photoH = 332;
  ctx.fillStyle = '#030303';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawSpaceCorners = (x: number, y: number, pw: number, ph: number) => {
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#06b6d4';
    const len = 20;
    ctx.beginPath();
    ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
    ctx.moveTo(x + pw - len, y); ctx.lineTo(x + pw, y); ctx.lineTo(x + pw, y + len);
    ctx.moveTo(x, y + ph - len); ctx.lineTo(x, y + ph); ctx.lineTo(x + len, y + ph);
    ctx.moveTo(x + pw - len, y + ph); ctx.lineTo(x + pw, y + ph); ctx.lineTo(x + pw, y + ph - len);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  if (photo) {
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      ctx.drawImage(img, photoX, photoY, photoW, photoH);
      drawSpaceCorners(photoX, photoY, photoW, photoH);
    };
  } else {
    drawSpaceCorners(photoX, photoY, photoW, photoH);
  }

  ctx.textAlign = 'left';
  const startX = 365;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = '11px monospace';
    ctx.fillStyle = '#0d9488';
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#06b6d4';
    ctx.fillText(value.toUpperCase(), x, y + 28);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#164e63';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 36);
    ctx.lineTo(x + 540, y + 36);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = '11px monospace';
    ctx.fillStyle = '#0d9488';
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(value.toUpperCase(), x, y + 24);
  };

  drawField('AGENT', `${formData.nom} ${formData.prenom}`, startX, 148);
  drawField('ORIGINE', formData.nationalite, startX, 226);
  drawFieldSmall('ID NO.', formData.noCarte, startX + 320, 226);

  ctx.font = '11px monospace';
  ctx.fillStyle = '#0d9488';
  ctx.fillText('NIVEAU DE PUISSANCE', startX, 305);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#0a1a1a';
  ctx.beginPath();
  ctx.roundRect(startX, 313, barWidth, 14, 2);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#134e4a');
    grad.addColorStop(0.5, '#0d9488');
    grad.addColorStop(1, '#06b6d4');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#06b6d4';
    ctx.roundRect(startX, 313, (barWidth * power) / 100, 14, 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#06b6d4';
  ctx.textAlign = 'right';
  ctx.fillText(`${power}%`, startX + barWidth, 311);
  ctx.textAlign = 'left';

  drawField('GRADE', formData.classe, startX, 378);
  drawField('COMPÉTENCES', formData.expertise, startX, 452, 22);

  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#020202';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#06b6d4', light: '#020202' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  ctx.fillStyle = 'rgba(0,0,0,0.80)';
  ctx.fillRect(40, 577, w - 80, 43);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.5;
  ctx.strokeRect(40, 577, w - 80, 43);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#06b6d4';
  ctx.font = '18px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(formData.mrzLine, 60, 604);
}
