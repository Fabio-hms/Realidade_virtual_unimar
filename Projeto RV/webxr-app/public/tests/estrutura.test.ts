import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, Vector3 } from 'three';
import { montarCena } from '../src/quadro/core/cena.ts';
import { reparentar } from '../src/quadro/core/hierarquia.ts';
import { Relogio } from '../src/quadro/core/relogio.ts';
import { Orcamento } from '../src/quadro/core/orcamento.ts';
import { QUADRO, inconsistenciasDoDominio } from '../src/quadro/dominio/dominio.ts';
import { grausDeLiberdade } from '../src/quadro/devices/graus.ts';
import { estadoDoRecurso } from '../src/quadro/devices/recursos.ts';
import { classificarErro } from '../src/quadro/modes/verificacao.ts';

test('a cena contém os nove componentes manipuláveis declarados e as suas partes', () => {
  assert.deepEqual(inconsistenciasDoDominio(QUADRO), []);
  const cena = montarCena();
  const dados = [...QUADRO.disjuntores, ...QUADRO.bornes, ...QUADRO.barramentos];
  assert.equal(cena.componentes.size, 9);
  for (const dado of dados) {
    const no = cena.componentes.get(dado.id)!;
    assert.ok(no, dado.id);
    assert.equal(no.parent, cena.apoio);
    for (const parte of dado.partes) {
      assert.ok(no.children.some(f => f.name === parte || (parte === 'contatos' && f.name.startsWith('contato-'))));
    }
  }
  assert.equal(cena.trilho.parent, cena.placa);
});

test('mover a placa move o trilho mas deixa um disjuntor solto sobre o apoio', () => {
  const c = montarCena();
  const solto = c.componentes.get('disjuntor-1')!;
  const antesSolto = solto.getWorldPosition(new Vector3());
  const antesTrilho = c.trilho.getWorldPosition(new Vector3());
  c.placa.position.x += 0.2;
  assert.ok(solto.getWorldPosition(new Vector3()).distanceTo(antesSolto) < 1e-12);
  assert.ok(Math.abs(c.trilho.getWorldPosition(new Vector3()).distanceTo(antesTrilho) - 0.2) < 1e-12);
});

test('reparentagem preserva a matriz inteira com translação, rotação e escala uniforme nos ancestrais', () => {
  const raiz = new Group(), a = new Group(), b = new Group(), filho = new Group();
  raiz.add(a, b); a.add(filho);
  raiz.rotation.set(0.1, 0.2, 0.3); raiz.scale.setScalar(0.5);
  a.position.set(0.5, -0.7, 0.8); a.rotation.set(0.2, -0.8, 0.1); a.scale.setScalar(2);
  b.position.set(-1, 0.6, -0.4); b.rotation.set(-0.3, 0.6, 0.4); b.scale.setScalar(1.5);
  filho.position.set(0.1, 0.2, 0.3); filho.rotation.set(0.7, 0.6, -0.2);
  const m = reparentar(filho, b);
  assert.ok(m.desvioMetros < 1e-12);
  assert.ok(m.erroMatriz < 1e-12);
  assert.equal(filho.parent, b);
  const volta = reparentar(filho, a);
  assert.ok(volta.erroMatriz < 1e-12);
});

test('reparentagem recusa ciclos e escalas que poderiam gerar cisalhamento', () => {
  const a = new Group(), b = new Group(), filho = new Group(); a.add(filho);
  assert.throws(() => reparentar(a, filho), /ciclo/);
  b.scale.set(1, 2, 1);
  assert.throws(() => reparentar(filho, b), /uniformes/);
  assert.equal(filho.parent, a);
  b.scale.setScalar(0);
  assert.throws(() => reparentar(filho, b), /uniformes/);
});

test('dez segundos de simulação são iguais a 30, 60 e 120 Hz', () => {
  const tempos = [30, 60, 120].map(hz => {
    const r = new Relogio(); r.avancar(0);
    let final = 0;
    for (let i = 1; i <= 10 * hz; i++) final = r.avancar(i * 1000 / hz).decorrido;
    return final;
  });
  for (const tempo of tempos) assert.ok(Math.abs(tempo - 10) < 1e-10);
});

test('o relógio limita a suspensão mas preserva o intervalo real para medir', () => {
  const r = new Relogio();
  assert.equal(r.avancar(100).delta, 0);
  const v = r.avancar(5100);
  assert.equal(v.delta, 0.1); assert.equal(v.intervaloReal, 5); assert.equal(v.saltoDescartado, true);
  r.reiniciar(); assert.equal(r.avancar(99999).delta, 0);
});

test('orçamento mantém só a janela recente e não confunde CPU com intervalo', () => {
  const o = new Orcamento(16.67, 2);
  o.registrar(1, 0, 1, 1); assert.equal(o.ler().quadrosMedidos, 0);
  o.registrar(1, 10, 2, 20); o.registrar(2, 20, 3, 30); o.registrar(4, 30, 4, 40);
  const l = o.ler();
  assert.equal(l.quadrosMedidos, 2); assert.equal(l.custoMedioMs, 3);
  assert.equal(l.intervaloMedioMs, 25); assert.equal(l.quadrosAcimaDoTeto, 2);
});

test('a sonda distingue evidência de falta de informação', () => {
  assert.equal(grausDeLiberdade(0, 0), 'indeterminado');
  assert.equal(grausDeLiberdade(60, 60), 'posicao-emulada');
  assert.equal(grausDeLiberdade(60, 59), 'seis-observados');
  assert.equal(estadoDoRecurso('anchors', []), 'nao-concedido');
  assert.equal(estadoDoRecurso('anchors', undefined), 'indeterminado');
  assert.equal(estadoDoRecurso('anchors', ['anchors']), 'concedido');
  assert.equal(classificarErro(new DOMException('x', 'NotSupportedError')), 'ausente');
  assert.equal(classificarErro(new DOMException('x', 'NotAllowedError')), 'negado-ou-bloqueado');
});
