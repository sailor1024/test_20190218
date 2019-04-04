//Ning+ 20181119新增

// render tags start +

var CanvasState = true;
//隐藏标尺
function HiddenMeasure() {
	for (var i = 0; i < LineObjects.length; i++) {
		//console.log("visible:", i);
		LineObjects[i].line.visible = false;
		LineObjects[i].point_1.M2.visible = false;
		LineObjects[i].point_1.M3.visible = false;
		LineObjects[i].point_2.M2.visible = false;
		LineObjects[i].point_2.M3.visible = false;
		LineObjects[i].textsprit.visible = false;
		LineObjects[i].buttonSprit.visible = false;
	}
}

//显示标尺
function ShowMeasure() {
	for (var i = 0; i < LineObjects.length; i++) {
		//console.log("visible:", i);
		LineObjects[i].line.visible = true;
		LineObjects[i].point_1.M2.visible = true;
		LineObjects[i].point_1.M3.visible = true;
		LineObjects[i].point_2.M2.visible = true;
		LineObjects[i].point_2.M3.visible = true;
		LineObjects[i].textsprit.visible = true;
		LineObjects[i].buttonSprit.visible = false;
	}
}

//隐藏2D标尺
function HiddenMeasure2D() {
	for (var i = 0; i < LineObjects.length; i++) {
		if (LineObjects[i].line.name == 'iconfont icon-five') {
			LineObjects[i].line.visible = false;
			LineObjects[i].point_1.M2.visible = false;
			LineObjects[i].point_1.M3.visible = false;
			LineObjects[i].point_2.M2.visible = false;
			LineObjects[i].point_2.M3.visible = false;
			LineObjects[i].textsprit.visible = false;
			LineObjects[i].buttonSprit.visible = false;
		}
	}
}

//显示2D标尺
function ShowMeasure2D() {
	for (var i = 0; i < LineObjects.length; i++) {
		if (LineObjects[i].line.name == 'iconfont icon-five') {
			LineObjects[i].line.visible = true;
			LineObjects[i].point_1.M2.visible = true;
			LineObjects[i].point_1.M3.visible = true;
			LineObjects[i].point_2.M2.visible = true;
			LineObjects[i].point_2.M3.visible = true;
			LineObjects[i].textsprit.visible = true;
			LineObjects[i].buttonSprit.visible = false;
		}
	}
}

//隐藏3D标尺
function HiddenMeasure3D() {
	for (var i = 0; i < LineObjects.length; i++) {
		if (LineObjects[i].line.name == 'iconfont icon-four') {
			LineObjects[i].line.visible = false;
			LineObjects[i].point_1.M2.visible = false;
			LineObjects[i].point_1.M3.visible = false;
			LineObjects[i].point_2.M2.visible = false;
			LineObjects[i].point_2.M3.visible = false;
			LineObjects[i].textsprit.visible = false;
			LineObjects[i].buttonSprit.visible = false;
		}
	}
}

//显示3D标尺
function ShowMeasure3D() {
	for (var i = 0; i < LineObjects.length; i++) {
		if (LineObjects[i].line.name == 'iconfont icon-four') {
			LineObjects[i].line.visible = true;
			LineObjects[i].point_1.M2.visible = true;
			LineObjects[i].point_1.M3.visible = true;
			LineObjects[i].point_2.M2.visible = true;
			LineObjects[i].point_2.M3.visible = true;
			LineObjects[i].textsprit.visible = true;
			LineObjects[i].buttonSprit.visible = false;
		}
	}
}

//20181009Ning+ Tag
//标签块点击
//创建原点
var geometry = new THREE.CircleBufferGeometry(0.01, 32);
var material = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	transparent: true,
	opacity: 0.1,
	depthTest: false
});
var materialround = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	transparent: true,
	opacity: 0.1,
	depthTest: false
});
//放置后的材质
var material2 = new THREE.MeshBasicMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.25,
	depthTest: false
});
//移动中的模型
var TagDynamic = new THREE.Mesh(geometry, material2);
//线条;
//var geometryLine = new THREE.CylinderBufferGeometry(0.0025, 0.5, 0.6, 32);
var geometryLine = new THREE.BoxBufferGeometry(0.003, 0.003, 0.5);
var materialLine = new THREE.MeshBasicMaterial({
	transparent: true,
	opacity: 0.3,
	color: 0xffffff
});
var LineDynamic = new THREE.Mesh(geometryLine, materialLine);
LineDynamic.position.z = 0.25 * 0.5; //提高高度；
// console.log("valueinput",$(".heightAdjustment").val()); //面板里的参数
LineDynamic.scale.z = 0.5; //缩放
TagDynamic.scale.x = TagDynamic.scale.y = 10;
//模型组
//groupTag = new THREE.Object3D();
var groupTag = new THREE.Group();
var Tagline = new THREE.Group();
//数组结构体
var TagObjects = [];
//创建divtag
//储存标签到数组供选取；
var tagobjectsArray = [];
var tagobjectsArrayAll = [];
var TagSelet;

