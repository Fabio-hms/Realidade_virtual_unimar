import {
  BoxGeometry, Color, CylinderGeometry, DirectionalLight, Group,
  HemisphereLight, Mesh, MeshLambertMaterial, Scene,
} from 'three';
import { QUADRO, inconsistenciasDoDominio, type ComponenteId, type Medidas } from '../dominio/dominio.ts';

export function montarCena() {
  const erros = inconsistenciasDoDominio(QUADRO);
  if (erros.length) throw new Error(erros.join('\n'));
  const sala = new Scene();
  sala.name = 'cena';
  sala.background = new Color(0x101d2b);
  sala.add(new HemisphereLight(0xffffff, 0x607080, 2.0));
  const luz = new DirectionalLight(0xffffff, 2.0);
  luz.position.set(1, 3, 2);
  sala.add(luz);
  const materiais = new Map<number, MeshLambertMaterial>();
  const material = (cor: number) => {
    if (!materiais.has(cor)) materiais.set(cor, new MeshLambertMaterial({ color: cor }));
    return materiais.get(cor)!;
  };
  const caixa = (nome: string, medidas: Medidas, cor: number) => {
    const objeto = new Mesh(new BoxGeometry(...medidas), material(cor));
    objeto.name = nome;
    return objeto;
  };
  const apoio = new Group();
  apoio.name = 'area-de-apoio';
  apoio.position.y = QUADRO.apoio.alturaDoTopo;
  sala.add(apoio);
  const tampo = caixa('tampo', QUADRO.apoio.medidas, 0x344a5e);
  tampo.position.y = -QUADRO.apoio.medidas[1] / 2;
  apoio.add(tampo);

  // recorte:inicio parentesco-do-quadro
  const placa = new Group();
  placa.name = 'placa';
  placa.position.set(0, 0.21, -0.15);
  apoio.add(placa);
  placa.add(caixa('corpo-da-placa', QUADRO.placa.medidas, 0x738da1));
  const trilho = new Group();
  trilho.name = QUADRO.trilhos[0].id;
  trilho.position.set(0, -0.005, 0.019);
  placa.add(trilho);
  trilho.add(caixa('corpo-do-trilho', QUADRO.trilhos[0].medidas, 0xc0ced8));
  // recorte:fim parentesco-do-quadro

  const indicador = new Mesh(new CylinderGeometry(QUADRO.indicador.raio, QUADRO.indicador.raio, 0.009, 16), material(0x263e34));
  indicador.name = 'indicador-de-conclusao-desligado';
  indicador.rotation.x = Math.PI / 2;
  indicador.position.set(0.21, 0.155, 0.015);
  placa.add(indicador);
  const componentes = new Map<ComponenteId, Group>();
  for (const [indice, dado] of QUADRO.disjuntores.entries()) {
    const no = new Group();
    no.name = dado.id;
    if (dado.id === 'disjuntor-1')
    {
      no.position.set(-0.125, 0.225, -0.0815);
    }
    else
    {
      no.position.set(-0.125 + indice * 0.05, 0.041, 0.12);
    }
    no.add(caixa('corpo', dado.medidas, 0xe1e7ea));
    for (const [nome, y] of [['entrada', 0.027], ['saida', -0.027]] as const) {
      const terminal = caixa(nome, [0.009, 0.009, 0.004], 0x65798a);
      terminal.position.set(0, y, 0.035);
      no.add(terminal);
    }
    const chave = caixa('chave', [0.012, 0.017, 0.008], 0x182636);
    chave.position.z = 0.038;
    no.add(chave);
    const garra = caixa('encaixe', [0.015, 0.013, 0.008], 0x98abba);
    garra.position.set(0, -0.02, -0.038);
    no.add(garra);
    apoio.add(no);
    componentes.set(dado.id, no);
  }
  for (const [indice, dado] of QUADRO.bornes.entries()) {
    const no = new Group();
    no.name = dado.id;
    no.position.set(indice === 0 ? -0.23 : 0.23, 0.021, 0.12);
    no.add(caixa('corpo', dado.medidas, indice === 0 ? 0xe6ad48 : 0x3d9cad));
    const garra = caixa('encaixe', [0.016, 0.012, 0.008], 0x98abba);
    garra.position.set(0, -0.01, -0.02);
    no.add(garra);
    apoio.add(no);
    componentes.set(dado.id, no);
  }
  const barramento = new Group();
  barramento.name = 'barramento-1';
  barramento.position.set(0, 0.018, 0.23);
  barramento.add(caixa('corpo', QUADRO.barramentos[0].medidas, 0xc38a47));
  for (let i = 0; i < 6; i++) {
    const contato = caixa(`contato-${i + 1}`, [0.008, 0.020, 0.009], 0xc38a47);
    contato.position.set(-0.125 + i * 0.05, -0.004, -0.017);
    barramento.add(contato);
  }
  apoio.add(barramento);
  componentes.set('barramento-1', barramento);
  const suporteDoPainel = new Group();
  suporteDoPainel.name = 'painel-de-custo';
  suporteDoPainel.position.set(0, 0.12, 0.016);
  placa.add(suporteDoPainel);
  return { sala, apoio, placa, trilho, componentes, indicador, suporteDoPainel };
}
export type CenaDoQuadro = ReturnType<typeof montarCena>;
