import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three';
import type { LeituraDoOrcamento } from '../core/orcamento.ts';
/** Texto dinâmico num objeto da cena; nenhuma imagem decorativa é importada. */
export function montarPainel() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 256;
  const contexto = canvas.getContext('2d');
  if (!contexto) throw new Error('Canvas 2D indisponível.');
  const textura = new CanvasTexture(canvas);
  textura.colorSpace = SRGBColorSpace;
  const no = new Mesh(new PlaneGeometry(0.37, 0.0925), new MeshBasicMaterial({ map: textura }));
  no.name = 'leitura-do-custo';
  function atualizar(leitura: LeituraDoOrcamento): void {
    const ctx = contexto!;
    ctx.fillStyle = '#102333'; ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = '#80e4cb'; ctx.font = 'bold 40px monospace';
    ctx.fillText(`QUADRO / TETO ${leitura.tetoMs.toFixed(2)} ms`, 28, 52);
    ctx.fillStyle = '#ffffff'; ctx.font = '32px monospace';
    ctx.fillText(`CPU ${leitura.custoMedioMs.toFixed(2)} ms | intervalo ${leitura.intervaloMedioMs.toFixed(2)} ms`, 28, 105);
    ctx.fillText(`${leitura.chamadasDeDesenho} desenhos | ${leitura.triangulos} triangulos`, 28, 157);
    ctx.fillStyle = '#b7cbdc'; ctx.font = '28px monospace';
    ctx.fillText(`janela: ${leitura.quadrosMedidos} quadros | GPU nao medida`, 28, 209);
    textura.needsUpdate = true;
  }
  return { no, atualizar };
}
