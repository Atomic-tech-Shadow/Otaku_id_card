import { useEffect } from 'react';
import { FormData } from '../types';
import { renderOIA } from '../templates/templateOIA';
import { renderShonen } from '../templates/templateShonen';
import { renderDemon } from '../templates/templateDemon';
import { renderMagical } from '../templates/templateMagical';
import { renderSpace } from '../templates/templateSpace';
import { renderShadowGarden } from '../templates/templateShadowGarden';
import { renderMugiwara } from '../templates/templateMugiwara';
import { renderSoloLeveling } from '../templates/templateSoloLeveling';
import { renderJJK } from '../templates/templateJJK';
import { renderHero } from '../templates/templateHero';
import { renderKonoha } from '../templates/templateKonoha';
import { renderDragonBall } from '../templates/templateDragonBall';
import { renderSoulSociety } from '../templates/templateSoulSociety';
import { renderFairyTail } from '../templates/templateFairyTail';
import { renderChainsawMan } from '../templates/templateChainsawMan';

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

    switch (formData.template) {
      case 'SHONEN':
        renderShonen(ctx, canvas, formData, photo);
        break;
      case 'DEMON':
        renderDemon(ctx, canvas, formData, photo);
        break;
      case 'MAGICAL':
        renderMagical(ctx, canvas, formData, photo);
        break;
      case 'SPACE':
        renderSpace(ctx, canvas, formData, photo);
        break;
      case 'SHADOW':
        renderShadowGarden(ctx, canvas, formData, photo);
        break;
      case 'MUGIWARA':
        renderMugiwara(ctx, canvas, formData, photo);
        break;
      case 'SOLO':
        renderSoloLeveling(ctx, canvas, formData, photo);
        break;
      case 'JJK':
        renderJJK(ctx, canvas, formData, photo);
        break;
      case 'HERO':
        renderHero(ctx, canvas, formData, photo);
        break;
      case 'KONOHA':
        renderKonoha(ctx, canvas, formData, photo);
        break;
      case 'DBZ':
        renderDragonBall(ctx, canvas, formData, photo);
        break;
      case 'SOUL':
        renderSoulSociety(ctx, canvas, formData, photo);
        break;
      case 'FAIRY':
        renderFairyTail(ctx, canvas, formData, photo);
        break;
      case 'CSM':
        renderChainsawMan(ctx, canvas, formData, photo);
        break;
      default:
        renderOIA(ctx, canvas, formData, photo);
        break;
    }
  }, [formData, photo]);
}
