import './style.css';
import { montarCena } from './quadro/core/cena.ts';
import { montarPalco } from './quadro/core/palco.ts';
import { montarLaco } from './quadro/core/laco.ts';
import { Relogio } from './quadro/core/relogio.ts';
import { Orcamento, TETO_DESKTOP_MS } from './quadro/core/orcamento.ts';
import { descreverArvore, reparentar, type MedidaDeReparentagem } from './quadro/core/hierarquia.ts';
import { montarPainel } from './quadro/ui/painel.ts';
import { sondar, sondarSemSessao, type ModoSondavel, type ResultadoDaSonda, type SondaSemSessao } from './quadro/devices/sonda.ts';
import { montarRelatorio } from './quadro/relatorio/relatorio.ts';

function elemento<T extends HTMLElement>(id: string): T {
  const no = document.getElementById(id);
  if (!no) throw new Error(`Elemento não encontrado: ${id}`);
  return no as T;
}
async function iniciar(): Promise<void> {
  const status = elemento('status');
  const relatorio = elemento('report');
  const vr = elemento<HTMLButtonElement>('probe-vr');
  const ar = elemento<HTMLButtonElement>('probe-ar');
  let capacidades: SondaSemSessao | undefined;
  let resultado: ResultadoDaSonda | undefined;
  let sondando = false;
  const medidas: MedidaDeReparentagem[] = [];
  const atualizarSuporte = async () => {
    capacidades = await sondarSemSessao();
    resultado = { semSessao: capacidades, estadoDaSessao: 'nao-solicitada' };
    montarRelatorio(relatorio, resultado);
    for (const [botao, modo] of [[vr, 'immersive-vr'], [ar, 'immersive-ar']] as const) {
      botao.disabled = !capacidades.contextoSeguro || !capacidades.temApiXr
        || capacidades.regimes.find(r => r.regime.id === modo)?.suporte === 'nao';
    }
  };
  montarRelatorio(relatorio);
  void atualizarSuporte();

  const palco = montarPalco(elemento<HTMLCanvasElement>('scene'));
  const cena = montarCena();
  const relogio = new Relogio();
  const orcamento = new Orcamento(TETO_DESKTOP_MS);
  const painel = montarPainel();
  cena.suporteDoPainel.add(painel.no);
  painel.atualizar(orcamento.ler());
  const arvore = elemento('tree');
  const atualizarArvore = () => { arvore.textContent = descreverArvore(cena.apoio); };
  atualizarArvore();
  const originais = [...cena.componentes.values()].map(no => ({ no, posicao: no.position.clone(), rotacao: no.quaternion.clone() }));
  let movendo = false, tempoMovimento = 0, ultimaLeitura = -1;
  const mover = elemento<HTMLButtonElement>('move');
  function pausar(): void {
    movendo = false; mover.textContent = 'Mover placa'; mover.setAttribute('aria-pressed', 'false');
  }
  mover.onclick = () => {
    movendo = !movendo;
    mover.textContent = movendo ? 'Pausar movimento' : 'Mover placa';
    mover.setAttribute('aria-pressed', String(movendo));
    status.textContent = 'O trilho, o indicador e o painel acompanham a placa porque são filhos dela.';
  };
  const troca = elemento<HTMLButtonElement>('reparent');
  troca.onclick = () => {
    pausar();
    const objeto = cena.componentes.get('disjuntor-1')!;
    const destino = objeto.parent === cena.trilho ? cena.apoio : cena.trilho;
    const medida = reparentar(objeto, destino);
    medidas.push(medida);
    const vetor = (valores: number[]) => `(${valores.map(n => n.toFixed(9)).join(', ')}) m`;
    elemento('measurement').textContent = `${medida.paiAnterior} → ${medida.paiNovo}\nAntes: ${vetor(medida.antes)}\nDepois: ${vetor(medida.depois)}\nDesvio: ${medida.desvioMetros.toExponential(3)} m\nErro máximo na matriz: ${medida.erroMatriz.toExponential(3)}`;
    troca.textContent = destino === cena.trilho ? 'Devolver ao apoio (mesmo lugar)' : 'Trocar pai do disjuntor 1';
    status.textContent = 'Pai alterado, posição no mundo preservada. Mova a placa para verificar a nova relação. Esta demonstração não valida encaixe.';
    atualizarArvore();
  };
  elemento('reset').onclick = () => {
    pausar(); tempoMovimento = 0; cena.placa.rotation.set(0, 0, 0);
    for (const { no, posicao, rotacao } of originais) {
      cena.apoio.add(no); no.position.copy(posicao); no.quaternion.copy(rotacao); no.scale.setScalar(1);
    }
    medidas.length = 0; relogio.reiniciar(); orcamento.reiniciar(); ultimaLeitura = -1;
    elemento('measurement').textContent = 'Troque o pai para medir a posição antes e depois.';
    troca.textContent = 'Trocar pai do disjuntor 1';
    status.textContent = 'Cena reiniciada. Indicador desligado: a montagem completa pertence aos próximos módulos.';
    palco.enquadrar(); atualizarArvore();
  };
  const laco = montarLaco(palco, cena.sala, relogio, orcamento);
  laco.aoPasso(amostra => {
    // recorte:inicio movimento-por-tempo
    if (movendo) {
      tempoMovimento += amostra.delta;
      cena.placa.rotation.y = Math.sin(tempoMovimento * 0.8) * Math.PI / 12;
    }
    // recorte:fim movimento-por-tempo
    if (amostra.decorrido - ultimaLeitura >= 0.25) {
      ultimaLeitura = amostra.decorrido;
      const leitura = orcamento.ler();
      painel.atualizar(leitura);
      elemento('metrics').textContent = `CPU ${leitura.custoMedioMs.toFixed(2)} ms · intervalo ${leitura.intervaloMedioMs.toFixed(2)} ms · teto ${leitura.tetoMs.toFixed(2)} ms`;
    }
  });
  laco.iniciar();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) laco.parar();
    else if (!sondando) { relogio.reiniciar(); orcamento.reiniciar(); ultimaLeitura = -1; laco.iniciar(); }
  });
  async function executarSonda(modo: ModoSondavel): Promise<void> {
    if (!capacidades || sondando) return;
    sondando = true;
    vr.disabled = ar.disabled = true;
    status.textContent = 'Sessão temporária de diagnóstico: observe o espaço e mantenha os controles visíveis. A coleta termina em até 6 s após a preparação.';
    // Não fazer consultas assíncronas antes de requestSession no evento de clique.
    const promessa = sondar(modo, capacidades);
    laco.parar();
    try {
      resultado = await promessa;
      montarRelatorio(relatorio, resultado);
      status.textContent = resultado.emSessao ? 'Diagnóstico concluído. A sessão temporária foi encerrada.'
        : `Sessão não aberta: ${resultado.motivoSemSessao}`;
    } finally {
      sondando = false;
      vr.disabled = !capacidades.regimes.some(r => r.regime.id === 'immersive-vr' && r.suporte === 'sim');
      ar.disabled = !capacidades.regimes.some(r => r.regime.id === 'immersive-ar' && r.suporte === 'sim');
      orcamento.reiniciar(); ultimaLeitura = -1;
      if (!document.hidden) laco.iniciar();
    }
  }
  vr.onclick = () => void executarSonda('immersive-vr');
  ar.onclick = () => void executarSonda('immersive-ar');
  elemento('export').onclick = () => {
    const nome = elemento<HTMLInputElement>('device').value.trim();
    if (!nome) { status.textContent = 'Identifique o aparelho para registrar a medição.'; elemento('device').focus(); return; }
    const dados = { registradoEm: new Date().toISOString(), aparelho: nome,
      navegador: navigator.userAgent, plataforma: navigator.platform,
      viewport: { largura: window.innerWidth, altura: window.innerHeight, dpr: window.devicePixelRatio },
      renderer: palco.renderer.getContext().getParameter(palco.renderer.getContext().RENDERER),
      regimeDaCena: 'tela-webgl', sonda: resultado, orcamento: orcamento.ler(), reparentagens: medidas,
      limites: ['CPU/submissão; GPU não medida.', 'Montagem/encaixe e cena imersiva ainda não implementados.'] };
    const url = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'medicao-quadro.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Medição exportada. Registre esse arquivo junto da identificação do aparelho na documentação.';
  };
  status.textContent = 'Cena pronta. Use os controles para conferir a hierarquia e a troca de pai.';
}
void iniciar().catch(erro => {
  elemento('status').textContent = `A cena não abriu: ${erro instanceof Error ? erro.message : String(erro)}. Verifique o suporte a WebGL 2.`;
  console.error(erro);
});
