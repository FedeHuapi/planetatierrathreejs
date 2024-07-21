import * as THREE from 'three';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import { gsap } from 'gsap';

// Configurar la escena, la cámara y el renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Añadir controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxDistance = 500;
controls.enabled = false; // Desactiva los controles inicialmente

// Añadir una luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiental
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direccional
directionalLight.position.set(5, 3, 5).normalize();
scene.add(directionalLight);

// Cargar la textura de la Tierra
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/earthmap1k.jpg');

// Crear una esfera para la Tierra
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Crear estrellas
function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

createStars();

// Crear un grupo para las luces de las ciudades
const cityLightsGroup = new THREE.Group();
scene.add(cityLightsGroup);

// Función para convertir latitud y longitud a coordenadas esféricas
function latLonToVector3(lat, lon, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180); // Latitude
    const theta = (lon + 180) * (Math.PI / 180); // Longitude

    const x = - (radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Crear luces para las ciudades
function createCityLights() {
    const cityLights = [
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'Tokyo', lat: 35.6895, lon: 139.6917 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
        { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 }
    ];

    cityLights.forEach(city => {
        const position = latLonToVector3(city.lat, city.lon, 1.01); // Slightly outside the Earth’s surface
        const light = new THREE.PointLight(0xffff00, 1, 10); // Yellow light with intensity 1
        light.position.set(position.x, position.y, position.z);
        cityLightsGroup.add(light);
    });
}

createCityLights(); // Añadir luces para las ciudades

// Configurar la posición de la cámara
camera.position.z = 3;

// Configuración de GUI
const gui = new GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'z', 1, 10).name('Zoom');
cameraFolder.open();

const controlsFolder = gui.addFolder('Controls');
controlsFolder.add(controls, 'enableRotate').name('Enable Rotate');
controlsFolder.add(controls, 'autoRotate').name('Auto Rotate');
controlsFolder.add(controls, 'autoRotateSpeed', -10, 10).name('Rotate Speed');
controlsFolder.open();

// Función de animación
let startTime = null;
const initialAnimationDuration = 1000; // 1 second for one quick spin
const targetPosition = { x: 1.5, y: -1.5, z: 1.5 }; // Adjusted position for Argentina (a bit lower)

// Animación inicial con gsap
gsap.to(earth.rotation, { y: Math.PI * 2, duration: 1, ease: "power1.inOut" });
gsap.to(camera.position, { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, duration: 2, ease: "power1.inOut", delay: 1 });

setTimeout(() => {
    controls.enabled = true;
    controls.autoRotate = true; // Habilita la rotación
    controls.autoRotateSpeed = 0.5; // Establece la velocidad de auto-rotación
}, 3000); // 1 second for spin + 2 seconds for zoom

function animate() {
    // Continuar rotando la Tierra
    earth.rotation.y += 0.001;

    // Hacer que el grupo de luces se rote con la Tierra
    cityLightsGroup.rotation.y = earth.rotation.y;

    // Asegurarse de que los controles se actualicen
    controls.update();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Ajustar el tamaño del renderizador en caso de cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});