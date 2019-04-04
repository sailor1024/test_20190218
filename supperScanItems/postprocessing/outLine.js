//初始化渲染器
var render, width, height;

function initRender() {
	width = document.getElementById('canvas-frame').clientWidth;
	height = document.getElementById('canvas-frame').clientHeight;
	render = new THREE.WebGLRenderer({
		antialias: true
	});
	render.setSize(width, height);
	document.getElementById('canvas-frame').appendChild(render.domElement);
	render.setClearColor(0x222627, 1.0);
}

//初始化相机
var camera;

function initCamera() {
	camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
	camera.position.x = 10;
	camera.position.y = 10;
	camera.position.z = 10;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//初始化场景
var scene;

function initScene() {
	scene = new THREE.Scene();
}

//初始化灯源
var light;

function initLight() {
	light = new THREE.AmbientLight(0xffffff, 1.5);
	// light.position.set(100, 100, 200);
	scene.add(light);
}

//初始化模型

function initModel() {
	var modelCenter = new THREE.Vector3(); //模型中心
	var glb;
	var threeGltfLoader = THREE.GLTFLoader;
	var loadingManager = this.loadingManager;
	var modelLoader = new threeGltfLoader(loadingManager);
	modelLoader.load("model.glb", function(gltf) {
		gltf.scene.children[0].material.roughness = 1;
		gltf.scene.children[0].material.map.anisotropy = 10;
		gltf.scene.children[0].material.map.encoding = THREE.LinearEncoding; // .sRGBEncoding;颜色平均亮度
		// gltf.scene.children[0].material.lights = false;
		// console.log(gltf.scene.children[0].material);
		// glb = gltf.scene.children[0];
		glb = gltf.scene;
		scene.add(glb);
		glb.rotation.x += -Math.PI * 0.5;

		// modelCenter
		var box = new THREE.Box3();
		glb.traverse(function(child) {
			if (child.isMesh) {
				child.geometry.computeBoundingBox();
				box.union(child.geometry.boundingBox);
			}
		});

		modelCenter.x = (box.max.x + box.min.x) / 2;
		modelCenter.y = (box.max.z + box.min.z) / 2;
		modelCenter.z = -(box.max.y + box.min.y) / 2;
		// console.log(modelCenter);
		glb.position.set(
			glb.position.x - modelCenter.x,
			glb.position.y - modelCenter.y,
			glb.position.z - modelCenter.z);

		// controls.target = modelCenter;

	});

	var object = new THREE.AxesHelper(500);
	scene.add(object);

}

//创建控制
var controls;

function initControls() {
	controls = new THREE.OrbitControls(camera, render.domElement);
}

//后期处理
var selectedObjects = [];
var composer, effectFXAA, outlinePass;

function initComposer() {
	// postprocessing
	composer = new THREE.EffectComposer(render);

	renderPass = new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);

	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
	composer.addPass(outlinePass);

	effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
	effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
	effectFXAA.renderToScreen = true;
	composer.addPass(effectFXAA);
	selectedObjects.push(scene);
	
	outlinePass.selectedObjects = selectedObjects;

	outlinePass.edgeStrength = 1.8; // 0.01～10 强度
	outlinePass.edgeGlow = 0.0; // 0.0～1 羽化
	outlinePass.edgeThickness = 1; // 1～4 边缘
	outlinePass.pulsePeriod = 0; // 0.0～5 周期
	outlinePass.visibleEdgeColor = new THREE.Color(0xffffff);
	outlinePass.hiddenEdgeColor = new THREE.Color(0xffffff);
}

//draw
function draw() {
	initRender();
	initCamera();
	initScene();
	initLight();
	initControls();
	initModel();
	initComposer();
	animate();

}

//更新控制器
function animate() {
	requestAnimationFrame(animate);
	composer.render();
	controls.update();
	// render.render(scene, camera);
}