export type EstadoDeRecurso = 'concedido' | 'nao-concedido' | 'indeterminado';
export const RECURSOS_CONSULTADOS = [
  { nome: 'local-floor', paraQueServe: 'referência no chão' },
  { nome: 'bounded-floor', paraQueServe: 'chão e limites do espaço' },
  { nome: 'hit-test', paraQueServe: 'consulta de superfícies reais' },
  { nome: 'anchors', paraQueServe: 'manter o registro no mundo físico' },
  { nome: 'hand-tracking', paraQueServe: 'entrada por mãos, quando concedida' },
] as const;
export function estadoDoRecurso(nome: string, concedidos: readonly string[] | undefined): EstadoDeRecurso {
  if (concedidos === undefined) return 'indeterminado';
  // Não estar na lista não revela se faltou suporte ou autorização.
  return concedidos.includes(nome) ? 'concedido' : 'nao-concedido';
}
