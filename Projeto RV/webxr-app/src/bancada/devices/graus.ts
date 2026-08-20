export type GrausDeLiberdade = 'tres' | 'seis' | 'indeterminado';

export type ClasseDeAparelho =
  | 'sem-api'
  | 'somente-janela'
  | 'visor-sem-posicao'
  | 'visor-com-posicao'
  | 'aparelho-de-mao-com-camera'
  | 'indeterminado';

export function grausDeLiberdade(espacos: readonly string[]): GrausDeLiberdade {
  if (espacos.includes('bounded-floor') || espacos.includes('local-floor') || espacos.includes('unbounded')) {
    return 'seis';
  }
  if (espacos.includes('local')) return 'tres';
  return 'indeterminado';
}

export function classificarAparelho(
  temApiXr: boolean,
  modosSuportados: readonly string[],
  graus: GrausDeLiberdade,
  composicao: XREnvironmentBlendMode | undefined,
): ClasseDeAparelho {
  if (!temApiXr) return 'sem-api';
  if (modosSuportados.length === 0) return 'somente-janela';
  if (graus === 'seis' && composicao === 'alpha-blend') return 'aparelho-de-mao-com-camera';
  if (graus === 'seis') return 'visor-com-posicao';
  if (graus === 'tres') return 'visor-sem-posicao';
  return 'indeterminado';
}

export function descreverClasse(classe: ClasseDeAparelho): string {
  switch (classe) {
    case 'sem-api': return 'Navegador sem API XR ou página fora de contexto seguro.';
    case 'somente-janela': return 'Aparelho que só sustenta o regime de janela.';
    case 'visor-sem-posicao': return 'Sessão com orientação rastreada, mas sem evidência suficiente de posição.';
    case 'visor-com-posicao': return 'Sessão com orientação e deslocamento rastreados.';
    case 'aparelho-de-mao-com-camera': return 'Aparelho de mão que compõe o virtual sobre a câmera.';
    case 'indeterminado': return 'A API respondeu, mas as evidências não bastam para classificar o aparelho.';
  }
}
