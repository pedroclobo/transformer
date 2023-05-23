/*global THREE, requestAnimationFrame, console*/

var currentCameraIndex = 0;

var cameras = [],
	scene,
	renderer;
var clock;

var geometry, material, mesh;

var ball;


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

function addHead(obj, x, y, z) {
	"use strict";
	var head, neck, lEye, rEye, lAntenna, rAntenna, headObject;

	// head
	material = new THREE.MeshBasicMaterial({ color: 0xffd91c, wireframe: true });
	head = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 16), material);

	// neck
	material = new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true });
	neck = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 3, 32), material);
	neck.position.y = -1.5;

	// eyes
	material = new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true });
	lEye = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2, 2), material);
	material = new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true }); // FIX: if i remove this line, 'a' doesnt work for the eyes and antennas!
	rEye = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2, 2), material);
	lEye.position.set(3, 0.4, -1.8);
	rEye.position.set(3, 0.4, 1.8);

	// antennas
	lAntenna = new THREE.Mesh(new THREE.ConeGeometry(1, 3, 16), material);
	rAntenna = new THREE.Mesh(new THREE.ConeGeometry(1, 3, 16), material);
	lAntenna.rotation.x = THREE.Math.degToRad(-20);
	rAntenna.rotation.x = THREE.Math.degToRad(20);
	lAntenna.position.set(1, 3.8, -2.5);
	rAntenna.position.set(1, 3.8, 2.5);

	// full head
	headObject = new THREE.Object3D();
	headObject.add(head, neck, lEye, rEye, lAntenna, rAntenna);
	headObject.position.set(x, y, z);

	obj.add(headObject);
}

function addChest(obj, x, y, z) {
	"use strict";
	var chest, lPectoralis, rPectoralis, chestObject;

	// chest
	material = new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true });
	chest = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 24), material);

	// pectoralis
	material = new THREE.MeshBasicMaterial({ color: 0xa8eeff, wireframe: true });
	lPectoralis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7, 9), material);
	material = new THREE.MeshBasicMaterial({ color: 0xa8eeff, wireframe: true });
	rPectoralis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7, 9), material);
	lPectoralis.position.set(9, 1, -5.5);
	rPectoralis.position.set(9, 1, 5.5);

	// full chest
	chestObject = new THREE.Object3D();
	chestObject.add(chest, lPectoralis, rPectoralis);
	chestObject.position.set(x, y, z);

	obj.add(chestObject);
}

function addAbdomen(obj, x, y, z) {
	"use strict";
	// abdomen
	material = new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true });
	var abdomen = new THREE.Mesh(new THREE.BoxGeometry(15.5, 8, 12), material);

	abdomen.position.set(x, y, z);

	obj.add(abdomen);
}

function addLeftArm(obj, x, y, z) {
	"use strict";
	var shoulder, forearm, arm, hand, botExhaust, topExhaust, LeftArmObject;

	// shoulder
	material = new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true });
	shoulder = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 4), material);

	// forearm
	material = new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true });
	forearm = new THREE.Mesh(new THREE.BoxGeometry(5, 14, 4), material);
	forearm.position.set(0, -3.5, -4);

	// arm
	material = new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true });
	arm = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 4), material);
	arm.position.set(3.5, -12.5, -4);

	// hand
	material = new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true });
	hand = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), material);
	hand.position.set(12.5, -12.5, -4);

	// bot exhaust
	material = new THREE.MeshBasicMaterial({ color: 0x7a7a7a, wireframe: true });
	botExhaust = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 12, 16), material);
	botExhaust.position.set(-3.5, 3.5, -3.5);

	// top exhaust
	material = new THREE.MeshBasicMaterial({ color: 0x9c9c9c, wireframe: true });
	topExhaust = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8, 16), material);
	topExhaust.position.set(-3.5, 13.5, -3.5);

	// full arm
	LeftArmObject = new THREE.Object3D();
	LeftArmObject.add(shoulder, forearm, arm, botExhaust, topExhaust, hand);
	LeftArmObject.position.set(x, y, z);

	obj.add(LeftArmObject);
}

function addRightArm(obj, x, y, z) {
	"use strict";
	var shoulder, forearm, arm, hand, botExhaust, topExhaust, LeftArmObject;

	// shoulder
	material = new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true });
	shoulder = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 4), material);

	// forearm
	material = new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true });
	forearm = new THREE.Mesh(new THREE.BoxGeometry(5, 14, 4), material);
	forearm.position.set(0, -3.5, 4);

	// arm
	material = new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true });
	arm = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 4), material);
	arm.position.set(3.5, -12.5, 4);

	// hand
	material = new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true });
	hand = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), material);
	hand.position.set(12.5, -12.5, 4);

	// bot exhaust
	material = new THREE.MeshBasicMaterial({ color: 0x7a7a7a, wireframe: true });
	botExhaust = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 12, 16), material);
	botExhaust.position.set(-3.5, 3.5, 3.5);

	// top exhaust
	material = new THREE.MeshBasicMaterial({ color: 0x9c9c9c, wireframe: true });
	topExhaust = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8, 16), material);
	topExhaust.position.set(-3.5, 13.5, 3.5);

	// full arm
	LeftArmObject = new THREE.Object3D();
	LeftArmObject.add(shoulder, forearm, arm, botExhaust, topExhaust, hand);
	LeftArmObject.position.set(x, y, z);

	obj.add(LeftArmObject);
}