function createSpriteShape() {
	/*1、创建画布*/
	let canvas = document.createElement("canvas");
	canvas.width = 120;
	canvas.height = 120;
	/*2、创建图形*/
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ff0000";
	ctx.arc(50, 50, 50, 0, 2 * Math.PI);
	ctx.fill();
	/*3、将canvas作为纹理，创建Sprite*/
	let texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	let material = new THREE.SpriteMaterial({
		map: texture,
		map: THREE.ImageUtils.loadTexture('image/TagRound_blue.png')
	});
	let mesh = new THREE.Sprite(material);
	mesh.scale.set(0.1, 0.1, 0.1);
	mesh.position.z = 0.5 * 0.5;
	//scene.add(mesh);
	return mesh;
}
//LoadingSceneLabels
function initTag() {
	//console.log("modelData",modelData.tags);
	if (modelData.tags != undefined) {
		modelData.tags.forEach(function(object) {
			//console.log(object.title, object.content, object.position, object.rotation, object.color, object.linelen);
			scene.add(groupTag);
			groupTag.add(TagDynamic);
			groupTag.add(LineDynamic);
			groupTag.add(createSpriteShape());
			groupTag.rotation.set(object.rotation._x, object.rotation._y, object.rotation._z);
			groupTag.position.set(object.position.x, object.position.y, object.position.z);
			Tagline = groupTag.clone();
			scene.add(Tagline);
			var TagObject = {};
			TagObject.Round = Tagline.children[0];
			TagObject.Line = Tagline.children[1];
			TagObject.Line.scale.z = object.linelen;
			TagObject.Line.name = TagObject.Line.scale.z;
			TagObject.TagRound = Tagline.children[2];
			TagObject.TagRound.name = object.color;
			TagObject.TagGroup = Tagline;
			TagObject.TagGroup.name = TagObjects.length;
			TagObject.title = object.title;
			TagObject.content = object.content;
			TagObject.Resources = object.Resources;
			TagObject.Marker = object.Marker;
			TagObject.Line.name = parseFloat(object.linelen);
			TagObject.Line.position.z = 0.25 * object.linelen;
			TagObject.TagRound.position.z = 0.5 * object.linelen;
			TagObject.TagRound.material = new THREE.SpriteMaterial({
				map: texture,
				map: THREE.ImageUtils.loadTexture('image/TagRound_' + object.color + '.png')
			});
			TagObjects.push(TagObject);
			TagSelet = TagObjects.length - 1;
			TagObject.Round.scale.x = TagObject.Round.scale.y = 3;
			TagObject.Round.material = materialround;
			groupTag.remove(groupTag.children[0], groupTag.children[1], groupTag.children[2]);
			scene.remove(groupTag);
			tagobjectsArray.push(TagObject.TagRound);
			tagobjectsArrayAll.push(TagObject);
		})
	}
}
GreateTagDiv();
//创建divtag
function GreateTagDiv(result) {
	//创建一个div
	var div = document.createElement("div");
	//为div创建属性class = "test"
	var divattr = document.createAttribute("class");
	divattr.value = "test";
	var divattr2 = document.createAttribute("id");
	divattr2.value = "tagmove";
	//把属性class = "test"添加到div
	div.setAttributeNode(divattr);
	div.setAttributeNode(divattr2);
	//创建一hello,world个文本节点
	var text = document.createTextNode("标签01测试");
	var mattertagTitleShowChild1 = document.createElement('p');
	var mattertagTitleShowChild2 = document.createElement('p');
	var mattertagTitleShowChild3 = document.createElement('p');
	var mattertagTitleShowChild4 = document.createElement('div');
	var mattertagTitleShowChild3Childen = document.createElement('img');
	var mattertagTitleShowChild3ChildenIframe = document.createElement('iframe');
	var mattertagTitleShowChild4Childeniconfont1 = document.createElement('i');
	var mattertagTitleShowChild4Childeniconfont2 = document.createElement('i');
	var mattertagTitleShowChild4Childenaudio = document.createElement('audio');
	var mattertagTitleShowChild4ChildenVideo = document.createElement('video');
	var tagmoveArrow = document.createElement('div');
	mattertagTitleShowChild1.setAttribute('class', 'Child1-title');
	mattertagTitleShowChild2.setAttribute('class', 'Child2-content');
	mattertagTitleShowChild3.setAttribute('class', 'Child3-Resources');
	mattertagTitleShowChild3Childen.setAttribute('src', '');
	mattertagTitleShowChild3Childen.setAttribute('style', 'display:none');
	mattertagTitleShowChild3ChildenIframe.setAttribute('name', 'Resources');
	mattertagTitleShowChild3ChildenIframe.setAttribute('scrolling', 'auto');
	mattertagTitleShowChild3ChildenIframe.setAttribute('allowfullscreen', 'true');
	mattertagTitleShowChild3ChildenIframe.setAttribute('src', '');
	mattertagTitleShowChild3ChildenIframe.setAttribute('id', 'Iframe-view');
	mattertagTitleShowChild3ChildenIframe.setAttribute('style', 'display:none');
	mattertagTitleShowChild4.setAttribute('style', 'display:flex;justify-content:flex-start;align-items: center;display:none;');
	mattertagTitleShowChild4.setAttribute('class', 'audioPlay');
	mattertagTitleShowChild4Childeniconfont1.setAttribute('class', 'iconfont icon-microphone');
	mattertagTitleShowChild4Childeniconfont1.setAttribute('style', 'display:none;cursor:pointer');
	mattertagTitleShowChild4Childeniconfont2.setAttribute('class', 'iconfont icon-microphoneslash');
	mattertagTitleShowChild4Childeniconfont2.setAttribute('style', 'display:block;cursor:pointer');
	mattertagTitleShowChild4Childenaudio.setAttribute('controls', 'true');
	mattertagTitleShowChild4Childenaudio.setAttribute('style', 'display:none');
	mattertagTitleShowChild4Childenaudio.setAttribute('id', 'audioPlaying');
	mattertagTitleShowChild4ChildenVideo.setAttribute('id', 'videoPlaying');
	mattertagTitleShowChild4ChildenVideo.setAttribute('autoplay', 'autoplay');
	mattertagTitleShowChild4ChildenVideo.setAttribute('controls', 'true');
	mattertagTitleShowChild4ChildenVideo.setAttribute('width', '100%');
	mattertagTitleShowChild4ChildenVideo.setAttribute('height', '100%');
	mattertagTitleShowChild4ChildenVideo.setAttribute('style', 'object-fit:fill');
	mattertagTitleShowChild3ChildenIframe.append('<p>你的浏览器不支持iframe标签</p>')
	tagmoveArrow.setAttribute('id', 'tagmoveArrow');
	tagmoveArrow.setAttribute('style', 'position: absolute');
	mattertagTitleShowChild1.innerHTML = '热点1';
	mattertagTitleShowChild2.innerHTML = '';
	mattertagTitleShowChild3.append(mattertagTitleShowChild3Childen);
	mattertagTitleShowChild3.append(mattertagTitleShowChild3ChildenIframe);
	mattertagTitleShowChild3.append(mattertagTitleShowChild4ChildenVideo);
	mattertagTitleShowChild4.append(mattertagTitleShowChild4Childeniconfont1);
	mattertagTitleShowChild4.append(mattertagTitleShowChild4Childeniconfont2);
	mattertagTitleShowChild4.append(mattertagTitleShowChild4Childenaudio);
	// div.appendChild(text);
	div.appendChild(mattertagTitleShowChild1);
	div.appendChild(mattertagTitleShowChild2);
	div.appendChild(mattertagTitleShowChild3);
	div.appendChild(mattertagTitleShowChild4);
	//为div添加样式
	var style = document.createAttribute("style");
	div.setAttributeNode(style);
	mattertagTitleShowChild1.style.fontFamily = "微软雅黑";
	mattertagTitleShowChild2.style.color = "#a7a7a7";
	div.style.left = 0 + "px";
	div.style.top = 0 + "px";
	div.style.zIndex = "1";
	div.style.borderRadius = "5px";
	div.style.display = "none";
	tagmoveArrow.style.left = 0 + "px";
	tagmoveArrow.style.top = 0 + "px";
	tagmoveArrow.style.display = "none";
	//把div追加到body
	// document.getElementsByTagName("body").item(0).appendChild(div);
	document.getElementById("container").appendChild(div);
	document.getElementById("container").appendChild(tagmoveArrow);
	mattertagTitleShowChild4Childeniconfont1.addEventListener('click', function(e) {
		e.stopPropagation();
		$(this).hide();
		$(this).siblings('i').show();
		let audio = document.getElementById('audioPlaying');
		audio.pause();
	})
	mattertagTitleShowChild4Childeniconfont2.addEventListener('click', function(e) {
		e.stopPropagation();
		$(this).hide();
		$(this).siblings('i').show();
		let audio = document.getElementById('audioPlaying');
		audio.play();
	})
}
// render tags end -
// render Measure start +
//测量工具Start 20180914_Ning
var geometry = new THREE.PlaneBufferGeometry(100, 100, 1);
//var geometry = new THREE.BoxBufferGeometry(100, 100, 3);
var Measurematerial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0
});
var plane = new THREE.Mesh(geometry, Measurematerial);
plane.rotateX(1.56);
plane.position.y = 2.5;
var objects = [];
var one = true; //
var distance; //
//创建材质
var PI3 = Math.PI * 2;
var particleMaterials;
particleMaterials = new THREE.PointCloudMaterial({
	size: 20,
	vertexColors: true,
	color: 0xfaad18,
	transparent: true,
	opacity: 0
});
//用来保存鼠标坐标信息
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var particleA = new THREE.Sprite(particleMaterials); //
var particleB = new THREE.Sprite(particleMaterials); //
var intersects;
//标尺间线段
var geometry = new THREE.Geometry();
var material = new THREE.LineBasicMaterial({
	// vertexColors: THREE.VertexColors,
	linewidth: 10
});
var color1 = new THREE.Color(0xfaad18),
	color2 = new THREE.Color(0xfaad18);
