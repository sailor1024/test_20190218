$(function() {

    // 暂时保存不必要的操作 +
    // 保存修改点击
    // $('.savemodify').click(function() {
    //   window.parent.postMessage('savesuccess', '*');
    //   if (!modelData["msg"]) {
    //     modelData["msg"] = {};

    //   }
    //   modelData.msg['pageTitle'] = $('#pageTitle').text();
    //   modelData.msg['pageMsg'] = $('#pageMsg').text();
    //   modelData.msg['pageLocation'] = $('#pageLocation').text();
    //   modelData.msg['pageUrl'] = $('#pageUrl').text();
    //   sendAjax();
    //   $('.content-nav-right').hide(100);
    //   translateNavEnd();
    // })

    // $('.addLabelBoard').click(function() {
    //    setOverallView(new THREE.Vector3(-8.97, 37.72, -13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));
    //    var label = document.createElement('img');
    //    label.src = './image/point.png';
    //    label.setAttribute('type', 'img')
    //    label.id = 'movelabel'
    //    document.body.appendChild(label)
    //    isAddLabel = true;
    //    sendAjax()
    //  })

    // 暂时保存不必要的操作 - 

    var mattertag;
    setTimeout(function() {
        testModelData();
    }, 2000)

    // 检测modelData.json
    function testModelData() {
        setTimeout(function() {
            try {
                if (modelData.titleShow == undefined) {
                    modelData.titleShow = true;
                }
                if (modelData.playShow == undefined) {
                    modelData.playShow = false;
                }
                if (modelData.Perspective == undefined) {
                    modelData.Perspective = true;
                }
                if (modelData.zoom == undefined) {
                    modelData.zoom = false;
                }
                if (modelData.Planelabel == undefined) {
                    modelData.Planelabel = true;
                }
                if (modelData.BgMusic == undefined) {
                    modelData.BgMusic = false
                }

                sendAjax();
                buttonSwitch();
            } catch (err) {
                console.log(err);
            }
        }, 500)
    }


    function resetAnimate() {
        $('.title_mes').css('z-index', '-1');
        $('.hidebtn').css('z-index', '-1');
        $('#previous-show').hide();
        $('#play-show').hide();
        $('#next-show').hide();
        $('.ControlMessage').hide();
        $(".ControlMessage").animate({
            opacity: "1"
        }, 200);
        $('#mapBtn3D-show').hide();
        let key = $('.hidebtn').css('display');
        if (key == 'block') {
            $('.hidebtn').click();
        }
        let key1 = $('.swiper').css('height');
        if (key1 == '118px') {
            $('.swiper').hide();
            $('#pullTab').click();
            $('#pullTab-show').hide();
        }
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

    // 信息块点击
    $('.buttonShow>li').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        hideGuide();
        let index = $(this).attr('data-index');
        if (index == 1) {
            let Target = $(e.target).attr('for')
            if (!Target) {
                showTitle();
                return false
            }
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
            let Target = $(e.target).attr('for')
            if (!Target) {
                showplaying();
                return false
            }
            if (modelData.slider.length == 0) {
                window.parent.postMessage('CannotPlay', '*');
                return false
            }
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
            let Target = $(e.target).attr('for')
            if (!Target) {
                showPerspective();
                return false
            }
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
            let Target = $(e.target).attr('for');
            if (!Target) {
                showAtlas();
                return false
            }
            if (modelData.slider.length == 0) {
                window.parent.postMessage('NotAbbreviated', '*');
                return false
            }
            if ($(this).find('label').attr('class').indexOf('active') != -1) {
                $(this).find('label').removeClass('active active1');
                modelData.zoom = false;
                sendAjax();
            } else {
                $(this).find('label').addClass('active active1');
                modelData.zoom = true;
                sendAjax();
            }
        } else if (index == 5) {
            let Target = $(e.target).attr('for');
            if (!Target) {
                // console.log('没有任何提示');
                return false
            }
            if ($(this).find('label').attr('class').indexOf('active') != -1) {
                $(this).find('label').removeClass('active active1');
                modelData.Planelabel = false;
                sendAjax();
            } else {
                $(this).find('label').addClass('active active1');
                modelData.Planelabel = true;
                sendAjax();
            }
        } else if (index == 6) {
            let Target = $(e.target).attr('for');
            if (!Target) {
                return false
            }
            if ($(this).find('label').attr('class').indexOf('active') != -1) {
                $(this).find('label').removeClass('active active1');
                modelData.BgMusic = false;
                sendAjax();
            } else {
                if (modelData.BgMusicLink == '' || !modelData.BgMusicLink) {
                    // 提示用戶上传音频文件
                    $('.beijingyinyueShow').show();
                } else {
                    $(this).find('label').addClass('active active1');
                    modelData.BgMusic = true;
                    sendAjax();
                }
            }
        }
    })


    $('.labelIcon').click(function(e) {
        celiangClose();
        AddTagCancel();
        popEditHid();
        translateNavEnd();
        TwoDclick();
        hideGuide();

        console.log(trueLove)
        if (trueLove) {
            LableAdd();
        } else {
            LabelCancel();
            trueLove = !trueLove;
            setTimeout(() => {
                $(this).removeClass('active');
            }, 500)
        }
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
        $('.content-nav-left').css('animation', 'none')
        $('.nav-icon-left').css('animation', 'none');
        $('.assect').find('i').removeClass('icon-xianshikejian').addClass('icon-yincangbukejian');
        Screenshot();
        resetAnimate();
        hideGuide();
        TagsVisible(false);
        HiddenLabel(false);
        HiddenMeasure();
    })


    $('.jietukaishi').click(function(e) {
        e.stopPropagation();

        $('.danmu').show();
        $('.InterceptScreen .progress').show();

        // window.parent.postMessage('Screenshot', '*');

        var formData = new FormData();

        formData.append('file', module3D.getImgData(1920, 1200));

        formData.append('itemid', getQueryString('itemid'));

        var xhr = new XMLHttpRequest;

        xhr.open('post', phpedit_url + 'edit/screen_file');

        xhr.send(formData);

        xhr.onreadystatechange = function(res) {

            if (xhr.readyState == 4 && xhr.status == 200) {

                var json = JSON.parse(xhr.responseText);

                if (json.code == 1) {

                    saveModesoure(json.data);

                    $('.danmu').hide();
                    $('.ProgressLog').show().animate({
                        opacity: 1.0
                    }, 200, () => {
                        $('.InterceptScreen .determinate').animate({
                            width: '100%'
                        }, 2000, () => {
                            $('.InterceptScreen .progress').hide();
                            $('.InterceptScreen .ProgressLog>div>span').text('截屏已保存。');
                            // 动画让主体结束自己
                            $('.ProgressLog').animate({
                                opacity: '0'
                            }, 2500, () => {
                                $('.InterceptScreen .determinate').css('width', '0');
                                $('.InterceptScreen .ProgressLog>div>span').text('截屏保存中...');
                                $('.InterceptScreen .ProgressLog').hide();
                            });
                        })
                    })
                    $(".icon-left-show>div").removeClass('active');

                } else {}
            }
        }
    })

    // 标尺确定按钮
    $('.Measurements-confirm>a').click(function(e) {
        let index = $(this).attr('data-index');
        if (index == 1) {
            //confirm
            let val = $('.Measurements-header>textarea').val();
            // console.log(val);
            // console.log(modelData)

        } else if (index == 2) {
            //delete 
            // console.log('删除当前标尺');
            linedel2();
        }
        popEditHid();

        translateNavEnd();
        $(".nav-icon-right-list").removeClass('active');
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
        var rot = new THREE.Vector3();
        var q = new THREE.Quaternion();
        pos = cam.getWorldPosition();
        zoom = cam.zoom;
        rot = cam.rotation;

        cam.getWorldQuaternion(q);
        var camMode;
        //判断镜头模式
        if (modeSwitch.isOrthographic()) {
            camMode = "2D";
        } else if (modeSwitch.isWalkingMode()) {
            camMode = "1D";
        } else if (modeSwitch.isOverallMode()) {
            camMode = "3D";
        }


        modelData.slider.push({

            "src": imgsrc,

            "index": targetIndex,

            "timer": timer,

            "mode": camMode,

            "zoom": zoom,

            "rot": JSON.stringify([rot.x, rot.y, rot.z]),

            "pos": JSON.stringify([pos.x, pos.y, pos.z]),

            "animateclick": JSON.stringify([q._x, q._y, q._z, q._w]),

            // 发布版判断当前图片是否展示
            "show": true

        })



        // $('.snapshotList').append(`<li>

        // <img src="`+ imgsrc +`" alt=""></li>`)
        $('.snapshotList').prepend(`<li  class='snapshotListLi' style='position:relative' >
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
            popEdit('imgEdit');
            translateNav();
            $(".nav-icon-right-list").addClass('active');

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
                    // console.log(animateControl);
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

        slider();

        oninitGuide();

    }

})


// 热点对象
class RESETOBJ {

    constructor(length, name, id, title, content) {
        this.length = length;
        this.name = name;
        this.id = id;
        this.title = title;
        this.content = content
    }

    ShowLength() {
        return this.length
    }
}


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
    color: 0xfaad18
});


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
        //depthTest: false
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
        // console.log('2D测量初始化');
        scene.add(plane);
        objects.push(plane);

    } else if (modeSwitch.isOverallMode()) {
        // console.log('3D测量初始化');
    }

}


function celiangClose() {

    // console.log('测量关闭');
    CanvasState = true;
    document.body.style.cursor = "auto";
    if (modeSwitch.isOrthographic()) {
        // console.log('2D测量初始化');
        scene.remove(plane);
        objects.pop();
    }


}

var mainCanvas = document.querySelector("canvas");
var CanvasState = true;

$('.measure').click(function() {
    LabelCancel();
    AddTagCancel();
    document.body.style.cursor = "crosshair";
    popEditHid();
    translateNavEnd();
    hideGuide();

    let key = $(this).attr('class').indexOf('active');
    if (key == -1) {
        //判断只有2d跟3d才能进行打标尺
        if (modeSwitch.isOrthographic() || modeSwitch.isOverallMode()) {
            window.parent.postMessage('startRuler', '*');
            CanvasState = false;
            mainCanvas.addEventListener('mouseup', onDocumentMouseupMeasure, false);
            // mainCanvas.addEventListener('mousedown', onDocumentMousedwonMeasure, false);
            celiang();
        } else {
            setWalkingMeshView(0);
            // CanvasState = false;
            mainCanvas.addEventListener('mouseup', onDocumentMouseupMeasure, false);
            celiang();
            // console.log('不可以打标尺，进行跳转到2d模型');
            // setTimeout(() => {
            //     $(".icon-left-show>div").removeClass('active');
            // }, 500)
            // $('#mapBtn2D').click();
            // let icon = 'iconfont icon-five';
            // $('.nav-icon-right-top>i:first-child').attr('class', icon)
        }
    } else {
        celiangClose();
        setTimeout(() => {
            $(this).removeClass('active');
        }, 500)
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
    // vertexColors: THREE.VertexColors,
    linewidth: 10

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

    // console.log(sprite.spriteMaterial);

    /* 缩放比例 */
    sprite.scale.set(4, 2, 0);

    return sprite;

}

/* 创建删除按钮 */
function makeButtonSprite(message, parameters) {

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

    // console.log(sprite.spriteMaterial);

    /* 缩放比例 */
    sprite.scale.set(4, 2, 0);

    return sprite;

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

function initSpritButton2(positionX, positionY, positionZ) {
    /* 原点 */
    let spriteOrigin2 = makeButtonSprite(" Delete ", {
        fontsize: 22,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        },
        /* 边框黑色 */
        backgroundColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0.8,
        } /* 背景颜色 */
    });
    spriteOrigin2.center = new THREE.Vector2(0.12, 1.15);
    scene.add(spriteOrigin2);
    spriteOrigin2.position.set(positionX, positionY, positionZ);
    return spriteOrigin2;
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
var textspritGroup = [];
var ButtonSpritGroup = [];

//撤销测量数据
function linedel() {
    LineSelet = LineObjects.length - 1;
    let id = LineObjects[LineSelet].line.id;
    scene.remove(LineObjects[LineSelet].line);
    scene.remove(LineObjects[LineSelet].point_1.M2);
    scene.remove(LineObjects[LineSelet].point_1.M3);
    scene.remove(LineObjects[LineSelet].point_2.M2);
    scene.remove(LineObjects[LineSelet].point_2.M3);
    scene.remove(LineObjects[LineSelet].textsprit);
    scene.remove(LineObjects[LineSelet].buttonSprit);
    LineObjects.pop();
}

//删除选中的测量数据
var seletRuler_ID;

function linedel2() {
    var Selet = -1;
    LineObjects.forEach(function(object) {

        Selet += 1;
        if (object.line.id == seletRuler_ID) {
            scene.remove(object.line);
            scene.remove(object.point_1.M2);
            scene.remove(object.point_1.M3);
            scene.remove(object.point_2.M2);
            scene.remove(object.point_2.M3);
            scene.remove(object.textsprit);
            scene.remove(object.buttonSprit);
            LineObjects.splice(Selet, 1);
            delModelRuler(seletRuler_ID);
        }
    })

}

function delModelRuler(id) {
    $('.RulerManagement>li[value=' + id + ']').remove();
    // 删除model.json中的Ruler
    let arr = modelData.Ruler;
    // console.log(id)
    arr.forEach((item, index) => {
        if (item.id == id) {
            arr.splice(index, 1);
        }
    })
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

//保存测量json
function SaveMeasure_Json() {
    // 定义json变量 
    var json = {
        PointA_x: particleA.position.x,
        PointA_y: particleA.position.y,
        PointA_z: particleA.position.z,
        PointB_x: particleB.position.x,
        PointB_y: particleB.position.y,
        PointB_z: particleB.position.z

    };

    // var blob = new Blob([JSON.stringify(json)], { type: "text/plain;charset=utf-8" });
    // saveAs(blob, "hello.json");

}

//MeasureUnchanged
var timerMeasureZoom = setInterval(MeasureZoom, 10);
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

        if (modeSwitch.isWalkingMode()) {
            var scale = MeasurescaleVector.subVectors(LinePointOBJ.textsprit.position, pointerLockControl.getObject().position).length() / scaleFactor;
        } else if (modeSwitch.isOrthographic()) {
            // var scale = 1.64 / orthoCamera.zoom;
            var scale = (orthoCamera.position.y * 0.05) / orthoCamera.zoom;
        } else if (modeSwitch.isOverallMode()) {
            var scale = MeasurescaleVector.subVectors(LinePointOBJ.textsprit.position, orbitCamera.position).length() / scaleFactor;
        }
        sprite1.scale.set(scale, scale, scale);
        sprite2.scale.set(scale, scale, scale);
        sprite3.scale.set(scale, scale, scale);
        sprite4.scale.set(scale, scale, scale);
        spritetext.scale.set(4 * scale, 2 * scale, 0);
        spritButton.scale.set(1.2 * scale, 1.2 * scale, 0);

    });

}


let Ruler = [];
let status = '';

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
                // console.log("intersects.length:", intersects.length);
                status = '2D';

            } else if (modeSwitch.isOverallMode()) {
                raycaster.setFromCamera(mouse, orbitCamera);
                intersects = raycaster.intersectObjects(model.children);
                status = '3D'
            } else if (modeSwitch.isWalkingMode()) {
                raycaster.setFromCamera(mouse, pointerLockCamera);
                intersects = raycaster.intersectObjects(model.children);
                status = '3D'
            }


            if (intersects.length > 0) {
                // console.log(intersects.length);
                var LinePointOBJ = {};
                TagControlWalk = false;


                if (one) {
                    one = false;
                    //var particleA = new THREE.Sprite( particleMaterial );
                    particleA.position.copy(intersects[0].point);
                    particleA.scale.x = particleA.scale.y = 1;
                    scene.add(particleA);
                    // console.log('A');
                    PointA = cubemesh(particleA.position.x, particleA.position.y, particleA.position.z)

                    var scale = MeasurescaleVector.subVectors(PointA.M2.position, pointerLockControl.getObject().position).length() / 20;
                    PointA.M2.scale.set(scale, scale, scale);
                    PointA.M3.scale.set(scale, scale, scale);

                } else {
                    one = true;
                    //var particleB = new THREE.Sprite( particleMaterial );
                    particleB.position.copy(intersects[0].point);
                    particleB.scale.x = particleB.scale.y = 1;
                    scene.add(particleB);
                    // console.log('B');

                    PointB = cubemesh(particleB.position.x, particleB.position.y, particleB.position.z);

                    //计算距离
                    distance = particleB.position.distanceTo(particleA.position);
                    // console.log('距离', distance.toFixed(2));
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(particleA.position);
                    geometry.vertices.push(particleB.position);
                    geometry.colors.push(color1, color2);
                    // var line = new THREE.Line(geometry, material);
                    var line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
                        color: 0xffaa00,
                        dashSize: 3,
                        gapSize: 1
                    }));
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

                    // textsprit = initSpritText((" " + distance.toFixed(2) + " M "), (particleA.position.x + particleB.position.x) / 2, (particleA.position.y + particleB.position.y) / 2 + 0.15, (particleA.position.z + particleB.position.z) / 2); //20180917celiang

                    textsprit = initSpritText((" " + distance.toFixed(2) + " M "),
                        (particleA.position.x + particleB.position.x) / 2,
                        (particleA.position.y + particleB.position.y) / 2 + 0.15,
                        (particleA.position.z + particleB.position.z) / 2); //20180917celiang

                    buttonSprit = initSpritButton(
                        (particleA.position.x + particleB.position.x) / 2,
                        (particleA.position.y + particleB.position.y) / 2 + 0.15,
                        (particleA.position.z + particleB.position.z) / 2);

                    //LineObjects.push(line);
                    LinePointOBJ.line = line;
                    LinePointOBJ.point_1 = PointA;
                    LinePointOBJ.point_2 = PointB;
                    LinePointOBJ.textsprit = textsprit;
                    LinePointOBJ.textsprit.name = distance.toFixed(2);
                    LinePointOBJ.buttonSprit = buttonSprit;
                    LinePointOBJ.buttonSprit.visible = false;
                    if (status == '2D') {
                        LinePointOBJ.line.name = 'iconfont icon-five';
                    } else if (status == '3D') {
                        LinePointOBJ.line.name = 'iconfont icon-four';
                    }

                    textspritGroup.push(LinePointOBJ.textsprit);
                    ButtonSpritGroup.push(LinePointOBJ.buttonSprit);


                    // 保存到本地model.json开始 Ruler point_1起点，point_2终点
                    let point1 = LinePointOBJ.point_1.M2.position;
                    let point2 = LinePointOBJ.point_2.M2.position;
                    let Distance = distance.toFixed(2);
                    let id = LinePointOBJ.line.id;

                    let icon = ''
                    if (status == '2D') {
                        icon = 'iconfont icon-five'
                    } else if (status == '3D') {
                        icon = 'iconfont icon-four'
                    }

                    // 判断model.json中是否有Ruler
                    if (!modelData.Ruler) {
                        modelData.Ruler = [];
                    } else {
                        if (modelData.Ruler.length != 0) {
                            Ruler = modelData.Ruler;
                        } else {
                            Ruler = [];
                        }
                    }



                    rulerFun(Ruler, point1, point2, Distance, icon, id);

                    if (modelData.Ruler === undefined) {
                        modelData.Ruler = Ruler;
                    } else {
                        modelData.Ruler = Ruler;
                    }

                    sendAjax();
                    // 保存到本地model.json结束


                    // 设置操作界面信息
                    $('.Measurements-length>span').text(distance.toFixed(2) + 'm');
                    // 弹出操作界面
                    popEdit('Measurements');

                    $(".nav-icon-right-list").addClass('active');
                    $(".icon-left-show>div").removeClass('active');

                    translateNav();


                    const p = new Promise((resolve, reject) => {
                        $('.RulerManagement').prepend(`
              <li value="` + LinePointOBJ.line.id + `">
                  <i class="` + icon + `"></i>
                  <span>` + distance.toFixed(2) + `m</span>
              </li>

            `);
                        resolve();
                    }).then(() => {
                        $('.RulerManagement>li').click(function(e) {
                            seletRuler_ID = $(this).attr('value');
                            popEdit('Measurements');
                            translateNav();
                            $('.Measurements-length>span').text($(this).find('span').text());
                            $(".nav-icon-right-list").addClass('active');
                        })
                    }).catch((error) => {
                        console.log(error)
                    })


                    LineObjects.push(LinePointOBJ);

                    // console.log('停止测量');
                    window.parent.postMessage('endRuler', '*');
                    mainCanvas.removeEventListener('mouseup', onDocumentMouseupMeasure, false);
                    // mainCanvas.removeEventListener('mousedown', onDocumentMousedwonMeasure, false);
                    celiangClose();

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


//选中场景中的Measure
mainCanvas.addEventListener('mouseup', onDocumentMeasureTag, false);

function onDocumentMeasureTag(event) {

    if (event.button == 0) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();

        if (modeSwitch.isOrthographic()) {
            raycaster.setFromCamera(mouse, orthoCamera);
            intersects = raycaster.intersectObjects(textspritGroup);

            if (intersects.length > 0) {
                scarchMeasureID(intersects[0].object.id);
            }

        } else if (modeSwitch.isOverallMode()) {
            raycaster.setFromCamera(mouse, orbitCamera);
            intersects = raycaster.intersectObjects(textspritGroup);

            if (intersects.length > 0) {
                scarchMeasureID(intersects[0].object.id);
            }

        } else if (modeSwitch.isWalkingMode()) {
            raycaster.setFromCamera(mouse, pointerLockCamera);
            intersects = raycaster.intersectObjects(textspritGroup);

            if (intersects.length > 0) {
                scarchMeasureID(intersects[0].object.id);
            }

        }

    }
}

function scarchMeasureID(sid) {
    var Selet = -1;
    LineObjects.forEach(function(object) {
        Selet += 1;
        if (object.textsprit.id == sid) {

            seletRuler_ID = object.line.id;
            object.buttonSprit.visible = true;
            popEdit('Measurements');
            //console.log("textsprit",object.textsprit.name);
            $('.Measurements-length>span').text(object.textsprit.name + "M");

        } else {
            object.buttonSprit.visible = false;
        }
    })

}

//按钮删除Measure
mainCanvas.addEventListener('mousedown', onDocumentMeasureButton, false);


function onDocumentMeasureButton(event) {

    if (event.button == 0) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();

        if (modeSwitch.isOrthographic()) {
            raycaster.setFromCamera(mouse, orthoCamera);
            intersects = raycaster.intersectObjects(ButtonSpritGroup);

            if (intersects.length > 0) {
                scarchMeasureBtnID(intersects[0].object.id);
            }

        } else if (modeSwitch.isOverallMode()) {
            raycaster.setFromCamera(mouse, orbitCamera);
            intersects = raycaster.intersectObjects(ButtonSpritGroup);

            if (intersects.length > 0) {
                scarchMeasureBtnID(intersects[0].object.id);
            }

        } else if (modeSwitch.isWalkingMode()) {
            raycaster.setFromCamera(mouse, pointerLockCamera);
            intersects = raycaster.intersectObjects(ButtonSpritGroup);

            if (intersects.length > 0) {
                scarchMeasureBtnID(intersects[0].object.id);
            }

        }

    }
}


function scarchMeasureBtnID(sid) {
    var Selet = -1;
    LineObjects.forEach(function(object) {
        Selet += 1;
        if (object.buttonSprit.id == sid) {

            seletRuler_ID = object.line.id;
            popEdit('Measurements');
            linedel2();
            // console.log("seletRuler_ID", seletRuler_ID);
            popEditHid();

        }
    })

}
// 定义新的标尺列表
let NewRulerArr = [];

function initMeasure() {

    if (modelData.Ruler != undefined) {
        modelData.Ruler.forEach(function(object) {
            // console.log("point1", object.point1, "point2", object.point2, "object.icon", object.icon);
            initMeasureGreat(object.point1, object.point2, object.icon);
        })
        modelData.Ruler = NewRulerArr;
    } else {
        modelData.Ruler = [];
    }
    //下面代码会等待循环结束才执行
    sendAjax();
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

    textsprit = initSpritText((" " + distance.toFixed(2) + " M "),
        (particleA.position.x + particleB.position.x) / 2,
        (particleA.position.y + particleB.position.y) / 2 + 0.15,
        (particleA.position.z + particleB.position.z) / 2); //20180917celiang

    buttonSprit = initSpritButton(
        (particleA.position.x + particleB.position.x) / 2,
        (particleA.position.y + particleB.position.y) / 2 + 0.15,
        (particleA.position.z + particleB.position.z) / 2);

    LinePointOBJ.line = line;
    LinePointOBJ.line.name = iconfont;
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

    // 判断model.json中是否有Ruler
    if (!modelData.Ruler) {
        modelData.Ruler = [];
    } else {
        if (modelData.Ruler.length != 0) {
            Ruler = modelData.Ruler;
        } else {
            Ruler = [];
        }
    }


    // 生成新的model.Ruler
    rulerFun(NewRulerArr, point1, point2, Distance, icon, id);
    // 给每个生成的列表函数添加事件  
    const p = new Promise((resolve, reject) => {
        $('.RulerManagement').prepend(`
                <li value="` + id + `">
                    <i class="` + icon + `"></i>
                    <span>` + distance.toFixed(2) + `m</span>
                </li>
  
              `);
        resolve();
    }).then(() => {
        $('.RulerManagement>li').click(function(e) {
            hideGuide();
            seletRuler_ID = $(this).attr('value');
            popEdit('Measurements');
            translateNav();
            $('.Measurements-length>span').text($(this).find('span').text());
            $(".nav-icon-right-list").addClass('active');
        })
    }).catch((error) => {
        console.log(error)
    })

    LineObjects.push(LinePointOBJ);
}

//测量工具End 20180914_Ning

//Label_Start
function makeTextSprite3(message, parameters) {

    if (parameters === undefined) parameters = {};

    let fontface = parameters.hasOwnProperty("fontface") ?
    parameters["fontface"] : "微软雅黑,Arial";

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
    let spriteOrigin = makeTextSprite3(text, {
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

function createSpriteLabel() {
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
        map: THREE.ImageUtils.loadTexture('image/LeableAdd.png'),
        transparent: true,
        opacity: 1.0
    });
    let mesh = new THREE.Sprite(material);
    mesh.scale.set(1, 1, 1);
    // mesh.position.z = 0.5 * 0.5;
    // scene.add(mesh);
    return mesh;
}

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
let saveId;
var LabelRound;
var trueLove = true

function LableAdd() {
    trueLove = false;
    //   console.log("lable");
    scene.add(plane2);
    LablePlaneobjects.push(plane2);
    mainCanvas.addEventListener('mousemove', onDocumentLableMove, false);
    mainCanvas.addEventListener('mousedown', onDocumentLableButton, false);
    LableSprit = initSpritLabelText((" 未命名 "), 0, 0, 0);
    //   LableSprit.scale.set(5,2.5,1);
    LabelGroup.push(LableSprit);
    LableSprit.name = " 未命名 ";
    LabelRound = createSpriteLabel()
    scene.add(LabelRound);

}

function onDocumentLableMove(event) {

    if (event.button == 0) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();

        if (modeSwitch.isOrthographic()) {
            raycaster.setFromCamera(mouse, orthoCamera);
            intersects = raycaster.intersectObjects(LablePlaneobjects);

            if (intersects.length > 0) {

                // LableSprit.position.copy(intersects[0].point);
                // LableSprit.position.y += 0.1;
                LabelRound.position.copy(intersects[0].point);
                LabelRound.position.y += 0.1;

            }

        }

        var raycaster2 = new THREE.Raycaster();

        if (modeSwitch.isOrthographic()) {
            raycaster2.setFromCamera(mouse, orthoCamera);
            intersects2 = raycaster2.intersectObjects(model.children);

            if (intersects2.length > 0) {
                LabelRound.material.opacity = 1;
            } else {
                LabelRound.material.opacity = 0.5;
            }

        }

    }
}

function LabelCancel() {
    scene.remove(plane2);
    scene.remove(LabelRound);
    LablePlaneobjects.pop();
    mainCanvas.removeEventListener('mousemove', onDocumentLableMove, false);
    mainCanvas.removeEventListener('mousedown', onDocumentLableButton, false);
    scene.remove(LableSprit);
}

function onDocumentLableButton(event) {

    if (event.button == 0) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();

        if (modeSwitch.isOrthographic()) {
            raycaster.setFromCamera(mouse, orthoCamera);
            intersects = raycaster.intersectObjects(LablePlaneobjects);

            if (intersects.length > 0) {
                LableSprit.position.copy(intersects[0].point);
                LableSprit.position.y += 0.1;
                scene.remove(plane2);
                scene.remove(LabelRound);

                LablePlaneobjects.pop();
                mainCanvas.removeEventListener('mousemove', onDocumentLableMove, false);
                mainCanvas.removeEventListener('mousedown', onDocumentLableButton, false);


                var raycaster2 = new THREE.Raycaster();

                if (modeSwitch.isOrthographic()) {
                    raycaster2.setFromCamera(mouse, orthoCamera);
                    intersects2 = raycaster2.intersectObjects(model.children);

                    // console.log(intersects2.length)
                    if (intersects2.length > 0) {

                        // show label edit
                        scarchLabelID(LableSprit.id);
                        popEdit('Label');
                        translateNav();
                        $(".nav-icon-right-list").addClass('active');
                        $(".icon-left-show>div").removeClass('active');
                        trueLove = true
                        let val = LableSprit.name;
                        textareaText(val);
                        collectionChange(val);
                        saveId = LableSprit.id;

                        // 推入列表中
                        labelPushlist(LableSprit.id, LableSprit.name);
                        saveId = LableSprit.id;
                        // 保存到model.json
                        saveLabelModelJson(LableSprit);

                    } else {
                        scene.remove(LableSprit);
                    }

                }

            }

        }

    }
}

//选中场景中的Label
mainCanvas.addEventListener('mousedown', onDocumentLabel, false);

function onDocumentLabel(event) {

    if (event.button == 0) {
        if (modeSwitch.isOrthographic()) {

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
            mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();

            raycaster.setFromCamera(mouse, orthoCamera);
            intersects = raycaster.intersectObjects(LabelGroup);

            if (intersects.length > 0) {
                scarchLabelID(intersects[0].object.id);
                popEdit('Label');
                translateNav();
                let val = intersects[0].object.name;
                textareaText(val);
                collectionChange(val);
                saveId = intersects[0].object.id;
            }

        }
    }

}

var SelectLabel;
var SelectLabelID;

function onDocumentLabelMoveAgain(event) {

    if (event.button == 0) {
        if (modeSwitch.isOrthographic()) {

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
            mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();

            raycaster.setFromCamera(mouse, orthoCamera);
            intersects = raycaster.intersectObjects(LablePlaneobjects);

            if (intersects.length > 0) {
                if (SelectLabel != null) {
                    SelectLabel.position.copy(intersects[0].point);
                    SelectLabel.position.y += 0.1;
                }
                // console.log("SelectLabel", SelectLabel);

            }

        }
    }

}

function scarchLabelID(sid) {

    var Selet = -1;
    LabelGroup.forEach(function(object) {
        Selet += 1;
        if (object.id == sid) {
            SelectLabelID = Selet;
            SelectLabel = object;
            // console.log("SelectLabel", SelectLabel);
            scene.add(plane2);
            LablePlaneobjects.push(plane2);
            mainCanvas.addEventListener('mousemove', onDocumentLabelMoveAgain, false);
            mainCanvas.addEventListener('mouseup', onDocumentLabelMoveAgainStop, false);
            orthoCameraRotation = false;

        }
    })

}

function ListScarchLabelID(sid) {

    var Selet = -1;
    LabelGroup.forEach(function(object) {
        Selet += 1;
        if (object.id == sid) {
            SelectLabelID = Selet;
            SelectLabel = object;
        }
    })

}

function onDocumentLabelMoveAgainStop(event) {
    mainCanvas.removeEventListener('mousemove', onDocumentLabelMoveAgain, false);
    scene.remove(plane2);
    LablePlaneobjects.pop();
    orthoCameraRotation = true;
}

function LabelDelete() {
    scene.remove(LabelGroup[SelectLabelID]);
    LabelGroup.splice(SelectLabelID, 1);
}

　
// document.addEventListener('keydown', deleteKey, false);

function deleteKey(event) {　　　
    if (event.keyCode == 46) {　　　　　　
        // console.log("DeleteLabel:", SelectLabelID);　
        LabelDelete();
    }
    if (event.keyCode == 49) {　　　　　　
        LabelRecanvas("卧室");
    }
    if (event.keyCode == 50) {　　　　　　　
        LabelRecanvas("客厅");
    }
    if (event.keyCode == 51) {　　　　　　　
        LabelRecanvas("厨房");
    }
    if (event.keyCode == 52) {　　　　　　　
        LabelRecanvas("洗手间");
    }
    if (event.keyCode == 53) {　　　　　　　
        // console.log("隐藏标签");
        HiddenLabel(false);
    }
    if (event.keyCode == 54) {　　　　　　　
        // console.log("显示标签");
        HiddenLabel(true);
    }
}

//Mesh模式移動 Start

//移动相关的变量
var clock = new THREE.Clock();

var controlsEnabled = false;

var moveForward = false;

var moveBackward = false;

var moveLeft = false;

var moveRight = false;

var canJump = false;

var spaceUp = true;

var velocity = new THREE.Vector3(); //移动速度

var direction = new THREE.Vector3(); //移动方向

var speed = 15; //控制器移动速度

var upSpeed = 5; //控制跳起时的速度

var Keytimer;


function KeyAddEvent(a) {
    MeshMove = a;
}

function renderMesh() {

    var onKeyDown = function(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if (canJump && spaceUp) velocity.y += upSpeed;
                canJump = false;
                spaceUp = false;
                break;
        }
    };

    var onKeyUp = function(event) {

        switch (event.keyCode) {

            case 38: // up

            case 87: // w

                moveForward = false;

                break;

            case 37: // left

            case 65: // a

                moveLeft = false;

                break;

            case 40: // down

            case 83: // s

                moveBackward = false;

                break;

            case 39: // right

            case 68: // d

                moveRight = false;

                break;

            case 32: // space

                spaceUp = true;

                break;

        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    //刷新时间
    var delta = clock.getDelta();
    controls = pointerLockControl;
    var control = controls.getObject();

    //velocity速度
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    

    if (control.position.y < 0.1) {

        velocity.y = 0;

        control.position.y = 0;

        canJump = true;

    }else{
        velocity.y -= 10 * delta; // 默认下降的速度
    }

    //获取当前按键的方向并获取朝哪个方向移动
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);

    //将法向量的值归一化
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    //根据速度值移动控制器
    control.translateX(velocity.x * delta);
    control.translateY(velocity.y * delta);
    control.translateZ(velocity.z * delta);
}

// function moveW(event)     {

//     var moveSpeed = 0.025; //Speed
//     var vector = new THREE.Vector3(0, 0, 1).unproject(pointerLockCamera);  

//     var tempStep = vector.sub(pointerLockControl.getObject().position).normalize();
//     var step = new THREE.Vector3(tempStep.x, tempStep.y, tempStep.z);    
//     pointerLockControl.getObject().position.x += step.x * moveSpeed;      
//     // pointerLockControl.getObject().position.y += step.y * moveSpeed;      
//     pointerLockControl.getObject().position.z += step.z * moveSpeed;

// }

// function moveS(event)     {

//     var moveSpeed = 0.025 //Speed
//     var vector = new THREE.Vector3(0, 0, 1).unproject(pointerLockCamera);  
//     var tempStep = vector.sub(pointerLockControl.getObject().position).normalize();
//     var step = new THREE.Vector3(tempStep.x, tempStep.y, tempStep.z);    
//     pointerLockControl.getObject().position.x -= step.x * moveSpeed;      
//     // pointerLockControl.getObject().position.y -= step.y * moveSpeed;      
//     pointerLockControl.getObject().position.z -= step.z * moveSpeed;

// }

// function moveA(event)     {

//     var moveSpeed = 0.025; //Speed
//     var vector = new THREE.Vector3(-10, 0, 0).unproject(pointerLockCamera);  

//     var tempStep = vector.sub(pointerLockControl.getObject().position).normalize();
//     // console.log("tempStep",tempStep);  
//     var step = new THREE.Vector3(tempStep.x, tempStep.y, tempStep.z);    
//     pointerLockControl.getObject().position.x += step.x * moveSpeed;      
//     // pointerLockControl.getObject().position.y += step.y * moveSpeed;      
//     pointerLockControl.getObject().position.z += step.z * moveSpeed;

// }

// function moveD(event)     {

//     var moveSpeed = 0.025; //Speed
//     var vector = new THREE.Vector3(10, 0, 0).unproject(pointerLockCamera);  

//     var tempStep = vector.sub(pointerLockControl.getObject().position).normalize();
//     // console.log("tempStep",tempStep);  
//     var step = new THREE.Vector3(tempStep.x, tempStep.y, tempStep.z);    
//     pointerLockControl.getObject().position.x += step.x * moveSpeed;      
//     // pointerLockControl.getObject().position.y += step.y * moveSpeed;      
//     pointerLockControl.getObject().position.z += step.z * moveSpeed;

// }



//Mesh模式移動 End
function LabelRecanvas(text) {

    LableSprit = initSpritLabelText((" " + text + " "),
        LabelGroup[SelectLabelID].position.x,
        LabelGroup[SelectLabelID].position.y,
        LabelGroup[SelectLabelID].position.z);
    scene.remove(LabelGroup[SelectLabelID]);
    LabelGroup.splice(SelectLabelID, 1, LableSprit);
    LableSprit.name = text;

}

//隐藏Label
function HiddenLabel(a) {
    LabelGroup.forEach(function(object) {
        object.visible = a;
    })
}

var timerAnimateZoom = setInterval(LabelZoom, 10);
var LabelscaleVector = new THREE.Vector3();

function LabelZoom() {

    LabelGroup.forEach(function(TagObject) {
        if (TagObject != null) {

            if (modeSwitch.isOrthographic()) {
                var scale = (orthoCamera.position.y * 0.25) / orthoCamera.zoom;
                TagObject.scale.set(scale, scale * 0.5, 1);
            }

        }

    });
}

//Label_init
// 定义新的modelLabel数据
let NewModelLabel = [];

function initLabel() {
    if (modelData.Label != undefined) {
        modelData.Label.forEach(function(object) {
            //console.log("object.position", object.position, "object.content", object.content);
            initLabelGreat(object.position, object.content);
        })
        modelData.Label = NewModelLabel;
    } else {
        modelData.Label = [];
    }
    sendAjax();
    // console.log(modelData);
}

function initLabelGreat(pos, name) {

    LableSprit = initSpritLabelText((" " + name + " "), pos.x, pos.y, pos.z);
    LabelGroup.push(LableSprit);
    LableSprit.visible = false;
    LableSprit.name = name;

    // 推入列表中
    labelPushlist(LableSprit.id, name);
    saveId = LableSprit.id;

    // 这里需要重新生成model.Label中的数据
    LabelFun(NewModelLabel, LableSprit.id, name, pos);
}

//Label_End


// 标尺推入modelData函数 start
function rulerFun(arr, point1, point2, Distance, icon, id) {
    arr.push({
        point1,
        point2,
        Distance,
        icon,
        id
    })
}
// 标尺推入modelData函数 end

// 标签推入modelData 函数 start
function LabelFun(arr, id, content, position) {
    arr.push({
        id,
        content,
        position
    })
}
// 标签推入modelData 函数 end


// 标签添加文字信息开始
function txtCount(el) {
    var val = el.value;
    var eLen = val.length;
    return eLen;
}

$('.title-box>textarea').bind('input propertychange', function() {
    // 检测当前字符数量
    let len = txtCount(this);
    $('.chart-size').text(len + '个字符');
    $('.Child1-title').text($(this).val())
});
$('.content-box>textarea').bind('input propertychange', function() {
    // 检测当前字符数量
    let len = txtCount(this);
    $('.content-size').text(len + '个字符');
    $('.Child2-content').text($(this).val());
});
$('.Media-box>input').bind('input propertychange', function() {
    if ($(this).val().length > 0) {
        $('.bgMusic-upload>.Media-box>.fileuploadbtn').addClass('disabled')
    } else {
        $('.bgMusic-upload>.Media-box>.fileuploadbtn').removeClass('disabled')
    }
});

// 标签添加文字信息结束
//标签颜色选择开始

let material_blue = new THREE.SpriteMaterial({
    map: texture,
    map: THREE.ImageUtils.loadTexture('image/TagRound_red.png')
});

$('.color-radius>p').click(function(e) {
    $('.color-radius>p').removeClass('active');
    $(this).addClass('active');
    //let colorSize = $(this).css('backgroundColor');
    var colorSize = $(this).attr('data-value');
    // console.log(colorSize);
    TagObjects[TagSelet].TagRound.name = colorSize;
    TagObjects[TagSelet].TagRound.material = new THREE.SpriteMaterial({
        map: texture,
        map: THREE.ImageUtils.loadTexture('image/TagRound_' + colorSize + '.png')
    });
})

//标签颜色选择结束


// 标签开关点击开始
$('.ShowCase>ul>li').click(function(e) {
    let index = $(this).attr('data-index');
    if (index == 1) {
        if ($(this).find('label').attr('class').indexOf('active') != -1) {
            $(this).find('label').removeClass('active active1');
            // console.log('标签隐藏')
            TagObjects[TagSelet].TagGroup.visible = false;
            TagDivvisible(false);
            // 图标
            $('.mattertagList>li[value=' + TagObjects[TagSelet].TagGroup.name + ']').find('i').removeClass('icon-xianshikejian').addClass('icon-yincangbukejian');
        } else {
            $(this).find('label').addClass('active active1');
            // console.log('标签显示')
            TagObjects[TagSelet].TagGroup.visible = true;
            TagDivvisible(true);
            // 图标
            $('.mattertagList>li[value=' + TagObjects[TagSelet].TagGroup.name + ']').find('i').removeClass('icon-yincangbukejian').addClass('icon-xianshikejian');
        }
    } else if (index == 2) {
        if ($(this).find('label').attr('class').indexOf('active') != -1) {
            $(this).find('label').removeClass('active active1');
            // console.log('线条隐藏')
            TagObjects[TagSelet].Line.visible = false;
        } else {
            $(this).find('label').addClass('active active1');
            // console.log('线条显示')
            TagObjects[TagSelet].Line.visible = true;
        }
    }
})
// 标签开关点击结束


//标签完成按钮
$('.addMattertag').click((e) => {

    popEditHid();
    TagDivvisible(false);

    translateNavEnd();
    $(".nav-icon-right-list").removeClass('active');

    // 保存资源


    TagDivContentSave(TagObjects[TagSelet]);

    UpdateHotlist();

    let arr = fortagobjectsArray(tagobjectsArrayAll);
    // console.log(arr);
    modelData.tags = arr;
    sendAjax();

})


//标签删除按钮
$('.removeMattertag').click((e) => {

    popEditHid();
    translateNavEnd();
    $(".nav-icon-right-list").removeClass('active');

    let mid = TagObjects[TagSelet].TagGroup.children[2].id;
    for (let i = 0; i < tagobjectsArray.length; i++) {
        if (tagobjectsArray[i].id == mid) {
            //删除数组中的tag
            tagobjectsArray.splice(i, 1);
            tagobjectsArrayAll.splice(i, 1);
        }
    }

    //删除场景中的tag
    scene.remove(TagObjects[TagSelet].TagGroup);

    // console.log("tagobjectsArray长度", tagobjectsArray.length);
    //删除数组中的tag,删除后保留null占位；
    TagObjects.splice(TagSelet, 1, null);

    TagDivvisible(false);

    let arr = fortagobjectsArray(tagobjectsArrayAll);
    modelData.tags = arr;
    sendAjax();

    $('.mattertagList>li[value=' + TagSelet + ']').remove();

})

// 重置按钮
$('.steam-reset').click(function(e) {
    var m = new RESETOBJ(0.2);
    $('.heightAdjustment').val(m.ShowLength());
    TagObjects[TagSelet].Line.scale.z = m.ShowLength();
    TagObjects[TagSelet].Line.name = m.ShowLength();
    TagObjects[TagSelet].Line.position.z = 0.25 * m.ShowLength();
    TagObjects[TagSelet].TagRound.position.z = 0.5 * m.ShowLength();
})


function fortagobjectsArray(arr) {
    let tags = [];
    // // 判断当前是哪个地方有地址
    // let oneImg = $('.Child3-Resources>img').attr('src');
    // let twoIframe = $('.Child3-Resources>iframe').attr('src');
    // let Resources;
    // let Marker;
    // if (oneImg != '') {
    //     Resources = oneImg
    //     Marker = 'img'
    // } else if (twoIframe != '') {
    //     Resources = twoIframe
    //     Marker = 'iframe'
    // }
    arr.forEach((item, index) => {
        tags.push({
            color: item.TagRound.name,
            linelen: item.Line.name,
            position: item.TagGroup.position,
            rotation: item.TagGroup.rotation,
            title: item.title,
            content: item.content,
            Resources: item.Resources,
            Marker: item.Marker
        })
    })
    return tags
}



//------------摸墙效果------------
//创建原点
var geometry_touch = new THREE.CircleBufferGeometry(0.01, 32);

//放置后的材质
var material_touch = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
    map: THREE.ImageUtils.loadTexture('image/point1.png')
});

//移动中的模型
var Dynamic_touch = new THREE.Mesh(geometry_touch, material_touch);
//注册摸墙效果
if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {} else {
    mainCanvas.addEventListener('mousemove', onDocumentDynamic_touch, false);
}

//注册选中标签
mainCanvas.addEventListener('mouseup', onDocumentMouseupTag, false);
mainCanvas.addEventListener('mouseup', onDocumentMouseupVideo, false);

mainCanvas.addEventListener('mousedown', onDocumentMousedwonMeasure, false);
scene.add(Dynamic_touch); //创建大饼

function TouchTheWall() {
    //摸墙效果持续执行
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {} else {
        var timer = setInterval(onDocumentDynamic_Anytime, 10);
    }
    var timer = setInterval(TagMove_Anytime, 1);

}

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

//------------摸墙效果END------------



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


//创建标签模型
// function TagGround(a, b, c, d, e, f) {
//   var TagGround = new THREE.Mesh(geometry, material);
//   scene.add(TagGround);
//   TagGround.position.set(a, b, c);
//   TagGround.rotation.set(d, e, f);
//   console.log("创建新大饼");
// }

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



//标签文字模块
function initSpritTagText(text, positionX, positionY, positionZ) {
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
    spriteOrigin.height = 0.5;
    scene.add(spriteOrigin);
    spriteOrigin.position.set(positionX, positionY, positionZ);
    return spriteOrigin;
}


//按键启动
$('.matterIcon').click(function() {
    console.log(333)
    celiangClose();
    LabelCancel();

    hideGuide();
    //进入walkingMode
    if (!modeSwitch.isWalkingMode()) {
        setWalkingViewPoint(0);
    }

    translateNavEnd();


    let key = $('.matterIcon').attr('class').indexOf('active');
    if (key == -1) {
        if (CanvasState) {
            // console.log('AddTag');
            CanvasState = false;
            mainCanvas.addEventListener('mouseup', onDocumentAddTag, false);
            mainCanvas.addEventListener('mousemove', onDocumentMoveTag, false);

            // scene.add(TagDynamic); //创建大饼
            // scene.add(LineDynamic); //创建线条
            scene.add(groupTag);
            groupTag.add(TagDynamic);
            groupTag.add(LineDynamic);
            groupTag.add(createSpriteShape());
            groupTag.visible = false; //创建后隐藏tag

            //解除摸墙效果
            if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {} else {
                mainCanvas.removeEventListener('mousemove', onDocumentDynamic_touch, false);
            }

        }
    } else {
        AddTagCancel();
        setTimeout(() => {
            $(this).removeClass('active');
        }, 500)
    }


})


var lineset;

function onDocumentMoveTag(event) {

    if (event.button == 0) {

        //获取鼠标的x，y坐标
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;

        if (modeSwitch.isWalkingMode()) {
            raycaster.setFromCamera(mouse, pointerLockCamera);
            intersects = raycaster.intersectObjects(model.children);
        }

        if (intersects.length > 0) {


            var n = intersects[0].face.normal.clone();
            n.transformDirection(model.matrixWorld);
            n.multiplyScalar(10);
            n.add(intersects[0].point);

            groupTag.visible = true; //显示tag

            // TagDynamic.position.copy(intersects[0].point);

            // TagDynamic.lookAt(n);

            // LineDynamic.position.copy(intersects[0].point);
            // LineDynamic.lookAt(n);

            groupTag.position.copy(intersects[0].point);
            groupTag.lookAt(n);


            //缩放保持sprit不变
            var scaleVector = new THREE.Vector3();
            var scaleFactor = 2.5;
            var sprite = groupTag;

            if (modeSwitch.isWalkingMode()) {
                var scale = scaleVector.subVectors(groupTag.position, pointerLockControl.getObject().position).length() / scaleFactor;
            }
            sprite.scale.set(scale, scale, 1);

        }

    }

}

//储存标签到数组供选取；
var tagobjectsArray = [];
var tagobjectsArrayAll = [];
var TagSelet;


// 热点打下
function onDocumentAddTag(event) {

    if (event.button == 0) {

        //克隆新的tag
        //var TagParticle = TagDynamic.clone();

        Tagline = groupTag.clone();
        scene.add(Tagline);

        var TagObject = {}; //创建结构体数组

        TagObject.Round = Tagline.children[0];
        TagObject.Line = Tagline.children[1];
        TagObject.Line.name = TagObject.Line.scale.z;
        TagObject.TagRound = Tagline.children[2];
        TagObject.TagRound.name = "blue";
        TagObject.TagGroup = Tagline;
        TagObject.TagGroup.name = TagObjects.length;
        //console.log("TagObject",TagObject);

        TagDivContent("热点 " + (TagObjects.length + 1), "", TagObject);

        TagObjects.push(TagObject);

        TagSelet = TagObjects.length - 1;

        TagObjects[TagSelet].Round.scale.x = TagObjects[TagSelet].Round.scale.y = 3;
        TagObjects[TagSelet].Round.material = material;

        //console.log(Tagline.childen.length);

        // console.log('TagParticle');

        //结束本次放置
        // console.log('AddTag_End');
        CanvasState = true;
        mainCanvas.removeEventListener('mouseup', onDocumentAddTag, false);
        mainCanvas.removeEventListener('mousemove', onDocumentMoveTag, false);
        //恢复摸墙效果
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {} else {
            mainCanvas.addEventListener('mousemove', onDocumentDynamic_touch, false);
        }

        //清除跟随鼠标的tag
        groupTag.remove(groupTag.children[0], groupTag.children[1], groupTag.children[2]);
        scene.remove(groupTag);

        //添加到数组
        tagobjectsArray.push(TagObjects[TagSelet].TagRound);
        tagobjectsArrayAll.push(TagObjects[TagSelet]);

        if (intersects[0] != undefined) {
            MoveTagDiv(intersects[0].object.parent.children[2]); //返回标签坐标
        }

        $('#tagmove').css('display', 'block');
        $('#tagmoveArrow').css('display', 'block');
        // console.log(tagobjectsArray)
        //弹出设置面板
        popEdit('mattertagBoard');
        translateNav();
        $(".nav-icon-right-list").addClass('active');
        $(".icon-left-show>div").removeClass('active');

        UpdateHotlist();

        // 修改iframe中的样式文件
        $('#Iframe-view').contents().find('body').css({
            margin: 0,
            padding: 0,
            'list-style': 'none'
        }).find('video').css({
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%'
        })

        // 隐藏当前所有的资源显示
        hideZiyuan();


        $('.heightAdjustment').on('input', function() {

            //console.log("value",$('.heightAdjustment').val());
            //控制标签线条长度
            //SetLine($('.heightAdjustment').val());
            TagObjects[TagSelet].Line.scale.z = $('.heightAdjustment').val();
            TagObjects[TagSelet].Line.name = parseFloat($('.heightAdjustment').val());
            TagObjects[TagSelet].Line.position.z = 0.25 * $('.heightAdjustment').val();
            TagObjects[TagSelet].TagRound.position.z = 0.5 * $('.heightAdjustment').val();

        })

        TagDivvisible(true); //显示标签
    }

}

function AddTagCancel() {
    CanvasState = true;
    mainCanvas.removeEventListener('mouseup', onDocumentAddTag, false);
    mainCanvas.removeEventListener('mousemove', onDocumentMoveTag, false);
    //恢复摸墙效果
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {} else {
        mainCanvas.addEventListener('mousemove', onDocumentDynamic_touch, false);
    }

    //清除跟随鼠标的tag
    groupTag.remove(groupTag.children[0], groupTag.children[1], groupTag.children[2]);
    scene.remove(groupTag);
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
                popEdit('mattertagBoard');
                translateNav();
                $(".nav-icon-right-list").addClass('active');

            }

        }

    }
}


function TagsVisible(a) {
    TagObjects.forEach(function(object) {
        object.TagGroup.visible = a;
    })

    TagDivvisible(a);
}

//20181009Ning+ Tag_End


// 视图操作开始
$(document).on('click', function(e) {
    $('.MeshTip').animate({
        opacity: 0
    }, 500, () => {
        $('.MeshTip').hide();
    })
});
$('.nav-icon-right').click(function(e) {
    e.stopPropagation();
    $('.nav-icon-right-list').toggle(200);
})

$('.nav-icon-right-list>ul>li').click(function(e) {
    hideGuide();
    let index = $(this).attr('data-index');
    let icon = $(this).find('i').attr('class');
    $('.nav-icon-right-top>i:first-child').attr('class', icon);
    TagDivvisible(false);
    if (index == 0) {
        // console.log('mesh');        
        if (curIndex == -1){
                setWalkingMeshView(0);
            }else{
                setWalkingMeshView(curIndex);
            }
        
        HiddenMeasure2D();//隐藏2D标尺
        ShowMeasure3D();//显示3D标尺
        KeyAddEvent(true);
        // 加入友好提示
        $('.MeshTip').show().animate({
            opacity: 1
        }, 500)
    } else if (index == 1) {
        monirenxingClick();
    } else if (index == 2) {
        threeDclick();
    } else if (index == 3) {
        TwoDclick();
    }
})
// 视图操作结束


// 导航操作开始
$('.icon-left-show>div').click(function(e) {
    $('.icon-left-show>div').removeClass('active');
    $(this).toggleClass('active');
})
// 导航操作结束




// wang+ 渲染标尺列表 start 
function RulerRender() {
    if (!modelData.Ruler) {
        return false
    }
    let arr = modelData.Ruler;
    const p = new Promise((resolve, reject) => {
        for (let i = 0; i < arr.length; i++) {
            $('.RulerManagement').prepend(`
           <li value="` + arr[i].id + `">
               <i class="` + arr[i].icon + `"></i>
               <span>` + arr[i].Distance + `m</span>
           </li>
         `);
        }
        resolve();
    }).then(() => {
        $('.RulerManagement>li').click(function(e) {
            popEdit('Measurements');
            translateNav();
            $(".nav-icon-right-list").addClass('active');
            $('.Measurements-length>span').text($(this).find('span').text());
        })
    }).catch((error) => {
        console.log(error);
    })
}
// wang+ 渲染标尺列表 end 



//spritUnchanged
var timerAnimateZoom = setInterval(AnimateZoom, 10);
var scaleVector = new THREE.Vector3();

function AnimateZoom() {

    TagObjects.forEach(function(TagObject) {
        if (TagObject != null) {
            var scaleFactor = 2.5;
            var sprite = TagObject.TagGroup;

            if (modeSwitch.isWalkingMode()) {
                var scale = scaleVector.subVectors(TagObject.TagGroup.position, pointerLockControl.getObject().position).length() / scaleFactor;
            } else if (modeSwitch.isOrthographic()) {
                var scale = (orthoCamera.position.y * 0.4) / orthoCamera.zoom;
            } else if (modeSwitch.isOverallMode()) {
                var scale = scaleVector.subVectors(TagObject.TagGroup.position, orbitCamera.position).length() / scaleFactor;
            }
            sprite.scale.set(scale, scale, 1);
        }

    });
}


//标签坐标返回
function ReturnLabelPOS(obj) {
    //创建一个3D坐标
    var vector = new THREE.Vector3();
    vector = vector.setFromMatrixPosition(obj.matrixWorld).project(pointerLockCamera);
    var halfWidth = window.innerWidth / 2;
    var halfHeight = window.innerHeight / 2;
    // console.log(vector.x * halfWidth + halfWidth)
    var result = {
        x: Math.round(vector.x * halfWidth + halfWidth),
        y: Math.round(-vector.y * halfHeight + halfHeight)
    };
    //2D坐标
    // console.log(result);
    GreateTagDiv(result)
}

//移动divtag
function MoveTagDiv(obj) {
    //创建一个3D坐标
    var vector = new THREE.Vector3();
    if (modeSwitch.isWalkingMode()) {
        vector = vector.setFromMatrixPosition(obj.matrixWorld).project(pointerLockCamera);
    } else if (modeSwitch.isOrthographic()) {
        vector = vector.setFromMatrixPosition(obj.matrixWorld).project(orthoCamera);
    } else if (modeSwitch.isOverallMode()) {
        vector = vector.setFromMatrixPosition(obj.matrixWorld).project(orbitCamera);
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
    var tagmoveArrow = document.createElement('div');

    mattertagTitleShowChild1.setAttribute('class', 'Child1-title');
    mattertagTitleShowChild2.setAttribute('class', 'Child2-content');
    mattertagTitleShowChild3.setAttribute('class', 'Child3-Resources');
    mattertagTitleShowChild3Childen.setAttribute('src', '');
    mattertagTitleShowChild3Childen.setAttribute('style', 'display:none');
    mattertagTitleShowChild3ChildenIframe.setAttribute('name', '资源');
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
    mattertagTitleShowChild3ChildenIframe.append('<p>你的浏览器不支持iframe标签</p>')
    tagmoveArrow.setAttribute('id', 'tagmoveArrow');
    tagmoveArrow.setAttribute('style', 'position: absolute');

    mattertagTitleShowChild1.innerHTML = '热点1';
    mattertagTitleShowChild2.innerHTML = '';
    mattertagTitleShowChild3.append(mattertagTitleShowChild3Childen);
    mattertagTitleShowChild3.append(mattertagTitleShowChild3ChildenIframe);
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
    // mattertagTitleShowChild1.style.fontsize = "larger";
    mattertagTitleShowChild1.style.fontFamily = "微软雅黑";
    // mattertagTitleShowChild2.style.paddingTop = "10px";
    mattertagTitleShowChild2.style.color = "#a7a7a7";
        // div.style.backgroundColor = "#000000";
    // div.style.padding = "5px";
    // div.style.opacity = "0.5";
    // div.style.borderWidth = "18px";
    // div.style.borderColor = "#fff";
    // div.style.width = "200px";
    // div.style.height = "100px";
    // div.style.marginLeft = "0";
    // div.style.marginTop = "0";
    // div.style.position = "absolute";
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



//Change label content
function TagDivContent(title, Content, structural) {
    var divtitle = document.getElementsByClassName("Child1-title");
    var divContent = document.getElementsByClassName("Child2-content");
    divtitle[0].innerHTML = title;
    divContent[0].innerHTML = Content;
    structural.title = title;
    structural.content = Content;
    $('.title-box>textarea').val(title);
    $('.content-box>textarea').val(Content);
}

function TagDivContentSave(structural) {
    var divtitle = document.getElementsByClassName("Child1-title");
    var divContent = document.getElementsByClassName("Child2-content");
    let Resources;
    let Marker;
    let res = $('.title-testarea>.Media-box>input').val();
    let index = res.lastIndexOf('.');
    let str = res.substring(index, res.length);
    const videoArr = ['.mp4'];
    const audioArr = ['.mp3', '.m4a', '.WMA', '.APE', '.FLAC', '.AAC', 'AC3', '.MMF', '.AMR', '.M4R', '.OGG', '.MAV', '.WavPack', '.MP2'];
    const imgArr = ['.jpg', '.psd', '.gif', '.jpeg', '.png', '.pdf', '.svg'];
    Resources = res
    if (res.length <= 0) {
        Marker = '';
        Resources = ''
    }
    if (audioArr.includes(str)) {
        Marker = 'audio'
    } else if (videoArr.includes(str)) {
        Marker = 'iframe'
    } else if (imgArr.includes(str)) {
        Marker = 'img'
    } else if (str.indexOf('.cn/uploads/') != '-1') {
        Marker = 'iframe'
    } else {
        Marker = ''
    }

    structural.Marker = Marker;
    structural.Resources = Resources;

    // 输入文字
    if (divtitle[0].innerHTML.length > 0) {
        structural.title = divtitle[0].innerHTML;
        // $(".mattertagListLi>span").text(structural.title);

    } else {
        divtitle[0].innerHTML = structural.title;
    }
    structural.content = divContent[0].innerHTML;
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
    }
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
            TagObject.Round.material = material;

            groupTag.remove(groupTag.children[0], groupTag.children[1], groupTag.children[2]);
            scene.remove(groupTag);

            tagobjectsArray.push(TagObject.TagRound);
            tagobjectsArrayAll.push(TagObject);


        })

        UpdateHotlist();
    }

}


$('.heightAdjustment').on('input', function() {

    TagObjects[TagSelet].Line.scale.z = $('.heightAdjustment').val();
    TagObjects[TagSelet].Line.name = parseFloat($('.heightAdjustment').val());
    TagObjects[TagSelet].Line.position.z = 0.25 * $('.heightAdjustment').val();
    TagObjects[TagSelet].TagRound.position.z = 0.5 * $('.heightAdjustment').val();

})



// 更新热点列表
function UpdateHotlist() {
    const p = new Promise((resolve, reject) => {
        // 追加热点列表
        let newLi = '';
        tagobjectsArrayAll.forEach((item, index) => {
            if (!item.TagGroup.visible) {
                newLi += "<li class='mattertagListLi' value=" + item.TagGroup.name + "><span>" + item.title + "</span><i class='iconfont icon-yincangbukejian'></i></li>";
            } else {
                newLi += "<li class='mattertagListLi' value=" + item.TagGroup.name + "><span>" + item.title + "</span><i class='iconfont icon-xianshikejian'></i></li>";
            }
        });
        $('.mattertagList').html(newLi);
        resolve();
    }).then(() => {
        // 绑定事件
        $('.mattertagListLi').click(function(e) {
            hideGuide();
            TagSelet = $(this).attr('value');
            // 弹出操作界面
            popEdit('mattertagBoard');


            $('.heightAdjustment').unbind('input');
            translateNav();
            $(".nav-icon-right-list").addClass('active');
            $(".icon-left-show>div").removeClass('active');

            // 设置当前点击的热点的属性
            let captionShow = TagObjects[TagSelet].title;
            let substanceShow = TagObjects[TagSelet].content;

            $('.title-box>textarea').val(captionShow);
            $('.Child1-title').text(captionShow);
            $('.content-box>textarea').val(substanceShow);
            $('.Child2-content').text(substanceShow);

            //
            // console.log("TagObjects[TagSelet]", TagObjects[TagSelet]);
            const colorShow = TagObjects[TagSelet].TagRound.name;
            const distanceShow = TagObjects[TagSelet].Line.name;

            const lineShow = TagObjects[TagSelet].Line.visible;
            const markShow = TagObjects[TagSelet].TagGroup.visible;


            let Marker = TagObjects[TagSelet].Marker;
            let Resources = TagObjects[TagSelet].Resources;
            $('.title-testarea>.Media-box>input').val(Resources);

            $('.Child3-Resources').children().hide();
            $('.audioPlay').hide();

            if (Marker == 'img') {
                $('.Child3-Resources>img').show().css('src', Resources)

            } else if (Marker == 'iframe') {
                $('.Child3-Resources>iframe').show().css('src', Resources)
            } else if (Marker == 'audio') {
                $('.audioPlay').show().children('audio').css('src', Resources)
            } else {}

            //MoveTagDiv(TagObjects[TagSelet].TagGroup.TagRound);

            //TagDivContentSet(TagObjects[TagSelet]);


            $('.color-radius>p').removeClass('active');
            $('.color-radius>p[data-value=' + colorShow + ']').addClass('active');
            $('.heightAdjustment').val(distanceShow);
            // 开关
            if (!lineShow) {
                $('.ShowCase>ul>li[data-index=2]>label').removeClass('active active1')
            } else {
                $('.ShowCase>ul>li[data-index=2]>label').addClass('active active1')
            }
            if (!markShow) {
                $('.ShowCase>ul>li[data-index=1]>label').removeClass('active active1');
                TagDivvisible(false); //隐藏
            } else {
                $('.ShowCase>ul>li[data-index=1]>label').addClass('active active1');
                TagDivvisible(true); //显示标签
            }
            //

            $('.heightAdjustment').on('input', function() {

                TagObjects[TagSelet].Line.scale.z = $('.heightAdjustment').val();
                TagObjects[TagSelet].Line.name = parseFloat($('.heightAdjustment').val());
                TagObjects[TagSelet].Line.position.z = 0.25 * $('.heightAdjustment').val();
                TagObjects[TagSelet].TagRound.position.z = 0.5 * $('.heightAdjustment').val();

            })


        })

    })
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

            //LookAtTag(structural);

        }
    }
}



// screen
var scaleNum = 100;

$('.exit').click((e) => {
    e.stopPropagation();
    TagsVisible(true);
    HiddenLabel(true);
    ShowMeasure();
    $('.content-nav-left').show();
    $('.content-nav-top').show();
    $('.content-nav-right').show();
    $('.header').show();
    $('.InterceptScreen').css('visibility', 'hidden');
    $(".icon-left-show>div").removeClass('active');
})

$('.assect').click(function(e) {
    e.stopPropagation();
    if ($(this).find('i').hasClass('icon-xianshikejian')) {
        $(this).find('i').removeClass('icon-xianshikejian').addClass('icon-yincangbukejian');
        TagsVisible(false);
        HiddenLabel(false);
        HiddenMeasure();
    } else {
        $(this).find('i').removeClass('icon-yincangbukejian').addClass('icon-xianshikejian');
        TagsVisible(true);
        HiddenLabel(true);
        ShowMeasure();
    }
})

$('.add>img[data-index=cup]').click((e) => {
    e.stopPropagation();
    scaleNum -= 10;
    if (scaleNum <= 70) {
        scaleNum = 70
    }
    pointerLockCamera.zoom = scaleNum * 0.01;
    pointerLockCamera.updateProjectionMatrix();
    $('.add>p').text(scaleNum + '%');
})

$('.add>img[data-index=add]').click((e) => {
    e.stopPropagation();
    scaleNum += 10;
    if (scaleNum >= 300) {
        scaleNum = 300
    }
    pointerLockCamera.zoom = scaleNum * 0.01;
    pointerLockCamera.updateProjectionMatrix();
    $('.add>p').text(scaleNum + '%');
})


// 贴图开始
var FileType;;
class MapObj {
    constructor(px, py, pz, sx, sy, sz, ox, oy, oz, type, src, name, id) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.sx = sx;
        this.sy = sy;
        this.sz = sz;
        this.ox = ox;
        this.oy = oy;
        this.oz = oz;
        this.type = type;
        this.src = src;
        this.name = name;
        this.id = id;
    }

    change(key, val) {
        this[key] = val
    }
}

// 贴图按钮启动
$('.MapVideo').click(() => {
    hideGuide();
    // 跳转到漫游模式
    if (!modeSwitch.isWalkingMode()) {
        setWalkingViewPoint(0);
        setTimeout(() => {
            $(".icon-left-show>div").removeClass('active');
        }, 500)
        return false
    }
    // 显示列表选择
    $('.MapVideo>div').toggle();
})

$('.MapVideo>div>ul>li').click(function(e) {
    let key = $(this).attr('data-index');
    if (key == 1) {
        console.log('实时监控');
        FileType = 'realTime';
    } else if (key == 2) {
        console.log('普通视频');
        FileType = 'Uploading';
    }
    else if(key == 3) {
        console.log('透明视频');
        FileType = 'transparent';
    }

    // 启动贴图
    switchAdd = true;
})


$('.MapManagement').on('click', 'li', function(e) {
    let index = $(this).attr('data-index');
    let val = $(this).children('span').text();
    let type = $(this).attr('data-FileType');
    if (type == 'Uploading') {

    } else if (type == 'realTime') {

    }
    // 设置名称
    $('.MapName>input').val(val);
    // 弹出列表
    popEdit('MapVideoContent');
    translateNav();
    $(".nav-icon-right-list").addClass('active');
    $(".icon-left-show>div").removeClass('active');
})









// 贴图结束


// $('.rangeControls>.rangeContent>.range-field>input').on('input', function () {
//     $(this).parent().siblings('.showVal').css('opacity', 0)
//     let val = parseInt($(this).val());
//     let key = $(this).attr('data-index');
//     chooseMap.change(key, val);
//     // console.log(chooseMap)
//     $(this).attr('value', val)
// })

// 贴图开始
var FileType;;


$('.bgmusic').click((e) => {
    hideGuide();
    // pop
    $('.beijingyinyueShow').show();
})

$('.BgmusicCancle').click((e) => {
    $('.bgMusic-upload>i').click();
})
$('.bgMusic-upload>i').click((e) => {
    $('.beijingyinyueShow').hide();
})

$('.BgmusicOk').click((e) => {
    let val = $('.bgMusic-upload input').val();
    if (val.length == 0) {
        alert('请输入资源链接');
        return false
    }
    $('.bgMusic-upload>i').click();
    let index = val.lastIndexOf('.');
    let str = val.substring(index, val.length);
    let audioArr = ['.mp3', '.m4a', '.WMA', '.APE', '.FLAC', '.AAC', 'AC3', '.MMF', '.AMR', '.M4R', '.OGG', '.MAV', '.WavPack', '.MP2'];
    if (audioArr.includes(str)) {
        modelData.BgMusicLink = val;
        modelData.BgMusic = true;
        $('#backgroundMusic').siblings('label').addClass('active active1');
        sendAjax();
    } else {
        alert('上传的文件格式不符合');
        return false;
    }
})
// 背景音乐结束

// 贴图结束


// label start wang+

$('.Label-content-collection>ul>li').click(function(e) {
    e.stopPropagation();
    let val = $(this).find('span').text();
    $('.Label-content-collection>ul>li').removeClass('active');
    $(this).addClass('active')

    // 删掉原来的，添加新的
    $('.LabelManagement>li[data-index=' + saveId + ']').find('span').text(val);
    textareaText(val)
    LabelRecanvas(val);
    $('.LabelManagement>li[data-index=' + saveId + ']').attr('data-index', LableSprit.id);
    // 修改model.json中的数据
    let p = new Promise((resolve, reject) => {
        let arr = modelData.Label;
        arr.forEach((item, index) => {
            if (item.id == saveId) {
                item.id = LableSprit.id;
                item.content = val;
                resolve();
            }
        })
    }).then(() => {
        saveId = LableSprit.id;
        sendAjax();
    })
})


$('.Labelconfirm').click((e) => {
    let val = removeAllSpace($('.Label-content textarea').val())
    LabelRecanvas(val)
    labelTextChange(saveId, val);
    // 修改model.json
    let p = new Promise((resolve, reject) => {
        let arr = modelData.Label;
        arr.forEach((item, index) => {
            if (item.id == saveId) {
                item.id = LableSprit.id;
                item.content = val;
                resolve();
            }
        })
    }).then(() => {
        // 删掉原来的，添加新的
        $('.LabelManagement>li[data-index=' + saveId + ']').find('span').text(val);
        $('.LabelManagement>li[data-index=' + saveId + ']').attr('data-index', LableSprit.id);
        saveId = LableSprit.id;
        sendAjax();
        console.log(saveId)
    })
    e.stopPropagation();
    popEditHid();
    translateNavEnd();
    $(".nav-icon-right-list").removeClass('active');

})

function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}
$('.Labeldelete').click((e) => {
    e.stopPropagation();
    popEditHid();
    translateNavEnd();

    LabelDelete();
    lableDeletelist(saveId);
    // 删除model.json中的数据
    deleteModelJsonLabel(saveId);
    $(".nav-icon-right-list").removeClass('active');
})


$('.Label-content textarea').on('change', function() {
    // let val = $(this).val();
    // LabelRecanvas(val)
    // labelTextChange(saveId, val);
    // // 修改model.json
    // let p = new Promise((resolve, reject) => {
    //     let arr = modelData.Label;
    //     arr.forEach((item, index) => {
    //         if (item.id == saveId) {
    //             item.id = LableSprit.id;
    //             item.content = val;
    //             resolve();
    //         }
    //     })
    // }).then(() => {
    //     saveId = LableSprit.id;
    //     sendAjax();
    // })
})

// 外部連接開始
$('.content-box-link').click((e) => {
    e.stopPropagation();
    $('.content-box-link-con').show();
})

$('.link-header>i').click((e) => {
    e.stopPropagation();
    $('.content-box-link-con').hide();
})
$('.link-confirm').click((e) => {
    e.stopPropagation();
    let Linkaddress = $('.link-inset>input').val();
    let Linkval = $('.link-url>input').val();
    // 判断地址地址有效
    $.ajax({
        url: Linkval,
        type: 'GET',
        complete: function(response) {
            if (response.status == 200) {
                let val = $('.content-box>textarea').val();
                if (Linkaddress == '' && Linkval == '') return;
                if (Linkaddress != '') {
                    $('.Child2-content').append('<a href="' + Linkval + '">' + Linkaddress + '<i class="iconfont icon-tiaozhuan"></i></a>');
                    $('.content-box>textarea').val(val + Linkaddress);
                } else {
                    $('.Child2-content').append('<a href="' + Linkval + '">' + Linkval + '<i class="iconfont icon-tiaozhuan"></i></a>');
                    $('.content-box>textarea').val(val + Linkval);
                }
                $('.content-box-link-con').hide();
            } else {
                $('.link-note').show();
                return false
            }
        }
    });
})
$('.link-cancle').click((e) => {
    e.stopPropagation();
    $('.content-box-link-con').hide();
})


$('.link-url>input').on('input', function() {
    $('.link-note').hide()
})
// 外部連接结束

function labelPushlist(id, name) {
    let p = new Promise((resolve, reject) => {
        $('.LabelManagement').prepend(`
            <li data-index="` + id + `">
                <span>` + name + `</span>
            </li>
        `);
        resolve();
    }).then(() => {
        // 绑定事件
        $('.LabelManagement>li[data-index=' + id + ']').on('click', function(e) {
            e.stopPropagation();
            hideGuide();
            let id = $(this).attr('data-index');
            saveId = id;
            let val = $(this).find('span').text();
            $(".nav-icon-right-list").addClass('active');
            popEdit('Label');
            translateNav();
            // 修改textarea
            textareaText(val);
            // 修改选中的值
            collectionChange(val);
            // 修改canvas中的值
            ListScarchLabelID(id)
        })
    })
}


function labelTextChange(id, val) {
    $('.LabelManagement>li[data-index=' + id + ']').find('span').text(val)
}

function labelindexChange(id, newID) {
    $('.LabelManagement>li[data-index=' + id + ']').attr('data-index', newID)
}

function lableDeletelist(id) {
    console.log(id)
    $('.LabelManagement>li[data-index=' + id + ']').remove();
}

function textareaText(val) {
    $('.Label-content').find('textarea').val(val);
}

function collectionChange(val) {
    $('.Label-content-collection>ul>li').removeClass('active');
    $('.Label-content-collection>ul>li[data-value=' + val + ']').addClass('active');
}

// 保存model.json中
function saveLabelModelJson(LableSprit) {
    let arr = modelData.Label;
    if (!arr) {
        arr = [];
    }
    arr.push({
        position: LableSprit.position,
        id: LableSprit.id,
        content: '未命名'
    })
    modelData.Label = arr;
    sendAjax();
}

// 删除model.json中
function deleteModelJsonLabel(saveId) {
    let arr = modelData.Label;
    arr.forEach((item, index) => {
        if (item.id == saveId) {
            arr.splice(index, 1);
        }
    })
    sendAjax();
}

// label end wang-


function translateNav() {
    $(".nav-icon-right").css({
        'transform': 'translate(-213px)'
    });
    $(".nav-icon-right-list").css({
        'transform': 'translate(-43px)'
    });
}


function translateNavEnd() {
    $(".nav-icon-right").css({
        'transform': 'translate(0)'
    });
    $(".nav-icon-right-list").css({
        'transform': 'translate(0)'
    });
}

// 弹出操作界面函数 start 
function popEdit(key) {
    editControlPan = true;
    // 弹出操作界面
    $('.content-nav-right').css({
        'transform': 'translateX(0)'
    })
    $('.content-nav-right>div').hide();
    if (key == 'mattertagBoard') {
        $('.mattertagBoard').show();
    } else if (key == 'labelBoard') {
        $('.labelBoard').show();
    } else if (key == 'imgEdit') {
        $('.imgEdit').show();
    } else if (key == 'Measurements') {
        $('.Measurements').show();
    } else if (key == 'MapVideoContent') {
        $('.MapVideoContent').show();
    } else if (key == 'Label') {
        $('.Label').show();
    }
}

function popEditHid() {
    editControlPan = false;
    $('.content-nav-right').css({
        'transform': 'translateX(255px)'
    })
}


// 截屏点击时隐藏不必要的布局
function Screenshot() {
    popEditHid();
    translateNavEnd();
    $('.content-nav-left').hide();
    $('.content-nav-right').hide();
    $('.content-nav-top').hide();
    $('.header').hide();
    $('.InterceptScreen').css('visibility', 'visible');
}

function TwoDclick() {
    $('#mapBtn2D').click();
    let icon = 'iconfont icon-five';
    $('.nav-icon-right-top>i:first-child').attr('class', icon)
}

function threeDclick() {
    $('#mapBtn3D').click();
    let icon = 'iconfont icon-four';
    $('.nav-icon-right-top>i:first-child').attr('class', icon)
}

function monirenxingClick() {
    $('#monirenxing').click();
    let icon = 'iconfont icon-three';
    $('.nav-icon-right-top>i:first-child').attr('class', icon)
}

function showTitle() {
    $('.title_mes').css('z-index', '1');
    $('.hidebtn').css('z-index', '2');
    $('.hidebtn').show(100).click();
    $(".ControlMessage").animate({
        opacity: "0"
    }, 200);
    $('.ControlMessage').hide(200);

    $('#previous-show').hide(100);
    $('#play-show').hide(100);
    $('#next-show').hide(100);
    $('#mapBtn3D-show').hide(100);

    let key1 = $('.swiper').css('height');
    if (key1 == '118px') {
        $('#pullTab').click();
        $('#pullTab-show').hide(300);
    }
}

function showplaying() {
    $('#previous-show').toggle(100);
    $('#play-show').toggle(100);
    $('#next-show').toggle(100);
    $('.ControlMessage').show(100);
    $('.ControlMessage-top').text('预览按钮');
    $('.ControlMessage-bottom').text('用于观看漫游模式下的全景图片');
    $(".ControlMessage").animate({
        opacity: "1"
    }, 200);
    $('#mapBtn3D-show').hide(100);
    let key = $('.hidebtn').css('display');
    if (key == 'block') {
        $('.hidebtn').click();
    }
    let key1 = $('.swiper').css('height');
    if (key1 == '118px') {
        $('#pullTab').click();
        $('#pullTab-show').hide(300);
    }
}


function showPerspective() {
    $('#mapBtn3D-show').toggle(100);
    $('.ControlMessage').show(100);
    $('.ControlMessage-top').text('3D模型模型按钮');
    $('.ControlMessage-bottom').text('用于显示3D模型的切换按钮');
    $('#previous-show').hide(100);
    $('#play-show').hide(100);
    $('#next-show').hide(100);
    $(".ControlMessage").animate({
        opacity: "1"
    }, 200);
    let key = $('.hidebtn').css('display');
    if (key == 'block') {
        $('.hidebtn').click();
    }
    let key1 = $('.swiper').css('height');
    if (key1 == '118px') {
        $('#pullTab').click();
        $('#pullTab-show').hide(300);
    }
}


function showAtlas() {
    $('.swiper').show();
    $('#pullTab-show').toggle(100);
    $('#pullTab').click();
    $('.ControlMessage').show(100);
    $('.ControlMessage-top').text('图集按钮');
    $('.ControlMessage-bottom').text('用于显示全景图集的切换按钮');
    $(".ControlMessage").animate({
        opacity: "1"
    }, 200);
    $('#previous-show').hide(100);
    $('#play-show').hide(100);
    $('#next-show').hide(100);
    $('#mapBtn3D-show').hide(100);
    let key = $('.hidebtn').css('display');
    if (key == 'block') {
        $('.hidebtn').click();
    }
}


function hideZiyuan() {
    $('.Child3-Resources>iframe').attr('src', uploadSoure).css({
        'display': 'none'
    })
    $('.Child3-Resources>img').attr('src', uploadSoure).css({
        'display': 'none'
    })
}



// 导览图集编辑 start +
// 编辑器下方列表数组
let array = [];
let arrModel;

function GuideArray(item) {
    array.push(
        item.src
    )
    return array
}

function changeGuideArr(arrModel, src, newIndex) {
    arrModel.forEach((item, index) => {
        if (item.src == src) {
            item.show = true;
            // 修改当前图片的位置
            let storage = arrModel[index];
            arrModel.splice(index, 1);
            arrModel.splice(newIndex, 0, storage)
        }
    })
    return arrModel
}
// 初始列表
var list = document.getElementById("GuideContainer-items");
var sortable = new Sortable(list, {
    group: {
        name: 'GuideContainer-items-bottom',
        pull: 'clone',
        put: function() {
            return true
        }
    },
    sort: false,
    animation: 200,
    delay: 1,
    scroll: false,
    onAdd: function(evt) {
        // 隐藏图片右上方的所有删除按钮。
        $('#GuideContainer-items').find('.listRomove').hide();
    },
    onRemove: function(evt) {
        let src = evt.item.children[3].getAttribute('src');
        $('#GuideContainer-items>li>img[src="' + src + '"]').parent().hide();
    }
});
// 底部列表
var listEnd = document.getElementById("GuideContainer-items-bottom");
var sortableEnd = new Sortable(listEnd, {
    group: {
        name: 'GuideContainer-items',
        pull: true,
        put: function() {
            return true
        }
    },
    sort: true,
    animation: 200,
    delay: 1,
    scroll: false,
    onAdd: function(evt) {
        // 添加标识（说明这是从上方拉下来的）这个很重要，不要删除
        evt.item.setAttribute('type', 'slider');
        // 显示图片右上方的删除按钮
        $('#GuideContainer-items-bottom').find('.listRomove').show();
        // 隐藏提示
        $('.GuideTopics').hide();
        let src = evt.item.children[3].getAttribute('src');
        let oldIndex = evt.oldIndex;
        let newIndex = evt.newIndex;
        GuideArray({ src });
        arrModel = modelData.slider;
        // 修改图片的位置，是否显示等信息。
        changeGuideArr(arrModel, src, newIndex)

    },
    onRemove: function(evt) {
        // 判断下方列表是否还有图片
        let arr = $('#GuideContainer-items-bottom>li');
        if (arr.length <= 0) {
            // 显示提示
            $('.GuideTopics').show();
        }
        // 图片移除，修改默认位置
        let src = evt.item.children[3].getAttribute('src');
        // 初始列表根据标识删除元素
        $('#GuideContainer-items>li[type="slider"]').remove();
        // 初始列表显示元素
        $('#GuideContainer-items>li>img[src="' + src + '"]').parent().show();
        arrModel.forEach((item, index) => {
            if (item.src == src) {
                // 让这张图片隐藏：
                item.show = false;
            }
        })

        array.splice(array.indexOf(src), 1);

    },
    onUpdate: function(evt) {
        let src = evt.item.children[3].getAttribute('src');
        let newIndex = evt.newIndex;
        changeGuideArr(arrModel, src, newIndex)
    }
});


function hideGuide() {
    $('.Guide').hide();
    $('.slide').show();
}

function oninitGuide() {
    let p = new Promise((resolve, reject) => {
        $('#GuideContainer-items').children().remove();
        let arr = modelData.slider;
        modelData.slider.forEach((item, index) => {
            $('#GuideContainer-items').append(`
                <li toindex="` + item.index + `" animateclick="` + item.animateclick + `">
                    <div class="GuideContainer-status"><i class="iconfont icon-three"></i></div>
                    <div class="GuideContainer-msg"><span>` + item.timer + `</span></div>
                    <div class="listRomove"><span>-</span></div>
                    <img src="` + item.src + `">
                </li>  
            `)
        })
        resolve();
    }).then(() => {
        // 删除单个图片
        $('.listRomove').click(function(e) {
            let src = $(this).siblings('img').attr('src');
            arrModel.forEach((item, index) => {
                if (item.src == src) {
                    item.show = false;
                    // 删除dom元素
                    $('#GuideContainer-items-bottom>li>img[src="' + src + '"]').parent().remove();
                    // 原列表显示元素
                    $('#GuideContainer-items>li>img[src="' + src + '"]').parent().show();
                    array.splice(array.indexOf(src), 1);
                }
            })
        })
    })

}

// 导览点击
$('.guild').click(function() {
    popEditHid();
    translateNavEnd();
    clearTimeout(timer)
    let judge = $('.content-nav-left').css('opacity');
    if (judge != 1) {
        $('.Guide').css({
            'padding-left': '13px'
        })
    } else {
        $('.Guide').css({
            'padding-left': '266.4px'
        })
    }
    $('.Guide').toggle();
    $('.slide').toggle();
    var timer = setTimeout(() => {
        $(".icon-left-show>div").removeClass('active');
    }, 800)
    // 弹出导览页面
})

// 下拉事件
$('.GuideSlider').click((e) => {
    e.stopPropagation();
    e.preventDefault();
    let str = $('.GuideContainer-items-bottom-content').css('transform');
    if (str.indexOf('142') != '-1') {
        $('.GuideContainer-items-bottom-content').css({
            transform: 'translateY(0)'
        })
        $('.GuideSlider>i').attr('class', 'iconfont icon-arrow-left');
    } else {
        $('.GuideContainer-items-bottom-content').css({
            transform: 'translateY(142px)'
        })
        $('.GuideSlider>i').attr('class', 'iconfont icon-arrow-right-copy');
    }
})
$('.Guide').dblclick((e) => {
    e.stopPropagation();
    e.preventDefault();
})

// 刪除所有
$('.GuideRemove').click((e) => {
    $('#GuideContainer-items-bottom>li').remove();
    $('#GuideContainer-items>li').show();
    if (!arrModel) return;
    arrModel.forEach((item, index) => {
        item.show = false
    })
    modelData.slider = arrModel;
    array.length = 0;
    sendAjax();
})
// 模式切换
$('.GuideContainer-list-type>div').click(function(e) {
    $('#huandengpian>span').removeClass('active');
    $('#xingzou>span').removeClass('active');
    let key = $(this).attr('data-index');
    if (key == 1) {
        $(this).find('#huandengpian').find('span').addClass('active');
        console.log('幻灯模式');
    } else if (key == 2) {
        $(this).find('#xingzou').find('span').addClass('active');
        console.log('行走模式');
    }
})

// 关闭按钮
$('.GuideContainer-closeing').click((e) => {
    hideGuide();
})
// 导览图集编辑 end -



$('.content-nav-left').on({
    mousedown: e => {
        e.stopPropagation();
    },
    dblclick: e => {
        e.stopPropagation();
    }
})

$('.content-nav-right').on({
    mousedown: e => {
        e.stopPropagation();
    },
    dblclick: e => {
        e.stopPropagation();
    }
})
$('.beijingyinyueShow').on({
    dblclick: e => {
        e.stopPropagation();
    }
})