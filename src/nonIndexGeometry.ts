// https://dustinpfister.github.io/2022/12/09/threejs-buffer-geometry-index/
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

// SCENE SETUP
const scene = new THREE.Scene();
const GRID_SIZE = 10;
const GRID_DIVISIONS = 10;
scene.add( new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS) );

// CAMERA SETUP
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/ window.innerHeight, 0.1, 1000);
camera.position.set( 4, 4, 4 );
camera.lookAt(0, 0, 0);


// RENDERER SETUP
const renderer = new THREE.WebGL1Renderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// ORBIT CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
controls.update()

// --------------
// INDEX GEOMETRY SETUP
// INDEX GEO
const geo_indexed = new THREE.BufferGeometry();
// position array of 4 points to draw two triangles, by using an index
geo_indexed.setAttribute('position',
	new THREE.BufferAttribute(new Float32Array([0,0,0, 0,2,0, -2,0,0, 0,0,-2]), 3)
);
const index = new THREE.BufferAttribute( new Uint8Array([0,1,2,0,1,3]), 1);
geo_indexed.setIndex(index)
// geo_indexed.setIndex([0,1,2,0,1,3]) --> this actually works too
// --If you are not sure what typed array you should use one option is 
// --to just pass a plane old javaScript array and let the set index method figure that out for you.
// --IF A BUFFER ATTRIBUTE IS PASSED
// --MAKE SURE IT IS NOT A Uint8 TYPED ARRAY AS INDEX VALUES CAN GO BEYOND 255
geo_indexed.computeVertexNormals();


// NON INDEX GEO
const geo_non_indexed = new THREE.BufferGeometry();
// position array of 6 points for two triangles ( no index )
geo_non_indexed.setAttribute('position',
    new THREE.BufferAttribute(new Float32Array([0,0,0, 0,2,0, -2,0,0, 0,0,0, 0,2,0, 0,0,-2]), 3)
);
geo_non_indexed.computeVertexNormals();


// MESH
const mesh_indexed = new THREE.Mesh(geo_indexed, new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }) );
mesh_indexed.position.x = -1;
scene.add(mesh_indexed);

const mesh_non_indexed = new THREE.Mesh(geo_non_indexed, new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }) );
mesh_non_indexed.position.x = 2;
scene.add(mesh_non_indexed);

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	renderer.render(scene, camera);
}

animate()
//render()