//数组结构体
var LineObjects = [];
var LineSelet;
var PointA;
var PointB;
var textsprit;
var textspritGroup = [];
var ButtonSpritGroup = [];

function cubemesh(x, y, z) {
	// var sphereGeo = new THREE.BoxBufferGeometry(0.13, 0.13, 0.13);
	var sphereGeo = new THREE.SphereGeometry(0.1, 32, 32);
	// var sphereGeo2 = new THREE.BoxBufferGeometry(0.23, 0.1, 0.23);
	var sphereGeo2 = new THREE.SphereGeometry(0.13, 32, 32);
	var sphereMat = new THREE.MeshBasicMaterial({
		color: 0xffcc00
	});
	var sphereMat2 = new THREE.MeshBasicMaterial({
		color: 0xfa6218,
		transparent: true,
		opacity: 0.25
	});
	//创建网格模型
	var sphereMesh2 = new THREE.Mesh(sphereGeo, sphereMat);
	var sphereMesh3 = new THREE.Mesh(sphereGeo2, sphereMat2);
	//设置坐标
	sphereMesh2.position.set(x, y, z);
	sphereMesh3.position.set(x, y, z);
	//添加到场景
	scene.add(sphereMesh2);
	scene.add(sphereMesh3);
	var point = {};
	point.M2 = sphereMesh2;
	point.M3 = sphereMesh3;
	return point;
}
//MeasureUnchanged
var MeasurescaleVector = new THREE.Vector3();
// 定义新的标尺列表
// let NewRulerArr = [];

function initMeasure() {
	if (modelData.Ruler != undefined) {
		modelData.Ruler.forEach(function(object) {
			initMeasureGreat(object.point1, object.point2, object.icon);
		})
	}
}
// 初始渲染标尺功能
function initMeasureGreat(pointA, pointB, iconfont) {
	var LinePointOBJ = {};
	var particleA = new THREE.Sprite(particleMaterials);
	var particleB = new THREE.Sprite(particleMaterials);
	particleA.position.set(pointA.x, pointA.y, pointA.z);
	// console.log("particleA.position",particleA.position);
	particleA.scale.x = particleA.scale.y = 1;
	scene.add(particleA);
	PointA = cubemesh(particleA.position.x, particleA.position.y, particleA.position.z)
	var scale = MeasurescaleVector.subVectors(PointA.M2.position, pointerLockControl.getObject().position).length() / 20;
	PointA.M2.scale.set(scale, scale, scale);
	PointA.M3.scale.set(scale, scale, scale);
	particleB.position.set(pointB.x, pointB.y, pointB.z);
	// console.log("particleB.position",particleB.position);
	particleB.scale.x = particleB.scale.y = 1;
	scene.add(particleB);
	PointB = cubemesh(particleB.position.x, particleB.position.y, particleB.position.z);
	//计算距离
	distance = particleB.position.distanceTo(particleA.position);
	// console.log('距离', distance.toFixed(2));
	var geometry = new THREE.Geometry();
	geometry.vertices.push(particleA.position);
	geometry.vertices.push(particleB.position);
	geometry.colors.push(color1, color2);
	var line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
		color: 0xffaa00,
		dashSize: 3,
		gapSize: 1
	}));
	scene.add(line);
	textsprit = initSpritText((" " + distance.toFixed(2) + " M "), (particleA.position.x + particleB.position.x) / 2, (particleA.position.y + particleB.position.y) / 2 + 0.15, (particleA.position.z + particleB.position.z) / 2); //20180917celiang
	buttonSprit = initSpritButton(
		(particleA.position.x + particleB.position.x) / 2, (particleA.position.y + particleB.position.y) / 2 + 0.15, (particleA.position.z + particleB.position.z) / 2);
	LinePointOBJ.line = line;
	LinePointOBJ.point_1 = PointA;
	LinePointOBJ.point_2 = PointB;
	LinePointOBJ.textsprit = textsprit;
	LinePointOBJ.textsprit.name = distance.toFixed(2);
	LinePointOBJ.buttonSprit = buttonSprit;
	LinePointOBJ.buttonSprit.visible = false;
	textspritGroup.push(LinePointOBJ.textsprit);
	ButtonSpritGroup.push(LinePointOBJ.buttonSprit);
	// 把新的渲染的标尺保存到model.json 中
	// 保存到本地model.json开始 Ruler point_1起点，point_2终点
	let point1 = LinePointOBJ.point_1.M2.position;
	let point2 = LinePointOBJ.point_2.M2.position;
	let Distance = distance.toFixed(2);
	let id = LinePointOBJ.line.id;
	let icon = iconfont;
	LineObjects.push(LinePointOBJ);
}

function initSpritText(text, positionX, positionY, positionZ) {
	/* 原点 */
	let spriteOrigin = makeTextSprite(text, {
		fontsize: 25,
		borderColor: {
			r: 250,
			g: 173,
			b: 24,
			a: 0
		},
		/* 边框黑色 */
		backgroundColor: {
			r: 0,
			g: 0,
			b: 0,
			a: 0.85
		} /* 背景颜色 */
	});
	spriteOrigin.center = new THREE.Vector2(0.15, 0.85);
	scene.add(spriteOrigin);
	spriteOrigin.position.set(positionX, positionY, positionZ);
	return spriteOrigin;
}
/* 创建字体精灵 */
function makeTextSprite(message, parameters) {
	if (parameters === undefined) parameters = {};
	let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial,微软雅黑";
	/* 字体大小 */
	let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 12;
	/* 边框厚度 */
	let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 2;
	/* 边框颜色 */
	let borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
		r: 0,
		g: 0,
		b: 0,
		a: 1.0
	};
	/* 背景颜色 */
	let backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
		r: 255,
		g: 255,
		b: 255,
		a: 1.0
	};
	/* 创建画布 */
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	/* 字体加粗 */
	context.font = "Bold " + fontsize + "px " + fontface;
	/* 获取文字的大小数据，高度取决于文字的大小 */
	let metrics = context.measureText(message);
	let textWidth = metrics.width;
	/* 背景颜色 */
	context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
	/* 边框的颜色 */
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
	context.lineWidth = borderThickness;
	/* 绘制圆角矩形 */
	roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	/* 字体颜色 */
	context.fillStyle = "rgba(255, 255, 255, 1.0)";
	context.fillText(message, borderThickness, fontsize + borderThickness);
	/* 画布内容用于纹理贴图 */
	let texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	let spriteMaterial = new THREE.SpriteMaterial({
		map: texture
	});
	let sprite = new THREE.Sprite(spriteMaterial);
	// console.log(sprite.spriteMaterial);
	/* 缩放比例 */
	sprite.scale.set(4, 2, 0);
	return sprite;
}
/* 绘制圆角矩形 */
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function initSpritButton(positionX, positionY, positionZ) {
	/*1、创建画布*/
	let canvas = document.createElement("canvas");
	canvas.width = 120;
	canvas.height = 120;
	/*2、创建图形*/
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ff0000";
	ctx.arc(50, 50, 50, 0, 2 * Math.PI);
	ctx.fill();
	/*3、将canvas作为纹理，创建Sprite*/
	let texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	let material = new THREE.SpriteMaterial({
		map: texture,
		map: THREE.ImageUtils.loadTexture('image/Measure_Btn.png')
	});
	let mesh = new THREE.Sprite(material);
	mesh.scale.set(1.2, 1.2, 1.2);
	mesh.center = new THREE.Vector2(0.45, 0.98);
	scene.add(mesh);
	mesh.position.set(positionX, positionY, positionZ);
	return mesh;
}
//测量工具End 20180914_Ning
// render Measure end -



