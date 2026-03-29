import { useEffect } from 'react';
import QRCode from 'qrcode';
import { FormData } from '../types';

export function useCardRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  formData: FormData,
  photo: string | null
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // --- FOND STYLE CYBER/ANIME ---
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 25);
    ctx.fill();

    // Trame de points (Halftone manga style)
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < w; i += 15) {
      for (let j = 0; j < h; j += 15) {
        ctx.beginPath();
        ctx.arc(i, j, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // --- DÉCORATIONS ET LIGNES DE FORCE ---
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(w - 50, 100);
    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(150, 0);
    ctx.lineTo(0, 150);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w, h);
    ctx.lineTo(w - 150, h);
    ctx.lineTo(w, h - 150);
    ctx.fill();

    // --- TITRE STYLE MECHA ---
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#60a5fa';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OTAKU IDENTIFICATION CARD', w / 2, 70);
    ctx.shadowBlur = 0;

    // --- ZONE PHOTO ---
    const photoX = 70;
    const photoY = 140;
    const photoW = 260;
    const photoH = 340;

    ctx.fillStyle = '#000';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    if (photo) {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        ctx.drawImage(img, photoX, photoY, photoW, photoH);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        const len = 30;
        ctx.beginPath();
        ctx.moveTo(photoX, photoY + len); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + len, photoY);
        ctx.moveTo(photoX + photoW - len, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + len);
        ctx.moveTo(photoX, photoY + photoH - len); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + len, photoY + photoH);
        ctx.moveTo(photoX + photoW - len, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - len);
        ctx.stroke();
      };
    }

    // --- CHAMPS DE DONNÉES STYLE HUD ---
    ctx.textAlign = 'left';
    const startX = 380;

    const drawHudField = (label: string, value: string, x: number, y: number) => {
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`[ ${label} ]`, x, y);
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(value.toUpperCase(), x, y + 35);
    };

    drawHudField('IDENTITÉ', `${formData.nom} ${formData.prenom}`, startX, 170);
    drawHudField('ORIGINE', formData.nationalite, startX, 250);
    drawHudField('NO. DE SÉRIE', formData.noCarte, startX + 300, 250);

    // Barre de puissance
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('[ NIVEAU DE PUISSANCE ]', startX, 330);

    const barWidth = 550;
    const power = Math.max(0, Math.min(100, formData.powerLevel || 0));

    ctx.beginPath();
    ctx.fillStyle = '#1e293b';
    ctx.roundRect(startX, 345, barWidth, 15, 5);
    ctx.fill();

    if (power > 0) {
      const grad = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
      grad.addColorStop(0, '#3b82f6');
      grad.addColorStop(1, '#f43f5e');
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.roundRect(startX, 345, (barWidth * power) / 100, 15, 5);
      ctx.fill();
    }

    drawHudField('CLASSE DE COMBAT', formData.classe, startX, 410);
    drawHudField('CAPACITÉS SPÉCIALES', formData.expertise, startX, 490);

    // --- QR CODE RÉEL ---
    const qrX = 830, qrY = 430, qrSize = 130;

    // Fond + bordure pendant le chargement
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);

    // Génération QR asynchrone
    const urlToEncode = formData.qrUrl || 'https://otaku-agency.org';
    QRCode.toDataURL(urlToEncode, {
      width: qrSize,
      margin: 1,
      color: { dark: '#60a5fa', light: '#0a0f1e' },
    }).then((dataUrl) => {
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      };
      qrImg.src = dataUrl;
    }).catch(() => {
      ctx.fillStyle = '#f43f5e';
      ctx.font = '10px monospace';
      ctx.fillText('URL INVALIDE', qrX + 10, qrY + 65);
    });

    // --- MRZ ZONE ---
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(40, 570, w - 80, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '22px "Courier New", monospace';
    ctx.fillText(formData.mrzLine, 60, 602);
  }, [formData, photo]);
}
