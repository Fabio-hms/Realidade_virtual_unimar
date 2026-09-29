import type { Scene } from 'three';
import type { Palco } from './palco.ts';
import { Relogio, type Amostra } from './relogio.ts';
import { Orcamento } from './orcamento.ts';
export function montarLaco(palco: Palco, cena: Scene, relogio: Relogio, orcamento: Orcamento) {
  const passos: ((amostra: Amostra) => void)[] = [];
  function quadro(instanteMs: number): void {
    const inicio = performance.now();
    palco.ajustar();
    const amostra = relogio.avancar(instanteMs);
    for (const passo of passos) passo(amostra);
    palco.desenhar(cena);
    orcamento.registrar(performance.now() - inicio, amostra.intervaloReal * 1000,
      palco.renderer.info.render.calls, palco.renderer.info.render.triangles);
  }
  return {
    aoPasso: (passo: (amostra: Amostra) => void) => { passos.push(passo); },
    iniciar: () => palco.renderer.setAnimationLoop(quadro),
    parar: () => { palco.renderer.setAnimationLoop(null); relogio.reiniciar(); },
  };
}
