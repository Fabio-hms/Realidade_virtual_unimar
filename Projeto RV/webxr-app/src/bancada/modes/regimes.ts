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
  {
    id: 'inline',
    nome: 'Janela (inline)',
    tratamentoDoMundo: 'Janela comum do navegador',
    espacoDeReferencia: 'Depende da câmera da aplicação',
    rastreia: 'Não é um regime imersivo',
    registroContra: 'Tela',
  },
  {
    id: 'immersive-vr',
    nome: 'VR imersivo',
    tratamentoDoMundo: 'Mundo virtual substitui a visão do ambiente',
    espacoDeReferencia: 'Espaço XR concedido pela sessão',
    rastreia: 'Cabeça e, quando presentes, fontes de entrada',
    registroContra: 'Mundo virtual',
  },
  {
    id: 'immersive-ar',
    nome: 'AR imersivo',
    tratamentoDoMundo: 'Mundo físico permanece visível e recebe composição virtual',
    espacoDeReferencia: 'Espaço XR concedido pela sessão',
    rastreia: 'Cabeça e, quando presentes, fontes de entrada',
    registroContra: 'Mundo físico',
  },
];
