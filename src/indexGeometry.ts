import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

// SCENE SETUP
const scene = new THREE.Scene();
const GRID_SIZE = 10;
const GRID_DIVISIONS = 10;
scene.add( new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS) );

// CAMERA SETUP
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 5, 5);
camera.lookAt(-2, 8, -2);


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
const geometry = new THREE.BufferGeometry();

//position array of 4 points;
	// Each three numbers in the array will be for x,y, and then z values 
	// for a single point in space. I want 4 points and 3 axis values for 
	// each point so that means the length of the array will be 12. 
	// After I pass the array as the first argument I will then pass the 
	// number 3 as the second argument as there are 3 values for each 
	// item in this buffer attribute
const pos = new THREE.BufferAttribute(new Float32Array([0,-3,0,0,3,0,2,0,0,0,0,-5]), 3);
geometry.setAttribute('position', pos);



// using 4 points to draw two trangles by adding an index
// I get it now: so previously we used 4 points to define a triangle,
// 	one of those 4 was not used
//  we're grabbing the existing 3 (which make up a triangle)
//  and creating the second triangle from the existing 3 and the
//  4th not used. 0 - 3 are the different points
//	e.g. 0 is (0,-3,0); 1 is (0,3,0); 2 is (2,0,0); 3 is (0,0,-5)
const index = new THREE.BufferAttribute( new Uint8Array([0,1,2,0,1,3]) , 1);
geometry.setIndex(index)

// using this to create normal attribute
geometry.computeVertexNormals();
//-------- ----------

// MESH
const mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }) );
scene.add(mesh);


function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	renderer.render(scene, camera);
}

animate()
//render()