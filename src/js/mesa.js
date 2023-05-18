/*global THREE, requestAnimationFrame, console*/

var currentCameraIndex = 0;

var cameras = [],
	scene,
	renderer;
var clock;

var geometry, material, mesh;

var ball;

function addTableLeg(obj, x, y, z) {
	"use strict";

	geometry = new THREE.CubeGeometry(2, 6, 2);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y - 3, z);
	obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
	"use strict";
	geometry = new THREE.CubeGeometry(60, 2, 20);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createBall(x, y, z) {
	"use strict";

	ball = new THREE.Object3D();
	ball.userData = { jumping: true, step: 0 };

	material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
	geometry = new THREE.SphereGeometry(4, 10, 10);
	mesh = new THREE.Mesh(geometry, material);

	ball.add(mesh);
	ball.position.set(x, y, z);

	scene.add(ball);
}

function createTable(x, y, z) {
	"use strict";

	var table = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

	addTableTop(table, 0, 0, 0);
	addTableLeg(table, -25, -1, -8);
	addTableLeg(table, -25, -1, 8);
	addTableLeg(table, 25, -1, 8);
	addTableLeg(table, 25, -1, -8);

	scene.add(table);

	table.position.x = x;
	table.position.y = y;
	table.position.z = z;
}

function createScene() {
	"use strict";

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(0, 170, 255)");

	scene.add(new THREE.AxisHelper(10));

	createTable(0, 8, 0);
	createBall(0, 0, 15);
}

function createCameras() {
	"use strict";
	var prespectivecamera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	prespectivecamera.position.x = 50;
	prespectivecamera.position.y = 50;
	prespectivecamera.position.z = 50;
	prespectivecamera.lookAt(scene.position);

	var orthographicCamera = new THREE.OrthographicCamera(
		window.innerWidth / -2,
		window.innerWidth / 2,
		window.innerHeight / 2,
		window.innerHeight / -2,
		1,
		1000
	);
	orthographicCamera.position.x = 50;
	orthographicCamera.position.y = 50;
	orthographicCamera.position.z = 50;
	orthographicCamera.lookAt(scene.position);

	// create top camera
	var topCamera = new THREE.OrthographicCamera(
		window.innerWidth / -2,
		window.innerWidth / 2,
		window.innerHeight / 2,
		window.innerHeight / -2,
		-1000,
		1000
	);
	topCamera.position.x = 0;
	topCamera.position.y = 100;
	topCamera.position.z = 0;
	topCamera.lookAt(scene.position);

	// create side camera
	var sideCamera = new THREE.OrthographicCamera(
		window.innerWidth / -2,
		window.innerWidth / 2,
		window.innerHeight / 2,
		window.innerHeight / -2,
		-1000,
		1000
	);
	sideCamera.position.x = 100;
	sideCamera.position.y = 0;
	sideCamera.position.z = 0;
	sideCamera.lookAt(scene.position);

	// create front camera
	var frontCamera = new THREE.OrthographicCamera(
		window.innerWidth / -2,
		window.innerWidth / 2,
		window.innerHeight / 2,
		window.innerHeight / -2,
		-1000,
		1000
	);
	frontCamera.position.x = 0;
	frontCamera.position.y = 0;
	frontCamera.position.z = 100;
	frontCamera.lookAt(scene.position);

	cameras.push(frontCamera);
	cameras.push(sideCamera);
	cameras.push(topCamera);
	cameras.push(orthographicCamera);
	cameras.push(prespectivecamera);
}

function onResize() {
	"use strict";

	renderer.setSize(window.innerWidth, window.innerHeight);

	if (window.innerHeight > 0 && window.innerWidth > 0) {
		cameras[currentCameraIndex].aspect = window.innerWidth / window.innerHeight;
		camera[currentCameraIndex].updateProjectionMatrix();
	}
}

function onKeyDown(e) {
	"use strict";

	// Handle cameras
	if (e.keyCode >= 49 && e.keyCode <= 53) {
		//1-5
		currentCameraIndex = e.keyCode - 49;
		return;
	}

	switch (e.keyCode) {
		case 65: //A
		case 97: //a
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
		case 83: //S
		case 115: //s
			ball.userData.jumping = !ball.userData.jumping;
			break;
		case 69: //E
		case 101: //e
			scene.traverse(function (node) {
				if (node instanceof THREE.AxisHelper) {
					node.visible = !node.visible;
				}
			});
			break;
	}
}

function render() {
	"use strict";
	renderer.render(scene, cameras[currentCameraIndex]);
}

function init() {
	"use strict";
	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createCameras();

	clock = new THREE.Clock();
	clock.start();

	render();

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("resize", onResize);
}

function animate() {
	"use strict";

	var delta = clock.getDelta();

	// TODO: update positions based on delta
	if (ball.userData.jumping) {
		ball.userData.step += 0.04;
		ball.position.y = Math.abs(30 * Math.sin(ball.userData.step));
		ball.position.z = 15 * Math.cos(ball.userData.step);
	}
	render();

	requestAnimationFrame(animate);
}
