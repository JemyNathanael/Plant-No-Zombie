// import * as THREE from './three.js-master/build/three.module.js'
// import * as THREE from '../three.js-r145/build/three.module.js'
// import { OrbitControls } from '../three.js-r145/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'

let scene, cameraTPS, renderer, cameraFPS, activeCamera;
let day = 1.2;
let night = 0.5;
let sky;

let init = () => {
    scene = new THREE.Scene();

    let w = window.innerWidth;
    let h = window.innerHeight;
    let aspect = w/h;

    //camera Third Person 
    cameraTPS = new THREE.PerspectiveCamera(45, aspect);
    cameraTPS.position.set(0, 15, 55);
    

    // camera First Person
    cameraFPS = new THREE.PerspectiveCamera(45, aspect);
    cameraFPS.position.set(-50, 15, 0);
    cameraFPS.lookAt(0, 15, 0);

    activeCamera = cameraTPS
    
    // Create webGL renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w,h);
    renderer.shadowMap.enabled = true
    
    document.body.appendChild(renderer.domElement);
  
    // make orbitcontrols for the cameraTPS
    let control = new OrbitControls( cameraTPS, renderer.domElement );
    control.target = new THREE.Vector3(0, 7, 0);
    control.update();
}

// render the scene and textures
let render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, activeCamera);
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
            material = new THREE.MeshStandardMaterial({map: texture});
            
            mesh = new THREE.Mesh(geom,material);
            mesh.rotation.x = -Math.PI/2;
            mesh.position.set(0, 0, -7.5);
            mesh.receiveShadow = true
            scene.add(mesh)
            
            break;
        case 'zombie':
            texture = new THREE.TextureLoader().load('')
            break;
        default:
            break;
    }
}


let light = () => {
    // Create ambient light
    let ambientLight = new THREE.AmbientLight(0xFFFFFC, 0.5);
    ambientLight.castShadow = false;
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xFFFFFF, sky);
    spotLight.castShadow = true;
    spotLight.position.set(-80, 40, 0);
    scene.add(spotLight);
}

// make an event listener for every key pressed based on the case
document.addEventListener('keydown', (event) => {    
    if (event.key === 'c' || event.key === 'C') {
        activeCamera = activeCamera === cameraTPS ? cameraFPS : cameraTPS;
    }
    if (event.key === '  ' || event.key === 'Spacebar'){
        sky = sky === day ? night : day;
    }
});

window.onload = () => {
    init();
    light();
    objects("grass");
    
    render();
}

window.onresize = () => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    activeCamera.aspect = w/h;
    renderer.setSize(w,h);

    activeCamera.updateProjectionMatrix();
}