// render Label start +

var LablePlaneobjects = [];
var geometryplane = new THREE.PlaneBufferGeometry(100, 100, 1);
var materialplane = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0
});
var plane2 = new THREE.Mesh(geometryplane, materialplane);
plane2.rotateX(1.56);
plane2.position.y = 2.5;

var LableParticle;
var LableSprit;
var LabelGroup = [];
var saveId;
var LabelRound;



function initLabel() {
	if (modelData.Label != undefined) {
		modelData.Label.forEach(function(object) {
			//console.log("object.position", object.position, "object.content", object.content);
			initLabelGreat(object.position, object.content);
		})
	} else {
		console.log('modelData.Label is empty');
	}
}

function initLabelGreat(pos, name) {
	LableSprit = initSpritLabelText((" " + name + " "), pos.x, pos.y, pos.z);
	LabelGroup.push(LableSprit);
	LableSprit.visible = false;
	LableSprit.name = name;
	// 推入列表中
	saveId = LableSprit.id;
}

function makeTextSprite3(message, parameters) {

	if (parameters === undefined) parameters = {};

	let fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial,微软雅黑";

	/* 字体大小 */
	let fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 20;

	/* 边框厚度 */
	let borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 2;

	/* 边框颜色 */
	let borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : {
			r: 0,
			g: 0,
			b: 0,
			a: 1.0
		};

	/* 背景颜色 */
	let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : {
			r: 255,
			g: 255,
			b: 255,
			a: 1.0
		};

	/* 创建画布 */
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');

	/* 字体加粗 */
	context.font = "normal " + fontsize + "px " + fontface;

	/* 获取文字的大小数据，高度取决于文字的大小 */
	let metrics = context.measureText(message);
	let textWidth = metrics.width;

	/* 背景颜色 */
	context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," +
		backgroundColor.b + "," + backgroundColor.a + ")";

	/* 边框的颜色 */
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," +
		borderColor.b + "," + borderColor.a + ")";
	context.lineWidth = borderThickness;

	/* 绘制圆角矩形 */
	roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);

	/* 字体颜色 */
	context.fillStyle = "rgba(255, 255, 255, 1.0)";
	context.fillText(message, borderThickness, fontsize + borderThickness);

	/* 画布内容用于纹理贴图 */
	let texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;

	let spriteMaterial = new THREE.SpriteMaterial({
		map: texture
	});
	let sprite = new THREE.Sprite(spriteMaterial);

	// console.log(sprite.spriteMaterial);

	/* 缩放比例 */
	sprite.scale.set(5, 2.5, 0);

	return sprite;

}

function initSpritLabelText(text, positionX, positionY, positionZ) {
	/* 原点 */
	let spriteOrigin = makeTextSprite(text, {
		fontsize: 50,
		borderColor: {
			r: 250,
			g: 173,
			b: 24,
			a: 0
		},
		/* 边框黑色 */
		backgroundColor: {
			r: 0,
			g: 0,
			b: 0,
			a: 0.2
		} /* 背景颜色 */
	});
	spriteOrigin.center = new THREE.Vector2(0.15, 0.85);
	scene.add(spriteOrigin);
	spriteOrigin.position.set(positionX, positionY, positionZ);
	return spriteOrigin;
}

//隐藏Label
function HiddenLabel(a) {
	LabelGroup.forEach(function(object) {
		object.visible = a;
	})
}

// render Label end -


//MeasureUnchanged
var MeasurescaleVector = new THREE.Vector3();

function MeasureZoom() {

	LineObjects.forEach(function(LinePointOBJ) {
		var scaleFactor = 20;
		var sprite1 = LinePointOBJ.point_1.M2;
		var sprite2 = LinePointOBJ.point_1.M3;
		var sprite3 = LinePointOBJ.point_2.M2;
		var sprite4 = LinePointOBJ.point_2.M3;
		var spritetext = LinePointOBJ.textsprit;
		var spritButton = LinePointOBJ.buttonSprit;
		if (modeSwitch != undefined) {
			if (modeSwitch.isWalkingMode()) {
				var scale = MeasurescaleVector.subVectors(LinePointOBJ.textsprit.position, pointerLockControl.getObject().position).length() / scaleFactor;
			} else if (modeSwitch.isOrthographic()) {
				// var scale = 1.64 / orthoCamera.zoom;
				var scale = (orthoCamera.position.y * 0.05) / orthoCamera.zoom;
			} else if (modeSwitch.isOverallMode()) {
				var scale = MeasurescaleVector.subVectors(LinePointOBJ.textsprit.position, orbitCamera.position).length() / scaleFactor;
			}
		}
		sprite1.scale.set(scale, scale, scale);
		sprite2.scale.set(scale, scale, scale);
		sprite3.scale.set(scale, scale, scale);
		sprite4.scale.set(scale, scale, scale);
		spritetext.scale.set(4 * scale, 2 * scale, 0);
		spritButton.scale.set(1.2 * scale, 1.2 * scale, 0);
	});

}

//spritUnchanged

var scaleVector = new THREE.Vector3();

function AnimateZoom() {

	TagObjects.forEach(function(TagObject) {
		if (TagObject != null) {
			var scaleFactor = 2.5;
			var sprite = TagObject.TagGroup;
			if (modeSwitch != undefined) {
				if (modeSwitch.isWalkingMode()) {
					var scale = scaleVector.subVectors(TagObject.TagGroup.position, pointerLockControl.getObject().position).length() / scaleFactor;
				} else if (modeSwitch.isOrthographic()) {
					var scale = (orthoCamera.position.y * 0.4) / orthoCamera.zoom;
				} else if (modeSwitch.isOverallMode()) {
					var scale = scaleVector.subVectors(TagObject.TagGroup.position, orbitCamera.position).length() / scaleFactor;
				}
			}
			sprite.scale.set(scale, scale, 1);
		}

	});
}

var LabelscaleVector = new THREE.Vector3();

function LabelZoom() {

	LabelGroup.forEach(function(TagObject) {
		if (TagObject != null) {
			if (modeSwitch != undefined) {
				if (modeSwitch.isOrthographic()) {
					var scale = (orthoCamera.position.y * 0.25) / orthoCamera.zoom;
					TagObject.scale.set(scale, scale * 0.5, 1);
				}
			}
		}

	});
}


//------------摸墙效果------------
var mainCanvas = document.querySelector("canvas");

//创建原点
var geometry_touch = new THREE.CircleBufferGeometry(0.01, 32);

//放置后的材质
var material_touch = new THREE.MeshBasicMaterial({
	color: 0xcccccc,
	transparent: true,
	opacity: 0.9,
	depthTest: false,
	map: THREE.ImageUtils.loadTexture('image/point1.png')
});

//移动中的模型
var Dynamic_touch = new THREE.Mesh(geometry_touch, material_touch);
//注册摸墙效果
if (/Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)) {
	
} else {
	
	mainCanvas.addEventListener('mousemove', onDocumentDynamic_touch, false);
	
}


