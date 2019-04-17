/*
//缓动动画封装 
function animate2(ele, target) {
    console.log("zoom", ele.zoom, "/target", target);
    clearInterval(ele.timer); //清除历史定时器 
    ele.timer = setInterval(function() {

        //获取步长 确定移动方向(正负值) 步长应该是越来越小的，缓动的算法。 
        var step = (target - ele.zoom) / 30;
        //对步长进行二次加工(大于0向上取整,小于0项下取整) 
        //step = step > 0 ? Math.ceil(step) : Math.floor(step);
        //动画原理： 目标位置 = 当前位置 + 步长 
        //console.log("步长", step);
        if (step > -0.0001) {
            ele.zoom = target; //直接移动指定位置 
            clearInterval(ele.timer);
        }
        ele.zoom = ele.zoom + step;
        //检测缓动动画有没有停止 
        if (Math.abs(target - ele.zoom) <= Math.abs(step)) {
            ele.zoom = target; //直接移动指定位置 
            clearInterval(ele.timer);
        }
        if (step > -0.0001) {
            ele.zoom = target; //直接移动指定位置 
            clearInterval(ele.timer);
        }
        orthoCamera.updateProjectionMatrix();
    }, 30);
}

//匀速动画 
function animate1(ele, target) {
    clearInterval(ele.timer);
    // var speed = target > ele.zoom ? 0.0075 : -0.0075;
    var windowswidth = window.innerWidth * 0.15;
    //console.log("speed:",1/windowswidth);
    var speeds = 3 / windowswidth; //根据宽度调整播放速度
    var speed = target > ele.zoom ? speeds : -speeds;
    ele.timer = setInterval(function() {
        //在执行之前就获取当前值和目标值之差 
        var val = target - ele.zoom;
        ele.zoom = ele.zoom + speed;
        //console.log(val);
        if (Math.abs(val) <= Math.abs(speed)) {
            ele.zoom = target;
            clearInterval(ele.timer);

        }
        orthoCamera.updateProjectionMatrix();
    }, 30);
}

//2D3D切换缓动动画封装
function animate3s(ele, target) {
    console.log("fov", ele.fov, "/target", target);
    clearInterval(ele.timer); //清除历史定时器 
    ele.timer = setInterval(function() {

        var step = (target - ele.fov) / 10;

        if (step > -0.001) {
            ele.fov = target; //直接移动指定位置 
            clearInterval(ele.timer);
        }
        ele.fov = ele.fov + step;
        console.log("ele.fov", ele.fov);

        ele.position.y = ele.position.y - step * step * 2000;

        console.log("ele.position.y", ele.position.y);

        //检测缓动动画有没有停止 
        if (Math.abs(target - ele.fov) <= Math.abs(step)) {
            ele.fov = target; //直接移动指定位置 
            clearInterval(ele.timer);
        }
        if (step > -0.001) {
            ele.fov = target; //直接移动指定位置 
            clearInterval(ele.timer);
        }
        ele.updateProjectionMatrix();
    }, 30);

}

function animate3(ele, target) {
    clearInterval(ele.timer);
    var speeds = 1; //根据宽度调整播放速度
    var speed = target > ele.fov ? speeds : -speeds;
    ele.timer = setInterval(function() {
        //在执行之前就获取当前值和目标值之差 
        var val = target - ele.fov;
        ele.fov = ele.fov + speed;
        //console.log(val);
        if (Math.abs(val) <= Math.abs(speed)) {
            ele.fov = target;
            if (ele.position.y < 2000) {
                ele.position.y += 800
            }
            console.log("ele.position.y", ele.position.y);
            clearInterval(ele.timer);

        }
        ele.updateProjectionMatrix();
    }, 30);
}


//Ning+ 20181007新增
function diyAnimate(ele, fov, inX, inY, inZ) {

    var positionB;
    // Point A
    let startfov = ele.fov,
        startX = position3Ds.x,
        startY = position3Ds.y,
        startZ = position3Ds.z;

    // Point B
    let endfov = fov,
        endX = inX,
        endY = inY,
        endZ = inZ;

    let startHeight = ele.position.y;
    let endHeight = 200;
    // Current position of the ball
    let fovs = startfov,
        y = startY,
        x = startX,
        z = startZ;

    clearInterval(ele.timer);
    ele.timer = setInterval(function() {
        ele.fov = fovs;
        ele.position.y = y;
        // ele.position.x = x;
        // ele.position.z = z;


        //console.log("ele.fov", ele.fov);
        //console.log("ele.position.y", ele.position.y);

        fovs = lerp(fovs, endfov, 0.1);
        y = lerp(y, endY, 0.12);
        x = lerp(x, endX, 0.12);
        z = lerp(z, endZ, 0.12);

        if (fovs < (endfov + 0.1)) {
            clearInterval(ele.timer);
            // console.log(ele.position.x, ele.position.y, ele.position.z);
        }

        // console.log("run");
        ele.updateProjectionMatrix();

    }, 30);

}

function diyAnimate2(ele, fov, inX, inY, inZ) {

    var positionB;
    // Point A
    let startfov = ele.fov,
        startX = position3Ds.x,
        startY = position3Ds.y,
        startZ = position3Ds.z;

    // Point B
    let endfov = fov,
        endX = inX,
        endY = inY,
        endZ = inZ;

    let startHeight = ele.position.y;
    let endHeight = 200;
    // Current position of the ball
    let fovs = startfov,
        y = startY,
        x = startX,
        z = startZ;

    clearInterval(ele.timer);
    ele.timer = setInterval(function() {
        ele.fov = fovs;
        ele.position.y = y;
        //ele.zoom = y;
        // ele.position.x = x;
        // ele.position.z = z;


        //console.log("ele.fov", ele.fov);
        //console.log("ele.position.y", ele.position.y);

        fovs = lerp(fovs, endfov, 0.1);
        y = lerp(y, endY, 0.12);
        x = lerp(x, endX, 0.12);
        z = lerp(z, endZ, 0.12);

        if (fovs > (endfov - 0.1)) {
            clearInterval(ele.timer);
            // console.log(ele.position.x, ele.position.y, ele.position.z);
        }
        // console.log("run");
        ele.updateProjectionMatrix();

    }, 30);

}

*/
function AnimateZoom(ele, target) {

    let startzoom = ele.zoom;

    let endzoom = target;

    let zooms = startzoom;

    clearInterval(ele.timer);
    ele.timer = setInterval(function() {
        ele.zoom = zooms;
        console.log("startzoom", startzoom);
        console.log("targetzoom", target);
        console.log("zooms", zooms);
        zooms = lerp(zooms, endzoom, 0.03);

        if (endzoom > startzoom) {
            if (zooms > (endzoom - 0.1)) {
                clearInterval(ele.timer);
            }
        }
        if (endzoom < startzoom) {
            console.log(parseFloat(endzoom) + 0.1);
            if (zooms < (parseFloat(endzoom) + 0.1)) {
                clearInterval(ele.timer);
            }
        }

        ele.updateProjectionMatrix();

    }, 30);
}


