export interface Amostra {
  readonly delta: number;
  readonly decorrido: number;
  readonly intervaloReal: number;
  readonly saltoDescartado: boolean;
}
export class Relogio {
  private ultimo: number | undefined;
  private decorrido = 0;
  private readonly teto: number;
  constructor(teto = 0.1) {
    if (!Number.isFinite(teto) || teto <= 0) throw new Error('Teto de salto inválido.');
    this.teto = teto;
  }
  avancar(instanteMs: number): Amostra {
    if (!Number.isFinite(instanteMs)) throw new Error('Instante inválido.');
    const intervaloReal = this.ultimo === undefined ? 0 : Math.max(0, (instanteMs - this.ultimo) / 1000);
    this.ultimo = instanteMs;
    const delta = Math.min(intervaloReal, this.teto);
    this.decorrido += delta;
    return { delta, decorrido: this.decorrido, intervaloReal, saltoDescartado: intervaloReal > this.teto };
  }
  reiniciar(): void { this.ultimo = undefined; this.decorrido = 0; }
}
