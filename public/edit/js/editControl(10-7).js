$(function() {

  var mattertag;

  setTimeout(function() {
    testModelData();
  }, 0)

  // 检测modelData.json
  function testModelData() {
    if (modelData.titleShow == undefined) {
      modelData.titleShow = true;
    }
    if (modelData.playShow == undefined) {
      modelData.playShow = true;
    }
    if (modelData.Perspective == undefined) {
      modelData.Perspective = true;
    }
    if (modelData.zoom == undefined) {
      modelData.zoom = true;
    }

    sendAjax();
    buttonSwitch();
  }

  // 设置初始控制开关的值
  function buttonSwitch() {
    if (!modelData.titleShow) {
      $('.buttonShow>li:first-child').find('label').removeClass('active active1');
    }
    if (!modelData.playShow) {
      $('.buttonShow>li:nth-child(2)').find('label').removeClass('active active1');
    }
    if (!modelData.Perspective) {
      $('.buttonShow>li:nth-child(3)').find('label').removeClass('active active1');
    }
    if (!modelData.zoom) {
      $('.buttonShow>li:last-child').find('label').removeClass('active active1');
    }
  }

  // 标签块点击
  $('.matterIcon').click(function() {

    // $('.content-nav-right').toggle(100);
    $('.content-nav-right').show(200);



    $('.mattertagBoard').show(100)

    $('.labelBoard').hide()
    $('.guildBoard').hide();
    $('.imgEdit').hide(100);

  })
  // 导览点击
  $('.guild').click(function() {
    $('.title_mes_main').animate({
      top: 0 + 'px'
    });
    // $('.content-nav-right').toggle(100);
    $('.content-nav-right').show(200);
    $('.guildBoard').show(100)
    $('.mattertagBoard').hide()
    $('.labelBoard').hide();
    $('.imgEdit').hide(100);
  })


  // 信息块点击
  $('.buttonShow>li').click(function(e) {
    var index = $(this).attr('data-index');
    e.stopPropagation();
    e.preventDefault();
    if (index == 1) {
      // 显示标题与简介
      if ($(this).find('label').attr('class').indexOf('active') != -1) {
        $(this).find('label').removeClass('active active1');
        // 写入modelData.json文件中
        modelData.titleShow = false;
        sendAjax();
      } else {
        $(this).find('label').addClass('active active1');
        modelData.titleShow = true;
        sendAjax();
      }

    } else if (index == 2) {
      if ($(this).find('label').attr('class').indexOf('active') != -1) {
        $(this).find('label').removeClass('active active1');
        modelData.playShow = false;
        sendAjax();
      } else {
        $(this).find('label').addClass('active active1');
        modelData.playShow = true;
        sendAjax();
      }

    } else if (index == 3) {
      if ($(this).find('label').attr('class').indexOf('active') != -1) {
        $(this).find('label').removeClass('active active1');
        modelData.Perspective = false;
        sendAjax();
      } else {
        $(this).find('label').addClass('active active1');
        modelData.Perspective = true;
        sendAjax();
      }
      // 显示模型按钮
      // $('#mapBtn3D').toggle(200);
    } else if (index == 4) {
      if ($(this).find('label').attr('class').indexOf('active') != -1) {
        $(this).find('label').removeClass('active active1');
        modelData.zoom = false;
        sendAjax();
      } else {
        $(this).find('label').addClass('active active1');
        modelData.zoom = true;
        sendAjax();
      }
    } else {
      // 没有任何操作
    }
  })

  $('.labelIcon').click(function(e) {
    // 显示标题与简介
    $('.content-nav-right').show(200);
    //
    $('.labelBoard').show(100);

    $('.mattertagBoard').hide();
    $('.guildBoard').hide();
    $('.imgEdit').hide(100);

    // setOverallView(new THREE.Vector3(-8.97,37.72,-13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));

    $('.scanTitle').animate({
      left: 0 + 'px'
    }, function() {
      $('.title_mes_main').animate({
        top: 0 + 'px'
      });
    });
  })
  // 保存修改点击
  $('.savemodify').click(function() {
    window.parent.postMessage('savesuccess', '*');
    if (!modelData["msg"]) {
      modelData["msg"] = {};

    }
    modelData.msg['pageTitle'] = $('#pageTitle').text();
    modelData.msg['pageMsg'] = $('#pageMsg').text();
    modelData.msg['pageLocation'] = $('#pageLocation').text();
    modelData.msg['pageUrl'] = $('#pageUrl').text();
    sendAjax();
    $('.content-nav-right').hide(100);
    //   var qrcode = new QRCode(document.getElementById("qrcode"), {
    //     text: $('#pageUrl').text(),
    //     width: 128,
    //     height: 128,
    //     colorDark : "#000000",
    //     colorLight : "#ffffff",
    //     correctLevel : QRCode.CorrectLevel.H
    // });


  })
  // 标签确定按钮（已禁用标签）
  $('.addMattertag').click(function(ec) {

    mattertag = document.createElement('img');

    var description = $(".description").val();

    var tagType = $(".type-selecta").attr('value');

    if (!description) {
      window.parent.postMessage('nodesbute', '*')

      return;

    } else if (uploadSoure == '' && $('#textarea12').val() == '') {


      window.parent.postMessage('nofile', '*')

      return;

    } else if ($('#textarea12').val() != '') {

      uploadSoure = $('#textarea12').val()
    }

    switch ($(".type-selecta").attr('value'))

    {

      case 'pic':

        mattertag.src = './image/pictag.svg';
        mattertag.setAttribute('type', 'img')
        mattertag.title = '图文'


        break;

      case 'video':

        mattertag.src = './image/videotag.svg';
        mattertag.title = '视频'
        mattertag.setAttribute('type', 'video')

        break;

      case 'model':

        mattertag.src = './image/3Dtab.svg';
        mattertag.title = '模型'
        mattertag.setAttribute('type', 'iframe')

        break;

      case 'panorama':

        mattertag.src = './image/360tab.svg';
        mattertag.title = '全景'
        mattertag.setAttribute('type', 'iframe')

        break;

      default:

        mattertag.src = './image/pictag.svg';

        mattertag.setAttribute('type', 'img')

    }

    mattertag.id = 'movematter'

    document.body.appendChild(mattertag)



    isAddMatterTag = true



    sendAjax()

  })



  $('.addLabelBoard').click(function() {



    setOverallView(new THREE.Vector3(-8.97, 37.72, -13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));



    var label = document.createElement('img');

    label.src = './image/point.png';

    label.setAttribute('type', 'img')



    label.id = 'movelabel'

    document.body.appendChild(label)

    isAddLabel = true;

    sendAjax()

  })

  // 截屏按钮
  $('.snapshot').click(function() {


    //window.parent.postMessage('uploading', '*');

    var formData = new FormData();

    formData.append('file', module3D.getImgData(1920, 1200));

    formData.append('itemid', getQueryString('itemid'));

    var xhr = new XMLHttpRequest;

    xhr.open('post', phpedit_url + 'index/edit/screen_file');

    xhr.send(formData);

    xhr.onreadystatechange = function(res) {

      if (xhr.readyState == 4 && xhr.status == 200) {

        var json = JSON.parse(xhr.responseText);

        if (json.code == 1) {

          // window.parent.postMessage('uploadsuccess', '*');

          saveModesoure(json.data);

        } else {

          //window.parent.postMessage('uploadfail', '*');

        }

      }

    }
    //   sendAjax()

  })



  /**
   
   * 保存数据
   
   */
  var timeer = 0
  let imgEditPname;

  function saveModesoure(data) {
    var time = new Date();
    var year = time.getFullYear();
    var mon = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    var timer = year + '.' + mon + '.' + day + '_' + hour + ':' + min + ':' + sec

    var imgsrc = phpimg_url + data.src;

    // 镜头动画
    var cam = cameraController.getCurrentCamera();
    var pos = new THREE.Vector3();
    var q = new THREE.Quaternion();
    cam.getWorldPosition(pos);
    cam.getWorldQuaternion(q);


    modelData.slider.push({

      "src": imgsrc,

      "index": targetIndex,

      "timer": timer,

      "animateclick": JSON.stringify([q._x, q._y, q._z, q._w])

    })






    // $('.snapshotList').append(`<li>

    // <img src="`+ imgsrc +`" alt=""></li>`)
    $('.snapshotList').append(`<li  class='snapshotListLi' style='position:relative' >
  <p style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">` + timer + `</p>
  <img src="` + imgsrc + `" alt="" class="responsive-img"></li>`);

    $('.snapshotListLi').hover(function(ev) {

      $(ev.currentTarget).find($('.deleteListLi')).css('display', 'inline')
    }, function(ev) {
      $(ev.currentTarget).find($('.deleteListLi')).css('display', 'none')

    })



    // 点击图片进行更改
    $('.snapshotList>li>img[src="' + imgsrc + '"]').click(function(e) {
      let src = $(this).attr('src');

      if ($('.snapshotList>li:first-child>img').attr('src') === src) {
        $('.imgEdit-set>a').css('background', '#ccc');
        $('.imgEdit-set>a>i').css('display', 'block');
        $('.imgEdit-set>a>i').css('color', 'green');
        $('.imgEdit-set>a>span').html('已设置为起始图片');
      } else {
        $('.imgEdit-set>a').css('background', 'rgb(0, 161, 255)');
        $('.imgEdit-set>a>i').css('display', 'none');
        $('.imgEdit-set>a>span').html('设置为起始图片');
      }
      // 设置图片地址
      // $(this).prev().html()
      $('.imgEdit-content>img').attr('src', e.target.getAttribute('src'));
      // 设置图片名称
      $('.imgEdit-content>p').html($(this).prev().text());
      $('.imgEdit-ed>.row>.input-field>input').val($(this).prev().text());

      // 调用闭包函数

      imgEditPname = $(this).prev();

      $('.content-nav-right').show(200);
      $('.mattertagBoard').hide(100);
      $('.guildBoard').hide(100);
      $('.labelBoard').hide(100);
      $('.imgEdit').show(100);
    });



    // 图片删除
    $('.deleteListLi').click(function(ev) {

      $(ev.currentTarget).parents('.snapshotListLi').remove();
      // console.log($(ev.currentTarget).parents('.snapshotListLi').find('img').attr('src'))


      // 获取当前删除的图片地址
      let src = ev.target.previousElementSibling.getAttribute('src');

      let arr = $('.swiper_ul>li>img');
      for (let z = 0; z < arr.length; z++) {
        if (arr[z].getAttribute('src') == src) {
          // 删除当前子项
          $('.swiper_ul>li')[z].remove();
        }
      }


      for (var i = 0; i < modelData.slider.length; i++) {
        var json = modelData.slider[i];
        if (json.src == $(ev.currentTarget).parents('.snapshotListLi').find('img').attr('src')) {
          modelData.slider.splice(i, 1)

          sendAjax()
        }

      }


      // 删除动画组中的数据
      for (let y = 0; y < animateControl.data.main.frames.length; y++) {
        let Yjson = animateControl.data.main.frames[y];
        if (Yjson.src == $(ev.currentTarget).parents('.snapshotListLi').find('img').attr('src')) {
          animateControl.data.main.frames.splice(y, 1);
          sendAjaxAnimate();
          console.log(animateControl);
        }
      }

    })


    // 点击图片进行更改
    // $('.snapshotList>li>img').click(function(e) {
    // });

    // 根据所属的index对动画JSON进行操作
    try {

      if (JSON.stringify(animateControl.data) == '{}') {
        animateControl.data = {
          "main": {
            "frames": []
          },
          "video": {
            "frames": []
          }
        }
      }
      var animate = animateControl.data.main.frames;
      // 获取最后一个动画数据的开始时间
      if (animate.length == 0) {
        timeer = 0;
      } else {
        timeer = animate[animate.length - 1].start + 3
      }


      animate.push({
        "type": "script",
        "start": timeer,
        "duration": 4,
        // "data": "setWalkingViewPoint("+ targetIndex +", new THREE.Quaternion(-0.07479598693762435,0.3715088062111147,0.030042869758602042,0.9249238850966532));",
        "data": "setWalkingViewPoint(" + targetIndex + ", new THREE.Quaternion(" + q._x + "," + q._y + "," + q._z + "," + q._w + "));",
        // 是我用来做删除判断的
        "src": imgsrc
      });

      sendAjaxAnimate();
    } catch (err) {
      console.log(err);
    }


    sendAjax()

    slider()

  }



  // 图片编辑确定按钮
  // $('.imgEdit-bottom>a:first-child').click(function (e) {

  //     let name = $('.imgEdit #first_name2').val()
  //     let src = $('.imgEdit-content>img').attr('src');
  //     let arr = $('.snapshotList>li>img');
  //     for (let i = 0; i < arr.length; i++) {
  //       let ArrSrc = arr[i]
  //       if ($(ArrSrc).attr('src') === src) {
  //         $(arr[i]).prev().html(name)
  //       }
  //     }



  //       // let name = $('.imgEdit #first_name2').val()
  //       // let src = $('.imgEdit-content>img').attr('src');
  //       // imgEditPname.html(name)
  //       // for (let i = 0; i < modelData.slider.length; i++) {
  //       //     if (modelData.slider[i].src == src) {
  //       //           modelData.slider[i].timer = name
  //       //           sendAjax();
  //       //           $('.imgEdit').hide(100);
  //       //           $('.content-nav-right').hide(100);
  //       //     }
  //       // }
  //         // window.parent.postMessage('savesuccess', '*');
  // })
  // $('.imgEdit #first_name2').keydown(function (e) {
  //       if (e.keyCode == "13") {
  //         let name = $('.imgEdit #first_name2').val()
  //         let src = $('.imgEdit-content>img').attr('src');
  //         imgEditPname.html(name);
  //         for (let i = 0; i < modelData.slider.length; i++) {
  //             if (modelData.slider[i].src == src) {
  //                   modelData.slider[i].timer = name
  //                   sendAjax();
  //                   $('.imgEdit').hide(100);
  //                   $('.content-nav-right').hide(100);
  //             }
  //         }
  //         // window.parent.postMessage('savesuccess', '*');
  //       }
  // })
  // // 删除按钮
  // $('.imgEdit-bottom>a:last-child').click(function (e) {
  //     console.log(e)
  // })
})


