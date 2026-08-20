import { levantarRelatorio, type LinhaDoRelatorio } from '../modes/verificacao';
import {
  RECURSOS_CONSULTADOS,
  estadoDoRecurso,
  type EstadoDeRecurso,
} from './recursos';
import {
  ContadorDeEstabilidade,
  diagnosticar,
  type Estabilidade,
} from './estabilidade';
import {
  classificarAparelho,
  grausDeLiberdade,
  type ClasseDeAparelho,
  type GrausDeLiberdade,
} from './graus';

export type ModoSondavel = 'immersive-vr' | 'immersive-ar';

const ESPACOS_TENTADOS: readonly XRReferenceSpaceType[] = [
  'bounded-floor', 'local-floor', 'unbounded', 'local', 'viewer',
];
const QUADROS_OBSERVADOS = 60;

export interface RecursoSondado {
  readonly nome: string;
  readonly paraQueServe: string;
  readonly estado: EstadoDeRecurso;
}

export interface FonteDeEntradaSondada {
  readonly lado: string;
  readonly mira: string;
  readonly temPoseDePunho: boolean;
  readonly temMao: boolean;
  readonly perfis: readonly string[];
}

export interface SondaSemSessao {
  readonly temApiXr: boolean;
  readonly contextoSeguro: boolean;
  readonly regimes: readonly LinhaDoRelatorio[];
  readonly modosSuportados: readonly string[];
}

export interface SondaEmSessao {
  readonly modo: ModoSondavel;
  readonly recursos: readonly RecursoSondado[];
  readonly espacosConcedidos: readonly string[];
  readonly composicaoObservada: XREnvironmentBlendMode;
  readonly fontesDeEntrada: readonly FonteDeEntradaSondada[];
  readonly graus: GrausDeLiberdade;
  readonly estabilidade: Estabilidade;
  readonly diagnostico: string;
}

export interface ResultadoDaSonda {
  readonly semSessao: SondaSemSessao;
  readonly emSessao: SondaEmSessao | undefined;
  readonly motivoSemSessao: string | undefined;
  readonly classe: ClasseDeAparelho;
}

export async function sondarSemSessao(): Promise<SondaSemSessao> {
  const regimes = await levantarRelatorio();
  return {
    temApiXr: navigator.xr !== undefined,
    contextoSeguro: window.isSecureContext,
    regimes,
    modosSuportados: regimes.filter((r) => r.suporte === 'sim').map((r) => r.regime.id),
  };
}

async function espacosConcedidos(sessao: XRSession): Promise<string[]> {
  const obtidos: string[] = [];
  for (const tipo of ESPACOS_TENTADOS) {
    try {
      await sessao.requestReferenceSpace(tipo);
      obtidos.push(tipo);
    } catch {
      // A rejeição é a resposta de que aquele espaço não foi concedido.
    }
  }
  return obtidos;
}

function lerFontesDeEntrada(sessao: XRSession): FonteDeEntradaSondada[] {
  return Array.from(sessao.inputSources, (fonte) => ({
    lado: fonte.handedness,
    mira: fonte.targetRayMode,
    temPoseDePunho: fonte.gripSpace !== undefined,
    temMao: fonte.hand !== undefined,
    perfis: [...fonte.profiles],
  }));
}

function camadaMinima(sessao: XRSession): WebGL2RenderingContext {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { xrCompatible: true });
  if (!gl) throw new Error('Este navegador não entregou WebGL 2 compatível com XR.');
  sessao.updateRenderState({ baseLayer: new XRWebGLLayer(sessao, gl) });
  return gl;
}

/**
 * Abre uma sessão temporária a partir de um clique, consulta o aparelho e encerra
 * a sessão. A sonda não cria cena nem usa o renderer principal.
 */
export async function sondarEmSessao(modo: ModoSondavel): Promise<SondaEmSessao> {
  if (!navigator.xr) throw new Error('A API WebXR não está disponível.');

  const optionalFeatures = [
    'local-floor', 'bounded-floor', 'unbounded', 'hit-test',
    'anchors', 'plane-detection', 'hand-tracking',
  ];

  const sessao = await navigator.xr.requestSession(modo, {
    optionalFeatures,
  });

  try {
    camadaMinima(sessao);
    const concedidos = (sessao as XRSession & { enabledFeatures?: readonly string[] }).enabledFeatures;
    const recursos = RECURSOS_CONSULTADOS.map((recurso) => ({
      nome: recurso.nome,
      paraQueServe: recurso.paraQueServe,
      estado: estadoDoRecurso(recurso.nome, concedidos),
    }));
    const espacos = await espacosConcedidos(sessao);
    const fontes = lerFontesDeEntrada(sessao);
    const composicao = sessao.environmentBlendMode;

    // A sessão já possui uma camada mínima. O contador abaixo usa getViewerPose
    // com o espaço viewer, que é obtido diretamente da sessão.
    const estabilidade = await observarEstabilidade(sessao);
    const graus = grausDeLiberdade(espacos);

    return {
      modo,
      recursos,
      espacosConcedidos: espacos,
      composicaoObservada: composicao,
      fontesDeEntrada: fontes,
      graus,
      estabilidade,
      diagnostico: diagnosticar(estabilidade),
    };
  } finally {
    await sessao.end();
  }
}

async function observarEstabilidade(sessao: XRSession): Promise<Estabilidade> {
  const contador = new ContadorDeEstabilidade();
  const viewer = await sessao.requestReferenceSpace('viewer').catch(() => null);

  if (!viewer) return contador.resultado();

  return new Promise((resolve) => {
    const observar = (_tempo: number, frame: XRFrame): void => {
      contador.registrar(frame.getViewerPose(viewer) !== null);
      if (contador.resultado().quadrosObservados >= QUADROS_OBSERVADOS) {
        resolve(contador.resultado());
      } else {
        sessao.requestAnimationFrame(observar);
      }
    };
    sessao.requestAnimationFrame(observar);
  });
}

export async function sondar(modo: ModoSondavel): Promise<ResultadoDaSonda> {
  const semSessao = await sondarSemSessao();
  if (!semSessao.modosSuportados.includes(modo)) {
    return {
      semSessao,
      emSessao: undefined,
      motivoSemSessao: `O navegador não declarou suporte a ${modo}.`,
      classe: classificarAparelho(semSessao.temApiXr, semSessao.modosSuportados, 'indeterminado', undefined),
    };
  }

  try {
    const emSessao = await sondarEmSessao(modo);
    return {
      semSessao,
      emSessao,
      motivoSemSessao: undefined,
      classe: classificarAparelho(
        semSessao.temApiXr,
        semSessao.modosSuportados,
        emSessao.graus,
        emSessao.composicaoObservada,
      ),
    };
  } catch (erro) {
    return {
      semSessao,
      emSessao: undefined,
      motivoSemSessao: erro instanceof Error ? erro.message : 'A sessão não pôde ser aberta.',
      classe: classificarAparelho(semSessao.temApiXr, semSessao.modosSuportados, 'indeterminado', undefined),
    };
  }
}
