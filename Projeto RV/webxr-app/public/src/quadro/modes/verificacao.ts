import { REGIMES, type Regime } from './regimes.ts';
export type Suporte = 'sim' | 'nao' | 'ausente' | 'negado-ou-bloqueado' | 'desconhecido';
export interface LinhaDoRelatorio {
  readonly regime: Regime;
  readonly suporte: Suporte;
  readonly observacao: string;
}
export function classificarErro(erro: unknown): 'ausente' | 'negado-ou-bloqueado' | 'desconhecido' {
  const nome = erro instanceof Error ? erro.name : '';
  if (nome === 'NotSupportedError') return 'ausente';
  if (nome === 'NotAllowedError' || nome === 'SecurityError') return 'negado-ou-bloqueado';
  return 'desconhecido';
}
export async function levantarRelatorio(): Promise<LinhaDoRelatorio[]> {
  return Promise.all(REGIMES.map(async regime => {
    if (!window.isSecureContext) return { regime, suporte: 'desconhecido' as const,
      observacao: 'Contexto inseguro. Não permite concluir se o hardware oferece XR.' };
    if (!navigator.xr) return { regime, suporte: 'ausente' as const,
      observacao: 'API XR ausente neste navegador. A cena de tela funciona por WebGL.' };
    try {
      const sim = await navigator.xr.isSessionSupported(regime.id);
      return { regime, suporte: sim ? 'sim' as const : 'nao' as const,
        observacao: sim ? 'O navegador declarou suporte; a abertura ainda depende da sessão e das permissões.'
          : 'O navegador declarou que este modo XR não é suportado.' };
    } catch (erro) {
      return { regime, suporte: classificarErro(erro),
        observacao: erro instanceof Error ? `${erro.name}: ${erro.message}` : String(erro) };
    }
  }));
}
