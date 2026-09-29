import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function montarPalco(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  const camera = new PerspectiveCamera(45, 1, 0.01, 20);
  const controles = new OrbitControls(camera, canvas);
  controles.minDistance = 0.45;
  controles.maxDistance = 2.5;
  controles.maxPolarAngle = Math.PI / 2;
  function enquadrar(): void {
    camera.position.set(0.70, 1.49, 1.0);
    controles.target.set(0, 1.00, 0);
    controles.update();
  }
  enquadrar();
  function ajustar(): boolean {
    const largura = Math.max(1, canvas.clientWidth);
    const altura = Math.max(1, canvas.clientHeight);
    const densidade = Math.min(window.devicePixelRatio || 1, 1.5);
    if (renderer.getPixelRatio() === densidade && canvas.width === Math.floor(largura * densidade)
      && canvas.height === Math.floor(altura * densidade)) return false;
    renderer.setPixelRatio(densidade);
    renderer.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
    return true;
  }
  return { renderer, camera, controles, enquadrar, ajustar,
    desenhar: (cena: Scene) => renderer.render(cena, camera) };
}
export type Palco = ReturnType<typeof montarPalco>;
