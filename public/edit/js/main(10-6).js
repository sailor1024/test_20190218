"use strict";
var debugMode = false || document.URL.indexOf('debug') > 0;
var modelData;
var ismouseMoved = false;
var container;
var scene, renderer;

var anchorManager; //扫描点指示图标
var materialSwitch; //材质切换控制
var modeSwitch; //视图切换
var cameraController; //相机移动控制
var textureManager; //材质加载
var videoController; //视频纹理管理
var animateControl; //动画播放控制
var module3D; // 3D控制模块，对外接口

var pointerLockControl, orbitControl;

var modelCenter = new THREE.Vector3(); //模型中心
var modelSize = 30; //模型包围盒对角线长度

var modelmaxX; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning
var modelmaxY; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning

var pointerLockCamera, orbitCamera, orthoCamera;
var model = null; //模型
var cube; //展示立方图正方体
var underCompass; //下方图片

var viewPoint = []; //vector3 各视点位置
var viewPointQ = []; //vector4， 各视点立方图旋转

var nearestPointsIndex;

var targetIndex = -1; //目标位置索引
var targetMoved = false; //是否已移动到目标点
var curIndex = -1;

var changeToOrthographic = false; //转换为正交视图
var orthographicCallback; //转换后回调

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2]));

    return null;
}
//var rootPath = getQueryString('p') + "/";
var rootPath = 'fc553d849304011a2d9c4982aebee2cd/';
if (getQueryString('p') != null) {
    rootPath = "path/" + getQueryString('p') + '/';
}

var imagePath = rootPath + 'hjpeg/';
var limagePath = rootPath + 'ljpeg/';
var fileExt = ".jpg"; //webp
//if(Modernizr.webplossless){

//  imagePath = rootPath + 'hwebp/';
//  limagePath = rootPath + 'lwebp/';
//  fileExt = ".webp";//webp
// }

container = document.getElementById('container');
renderer = new THREE.WebGLRenderer();
var background = new THREE.Color(0x181a1c);
renderer.setClearColor(background);
//renderer.autoClearColor = false;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);
renderer.domElement.addEventListener('mousedown', onMouseDown, false); ////避免不能点击其他元素
document.addEventListener('mouseup', onMouseUp, false); //renderer.domElement无法释放！
renderer.domElement.addEventListener('mousemove', onMainMouseMove, false);
//renderer.domElement.addEventListener('click', mainOnClick, false);
renderer.domElement.addEventListener('touchstart', onTouchStart, {
    passive: false
});
renderer.domElement.addEventListener('touchend', onTouchEnd, false);
renderer.domElement.addEventListener('touchmove', onTouchMove, {
    passive: false
});

scene = new THREE.Scene();
var ambientLight = new THREE.AmbientLight(0x181a1c, 1);
scene.add(ambientLight);
// var pointLight = new THREE.PointLight(0x181a1c, 1, 0, 1);
// pointLight.position.set( 0, 10, 0 );
// scene.add( pointLight );
// var groundMaterial = new THREE.MeshPhongMaterial({shininess:0});
// var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000,1,1 ), groundMaterial );
// ground.position.y = - 200;
// ground.rotation.x = - Math.PI / 2;
// scene.add( ground );

var texture = new THREE.TextureLoader().load("image/background.jpg");
scene.background = texture;

$.getJSON(rootPath + "model.json?ver=" + Math.random(), function(obj) {
    modelData = obj;
    var cubeUrls = [];
    var smallUrls = [];
    for (var i = 0, len = modelData.viewPoints.length; i < len; ++i) {

        var pt = modelData.viewPoints[i];

        viewPoint.push(new THREE.Vector3(pt.x, pt.y, pt.z));
        var q = pt.q;
        viewPointQ.push(new THREE.Vector4(-q[0], -q[1], -q[2], q[3]));

        var urls = [];
        var urls2 = [];
        for (var j = 0; j < 6; ++j) {
            urls.push(imagePath + (i * 6 + j) + fileExt);
            urls2.push(limagePath + (i * 6 + j) + fileExt);
        }
        cubeUrls.push(urls);
        smallUrls.push(urls2);
    }

    textureManager = new TextureManager(renderer, cubeUrls, smallUrls, onTexutueLoaded);

    init();
    initNearestPoint();
    setupOption();

});


