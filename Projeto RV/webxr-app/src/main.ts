import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRScene } from './scene';
import { setupControllers } from './controllers';
import { setupARHitTest } from './ar';
import { sondar, type ModoSondavel, type ResultadoDaSonda } from './bancada/devices/sonda';
import { montarRelatorio } from './bancada/relatorio/relatorio';

const container = document.getElementById('app') as HTMLDivElement;
const report = document.getElementById('report') as HTMLDivElement;
const status = document.getElementById('status') as HTMLDivElement;
const probeVr = document.getElementById('probe-vr') as HTMLButtonElement;
const probeAr = document.getElementById('probe-ar') as HTMLButtonElement;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);

const xr = new XRScene();
const orbit = new OrbitControls(xr.camera, renderer.domElement);
orbit.target.set(0, 1.2, -1);
orbit.update();

const controllers = setupControllers(renderer, xr.scene, xr.interactive);
const arHitTest = setupARHitTest(renderer, xr.scene);

document.body.appendChild(VRButton.createButton(renderer));
document.body.appendChild(
  ARButton.createButton(renderer, {
    optionalFeatures: ['hit-test', 'local-floor', 'bounded-floor', 'dom-overlay'],
    domOverlay: { root: document.body },
  }),
);

async function executarSonda(modo: ModoSondavel): Promise<void> {
  probeVr.disabled = true;
  probeAr.disabled = true;
  status.textContent = `Sondando ${modo}... a sessão temporária será aberta e encerrada automaticamente.`;

  try {
    const resultado: ResultadoDaSonda = await sondar(modo);
    montarRelatorio(report, resultado);
    status.textContent = resultado.emSessao
      ? `Sondagem concluída em ${modo}.`
      : `Sondagem encerrada sem sessão: ${resultado.motivoSemSessao ?? 'sem motivo informado'}.`;
  } catch (erro) {
    status.textContent = erro instanceof Error ? erro.message : 'Erro durante a sondagem.';
  } finally {
    probeVr.disabled = false;
    probeAr.disabled = false;
  }
}

probeVr.addEventListener('click', () => void executarSonda('immersive-vr'));
probeAr.addEventListener('click', () => void executarSonda('immersive-ar'));

montarRelatorio(report, undefined);

const clock = new THREE.Clock();
renderer.setAnimationLoop((_timestamp, frame) => {
  const delta = clock.getDelta();
  xr.update(delta);
  controllers.update();
  if (frame) arHitTest.update(frame);
  renderer.render(xr.scene, xr.camera);
});

window.addEventListener('resize', () => {
  xr.camera.aspect = window.innerWidth / window.innerHeight;
  xr.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