//测量工具Start 20180914_Ning
var geometry = new THREE.PlaneBufferGeometry(100, 100, 1);
//var geometry = new THREE.BoxBufferGeometry(100, 100, 3);
var material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0
});

var plane = new THREE.Mesh(geometry, material);
plane.rotateX(1.56);
plane.position.y = 1.8;

var objects = [];

var one = true; //
var distance; //

//创建材质
var PI3 = Math.PI * 2;
var particleMaterials;
particleMaterials = new THREE.PointCloudMaterial({
  size: 20,
  vertexColors: true,
  color: 0xfaad18
});


function cubemesh(x, y, z) {
  var sphereGeo = new THREE.BoxBufferGeometry(0.13, 0.13, 0.13);
  var sphereGeo2 = new THREE.BoxBufferGeometry(0.23, 0.1, 0.23);
  var sphereMat = new THREE.MeshBasicMaterial({
    color: 0xfaad18
  });
  var sphereMat2 = new THREE.MeshBasicMaterial({
    color: 0x000000
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

// var sphereMesh1 = new THREE.Mesh(sphereGeo, sphereMat); //创建球体网格模型A
// var sphereMesh2 = new THREE.Mesh(sphereGeo, sphereMat); //创建球体网格模型B

function celiang() {

  if (modeSwitch.isOrthographic()) {
    console.log('2D测量初始化');
    scene.add(plane);
    objects.push(plane);

  } else if (modeSwitch.isOverallMode()) {
    console.log('3D测量初始化');
  }

}

function celiangClose() {

  //console.log('测量关闭');
  CanvasState = true;
  scene.remove(plane);
  objects.pop();

}

var mainCanvas = document.querySelector("canvas");
var CanvasState = true;

$('.measure').click(function() {

  if (CanvasState) {
    console.log('开始测量');
    CanvasState = false;
    mainCanvas.addEventListener('mouseup', onDocumentMouseupMeasure, false);
    mainCanvas.addEventListener('mousedown', onDocumentMousedwonMeasure, false);
    celiang();
  } else {
    console.log('停止测量');

    mainCanvas.removeEventListener('mouseup', onDocumentMouseupMeasure, false);
    mainCanvas.removeEventListener('mousedown', onDocumentMousedwonMeasure, false);
    celiangClose();
  }

})

//用来保存鼠标坐标信息
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var particleA = new THREE.Sprite(particleMaterials); //
var particleB = new THREE.Sprite(particleMaterials); //

var intersects;

//标尺间线段
var geometry = new THREE.Geometry();
var material = new THREE.LineBasicMaterial({
  vertexColors: THREE.VertexColors,
  linewidth: 100
});
var color1 = new THREE.Color(0xfaad18),
  color2 = new THREE.Color(0xfaad18);

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

/* 创建字体精灵 */
function makeTextSprite(message, parameters) {

  if (parameters === undefined) parameters = {};

  let fontface = parameters.hasOwnProperty("fontface") ?
    parameters["fontface"] : "Arial";

  /* 字体大小 */
  let fontsize = parameters.hasOwnProperty("fontsize") ?
    parameters["fontsize"] : 12;

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
  context.font = "Bold " + fontsize + "px " + fontface;

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

  console.log(sprite.spriteMaterial);

  /* 缩放比例 */
  sprite.scale.set(4, 2, 0);

  return sprite;

}


function initSpritText(text, positionX, positionY, positionZ) {
  /* 原点 */
  let spriteOrigin = makeTextSprite(text, {
    fontsize: 24,
    borderColor: {
      r: 250,
      g: 173,
      b: 24,
      a: 1
    },
    /* 边框黑色 */
    backgroundColor: {
      r: 0,
      g: 0,
      b: 0,
      a: 0.8
    } /* 背景颜色 */
  });
  spriteOrigin.center = new THREE.Vector2(0.15, 0.85);
  scene.add(spriteOrigin);
  spriteOrigin.position.set(positionX, positionY, positionZ);
  return spriteOrigin;
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

//绘制cylinder
function createCylinderMesh(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
  //四个参数分别是上底面半径、下底面半径，高度，半径段数
  var p1 = new THREE.Vector3(x1, y1, z1);
  var geometry = new THREE.CylinderGeometry(1, 1, 5, 16);
  var material = new THREE.MeshBasicMaterial({
    visible: true,
    color: 0xfaad18
  });
  var cylinder = new THREE.Mesh(geometry, material);

  cylinder.position.set(x2, y2, z2);
  //cylinder.lookAt(p1);
  //cylinder.rotateX(90);
  var p1zb = new THREE.Vector3(x1, y1, z1);
  var p2zb = new THREE.Vector3(x3, y3, z3);
  var p3zb = new THREE.Vector3();
  p3zb.subVectors(p1zb, p2zb);
  cylinder.rotation.set(p3zb.y, p3zb.z, p3zb.x);

  scene.add(cylinder);
  return cylinder;
}

//体验效果优化
var timmerHandle = null;
var isDrag = false;

function setDragTrue() {
  isDrag = true;
}

function onDocumentMousedwonMeasure(event) {
  isDrag = false;
  //延迟200ms
  timmerHandle = setTimeout(setDragTrue, 200);
}

//数组结构体
var LineObjects = [];
var LineSelet;
var PointA;
var PointB;
var textsprit;

//撤销测量数据
function linedel() {
  LineSelet = LineObjects.length - 1;
  console.log(LineSelet);
  scene.remove(LineObjects[LineSelet].line);
  scene.remove(LineObjects[LineSelet].point_1.M2);
  scene.remove(LineObjects[LineSelet].point_1.M3);
  scene.remove(LineObjects[LineSelet].point_2.M2);
  scene.remove(LineObjects[LineSelet].point_2.M3);
  scene.remove(LineObjects[LineSelet].textsprit);
  LineObjects.pop();
}

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
  }
}

//保存测量json
function SaveMeasure_Json() {
  // 定义json变量 
  var json = {
    PointA_x: particleA.position.x,
    PointA_y: particleA.position.y,
    PointA_z: particleA.position.z

  };
  // var blob = new Blob([JSON.stringify(json)], { type: "text/plain;charset=utf-8" });
  // saveAs(blob, "hello.json");

}

function onDocumentMouseupMeasure(event) {
  if (event.button == 0) {

    if (!isDrag) {

      //获取鼠标的x，y坐标
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
      mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

      if (modeSwitch.isOrthographic()) {
        raycaster.setFromCamera(mouse, orthoCamera);
        intersects = raycaster.intersectObjects(objects);
        console.log("intersects.length:", intersects.length);

      } else if (modeSwitch.isOverallMode()) {
        raycaster.setFromCamera(mouse, orbitCamera);
        intersects = raycaster.intersectObjects(model.children);
      }

      console.log(intersects.length);

      if (intersects.length > 0) {
        console.log(intersects.length);
        var LinePointOBJ = {};


        if (one) {
          one = false;
          //var particleA = new THREE.Sprite( particleMaterial );
          particleA.position.copy(intersects[0].point);
          particleA.scale.x = particleA.scale.y = 10;
          scene.add(particleA);
          console.log('A');

          PointA = cubemesh(particleA.position.x, particleA.position.y, particleA.position.z)

        } else {
          one = true;
          //var particleB = new THREE.Sprite( particleMaterial );
          particleB.position.copy(intersects[0].point);
          particleB.scale.x = particleB.scale.y = 10;
          scene.add(particleB);
          console.log('B');

          PointB = cubemesh(particleB.position.x, particleB.position.y, particleB.position.z);

          //计算距离
          distance = particleB.position.distanceTo(particleA.position);
          console.log('距离', distance.toFixed(2));
          var geometry = new THREE.Geometry();
          geometry.vertices.push(particleA.position);
          geometry.vertices.push(particleB.position);
          geometry.colors.push(color1, color2);
          var line = new THREE.Line(geometry, material);
          scene.add(line);

          // //创建球体网格模型C
          // var sphereMesh3 = new THREE.Mesh(sphereGeo, sphereMat);
          // //设置球的坐标
          // sphereMesh3.position.set(
          //     (particleA.position.x + particleB.position.x) / 2,
          //     (particleA.position.y + particleB.position.y) / 2,
          //     (particleA.position.z + particleB.position.z) / 2
          // );
          // //将球体添加到场景
          // scene.add(sphereMesh3);

          textsprit = initSpritText((" " + distance.toFixed(2) + " M "),
            (particleA.position.x + particleB.position.x) / 2,
            (particleA.position.y + particleB.position.y) / 2 + 0.15,
            (particleA.position.z + particleB.position.z) / 2); //20180917celiang

          //LineObjects.push(line);
          LinePointOBJ.line = line;
          LinePointOBJ.point_1 = PointA;
          LinePointOBJ.point_2 = PointB;
          LinePointOBJ.textsprit = textsprit;
          LineObjects.push(LinePointOBJ);

          //线条边缘扩大
          // createCylinderMesh(particleA.position.x, particleA.position.y, particleA.position.z,
          //     (particleA.position.x + particleB.position.x) / 2,
          //     (particleA.position.y + particleB.position.y) / 2,
          //     (particleA.position.z + particleB.position.z) / 2,
          //     particleB.position.x, particleB.position.y, particleB.position.z);

        }
      }

    }
  }

}

//测量工具End 20180914_Ning