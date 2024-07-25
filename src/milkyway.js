import * as THREE from 'three';

export function createMilkyWay() {
    const milkyWayGroup = new THREE.Group();

    const starColors = [0xffffff, 0xffd700, 0xffa500, 0xff4500, 0xff69b4, 0xba55d3, 0x1e90ff];
    const numArms = 4;
    const armOffset = Math.PI / 4;

    for (let i = 0; i < numArms; i++) {
        const arm = createSpiralArm(starColors, armOffset * i);
        milkyWayGroup.add(arm);
    }

    return milkyWayGroup;
}

function createSpiralArm(colors, rotationOffset) {
    const numStars = 2000;
    const armLength = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numStars * 3);
    const colorsArray = new Float32Array(numStars * 3);

    for (let i = 0; i < numStars; i++) {
        const radius = Math.random() * armLength;
        const angle = radius * 0.1 + rotationOffset + (Math.random() - 0.5) * 0.2;
        const x = radius * Math.cos(angle);
        const y = (Math.random() - 0.5) * 20;
        const z = radius * Math.sin(angle);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
        colorsArray[i * 3] = color.r;
        colorsArray[i * 3 + 1] = color.g;
        colorsArray[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({ size: 1, vertexColors: true });
    return new THREE.Points(geometry, material);
}
