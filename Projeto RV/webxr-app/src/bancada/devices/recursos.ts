export type EstadoDeRecurso = 'concedido' | 'negado' | 'indeterminado';

export interface RecursoOpcional {
  readonly nome: string;
  readonly paraQueServe: string;
}

export const RECURSOS_CONSULTADOS: readonly RecursoOpcional[] = [
  { nome: 'local-floor', paraQueServe: 'origem no chão do espaço físico' },
  { nome: 'bounded-floor', paraQueServe: 'origem no chão e limites da área livre' },
  { nome: 'unbounded', paraQueServe: 'espaço sem fronteira declarada' },
  { nome: 'hit-test', paraQueServe: 'detectar superfícies reais' },
  { nome: 'anchors', paraQueServe: 'fixar objetos a pontos do ambiente' },
  { nome: 'plane-detection', paraQueServe: 'detectar planos do ambiente' },
  { nome: 'hand-tracking', paraQueServe: 'rastrear mãos articuladas' },
];

export function estadoDoRecurso(
  nome: string,
  concedidos: readonly string[] | undefined,
): EstadoDeRecurso {
  if (concedidos === undefined) return 'indeterminado';
  return concedidos.includes(nome) ? 'concedido' : 'negado';
}