function addWaist(obj, x, y, z) {
	"use strict";
	var waist, lwheel, rwheel, waistObject;

	// waist
	material = new THREE.MeshBasicMaterial({ color: 0xffd91c, wireframe: true });
	waist = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 24), material);

	// wheels
	material = new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true });
	lwheel = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 4, 32), material);
	material = new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true });
	rwheel = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 4, 32), material);
	lwheel.rotation.x = Math.PI / 2;
	rwheel.rotation.x = Math.PI / 2;
	lwheel.position.set(4, 0, -14);
	rwheel.position.set(4, 0, 14);

	// full waist
	waistObject = new THREE.Object3D();
	waistObject.add(waist, lwheel, rwheel);
	waistObject.position.set(x, y, z);

	obj.add(waistObject);
}

function addLeftLeg(obj, x, y, z) {
	"use strict";
	var thigh, leg, topWheel, botWheel, legObject;

	// thigh
	material = new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true });
	thigh = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 8), material);

	// leg
	material = new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true });
	leg = new THREE.Mesh(new THREE.BoxGeometry(6, 24, 4), material);
	leg.position.set(2, -16, 2);

	// wheels
	material = new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true });
	topWheel = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 4, 32), material);
	material = new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true });
	botWheel = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 4, 32), material);
	topWheel.rotation.x = Math.PI / 2;
	botWheel.rotation.x = Math.PI / 2;
	topWheel.position.set(3, -10, -2);
	botWheel.position.set(3, -20, -2);

	// full leg
	legObject = new THREE.Object3D();
	legObject.add(thigh, leg, topWheel, botWheel);
	legObject.position.set(x, y, z);

	obj.add(legObject);
}

function addRightLeg(obj, x, y, z) {
	"use strict";
	var thigh, leg, topWheel, botWheel, legObject;

	// thigh
	material = new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true });
	thigh = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 8), material);

	// leg
	material = new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true });
	leg = new THREE.Mesh(new THREE.BoxGeometry(6, 24, 4), material);
	leg.position.set(2, -16, -2);

	// wheels
	material = new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true });
	topWheel = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 4, 32), material);
	material = new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true });
	botWheel = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 4, 32), material);
	topWheel.rotation.x = Math.PI / 2;
	botWheel.rotation.x = Math.PI / 2;
	topWheel.position.set(3, -10, 2);
	botWheel.position.set(3, -20, 2);

	// full leg
	legObject = new THREE.Object3D();
	legObject.add(thigh, leg, topWheel, botWheel);
	legObject.position.set(x, y, z);

	obj.add(legObject);
}

function addLeftFoot(obj, x, y, z) {
	"use strict";
	// foot
	material = new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true });
	var foot = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), material);

	foot.position.set(x, y, z);

	obj.add(foot);
}

function addRightFoot(obj, x, y, z) {
	"use strict";
	// foot
	material = new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true });
	var foot = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), material);

	foot.position.set(x, y, z);

	obj.add(foot);
}

function createTransformer(x, y, z) {
	"use strict";

	var transformer = new THREE.Object3D();

	addHead(transformer, -2, 21, 0);
	addChest(transformer, -2, 10, 0);
	addAbdomen(transformer, 0, 0, 0);
	addLeftArm(transformer, -6.5, 12.5, -14);
	addRightArm(transformer, -6.5, 12.5, 14);
	addWaist(transformer, -5, -6, 0);
	addLeftLeg(transformer, -4, -14, -8);
	addRightLeg(transformer, -4, -14, 8);
	addLeftFoot(transformer, -1, -44, -8);
	addRightFoot(transformer, -1, -44, 8);

	scene.add(transformer);

	transformer.position.set(x, y, z);
}

function createScene() {
	"use strict";

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(0, 170, 255)");
	
	scene.add(new THREE.AxisHelper(10));

	createBall(0, 0, 15);
	createTransformer(0, 10, 0);
}

function createOrthographicCamera(x, y, z) {
    'use strict';
    var ratio = window.innerWidth / window.innerHeight;
    var newCamera = new THREE.OrthographicCamera(-50 * ratio, 50 * ratio, 50, -50, 1, 1000);
    newCamera.position.set(x, y, z);
    newCamera.lookAt(scene.position);
    return newCamera;
}

function createPerspectiveCamera(x, y, z) {
    'use strict';
    var newCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    newCamera.position.set(x, y, z);
    newCamera.lookAt(scene.position);
    return newCamera;
}

function createCameras() {
	"use strict";
	var frontCamera = createOrthographicCamera(100, 0, 0);
	var sideCamera = createOrthographicCamera(0, 0, 100);
	var topCamera = createOrthographicCamera(0, 100, 0);
	var orthographicCamera = createOrthographicCamera(50, 50, 50);
	var prespectiveCamera = createPerspectiveCamera(50, 50, 50);

	cameras.push(frontCamera, sideCamera, topCamera, orthographicCamera, prespectiveCamera);
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
		// 1-5
		currentCameraIndex = e.keyCode - 49;
		return;
	}

	switch (e.keyCode) {
		// control wireframe
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
		// show or hide axis
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