// import * as THREE from './three.js-master/build/three.module.js'
// import * as THREE from '../three.js-r145/build/three.module.js'
// import { OrbitControls } from '../three.js-r145/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {GLTFLoader} from 'GLTFLoader'
import {TextGeometry} from 'TextGeometry'
import {FontLoader} from 'FontLoader'
// import {GentilisBold} from '../three.js-r145/examples/fonts/gentilis_bold.typeface.json'

let scene, cameraTPS, renderer, cameraFPS, activeCamera;
let day = 120000;
let night = 0.5;
let sky;
// let skybox;
// let skyboxNight;

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

let isDay = true;
let skyBox;
let skyDay = () => {
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load('./Assets/cloudy/bluecloud_ft.jpg');
    let texture_bk = new THREE.TextureLoader().load('./Assets/cloudy/bluecloud_bk.jpg');
    let texture_up = new THREE.TextureLoader().load('./Assets/cloudy/bluecloud_up.jpg');
    let texture_dn = new THREE.TextureLoader().load('./Assets/cloudy/bluecloud_dn.jpg');
    let texture_rt = new THREE.TextureLoader().load('./Assets/cloudy/bluecloud_rt.jpg');
    let texture_lf = new THREE.TextureLoader().load('./Assets/cloudy/bluecloud_lf.jpg');

    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}))
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}))

    for (let i = 0; i < 6; i++) {
        materialArray[i].side = THREE.BackSide;
    }

    let skyBoxGeo = new THREE.BoxGeometry(1000,1000,1000);
    skyBox = new THREE.Mesh(skyBoxGeo, materialArray);

    scene.add(skyBox);

    let materialArrayNight = [];
    let texture_ftNight = new THREE.TextureLoader().load('./Assets/nightskycolor.png');
    let texture_bkNight = new THREE.TextureLoader().load('./Assets/nightskycolor.png');
    let texture_upNight = new THREE.TextureLoader().load('./Assets/nightskycolor.png');
    let texture_dnNight = new THREE.TextureLoader().load('./Assets/nightskycolor.png');
    let texture_rtNight = new THREE.TextureLoader().load('./Assets/nightskycolor.png');
    let texture_lfNight = new THREE.TextureLoader().load('./Assets/nightskycolor.png');

    materialArrayNight.push(new THREE.MeshBasicMaterial({map: texture_ftNight}))
    materialArrayNight.push(new THREE.MeshBasicMaterial({map: texture_bkNight}))
    materialArrayNight.push(new THREE.MeshBasicMaterial({map: texture_upNight}))
    materialArrayNight.push(new THREE.MeshBasicMaterial({map: texture_dnNight}))
    materialArrayNight.push(new THREE.MeshBasicMaterial({map: texture_rtNight}))
    materialArrayNight.push(new THREE.MeshBasicMaterial({map: texture_lfNight}))

    for (let i = 0; i < 6; i++) {
        materialArrayNight[i].side = THREE.BackSide;
    }

    let skyBoxNightGeo = new THREE.BoxGeometry(1000,1000,1000);
    let skyboxNight = new THREE.Mesh(skyBoxNightGeo, materialArrayNight);

    // scene.add(skyBoxNight);

    // Not working
    document.addEventListener('keydown', (event) => {
        let isDay = true;
        if(event.code === 'Space'){
            isDay ? scene.add(skyBox) : scene.add(skyboxNight);
            
            isDay ? scene.remove(skyboxNight) : scene.remove(skyBox);
            isDay = !isDay;
        }
    })
}


