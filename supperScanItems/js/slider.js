//Ning+ 20181007新增
function AnimateZoom(ele, target) {
    let startzoom = ele.zoom;
    let endzoom = target;
    let zooms = startzoom;
    clearInterval(ele.timer);
    ele.timer = setInterval(function () {
        // ele.zoom = zooms;
        zooms = lerp(zooms, endzoom, 0.03);
        if (endzoom > startzoom) {
            if (zooms > (endzoom - 0.1)) {
                clearInterval(ele.timer);
            }
        }
        if (endzoom < startzoom) {
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
var rotation2Ds = new THREE.Vector3();

function position3D(ele) {
    position3Ds = new THREE.Vector3(ele.position.x, ele.position.y, ele.position.z);
    // console.log("position3Ds", position3Ds);
}

function rotation2D(ele) {
    rotation2Ds = new THREE.Quaternion(ele.Quaternion);
}

function Location() {
    if (!modeSwitch.isWalkingMode()) {
        before2DVector = new THREE.Vector3(orbitCamera.position.x, orbitCamera.position.y, orbitCamera.position.z);
        before2DQuaternion = new THREE.Quaternion(orbitCamera.quaternion._x, orbitCamera.quaternion._y, orbitCamera.quaternion._z, orbitCamera.quaternion._w);
    }
}
var before2DVector;
var before2DQuaternion;

function slider() {
    var showSlide = false;
    var showControl = true;
    
    var before2DOverAllView = -1;
    $("#pullTab").click(function () {
        if (!showSlide) {
            $(this).children().children().css('color', '#4bcdfc');
            $('.swiper').css({
                'height': '122px'
            })
            $('.pinBottom-container').css({
                'bottom': '117px'
            })
            // $('.slidepanelpc-main').css({
            //     'bottom': '0.25rem'
            // })
            showSlide = true;
        } else {
            $(this).children().children().css('color', '#fff');
            $('.swiper').css({
                'height': '0'
            })
            $('.pinBottom-container').css({
                'bottom': '30px'
            })
            // $('.slidepanelpc-main').css({
            //     'bottom': '-0.75rem'
            // })
            showSlide = false;
        }
        if (showSlide) {
            $('.menu').hide();
        } else {
            $('.menu').show();
        }
    })

    $('#eye').click(function () {
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

    //判断左下角按钮隐藏
    if(modelData.slider.length == 0){
        $('.play').hide();
        if(window.deviceMsg.isMobile && window.deviceMsg.isIPad == false) {
            $('.swiper').hide();
        } else {
            $('#pullTab').hide();
        }
    }
    var newLi;
    for (var i = 0; i < modelData.slider.length; i++) {
        newLi = $("<li toIndex=" + modelData.slider[i].index + " animateclick=" + modelData.slider[i].animateclick + " mode=" + modelData.slider[i].mode + " pos=" + modelData.slider[i].pos + " zoom=" + modelData.slider[i].zoom + " rot=" + modelData.slider[i].rot + " ><img src='" + modelData.slider[i].src + "'></li>");
        // $('.swiper_ul').css('width', 148 * modelData.slider.length + 'px')

        $(newLi).bind('click', function () {
            currentSlideIndex = $(this).attr('toIndex');
            orient = JSON.parse($(this).attr('animateclick'));
            mode = $(this).attr('mode');
            zoom = $(this).attr('zoom');

            var posn = JSON.parse($(this).attr('pos'));
            var pos = new THREE.Vector3(posn[0], posn[1], posn[2]);
            var rotn = JSON.parse($(this).attr('rot'));
            var rot = new THREE.Vector3(rotn[0], rotn[1], rotn[2]);

            currentSlideOrient = new THREE.Quaternion(orient[0], orient[1], orient[2], orient[3])

            $(this).addClass('swiperCurrentLi').siblings().removeClass('swiperCurrentLi');

            if (mode == "1D") {
                // console.log(currentSlideIndex, currentSlideOrient)
                goCurrentViewPoint(currentSlideIndex, currentSlideOrient);
            } else if (mode == "2D") {
                setOrthographic(pos, currentSlideOrient);
                // orthoCamera.zoom = zoom;
                // orthoCamera.rotation.set(rotn[0], rotn[1], rotn[2]);
            } else if (mode == "3D") {
                setOverallView(pos, currentSlideOrient);
            }

            animateControl.stop('main');
            // $('#pause').css('display', 'none');
            // $('#play').css('display', 'block');
        })
        $('.swiper_ul').append(newLi);
    }

    // var sound = new Howl({
    //     src: [''],
    //     autoplay: true,
    //     loop: true,
    //     volume: 0.3
    // });
    // var id = sound.play();
    // Howler.iOSAutoEnable = false;

    $(".more_icon").click(function () {
        $(this).find("img").toggleClass("rotate");
        $(".hidden_iconlist").toggle('500');
    })

    //旧版本3D按钮
    // $('#mapBtn3D').click(function() {
    //     TagDivvisible(false);
    //     $('#mapBtn3D').hide(0);
    //     $('#mapBtn2D').show(0);
    //     $('#monirenxing').show(0);
    //     visibleNav(false);
    //     HiddenLabel(false);
    //     PlayTimerAnimateEntrance();
    //     // celiangClose(); //切换视角时关闭测量20180918 Ning;
    //     // ShowMeasure(); //显示测量数据20180925_Ning;
    //     if (before2DVector == undefined) {
    //         before2DVector = {
    //             x: -19.250426735038133,
    //             y: 17.01254488670294,
    //             z: 9.701580517260815
    //         };
    //     }

    //     if (before2DQuaternion == undefined) {
    //         before2DQuaternion = {
    //             w: 0.8881470423082297,
    //             x: -0.3074992029978612,
    //             y: -0.32272886261111844,
    //             z: -0.11173697970035522
    //         }
    //     }

    //     if (modeSwitch.isOrthographic()) {
    //         //"退出2D模式"
    //         setOverallView(before2DVector, before2DQuaternion);
    //         //setDefaultOverallView();
    //         return;
    //     }
    //     if (modeSwitch.isWalkingMode()) {
    //         before2DVector = null;
    //         before2DQuaternion = null;
    //         setOverallView(before2DVector, before2DQuaternion); //20180925Ning3D模式切换修改;
    //         return;
    //     }
    //     $(".movingSpan").animate({
    //         'right': -4 + 'px',
    //         'bottom': 6 + 'px'
    //     }, 1500);
    // })

    $('#mapBtn3D').click(function () {
        TagDivvisible(false);
        $('#mapBtn3D').hide(0);
        $('#mapBtn2D').show(0);
        $('#monirenxing').show(0);
        visibleNav(false);
        // TagsVisible(true);
        HiddenLabel(false);
        displayDrawing(false);

        if (!modeSwitch.isOverallMode()) {
            PlayTimerAnimateEntrance();
        }


        // celiangClose(); //切换视角时关闭测量20180918 Ning;
        // ShowMeasure(); //显示测量数据20180925_Ning;

        if (before2DVector == undefined) {
             before2DVector = {
                x: modelCenter.x,
                y: modelCenter.y + modelSize,
                z: modelCenter.z
            };
        }

        if (before2DQuaternion == undefined) {
            before2DQuaternion = {
                w: 0.5093719335901358,
                x: -0.49602325983656564,
                y: -0.5038004910227752,
                z: -0.4905978232900791
                }
        }


        if (modeSwitch.isOverallMode()) {
            //"退出2D模式"
            setOverallView(before2DVector, before2DQuaternion);
            //setDefaultOverallView();
            return;
        }
        if (modeSwitch.isWalkingMode()) {
            setOverallView(before2DVector, before2DQuaternion); //20180925Ning3D模式切换修改;
            return;
        }
        $(".movingSpan").animate({
            'right': -4 + 'px',
            'bottom': 6 + 'px'
        }, 1500);
    })

    $('#monirenxing').click(function (e) {
        TagDivvisible(false);
        visibleNav(true);
        displayDrawing(false);
        // TagsVisible(true);
        // e.stopPropagation();
        if (!modeSwitch.isWalkingMode()) {
            before2DVector = new THREE.Vector3(orbitCamera.position.x, orbitCamera.position.y, orbitCamera.position.z);
            before2DQuaternion = new THREE.Quaternion(orbitCamera.quaternion._x, orbitCamera.quaternion._y, orbitCamera.quaternion._z, orbitCamera.quaternion._w);
        }
        //切换回当前位置20181120
        if (curIndex == -1) {
            // setWalkingViewPoint(0);
        textureManager.loadTexture(0, true);

        } else {
        textureManager.loadTexture(curIndex, true);

            // setWalkingViewPoint(curIndex);
        }
        //设置第一人称视角转到第0个点；
        $('#monirenxing').hide(0);
        $('#mapBtn3D').show(0);
        $('#mapBtn2D').show(0);
        StopTimerAnimateEntrance();
        HiddenLabel(false);
        ismouseMoved = true; //防止初始化移动端直接点击2D模式时错误；
    })

    //旧版本2D屏蔽，改成贝壳网2D户型图20181211
    // $('#mapBtn2D').click(function () {
    //     TagDivvisible(false);
    //     $('#mapBtn2D').hide(0);
    //     $('#mapBtn3D').show(0);
    //     $('#monirenxing').show(0);
    //     visibleNav(false);
    //     HiddenLabel(true);
    //     PlayTimerAnimateEntrance();
    //     ismouseMoved = true; //防止初始化移动端直接点击2D模式时错误；
    //     // celiangClose(); //切换视角时关闭测量20180918 Ning;
    //     //ShowMeasure(); //显示测量数据20180925_Ning;
    //     if (modeSwitch.isOrthographic()) {
    //         // //"退出2D模式"
    //         // if (before2DOverAllView == -1) {
    //         //     setOverallView(before2DVector, before2DQuaternion);
    //         // } else {
    //         //     setWalkingViewPoint(before2DOverAllView);
    //         // }
    //         return;
    //     }
    //     //"进入2D模式"
    //     if (!modeSwitch.isWalkingMode()) {
    //         before2DVector = new THREE.Vector3(orbitCamera.position.x, orbitCamera.position.y, orbitCamera.position.z);
    //         before2DQuaternion = new THREE.Quaternion(orbitCamera.quaternion._x, orbitCamera.quaternion._y, orbitCamera.quaternion._z, orbitCamera.quaternion._w);
    //     }

    //     // if (modeSwitch.isWalkingMode()) {
    //     //     before2DOverAllView = targetIndex;
    //     // } else if (modeSwitch.isOverallMode()) {
    //     //     before2DOverAllView = -1;
    //     // }

    //     var centerPoint = viewPoint[Math.floor(viewPoint.length / 2)]; //20180920ning 2D中心点
    //     centerPoint.y = 30;
    //     var windowswidth = window.innerWidth; //20180920ning自适应窗口宽度
    //     var windowsheight = window.innerHeight; //20180920ning自适应窗口高度
    //     if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) { //20181018ning 设备判断
    //         //console.log("移动设备");
    //         if (windowswidth < windowsheight) {
    //             if (modelmaxX < modelmaxY) {
    //                 centerPoint.y = (window.screen.width - windowswidth) * 0.01 + modelmaxY * windowswidth * 0.0035;
    //             } else {
    //                 centerPoint.y = (window.screen.width - windowswidth) * 0.01 + modelmaxX * windowswidth * 0.0035;
    //             }
    //         } else {
    //             if (modelmaxX < modelmaxY) {
    //                 centerPoint.y = windowsheight * 0.01 + modelmaxY * windowsheight * 0.0015;
    //             } else {
    //                 centerPoint.y = windowsheight * 0.01 + modelmaxX * windowsheight * 0.0015;
    //             }
    //         }
    //     } else {
    //         //console.log("PC设备");
    //         if (windowswidth < windowsheight) {
    //             if (modelmaxX < modelmaxY) {
    //                 centerPoint.y = (window.screen.width - windowswidth) * 0.01 + modelmaxY * (window.screen.width - windowswidth) * 0.002;
    //             } else {
    //                 centerPoint.y = (window.screen.width - windowswidth) * 0.01 + modelmaxX * (window.screen.width - windowswidth) * 0.002;
    //             }
    //         } else {
    //             if (modelmaxX < modelmaxY) {
    //                 centerPoint.y = (window.screen.width - windowsheight) * 0.01 + modelmaxY * (window.screen.width - windowsheight * 1.5) * 0.002;
    //             } else {
    //                 centerPoint.y = (window.screen.width - windowsheight) * 0.01 + modelmaxX * (window.screen.width - windowsheight * 1.5) * 0.002;
    //             }
    //         }
    //     }
    //     setOrthographic(centerPoint, new THREE.Quaternion(-1, 0, 0, 1)); //20180920ning 2D中心点
    //     var newMapContainer = null;
    //     $('.bodyMask').on('click', function () {
    //         $(newMapContainer).css('display', 'none');
    //         $('.bodyMask').fadeOut();
    //     })
    //     $('.mapContainer[origin=false] .mapImg').click(function (e) {
    //         var vector2x = (-(88 - e.offsetX / (window.innerHeight * 0.4189 / 88)) / 4.49 + 1.2);
    //         var vector2z = (-(168 - e.offsetY / (window.innerHeight * 0.8 / 168)) / 4.7 + 1.2);
    //         console.log(vector2x, vector2z)
    //         var minDot = 100;
    //         var minDotArrIndex = [];
    //         console.log(Math.pow(vector2x, 2) + Math.pow(vector2z, 2))
    //         for (var i = 0; i < viewPoint.length; i++) {
    //             if (Math.pow(viewPoint[i].x - vector2x, 2) + Math.pow(viewPoint[i].z - vector2z, 2) < minDot) {
    //                 minDot = Math.pow(viewPoint[i].x - vector2x, 2) + Math.pow(viewPoint[i].z - vector2z, 2)
    //                 minDotArrIndex.push(i)
    //             }
    //         }
    //         setWalkingViewPoint(minDotArrIndex[minDotArrIndex.length - 1])
    //     })
    // })

    $('#mapBtn2D').click(function () {
        TagDivvisible(false);
        $('#mapBtn2D').hide(0);
        $('#mapBtn3D').show(0);
        $('#monirenxing').show(0);
        visibleNav(false);
        TagsVisible(false);
        HiddenLabel(true);
        HiddenMeasure();
        // displayDrawing(true);

        if (!modeSwitch.isOverallMode()) {
            PlayTimerAnimateEntrance();
        }
        else{
            if(model.visible){

                displayDrawing(true);
                // model.visible=true;
            }
            else{
                displayDrawing(false);
            }
        
        }

        ismouseMoved = true; //防止初始化移动端直接点击2D模式时错误；
        // celiangClose(); //切换视角时关闭测量20180918 Ning;
        //ShowMeasure(); //显示测量数据20180925_Ning;

        before2DVector2 = {
            x: modelCenter.x,
            y: modelCenter.y + modelSize,
            z: modelCenter.z
        };

        before2DQuaternion2 = {
            w: 0.5093719335901358,
            x: -0.49602325983656564,
            y: -0.5038004910227752,
            z: -0.4905978232900791
        };

        if (!modeSwitch.isWalkingMode()) {
            before2DVector = new THREE.Vector3(orbitCamera.position.x, orbitCamera.position.y, orbitCamera.position.z);
            before2DQuaternion = new THREE.Quaternion(orbitCamera.quaternion._x, orbitCamera.quaternion._y, orbitCamera.quaternion._z, orbitCamera.quaternion._w);
        }


        if (modeSwitch.isOverallMode()) {
            //"退出2D模式"
            // setOverallView(before2DVector2, before2DQuaternion2);
            //setDefaultOverallView();
            return;
        }

        if (modeSwitch.isWalkingMode()) {
            // setOverallView(before2DVector2, before2DQuaternion2); //20180925Ning3D模式切换修改;
            return;
        }

    })

    $(".microphone_on").click(function () {
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
    $('.guideList li').eq(0).click(function (e) {
        $('#audio2')[0].src = '';
        if ($('#audio1')[0].currentTime != 0) {
            return
        }
        clearInterval(timer2);
        $('#labelBoard').fadeOut();
        $('#labelIframe')[0].src = '';
        guidefirst();
    })
    $('.guideList li').eq(1).click(function () {
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
            timer1 = setInterval(function () {
                currentProcess = $('#audio1')[0].currentTime / $('#audio1')[0].duration;
                tagWidth = $('.guideList li')[0].offsetWidth;
                $('.audioProcess').css({
                    'width': tagWidth * currentProcess + 'px',
                    'left': 0
                })
            }, 1000)
            $('#audio1').bind('ended', function () {
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
    }

    function guidesecond() {
        var currentProcess;
        var tagWidth;
        if ($('#audio2')[0].src.indexOf('audio') == -1) {
            $('#audio2')[0].src = 'audio/jiesuo.mp3';
        }
        if ($('#audio2')[0].paused) {
            $('#audio2')[0].play();
            timer2 = setInterval(function () {
                currentProcess = $('#audio2')[0].currentTime / $('#audio2')[0].duration;
                tagWidth = $('.guideList li')[1].offsetWidth;
                $('.audioProcess').css({
                    'width': tagWidth * currentProcess + 'px',
                    'left': $('.guideList li')[0].offsetWidth + 5 + 'px'
                })
            }, 1000)
            $('#audio2').bind('ended', function () {})
            animateControl.play("video");
        }
    }
}

function goCurrentViewPoint(currentSlideIndex, currentSlideOrient) {
    //console.log(currentSlideIndex, currentSlideOrient);
    setWalkingViewPoint(currentSlideIndex, currentSlideOrient);

}
window.isflsgrn = false; //ie11以下是否进入全屏标志，true为全屏状态，false为非全屏状态
window.ieIsfSceen = false; //ie11是否进入全屏标志，true为全屏状态，false为非全屏状态
//跨浏览器返回当前 document 是否进入了可以请求全屏模式的状态
function fullscreenEnable() {
    var isFullscreen = document.fullscreenEnabled || window.fullScreen || document.mozFullscreenEnabled || document.webkitIsFullScreen;
    return isFullscreen;
}
//全屏
var fScreen = function () {
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
var cfScreen = function () {
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
$("#gui-fullscreen").click(function () {
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
$(document).keydown(function (event) {
    if (event.keyCode == 27 && ieIsfSceen == true) {
        ieIsfSceen = false;
    }
});
//监听状态变化
if (window.addEventListener) {
    document.addEventListener('fullscreenchange', function () {
        if ($("#fsbutton").text() == "全屏") {
            $("#fsbutton").text("退出全屏");
        } else {
            $("#fsbutton").text("全屏");
        }
    });
    document.addEventListener('webkitfullscreenchange', function () {
        if ($("#fsbutton").text() == "全屏") {
            $("#fsbutton").text("退出全屏");
        } else {
            $("#fsbutton").text("全屏");
        }
    });
    document.addEventListener('mozfullscreenchange', function () {
        if ($("#fsbutton").text() == "全屏") {
            $("#fsbutton").text("退出全屏");
        } else {
            $("#fsbutton").text("全屏");
        }
    });
    document.addEventListener('MSFullscreenChange', function () {
        if ($("#fsbutton").text() == "全屏") {
            $("#fsbutton").text("退出全屏");
        } else {
            $("#fsbutton").text("全屏");
        }
    });
    window.onload = function () {
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
                btn[i].onclick = function () {
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
            $('.btnLeft').click(function () {
                $('.btnRight').removeClass('activeColor');
                this.className = 'btnLeft activeColor';
                $('.first-bar').fadeIn();
                $('.second-bar').fadeOut();
            })
            $('.btnRight').click(function () {
                $('.btnLeft').removeClass('activeColor');
                this.className = 'btnRight activeColor';
                $('.first-bar').fadeOut();
                $('.second-bar').show();
            })
        }
        // 百叶窗伸缩
        function Blinds() {
            let Blinds = $('.first-list-name');
            Blinds.click(function (e) {
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
            $('.slide').click(function () {
                $('.slide>i').toggleClass('icon-arrow-right-copy')
                if ($('.content-nav-left').css('margin-left') == '0px') {
                    $('.content-nav-left').animate({
                        'opacity': 0.5,
                        'margin-left': '-300px'
                    }, 100, function () {
                        // 动画完成
                    });
                } else {
                    $('.content-nav-left').animate({
                        'opacity': 1,
                        'margin-left': '0px'
                    }, 100, function () {
                        // 动画完成
                    });
                }
            })
        }
    };
}

// get url request fun start +
function getUrlQuery() {
    "use strict";
    // $("#smg").css('background', 'url(./image/3.png) no-repeat center');
    // $("#smg").css('opacity', '1');
    var urlStr = location.search.substr(1) ? location.search.substr(1) : "";
    var urlArr = [];
    for (var i = 0; i < urlStr.split("&").length; i++) {
        urlArr.push(urlStr.split("&")[i].split("=")[0] ? urlStr.split("&")[i].split("=")[0] : "");
        urlArr.push(urlStr.split("&")[i].split("=")[1] ? urlStr.split("&")[i].split("=")[1] : "onlyKey")
    }
    if (urlStr == "") {
        return;
    } else {
        let urlObj = {};
        for (var i = 0; i < urlArr.length; i += 2) {
            if (urlArr[i] != "") {
                urlObj[urlArr[i]] = decodeURIComponent(urlArr[i + 1]);
            }
        }
        return {
            urlArr,
            urlObj
        };
    }
}

function seachRequestString(location) {
    "use strict";
    let arr = location;
    for (let i in arr) {
        setRequestString(i.toLowerCase(), arr);
    }
}

function setRequestString(i, arr) {
    'use strict'
    if (i == 'help') {
        if (arr[i] == 1) {
            // show help
            setTimeout((e) => {
                $('.help').show();
                $('#monirenxing').click();
                $('#cta-container').animate({
                    opacity: 1
                }, 500);
            }, 1300)
        } else if (arr[i] == 2) {
            // show more help msg
            setTimeout((e) => {
                $('.help').show();
                $('#monirenxing').click();
                $('#cta-container').animate({
                    opacity: 1
                }, 500);
            }, 1300)
        } else if (arr[i] == 0) {
            // hide help
            $('#cta-container').animate({
                opacity: 0
            }, 500, () => {
                $('.help').hide();
            });
        }
    }

    if (i == 'hl') {

    }
    if (i == 'nt') {

    }
    if (i == 'qs') {

    }
    if (i == 'ts') {

    }
    if (i == 'brand') {
        if (arr[i] == 1) {
            $('.hidebtn').show();
        } else if (arr[i] == 0) {
            $('.hidebtn').hide();
        }
    }
    if (i == 'dh') {
        if (arr[i] == 1) {
            $('#mapBtn3D').show();
        } else if (arr[i] == 0) {
            $('#mapBtn3D').hide();
        }
    }
    if (i == 'gt') {
        if (arr[i] == 1) {
            $('#previous').show();
            $('#play').show();
            $('#next').show();
        } else if (arr[i] == 0) {
            $('#previous').hide();
            $('#play').hide();
            $('#next').hide()
        }
    }
    if (i == 'hr') {
        if (arr[i] == 1) {
            $('#pullTab').show();
        } else if (arr[i] == 0) {
            $('#pullTab').hide();
        }
    }
    if (i == 'f') {

    }
    if (i == 'nozoom') {

    }
    if (i == 'wh') {

    }
    if (i == 'guides') {

    }
    if (i == 'kb') {

    }
    if (i == 'lp') {

    }
    if (i == 'st') {

    }
    if (i == 'title') {
        if (arr[i] == 1) {
            $('.hidebtn').show();
        } else if (arr[i] == 0) {
            $('.hidebtn').hide();
        } else if (arr[i] == 2) {
            $('.hidebtn').show();
        }
    }
    if (i == 'vr') {

    }
}

// get url request fun end -

// image controls start + \
$('#pause').on('touchend', function (e) {
    e.stopPropagation();
    $(this).click();
})
$('#play').on('touchend', function (e) {
    e.stopPropagation();
    $(this).click();
})

$('#previous').on('touchend', function (e) {
    e.stopPropagation();
    $(this).click();
})


$('#next').on('touchend', function (e) {
    e.stopPropagation();
    $(this).click();
})

$('#pause').click(function (e) {
    e.stopPropagation();
    PlaySlides(modelData.slider.length);
    $('.pause').css('display', 'none');
    $('.play').css('display', 'block');

})

$('#play').click(function (e) {
    e.stopPropagation();
    PlaySlides(modelData.slider.length);
    $('.icon-one').css('color', '#4bcdfc');
    $('.play').css('display', 'none');
    $('.pause').css('display', 'block');

})

$('#previous').click(function () {

    if ($('.swiper_ul li:first-child')[0] != $('.swiper_ul li[class="swiperCurrentLi"]')[0]) {
        $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi').prev().addClass('swiperCurrentLi');
        showNextSlides($('.swiper_ul>li').index($('.swiper_ul li[class="swiperCurrentLi"]')));
    } else {
        $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi');
        $('.swiper_ul li:last-child').addClass('swiperCurrentLi');
        showNextSlides($('.swiper_ul>li').index($('.swiper_ul li[class="swiperCurrentLi"]')));
    }
    // $('.swiper_ul li[toindex=' + currentSlideIndex + ']').addClass('swiperCurrentLi').siblings().removeClass('swiperCurrentLi');
    // goCurrentViewPoint(currentSlideIndex);
})

$('#next').bind("click", function () {

    if ($('.swiper_ul li:last-child')[0] != $('.swiper_ul li[class="swiperCurrentLi"]')[0]) {
        // 进行轮播
        $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi').next().addClass('swiperCurrentLi');
        showNextSlides($('.swiper_ul>li').index($('.swiper_ul li[class="swiperCurrentLi"]')));
    } else {
        $('.swiper_ul li[class="swiperCurrentLi"]').removeClass('swiperCurrentLi');
        $('.swiper_ul li:first-child').addClass('swiperCurrentLi');
        showNextSlides($('.swiper_ul>li').index($('.swiper_ul li[class="swiperCurrentLi"]')));
        // 迫使系统跳到第一个点
        // currentSlideIndex = $('.swiperCurrentLi').attr('toindex')
    }

    $('.swiper_ul li[class="swiperCurrentLi"]').addClass('swiperCurrentLi').siblings().removeClass('swiperCurrentLi');
})

function showNextSlides(Next) {

    //point
    point = modelData.slider[Next].index;
    //orient
    orient = JSON.parse(modelData.slider[Next].animateclick);
    //mode
    mode = modelData.slider[Next].mode;
    //position
    posn = JSON.parse(modelData.slider[Next].pos);
    //rotation
    rot = JSON.parse(modelData.slider[Next].rot);
    //2Dzoom
    zoom = modelData.slider[Next].zoom;
    currentSlideOrient = new THREE.Quaternion(orient[0], orient[1], orient[2], orient[3]);
    pos = new THREE.Vector3(posn[0], posn[1], posn[2]);

    if (mode == "1D") {
        goCurrentViewPoint(point, currentSlideOrient);
        HiddenLabel(false);
    } else if (mode == "2D") {
        setOrthographic(pos, currentSlideOrient);
        HiddenLabel(true);
    } else if (mode == "3D") {
        HiddenLabel(false);
        setOverallView(pos, currentSlideOrient);
    }

}

var slideIndex = 0;
var slideLength;
var i = 0;
var playstage = false;
var pause = false;
var clockint;

function PlaySlides(ModelDataLength) {
    if (ModelDataLength > 0) {

        if (!playstage) {
            playstage = true;
            pause = true;
            console.log("播放");
            slideLength = ModelDataLength;
            // i = 0;
            clockint = setInterval("showSlides()", 4500)
            orbitControl.autoRotate = true;
        } else {
            playstage = false;
            pause = false;
            console.log("停止");
            clearInterval(clockint);
            orbitControl.autoRotate = false;
        }
    }
}

function DefaultPoint() {
    if (modelData.DefaultPoint == undefined) {
        return false;
    } else {
        var DefaultPoint = modelData.DefaultPoint;
        if (DefaultPoint < modelData.slider.length) {
            // console.log("DefaultPoint", DefaultPoint);
            showNextSlides(DefaultPoint);
        }
    }
}

function showSlides() {

    //point
    point = modelData.slider[i].index;
    //orient
    orient = JSON.parse(modelData.slider[i].animateclick);
    //mode
    mode = modelData.slider[i].mode;
    //position
    posn = JSON.parse(modelData.slider[i].pos);
    //rotation
    rot = JSON.parse(modelData.slider[i].rot);
    //2Dzoom
    zoom = modelData.slider[i].zoom;
    currentSlideOrient = new THREE.Quaternion(orient[0], orient[1], orient[2], orient[3]);
    pos = new THREE.Vector3(posn[0], posn[1], posn[2]);

    //Cleaning style
    $(".swiper_ul>li:nth-child(" + $(".swiper_ul>li").length + ")").removeClass("swiperCurrentLi");
    for (ix = 0; ix < $(".swiper_ul>li").length; ix++) {
        $(".swiper_ul>li:nth-child(" + ix + ")").removeClass("swiperCurrentLi");
    }

    //loop
    i++;
    //active
    $(".swiper_ul>li:nth-child(" + i + ")").addClass("swiperCurrentLi");

    if (i + 1 > slideLength) {
        i = 0
    }

    if (mode == "1D") {
        goCurrentViewPoint(point, currentSlideOrient);
        HiddenLabel(false);
    } else if (mode == "2D") {
        setOrthographic(pos, currentSlideOrient);

        HiddenLabel(true)

        // orthoCamera.zoom = zoom;
        // orthoCamera.rotation.set(rotn[0], rotn[1], rotn[2]);
    } else if (mode == "3D") {
        HiddenLabel(false);
        setOverallView(pos, currentSlideOrient);
    }

}

// image controls end -

// Statistics start +
// function Statistics(userId, itemID, device, dir_name) {
//     "use strict";
//     const p = new Promise((resolve, reject) => {
//         $.post(phpedit_url + 'statistics/addvisit', {
//             'user_id': userId,
//             'items_id': itemID,
//             '_': '',
//             'dir_name': dir_name,
//             'device': device
//         }, function (result) {
//             resolve(result);
//         });
//     }).then((result) => {
//         // console.log(result);
//     }).catch((err) => {
//         console.log(err)
//     })
// }
// Statistics end -


var space_detail = function (objQuery) {
    "use strict";
    let dirname = objQuery.urlObj['p']
    return new Promise((resolve, reject) => {
        $.post(phpedit_url + "items/outlink_items", {
            dirname: dirname
        }, function (data, status) {
            resolve(data);
        })
    })
}

// var singleitem = function (items_id) {
//     "use strict";
//     return new Promise((resolve, reject) => {
//         $.post(phpedit_url + "statistics/singleitem", {
//             items_id: items_id
//         }, function (data, status) {
//             resolve(data);
//         });
//     });
// }

// 点赞
function dianzanpost() {
    "use strict";
    return new Promise((resolve, reject) => {
        $.post(php_url + "statistics/Comment/praise", {
            dirname: dirname
        }, function (data, status) {
            resolve(data);
        });
    });
}

// 分享
function fenxiangpost() {
    "use strict";
    return new Promise((resolve, reject) => {
        $.post(php_url + "statistics/Comment/share_items_link", {
            dirname: dirname
        }, function (data, status) {
            resolve(data);
        });
    });
}

// 拨打电话
function dianhuapost() {
    "use strict";
    return new Promise((resolve, reject) => {
        $.post(php_url + "statistics/Comment/items_click_number", {
            dirname: dirname
        }, function (data, status) {
            resolve(data);
        });
    });
}

// 获取微信分享配置
function js_signature() {
    $.post(phpimg_url + "weixin_open/ky_open/php_api/get_js_signature.php", {
        url: window.location.href
    }, function (data, status) {
        var newData = JSON.parse(data);
        wxJsShare( newData.data);
    });
}

// 分享
function wxJsShare(js_config)
{
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: js_config.appId, // 必填，公众号的唯一标识
        timestamp: js_config.timestamp, // 必填，生成签名的时间戳
        nonceStr: js_config.nonceStr, // 必填，生成签名的随机串
        signature: js_config.signature,// 必填，签名
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareWeibo'] // 必填，需要使用的JS接口列表
    });
    wx.ready(function () {
        if (modelDdata) {
            var title = modelDdata.title ? modelDdata.title : '无';
            var desc = modelDdata.title ? modelDdata.title : '无';
            var link = rootPath;
            var imgUrl = phpimg_url+modelDdata.marker_image;
            //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
            wx.updateAppMessageShareData({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 设置成功
                }
            })
            //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            wx.updateTimelineShareData({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 设置成功
                }
            })
            //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
            wx.onMenuShareWeibo({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    });
}

var _paq = window._paq || [];
function getSiteid() {
    console.log('请求统计接口');
    var send_data = {
        'items_dirname': dirname,
        'other_data_asdfal': 'other',
    };
    $.ajax({
        type: 'post',
        url: 'https://todo.kangyun3d.cn/index.php/index2/items/get_siteid',
        data: send_data,
        dataType: "json",
        success: function (data) {
            // console.log(data);
            //成功后的操作
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            if (data.code == 200) {
                var siteid = data.data.idsite;
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function () {
                    var u = "https://todo.kangyun3d.cn/statistics/matomo/";
                    _paq.push(['setTrackerUrl', u + 'matomo.php']);
                    _paq.push(['setSiteId', siteid]);

                    //第二个
                    var secondaryWebsiteId = data.data.company_siteid
                    var threearyWebsiteId = data.data.user_siteid;//第三个
                    // Also send all of the tracking data to this other Matomo server, in website ID 77
                    _paq.push(['addTracker', u + 'matomo.php', secondaryWebsiteId]);
                    _paq.push(['addTracker', u + 'matomo.php', threearyWebsiteId]);

                    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
                    g.type = 'text/javascript';
                    g.async = true;
                    g.defer = true;
                    g.src = u + 'matomo.js';
                    s.parentNode.insertBefore(g, s);
                })();
            } else {
                console.log('获取siteid错误')
            }
        }
    });
}
// slider();
// initTag();
// initMeasure();
// initLabel();
// initDefaultPointDoor();
// //Initial hidden ruler
// HiddenMeasure();
// HiddenMeasure2D();