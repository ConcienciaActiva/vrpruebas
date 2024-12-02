let scene, camera, renderer, controls, textureLoader;
let useGyroscope = false;
const container = document.getElementById('vr-container');

function init() {
    // Crear escena
    scene = new THREE.Scene();

    // Crear cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    // Crear renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Habilitar VR
    container.appendChild(renderer.domElement);

    // Cargar imagen 360 como textura
    textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./imgs/adt.png');
    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.scale.x = -1; // Invertir esfera para verla desde dentro
    scene.add(sphere);

    // Probar si el giroscopio está disponible
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
        window.addEventListener('deviceorientation', function (event) {
            if (event.alpha !== null) {
                useGyroscope = true;
                controls = new DeviceOrientationControls(camera);
            }
        }, false);
    }

    // Si no hay giroscopio, usar controles táctiles (OrbitControls)
    if (!useGyroscope) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
    }

    // Ajustar tamaño de ventana al redimensionar
    window.addEventListener('resize', onWindowResize, false);

    // Habilitar VR en el botón de experiencia usando THREE.WebXR
    document.body.appendChild(THREE.VRButton.createButton(renderer)); // Uso correcto de THREE.WebXRButton.createButton()

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update(); // Actualizar controles
    renderer.render(scene, camera);
}

init();
