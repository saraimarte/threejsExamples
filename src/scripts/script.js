import * as THREE from 'three'

//ANCHOR - Cursor
window.addEventListener('mousemove', (event) => {
    console.log(event.clientX)
})

//ANCHOR - Canvas
const canvas = document.querySelector('canvas.webgl')

//ANCHOR - Sizes
const sizes = {
    width: 800,
    height: 600
}

//ANCHOR - Scene
const scene = new THREE.Scene()

//ANCHOR - Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

//ANCHOR - Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

//ANCHOR - Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//ANCHOR - Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.z = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