//Ning+ 20181007新增
function lerp(min, max, fraction) {
    return (max - min) * fraction + min;
}

var position3Ds = new THREE.Vector3();

function position3D(ele) {
    position3Ds = new THREE.Vector3(ele.position.x, ele.position.y, ele.position.z);
    // console.log("position3Ds", position3Ds);
}


function slider() {

    var showSlide = false;

    var showControl = true;

    var before2DVector;
    var before2DQuaternion;
    var before2DOverAllView = -1;

    $("#pullTab").click(function() {


        if (!showSlide) {

            $(this).children().children().css('color', '#4bcdfc');
            $(this).find('a span').css('background', 'url(./image/down.svg)no-repeat center center');

            $('.swiper').css({
                'height': '122px'
            })

            $('.pinBottom-container').css({
                'bottom': '117px'
            })

            $('.right_iconlist').css({
                'bottom': '130px'
            })

            showSlide = true;



        } else {
            $(this).children().children().css('color', '#fff');
            $(this).find('a span').css('background', 'url(./image/up.svg)no-repeat center center');

            $('.swiper').css({
                'height': '0'
            })

            $('.pinBottom-container').css({
                'bottom': '0'
            })

            $('.right_iconlist').css({
                'bottom': '17px'
            })

            showSlide = false;

        }

    })

    $('#eye').click(function() {

        if (showControl) {



            $(this).find('img')[0].src = './image/hide-eye.svg';

            $('.mapContainer').css({
                'right': '-200px'
            });

            $('.right_iconlist').css({
                'right': '-200px'
            });

            $('.right_iconlist').css({
                'bottom': '17px'
            })

            $('#pullTab').find('a span').css('background', 'url(./image/up.svg)no-repeat center center');

            $('.swiper').css({
                'height': '0'
            })

            $('.pinBottom-container').css({
                'bottom': '0'
            })

            showSlide = false;

            showControl = false;



        } else {

            $(this).find('img')[0].src = './image/eye.svg';

            $('.mapContainer').css({
                'right': '15px'
            })

            $('.right_iconlist').css({
                'right': '15px'
            });

            // $('.right_iconlist').css({ 'bottom': '130px' })

            // $("#pullTab").find('a span').css('background', 'url(./image/down.svg)no-repeat center center');

            // $('.swiper').css({ 'height': '122px' })

            // $('.pinBottom-container').css({ 'bottom': '117px' })

            showSlide = true;

            showControl = true;



        }

    })

    if (!modelData.slider) modelData.slider = [];

    var newLi

    for (var i = 0; i < modelData.slider.length; i++) {

        newLi = $("<li toIndex=" + modelData.slider[i].index + "><img src='" + modelData.slider[i].src + "'></li>");

        $('.swiper_ul').css('width', 148 * modelData.slider.length + 'px')

        $(newLi).bind('click', function() {



            currentSlideIndex = $(this).attr('toIndex');

            $(this).addClass('swiperCurrentLi').siblings().removeClass('swiperCurrentLi');

            goCurrentViewPoint(currentSlideIndex);

            animateControl.stop('main');

            $('#pause').css('display', 'none');

            $('#play').css('display', 'block');



        })

    }

    $('.swiper_ul').append(newLi);


    var sound = new Howl({

        src: [''],

        autoplay: true,

        loop: true,

        volume: 0.3

    });

    // var jiesuo = new Howl({

    //     src: ['audio/jiesuo.mp3'],

    //     autoplay: false,

    //     loop: false

    // });

    var id = sound.play();

    Howler.iOSAutoEnable = false;


    $(".more_icon").click(function() {

        $(this).find("img").toggleClass("rotate");

        $(".hidden_iconlist").toggle('500');

    })


    $('#mapBtn3D').click(function() {
        $('#mapBtn3D').hide(0);
        $('#mapBtn2D').show(0);
        $('#monirenxing').show(0);

        celiangClose(); //切换视角时关闭测量20180918 Ning;
        ShowMeasure(); //显示测量数据20180925_Ning;
        // diyAnimate2(orbitCamera, 65, position3Ds.x, position3Ds.y, position3Ds.z);
        //console.log('mapBtn3D');
        // setOverallView(new THREE.Vector3(7.62, 32.25, -6.76), new THREE.Quaternion(-0.38521555621346476, 0.4955240105164951, 0.2601482491559267, 0.7337491524451019));
        //setOverallView(new THREE.Vector3(cameraInfo.posx,cameraInfo.posy,cameraInfo.posz), new THREE.Quaternion(cameraInfo.qdx,cameraInfo.qdy,cameraInfo.qdz,cameraInfo.qdw))
        //setOverallView();
        // setDefaultOverallView();
        // if (modeSwitch.isOrthographic() || modeSwitch.isWalkingMode()) {

        if (modeSwitch.isOrthographic()) {
            //"退出2D模式"
            // if (before2DOverAllView == -1) {
            //     setOverallView(before2DVector, before2DQuaternion);
            // } else {
            //     setWalkingViewPoint(before2DOverAllView);
            // }

            setOverallView(before2DVector, before2DQuaternion);
            //setDefaultOverallView();
            return;
        }
        if (modeSwitch.isWalkingMode()) {
            before2DVector = null;
            before2DQuaternion = null;
            setOverallView(before2DVector, before2DQuaternion); //20180925Ning3D模式切换修改;
            return;
        }

        $(".movingSpan").animate({

            'right': -4 + 'px',
            'bottom': 6 + 'px'

        }, 1500);

    })


    $('#monirenxing').click(
        function() {
            setWalkingViewPoint(0);
            //设置第一人称视角转到第0个点；
            $('#monirenxing').hide(0);
            $('#mapBtn3D').show(0);
            $('#mapBtn2D').show(0);
        }
    )

    $('#mapBtn2D').click(function() {
        $('#mapBtn2D').hide(0);
        $('#mapBtn3D').show(0);
        $('#monirenxing').show(0);
        celiangClose(); //切换视角时关闭测量20180918 Ning;
        ShowMeasure(); //显示测量数据20180925_Ning;
        position3D(orbitCamera); //获取当前位置；
        //diyAnimate(orbitCamera, 10, 5.3, 200, 0);

        if (modeSwitch.isOrthographic()) {

            // //"退出2D模式"
            // if (before2DOverAllView == -1) {
            //     setOverallView(before2DVector, before2DQuaternion);
            // } else {
            //     setWalkingViewPoint(before2DOverAllView);
            // }
            return;
        }
        //"进入2D模式"
        if (!modeSwitch.isWalkingMode()) {
            before2DVector = new THREE.Vector3(orbitCamera.position.x, orbitCamera.position.y, orbitCamera.position.z);
            before2DQuaternion = new THREE.Quaternion(orbitCamera.quaternion._x, orbitCamera.quaternion._y, orbitCamera.quaternion._z, orbitCamera.quaternion._w);
        }
        if (modeSwitch.isWalkingMode()) {
            before2DOverAllView = targetIndex;
        } else if (modeSwitch.isOverallMode()) {
            before2DOverAllView = -1;
        }

        // setOrthographic(new THREE.Vector3(-8.97,37.72,-13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));
        // setOverallView(new THREE.Vector3(-8.97, 42.95, -13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));
        // setOrthographic(new THREE.Vector3(-0.14,8.6,3.15), new THREE.Quaternion(-0.7062777056602042,-0.03422433096446972,-0.03422429674015587,0.7062784119382627));
        var centerPoint = viewPoint[Math.floor(viewPoint.length / 2)]; //20180920ning 2D中心点

        centerPoint.y = 30;
        // setOrthographic(centerPoint, new THREE.Quaternion(-0.7, -0.03422433096446972, -0.03422429674015587, 0.7062784119382627));
        setOrthographic(centerPoint, new THREE.Quaternion(-1, 0, 0, 1)); //20180920ning 2D中心点

        var windowswidth = window.innerWidth * 0.003; //20180920ning自适应窗口宽度
        var windowsheight = window.innerHeight * 0.005; //20180920ning自适应窗口高度

        // if (modelmaxX > modelmaxY) {
        //     orthoCamera.zoom = 5.5 / modelmaxX * windowswidth; //20180920ning 2D中心点
        //     orthoCamera.updateProjectionMatrix(); //20180920ning 2D中心点
        // } else {
        //     orthoCamera.zoom = 5.5 / modelmaxY * windowswidth; //20180920ning 2D中心点
        //     orthoCamera.updateProjectionMatrix(); //20180920ning 2D中心点
        // }

        if (windowswidth < windowsheight) {
            if (modelmaxX > modelmaxY) {
                AnimateZoom(orthoCamera, (5.5 / modelmaxX * windowswidth).toFixed(2))
            } else {
                AnimateZoom(orthoCamera, (5.5 / modelmaxY * windowswidth).toFixed(2))
            }

        } else {
            if (modelmaxX > modelmaxY) {
                AnimateZoom(orthoCamera, (5.5 / modelmaxX * windowsheight).toFixed(2))
            } else {
                AnimateZoom(orthoCamera, (5.5 / modelmaxY * windowsheight).toFixed(2))
            }

        }


        // orthoCamera.zoom = 0.5;//20180920ning 2D中心点
        // orthoCamera.updateProjectionMatrix();//20180920ning 2D中心点

        var newMapContainer = null;
        $('.bodyMask').on('click', function() {
            $(newMapContainer).css('display', 'none');
            $('.bodyMask').fadeOut();
        })

        $('.mapContainer[origin=false] .mapImg').click(function(e) {
            var vector2x = (-(88 - e.offsetX / (window.innerHeight * 0.4189 / 88)) / 4.49 + 1.2);
            var vector2z = (-(168 - e.offsetY / (window.innerHeight * 0.8 / 168)) / 4.7 + 1.2);
            console.log(vector2x, vector2z)
            var minDot = 100;
            var minDotArrIndex = [];
            console.log(Math.pow(vector2x, 2) + Math.pow(vector2z, 2))

            for (var i = 0; i < viewPoint.length; i++) {
                if (Math.pow(viewPoint[i].x - vector2x, 2) + Math.pow(viewPoint[i].z - vector2z, 2) < minDot) {
                    minDot = Math.pow(viewPoint[i].x - vector2x, 2) + Math.pow(viewPoint[i].z - vector2z, 2)
                    minDotArrIndex.push(i)
                }
            }
            setWalkingViewPoint(minDotArrIndex[minDotArrIndex.length - 1])
        })
    })



    $(".microphone_on").click(function() {



        if (!($(this).hasClass("active"))) {

            $('#labelIframe')[0].src = '';

            $('#audio1')[0].src = 'audio/jiesuo.mp3';

            $('.audioProcess').width(0);



            guidefirst();

            $('.guideList').fadeIn();

            if (window.innerWidth <= 500) {

                $('.playingHide').fadeOut();



            }



            $(this).addClass("active");

            $(this).find("img").attr("src", "image/microphone-on.svg");



            $(".music_icon").css("display", "none");

            $(".music_icon_off").css("display", "block");

            sound.pause(id);

        } else {

            clearInterval(timer1);

            clearInterval(timer2);



            animateControl.stop("main");

            $('#labelBoard').fadeOut();

            $('.guideList').fadeOut();

            if (window.innerWidth <= 500) {

                $('.playingHide').fadeIn();



            }

            $('#labelIframe')[0].src = '';

            $('#audio1')[0].src = '';

            $('#audio2')[0].src = '';

            // $('.guideList').css('display', 'none')

            $(this).removeClass("active");

            $(this).find("img").attr("src", "image/microphone-off.svg");



            sound.play();

            $(".music_icon").css("display", "block");

            $(".music_icon_off").css("display", "none");

        }

    })

    var timer1;

    var timer2;

    $('.guideList li').eq(0).click(function(e) {



        $('#audio2')[0].src = '';

        if ($('#audio1')[0].currentTime != 0) {



            return

        }



        clearInterval(timer2);

        $('#labelBoard').fadeOut();

        $('#labelIframe')[0].src = '';

        guidefirst();

    })

    $('.guideList li').eq(1).click(function() {

        $('#audio1')[0].src = '';

        if ($('#audio2')[0].currentTime != 0) {



            return

        }

        clearInterval(timer1);



        $('#labelBoard').fadeOut();

        $('#labelIframe')[0].src = '';



        guidesecond()

    })



    function guidefirst() {

        var currentProcess;

        var tagWidth;

        $('#labelBoard').fadeOut();

        $('#labelIframe')[0].src = '';



        if ($('#audio1')[0].src.indexOf('audio') == -1) {

            $('#audio1')[0].src = 'audio/jiesuo.mp3';



        }

        if ($('#audio1')[0].paused) {

            $('#audio1')[0].play();

            timer1 = setInterval(function() {



                currentProcess = $('#audio1')[0].currentTime / $('#audio1')[0].duration;

                tagWidth = $('.guideList li')[0].offsetWidth;

                $('.audioProcess').css({

                    'width': tagWidth * currentProcess + 'px',

                    'left': 0

                })

            }, 1000)

            $('#audio1').bind('ended', function() {

                clearInterval(timer1);



                guidesecond();

                $('#labelBoard').fadeOut();

                $('#labelIframe')[0].src = '';

                $('.audioProcess').css({

                    'width': 0,

                })



            })



            animateControl.play("main");



        }

        // else {



        //     $('#audio1')[0].pause();

        //     clearInterval(timer1)



        // }

    }



    function guidesecond() {

        var currentProcess;

        var tagWidth;



        if ($('#audio2')[0].src.indexOf('audio') == -1) {

            $('#audio2')[0].src = 'audio/jiesuo.mp3';



        }

        if ($('#audio2')[0].paused) {

            $('#audio2')[0].play();

            timer2 = setInterval(function() {

                currentProcess = $('#audio2')[0].currentTime / $('#audio2')[0].duration;

                tagWidth = $('.guideList li')[1].offsetWidth;

                $('.audioProcess').css({

                    'width': tagWidth * currentProcess + 'px',

                    'left': $('.guideList li')[0].offsetWidth + 5 + 'px'

                })

            }, 1000)

            $('#audio2').bind('ended', function() {



            })



            animateControl.play("video");



        }

        // else {



        //     $('#audio1')[0].pause();

        //     clearInterval(timer1)



        // }

    }

    // $('.guideList li').eq(1).click(function() {

    //     var self = this;

    //     var currentProcess;

    //     var tagWidth;

    //     clearInterval(timer1);

    //     clearInterval(timer2);

    //     $('#labelBoard').fadeOut();

    //     $('#labelIframe')[0].src = ''

    //     $('.audioProcess').width(0);

    //     if (!$('#audio1')[0].src) {

    //         $('#audio1')[0].src = 'audio/jiesuo.mp3';



    //     }

    //     if ($('#audio1')[0].paused) {

    //         $('#audio1')[0].play();

    //         timer2 = setInterval(function() {

    //             console.log(2);

    //             currentProcess = $('#audio1')[0].currentTime / $('#audio1')[0].duration;

    //             tagWidth = $(self)[0].offsetWidth;

    //             $('.audioProcess').css({

    //                 'width': tagWidth * currentProcess + 'px',

    //                 'left': $('.guideList li')[0].offsetWidth + 5 + 'px'

    //             })

    //         }, 1000)

    //         animateControl.play("video");



    //     } else {



    //         $('#audio1')[0].pause();

    //         clearInterval(timer2)



    //     }



    // })

    // $(".music_icon").click(function() {

    //     sound.pause(id);

    //     $(this).css("display", "none");

    //     $(".music_icon_off").css("display", "block");



    // });

    // $(".music_icon_off").click(function() {

    //     // if ($('.microphone_on img').attr('src') == 'image/microphone-on.svg') {

    //     //     $('.microphone_on img').attr('src', 'image/microphone-off.svg');

    //     //     $('.microphone_on').removeClass("active");

    //     //     jiesuo.stop(jiesuoid);

    //     // }

    //     sound.play();



    //     $(".music_icon").css("display", "block");

    //     $(this).css("display", "none");

    // });

    // $(".show_codebtn").click(function() {

    //     $(".code_mask").fadeIn();

    //     $(".show_code").fadeIn();



    // })

    // $(".code_mask").click(function() {

    //     $(".code_mask").fadeOut();

    //     $(".show_code").fadeOut();

    // })

    // $('#play').click(function() {



    //     $(this).css('display', 'none');

    //     $('#pause').css('display', 'block');

    //     currentSlideIndex = $('.swiperCurrentLi').attr('toindex')

    //     if (!currentSlideIndex) {

    //         currentSlideIndex = 46;

    //     }



    //     for (var i = 0; i < animateControl.data.main.frames.length; i++) {

    //         animateControl.data.main.frames[i].data = animateControl.data.main.frames[i].data.replace('{{goIndex}}', currentSlideIndex)



    //     }

    //     if (animateControl.getState() == 0) {

    //         animateControl.play("main");

    //         $('.swiper_ul li[toindex=' + currentSlideIndex + ']').addClass('swiperCurrentLi').siblings().removeClass('swiperCurrentLi');



    //     } else if (animateControl.getState() == 2) {

    //         animateControl.continue("main");

    //     }

    // })

    // $('#pause').click(function() {


    //     if (animateControl.getState() == 1) {



    //         animateControl.pause("main");

    //     }

    //     $(this).css('display', 'none');

    //     $('#play').css('display', 'block');

    // })

    // $('#previous').click(function() {

    //     if (currentSlideIndex == null || currentSlideIndex == 1 || currentSlideIndex == 46) {

    //         currentSlideIndex = 1

    //     } else {

    //         currentSlideIndex = $('.swiperCurrentLi').prev().attr('toindex')



    //     }



    //     if ($('.swiper_ul li:first-child')[0] != $('.swiper_ul li[class="swiperCurrentLi"]')[0]) {
    //       // 进行轮播
    //       $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi').prev().addClass('swiperCurrentLi');
    //     } else {
    //       $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi');
    //       $('.swiper_ul li:last-child').addClass('swiperCurrentLi');
    //       // 迫使系统跳到最后一个点
    //       currentSlideIndex = $('.swiperCurrentLi').attr('toindex')
    //     }

    //     // $('.swiper_ul li[toindex=' + currentSlideIndex + ']').addClass('swiperCurrentLi').siblings().removeClass('swiperCurrentLi');

    //     goCurrentViewPoint(currentSlideIndex);

    // })

    // $('#next').bind("click", function() {
    //     // var data = $(this).data('click');
    //     console.log($._data($('#next').get(0),'events'))// 这里是获取id为box的dom元素身上绑定的所有事件
    //     // console.log(data);

    //     // if ($._data($('#next').get(0),'events').click.length >= 2) {
    //     //     // 删除其中一个事件
    //     //     $("#next").unbind().click(function(){
    //     //         // alert("我是btn1！");
    //     //     });
    //     // }
    //     // console.log('one');


    //     if (currentSlideIndex == null || currentSlideIndex == 46 ) {

    //         currentSlideIndex = 1

    //     } else {

    //         // currentSlideIndex = currentSlideIndex + parseInt(1);



    //         currentSlideIndex = $('.swiperCurrentLi').next().attr('toindex')



    //     }


    //     if ($('.swiper_ul li:last-child')[0] != $('.swiper_ul li[class="swiperCurrentLi"]')[0]) {
    //       // 进行轮播
    //       $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi').next().addClass('swiperCurrentLi');
    //     } else {
    //       $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi');
    //       $('.swiper_ul li:first-child').addClass('swiperCurrentLi');
    //       // 迫使系统跳到第一个点
    //       currentSlideIndex = $('.swiperCurrentLi').attr('toindex')
    //     }

    //     $('.swiper_ul li[class="swiperCurrentLi"]').addClass('swiperCurrentLi').siblings().removeClass('swiperCurrentLi');

    //     goCurrentViewPoint(currentSlideIndex);



    // })

}