function init() {
    var aspect = window.innerWidth / window.innerHeight;
    pointerLockCamera = new THREE.PerspectiveCamera(65, aspect, 0.2, 5000);
    orbitCamera = new THREE.PerspectiveCamera(65, aspect, 0.2, 5000);
    orthoCamera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.5, 5000);
    scene.add(orbitCamera);
    pointerLockControl = new THREE.PointerLockControls(pointerLockCamera);
    //pointerLockControl.enabled = true;
    scene.add(pointerLockControl.getObject());

    orbitControl = new THREE.OrbitControls(orbitCamera, renderer.domElement);
    orbitControl.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    orbitControl.dampingFactor = 0.1; // 0.25;
    orbitControl.enablePan = true;
    orbitControl.enableZoom = true; //20180914_ning
    orbitControl.panningMode = THREE.HorizontalPanning; // default is THREE.ScreenSpacePanning
    orbitControl.panSpeed = 0.1; //20180914_ning
    orbitControl.maxPolarAngle = Math.PI / 2;
    //orbitControl.enablePan = debugMode;

    if (debugMode) {
        orbitControl.maxPolarAngle = Math.PI;
        var axesHelper = new THREE.AxesHelper(15);
        scene.add(axesHelper);
    }

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    videoController = new VideoController(modelData, scene, !isAndroid && !isiOS);

    //load model
    var loader = new THREE.GLTFLoader();

    if (document.URL.indexOf('nomodel') == -1) {

        if (modelData.modelSmall && modelData.modelSmall.length > 0) {

            loader.load(rootPath + modelData.modelSmall, function(gltf) {
                    initLoadedModel(gltf.scene);
                    onWindowResize();

                    loader.load(rootPath + modelData.modelPath, function(gltf) {

                        scene.remove(model);
                        scene.add(gltf.scene);
                        gltf.scene.rotateX(-Math.PI * 0.5);
                        materialSwitch.updateModel(gltf.scene);
                        model = gltf.scene;

                    });
                },
                undefined,
                function(error) {
                    initLoadedModel(null);
                }
            );
        } else {

            loader.load(rootPath + modelData.modelPath, function(gltf) {

                    initLoadedModel(gltf.scene);
                    onWindowResize();
                },
                undefined,
                function(error) {

                    initLoadedModel(null);
                }
            );
        }
    } else {
        initLoadedModel(null);
        onWindowResize();
    }

    onInit();


}

function initNearestPoint() {
    nearestPointsIndex = new Array();
    var len = viewPoint.length;
    for (var i = 0; i < len; i++) {
        var pointIndexs = getNearestKPoints(i);
        nearestPointsIndex[i] = pointIndexs;
    }
}

