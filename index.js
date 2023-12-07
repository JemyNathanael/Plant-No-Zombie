import * as THREE from './three.js-master/build/three.module.js'

let scene, camera, renderer

let init = () => {
    scene = new THREE.Scene();

    //camera
    let fov = 75;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let aspect = w/h;
    camera = new THREE.PerspectiveCamera(fov, aspect);
    camera.position.set(0,60,100);

    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w,h);
    renderer.shadowMap.enabled = true
    // renderer.setClearColor('black');

    document.body.appendChild(renderer.domElement);
}

let render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//blom bisa
let skyDay = () => {
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load('./bluecloud_ft.jpg');
    let texture_bk = new THREE.TextureLoader().load('./bluecloud_bk.jpg');
    let texture_up = new THREE.TextureLoader().load('./bluecloud_up.jpg');
    let texture_dn = new THREE.TextureLoader().load('./bluecloud_dn.jpg');
    let texture_rt = new THREE.TextureLoader().load('./bluecloud_rt.jpg');
    let texture_lf = new THREE.TextureLoader().load('./bluecloud_lf.jpg');

    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}))

    let skyBoxGeo = new THREE.BoxGeometry(1000,1000,1000);
    let skyBox = new THREE.Mesh(skyBoxGeo, materialArray);

    scene.add(skyBox);
}

let objects = (shape) => {
    let geom, material, mesh, texture;
    switch (shape) {

        case 'grass':
            texture = new THREE.TextureLoader().load('https://thumbs.dreamstime.com/b/green-grass-field-background-soccer-football-sports-lawn-pattern-texture-close-up-image-142564163.jpg');
            geom = new THREE.PlaneGeometry(100,75);
            material = new THREE.MeshBasicMaterial({map: texture});
            mesh = new THREE.Mesh(geom,material);
            mesh.rotation.x = -Math.PI/2;
            mesh.position.set(0, 0, -7.5);
            
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

//blom jadi
let spotLight = () => {
    const light = new THREE.SpotLight('#FFFFFF', 1.2);

}

window.onload = () => {
    init();
    skyDay();
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