function goCurrentViewPoint(currentSlideIndex) {

    // console.log(currentSlideIndex);
    setWalkingViewPoint(currentSlideIndex);

}

window.isflsgrn = false; //ie11以下是否进入全屏标志，true为全屏状态，false为非全屏状态

window.ieIsfSceen = false; //ie11是否进入全屏标志，true为全屏状态，false为非全屏状态

//跨浏览器返回当前 document 是否进入了可以请求全屏模式的状态

function fullscreenEnable() {

    var isFullscreen = document.fullscreenEnabled ||

        window.fullScreen ||

        document.mozFullscreenEnabled ||

        document.webkitIsFullScreen;

    return isFullscreen;

}

//全屏

var fScreen = function() {

    var docElm = document.documentElement;

    if (docElm.requestFullscreen) {

        docElm.requestFullscreen();

    } else if (docElm.msRequestFullscreen) {

        docElm.msRequestFullscreen();

        ieIsfSceen = true;

    } else if (docElm.mozRequestFullScreen) {

        docElm.mozRequestFullScreen();

    } else if (docElm.webkitRequestFullScreen) {

        docElm.webkitRequestFullScreen();

    } else { //对不支持全屏API浏览器的处理，隐藏不需要显示的元素

        window.parent.hideTopBottom();

        isflsgrn = true;

        $("#fsbutton").text("退出全屏");

    }

}