function initLoadedModel(group) { //
    model = group;
    materialSwitch = new MaterialSwitch(model);
    if (model) {
        model.rotateX(-Math.PI * 0.5);
        scene.add(model);
        var box = new THREE.Box3();
        model.traverse(function(child) {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                box.union(child.geometry.boundingBox);
            }
        });

        //包围盒信息
        modelCenter.x = (box.max.x + box.min.x) / 2;
        modelCenter.y = (box.max.z + box.min.z) / 2;
        modelCenter.z = -(box.max.y + box.min.y) / 2;
        modelSize = box.max.clone().sub(box.min).length();
        modelData.groundHeight = box.min.z;

        modelmaxX = box.max.x; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning
        modelmaxY = box.max.y; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning

        var box2 = box.clone();
        box2.min.multiplyScalar(1.1);
        box2.max.multiplyScalar(1.1);

        var sizex = box2.max.x - box2.min.x;
        var sizey = box2.max.z - box2.min.z;
        var sizez = box2.max.y - box2.min.y;

        cube = new THREE.Mesh(new THREE.BoxGeometry(sizex, sizey, sizez), materialSwitch.matCube);
        cube.position.set(box2.max.x - sizex / 2, box2.max.z - sizey / 2, -box.min.y - sizez / 2);
        //
        // $.getJSON(rootPath + "outline.json?ver=" + Math.random(), function (obj) {
        //     let map = new THREE.TextureLoader().load(rootPath + "/outline.png");
        //     let mat = new THREE.MeshBasicMaterial({map: map, transparent:true});
        //     let mesh = new THREE.Mesh(new THREE.PlaneGeometry(obj.width, obj.height), mat);
        //
        //     mesh.position.set(obj.minX+obj.width/2, box.max.z, -obj.minY-obj.height/2); //-y->+z
        //     mesh.rotation.x = -Math.PI / 2;
        //     scene.add(mesh);
        // });
    } else {
        cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialSwitch.matCube);
        modelData.groundHeight = viewPoint[0].y - modelData.cameraHeight;
    }
    cube.geometry.scale(-1, 1, 1);
    scene.add(cube);

    var pointPath = "point5.png"; //20180914ning
    anchorManager = new AnchorManager(viewPoint, modelData.anchorSize, modelData.cameraHeight, scene, pointPath); //need groundheight
    modeSwitch = new ModeSwitch(cube, materialSwitch, onModeChange);
    cameraController = new CameraController(orbitCamera, orbitControl, pointerLockCamera, pointerLockControl, orthoCamera, modeSwitch, onMoving, onMoved);
    module3D = new Module3D(renderer, scene, cameraController);

    // if (!debugMode) {
    //     orbitControl.minDistance = modelSize / 2.5;
    //     orbitControl.maxDistance = modelSize * 2;
    // }
    onModelLoaded();

    $.getJSON(rootPath + "animate.json", function(obj) {
        animateControl = new AnimateControl(obj);
    });
    //setupCompass();
    if (model) {

        setDefaultOverallView();
    } else {

        modeSwitch.setWalkingMode();
        //orbitCamera.position.set(viewPoint[0].x, viewPoint[0].y+modelData.cameraHeight, viewPoint[0].z )
        setWalkingViewPoint(0);
    }

    // var a = document.createElement('script');
    // a.src='js/multithread.js';
    // document.body.appendChild(a);

    animate();
}

function setupCompass() {
    var textureLoader = new THREE.TextureLoader();
    var compassPath = "image/" + "compass.png";
    var mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        depthTest: false,
        transparent: true,
        map: textureLoader.load(compassPath)
        //map: textureLoader.load("image/compass.png")
    });

    var geometry = new THREE.PlaneBufferGeometry(modelData.cameraHeight * 1.2, modelData.cameraHeight * 1.2, 1);
    //var geometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 1);
    geometry.rotateX(-Math.PI / 2);

    underCompass = new THREE.Mesh(geometry, mat);
    underCompass.renderOrder = 1;
    //scene.add(underCompass);
}

var posMouseDown = {
    x: 0,
    y: 0
};

function onMouseDown(e) {
    //测量模式下3D视角进入moveto关闭 20180918ning 
    if (CanvasState) {
        ismouseMoved = false;
        posMouseDown.x = e.offsetX;
        posMouseDown.y = e.offsetY;

        if ((e.buttons & 1) == 1 && modeSwitch.isWalkingMode()) {
            pointerLockControl.enabled = true;
        }

    }

}

function onMainMouseMove(e) {
    if (e.offsetX != posMouseDown.x || e.offsetY != posMouseDown.y) { //有时mousedown后会直接触发mousemove
        ismouseMoved = true;
    }


    var size = renderer.getSize();
    var mousex = (e.offsetX / size.width) * 2 - 1;
    var mousey = -(e.offsetY / size.height) * 2 + 1;
    anchorManager && anchorManager.updateHint(mousex, mousey);

    if (debugMode && cameraController) {
        var pos = module3D.getAnchorPoint(); //  getMousePos3D(e.offsetX, e.offsetY);
        //var pos = module3D.getAnchorNormal();
        // var pos2 = module3D.calcPosition(pos, normal, 2);
        // console.log(pos2);
        showInfo("x: " + pos.x.toFixed(2) + ", y:" + pos.y.toFixed(2) + ", z:" + pos.z.toFixed(2));
    }

    onMouseMove(e);
}

