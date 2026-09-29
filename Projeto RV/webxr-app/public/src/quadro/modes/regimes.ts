export type RegimeId = 'inline' | 'immersive-vr' | 'immersive-ar';
export interface Regime {
  readonly id: RegimeId;
  readonly nome: string;
  readonly tratamentoDoMundo: string;
  readonly espacoDeReferencia: string;
  readonly rastreia: string;
  readonly registroContra: string;
}
export const REGIMES: readonly Regime[] = [
  { id: 'inline', nome: 'Tela',
    tratamentoDoMundo: 'Exibe o mundo virtual numa janela, sem alterar o mundo físico.',
    espacoDeReferencia: 'Coordenadas da cena; viewer se houver sessão XR inline.',
    rastreia: 'Mouse/toque controla a câmera; não exige rastreamento corporal.',
    registroContra: 'Origem virtual da área de apoio.' },
  { id: 'immersive-vr', nome: 'Visor / VR',
    tratamentoDoMundo: 'Substitui a visão do ambiente por um mundo virtual.',
    espacoDeReferencia: 'local-floor pretendido; recuo para local com altura explícita se necessário.',
    rastreia: 'Pose do observador e fontes de entrada efetivamente concedidas.',
    registroContra: 'Chão do espaço rastreado; apoio a 0,80 m dele.' },
  { id: 'immersive-ar', nome: 'Câmera / AR',
    tratamentoDoMundo: 'Preserva a visão do mundo físico e acrescenta o quadro virtual.',
    espacoDeReferencia: 'local; viewer apenas para lançar o raio de hit-test.',
    rastreia: 'Pose do observador, entradas e superfícies se hit-test for concedido.',
    registroContra: 'Superfície real escolhida; âncora se concedida. Escala inicial 1:1.' },
];
