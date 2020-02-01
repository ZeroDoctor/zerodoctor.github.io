var uniforms = 0;
var renderer = 0;
var camera = 0;
var scene = 0;

function initFogTHREE() {
	canvas = document.getElementById("gl-canvas");

	camera = new THREE.Camera();
	camera.position.z = 1;

	scene = new THREE.Scene();

	var geometry = new THREE.PlaneBufferGeometry(2, 2);

	uniforms = {
		u_time: { type: "f", value: 1.0 },
		u_resolution: { type: "v2", value: new THREE.Vector2() },
		u_mouse: { type: "v2", value: new THREE.Vector2() }
	};

	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById('desktop-vert-shader').textContent,
		fragmentShader: document.getElementById('fragment-shader').textContent
	});

	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);

	canvas.appendChild(renderer.domElement);

	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);

	document.onmousemove = function (e) {
		uniforms.u_mouse.value.x = e.pageX
		uniforms.u_mouse.value.y = e.pageY
	}

	animate();
}

function onWindowResize() {
	var width = canvas.clientWidth;
	var height = canvas.clientHeight;
	if (canvas.width != width || canvas.height != height) {
		canvas.width = width;
		canvas.height = height;
	}

	renderer.setSize(width, height);

	uniforms.u_resolution.value.x = renderer.domElement.width;
	uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
	requestAnimationFrame(animate);
	renderDesktop();
}

function renderDesktop() {
	uniforms.u_time.value += (getElapsed());
	renderer.render(scene, camera);
}