//注册选中标签
mainCanvas.addEventListener('mouseup', onDocumentMouseupTag, false);
mainCanvas.addEventListener('mousedown', onDocumentMousedwonMeasure, false);
	scene.add(Dynamic_touch); //创建大饼


function TagMove_Anytime() {
	if (TagSelet != undefined) {
		if (TagObjects[TagSelet] != null) {
			MoveTagDiv(TagObjects[TagSelet].TagGroup.children[2]);
		}
	}
}

function onDocumentDynamic_Anytime() {
	//第一人称时的摸墙
	if (!model) return;
	if (modeSwitch.isWalkingMode()) {
		raycaster.setFromCamera(mouse, pointerLockCamera);
		intersects = raycaster.intersectObjects(model.children);

		if (intersects.length > 0) {

			var LinePointOBJ = {};

			var n = intersects[0].face.normal.clone();
			n.transformDirection(model.matrixWorld);
			n.multiplyScalar(10);
			n.add(intersects[0].point);

			Dynamic_touch.position.copy(intersects[0].point);
			Dynamic_touch.scale.x = Dynamic_touch.scale.y = 10;

			Dynamic_touch.lookAt(n);

		}
	}
	//3D视角时的摸墙
	if (modeSwitch.isOrthographic()) {
		raycaster.setFromCamera(mouse, orthoCamera);
		intersects = raycaster.intersectObjects(model.children);

		if (intersects.length > 0) {

			var LinePointOBJ = {};

			var n = intersects[0].face.normal.clone();
			n.transformDirection(model.matrixWorld);
			n.multiplyScalar(10);
			n.add(intersects[0].point);

			Dynamic_touch.position.copy(intersects[0].point);
			Dynamic_touch.scale.x = Dynamic_touch.scale.y = 10;

			Dynamic_touch.lookAt(n);

		}
	}
	//2D视角时的摸墙
	if (modeSwitch.isOverallMode()) {
		raycaster.setFromCamera(mouse, orbitCamera);
		intersects = raycaster.intersectObjects(model.children);

		if (intersects.length > 0) {

			var LinePointOBJ = {};

			var n = intersects[0].face.normal.clone();
			n.transformDirection(model.matrixWorld);
			n.multiplyScalar(10);
			n.add(intersects[0].point);

			Dynamic_touch.position.copy(intersects[0].point);
			Dynamic_touch.scale.x = Dynamic_touch.scale.y = 10;

			Dynamic_touch.lookAt(n);

		}
	}
}
//摸墙效果持续执行End

function onDocumentDynamic_touch(event) {
	if (event.button == 0) {

		//恢复可以移动到下一个点；
		TagControlWalk = true;

		//获取鼠标的x，y坐标
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
		mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;
		if (modeSwitch != undefined) {
			if (modeSwitch.isWalkingMode()) {
				raycaster.setFromCamera(mouse, pointerLockCamera);
				intersects = raycaster.intersectObjects(model.children);


				if (intersects.length > 0) {

					var LinePointOBJ = {};

					var n = intersects[0].face.normal.clone();
					n.transformDirection(model.matrixWorld);
					n.multiplyScalar(10);
					n.add(intersects[0].point);

					Dynamic_touch.position.copy(intersects[0].point);
					Dynamic_touch.scale.x = Dynamic_touch.scale.y = 10;

					Dynamic_touch.lookAt(n);

				}
			}
		}
	}

}

//------------摸墙效果END------------

//移动divtag
function MoveTagDiv(obj) {
	//创建一个3D坐标
	var vector = new THREE.Vector3();
	if (modeSwitch != undefined) {
		if (modeSwitch.isWalkingMode()) {
			vector = vector.setFromMatrixPosition(obj.matrixWorld).project(pointerLockCamera);
		} else if (modeSwitch.isOrthographic()) {
			vector = vector.setFromMatrixPosition(obj.matrixWorld).project(orthoCamera);
		} else if (modeSwitch.isOverallMode()) {
			vector = vector.setFromMatrixPosition(obj.matrixWorld).project(orbitCamera);
		}
	}
	var halfWidth = window.innerWidth / 2;
	var halfHeight = window.innerHeight / 2;
	// console.log(vector.x * halfWidth + halfWidth)
	var result = {
		x: Math.round(vector.x * halfWidth + halfWidth),
		y: Math.round(-vector.y * halfHeight + halfHeight)
	};
	//2D坐标

	// console.log("vector", vector.z)
	if (vector.z < -1 || vector.z > 1) {
		document.getElementById("tagmove").style.opacity = 0;
		document.getElementById("tagmoveArrow").style.opacity = 0;
	} else {
		document.getElementById("tagmove").style.opacity = 1;
		document.getElementById("tagmoveArrow").style.opacity = 1;
	}

	var div = document.getElementById("tagmove");
	var tagmoveArrow = document.getElementById("tagmoveArrow");
	div.style.left = (result.x + 25) + "px";
	div.style.top = (result.y - 40) + "px";
	tagmoveArrow.style.left = (result.x + 25) + "px";
	tagmoveArrow.style.top = (result.y - 50) + "px";
}

//选中场景中的tag
function onDocumentMouseupTag(event) {
	if (event.button == 0) {

		if (!isDrag) {

			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
			mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

			var raycaster = new THREE.Raycaster();
			if (modeSwitch != undefined) {
				if (modeSwitch.isWalkingMode()) {
					raycaster.setFromCamera(mouse, pointerLockCamera);
					var octreeObjects = tagobjectsArray;
					intersects = raycaster.intersectObjects(octreeObjects);
				} else if (modeSwitch.isOrthographic()) {
					raycaster.setFromCamera(mouse, orthoCamera);
					var octreeObjects = tagobjectsArray;
					intersects = raycaster.intersectObjects(octreeObjects);
				} else if (modeSwitch.isOverallMode()) {
					raycaster.setFromCamera(mouse, orbitCamera);
					var octreeObjects = tagobjectsArray;
					intersects = raycaster.intersectObjects(octreeObjects);
				}
			}
			if (intersects.length > 0) {

				//CanvasState = false;
				//不让场景移动到下一个点,修改main.JS TagControlWalk值；
				TagControlWalk = false;

				var LinePointOBJ = {};
				TagSelet = intersects[0].object.parent.name;

				const captionShow = TagObjects[TagSelet].title;
				const substanceShow = TagObjects[TagSelet].content;
				const colorShow = intersects[0].object.parent.children[2].name;
				const distanceShow = intersects[0].object.parent.children[1].name;
				// console.log(intersects[0].object.parent.children[1].visible);
				const Resources = TagObjects[TagSelet].Resources

				const lineShow = intersects[0].object.parent.children[1].visible;
				const markShow = true;

				MoveTagDiv(TagObjects[TagSelet].TagGroup.children[2]);

				TagDivContentSet(TagObjects[TagSelet]);
				TagDivvisible(true); //显示标签
				if (modeSwitch.isWalkingMode()) {
					goTagPoint(TagObjects[TagSelet]);
				}

				$('.title-box>textarea').val(captionShow);
				$('.content-box>textarea').val(substanceShow);
				$('.color-radius>p').removeClass('active');
				$('.color-radius>p[data-value=' + colorShow + ']').addClass('active');
				$('.heightAdjustment').val(distanceShow);
				$('.Media-box>input').val(Resources);
				// 开关
				if (!lineShow) {
					$('.ShowCase>ul>li[data-index=2]>label').removeClass('active active1')
				} else {
					$('.ShowCase>ul>li[data-index=2]>label').addClass('active active1')
				}
				if (!markShow) {
					$('.ShowCase>ul>li[data-index=1]>label').removeClass('active active1')
				} else {
					$('.ShowCase>ul>li[data-index=1]>label').addClass('active active1')
				}

				//弹出设置面板
				// popEdit('mattertagBoard');
				// translateNav();
				$(".nav-icon-right-list").addClass('active');

			}

		}

	}
}

