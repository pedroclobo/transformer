/*global THREE, requestAnimationFrame, console*/

var cameras = [],
	scene,
	renderer,
	clock;

var currentCameraIndex = 0,
	delta = 0;

var keys = {};

var materials = new Map([
	["yellow", new THREE.MeshBasicMaterial({ color: 0xffd91c, wireframe: true })],
	["orange", new THREE.MeshBasicMaterial({ color: 0xffa010, wireframe: true })],
	[
		"darkOrange",
		new THREE.MeshBasicMaterial({ color: 0xff4000, wireframe: true }),
	],
	["red", new THREE.MeshBasicMaterial({ color: 0xc21d11, wireframe: true })],
	[
		"lightBlue",
		new THREE.MeshBasicMaterial({ color: 0xa8eeff, wireframe: true }),
	],
	["gray", new THREE.MeshBasicMaterial({ color: 0x7a7a7a, wireframe: true })],
	[
		"lightGray",
		new THREE.MeshBasicMaterial({ color: 0xacacac, wireframe: true }),
	],
	[
		"darkGray",
		new THREE.MeshBasicMaterial({ color: 0x242424, wireframe: true }),
	],
]);

var geometry, line;

var transformer, lowerBody, feet;

var headObject,
	chestObject,
	abdomen,
	leftArmObject,
	rightArmObject,
	waistObject,
	legObject;

var trailer;

//-----------------------------------------------------//

function createHead(x, y, z) {
	"use strict";
	var head, neck, lEye, rEye, lAntenna, rAntenna;

	// head
	head = new THREE.Mesh(
		new THREE.SphereGeometry(4, 32, 16),
		materials.get("yellow")
	);

	// neck
	neck = new THREE.Mesh(
		new THREE.CylinderGeometry(4, 4, 3, 32),
		materials.get("orange")
	);
	neck.position.y = -1.5;

	// eyes
	lEye = new THREE.Mesh(
		new THREE.BoxGeometry(2.2, 2, 2),
		materials.get("darkOrange")
	);
	rEye = new THREE.Mesh(
		new THREE.BoxGeometry(2.2, 2, 2),
		materials.get("darkOrange")
	);
	lEye.position.set(3, 0.4, -1.8);
	rEye.position.set(3, 0.4, 1.8);

	// antennas
	lAntenna = new THREE.Mesh(
		new THREE.ConeGeometry(1, 3, 16),
		materials.get("darkOrange")
	);
	rAntenna = new THREE.Mesh(
		new THREE.ConeGeometry(1, 3, 16),
		materials.get("darkOrange")
	);
	lAntenna.rotation.x = THREE.MathUtils.degToRad(-20);
	rAntenna.rotation.x = THREE.MathUtils.degToRad(20);
	lAntenna.position.set(1, 3.8, -2.5);
	rAntenna.position.set(1, 3.8, 2.5);

	// full head
	headObject = new THREE.Object3D();
	headObject.add(head, neck, lEye, rEye, lAntenna, rAntenna);
	headObject.position.set(x, y, z);

	return headObject;
}

