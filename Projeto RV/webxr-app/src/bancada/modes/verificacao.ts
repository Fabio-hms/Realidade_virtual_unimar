import { REGIMES, type Regime, type RegimeId } from './regimes';

export type Suporte = 'sim' | 'nao' | 'desconhecido';

export interface LinhaDoRelatorio {
  readonly regime: Regime;
  readonly suporte: Suporte;
  readonly observacao: string;
}

function sistemaXr(): XRSystem | undefined {
  return navigator.xr;
}

async function suporteDe(id: RegimeId): Promise<Suporte> {
  const xr = sistemaXr();
  if (xr === undefined || !window.isSecureContext) return 'desconhecido';

  try {
    return (await xr.isSessionSupported(id)) ? 'sim' : 'nao';
  } catch {
    return 'desconhecido';
  }
}

function observacaoDe(regime: Regime, suporte: Suporte): string {
  if (suporte === 'sim') {
    return `Declarado para ${regime.registroContra}. Falta confrontar capacidades em sessão.`;
  }
  if (suporte === 'nao') {
    return 'O navegador respondeu que este regime não é suportado neste aparelho.';
  }
  return 'Sem resposta utilizável: API XR ausente ou página fora de contexto seguro (HTTPS).';
}

export async function levantarRelatorio(): Promise<LinhaDoRelatorio[]> {
  const linhas: LinhaDoRelatorio[] = [];
  for (const regime of REGIMES) {
    const suporte = await suporteDe(regime.id);
    linhas.push({ regime, suporte, observacao: observacaoDe(regime, suporte) });
  }
  return linhas;
}