function TagDivContentSet(structural) {
	var divtitle = document.getElementsByClassName("Child1-title");
	var divContent = document.getElementsByClassName("Child2-content");
	// console.log("title", structural.title, "structural", structural);
	divtitle[0].innerHTML = structural.title;
	divContent[0].innerHTML = structural.content;
	// console.log(structural.Marker)
	$('.Child3-Resources').children().hide();
	$('.audioPlay').hide();
	if (!structural.Marker) {
		// 没有东西
	} else if (structural.Marker == 'img') {
		$('.Child3-Resources').show();
		$('.Child3-Resources>img').attr('src', structural.Resources).css({
			'display': 'block'
		})
	} else if (structural.Marker == 'iframe') {
		$('.Child3-Resources').show();
		$('.Child3-Resources>iframe').attr('src', structural.Resources).css({
			'display': 'block'
		})
	} else if (structural.Marker == 'audio') {
		$('.audioPlay').show()
		$('.audioPlay>audio').attr('src', structural.Resources);
	} else if (structural.Marker == 'video') {
		$('.Child3-Resources').show();
		$('#videoPlaying').show().attr('src', structural.Resources);
	}
}

//Move to tag location

function goTagPoint(structural) {

	if (modeSwitch.isWalkingMode()) {

		model.visible = true;

		mousePoint = structural.TagGroup.position.clone();

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

		//console.log("minMouseDist", minMouseDist);

		if (minMouseIndex != -1) {

			//textureManager.loadTexture(minMouseIndex, true)
			//console.log("structural.TagGroup.position", structural.TagGroup.position);
			//console.log("viewPoint[minMouseIndex].Quaternion", viewPoint[minMouseIndex]);
			GOPoint = new THREE.Vector3(structural.TagGroup.position.x - viewPoint[minMouseIndex].x, structural.TagGroup.position.y - viewPoint[minMouseIndex].y, structural.TagGroup.position.z - viewPoint[minMouseIndex].z);
			//console.log("B-A", GOPoint);
			//GOPoint.Nor
			GOPoint.normalize();

			var q = new THREE.Quaternion();
			//THREE.Quaternion();
			// q.setFromUnitVectors(pointerLockCamera.getWorldDirection(), GOPoint);
			// q.setFromUnitVectors(new THREE.Vector3(-0.01, -0.27, -0.96), GOPoint);
			q.setFromUnitVectors(new THREE.Vector3(0, 0, -1), GOPoint);
			// console.log("pointerLockCamera.getWorldDirection()", pointerLockCamera.getWorldDirection());
			moveTagVisible = false; //移动时不隐藏
			setWalkingViewPoint(minMouseIndex, q);
			// console.log("q",q);

			//LookAtTag(structural);

		}
	}
}


function TagsVisible(a) {
	TagObjects.forEach(function(object) {
		object.TagGroup.visible = a;
	})

	TagDivvisible(a);
}

//Label visibility
function TagDivvisible(visible) {
	var div = document.getElementById("tagmove");
	let Arrow = document.getElementById("tagmoveArrow");
	if (visible) {
		div.style.display = "block";
		Arrow.style.display = "block";
		$('#tagmove').animate({
			opacity: '1'
		}, 500)

		$('#tagmoveArrow').animate({
			opacity: '1'
		}, 500)
	} else {

		$('#tagmove').animate({
			opacity: '0'
		}, 500, function() {
			div.style.display = "none";
		})

		$('#tagmoveArrow').animate({
			opacity: '0'
		}, 500, function() {
			Arrow.style.display = "none";
		})

	}
}

function setDragTrue() {
	isDrag = true;
}

function onDocumentMousedwonMeasure(event) {
	isDrag = false;
	//延迟200ms
	timmerHandle = setTimeout(setDragTrue, 200);
}

initzoom();

function TouchTheWall() {
	//摸墙效果持续执行
	if (/Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)) {} else {
		onDocumentDynamic_Anytime();
	}
	TagMove_Anytime();
}

function initzoom() {
	TouchTheWall();
	MeasureZoom();
	AnimateZoom();
	LabelZoom();
	// var timerMeasureZoom = setInterval(MeasureZoom, 10);
	// var timerAnimateZoom = setInterval(AnimateZoom, 10);
	// var timerLabelZoom = setInterval(LabelZoom, 10);

}
// intiMiniMap();
// animatemap();

//MiniMAP
var container3,
	camera3,
	scene3,
	renderer3,
	axes2,
	CANVAS_WIDTH = 200,
	CANVAS_HEIGHT = 200,
	CAM_DISTANCE = 300,
	navmesh;

function intiMiniMap() {
	if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) { //20181018ning 设备判断
		console.log("移动设备");
		$('#inset').css('bottom', '');
		$('#inset').css('top', '52px');
		$('#inset').css('width', '200px');
		$('#inset').css('height', '200px');
		$('#minimap').css('width', '200px');
		$('#minimap').css('height', '200px');
		$('#minimap').css('background-size', '200px 200px');
		$('#minimap').css('background-repeat', 'no-repeat');
		// $('#inset p').text('面积 约 700 ㎡');

		CANVAS_WIDTH = 200;
		CANVAS_HEIGHT = 200;
	} else {
		$('#minimap').css('background-size', '200px 200px');
	}
	// dom
	container3 = document.getElementById('inset');

	// renderer
	renderer3 = new THREE.WebGLRenderer({
		alpha: true
	});
	renderer3.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
	container3.appendChild(renderer3.domElement);

	//设置背景颜色为none
	renderer3.setClearColor(0x000000, 0)

	// scene
	scene3 = new THREE.Scene();

	// camera
	var aspect3 = CANVAS_WIDTH / CANVAS_HEIGHT;
	camera3 = new THREE.OrthographicCamera(-aspect3, aspect3, 1, -1, 0.5, 5000);

	scene3.add(camera3);
	scene3.add(modelMiniMap);
	modelMiniMap.rotateX(Math.PI * 0.5);
	modelMiniMap.rotateZ(Math.PI * 0.5);
	navmesh = createNav();
	scene3.add(navmesh);
	modelMiniMap.visible = false;
	// modelMiniMap.children[0].material.transparent = true;
	// modelMiniMap.children[0].material.opacity = 1;
	// console.log("modelMiniMap", modelMiniMap.children[0].material.opacity);
	//load户型图
	$('#minimap').css('background-image', 'url(' + rootPath + 'Map.png)');

	if (modelData.DefaultMiniMap != undefined) {
		var data = modelData.DefaultMiniMap[0];
		loadModelDataMiniMap(data);
	}

	DefaultPoint(); //初始化默认视角；
}

// animate
// -----------------------------------------------
function rendermap() {
	renderer3.render(scene3, camera3);
}

var transmit_Zoom,
transmit_Rotation,
transmit_Position,
transmit_PngRotation;

