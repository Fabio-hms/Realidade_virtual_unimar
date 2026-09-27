/** Vocabulário e medidas da cena. Uma unidade de comprimento equivale a 1 m. */
export type DisjuntorId = 'disjuntor-1' | 'disjuntor-2' | 'disjuntor-3'
  | 'disjuntor-4' | 'disjuntor-5' | 'disjuntor-6';
export type BorneId = 'borne-entrada' | 'borne-saida';
export type BarramentoId = 'barramento-1';
export type TrilhoId = 'trilho-principal';
export type ComponenteId = DisjuntorId | BorneId | BarramentoId;
export type TipoDisjuntor = 'unipolar' | 'bipolar' | 'tripolar';
export type ParteDisjuntor = 'corpo' | 'entrada' | 'saida' | 'chave' | 'encaixe';
export type ParteBorne = 'corpo' | 'encaixe';
export type ParteBarramento = 'corpo' | 'contatos';
export type Medidas = readonly [largura: number, altura: number, profundidade: number];

export interface Disjuntor {
  readonly id: DisjuntorId;
  readonly nome: string;
  readonly tipo: TipoDisjuntor;
  readonly partes: readonly ParteDisjuntor[];
  readonly medidas: Medidas;
}
export interface Borne {
  readonly id: BorneId;
  readonly nome: string;
  readonly partes: readonly ParteBorne[];
  readonly medidas: Medidas;
}
export interface Barramento {
  readonly id: BarramentoId;
  readonly nome: string;
  readonly partes: readonly ParteBarramento[];
  readonly medidas: Medidas;
}
export interface Trilho {
  readonly id: TrilhoId;
  readonly nome: string;
  readonly medidas: Medidas;
  readonly eixoDeDeslizamento: 'x';
}
export interface TarefaDoAmbiente {
  readonly enunciado: string;
  readonly estadoFinal: string;
}
export interface Dominio {
  readonly nome: string;
  readonly descricao: string;
  readonly tarefa: TarefaDoAmbiente;
  readonly placa: { readonly medidas: Medidas };
  readonly apoio: { readonly medidas: Medidas; readonly alturaDoTopo: number };
  readonly indicador: { readonly raio: number };
  readonly disjuntores: readonly Disjuntor[];
  readonly bornes: readonly Borne[];
  readonly barramentos: readonly Barramento[];
  readonly trilhos: readonly Trilho[];
}

const IDS_DISJUNTORES: readonly DisjuntorId[] = [
  'disjuntor-1', 'disjuntor-2', 'disjuntor-3',
  'disjuntor-4', 'disjuntor-5', 'disjuntor-6',
];

// recorte:inicio dominio-declarado-como-dado
export const QUADRO: Dominio = {
  nome: 'Quadro elétrico em trilho',
  descricao: 'Uma placa com trilho horizontal e componentes disponíveis sobre uma área de apoio: '
    + 'seis disjuntores, dois bornes e um barramento. As chaves pertencem aos disjuntores.',
  tarefa: {
    enunciado: 'Montar o quadro encaixando os disjuntores e os bornes no trilho, '
      + 'alinhando os disjuntores e instalando o barramento por último.',
    estadoFinal: 'Os seis disjuntores e os dois bornes estão montados; os disjuntores '
      + 'estão alinhados e ligados; o barramento está instalado e o indicador acende. '
      + 'Esta é uma validação lógica didática da montagem.',
  },
  placa: { medidas: [0.50, 0.40, 0.012] },
  apoio: { medidas: [0.80, 0.03, 0.60], alturaDoTopo: 0.80 },
  indicador: { raio: 0.012 },
  disjuntores: IDS_DISJUNTORES.map((id, indice) => ({
    id, nome: `Disjuntor ${indice + 1}`, tipo: 'unipolar',
    partes: ['corpo', 'entrada', 'saida', 'chave', 'encaixe'],
    medidas: [0.018, 0.080, 0.070],
  })),
  bornes: [
    { id: 'borne-entrada', nome: 'Borne de entrada', partes: ['corpo', 'encaixe'], medidas: [0.02, 0.04, 0.04] },
    { id: 'borne-saida', nome: 'Borne de saída', partes: ['corpo', 'encaixe'], medidas: [0.02, 0.04, 0.04] },
  ],
  barramentos: [{ id: 'barramento-1', nome: 'Barramento', partes: ['corpo', 'contatos'], medidas: [0.35, 0.015, 0.025] }],
  trilhos: [{ id: 'trilho-principal', nome: 'Trilho principal', medidas: [0.40, 0.035, 0.015], eixoDeDeslizamento: 'x' }],
};
// recorte:fim dominio-declarado-como-dado

/** Valores iniciais da especificação: serão aplicados no módulo de encaixe. */
export const TOLERANCIAS = {
  disjuntor: { posicaoMetros: 0.015, anguloGraus: 10 },
  borne: { posicaoMetros: 0.015, anguloGraus: 10 },
  barramento: { posicaoMetros: 0.010, anguloGraus: 8 },
} as const;

export function inconsistenciasDoDominio(dominio: Dominio): string[] {
  const objetos = [...dominio.disjuntores, ...dominio.bornes, ...dominio.barramentos, ...dominio.trilhos];
  const ids = new Set<string>();
  const erros: string[] = [];
  for (const objeto of objetos) {
    if (ids.has(objeto.id)) erros.push(`Identificador repetido: ${objeto.id}.`);
    ids.add(objeto.id);
    if (objeto.medidas.some(n => !Number.isFinite(n) || n <= 0)) erros.push(`Medida inválida: ${objeto.id}.`);
  }
  if (!dominio.trilhos.length) erros.push('O quadro precisa de um trilho.');
  return erros;
}
