// public/app.js
import * as THREE from 'three';
// 1. Configuração da Cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// Define o tamanho do renderer para preencher a janela
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 2. Criação do Objeto (Cubo)
// Geometria: Define a forma do objeto
const geometry = new THREE.BoxGeometry(1, 1, 1); // Largura, Altura, Profundidade
// Material: Define a aparência do objeto (cor, textura, etc.)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Cor verde
// Mesh: Combina geometria e material para criar um objeto renderizável
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Adiciona o cubo à cena
// 3. Posição da Câmera
camera.position.z = 5; // Move a câmera para longe para que possamos ver o cubo
// 4. Loop de Animação
function animate() {
    // Solicita o próximo frame de animação
    requestAnimationFrame(animate);
   // Atualiza a rotação do cubo a cada frame
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // Renderiza a cena com a câmera atual
    renderer.render(scene, camera);
}
// Ajusta o tamanho do renderer quando a janela é redimensionada
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Atualiza a matriz de projeção da câmera
});
// Inicia o loop de animação
animate();
