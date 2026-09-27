import type { ResultadoDaSonda } from '../devices/sonda.ts';
import { descreverGraus } from '../devices/graus.ts';

function texto(raiz: HTMLElement, conteudo: string, tag = 'p'): void {
  const no = document.createElement(tag);
  no.textContent = conteudo;
  raiz.append(no);
}
function tabela(raiz: HTMLElement, cabecalhos: string[], linhas: readonly (readonly string[])[]): void {
  const tabela = document.createElement('table');
  const cab = tabela.createTHead().insertRow();
  for (const titulo of cabecalhos) {
    const th = document.createElement('th'); th.textContent = titulo; cab.append(th);
  }
  for (const linha of linhas) {
    const tr = tabela.insertRow();
    for (const valor of linha) tr.insertCell().textContent = valor;
  }
  const moldura = document.createElement('div');
  moldura.className = 'table-wrap'; moldura.append(tabela); raiz.append(moldura);
}
export function montarRelatorio(raiz: HTMLElement, resultado?: ResultadoDaSonda): void {
  raiz.replaceChildren();
  if (!resultado) { texto(raiz, 'Consultando os modos XR disponíveis…'); return; }
  const sem = resultado.semSessao;
  texto(raiz, `Contexto seguro: ${sem.contextoSeguro ? 'sim' : 'não'}. API XR: ${sem.temApiXr ? 'presente' : 'ausente'}. A cena de tela usa WebGL, mesmo sem uma sessão XR inline.`);
  tabela(raiz, ['Modo XR', 'Resposta', 'Evidência'], sem.regimes.map(l => [l.regime.id, l.suporte, l.observacao]));
  texto(raiz, `Sessão: ${resultado.estadoDaSessao}. ${resultado.motivoSemSessao ?? ''}`);
  const sessao = resultado.emSessao;
  if (!sessao) return;
  texto(raiz, `Amostra de ${sessao.modo}`, 'h3');
  texto(raiz, `Composição observada: ${sessao.composicaoObservada}. Referências: ${sessao.espacosConcedidos.join(', ') || 'nenhuma'}.`);
  texto(raiz, descreverGraus(sessao.graus));
  texto(raiz, `${sessao.posesObservadas} poses; ${sessao.posesEmuladas} com posição emulada. Referência da medição: ${sessao.referenciaDaAmostra}.`);
  tabela(raiz, ['Recurso', 'Estado', 'Uso previsto'], sessao.recursos.map(r => [r.nome, r.estado, r.paraQueServe]));
  texto(raiz, 'Não concedido: a API não informou se foi falta de suporte ou autorização. Uma lista indisponível produz estado indeterminado.');
  texto(raiz, 'Fontes de entrada observadas', 'h3');
  if (sessao.fontesDeEntrada.length) tabela(raiz, ['Lado', 'Mira', 'gripSpace', 'Mão', 'Perfis'], sessao.fontesDeEntrada.map(f => [f.lado, f.mira, f.temEspacoDePunho ? 'declarado' : 'ausente', f.temMao ? 'sim' : 'não', f.perfis.join(', ')]));
  else texto(raiz, 'Nenhuma fonte observada nesta amostra; isso não prova que o aparelho nunca oferece entradas.');
  texto(raiz, `${sessao.estabilidade.quadrosComPose}/${sessao.estabilidade.quadrosObservados} quadros com pose. ${sessao.diagnostico}`);
}
