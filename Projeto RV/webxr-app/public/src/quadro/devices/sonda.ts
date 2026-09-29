import { levantarRelatorio, classificarErro, type LinhaDoRelatorio } from '../modes/verificacao.ts';
import { RECURSOS_CONSULTADOS, estadoDoRecurso, type EstadoDeRecurso } from './recursos.ts';
import { ContadorDeEstabilidade, diagnosticar, type Estabilidade } from './estabilidade.ts';
import { grausDeLiberdade, type GrausDeLiberdade } from './graus.ts';

export type ModoSondavel = 'immersive-vr' | 'immersive-ar';
export interface FonteDeEntradaSondada {
  readonly lado: string;
  readonly mira: string;
  readonly temEspacoDePunho: boolean;
  readonly temMao: boolean;
  readonly perfis: readonly string[];
}
export interface SondaSemSessao {
  readonly temApiXr: boolean;
  readonly contextoSeguro: boolean;
  readonly regimes: readonly LinhaDoRelatorio[];
}
export interface SondaEmSessao {
  readonly modo: ModoSondavel;
  readonly recursos: readonly { nome: string; paraQueServe: string; estado: EstadoDeRecurso }[];
  readonly espacosConcedidos: readonly string[];
  readonly composicaoObservada: XREnvironmentBlendMode;
  readonly fontesDeEntrada: readonly FonteDeEntradaSondada[];
  readonly graus: GrausDeLiberdade;
  readonly posesObservadas: number;
  readonly posesEmuladas: number;
  readonly referenciaDaAmostra: string;
  readonly estabilidade: Estabilidade;
  readonly diagnostico: string;
}
export interface ResultadoDaSonda {
  readonly semSessao: SondaSemSessao;
  readonly emSessao?: SondaEmSessao;
  readonly motivoSemSessao?: string;
  readonly estadoDaSessao: 'nao-solicitada' | 'concedida' | 'ausente' | 'negado-ou-bloqueado' | 'desconhecido';
}
export async function sondarSemSessao(): Promise<SondaSemSessao> {
  return { temApiXr: !!navigator.xr, contextoSeguro: window.isSecureContext, regimes: await levantarRelatorio() };
}

function observar(sessao: XRSession, referencia: XRReferenceSpace | undefined, gl: WebGL2RenderingContext) {
  return new Promise<{ estabilidade: Estabilidade; poses: number; emuladas: number; fontes: FonteDeEntradaSondada[]; fim: string }>(resolve => {
    const contador = new ContadorDeEstabilidade();
    const fontes = new Map<string, FonteDeEntradaSondada>();
    let poses = 0, emuladas = 0, pedido = 0, terminado = false;
    const finalizar = (fim: string) => {
      if (terminado) return;
      terminado = true;
      clearTimeout(limite);
      sessao.removeEventListener('end', encerrar);
      try { sessao.cancelAnimationFrame(pedido); } catch { /* Já encerrada. */ }
      resolve({ estabilidade: contador.resultado(), poses, emuladas, fontes: [...fontes.values()], fim });
    };
    const encerrar = () => finalizar('Sessão encerrada durante a observação.');
    const limite = window.setTimeout(() => finalizar('Limite de 6 segundos alcançado.'), 6000);
    sessao.addEventListener('end', encerrar);
    function quadro(_tempo: number, frame: XRFrame): void {
      if (terminado) return;
      try {
        const camada = sessao.renderState.baseLayer;
        if (camada) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, camada.framebuffer);
          gl.clearColor(0.03, 0.08, 0.12, 1);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        const pose = referencia ? frame.getViewerPose(referencia) : null;
        contador.registrar(pose !== null);
        if (pose) { poses++; if (pose.emulatedPosition) emuladas++; }
        for (const fonte of sessao.inputSources) {
          const dado = { lado: fonte.handedness, mira: fonte.targetRayMode,
            temEspacoDePunho: !!fonte.gripSpace, temMao: !!fonte.hand, perfis: [...fonte.profiles] };
          fontes.set(JSON.stringify(dado), dado);
        }
        if (contador.resultado().quadrosObservados >= 60) finalizar('Amostra de 60 quadros concluída.');
        else pedido = sessao.requestAnimationFrame(quadro);
      } catch (erro) { finalizar(`Observação interrompida: ${String(erro)}`); }
    }
    pedido = sessao.requestAnimationFrame(quadro);
  });
}

export async function sondarEmSessao(modo: ModoSondavel): Promise<SondaEmSessao> {
  if (!navigator.xr) throw new DOMException('API XR ausente.', 'NotSupportedError');
  const sessao = await navigator.xr.requestSession(modo, {
    optionalFeatures: RECURSOS_CONSULTADOS.map(r => r.nome),
  });
  let encerrada = false;
  const aoEncerrar = () => { encerrada = true; };
  sessao.addEventListener('end', aoEncerrar);
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = document.createElement('canvas').getContext('webgl2', { xrCompatible: true });
    if (!gl) throw new Error('WebGL 2 compatível com XR indisponível.');
    await gl.makeXRCompatible();
    if (encerrada) throw new Error('Sessão encerrada antes da coleta.');
    sessao.updateRenderState({ baseLayer: new XRWebGLLayer(sessao, gl) });
    const espacos = new Map<string, XRReferenceSpace>();
    for (const nome of ['local', 'local-floor', 'bounded-floor', 'viewer'] as const) {
      try { espacos.set(nome, await sessao.requestReferenceSpace(nome)); } catch { /* Não concedido. */ }
    }
    if (encerrada) throw new Error('Sessão encerrada antes da coleta.');
    const referencia = espacos.get('local') ?? espacos.get('local-floor');
    const referenciaDaAmostra = espacos.has('local') ? 'local' : espacos.has('local-floor') ? 'local-floor' : 'nenhuma';
    const amostra = await observar(sessao, referencia, gl);
    const concedidos = (sessao as XRSession & { enabledFeatures?: readonly string[] }).enabledFeatures;
    return { modo,
      recursos: RECURSOS_CONSULTADOS.map(r => ({ ...r, estado: estadoDoRecurso(r.nome, concedidos) })),
      espacosConcedidos: [...espacos.keys()], composicaoObservada: sessao.environmentBlendMode,
      fontesDeEntrada: amostra.fontes, graus: grausDeLiberdade(amostra.poses, amostra.emuladas),
      posesObservadas: amostra.poses, posesEmuladas: amostra.emuladas, referenciaDaAmostra,
      estabilidade: amostra.estabilidade, diagnostico: `${amostra.fim} ${diagnosticar(amostra.estabilidade)}` };
  } finally {
    if (!encerrada) await sessao.end().catch(() => undefined);
    sessao.removeEventListener('end', aoEncerrar);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
export async function sondar(modo: ModoSondavel, semSessao: SondaSemSessao): Promise<ResultadoDaSonda> {
  try {
    const emSessao = await sondarEmSessao(modo);
    return { semSessao, emSessao, estadoDaSessao: 'concedida' };
  } catch (erro) {
    return { semSessao, estadoDaSessao: classificarErro(erro),
      motivoSemSessao: erro instanceof Error ? `${erro.name}: ${erro.message}` : String(erro) };
  }
}