// make 3D objects 
let objects = (shape) => {
    let geom, material, mesh, texture;
    let loader = new GLTFLoader();
    
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
            // let objToRender = 'zombie';
           
            loader.load(
                './Assets/zombie/scene.gltf', 
                function(gltf){
                    const object = gltf.scene;
                    object.position.set(10, 0, 0);
                    object.scale.set(60, 60, 60);
                    object.receiveShadow = true;
                    object.castShadow = true;
                    object.rotateY(-45);
                    scene.add(object);
                }, function(xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function(error){
                    console.error(error);
                }
            );
            break;
        case 'fence':
            loader.load(
                './Assets/fence/scene.gltf',
                function(gltf)
                {
                    const root = gltf.scene;
                    root.scale.set(10, 10, 10);
                    root.position.set(-40, 8.5, -44);
        
                    root.castShadow = true;
                    root.receiveShadow = true;
                    root.traverse(function(node){
                        if(node.isMesh || node.isLight)
                        {
                            node.castShadow = true;
                        }
                    })
                    scene.add(root);
                },
                function(load)
                {
                    console.log( ( load.loaded / load.total * 100 ) + '% loaded' );
                },
                function(error)
                {
                    console.log("Error", error);
                }
            ),
            loader.load(
                './Assets/fence/scene.gltf',
                function(gltf)
                {
                    const root = gltf.scene;
                    root.scale.set(10, 10, 10);
                    root.position.set(-20, 8.5, -44);
        
                    root.castShadow = true;
                    root.receiveShadow = true;
                    root.traverse(function(node){
                        if(node.isMesh || node.isLight)
                        {
                            node.castShadow = true;
                        }
                    })
                    scene.add(root);
                },
                function(load)
                {
                    console.log( ( load.loaded / load.total * 100 ) + '% loaded' );
                },
                function(error)
                {
                    console.log("Error", error);
                }
            ),
            loader.load(
                './Assets/fence/scene.gltf',
                function(gltf)
                {
                    const root = gltf.scene;
                    root.scale.set(10, 10, 10);
                    root.position.set(0, 8.5, -44);
        
                    root.castShadow = true;
                    root.receiveShadow = true;
                    root.traverse(function(node){
                        if(node.isMesh || node.isLight)
                        {
                            node.castShadow = true;
                        }
                    })
                    scene.add(root);
                },
                function(load)
                {
                    console.log( ( load.loaded / load.total * 100 ) + '% loaded' );
                },
                function(error)
                {
                    console.log("Error", error);
                }
            ),
            loader.load(
                './Assets/fence/scene.gltf',
                function(gltf)
                {
                    const root = gltf.scene;
                    root.scale.set(10, 10, 10);
                    root.position.set(20, 8.5, -44);
        
                    root.castShadow = true;
                    root.receiveShadow = true;
                    root.traverse(function(node){
                        if(node.isMesh || node.isLight)
                        {
                            node.castShadow = true;
                        }
                    })
                    scene.add(root);
                },
                function(load)
                {
                    console.log( ( load.loaded / load.total * 100 ) + '% loaded' );
                },
                function(error)
                {
                    console.log("Error", error);
                }
            ),
            loader.load(
                './Assets/fence/scene.gltf',
                function(gltf)
                {
                    const root = gltf.scene;
                    root.scale.set(10, 10, 10);
                    root.position.set(40, 8.5, -44);
        
                    root.castShadow = true;
                    root.receiveShadow = true;
                    root.traverse(function(node){
                        if(node.isMesh || node.isLight)
                        {
                            node.castShadow = true;
                        }
                    })
                    scene.add(root);
                },
                function(load)
                {
                    console.log( ( load.loaded / load.total * 100 ) + '% loaded' );
                },
                function(error)
                {
                    console.log("Error", error);
                }
            )
            break;
        case 'text':
            const txtLoader = new FontLoader();
            txtLoader.load(
                '../three.js-r145/examples/fonts/gentilis_bold.typeface.json', (gentilisBold)=> {
                    let textGeom = new TextGeometry('Plants NO Zombies', {
                        color: 0xCCB7B6,
                        font: gentilisBold,
                        size: 10,
                        height:1
                    });
                    let textMats = new THREE.MeshPhongMaterial();
                    let textMesh = new THREE.Mesh(textGeom, textMats);
                    textMesh.position.set(-55, 20, -50);
                    scene.add(textMesh);
                }
            )
            break;
        default:
            break;
    }
}


// Create the lightning
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
    if (event.code === 'Space'){
        sky = sky === day ? night : day;
    }
});



window.onload = () => {
    init();
    light();
    skyDay();
    objects("grass");
    objects('zombie');
    objects('fence');
    objects('text');
    render();
}

window.onresize = () => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    activeCamera.aspect = w/h;
    renderer.setSize(w,h);

    activeCamera.updateProjectionMatrix();
}