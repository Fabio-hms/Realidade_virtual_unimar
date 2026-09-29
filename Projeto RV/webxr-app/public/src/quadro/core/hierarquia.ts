import { Matrix4, Object3D, Vector3 } from 'three';

export interface MedidaDeReparentagem {
  readonly objeto: string;
  readonly paiAnterior: string;
  readonly paiNovo: string;
  readonly antes: number[];
  readonly depois: number[];
  readonly desvioMetros: number;
  readonly erroMatriz: number;
}

function validarCaminho(no: Object3D): void {
  for (let atual: Object3D | null = no; atual; atual = atual.parent) {
    const { x, y, z } = atual.scale;
    if (![x, y, z].every(Number.isFinite) || Math.min(x, y, z) <= 1e-8
      || Math.abs(x - y) > 1e-8 || Math.abs(x - z) > 1e-8) {
      throw new Error('Reparentagem exige escalas positivas e uniformes nos ancestrais.');
    }
    if (!atual.matrixAutoUpdate) throw new Error('Este caminho exige transformações TRS automáticas.');
  }
}

export function reparentar(filho: Object3D, novoPai: Object3D): MedidaDeReparentagem {
  for (let no: Object3D | null = novoPai; no; no = no.parent) {
    if (no === filho) throw new Error('A troca criaria um ciclo na árvore.');
  }
  validarCaminho(filho);
  validarCaminho(novoPai);
  filho.updateWorldMatrix(true, false);
  novoPai.updateWorldMatrix(true, false);
  const mundoAntes = filho.matrixWorld.clone();
  const antes = new Vector3().setFromMatrixPosition(mundoAntes);
  const paiAnterior = filho.parent?.name ?? '(sem pai)';
  const local = new Matrix4().copy(novoPai.matrixWorld).invert().multiply(mundoAntes);
  novoPai.add(filho);
  local.decompose(filho.position, filho.quaternion, filho.scale);
  filho.updateWorldMatrix(true, true);
  const depois = new Vector3().setFromMatrixPosition(filho.matrixWorld);
  const erroMatriz = Math.max(...mundoAntes.elements.map((v, i) => Math.abs(v - filho.matrixWorld.elements[i])));
  return { objeto: filho.name, paiAnterior, paiNovo: novoPai.name,
    antes: antes.toArray(), depois: depois.toArray(), desvioMetros: antes.distanceTo(depois), erroMatriz };
}

export function descreverArvore(raiz: Object3D): string {
  const linhas: string[] = [];
  function visitar(no: Object3D, nivel: number): void {
    linhas.push(`${'  '.repeat(nivel)}${no.name || no.type}`);
    no.children.forEach(filho => visitar(filho, nivel + 1));
  }
  visitar(raiz, 0);
  return linhas.join('\n');
}
