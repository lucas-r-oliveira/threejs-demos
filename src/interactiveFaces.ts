import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//SCENE SETUP
const scene = new THREE.Scene();
const GRID_SIZE = 10;
const GRID_DIVISIONS = 10;
scene.add( new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS) );

// CAMERA SETUP
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.set( 0, 4, 4 );

// RENDERER SETUP
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// ORBIT CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
controls.update()


// RAYCASTER SETUP
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


function onMouseDown(event: MouseEvent) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObject( cube, false );
	//intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

	for ( let i = 0; i < intersects.length; i ++ ) {

		//intersects[ i ].object.material.color.set( 0xff0000 );
		//let intersection = intersects[i]
		//if (intersection.face) {
		//	let aVertex = new THREE.Vector3(
		//		positionAttribute.getX(intersection.face.a), 
		//		positionAttribute.getY(intersection.face.a), 
		//		positionAttribute.getZ(intersection.face.a)
		//	);

		//	console.log(aVertex);
				
			//let bVertex = ...;
			//let cVertex = ...;

		
			let faceIndex = intersects[0].faceIndex;

			if(faceIndex) {
				let face = Math.floor(faceIndex / 2)

				console.log(faceIndex)
				console.log(face)

				// I think I get what's going on. We're always setting the same color (1,0,0)
				// Which I suppose is red (R, G, B)
				// And .color is the 108 points array (checks out)
				// so faceIndex will always be incorrect, because it will be 0-11
				// when there are in fact 108 possible indexes (?? - confirm)
				// face 0: 6 vertices (0-5); Each contains 3 positions , so 36 vertices per face => 0-35
				// face 1: (6-11)
				// face 2: (12-17)
				// face 3: (18-23)
				// face 4: ()
				
				

				const initialVertex = face * 6;
				console.log(initialVertex)
				for (let i = initialVertex; i < initialVertex + 6; i++) {
					boxGeometry.attributes.color.setXYZ(i, 1, 0, 0); // each one of these sets a vertex
					
				}
				boxGeometry.attributes.color.needsUpdate = true;

				



			}
		//}
		



		//console.log(intersects[i].object.geometry.index);
		//console.log(intersects[i].object)
		//console.log(intersects[i].face)
		//console.log(intersects[i].faceIndex)

	}
}


// BOX GEO (NON INDEXED)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
const material = new THREE.MeshBasicMaterial({
	// if I have vertexColors set to true, I can't use color in the attributes here,
	// I guess I have to set the vertices manually?
    vertexColors: true
});


const positionAttribute = boxGeometry.getAttribute('position');
// This BufferAttribute consists of a Float32Array comprised of 108 points
// - Considering that this is a Non Indexed cube:
	// -- So each face consists of 6 vertices
	// -- The cube has 6 faces, so 6*6 = 36
	// -- Since each position consists of 3 points (X,Y,Z)
	//		so we just multiply 36 by 3 = 108

const colors = [];

const color = new THREE.Color();

// It's for the reason I mentioned above that we're stepping 6
for (let i = 0; i < positionAttribute.count; i += 6) {

    color.setHex(0xffffff * Math.random());

	// each one of these is a vertex.
	// we're coloring all vertices of the same face all with the same color
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);

    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
}

// define the new attribute
boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


const cube = new THREE.Mesh(boxGeometry, material);
cube.position.y = 0.5
scene.add(cube);







function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {

	renderer.render(scene, camera);
}

document.addEventListener('mousedown', onMouseDown);
animate()
//render()