function loadModelDataMiniMap(data){
	transmit_Zoom = parseFloat(data.zoom);
	transmit_Rotation = new THREE.Vector3(0, 0, parseFloat(data.R_z));
	transmit_Position = new THREE.Vector3(parseFloat(data.P_x), parseFloat(data.P_y), parseFloat(data.P_z));
	transmit_PngRotation = parseFloat(data.Nav_r);//20190326Ning NAVbug修复

	$('#inset p').text(data.Acreage);

	animatemap();
	CenterSet2D();

}

function animatemap() {

	requestAnimationFrame(animatemap);

	// if (modeSwitch.isWalkingMode()) {
	camera3.zoom = transmit_Zoom;
	// } else {
	// camera3.zoom = 1;
	// }

	camera3.lookAt(scene3.position);
	camera3.updateProjectionMatrix();
	camera3.rotation.set(transmit_Rotation.x, transmit_Rotation.y, transmit_Rotation.z);
	navmesh.position.set(pointerLockControl.getObject().position.z, pointerLockControl.getObject().position.x, pointerLockControl.getObject().position.y);
	navmesh.material.rotation = pointerLockControl.getObject().rotation.y + transmit_PngRotation;
	rendermap();

}

//2Dposition
function CenterSet2D() {
	var centerPoint_y = (CANVAS_WIDTH - modelmaxY) / 2 + modelmaxY / 2;
	var centerPoint_x = (CANVAS_HEIGHT - modelmaxX) / 2 + modelmaxX / 2;
	camera3.position.set(transmit_Position.x, transmit_Position.y, transmit_Position.z);
}

function createNav() {
	/*1、创建画布*/
	let canvas = document.createElement("canvas");
	canvas.width = 120;
	canvas.height = 120;
	/*2、创建图形*/
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ff0000";
	ctx.arc(50, 50, 50, 0, 2 * Math.PI);
	ctx.fill();
	/*3、将canvas作为纹理，创建Sprite*/
	let texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	let material = new THREE.SpriteMaterial({
		map: texture,
		map: THREE.ImageUtils.loadTexture('image/MapNav.png')
	});
	let mesh = new THREE.Sprite(material);
	mesh.scale.set(10, 10, 10);
	return mesh;
}

function visibleNav(a) {
	if (a) {
		$('#inset').css('display', 'block');
	} else {
		$('#inset').css('display', 'none');
	}

}
visibleNav(true);
//MiniMAP end

//入戶門

var EntranceGroup = new THREE.Group();
var ButtonEntranceGroup = [];

var EntranceMOD = createEntrance();
var EntranceText;
// var EntranceText = EntranceButton();

function initSpritText3(text, positionX, positionY, positionZ) {
	/* 原点 */
	let spriteOrigin = makeTextSprite(text, {
		fontsize: 25,
		borderColor: {
			r: 250,
			g: 173,
			b: 24,
			a: 0
		},
		/* 边框黑色 */
		backgroundColor: {
			r: 0,
			g: 0,
			b: 0,
			a: 0.15
		} /* 背景颜色 */
	});
	spriteOrigin.center = new THREE.Vector2(0.15, 0.85);
	scene.add(spriteOrigin);
	spriteOrigin.position.set(positionX, positionY, positionZ);
	return spriteOrigin;
}

function initDefaultPointDoor() {
	if (modelData.DefaultPointDoor != undefined) {

		EntranceGroup.rotateX(1.56); //Default Unchanged
		// EntranceGroup.rotateZ(-1.56); //R
		EntranceGroup.rotateZ(modelData.DefaultPointDoor[0].r);

		// EntranceGroup.position.y = -1.5; //Height
		// EntranceGroup.position.x = -1;
		// EntranceGroup.position.z = -5.3;
		EntranceGroup.position.y = modelData.DefaultPointDoor[0].y; //Height
		EntranceGroup.position.x = modelData.DefaultPointDoor[0].x;
		EntranceGroup.position.z = modelData.DefaultPointDoor[0].z;

		EntranceText = initSpritText3(" 入户门 ", 2.5, 0, 0);
		// console.log("EntranceText", EntranceText);
		//backgroundColor
		scene.add(EntranceGroup);
		scene.add(EntranceMOD);

		EntranceGroup.add(EntranceMOD);
		EntranceGroup.add(EntranceText);

		ButtonEntranceGroup.push(EntranceMOD);
		ButtonEntranceGroup.push(EntranceText);
	}
}



var TimerAnimateEntrance = setInterval(AnimateEntrance, 250);

var AnimationNum = 0;
// console.log(EntranceMOD);
function AnimateEntrance() {
	if (AnimationNum == 4) {
		AnimationNum = 0;
	}

	EntranceMOD.material.map.matrix
		.identity() //矩阵重置
		.translate(0, 0) //设置中心点
		.rotate(0) // 旋转
		.scale(1, 0.25) //缩放
		.translate(0, AnimationNum * 0.25) //设置中心点
	// .translate(0, 0); //偏移
	AnimationNum += 1;
}

function createEntrance() {
	//加载纹理
	var loader = new THREE.TextureLoader();
	var texture = loader.load('image/Entrance.png', function() {}, undefined, function() {});
	texture.matrixAutoUpdate = false;

	var materialplane = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 1,
		//将贴图赋于材质
		map: texture
	});

	var geometryplane = new THREE.PlaneBufferGeometry(2.5, 1, 1);
	var plane2 = new THREE.Mesh(geometryplane, materialplane);

	materialplane.map.matrix
		.identity() //矩阵重置
		.translate(0, 0) //设置中心点
		.rotate(0) // 旋转
		.scale(1, 0.25) //缩放
		.translate(0, 0.25) //设置中心点
		.translate(0, 0); //偏移

	return plane2;
}

var timerEntranceTextZoom = setInterval(EntranceTextZoom, 10);
var EntranceTextVector = new THREE.Vector3();

function PlayTimerAnimateEntrance() {
	TimerAnimateEntrance = setInterval(AnimateEntrance, 250);
	timerEntranceTextZoom = setInterval(EntranceTextZoom, 10);
}

function StopTimerAnimateEntrance() {
	clearInterval(TimerAnimateEntrance);
	clearInterval(timerEntranceTextZoom);
}

function EntranceTextZoom() {
	if (modelData != undefined) {
		if (modelData.DefaultPointDoor != undefined) {
			var scaleFactor = 20;
			if (modeSwitch != undefined) {
				if (modeSwitch.isWalkingMode()) {
					var scale = EntranceTextVector.subVectors(EntranceText.position, pointerLockControl.getObject().position).length() / scaleFactor;
				} else if (modeSwitch.isOrthographic()) {
					// var scale = 1.64 / orthoCamera.zoom;
					var scale = (orthoCamera.position.y * 0.05) / orthoCamera.zoom;
				} else if (modeSwitch.isOverallMode()) {
					var scale = EntranceTextVector.subVectors(EntranceText.position, orbitCamera.position).length() / scaleFactor;
				}

				EntranceText.scale.set(4 * scale, 2 * scale, 0);
			}
		}
	}

}

//Entry button enters default point
mainCanvas.addEventListener('mousedown', onDocumentEntranceButton, false);

