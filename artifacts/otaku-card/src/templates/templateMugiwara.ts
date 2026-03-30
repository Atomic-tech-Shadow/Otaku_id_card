import QRCode from 'qrcode';
import { FormData } from '../types';

export function renderMugiwara(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  formData: FormData,
  photo: string | null
): void {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // ── Fond ────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#010c18');
  bg.addColorStop(0.5, '#021428');
  bg.addColorStop(1, '#010c18');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Vignette latérale gauche (or chaud)
  const vigL = ctx.createRadialGradient(0, h / 2, 0, 0, h / 2, 340);
  vigL.addColorStop(0, 'rgba(120, 80, 0, 0.30)');
  vigL.addColorStop(1, 'rgba(120, 80, 0, 0)');
  ctx.fillStyle = vigL;
  ctx.fillRect(0, 0, w, h);

  // Vignette latérale droite
  const vigR = ctx.createRadialGradient(w, h / 2, 0, w, h / 2, 340);
  vigR.addColorStop(0, 'rgba(120, 80, 0, 0.30)');
  vigR.addColorStop(1, 'rgba(120, 80, 0, 0)');
  ctx.fillStyle = vigR;
  ctx.fillRect(0, 0, w, h);

  // ── Texture vagues marines ───────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#1e3a6e';
  ctx.lineWidth = 1.5;
  for (let wave = 0; wave < 7; wave++) {
    const baseY = 80 + wave * 82;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = baseY + Math.sin((x / w) * Math.PI * 8 + wave * 0.7) * 13;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // ── Grille de points (or pâle) ───────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.035;
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < w; i += 20) {
    for (let j = 0; j < h; j += 20) {
      ctx.beginPath();
      ctx.arc(i, j, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // ── Décors thématiques ──────────────────────────────────

  // Deux katanas croisés de Zoro
  const drawKatana = (sx: number, sy: number, ex: number, ey: number, alpha: number) => {
    const angle = Math.atan2(ey - sy, ex - sx);
    const len   = Math.hypot(ex - sx, ey - sy);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(sx, sy);
    ctx.rotate(angle);

    // Lame
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.rect(0, -3, len * 0.76, 6);
    ctx.fill();

    // Reflet lame
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -2); ctx.lineTo(len * 0.76, -1.5);
    ctx.stroke();

    // Pointe effilée
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(len * 0.76, -3);
    ctx.lineTo(len * 0.76 + 20, 0);
    ctx.lineTo(len * 0.76, 3);
    ctx.closePath();
    ctx.fill();

    // Tsuba (garde circulaire)
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(len * 0.22, 0, 10, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(len * 0.22, 0, 10, 18, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Manche (tsuka)
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.rect(-(len * 0.24), -5, len * 0.22, 10);
    ctx.fill();

    // Enroulement or du manche
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = alpha * 0.9;
    for (let i = 0; i < 7; i++) {
      const xp = -(len * 0.24) + i * (len * 0.22 / 7) + 3;
      ctx.beginPath();
      ctx.moveTo(xp, -5); ctx.lineTo(xp - 3, 5);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawKatana(310, 100, 980, 555, 0.06);   // diag haut-gauche → bas-droite
  drawKatana(310, 555, 980, 100, 0.06);   // diag bas-gauche  → haut-droite

  // Chapeau de paille de Luffy
  const drawStrawHat = (cx: number, cy: number, r: number, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);

    const brimRx = r;
    const brimRy = r * 0.22;

    // Ombre portée sous le bord
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(3, brimRy * 0.5, brimRx * 0.84, brimRy * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bord (brim)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 0, brimRx, brimRy, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dôme du chapeau
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.18, brimRx * 0.64, r * 0.55, 0, Math.PI, 0);
    ctx.ellipse(0, 0, brimRx * 0.64, brimRy * 0.9, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fill();

    // Bande rouge (signature Luffy)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = r * 0.09;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.02, brimRx * 0.64, brimRy * 1.15, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Texture paille (lignes horizontales fines)
    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 0.8;
    for (let i = -4; i <= 4; i++) {
      const lineY = -r * 0.18 + i * (r * 0.48 / 8);
      const spread = brimRx * 0.64 * (1 - Math.abs(i) * 0.07);
      ctx.beginPath();
      ctx.ellipse(0, lineY, spread, 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  drawStrawHat(820, 320, 135, 0.09);

  // ── Triangles pirate rouge bordeaux ──────────────────────
  ctx.fillStyle = '#6b1a1a';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(180, 0); ctx.lineTo(0, 180);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w, h); ctx.lineTo(w - 180, h); ctx.lineTo(w, h - 180);
  ctx.fill();

  // Accent or vif sur les coins
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(52, 0); ctx.lineTo(0, 52);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w, h); ctx.lineTo(w - 52, h); ctx.lineTo(w, h - 52);
  ctx.fill();

  // ── Crâne jolly roger (corner top-left) ─────────────────
  ctx.save();
  ctx.translate(24, 24);
  ctx.strokeStyle = '#fbbf24';
  ctx.fillStyle = '#fbbf24';
  ctx.lineWidth = 1.8;
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#fbbf24';
  // Crâne
  ctx.beginPath();
  ctx.arc(0, -4, 9, Math.PI, 2 * Math.PI);
  ctx.lineTo(7, 6); ctx.lineTo(-7, 6); ctx.closePath();
  ctx.stroke();
  // Yeux
  ctx.beginPath();
  ctx.arc(-3, -5, 2, 0, Math.PI * 2);
  ctx.arc(3, -5, 2, 0, Math.PI * 2);
  ctx.fill();
  // Os croisés
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-9, 10); ctx.lineTo(9, 20);
  ctx.moveTo(9, 10); ctx.lineTo(-9, 20);
  ctx.stroke();
  // Extrémités des os
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-9, 10, 2.5, 0, Math.PI * 2);
  ctx.arc(9, 10, 2.5, 0, Math.PI * 2);
  ctx.arc(-9, 20, 2.5, 0, Math.PI * 2);
  ctx.arc(9, 20, 2.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // ── Watermark ────────────────────────────────────────────
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'right';
  ctx.fillText('MUGIWARA — 麦わら海賊団', w - 28, 18);

  // ── Titre ────────────────────────────────────────────────
  ctx.shadowBlur = 24;
  ctx.shadowColor = '#b45309';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("CARTE D'IDENTITÉ OTAKU", w / 2, 68);
  ctx.shadowBlur = 0;

  // Séparateur or
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(50, 90); ctx.lineTo(w - 50, 90);
  ctx.stroke();

  // ── Zone photo ───────────────────────────────────────────
  const photoX = 65, photoY = 116, photoW = 254, photoH = 344;
  ctx.fillStyle = '#010c18';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const drawFrame = (x: number, y: number, pw: number, ph: number) => {
    // Bordure pleine semi-transparente
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, pw, ph);
    // Coins marqués en or
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fbbf24';
    const len = 28;
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
      drawFrame(photoX, photoY, photoW, photoH);
    };
  } else {
    drawFrame(photoX, photoY, photoW, photoH);
  }

  // ── Champs de données ────────────────────────────────────
  ctx.textAlign = 'left';
  const startX = 368;

  const drawField = (label: string, value: string, x: number, y: number, size = 26) => {
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`《 ${label} 》`, x, y);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(value.toUpperCase(), x, y + 30);
  };

  const drawFieldSmall = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`《 ${label} 》`, x, y);
    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(value.toUpperCase(), x, y + 25);
  };

  drawField('NOM & PRÉNOMS', `${formData.nom} ${formData.prenom}`, startX, 143);
  drawField('PSEUDO', formData.pseudo, startX, 203);
  drawField('NATIONALITÉ', formData.nationalite, startX, 260);
  drawFieldSmall('NO. DE SÉRIE', formData.noCarte, startX + 295, 260);

  // ── Barre de puissance ───────────────────────────────────
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('《 NIVEAU DE PUISSANCE 》', startX, 318);

  const barWidth = 558;
  const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

  ctx.fillStyle = '#030e1c';
  ctx.beginPath();
  ctx.roundRect(startX, 328, barWidth, 16, 3);
  ctx.fill();

  if (power > 0) {
    const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
    grad.addColorStop(0, '#1e3a5f');
    grad.addColorStop(0.45, '#b45309');
    grad.addColorStop(1, '#fbbf24');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#fbbf24';
    ctx.roundRect(startX, 328, (barWidth * power) / 100, 16, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Easter egg KING OF PIRATES à 100
  if (power >= 100) {
    ctx.font = 'italic bold 13px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fbbf24';
    ctx.textAlign = 'right';
    ctx.fillText('KING OF PIRATES', startX + barWidth, 326);
    ctx.textAlign = 'left';
    ctx.shadowBlur = 0;
  }

  drawField('CLASSE DE COMBAT', formData.classe, startX, 384);
  drawField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 455, 22);

  // ── QR Code ──────────────────────────────────────────────
  const qrX = 840, qrY = 445, qrSize = 118;
  ctx.fillStyle = '#010c18';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  QRCode.toDataURL(formData.qrUrl || 'https://otaku-agency.org', {
    width: qrSize,
    margin: 1,
    color: { dark: '#fbbf24', light: '#010c18' },
  }).then((dataUrl) => {
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
    };
    qrImg.src = dataUrl;
  }).catch(() => {});

  // ── Mini strip sous photo ────────────────────────────────
  const drawMiniField = (label: string, value: string, x: number, y: number) => {
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(label, x, y);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(value.toUpperCase(), x, y + 16);
  };

  drawMiniField('《 NAISSANCE 》', formData.dateNaissance, 70, 478);
  drawMiniField('《 SEXE 》', formData.sexe, 215, 478);
  drawMiniField('《 EXPIRATION 》', formData.dateExpiration, 70, 513);
  drawMiniField('《 MEMBRE DEP. 》', formData.membreDepuis, 215, 513);

  // ── Bande MRZ ────────────────────────────────────────────
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(40, 575, w - 80, 45);
  ctx.strokeStyle = '#6b1a1a';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.55;
  ctx.strokeRect(40, 575, w - 80, 45);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fbbf24';
  ctx.font = '19px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(formData.mrzLine, 60, 604);
}
