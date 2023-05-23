import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const size = 10;
const divisions = 10;


//RAYCASTING SETUP
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


function onMouseMove(event: MouseEvent) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


//const gridHelper = new THREE.GridHelper( size, divisions );
//scene.add( gridHelper );

// PANE SETUP
const pane = new Pane();


//alpha: true is what allows me to render a custom background
const renderer = new THREE.WebGLRenderer({ alpha: true });
//enable shadows
renderer.shadowMap.enabled = true; 
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const nonIndexedGeometry = geometry.toNonIndexed();
const material = new THREE.MeshStandardMaterial( { color: 'white' } );
const cube = new THREE.Mesh( nonIndexedGeometry, material );
cube.castShadow = true;
cube.position.set( 0, 1 ,0 )

scene.add( cube );


//const meshObjects = [cube];

//const panelGeometry = new THREE.BoxGeometry( 8, 0.1, 8 );
//const panelMaterial = new THREE.MeshStandardMaterial( { color: 0xfafafa } );
//const panel = new THREE.Mesh( panelGeometry, panelMaterial );
//panel.receiveShadow = true;
//panel.position.set(0, -0.25, 0);

//scene.add( panel );


camera.position.set(0, 4, 5);
//camera.lookAt( 0, -1, 0 );

//controls.update() must be called after any manual changes to the camera's transform
controls.update();


// LIGHTING
// - AMBIENT LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add( ambientLight );

// ambient light pane
const ambientLightFolder = pane.addFolder({
	title: 'Ambient Light'
})
ambientLightFolder.addInput(ambientLight, 'visible');
ambientLightFolder.addInput(ambientLight, 'intensity', {
	min:0,
	max:1,
	step: 0.1
})
//const hexColor = ambientLighting.color.getHexString();
//console.log(hexColor)
//ambientLightFolder.addInput(ambientLighting, 'color', {
//	view: 'color',
//	color: {alpha: true}
//})

// - DIRECTIONAL LIGHT
const directionalLight = new THREE.DirectionalLight(0xff0000, 0.5);
directionalLight.position.set(0, 2, 0);
directionalLight.castShadow = true;

//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2);

scene.add( directionalLight/*, directionalLightHelper*/ )

// -- directional light pane
const directionalLightSettings = {
	visible: true,
	color: directionalLight.color.getHex()
}

const directionalLightFolder = pane.addFolder({title: 'Directional Light'});
directionalLightFolder.addInput(directionalLightSettings, 'visible')
	.on('change', (event) => {
		directionalLight.visible = event.value
		//directionalLightHelper.visible = event.value
	})
directionalLightFolder.addInput(directionalLight, 'intensity', {
	min:0, max:1, step:0.1
})
directionalLightFolder.addInput(directionalLight.position, 'y', {
	min:1, max:4, step:0.5
});
directionalLightFolder.addInput(directionalLight, 'castShadow');

directionalLightFolder.addInput(directionalLightSettings, 'color', {
	view:'color'
}).on('change', (event) => {
	directionalLight.color.set(event.value);
})


// - SPOT LIGHT
const spotLight = new THREE.SpotLight(0x00ff00, 0.5, 8, Math.PI / 6, 0);
spotLight.position.set( 0, 2, 2 );
spotLight.castShadow = true;
//spotLight.shadow.mapSize.width = 1024;
//spotLight.shadow.mapSize.height = 1024;

//spotLight.shadow.camera.near = 50;
//spotLight.shadow.camera.far = 4000;
//spotLight.shadow.camera.fov = 30;

//const spotLightHelper = new THREE.SpotLightHelper(spotLight);

scene.add( spotLight/*, spotLightHelper*/ );

const spotLightSettings = {
	visible: true
}

const spotLightFolder = pane.addFolder({title: 'Spot Light'});
spotLightFolder.addInput(spotLightSettings, 'visible')
	.on('change', (event) => {
		spotLight.visible = event.value;
		//spotLightHelper.visible = event.value;
	})
spotLightFolder.addInput(spotLight, 'intensity', {
	min:0, max: 4, step:0.5
})
spotLightFolder.addInput(spotLight, 'angle', {
	min: Math.PI / 16, max: Math.PI / 2, step: Math.PI / 16,
}).on('change', () => {
	//spotLightHelper.update();
})
//FIXME: can we unify position?
spotLightFolder.addInput(spotLight.position, 'x', {view:'slider', min:-2, max:2, step: 0.5})
	.on('change', () => {
		//spotLightHelper.update();
	})

spotLightFolder.addInput(spotLight.position, 'z', {view:'slider', min:-2, max:2, step: 0.5})
	.on('change', () => {
		//spotLightHelper.update();
	})
spotLightFolder.addInput(spotLight, 'castShadow');




function animate() {
	requestAnimationFrame( animate );

	cube.rotation.y += 0.01;
	//renderer.render( scene, camera );

	render()

}

function render() {
	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObject( cube, false );
	//intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

	for ( let i = 0; i < intersects.length; i ++ ) {

		//intersects[ i ].object.material.color.set( 0xff0000 );

		//console.log(intersects[i]);
		console.log(intersects[i].face)
		console.log(intersects[i].faceIndex)

	}

	renderer.render(scene, camera);
}


document.addEventListener('mousemove', onMouseMove);
animate();