var touchX;
var touchY;

function onTouchStart(event) {

    ismouseMoved = false;

    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;

    ismouseMoved = false;
    if (modeSwitch.isWalkingMode()) {
        pointerLockControl.enabled = true;
    }
};

function onTouchMove(event) {
    //if ( scope.enabled === false ) return;
    //event.preventDefault();
    //event.stopPropagation();

    var curTouchX = event.changedTouches[0].clientX;
    var curTouchY = event.changedTouches[0].clientY;

    if (curTouchX != touchX || curTouchY != touchY) { //有时mousedown后会直接触发mousemove
        ismouseMoved = true;
    }

    var size = renderer.getSize();
    var mousex = (curTouchX / size.width) * 2 - 1;
    var mousey = -(curTouchY / size.height) * 2 + 1;
    anchorManager && anchorManager.updateHint(mousex, mousey);

    if (debugMode && cameraController) {
        var pos = module3D.getAnchorPoint(); //  getMousePos3D(e.offsetX, e.offsetY);
        //var pos = module3D.getAnchorNormal();
        // var pos2 = module3D.calcPosition(pos, normal, 2);
        // console.log(pos2);
        showInfo("x: " + pos.x.toFixed(2) + ", y:" + pos.y.toFixed(2) + ", z:" + pos.z.toFixed(2));
    }

    onMouseMove(event);

    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;

};

function onTouchEnd(event) {
    if (modeSwitch.isWalkingMode()) {
        pointerLockControl.enabled = true;
    }

    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;

    if (!ismouseMoved) {
        mainOnClick(event);
    }
};

function onMouseUp(e) {
    if (e.buttons == 0 && modeSwitch.isWalkingMode()) {
        pointerLockControl.enabled = false;

    }
    mainOnClick(e);


}