//退出全屏

var cfScreen = function() {

    if (document.exitFullscreen) {

        document.exitFullscreen();

    } else if (document.msExitFullscreen) {

        document.msExitFullscreen();

    } else if (document.mozCancelFullScreen) {

        document.mozCancelFullScreen();

    } else if (document.webkitCancelFullScreen) {

        document.webkitCancelFullScreen();

    } else {

        window.parent.showTopBottom();

        isflsgrn = false;

        $("#fsbutton").text("全屏");

    }

}

//全屏按钮点击事件

$("#gui-fullscreen").click(function() {

    var isfScreen = fullscreenEnable();

    if (!isfScreen && isflsgrn == false) {

        if (ieIsfSceen == true) {

            document.msExitFullscreen();

            ieIsfSceen = false;

            return;

        }

        $(this).find('img')[0].src = 'image/narrow.svg'

        fScreen();

    } else {

        $(this).find('img')[0].src = 'image/enlarge.svg'



        cfScreen();

    }

})

//键盘操作

$(document).keydown(function(event) {

    if (event.keyCode == 27 && ieIsfSceen == true) {

        ieIsfSceen = false;

    }

});

//监听状态变化

if (window.addEventListener) {

    document.addEventListener('fullscreenchange', function() {

        if ($("#fsbutton").text() == "全屏") {

            $("#fsbutton").text("退出全屏");

        } else {

            $("#fsbutton").text("全屏");

        }

    });

    document.addEventListener('webkitfullscreenchange', function() {

        if ($("#fsbutton").text() == "全屏") {

            $("#fsbutton").text("退出全屏");

        } else {

            $("#fsbutton").text("全屏");

        }

    });

    document.addEventListener('mozfullscreenchange', function() {

        if ($("#fsbutton").text() == "全屏") {

            $("#fsbutton").text("退出全屏");

        } else {

            $("#fsbutton").text("全屏");

        }

    });

    document.addEventListener('MSFullscreenChange', function() {

        if ($("#fsbutton").text() == "全屏") {

            $("#fsbutton").text("退出全屏");

        } else {

            $("#fsbutton").text("全屏");

        }

    });

    window.onload = function() {

        // 按钮动作

        btn();

        // tabBoth选项

        tabBoth();

        // 百叶窗下拉

        Blinds();

        // 收起

        slide();

        function btn() {

            let btn = document.querySelectorAll('.switch');

            // let sbtn = document.querySelectorAll('.switch');



            // 点击按钮

            for (let i = 0; i < btn.length; i++) {

                btn[i].onclick = function() {

                    // var name = this.className;

                    // var preName = this.parentNode.className;

                    // var arr = name.split(' ');

                    // var arrpre = preName.split(' ');

                    // // 查找是否有存在特定的类名

                    // this.className = name.indexOf('activeBtnOn') == -1 ? 'switch-btn activeBtnOn' : 'switch-btn';

                    // this.parentNode.className = preName.indexOf('activeOn') == -1 ? 'switch activeOn' : 'switch';

                    var name = this.className;

                    var chiName = this.childNodes[0].className;

                    var arr = name.split(' ');

                    var arrpre = chiName.split(' ');

                    // 查找是否有存在特定的类名

                    this.className = name.indexOf('activeOn') == -1 ? 'switch activeOn' : 'switch';

                    this.childNodes[0].className = chiName.indexOf('activeBtnOn') == -1 ? 'switch-btn activeBtnOn' : 'switch-btn';

                };

            };

        };

        // tab选项切换

        function tabBoth() {

            $('.btnLeft').click(function() {

                console.log(1)

                $('.btnRight').removeClass('activeColor');

                this.className = 'btnLeft activeColor';

                $('.first-bar').fadeIn();

                $('.second-bar').fadeOut();

            })

            $('.btnRight').click(function() {

                console.log(2)

                $('.btnLeft').removeClass('activeColor');

                this.className = 'btnRight activeColor';

                $('.first-bar').fadeOut();

                $('.second-bar').show();

            })

        }

        // 百叶窗伸缩

        function Blinds() {

            let Blinds = $('.first-list-name');

            Blinds.click(function(e) {
                for (let i = 0; i < Blinds.length; i++) {
                    Blinds[i].classList.remove('activeBlinds')
                }
                e.currentTarget.classList.add('activeBlinds')

                $('.activeBlinds').next().slideToggle();
                // Blinds.next().slideToggle();
            })

        }

        // 收起按钮点击

        function slide() {

            $('.slide').click(function() {
                $('.slide>i').toggleClass('icon-arrow-right-copy')
                if ($('.content-nav-left').css('margin-left') == '0px') {
                    $('.content-nav-left').animate({
                        'opacity': 0.5,
                        'margin-left': '-300px'
                    }, 100, function() {
                        // 动画完成
                    });
                    $('.content-nav-top').animate({
                        'left': '200px'
                    }, 300, function() {
                        // 动画完成
                    });

                } else {
                    $('.content-nav-left').animate({
                        'opacity': 1,
                        'margin-left': '0px'
                    }, 100, function() {
                        // 动画完成
                    });

                    $('.content-nav-top').animate({
                        'left': '219px'
                    }, 300, function() {
                        // 动画完成
                    });

                }
            })
        }
    };



}