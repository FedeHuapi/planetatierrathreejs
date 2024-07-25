import * as THREE from 'three';

export function createMilkyWay() {
    const milkyWayGroup = new THREE.Group();

    const numParticles = 100000;
    const particles = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const spiralArms = 4;
    const armSeparationAngle = (2 * Math.PI) / spiralArms;
    const armOffset = 0.5;
    
    for (let i = 0; i < numParticles; i++) {
        const r = Math.random() * 500;
        const arm = Math.floor(i % spiralArms);
        const angle = (arm * armSeparationAngle) + (Math.random() * armOffset);
        const spiralOffset = Math.random() * 50 - 25;

        const x = r * Math.cos(angle) + spiralOffset;
        const y = Math.random() * 20 - 10;
        const z = r * Math.sin(angle) + spiralOffset;

        positions.push(x, y, z);

        const color = new THREE.Color();
        const hue = 0.6 + 0.2 * (r / 500);
        color.setHSL(hue, 0.7, 0.9);
        colors.push(color.r, color.g, color.b);
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 2, vertexColors: true });

    const points = new THREE.Points(particles, material);
    milkyWayGroup.add(points);

    return milkyWayGroup;
}

