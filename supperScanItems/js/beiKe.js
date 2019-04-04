// 2018 12月11日
// 作者: Winat
// window.onload = function () {
    var html = document.getElementsByTagName('html')[0];
    html.style.minHeight = html.clientHeight + 'px';

    // 定义全局变量
    var swiperIf = true;
    var sstrat = true;

    // 设置全局属性
    var errorObj = {
        question_type: 1,
        question_description: '',
        contact_phone: ''
    };
    // var objQuery = getUrlQuery();
    OninitRUn();
    function OninitRUn() {
        mobileMove();
    }

    document.body.addEventListener('click', bodyClick, false);

    function bodyClick(e) {
        if($('#household_chart').css('display') == 'block'){//当显示户型图时，页面点击失效
            e.preventDefault();
            e.stopPropagation();
        }
        $('#SOHUCS').fadeOut();
        $('#SOHUCS').addClass('dianjipingmu');
        $('.close-svg').fadeOut();
        $('.js-modal').fadeOut();
        $('.pc-bar').fadeOut();
        $('.pc-masking').fadeOut();
        $("#menu-open").prop("checked", false);
        if (window.deviceMsg.isIPad) {
            $('.toolbarpc-setting-modal').css({'-webkit-transform': 'scale(0)', 'transform': 'scale(0)'});
            sstrat = true;
        }
    }

    //移动端事件
    function mobileMove() {
        setTimeout(() => {
            if (window.deviceMsg.isMobile) {
                // 移动端拖拽事件
                // console.log(document.getElementsByClassName('slide-content')[0])
                document.getElementsByClassName('slide-content')[0].addEventListener('touchstart', JSslideronTouchstrat, false);
                document.getElementsByClassName('slide-content')[0].addEventListener('touchmove', JSslideronTouchMove, false);
                document.getElementsByClassName('js-slide-area')[0].addEventListener('mousedown', JSslideronMousedown, false);
                document.getElementsByClassName('js-slide-area')[0].addEventListener('mousemove', JSslideronMousedown, false);
                document.getElementsByClassName('js-slide-area')[0].addEventListener('touchstart', JSslideronMousedown, false);
                document.getElementsByClassName('js-slide-area')[0].addEventListener('touchmove', JSslideronMousedown, false);
                document.getElementsByClassName('js-slide-area')[0].addEventListener('click', JSslideronMousedown, false);
                document.getElementsByClassName('phone-img')[0].addEventListener('touchstart', PhoneImgonMousedown, false);
                document.getElementsByClassName('phone-img')[0].addEventListener('mousedown', PhoneImgonMousedown, false);
                document.getElementsByClassName('phone-img')[0].addEventListener('mousemove', JSslideronMousedown, false);
                document.getElementsByClassName('phone-img')[0].addEventListener('touchmove', JSslideronMousedown, false);
                document.getElementsByClassName('toolbarpc-icon')[0].addEventListener('touchstart', SettingTouchstrat, false);
                // document.getElementById('SOHUCS').addEventListener('touchstart', cydivTouch, false);
                // document.getElementById('SOHUCS').addEventListener('touchmove', cydivTouch, false);

                $('.toolbarpc-modal-main1').hide();//手机模式隐藏弹出提示
                $('#pullTab').unbind();
                // 设置对比变量
                var initX;
                var initY;

                //手机端判断底部图片隐藏左下角按钮
                var sliderY = false;
                if (modelData.slider.length == 0 && window.deviceMsg.isMobile && window.deviceMsg.isIPad == false) {
                    sliderY = true;
                }

                //阻止畅言点击冒泡
                function cydivTouch(e) {
                    $("#menu-open").prop("checked", false);
                    e.stopPropagation();
                }

                //左下角设置按钮点击
                function SettingTouchstrat(e) {
                    if (sstrat) {
                        $('.toolbarpc-setting-modal').css({'-webkit-transform': 'scale(1)', 'transform': 'scale(1)'});
                        sstrat = false;
                        $('.js-modal').fadeOut();
                        $('#SOHUCS').fadeOut();
                        $('.close-svg').fadeOut();
                    } else {
                        $('.toolbarpc-setting-modal').css({'-webkit-transform': 'scale(0)', 'transform': 'scale(0)'});
                        sstrat = true;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }

                //左下角上拉下拉按钮点击、按下事件
                function PhoneImgonMousedown(e) {
                    var swiheight = parseInt($('.pinBottom-container').css('bottom'));
                    if (swiheight == 0) {
                        if ($('.js-slide-area').hasClass('active')) {
                            $('.menu').show();
                            editarea(sliderY, false);
                        } else {
                            $('.menu').hide();
                            $('#SOHUCS').fadeOut();
                            $('.close-svg').fadeOut();
                            $('#SOHUCS').addClass('dianjipingmu')
                            $('.js-modal').fadeOut();
                            editarea(sliderY, true);
                        }
                    } else {
                        if (swiheight == 30) {
                            $('.menu').hide();
                            $('#SOHUCS').fadeOut();
                            $('.close-svg').fadeOut();
                            $('#SOHUCS').addClass('dianjipingmu')
                            $('.js-modal').fadeOut();
                            $('.swiper').css({
                                'height': '122px'
                            })
                            $('.pinBottom-container').css({
                                'bottom': '117px'
                            })
                            editarea(sliderY, true);
                        } else {
                            $('.menu').show();
                            $('.swiper').css({
                                'height': '0'
                            })
                            $('.pinBottom-container').css({
                                'bottom': '30px'
                            })
                            editarea(sliderY, false);
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }

                //左下角按钮区域点击
                function JSslideronMousedown(e) {
                    if ($('.js-slide-area').hasClass('active')) {
                        $('.menu').hide();
                    } else {
                        $('.menu').show();
                    }
                    e.stopPropagation();
                }

                function JSslideronTouchstrat(e) {
                    if ($('.js-slide-area').hasClass('active')) {
                        $('.menu').hide();
                    } else {
                        $('.menu').show();
                    }
                    initX = e.touches[0].pageX;
                    initY = e.touches[0].pageY;
                    e.preventDefault();
                    e.stopPropagation();
                }

                function JSslideronTouchMove(e) {
                    let X = e.touches[0].pageX;
                    let Y = e.touches[0].pageY;
                    let res = Y - initY;
                    if (Math.abs(res) >= 10 && res < 0) {
                        // 上拉
                        editarea(sliderY, true);
                    } else {
                        // 下拉
                        editarea(sliderY, false);
                    }
                    if ($('.js-slide-area').hasClass('active')) {
                        $('.menu').hide();
                    } else {
                        $('.menu').show();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }

                //修改底部轮播高度
                function editarea(sliderY, type) {
                    if (sliderY) {
                        if (type) {
                            $('.js-slide-area').addClass('active');
                            $('.js-slide-area.active').css('transform', 'translateY(96px)');
                        } else {
                            $('.js-slide-area').removeClass('active');
                            $('.slide-area').css('transform', 'translateY(143px)');
                        }
                    } else {
                        if (type) {
                            $('.js-slide-area').addClass('active');
                        } else {
                            $('.js-slide-area').removeClass('active')
                        }
                    }
                }
                js_signature();
            }
        }, 300)
    }

    //#####################轮播图相#####################
    //swiper插件
    function OnceSwiper() {
        new Swiper('.Swiper-msg', {
            effect: 'coverflow',
            centeredSlides: true,
            slidesPerView: 'auto',
            autoplay: false,
            initialSlide: 1,//默认第二个
            coverflowEffect: {
                rotate: 30,
                depth: 100,
                modifier: 1,
            },
            spaceBetween: '5%',
            loop: true,//可选选项，开启循环
            observer: true,
            observerParent: true
        });
    }
    //防止轮播图点击冒泡
    $('.js-modal').click(function (e) {
        e.stopPropagation();
    })
    $('.pc-bar').click(function (e) {
        e.stopPropagation();
    })

    // 百度地图加载
    function baiduMap(mapId) {
        var map = new BMap.Map(mapId);
        var point = new BMap.Point(longitude, latitude);
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom(true);
        // map.disableDragging();
        var opts = {
            width: 200, // 信息窗口宽度
            height: 100, // 信息窗口高度
            title: initAddress, // 信息窗口标题
            enableMessage: true, //设置允许信息窗发送短息
            message: ""
        }
        var infoWindow = new BMap.InfoWindow(initAddress, opts); // 创建信息窗口对象
        marker.addEventListener("click", function () {
            map.openInfoWindow(infoWindow, point); //开启信息窗口
        });

        // 创建地址解析器实例
        // var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        // myGeo.getPoint(initLocation, function (point) {
        //     if (point) {
        //         map.centerAndZoom(point, 16);
        //         console.log(point);
        //         map.addOverlay(new BMap.Marker(point));
        //         console.log("您选择地址解析到结果!");
        //     } else {
        //         console.log("您选择地址没有解析到结果!");
        //     }
        // }, "广州市");
    }

    //#####################畅言相关#####################
    // 畅言插件关闭按钮事件
    $('.close-svg').click(function (e) {
        $('#SOHUCS').fadeOut();
        $('#SOHUCS').addClass('dianjipingmu');
        $('.close-svg').fadeOut();
        e.stopPropagation();
    })
    //点击畅言，关闭右下角按钮并阻止冒泡
    $('#cydiv').click(function (e) {
        $("#menu-open").prop("checked", false);
        e.stopPropagation();
    })

    //#####################左下角菜单功能#####################
    $('.js-minimap-on').on('click', function (e) {btn2D(e);})
    $('#house-type').on('touchstart', function (e) {btn2D(e);})
    $('.js-minimap-off').on('click', function (e) {btn3D(e);})
    $('#model').on('touchstart', function (e) {btn3D(e);})
    $('.js-panorama').on('click', function (e) {walk(e);})
    $('#walk').on('touchstart', function (e) {walk(e);})
    //电脑判断左下角按钮隐藏
    if(modelData.slider && modelData.slider.length == 0){
        $('.play').hide();
        if(window.deviceMsg.isMobile && window.deviceMsg.isIPad == false) {
            $('.swiper').hide();
        } else {
            $('#pullTab').hide();
        }
    }
    // 2D模式
    var img2D = rootPath + 'Map_B.png';
    function btn2D(e){
        $('.js-modal').fadeOut();
        $('.pc-bar').fadeOut();
        $('.pc-masking').fadeOut();
        e.stopPropagation();
        $('.js-minimap-buttons').children().removeClass('active');
        // this.classList.add('active');
        let myEvent = new Event('click');
        document.getElementById('mapBtn2D').dispatchEvent(myEvent);
        $('#household_chart img').attr("src", img2D);
        $('.m2d-masking').show();
        console.log($('#household_chart')[0].style.display);
        $('#household_chart').fadeIn(600);
    }
    // 3D模式
    function btn3D(e){
        $('#household_chart').fadeOut();
        $('.js-modal').fadeOut();
        $('.pc-bar').fadeOut();
        $('.pc-masking').fadeOut();
        $('.m2d-masking').hide();
        e.stopPropagation();
        $('.js-minimap-buttons').children().removeClass('active');
        // this.classList.add('active');
        let myEvent = new Event('click');
        document.getElementById('mapBtn3D').dispatchEvent(myEvent);
        console.log($('#household_chart')[0].style.display);
    }
    // 漫游
    function walk(e){
        $('#household_chart').fadeOut();
        $('.js-modal').fadeOut();
        $('.pc-bar').fadeOut();
        $('.pc-masking').fadeOut();
        $('.m2d-masking').hide();
        e.stopPropagation();
        $('.js-minimap-buttons').children().removeClass('active');
        // this.classList.add('active');
        // 设置点击进入漫游模式
        let myEvent = new Event('click');
        document.getElementById('monirenxing').dispatchEvent(myEvent);
    }
    //ipad、手机端VR
    // $('#vr').on('touchstart', function (e) {
    //     $('#household_chart').fadeOut();
    //     $('.js-modal').fadeOut();
    //     $('.pc-bar').fadeOut();
    //     e.stopPropagation();
    //     vrDisplay.requestPresent([{
    //          source: renderer.domElement
    //     }]);
    //     visibleNav(false); //Hidden map
    // })

    //PC端标尺事件
    $('.PC-jsRuler').click(function (e) {
        jsRuler(e, '.PC-jsRuler');
    })
    //PC端标签事件
    $('.PC-jstag').click(function (e) {
        jsTag(e, '.PC-jstag');
    })
    // ipad标尺事件
    $('.PC-jsRuler').on('touchstart', function (e) {
        jsRuler(e, '.PC-jsRuler');
    })
    // ipad标签事件
    $('.PC-jstag').on('touchstart', function (e) {
        jsTag(e, '.PC-jstag');
    })
    //手机端标尺事件
    $('.MobileJs-Ruler').click(function (e) {
        jsRuler(e, '.MobileJs-Ruler');
    })
    //手机端标签事件
    $('.MobileJs-tag').click(function (e) {
        jsTag(e, '.MobileJs-tag');
    });
    //标尺操作
    function jsRuler(e, className){
        if ($(className).find('span').text() == '打开标尺') {
            $(className).find('span').text('关闭标尺');
            $(className).find('i').removeClass('iconbiaochi');
            $(className).find('i').addClass('iconguanbibiaochi');
            ShowMeasure();
            ShowMeasure2D();
        } else {
            $(className).find('span').text('打开标尺');
            $(className).find('i').removeClass('iconguanbibiaochi');
            $(className).find('i').addClass('iconbiaochi');
            HiddenMeasure();
            HiddenMeasure2D();
        }
        e.preventDefault();
        e.stopPropagation();
    }
    //标签操作
    function jsTag(e, className){
        if ($(className).find('span').text() == '打开标签') {
            $(className).find('span').text('关闭标签');
            $(className).find('i').removeClass('iconbiaoqian');
            $(className).find('i').addClass('iconguanbibiaoqian');
            TagsVisible(true);
        } else {
            $(className).find('span').text('打开标签');
            $(className).find('i').removeClass('iconguanbibiaoqian');
            $(className).find('i').addClass('iconbiaoqian');
            TagsVisible(false);
        }
        e.preventDefault();
        e.stopPropagation();
    }

    //#####################右下角菜单功能#####################
    //点击主按钮弹出轮播图
    var mapIf = true;
    $('.js-fold').click(function (e){
        $('.ui-confirm-layer').removeClass('active');
        $('.titlebar-text-arrow>img').toggleClass('active');
        var timer;
        clearTimeout(timer);
        if ($("#menu-open").prop("checked") == false) {
            timer = setTimeout((e) => {
                if(isPc()) {
                    if(mapIf) {
                        baiduMap('pc-allmap');
                        mapIf = false;
                    }
                    //判断屏幕大小居中
                    var w = $(window).width();
                    var nw = 1214;
                    if(w < 1366){
                        nw = 989;
                    }
                    var left = (w - nw) / 2;
                    $('.pc-bar').css('left', left + 'px');

                    $('.pc-bar').fadeIn();
                    $('.pc-masking').fadeIn();
                } else {
                    $('.js-modal').show();
                    if(mapIf) {
                        baiduMap('allmap');
                        mapIf = false;
                    }
                    // 隐藏轮播图判断
                    if (swiperIf) {
                        OnceSwiper();
                        swiperIf = false;
                    }
                }
                $("#menu-open").prop("checked",true);
                $('#SOHUCS').fadeOut();
                $('.close-svg').fadeOut();
            }, 50)
        } else {
            timer = setTimeout((e) => {
                if(isPc()) {
                    $('.pc-bar').fadeOut();
                    $('.pc-masking').fadeOut();
                } else {
                    $('.js-modal').fadeOut();
                }
                $("#menu-open").prop("checked",false);
                $('#SOHUCS').fadeOut();
                $('.close-svg').fadeOut();
            }, 100)
        }
        e.preventDefault();
        e.stopPropagation();
    })
    // 点赞
    $('.dianzhan').click((e) => {
        if($('.icondianzan').css('color') == 'rgb(255, 255, 255)'){
            $('.icondianzan').css('color', 'rgb(255, 0, 0)');
        } else {
            $('.icondianzan').css('color', 'rgb(255, 255, 255)');
        }
        dianzanpost();
        e.stopPropagation();
    })
    //电话
    $('.dianhua').click(function (e) {
        dianhuapost();
    })


    //#####################分享相关操作#####################
    $('.ui-confirm-layer').click(function (e){
        e.stopPropagation();
    })
    $('.js-share').click(function (e){
        e.stopPropagation();
        // 切换class
        $('.ui-confirm-layer').toggleClass('active');
        $('.titlebar-text-arrow>img').removeClass('active')
        $('.js-slide-area').removeClass('active');
        $('.js-modal').removeClass('active').hide();
        $('.js-fold').removeClass('active');
    })
    $('.js-ui-confirm-cancel').click(function (e){
        $('.ui-confirm-layer').toggleClass('active');
    })
    $('.js-ui-confirm-ok').click(function (e){
        // var obj = document.getElementById('ui-confirm-message-textarea');
        var Url2 = document.getElementById("copy-message");
        Url2.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        alert("已复制好，可贴粘。");
        $('.ui-confirm-layer').toggleClass('active');
        fenxiangpost();
    })



    // #####################问题反馈#####################
    var errorKey = true;
    $('.question').on('touchmove', function (e) {
        e.stopPropagation();
        window.event.returnValue = true;
    })
    $('.question>div>header>i').on('click', function (e) {
        e.stopPropagation();
        $('.question').hide();
        $('.menu').hide();
    })
    $('.js-feedback').on('click', function (e) {
        e.stopPropagation();
        $('.question').css('display', 'block');
        errorKey = true;
        $('.errorSubmite>p').addClass('active')
    })
    // ul 点击事件
    $('.errorType>ul>li').on('click', function (e) {
        errorObj.question_type = $(this).attr('data-index');
        $(this).parent().children().removeClass('active');
        $(this).addClass('active');
    })
    // textarea 检测字数
    $('.errorInset-text>textarea').keyup(function (e) {
        // 获取要显示已经输入字数文本框对象
        let len = $(this).val().length;
        $('#num').text(len + '/500');
    })
    $('.errorInset-text>textarea').blur(function (e) {
        errorObj.question_description = $(this).val();
    })
    $('.errorConnect>input').blur(function (e) {
        errorObj.contact_phone = $(this).val();
    })
    // 提交
    $('.errorSubmite>p').on('click', function (e) {
        let slef = this;
        if(errorObj.contact_phone != '') {
            if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(errorObj.contact_phone))) {
                // 出现弹框
                $('.questionTitleMsgTwo').html("请输入正确的号码");
                $('.questionAlert').show();
                clearTimeout(t);
                var t = setTimeout(() => {
                    $('.questionAlert').hide();
                    $('.question').css('display', 'none');
                }, 30000)
                return false;
            }
        }
        if (!errorKey) {
            $(slef).removeClass('active');
            return false;
        }
        const p = new Promise((resolve, reject) => {
            $.post(phpedit_url + "itemsquestion/add_question", {
                question_type: errorObj.question_type,
                question_description: errorObj.question_description,
                contact_phone: errorObj.contact_phone
            }, function (data) {
                resolve(data);
            })
        }).then((data) => {
            if (data.code == 200) {
                $(slef).removeClass('active');
                errorKey = false;
                // 出现弹框
                $('.questionTitle').show();
                clearTimeout(t);
                var t = setTimeout(() => {
                    $('.questionTitle').hide();
                    $('.question').css('display', 'none');
                }, 3000)
            }
        }).catch((error) => {
            // 出现弹框
            $('.questionAlert').show();
            clearTimeout(t);
            var t = setTimeout(() => {
                $('.questionAlert').hide();
                $('.question').css('display', 'none');
            }, 3000)
        })
    })
    $('.phone-em-con').on('touchend', (e) => {
        e.stopPropagation();
        $('.js-telephone')[1].click();
    })

// }