function createChest(x, y, z) {
	"use strict";
	var chest, lPectoralis, rPectoralis;

	// chest
	geometry = new THREE.BoxGeometry(18, 16, 24);
	chest = new THREE.Mesh(geometry, materials.get("red"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	chest.add(line);

	// pectoralis
	lPectoralis = new THREE.Mesh(
		new THREE.BoxGeometry(0.5, 7, 9),
		materials.get("lightBlue")
	);
	rPectoralis = new THREE.Mesh(
		new THREE.BoxGeometry(0.5, 7, 9),
		materials.get("lightBlue")
	);
	lPectoralis.position.set(9, 1, -5.5);
	rPectoralis.position.set(9, 1, 5.5);

	// full chest
	chestObject = new THREE.Object3D();
	chestObject.add(chest, lPectoralis, rPectoralis);
	chestObject.position.set(x, y, z);

	return chestObject;
}

function createAbdomen(x, y, z) {
	"use strict";
	// abdomen

	geometry = new THREE.BoxGeometry(15.5, 8, 12);
	abdomen = new THREE.Mesh(geometry, materials.get("lightGray"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	abdomen.add(line);
	abdomen.position.set(x, y, z);

	return abdomen;
}

function createLeftArm(x, y, z) {
	"use strict";
	var shoulder, forearm, arm, hand, botExhaust, topExhaust;

	// shoulder
	shoulder = new THREE.Mesh(
		new THREE.BoxGeometry(5, 5, 4),
		materials.get("darkOrange")
	);

	// forearm
	forearm = new THREE.Mesh(
		new THREE.BoxGeometry(5, 14, 4),
		materials.get("orange")
	);
	forearm.position.set(0, -3.5, -4);

	// arm
	arm = new THREE.Mesh(
		new THREE.BoxGeometry(12, 4, 4),
		materials.get("orange")
	);
	arm.position.set(3.5, -12.5, -4);

	// hand
	hand = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), materials.get("red"));
	hand.position.set(12.5, -12.5, -4);

	// bot exhaust
	botExhaust = new THREE.Mesh(
		new THREE.CylinderGeometry(1.5, 1.5, 12, 16),
		materials.get("gray")
	);
	botExhaust.position.set(-3.5, 3.5, -3.5);

	// top exhaust
	topExhaust = new THREE.Mesh(
		new THREE.CylinderGeometry(1, 1, 8, 16),
		materials.get("lightGray")
	);
	topExhaust.position.set(-3.5, 13.5, -3.5);

	// full arm
	leftArmObject = new THREE.Object3D();
	leftArmObject.add(shoulder, forearm, arm, botExhaust, topExhaust, hand);
	leftArmObject.position.set(x, y, z);

	return leftArmObject;
}

function createRightArm(x, y, z) {
	"use strict";
	var shoulder, forearm, arm, hand, botExhaust, topExhaust;

	// shoulder
	shoulder = new THREE.Mesh(
		new THREE.BoxGeometry(5, 5, 4),
		materials.get("darkOrange")
	);

	// forearm
	forearm = new THREE.Mesh(
		new THREE.BoxGeometry(5, 14, 4),
		materials.get("orange")
	);
	forearm.position.set(0, -3.5, 4);

	// arm
	arm = new THREE.Mesh(
		new THREE.BoxGeometry(12, 4, 4),
		materials.get("orange")
	);
	arm.position.set(3.5, -12.5, 4);

	// hand
	hand = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), materials.get("red"));
	hand.position.set(12.5, -12.5, 4);

	// bot exhaust
	botExhaust = new THREE.Mesh(
		new THREE.CylinderGeometry(1.5, 1.5, 12, 16),
		materials.get("gray")
	);
	botExhaust.position.set(-3.5, 3.5, 3.5);

	// top exhaust
	topExhaust = new THREE.Mesh(
		new THREE.CylinderGeometry(1, 1, 8, 16),
		materials.get("lightGray")
	);
	topExhaust.position.set(-3.5, 13.5, 3.5);

	// full arm
	rightArmObject = new THREE.Object3D();
	rightArmObject.add(shoulder, forearm, arm, botExhaust, topExhaust, hand);
	rightArmObject.position.set(x, y, z);

	return rightArmObject;
}

