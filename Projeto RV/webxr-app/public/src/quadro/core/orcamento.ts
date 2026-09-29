export const TETO_DESKTOP_MS = 1000 / 60;
export const TETO_VISOR_MS = 1000 / 90;
export interface LeituraDoOrcamento {
  readonly tetoMs: number;
  readonly quadrosMedidos: number;
  readonly custoMedioMs: number;
  readonly intervaloMedioMs: number;
  readonly piorIntervaloMs: number;
  readonly quadrosAcimaDoTeto: number;
  readonly chamadasDeDesenho: number;
  readonly triangulos: number;
}
export class Orcamento {
  private readonly teto: number;
  private readonly tamanho: number;
  private custos: number[] = [];
  private intervalos: number[] = [];
  private indice = 0;
  private chamadas = 0;
  private triangulos = 0;
  constructor(teto: number, tamanho = 120) {
    if (!Number.isFinite(teto) || teto <= 0 || !Number.isInteger(tamanho) || tamanho <= 0) throw new Error('Orçamento inválido.');
    this.teto = teto; this.tamanho = tamanho;
  }
  registrar(custoMs: number, intervaloMs: number, chamadas: number, triangulos: number): void {
    if (![custoMs, intervaloMs, chamadas, triangulos].every(n => Number.isFinite(n) && n >= 0)) return;
    if (intervaloMs === 0) return;
    this.custos[this.indice] = custoMs;
    this.intervalos[this.indice] = intervaloMs;
    this.indice = (this.indice + 1) % this.tamanho;
    this.chamadas = chamadas; this.triangulos = triangulos;
  }
  ler(): LeituraDoOrcamento {
    const n = this.custos.length;
    return { tetoMs: this.teto, quadrosMedidos: n,
      custoMedioMs: n ? this.custos.reduce((a, v) => a + v, 0) / n : 0,
      intervaloMedioMs: n ? this.intervalos.reduce((a, v) => a + v, 0) / n : 0,
      piorIntervaloMs: n ? Math.max(...this.intervalos) : 0,
      quadrosAcimaDoTeto: this.intervalos.filter(v => v > this.teto).length,
      chamadasDeDesenho: this.chamadas, triangulos: this.triangulos };
  }
  reiniciar(): void { this.custos = []; this.intervalos = []; this.indice = 0; this.chamadas = 0; this.triangulos = 0; }
}