function mainOnClick(e) {
    if (ismouseMoved) return;
    if (!targetMoved) {
        if (modeSwitch.isWalkingMode()) {
            return;
        }
    }

    if(!onClick()){
        return 
    }

    //console.log("test1");

    var size = renderer.getSize();
    var mousex = (e.offsetX / size.width) * 2 - 1;
    var mousey = -(e.offsetY / size.height) * 2 + 1;

    var vector;
    var mousePoint;
    if (!ismouseMoved && modeSwitch.isOrthographic()) {
        //由于点击2D平面会报错，先屏蔽，后面再改
        //return;//20180925_Ning_增加2D点击;
    }
    if (modeSwitch.isWalkingMode()) {
        vector = new THREE.Vector3(mousex, mousey, 1).unproject(pointerLockCamera);
        vector.sub(pointerLockControl.getObject().position);
    } else if (modeSwitch.isOverallMode()){
        vector = new THREE.Vector3(mousex, mousey, 1).unproject(orbitCamera);
        vector.sub(orbitCamera.position);
    } else if (modeSwitch.isOrthographic()){//20180925_Ning_2D进入场景；
        orbitCamera.position.copy(orthoCamera.position);
        orbitCamera.rotation.copy(orthoCamera.rotation);
        vector = new THREE.Vector3(mousex, mousey, 1).unproject(orbitCamera);
        vector.sub(orthoCamera.position);
    }
    vector.normalize();

    if (modeSwitch.isOverallMode()) {

        model.visible = true;
        if (vector.y < -0.05) { //限制过于水平（远）的点击
            var matched = -1;
            var maxDot = 0.5;
            var minDot = 2.0;
            var dir = new THREE.Vector3();
            for (var i = 0; i < viewPoint.length; ++i) {
                if (modeSwitch.isOverallMode() || i != targetIndex) {
                    if (modeSwitch.isOverallMode()) {
                        //
                        dir.subVectors(viewPoint[i], orbitCamera.position);
                        // dir.set(viewPoint[i].x - orbitCamera.position.x, deltaY, viewPoint[i].z - orbitCamera.position.z);
                    } else {
                        dir.subVectors(viewPoint[i], viewPoint[targetIndex]);
                        //dir.set(viewPoint[i].x - viewPoint[targetIndex].x, deltaY, viewPoint[i].z - viewPoint[targetIndex].z);
                    }
                    dir.y -= modelData.cameraHeight;
                    dir.normalize();

                    var temp = dir.dot(vector);

                    if (temp > maxDot) {
                        maxDot = temp;
                        matched = i;
                    }


                }
            }

            if (matched != -1) {

                setWalkingViewPoint(matched);
            }
        }

        //return;
    }

    //2D平面点击
    if (modeSwitch.isOrthographic()) {
        //console.log("click");
        model.visible = true;
        //if (vector.y < -0.05) { //限制过于水平（远）的点击

        var matched = -1;
        var maxDot = 0.5;
        var minDot = 2.0;
        var dir = new THREE.Vector3();
        for (var i = 0; i < viewPoint.length; ++i) {
            if (modeSwitch.isOrthographic() || i != targetIndex) {
                if (modeSwitch.isOrthographic()) {
                    //
                    dir.subVectors(viewPoint[i], orthoCamera.position);
                    // dir.set(viewPoint[i].x - orthoCamera.position.x, deltaY, viewPoint[i].z - orthoCamera.position.z);
                } else {
                    dir.subVectors(viewPoint[i], viewPoint[targetIndex]);
                    //dir.set(viewPoint[i].x - viewPoint[targetIndex].x, deltaY, viewPoint[i].z - viewPoint[targetIndex].z);
                }
                //dir.y -= modelData.cameraHeight;
                dir.normalize();

                var temp = dir.dot(vector);
                // console.log("temp:",temp);
                if (temp > maxDot) {
                    maxDot = temp;
                    matched = i;
                    // console.log("temp:",temp);
                }


            }
        }

        if (matched != -1) {
            console.log("matched", matched);
            setWalkingViewPoint(matched);
        }
        //}
    }
    //console.log("test3");

    /*if(vector.y<-0.05){ //限制过于水平（远）的点击
        var matched = -1;
        var maxDot = 0.5;
        var minDot = 2.0;
        var dir = new THREE.Vector3();
        for (var i = 0; i < viewPoint.length; ++i) {
            if (modeSwitch.isOverallMode() || i != targetIndex) {
                if (modeSwitch.isOverallMode()) {
                    //
                    dir.subVectors(viewPoint[i], orbitCamera.position);
                    // dir.set(viewPoint[i].x - orbitCamera.position.x, deltaY, viewPoint[i].z - orbitCamera.position.z);
                } else {
                    dir.subVectors(viewPoint[i], viewPoint[targetIndex]);
                    //dir.set(viewPoint[i].x - viewPoint[targetIndex].x, deltaY, viewPoint[i].z - viewPoint[targetIndex].z);
                }
                dir.y -= modelData.cameraHeight;
                dir.normalize();

                var temp = dir.dot(vector);

                if (temp > maxDot) {
                       maxDot = temp;
                       matched = i;
                  }


            }
        }*/

    /*if (matched != -1) {
        setWalkingViewPoint(matched);
    }*/

    if (modeSwitch.isWalkingMode()) {

        model.visible = true;

        mousePoint = module3D.getAnchorPoint();
        mousePoint.y += modelData.cameraHeight;

        const DIST_THRESHHOLD = 0.5;
        const NEAR_DIST_LOW_THRESH = 4.0;
        const NEAR_DIST_HIGH_THRESH = 30.0;
        var minMouseDist = 10000000000.0;
        var minMouseIndex = -1;
        for (var i = 0; i < viewPoint.length; ++i) {
            var curViewPoint = viewPoint[i];
            var distDir = new THREE.Vector3();
            distDir.subVectors(curViewPoint, mousePoint);

            var dist = distDir.length();

            if (dist < minMouseDist) {
                minMouseDist = dist;
                minMouseIndex = i;
            }
        }

        var curPoint = viewPoint[curIndex];
        var curMouseDir = new THREE.Vector3();
        curMouseDir.subVectors(mousePoint, curPoint);
        var curMouseDist = curMouseDir.length();

        if (minMouseDist < DIST_THRESHHOLD) {
            if (minMouseIndex != -1) {

                setWalkingViewPoint(minMouseIndex);
            }

        } else {

            var nearPoints = nearestPointsIndex[curIndex];
            var minAngle = 3.1415026;

            var minPointIndex = -1;
            var minDist = 1000000.0;

            var dir = new THREE.Vector3();
            cameraController.getCurrentCamera().getWorldDirection(dir);
            dir.normalize();

            for (var i = 0; i < nearPoints.length; i++) {
                var nearPointIndex = nearPoints[i];

                var curNearPoint = viewPoint[nearPointIndex];
                var curDir = new THREE.Vector3();
                curDir.subVectors(curNearPoint, curPoint);
                var curDist = curDir.length();

                curDir.normalize();
                var curAngle = Math.acos(dir.dot(curDir));

                const PI = 3.1415926;

                if (curAngle < PI / 4.0 && curAngle >= -PI / 4.0) {

                    if (curDist < minDist) {
                        minDist = curDist;
                        minPointIndex = nearPointIndex;
                    }
                } else {
                    if (i == 4 && minPointIndex == -1) {

                        pointerLockControl.bounce(curPoint, mousePoint);
                    }
                }


            }


            if (minPointIndex != -1) {
                setWalkingViewPoint(minPointIndex);
            }

        }
    }

    //console.log("test2");

}