function createWaist(x, y, z) {
	"use strict";
	// waist
	var waist, lwheel, rwheel;

	geometry = new THREE.BoxGeometry(12, 8, 23.75);
	waist = new THREE.Mesh(geometry, materials.get("gray"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	waist.add(line);

	// wheels
	lwheel = new THREE.Mesh(
		new THREE.CylinderGeometry(4, 4, 4, 32),
		materials.get("darkGray")
	);
	rwheel = new THREE.Mesh(
		new THREE.CylinderGeometry(4, 4, 4, 32),
		materials.get("darkGray")
	);
	lwheel.rotation.x = Math.PI / 2;
	rwheel.rotation.x = Math.PI / 2;
	lwheel.position.set(4, 0, -14);
	rwheel.position.set(4, 0, 14);

	// full waist
	waistObject = new THREE.Object3D();
	waistObject.add(waist, lwheel, rwheel);
	waistObject.position.set(x, y, z);

	return waistObject;
}

function createLeftLeg(x, y, z) {
	"use strict";
	var thigh, leg, topWheel, botWheel;

	// thigh
	geometry = new THREE.BoxGeometry(10, 8, 8);
	thigh = new THREE.Mesh(geometry, materials.get("red"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	thigh.add(line);

	// leg
	geometry = new THREE.BoxGeometry(6, 24, 4);
	leg = new THREE.Mesh(geometry, materials.get("orange"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	leg.add(line);
	leg.position.set(2, -16, 2);

	// wheels
	topWheel = new THREE.Mesh(
		new THREE.CylinderGeometry(4, 4, 4, 32),
		materials.get("darkGray")
	);
	botWheel = new THREE.Mesh(
		new THREE.CylinderGeometry(4, 4, 4, 32),
		materials.get("darkGray")
	);
	topWheel.rotation.x = Math.PI / 2;
	botWheel.rotation.x = Math.PI / 2;
	topWheel.position.set(3, -10, -2);
	botWheel.position.set(3, -20, -2);

	// full leg
	legObject = new THREE.Object3D();
	legObject.add(thigh, leg, topWheel, botWheel);
	legObject.position.set(x, y, z);

	return legObject;
}

function createRightLeg(x, y, z) {
	"use strict";
	var thigh, leg, topWheel, botWheel;

	// thigh
	geometry = new THREE.BoxGeometry(10, 8, 8);
	thigh = new THREE.Mesh(geometry, materials.get("red"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	thigh.add(line);

	// leg
	geometry = new THREE.BoxGeometry(6, 24, 4);
	leg = new THREE.Mesh(geometry, materials.get("orange"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	leg.add(line);
	leg.position.set(2, -16, -2);

	// wheels
	topWheel = new THREE.Mesh(
		new THREE.CylinderGeometry(4, 4, 4, 32),
		materials.get("darkGray")
	);
	botWheel = new THREE.Mesh(
		new THREE.CylinderGeometry(4, 4, 4, 32),
		materials.get("darkGray")
	);
	topWheel.rotation.x = Math.PI / 2;
	botWheel.rotation.x = Math.PI / 2;
	topWheel.position.set(3, -10, 2);
	botWheel.position.set(3, -20, 2);

	// full leg
	legObject = new THREE.Object3D();
	legObject.add(thigh, leg, topWheel, botWheel);
	legObject.position.set(x, y, z);

	return legObject;
}

function createLeftFoot(x, y, z) {
	"use strict";
	// foot
	geometry = new THREE.BoxGeometry(8, 4, 8);
	var lFoot = new THREE.Mesh(geometry, materials.get("red"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	lFoot.add(line);
	lFoot.position.set(x, y, z);

	return lFoot;
}

function createRightFoot(x, y, z) {
	"use strict";
	// foot
	geometry = new THREE.BoxGeometry(8, 4, 8);
	var rFoot = new THREE.Mesh(geometry, materials.get("red"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	rFoot.add(line);
	rFoot.position.set(x, y, z);

	return rFoot;
}

function createTransformer(x, y, z) {
	"use strict";

	transformer = new THREE.Object3D();
	lowerBody = new THREE.Object3D();
	feet = new THREE.Object3D();

	feet.add(createLeftFoot(-1, -44, -8), createRightFoot(-1, -44, 8));

	lowerBody.add(
		createWaist(-5, -6, 0),
		createLeftLeg(-4, -14, -8),
		createRightLeg(-4, -14, 8),
		feet
	);

	transformer.add(
		createHead(-2, 21, 0),
		createChest(-2, 10, 0),
		createAbdomen(0, 0, 0),
		createLeftArm(-6.5, 12.5, -14),
		createRightArm(-6.5, 12.5, 14),
		lowerBody
	);

	transformer.position.set(x, y, z);
	scene.add(transformer);
}

function createTrailer(x, y, z) {
	"use strict";
	var container, axle1, axle2, wheel1, wheel2, wheel3, wheel4, link;

	// container
	geometry = new THREE.BoxGeometry(60, 24, 24);
	container = new THREE.Mesh(geometry, materials.get("red"));
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	container.add(line);

	// axles
	geometry = new THREE.BoxGeometry(20, 6, 4);
	axle1 = new THREE.Mesh(geometry, materials.get("gray"));
	axle2 = new THREE.Mesh(geometry, materials.get("gray"));
	axle1.position.set(-15, -15, -6);
	axle2.position.set(-15, -15, 6);

	// wheels
	geometry = new THREE.CylinderGeometry(4, 4, 4, 32);
	wheel1 = new THREE.Mesh(geometry, materials.get("darkGray"));
	wheel2 = new THREE.Mesh(geometry, materials.get("darkGray"));
	wheel3 = new THREE.Mesh(geometry, materials.get("darkGray"));
	wheel4 = new THREE.Mesh(geometry, materials.get("darkGray"));
	wheel1.rotation.x = Math.PI / 2;
	wheel2.rotation.x = Math.PI / 2;
	wheel3.rotation.x = Math.PI / 2;
	wheel4.rotation.x = Math.PI / 2;
	wheel1.position.set(-20, -16, -10);
	wheel2.position.set(-10, -16, -10);
	wheel3.position.set(-20, -16, 10);
	wheel4.position.set(-10, -16, 10);

	// link
	geometry = new THREE.BoxGeometry(4, 4, 8);
	link = new THREE.Mesh(geometry, materials.get("gray"));
	link.position.set(32, -6, 0);
	line = new THREE.LineSegments(
		new THREE.EdgesGeometry(geometry),
		new THREE.LineBasicMaterial({ color: 0x0 })
	);
	link.add(line);

	// full trailer
	trailer = new THREE.Object3D();
	trailer.add(container, axle1, axle2, wheel1, wheel2, wheel3, wheel4, link);
	trailer.position.set(x, y, z);

	scene.add(trailer);
}

function createScene() {
	"use strict";

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(230, 230, 230)");

	createTransformer(0, 2, 0);
	createTrailer(-45, 12, 0);
}

function createOrthographicCamera(x, y, z) {
	"use strict";
	var ratio = window.innerWidth / window.innerHeight;
	var newCamera = new THREE.OrthographicCamera(
		-80 * ratio,
		80 * ratio,
		80,
		-80,
		1,
		1000
	);
	newCamera.position.set(x, y, z);
	newCamera.lookAt(scene.position);
	return newCamera;
}

function createPerspectiveCamera(x, y, z) {
	"use strict";
	var newCamera = new THREE.PerspectiveCamera(
		80,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
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

	cameras.push(
		frontCamera,
		sideCamera,
		topCamera,
		orthographicCamera,
		prespectiveCamera
	);
}

function onResize() {
	"use strict";
	for (var i = 0; i < cameras.length; i++) {
		cameras[i].aspect = window.innerWidth / window.innerHeight;
		cameras[i].updateProjectionMatrix();
	}
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
	"use strict";
	// Handle cameras
	if (e.keyCode >= 49 && e.keyCode <= 53) {
		// 1-5
		currentCameraIndex = e.keyCode - 49;
	}
	// Toggle wireframe
	else if (e.keyCode == 54) {
		// 6
		for (let material of materials.values()) {
			material.wireframe = !material.wireframe;
		}
	} else keys[e.keyCode] = 1;
}

function onKeyUp(e) {
	"use strict";
	keys[e.keyCode] = 0;
}

function render() {
	"use strict";
	renderer.render(scene, cameras[currentCameraIndex]);
}

function init() {
	"use strict";
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createCameras();

	clock = new THREE.Clock();
	clock.start();

	render();

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("resize", onResize, false);
}

function rotateHead(up) {
	var pivot = new THREE.Vector3(-2, 17.4, 0);
	var axis = new THREE.Vector3(0, 0, 1);
	var velocity = delta * Math.PI;

	var lowerLimit = 0 + 0.01; // due to float point imprecision
	var upperLimit = Math.PI;

	if (up && headObject.rotation.z < upperLimit) {
		var newRotation = THREE.MathUtils.clamp(
			headObject.rotation.z + velocity,
			lowerLimit,
			upperLimit
		);

		var rotationDelta = newRotation - headObject.rotation.z;

		headObject.rotateOnWorldAxis(axis, rotationDelta);
		headObject.position
			.sub(pivot)
			.applyAxisAngle(axis, rotationDelta)
			.add(pivot);
	} else if (!up && headObject.rotation.z > lowerLimit) {
		var newRotation = THREE.MathUtils.clamp(
			headObject.rotation.z - velocity,
			lowerLimit,
			upperLimit
		);

		var rotationDelta = newRotation - headObject.rotation.z;

		headObject.rotateOnWorldAxis(axis, rotationDelta);
		headObject.position
			.sub(pivot)
			.applyAxisAngle(axis, rotationDelta)
			.add(pivot);
	}
}

function rotateFeet(up) {
	var pivot = new THREE.Vector3(-3, -44, 0);
	var axis = new THREE.Vector3(0, 0, 1);
	var velocity = delta * Math.PI;

	var lowerLimit = -Math.PI / 2;
	var upperLimit = 0;

	if (up && feet.rotation.z < upperLimit) {
		var newRotation = THREE.MathUtils.clamp(
			feet.rotation.z + velocity,
			lowerLimit,
			upperLimit
		);

		var rotationDelta = newRotation - feet.rotation.z;

		feet.rotateOnWorldAxis(axis, rotationDelta);
		feet.position.sub(pivot).applyAxisAngle(axis, rotationDelta).add(pivot);
	} else if (!up && feet.rotation.z > lowerLimit) {
		var newRotation = THREE.MathUtils.clamp(
			feet.rotation.z - velocity,
			lowerLimit,
			upperLimit
		);

		var rotationDelta = newRotation - feet.rotation.z;

		feet.rotateOnWorldAxis(axis, rotationDelta);
		feet.position.sub(pivot).applyAxisAngle(axis, rotationDelta).add(pivot);
	}
}

function moveArms(left) {
	var velocity = new THREE.Vector3(0, 0, 10).multiplyScalar(delta);

	var leftArmLimit = {
		min: new THREE.Vector3(-6.5, 12.5, -14),
		max: new THREE.Vector3(-6.5, 12.5, -10),
	};
	var rightArmLimit = {
		min: new THREE.Vector3(-6.5, 12.5, 10),
		max: new THREE.Vector3(-6.5, 12.5, 14),
	};

	if (left) {
		leftArmObject.position.add(velocity);
		leftArmObject.position.clamp(leftArmLimit.min, leftArmLimit.max);

		rightArmObject.position.sub(velocity);
		rightArmObject.position.clamp(rightArmLimit.min, rightArmLimit.max);
	} else {
		leftArmObject.position.sub(velocity);
		leftArmObject.position.clamp(leftArmLimit.min, leftArmLimit.max);

		rightArmObject.position.add(velocity);
		rightArmObject.position.clamp(rightArmLimit.min, rightArmLimit.max);
	}
}

function rotateWaist(up) {
	var pivot = new THREE.Vector3(-1, -6, 0);
	var axis = new THREE.Vector3(0, 0, 1);
	var velocity = delta * Math.PI;

	var lowerLimit = -Math.PI / 2;
	var upperLimit = 0;

	if (up && lowerBody.rotation.z < upperLimit) {
		var newRotation = THREE.MathUtils.clamp(
			lowerBody.rotation.z + velocity,
			lowerLimit,
			upperLimit
		);

		var rotationDelta = newRotation - lowerBody.rotation.z;

		lowerBody.rotateOnWorldAxis(axis, rotationDelta);
		lowerBody.position
			.sub(pivot)
			.applyAxisAngle(axis, rotationDelta)
			.add(pivot);
	} else if (!up && lowerBody.rotation.z > lowerLimit) {
		var newRotation = THREE.MathUtils.clamp(
			lowerBody.rotation.z - velocity,
			lowerLimit,
			upperLimit
		);

		var rotationDelta = newRotation - lowerBody.rotation.z;

		lowerBody.rotateOnWorldAxis(axis, rotationDelta);
		lowerBody.position
			.sub(pivot)
			.applyAxisAngle(axis, rotationDelta)
			.add(pivot);
	}
}

function moveTrailerZ(left) {
	var velocity = new THREE.Vector3(0, 0, 35).multiplyScalar(delta);

	if (left) {
		trailer.position.add(velocity);
	} else {
		trailer.position.sub(velocity);
	}
}

function moveTrailerX(left) {
	var velocity = new THREE.Vector3(35, 0, 0).multiplyScalar(delta);

	if (left) {
		trailer.position.add(velocity);
	} else {
		trailer.position.sub(velocity);
	}
}

function update() {
	"use strict";

	if (keys[81] == 1) {
		console.log("Q");
		rotateFeet(true);
	}
	if (keys[65] == 1) {
		console.log("A");
		rotateFeet(false);
	}
	if (keys[87] == 1) {
		console.log("W");
		rotateWaist(true);
	}
	if (keys[83] == 1) {
		console.log("S");
		rotateWaist(false);
	}
	if (keys[69] == 1) {
		console.log("E");
		moveArms(true);
	}
	if (keys[68] == 1) {
		console.log("D");
		moveArms(false);
	}
	if (keys[82] == 1) {
		console.log("R");
		rotateHead(true);
	}
	if (keys[70] == 1) {
		console.log("F");
		rotateHead(false);
	}
	if (keys[37] == 1) {
		console.log("L-Arrow");
		moveTrailerZ(true);
	}
	if (keys[39] == 1) {
		console.log("R-Arrow");
		moveTrailerZ(false);
	}
	if (keys[38] == 1) {
		console.log("U-Arrow");
		moveTrailerX(false);
	}
	if (keys[40] == 1) {
		console.log("D-Arrow");
		moveTrailerX(true);
	}
}

function animate() {
	"use strict";

	delta = clock.getDelta();
	update();
	render();
	requestAnimationFrame(animate);
}
