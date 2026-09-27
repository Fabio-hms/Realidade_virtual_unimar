export interface Estabilidade {
  readonly quadrosObservados: number;
  readonly quadrosComPose: number;
  readonly quadrosSemPose: number;
  readonly percentualComPose: number;
}

export class ContadorDeEstabilidade {
  private observados = 0;
  private comPose = 0;

  registrar(temPose: boolean): void {
    this.observados += 1;
    if (temPose) this.comPose += 1;
  }

  resultado(): Estabilidade {
    const semPose = this.observados - this.comPose;
    return {
      quadrosObservados: this.observados,
      quadrosComPose: this.comPose,
      quadrosSemPose: semPose,
      percentualComPose: this.observados === 0 ? 0 : (this.comPose / this.observados) * 100,
    };
  }
}

export function diagnosticar(estabilidade: Estabilidade): string {
  if (estabilidade.quadrosObservados === 0) return 'Não foi possível observar quadros.';
  if (estabilidade.quadrosSemPose === 0) return 'Todos os quadros observados forneceram pose.';
  return `${estabilidade.quadrosSemPose} de ${estabilidade.quadrosObservados} quadros não forneceram pose.`;
}