function onModeChange() {
    //underCompass.visible = modeSwitch.isWalkingMode();
    orbitControl.enabled = modeSwitch.isOverallMode() || modeSwitch.isOrthographic();
    pointerLockControl.enabled = false;
}


function animate() {
    var size = renderer.getSize();
    if (size.width != renderer.domElement.clientWidth || size.height != renderer.domElement.clientHeight) {
        module3D.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
    }

    //guohua add
    orbitControl.update(); //20180919取消屏蔽，原因切换2D动画流畅
    //guohua add

    requestAnimationFrame(animate);

    cameraController.update();
    if (!cameraController.moving) {
        textureManager.update();
    }
    animateControl && animateControl.update();

    //guohua add
    //orbitControl.update();//20180919屏蔽，原因切换2D动画会卡
    //pointerLockControl.update();//20180919屏蔽 原因切换2D动画会卡
    //guohua add

    // var cam = cameraController.getCurrentCamera();
    // cam.getWorldPosition(underCompass.position);
    //underCompass.position.y = modelData.groundHeight;
    renderer.render(scene, cameraController.getCurrentCamera());

    onAnimate();
}

function getWindowPos(x, y, z) {
    var camera = cameraController.getCurrentCamera();
    var v = new THREE.Vector3(x, y, z).project(camera);

    if (v.z < -1 || v.z > 1) return {
        x: -999,
        y: -999
    };

    var size = renderer.getSize();
    return {
        x: Math.floor((v.x + 1.0) * size.width * 0.5),
        y: Math.floor((1.0 - v.y) * size.height * 0.5)
    };
}

//获取屏幕位置空间坐标，当前为指向的地面坐标
function getMousePos3D(x, y) {
    var size = renderer.getSize();
    var mousex = (x / size.width) * 2 - 1;
    var mousey = -(y / size.height) * 2 + 1;

    var vector = new THREE.Vector3(mousex, mousey, 1).unproject(cameraController.getCurrentCamera());

    var pos = new THREE.Vector3();
    cameraController.getCurrentCamera().getWorldPosition(pos);
    if (modeSwitch.isOrthographic()) {
        //showInfo("x: " + vector.x.toFixed(2) + ", z:" + vector.z.toFixed(2));
    } else {
        vector.sub(pos);
        vector.normalize();
        if (vector.y < 0) {
            vector.multiplyScalar(-1.0 / vector.y * (pos.y - modelData.groundHeight));
            vector.x += pos.x;
            vector.z += pos.z;
            //showInfo("x: " + (vector.x + pos.x).toFixed(2) + ", z:" + (vector.z + pos.z).toFixed(2));
        }
    }

    return {
        x: vector.x,
        y: modelData.groundHeight,
        z: vector.z
    };
}