function onDocumentEntranceButton(event) {

	if (event.button == 0) {

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
		mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

		var raycaster = new THREE.Raycaster();

		if (modeSwitch != undefined) {

			if (modeSwitch.isOrthographic()) {
				raycaster.setFromCamera(mouse, orthoCamera);
				intersects = raycaster.intersectObjects(ButtonEntranceGroup);
				console.log("intersects", intersects);
				if (intersects.length > 0) {

					// console.log("TagControlWalk", TagControlWalk);
					if (modelData.DefaultPointDoor == undefined) {
						return false;
					} else {
						TagControlWalk = false;
						setWalkingViewPoint(modelData.DefaultPointDoor[0].DefaultPointDoorNum);
					}

				}

			} else if (modeSwitch.isOverallMode()) {
				raycaster.setFromCamera(mouse, orbitCamera);
				intersects = raycaster.intersectObjects(ButtonEntranceGroup);

				if (intersects.length > 0) {

					// console.log("TagControlWalk", TagControlWalk);
					if (modelData.DefaultPointDoor == undefined) {
						return false;
					} else {
						TagControlWalk = false;
						setWalkingViewPoint(modelData.DefaultPointDoor[0].DefaultPointDoorNum);
					}
				}

			}
		}

	}
}

//入戶門END

//2D户型图

var DrawingObjects = [];
var PlanesSize_h,
	PlanesSize_w,
	PlanesRotate_z,
	Planes_Position = new THREE.Vector3(0, 0, 0),
	plane2Dmap;

function init_ApartmentMap() {
	if (modelData.ApartmentMap != undefined) {

		// PlanesSize_h = modelData.ApartmentMap[0].height;
		// PlanesSize_w = modelData.ApartmentMap[0].width;
		// PlanesRotate_z = modelData.ApartmentMap[0].rotate;
		// Planes_Position = new THREE.Vector3(modelData.ApartmentMap[0].P_x, modelData.ApartmentMap[0].P_y, modelData.ApartmentMap[0].P_z);
		// console.log("initmap");
		// scene.add(createDrawing());
		// displayDrawing(false);
	}
}

function displayDrawing(a) {
  //用divPNG代替 mesh户型图显示 先屏蔽20190326_Ning
  if (a) {
//     setTimeout(function () {
//       if (DrawingObjects[0] != undefined) {
//         DrawingObjects[0].visible = a;
//       }

//       if (model.children[0].material != undefined) {
//         model.children[0].material.transparent = true;
//         model.children[0].material.opacity = 0.1;
//       } else {
        model.visible = !a;
        quadArray.forEach(function(v){  
	    	v.material.visible =  !a;
		})
//       }

//     }, 1000);

  } else {
//     if (DrawingObjects[0] != undefined) {
//       DrawingObjects[0].visible = a;
//     }
//     if (model.children[0].material != undefined) {
//       model.children[0].material.transparent = false;
//       model.children[0].material.opacity = 1;
//     } else {
    	model.visible = !a;
    	quadArray.forEach(function(v){  
	    	v.material.visible =  !a;
		})
//     }
  }
}

function createDrawing() {

	//加载纹理
	var loader = new THREE.TextureLoader();
	var texture = loader.load(rootPath + 'Map_B.png', function() {}, undefined, function() {});

	var materialplane = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 1,
		//将贴图赋于材质
		map: texture
	});

	var geometryplane = new THREE.PlaneBufferGeometry(1, 1, 1); //Size
	plane2Dmap = new THREE.Mesh(geometryplane, materialplane);
	plane2Dmap.scale.set(PlanesSize_h, PlanesSize_w, 1);
	plane2Dmap.rotateX(-Math.PI * 0.5);

	plane2Dmap.rotateZ(PlanesRotate_z); //Rotation
	plane2Dmap.position.set(Planes_Position.x, Planes_Position.y, Planes_Position.z); //Position
	DrawingObjects.push(plane2Dmap);

	return plane2Dmap;
}
// //2D户型图END

//WEBVR
var config = {};
// var polyfill = new WebVRPolyfill(config);

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.2, 5000);

// Create a reticle
var reticle = new THREE.Mesh(
	new THREE.RingBufferGeometry(0.005, 0.01, 15),
	new THREE.MeshBasicMaterial({
		color: 0xffffff
	})
);
reticle.position.z = -0.5;
camera.add(reticle);

// Apply VR stereo rendering to renderer.
// var effect = new THREE.VREffect(renderer);
// effect.setSize(container.clientWidth, container.clientHeight, false);
// var vrDisplay, controlsVR;
//
// navigator.getVRDisplays().then(function(vrDisplays) {
// 	// If we have a native display, or we have a CardboardVRDisplay
// 	// from the polyfill, use it
// 	if (vrDisplays.length) {
// 		vrDisplay = vrDisplays[0];
// 		// Apply VR headset positional data to camera.
// 		controlsVR = new THREE.VRControls(camera);
// 		// Kick off the render loop.
// 		vrDisplay.requestAnimationFrame(animateVR);
// 	}
// 	// Otherwise, we're on a desktop environment with no native
// 	// displays, so provide controls for a monoscopic desktop view
// 	else {
// 		controlsVR = new THREE.OrbitControls(camera);
// 	}
// });
// // Request animation frame loop function
// var lastRender = 0;
//
// function animateVR(timestamp) {
// 	lastRender = timestamp;
// 	// Update VR headset position and apply to camera.
// 	controlsVR.update();
// 	// Render the scene.
// 	// effect.render(scene, cameraController.getCurrentCamera());
// 	try {
// 		effect.render(scene, cameraController.getCurrentCamera());
// 	} catch (err) {
// 		console.log(err)
// 	}
// 	// Keep looping; if using a VRDisplay, call its requestAnimationFrame,
// 	// otherwise call window.requestAnimationFrame.
// 	if (vrDisplay) {
// 		vrDisplay.requestAnimationFrame(animateVR);
// 	} else {
// 		requestAnimationFrame(animateVR);
// 	}
// }

function onResize() {
	// The delay ensures the browser has a chance to layout
	// the page and update the clientWidth/clientHeight.
	// This problem particularly crops up under iOS.
	if (!onResize.resizeDelay) {
		onResize.resizeDelay = setTimeout(function() {
			onResize.resizeDelay = null;
			console.log('Resizing to %s x %s.', renderer.clientWidth, renderer.clientHeight);
			effect.setSize(renderer.clientWidth, renderer.clientHeight, false);
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}, 250);
	}
}

var vrStatus = true;
function onVRDisplayPresentChange() {
	console.log('onVRDisplayPresentChange');
	vrHide(vrStatus);
	onResize();
	vrStatus = !vrStatus;
	if($('.js-slide-area').css('display')){
		$('.menu').hide();
	}
}

function onVRDisplayConnect(e) {
	console.log('onVRDisplayConnect', (e.display || (e.detail && e.detail.display)));
}
// Resize the WebGL canvas when we resize and also when we change modes.
window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
window.addEventListener('vrdisplayconnect', onVRDisplayConnect);

$('.js-vrpanorama').click(function(e) {
	vrDisplay.requestPresent([{
		source: renderer.domElement
	}]);
	visibleNav(false); //Hidden map
})

function enterFullscreen(el) {
	if (el.requestFullscreen) {
		el.requestFullscreen();
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	} else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	}
}

//VR模式打开隐藏DIV
function vrHide(staus) {
	if(staus){
		$('.titlebar-text').hide();
		$('#views').hide();
		$('#inset').hide();
		$('#mianji').hide();
		$('.pinBottom-container').hide();
		$('.menu').hide();
	} else {
		$('.titlebar-text').show();
		$('#views').show();
		$('#inset').show();
		$('#mianji').show();
		$('.pinBottom-container').show();
		$('.menu').show();
	}
}

// //WEBVR END

slider();
initTag();
initMeasure();
initLabel();
initDefaultPointDoor();
//Initial hidden ruler
HiddenMeasure();
HiddenMeasure2D();