import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Draco loader used to load models compressed 
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

// GLTF loader so we can load the model
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Add these new variables so we can handle the clicking events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Canvas - get the canvas from the html page so we can do stuff with it
const canvas = document.querySelector('canvas.webgl');

// Scene - create a new scene
const scene = new THREE.Scene();

// Sizes 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Textures - just a simple red material
const bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xE03616})

//Variables
let model;

// Load Model
gltfLoader.load(
    'cubes.glb', // a model from blender that contains 2 cubes
    (gltf) => {

        // Print the child models in the console aka all the cubes
        console.log("Child models:");
        gltf.scene.traverse((child) => {
            console.log(child); //to see them printed do CTRL + SHIFT + I and go to console
        });

        //Adding the same material to all the cubes
        gltf.scene.traverse((child) => {
            child.material = bakedMaterial;
        });

        model = gltf.scene;
        scene.add(model) //add the model to the scene


        //All this code below is for the view and camera movement- just ignore it.
        // Calculate bounding box of the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Position the model and camera
        model.position.y -= size.y / 1000;

        // Set the camera position in front of the model, higher, and further back
        const cameraDistance = size.z * 4; // Adjust distance as needed
        camera.position.set(center.x, center.y + size.y * 0.2, center.z + cameraDistance);
        camera.lookAt(center.x, center.y, center.z);

        // Update controls target
        controls.target.set(center.x, center.y, center.z);
        controls.update();
        window.addEventListener('click', onMouseClick);

    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the model:', error);
    }
);

// Handling mouse clicks
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Creates a list of cubes that the ray is interesecting with (there should only be one because the ray only intersects an object when we click on it)
    const intersects = raycaster.intersectObject(model, true);

    if (intersects.length > 0) { //if that list is not empty 
        const clickedObject = intersects[0].object; // then find the cube that was clicked
        console.log(`${clickedObject.name} was clicked on`); //print out the cube that was clicked on in the console
        if(clickedObject.name === 'cube2'){ //if that cube was cube 2 then take me to another page
            window.location.href = '../home';
        } else{//if not then print out the stuff below 
            alert("Clicking this cube (cube1) doesn't take you anywhere");
            console.log("Clicking this cube doesn't take you anywhere");

        }
    
    }
}


//More boilerplate stuff that has to be here for the scene to work
// ANCHOR - Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
scene.add(camera);

// OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Enable smooth controls

// ANCHOR - Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0xF2F3F4, 1); // Set the background color to #FEFEFA

// Handle window resize this makes the site responsive
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
});

// ANCHOR - Animate
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();