function setDefaultOverallView() {
    materialSwitch.restore();
    modeSwitch.setOverallMode();
    anchorManager.highlight();
    targetIndex = -1;
    targetMoved = false;

    orbitCamera.position.set(modelCenter.x, modelCenter.y + modelSize / 3, modelCenter.x + modelSize / 2);
    orbitControl.target.copy(modelCenter);
    orbitControl.update();
}

function setOverallView(position, orient) {
    if (position) {
        cameraController.moveTo(position, orient)
    } else {
        cameraController.moveFromPoint(modelSize);
    }

    if (!modeSwitch.isOverallMode()) {
        materialSwitch.restore();
        modeSwitch.setOverallMode();
        anchorManager.highlight();
        targetIndex = -1;
        targetMoved = false;
    }

    videoController.turnOff();
}


function setWalkingViewPoint(index, orient) {

    //进入第一视角自动隐藏标尺Ning_20180925
    HiddenMeasure();
    //console.log("HiddenMeasure");

    if (index < 0 || index >= viewPoint.length) index = 0;

    if (model == null) {
        if (targetIndex != -1) {
            let dir = viewPoint[targetIndex].clone().sub(viewPoint[index]);
            let len = dir.length();
            dir.divideScalar(len);
            cube.scale.set(modelData.cameraHeight * 2, modelData.cameraHeight * 2, len * 2 + modelData.cameraHeight * 2);

            cube.rotation.set(0, Math.atan2(dir.x, dir.z), 0);
            cube.position.copy(viewPoint[targetIndex]);
        } else {
            cube.scale.set(modelData.cameraHeight * 2, modelData.cameraHeight * 2, modelData.cameraHeight * 2);
            cube.position.copy(viewPoint[index]);
        }
    }

    onWalkingViewPoint(index, orient);

    if (modeSwitch.isOrthographic()) {
        modeSwitch.setOverallMode();
    }

    anchorManager.normal();
    targetIndex = index;
    targetMoved = false;


    cameraController.moveTo(viewPoint[index], orient);
    videoController.turnOff();
    materialSwitch.setTarget(viewPoint[index]);
    textureManager.loadTexture(index, false);

    //underCompass.position.set(viewPoint[index].x, modelData.groundHeight, viewPoint[index].z);
}

function setOrthographic(position, orient, cb) {
    orthographicCallback = cb;
    setOverallView(position, orient);
    changeToOrthographic = true;
    orthoCamera.zoom = 1;
}

function onMoving(progress) {
    materialSwitch.updateProgress(progress);
}

var timeRecord;
const timeDelay = 5000;
var freeTimer;
var zeroAdd = 0;
var matchRecord = [];

function onMoved() { //移动结束
    if (changeToOrthographic) { //转换到正视图
        changeToOrthographic = false;
        modeSwitch.setOrthographic();

        var pos = cameraController.endPoint;
        var orient = cameraController.endOrient;

        var height = pos.y - modelData.groundHeight;
        var h = height * Math.tan(orbitCamera.fov * Math.PI / 360);
        var w = h * orbitCamera.aspect;
        orthoCamera.left = -w;
        orthoCamera.right = w;
        orthoCamera.top = h;
        orthoCamera.bottom = -h;
        orthoCamera.position.copy(pos);
        orthoCamera.setRotationFromQuaternion(orient);
        orthoCamera.updateProjectionMatrix();

        orthographicCallback && orthographicCallback();
    }

    targetMoved = true;
    videoController.moveTo(targetIndex);
    if (targetIndex != -1) {
        switchToWalkingMode();
        curIndex = targetIndex;
    }
    timeRecord = new Date().getTime();
    matchRecord.push(targetIndex);
    onPreLoadTexture(targetIndex);

    // if(debugMode){
    //     var halfAngle = Math.acos(viewPointQ[targetIndex].w);
    //     console.log("角度：", (halfAngle*360/Math.PI).toFixed(2));
    // }
}
(function freeTimeToLoadTexture() {
    freeTimer = setInterval(function() {
        if (new Date().getTime() - timeRecord >= timeDelay) {
            if (zeroAdd >= modelData.viewPoints.length) {
                clearInterval(freeTimer);
            } else {
                if (matchRecord.indexOf(zeroAdd) != -1) {
                    zeroAdd++

                }

                textureManager.loadTexture(zeroAdd++, false);

            }
        }
    }, 1000)
})();
var num_threads = 4;
var MT = new Multithread(num_threads);
var scope = this;

