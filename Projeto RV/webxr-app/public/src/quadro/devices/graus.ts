export type GrausDeLiberdade = 'seis-observados' | 'posicao-emulada' | 'indeterminado';
export function grausDeLiberdade(observadas: number, emuladas: number): GrausDeLiberdade {
  if (observadas <= 0) return 'indeterminado';
  return emuladas < observadas ? 'seis-observados' : 'posicao-emulada';
}
export function descreverGraus(graus: GrausDeLiberdade): string {
  if (graus === 'seis-observados') return 'Orientação e posição rastreadas em pelo menos uma pose (evidência de 6 DoF nessa amostra).';
  if (graus === 'posicao-emulada') return 'Só posições emuladas na amostra: compatível com 3 DoF ou perda de rastreamento de um aparelho 6 DoF.';
  return 'Indeterminado: nenhuma pose utilizável num espaço fixo foi observada.';
}
