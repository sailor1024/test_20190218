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
            $('.buttonShow>li:first-child').find('label').find('span').removeClass('active');
        }
        if (!modelData.playShow) {
            $('.buttonShow>li:nth-child(2)').find('label').find('span').removeClass('active');
        }
        if (!modelData.Perspective) {
            $('.buttonShow>li:nth-child(3)').find('label').find('span').removeClass('active');
        }
        if (!modelData.zoom) {
            $('.buttonShow>li:last-child').find('label').find('span').removeClass('active');
        }
    }


    // 信息块点击
    $('.buttonShow>li').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        hideGuide();
        let index = $(this).attr('data-index');
        if (index == 1) {
            let Target = $(e.target).attr('for');
            if (!Target) {
                showTitle();
                return false
            }
            // 显示标题与简介
            if ($(e.target).attr('class').indexOf('active') != -1) {
                $(e.target).removeClass('active');
                // 写入modelData.json文件中
                modelData.titleShow = false;
                sendAjax();
            } else {
                $(e.target).addClass('active');
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
            if ($(e.target).attr('class').indexOf('active') != -1) {
                $(e.target).removeClass('active');
                modelData.playShow = false;
                sendAjax();
            } else {
                $(e.target).addClass('active');
                modelData.playShow = true;
                sendAjax();
            }

        } else if (index == 3) {
            let Target = $(e.target).attr('for')
            if (!Target) {
                showPerspective();
                return false
            }
            if ($(e.target).attr('class').indexOf('active') != -1) {
                $(e.target).removeClass('active');
                modelData.Perspective = false;
                sendAjax();
            } else {
                $(e.target).addClass('active');
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
            if ($(e.target).attr('class').indexOf('active') != -1) {
                $(e.target).removeClass('active');
                modelData.zoom = false;
                sendAjax();
            } else {
                $(e.target).addClass('active');
                modelData.zoom = true;
                sendAjax();
            }
        } else if (index == 5) {
            let Target = $(e.target).attr('for');
            if (!Target) {
                // console.log('没有任何提示');
                return false
            }
            if ($(e.target).attr('class').indexOf('active') != -1) {
                $(e.target).removeClass('active');
                modelData.Planelabel = false;
                sendAjax();
            } else {
                $(e.target).addClass('active');
                modelData.Planelabel = true;
                sendAjax();
            }
        } else if (index == 6) {
            let Target = $(e.target).attr('for');
            if (!Target) {
                return false
            }
            if ($(e.target).attr('class').indexOf('active') != -1) {
                $(e.target).removeClass('active');
                modelData.BgMusic = false;
                sendAjax();
            } else {
                if (modelData.BgMusicLink == '' || !modelData.BgMusicLink) {
                    // 提示用戶上传音频文件
                    $('.beijingyinyueShow').show();
                } else {
                    $(e.target).addClass('active');
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
        AddTagCancel();
        celiangClose();
        LabelCancel();
        // 取消mesh
        monirenxingClick();
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



    $('.measure').click(function() {
        LabelCancel();
        AddTagCancel();
        document.body.style.cursor = "crosshair";
        popEditHid();
        translateNavEnd();
        hideGuide();

        // 设置对应的图标
        let icon = 'iconfont icon-cubelifangti'
        $('.nav-icon-right-top>i:first-child').attr('class', icon);

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


    // 标签开关点击开始

    $('.ShowCase .lever').click(function(e) {
        e.stopPropagation();
    })
    $('.ShowCase>ul>li').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        let index = $(this).attr('data-index');
        if (index == 1) {
            let Target = $(e.target).attr('type');
            if (Target == 'checkbox') {
                if ($(e.target).parent().find('span').attr('class').indexOf('active') != -1) {
                    $(e.target).parent().find('span').removeClass('active')
                    TagObjects[TagSelet].TagGroup.visible = false;
                    TagDivvisible(false);
                } else {
                    $(e.target).parent().find('span').addClass('active')
                    TagObjects[TagSelet].TagGroup.visible = true;
                    TagDivvisible(true);
                }
            }
        } else if (index == 2) {
            let Target = $(e.target).attr('type');
            if (Target == 'checkbox') {
                if ($(e.target).parent().find('span').attr('class').indexOf('active') != -1) {
                    $(e.target).parent().find('span').removeClass('active')
                    TagObjects[TagSelet].Line.visible = false;
                } else {
                    $(e.target).parent().find('span').addClass('active')
                    TagObjects[TagSelet].Line.visible = true;
                }
            }
        }
    })
    // 标签开关点击结束

    // 入户门标签开关点击开始
    $('.EntranceDoors-show>ul>li').click(function(e) {
        e.stopPropagation();
        e.preventDefault();

        let index = $(this).attr('data-index');
        let Target = $(e.target).attr('for');
        console.log("t",Target);
        if (Target == 'showRedian') {
            if ($(e.target).parent().find('span').attr('class').indexOf('active') != -1) {
                $(e.target).parent().find('span').removeClass('active')
                DoorDisplay = false;
                PushEntranceDoor();
            } else {
                $(e.target).parent().find('span').addClass('active')
                DoorDisplay = true;
                PushEntranceDoor();
            }
        }

    })
    // 入户门标签开关点击结束



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



    //按键启动
    $('.matterIcon').click(function() {
        console.log(333)
        celiangClose();
        LabelCancel();

        hideGuide();
        // 设置对应的图标
        let icon = 'iconfont icon-three'
        $('.nav-icon-right-top>i:first-child').attr('class', icon);
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
        $('.caonima').text($(this).find('span').text())
        if (index == 0) {
            // console.log('mesh');
            if (curIndex == -1) {
                setWalkingMeshView(0);
            } else {
                setWalkingMeshView(curIndex);
            }

            HiddenMeasure2D(); //隐藏2D标尺
            ShowMeasure3D(); //显示3D标尺
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
    $('.icon-left-show>div:not([class="MapVideo"])').click(function(e) {
        $('.MapVideo>div').hide();
    })
    // 导航操作结束



    // screen
    var scaleNum = 100;

    $('.exit').click((e) => {
        e.stopPropagation();
        TagsVisible(true);
        HiddenLabel(true);
        ShowMeasure();
        zoominit();
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



    // 贴图按钮启动
    $('.MapVideo').click(() => {
        alert('此功能暂未开放') 
        return false;
        hideGuide();
        // 跳转到漫游模式
        if (!modeSwitch.isWalkingMode()) {
            // 设置对应的图标
            let icon = 'iconfont icon-three'
            $('.nav-icon-right-top>i:first-child').attr('class', icon);
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
        } else if (key == 3) {
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



    // const chooseMap = new MapObj(0,0,0,0,0,0,0,0,0);
    let chooseMap;
    let pan = true
    $('.addMapVideo').click((e) => {
        e.stopPropagation();
        let src;
        if (FileType == 'Uploading') {
            src = $('.MapVideoContent-choose>.Media-box>input').val();
            if (src == '') {
                alert('请上传视频文件');
                return false
            }
        }
        // 设置src地址
        chooseMap.change('src', src);
        // 设置type值
        chooseMap.change('type', FileType);
        console.log(chooseMap)

        // 设置贴图的视频为用户上传的
        texture.image.currentSrc = src;
        $(texture.image).attr('src', '4aa887aedd5396161b4f8250712f3c85/video/test.mp4')

        // 隐藏界面
        popEditHid();
        translateNavEnd();
        $(".nav-icon-right-list").removeClass('active');
    })
    $('.removeMapVideo').click((e) => {
        e.stopPropagation();
        popEditHid();
        translateNavEnd();
        $(".nav-icon-right-list").removeClass('active');
    })

    $('.rangeControls>a[data-key=reduce]').click(function(e) {
        pan = false;
        e.stopPropagation();
        let key = $(this).attr('data-index');
        let val = $(this).siblings('.rangeContent').find('.range-field').find('input').val();
        val--;
        if (val < 0) {
            return false
        }

        $(this).siblings('.rangeContent').find('.range-field').find('input').val(val);
        chooseMap.change(key, val);

    })
    $('.rangeControls>a[data-key=add]').click(function(e) {
        e.stopPropagation();
        let key = $(this).attr('data-index');
        let val = $(this).siblings('.rangeContent').find('.range-field').find('input').val();
        val++;
        if (val > 100) {
            return false
        }

        $(this).siblings('.rangeContent').find('.range-field').find('input').val(val);
        chooseMap.change(key, val);
    })

    $('.MapVideoContent-title').mouseout(function(e) {
        $(this).find('.rangeControls').find('.rangeContent').find('.showVal').css('opacity', '0');
    })



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
            'transform': 'translate(7px)'
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
        } else if (key == 'huxing') {
            $('.huxing-show').show();
        } else if (key == 'ApartmentMap') {
            $('.ApartmentMap-show').show();
        } else if (key == 'EntranceDoors') {
            $('.EntranceDoors-show').show();
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


    // 导览点击
    $('.guild').click(function() {
        // 判断当前是否有图片
        if (modelData.slider.length <= 0) {
            console.log('image is none');
            window.parent.postMessage('CannotPlay', '*');
            return false;
        };
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


    // 导航图上传
    $('.huxingtu').on('click', function(e) {
        uploadtype = 'Map'
        e.stopPropagation();
        AddTagCancel();
        celiangClose();
        LabelCancel();
        // 取消mesh
        // monirenxingClick();

        // 弹出操作界面
        popEdit('huxing');
        translateNav();
        //Switching 1D Perspective
        let myEvent = new Event('click');
        document.getElementById('monirenxing').dispatchEvent(myEvent);
    })

    // 户型图上传
    $('.ApartmentMap').on('click', function(e) {
        uploadtype = 'Map_B'
        e.stopPropagation();
        // 弹出操作界面
        popEdit('ApartmentMap');
        translateNav();
        //Switching 2D Perspective
        let myEvent = new Event('click');
        document.getElementById('mapBtn2D').dispatchEvent(myEvent);
    })

    // 入户门设置
    $('.EntranceDoors').on('click', function(e) {
        e.stopPropagation();
        console.log("入户门设置");
        // 弹出操作界面
        popEdit('EntranceDoors');
        translateNav();
    })


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
            GuideArray({
                src
            });
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



    function removeAllSpace(str) {
        return str.replace(/\s+/g, "");
    }



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



    $('.heightAdjustment').on('input', function() {

        TagObjects[TagSelet].Line.scale.z = $('.heightAdjustment').val();
        TagObjects[TagSelet].Line.name = parseFloat($('.heightAdjustment').val());
        TagObjects[TagSelet].Line.position.z = 0.25 * $('.heightAdjustment').val();
        TagObjects[TagSelet].TagRound.position.z = 0.5 * $('.heightAdjustment').val();

    })