function onPreLoadTexture(targetIndex) {

    if (modeSwitch.isOrthographic() || modeSwitch.isOverallMode()) {
        return; //解除切换2D与3D视角的Error；20180918ning
    }

    var nearPoints = nearestPointsIndex[targetIndex];
    var j = targetIndex;

    var funcInADifferentThread = MT.process(
        function() {},
        function() {
            for (var i = 0; i < nearPoints.length; i++) {
                textureManager.loadTexture(nearPoints[i], false);
            }
        }
    );
    funcInADifferentThread(targetIndex);

}

function onTexutueLoaded(index, texture) { //纹理加载完毕
    if (targetIndex == index) {
        materialSwitch.setTargetTexture(texture, viewPointQ[index]);
        switchToWalkingMode();

    }
}

function switchToWalkingMode() { //从总览模式切换到漫游模式


    if (targetMoved && materialSwitch.loaded() && !modeSwitch.isWalkingMode()) {
        modeSwitch.setWalkingMode();
        materialSwitch.useCubemap();
    }
}

//返回当前方向, -z为0, 逆时针旋转[-PI, +PI]
function getViewDirection() {
    var dir = new THREE.Vector3();
    cameraController.getCurrentCamera().getWorldDirection(dir);
    return Math.atan2(-dir.x, -dir.z);
}
//返回当前相机俯仰角度[-PI/2, +PI/2]
function getViewDirectionY() {
    var dir = new THREE.Vector3();
    cameraController.getCurrentCamera().getWorldDirection(dir);
    return Math.atan2(dir.y, dir.x * dir.x + dir.z * dir.z);
}

function rotateToPixel(rotateAngle) {
    return rotateAngle / cameraController.pixelToRotation;
}
//根据旋转角度计算移动距离

function sortPoint(a, b) {
    var distA = 0.0;
    distA += (a.point.x) * (a.point.x);
    distA += (a.point.y) * (a.point.y);
    distA += (a.point.z) * (a.point.z);

    var distB = 0.0;
    distB += (b.point.x) * (b.point.x);
    distB += (b.point.y) * (b.point.y);
    distB += (b.point.z) * (b.point.z);

    var distDiff = Math.abs(distA - distB);
    if (distDiff < 0.001) {
        var xDiff = Math.abs(a.point.x - b.point.x);
        if (xDiff < 0.001) {
            return a.point.z - b.point.z;
        }
        return a.point.x - b.point.x;
    }

    return distA - distB;
}

function getNearestKPoints(curIndex) {
    var resultPoints = [];
    var tempPoints = [];
    var curPoint = viewPoint[curIndex];
    var len = viewPoint.length;
    for (var i = 0; i < len; i++) {
        if (i == curIndex) {
            continue;
        }
        var point = viewPoint[i];
        var newPoint = new THREE.Vector3(point.x - curPoint.x, point.y - curPoint.y, point.z - curPoint.z);
        var tempPoint = Object();
        tempPoint.index = i;
        tempPoint.point = newPoint;

        tempPoints.push(tempPoint);
    }
    const K = 5;
    tempPoints.sort(sortPoint);

    for (var i = 0; i < tempPoints.length; i++) {
        var tempPoint = tempPoints[i];
    }

    for (var i = 0; i < K; i++) {
        resultPoints.push(tempPoints[i].index);
    }

    return resultPoints;

}

// function rotateToPixel(rotateAngle) {
//     var fov = cameraController.getCurrentCamera().fov;

//     return rotateAngle * 180 / Math.PI / fov * window.innerHeight;
// }