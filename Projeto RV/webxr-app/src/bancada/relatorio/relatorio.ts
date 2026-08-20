import type { ResultadoDaSonda } from '../devices/sonda';
import { descreverClasse } from '../devices/graus';
import type { LinhaDoRelatorio, Suporte } from '../modes/verificacao';

function celula(texto: string, cabecalho = false): HTMLTableCellElement {
  const elemento = document.createElement(cabecalho ? 'th' : 'td');
  elemento.textContent = texto;
  return elemento;
}

function rotuloSuporte(suporte: Suporte): string {
  if (suporte === 'sim') return 'suportado';
  if (suporte === 'nao') return 'não suportado';
  return 'sem resposta';
}

function tabelaRegimes(linhas: readonly LinhaDoRelatorio[]): HTMLTableElement {
  const tabela = document.createElement('table');
  const cab = tabela.insertRow();
  ['Regime', 'Neste aparelho', 'Observação'].forEach((t) => cab.appendChild(celula(t, true)));
  for (const linha of linhas) {
    const tr = tabela.insertRow();
    tr.appendChild(celula(linha.regime.nome));
    tr.appendChild(celula(rotuloSuporte(linha.suporte)));
    tr.appendChild(celula(linha.observacao));
  }
  return tabela;
}

function tabelaRecursos(resultado: ResultadoDaSonda): HTMLTableElement | null {
  if (!resultado.emSessao) return null;
  const tabela = document.createElement('table');
  const cab = tabela.insertRow();
  ['Recurso', 'Estado', 'Para que serve'].forEach((t) => cab.appendChild(celula(t, true)));
  for (const recurso of resultado.emSessao.recursos) {
    const tr = tabela.insertRow();
    tr.appendChild(celula(recurso.nome));
    tr.appendChild(celula(recurso.estado));
    tr.appendChild(celula(recurso.paraQueServe));
  }
  return tabela;
}

function tabelaEntradas(resultado: ResultadoDaSonda): HTMLTableElement | null {
  if (!resultado.emSessao) return null;
  const tabela = document.createElement('table');
  const cab = tabela.insertRow();
  ['Lado', 'Mira', 'Pose de punho', 'Mão', 'Perfis'].forEach((t) => cab.appendChild(celula(t, true)));
  for (const fonte of resultado.emSessao.fontesDeEntrada) {
    const tr = tabela.insertRow();
    tr.appendChild(celula(fonte.lado));
    tr.appendChild(celula(fonte.mira));
    tr.appendChild(celula(fonte.temPoseDePunho ? 'sim' : 'não'));
    tr.appendChild(celula(fonte.temMao ? 'sim' : 'não'));
    tr.appendChild(celula(fonte.perfis.join(', ') || 'nenhum'));
  }
  return tabela;
}

export function montarRelatorio(raiz: HTMLElement, resultado: ResultadoDaSonda | undefined): void {
  raiz.replaceChildren();
  if (!resultado) {
    raiz.innerHTML = '<p>Nenhuma sondagem executada ainda.</p>';
    return;
  }

  const titulo = document.createElement('h2');
  titulo.textContent = 'Sonda de capacidades';
  raiz.appendChild(titulo);

  const resumo = document.createElement('p');
  resumo.textContent = `${descreverClasse(resultado.classe)} Contexto seguro: ${resultado.semSessao.contextoSeguro ? 'sim' : 'não'}. API XR: ${resultado.semSessao.temApiXr ? 'sim' : 'não'}.`;
  raiz.appendChild(resumo);

  raiz.appendChild(tabelaRegimes(resultado.semSessao.regimes));

  const botaoSessao = document.createElement('p');
  botaoSessao.textContent = resultado.emSessao
    ? `Sessão sondada: ${resultado.emSessao.modo}.`
    : `Sessão não sondada: ${resultado.motivoSemSessao ?? 'motivo não informado'}`;
  raiz.appendChild(botaoSessao);

  if (!resultado.emSessao) return;

  const detalhes = resultado.emSessao;
  const hRec = document.createElement('h3');
  hRec.textContent = 'Recursos opcionais';
  raiz.appendChild(hRec);
  const tabelaRec = tabelaRecursos(resultado);
  if (tabelaRec) raiz.appendChild(tabelaRec);

  const hEsp = document.createElement('h3');
  hEsp.textContent = 'Espaços de referência concedidos';
  raiz.appendChild(hEsp);
  const pEsp = document.createElement('p');
  pEsp.textContent = detalhes.espacosConcedidos.join(', ') || 'nenhum dos espaços consultados';
  raiz.appendChild(pEsp);

  const hG = document.createElement('h3');
  hG.textContent = 'Graus de liberdade';
  raiz.appendChild(hG);
  const pG = document.createElement('p');
  pG.textContent = detalhes.graus === 'seis'
    ? 'Seis graus de liberdade — orientação e deslocamento.'
    : detalhes.graus === 'tres'
      ? 'Três graus de liberdade — orientação, sem evidência de deslocamento.'
      : 'Indeterminado — os espaços concedidos não bastam para afirmar.';
  raiz.appendChild(pG);

  const hComp = document.createElement('h3');
  hComp.textContent = 'Composição do fundo';
  raiz.appendChild(hComp);
  const pComp = document.createElement('p');
  pComp.textContent = detalhes.composicaoObservada;
  raiz.appendChild(pComp);

  const hInput = document.createElement('h3');
  hInput.textContent = 'Fontes de entrada';
  raiz.appendChild(hInput);
  const tabelaInput = tabelaEntradas(resultado);
  if (tabelaInput) raiz.appendChild(tabelaInput);

  const hEst = document.createElement('h3');
  hEst.textContent = 'Estabilidade do rastreamento';
  raiz.appendChild(hEst);
  const pEst = document.createElement('p');
  pEst.textContent = `${detalhes.estabilidade.quadrosComPose}/${detalhes.estabilidade.quadrosObservados} quadros com pose (${detalhes.estabilidade.percentualComPose.toFixed(1)}%). ${detalhes.diagnostico}`;
  raiz.appendChild(pEst);
}
