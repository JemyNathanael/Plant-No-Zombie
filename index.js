import * as THREE from '../three.js-r145/build/three.module.js'

let scene, camera, renderer

let init = () => {
    scene = new THREE.Scene();

    //camera
    let fov = 75;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let aspect = w/h;
    camera = new THREE.PerspectiveCamera(fov, aspect);
    camera.position.set(0,50,100);

    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w,h);

    document.body.appendChild(renderer.domElement);
}

let render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}

let objects = (shape) => {
    let geom, material, mesh, texture;
    switch (shape) {
        case 'grass':
            texture = new THREE.TextureLoader().load('./Assets/grass.png')
            geom = new THREE.PlaneGeometry(100,75);
            material = new THREE.MeshPhongMaterial({color: 'grey', side: THREE.DoubleSide})
            mesh = new THREE.Mesh(geom,material);
            mesh.rotation.x = -Math.PI/2;

            scene.add(mesh)
            break;

        default:
            break;
    }
}

let ambientLight = () => {
    const light = new THREE.AmbientLight('#FFFFFC', 0.5);
    scene.add(light);
}

window.onload = () => {
    init();
    objects("grass");
    ambientLight();
    render();
}

window.onresize = () => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    camera.aspect = w/h;
    renderer.setSize(w,h);

    camera.updateProjectionMatrix();
}