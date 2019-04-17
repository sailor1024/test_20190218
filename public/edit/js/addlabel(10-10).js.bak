function addMatterPos(id, pos) {

    // console.log(pos.x+$('.content-nav-left').width(),pos.y+$('.header').height())

    $('#' + id).css({

        'left': pos.x + $('.content-nav-left').width() + "px",

        'top': pos.y + $('.header').height() + "px"

    })


}
function addMatterPosTitle(id, pos) {

    // console.log(pos.x+$('.content-nav-left').width(),pos.y+$('.header').height())

    $('#' + id).css({

        'left': pos.x + $('.content-nav-left').width() + 25 +  "px",

        'top': pos.y + $('.header').height() + -60 + "px"

    })


}

var staticViewDirection, staticViewDirectionY;

var deviationViewDirection, deviationViewDirectionY;

var totalDeviation;

var removeLabelId;
var clickWhich;
var abababab;

function operateMatter() {



    for (let i = 0; i < modelData.tags.length; i++) {
        var label = document.createElement('img');
        var mattertagTitleShow = document.createElement('div');
        var mattertagTitleShowChild1 = document.createElement('p');
        var mattertagTitleShowChild2 = document.createElement('p');

        mattertagTitleShowChild1.setAttribute('class', 'Child1-title');
        mattertagTitleShowChild2.setAttribute('class', 'Child2-content');


        // 检测如果当前的标签没有标题显示，就加入默认显示值
        if (modelData.tags[i]['title-show'] == '' && modelData.tags[i]['title-content'] == '') {
            mattertagTitleShowChild1.innerHTML = '标签1';
            mattertagTitleShowChild2.innerHTML = '请输入内容';
        } else {
            mattertagTitleShowChild1.innerHTML = modelData.tags[i]['title-show'];
            mattertagTitleShowChild2.innerHTML = modelData.tags[i]['title-content'];
        }

        mattertagTitleShow.setAttribute('id', modelData.tags[i].titleId);
        mattertagTitleShow.setAttribute('class', 'pop-div');
        mattertagTitleShow.setAttribute('style', 'z-index: 1');

        mattertagTitleShow.appendChild(mattertagTitleShowChild1);
        mattertagTitleShow.appendChild(mattertagTitleShowChild2);
        
        label.setAttribute('id', modelData.tags[i].sid);
        label.setAttribute('class', 'label');
        label.setAttribute('src', modelData.tags[i].icon);
        label.setAttribute('dataSource', modelData.tags[i].url);
        label.setAttribute('type', modelData.tags[i].type);
        label.setAttribute('title', modelData.tags[i].title);
        label.setAttribute('goIndex', modelData.tags[i].goIndex);
        label.setAttribute('goAngle', modelData.tags[i].goAngle);
        label.setAttribute('description', modelData.tags[i].description);
        label.setAttribute('position', JSON.stringify(modelData.tags[i].position));



        document.body.appendChild(label);
        document.body.appendChild(mattertagTitleShow);



        $(label).bind('click', function (e) {
            let left = $(this).css('left');
            let top = $(this).css('top');


            let id = $(this).attr('id').replace('mattertag', '');
            $(id).css({'top': top, 'left': left})


            OnMatterTag = 'pop-div' + id;


            // 设置标签页的内容开始
            $('.title-box>textarea').val($('#'+ OnMatterTag +'>p[class=Child1-title]').text())
            $('.content-box>textarea').val($('#'+ OnMatterTag +'>p[class=Child2-content]').text())
            // 顺便显示字数
            $('.chart-size').text($('#' + OnMatterTag + '>p[class=Child1-title]').text().length + '个字符');
            $('.content-size').text($('#' + OnMatterTag + '>p[class=Child2-content]').text().length + '个字符');
            // 设置标签页的内容结束


            abababab = $(this).attr('datasource');

            var self = this;

            // 添加对应的class名称
            $('label[for="textarea1"]').addClass('active');

            $('label[for="textarea12"]').addClass('active');





            // $('.mattertagBoard').show(100)

              $('.content-nav-right').show(200);
              $('.mattertagBoard').show(100);
              $('.guildBoard').hide(100);
              $('.labelBoard').hide(100);
              $('.imgEdit').hide(100);


            $('.heightAdjustment').unbind('input');

            if (!isAddMatterTag) {

                for (var i = 0; i < modelData.tags.length; i++) {

                    if (modelData.tags[i].sid == $(self).attr('id')) {

                        clickWhich = i;

                        $(self).attr('position', JSON.stringify(modelData.tags[i].position))

                        $('.heightAdjustment').val(JSON.parse($(self).attr('position')).y)

                        removeLabelId=$(self).attr('id');


                    }

                }

                $('.tagUrl').val(modelData.tags[clickWhich].url);

                $('.description').val(modelData.tags[clickWhich].description)

                $('#textarea12').val(modelData.tags[clickWhich].url)

                $('.heightAdjustment').val(modelData.tags[clickWhich].position.y)

                $('.tagUrl').val(modelData.tags[clickWhich].datasource)

                var pos=modelData.tags[clickWhich].position.p;
                var normal=modelData.tags[clickWhich].position.n;
                // console.log(pos,normal)
                $('.heightAdjustment').on('input', function () {
                    var pos2=module3D.calcPosition(pos, normal, $(this).val());

                    modelData.tags[clickWhich].position.x = pos2.x;
                    modelData.tags[clickWhich].position.y = pos2.y;
                    modelData.tags[clickWhich].position.z = pos2.z;



                })

                $('.tagUrl').on('input', function () {



                    modelData.tags[clickWhich].datasource = $(this).val()



                })




            }

            if (window.innerWidth <= 500) {

                window.location.href = $(self).attr('dataSource');

                return



            }

            if ($(this).attr('type') == 'iframe') {



                $('#labelImg')[0].src = '';

                $('#labelVideo')[0].src = '';

                $('#labelIframe')[0].style.display = 'block';

                $('#labelImg')[0].style.display = 'none';

                $('#labelVideo')[0].style.display = 'none';

                setTimeout(function () {

                    $('#labelIframe')[0].src = $(self).attr('dataSource');



                }, 1500)

            } else if ($(this).attr('type') == 'img') {

                $('#labelImg')[0].src = $(this).attr('dataSource');

                $('#labelIframe')[0].src = '';

                $('#labelVideo')[0].src = '';

                $('#labelImg')[0].style.display = 'block';

                $('#labelIframe')[0].style.display = 'none';

                $('#labelVideo')[0].style.display = 'none';

                setTimeout(function () {

                    $('#labelImg')[0].src = $(self).attr('dataSource');



                }, 1500)

            } else if ($(this).attr('type') == 'video') {

                $('#labelIframe')[0].src = '';

                $('#labelImg')[0].src = '';

                $('#labelVideo')[0].style.display = 'block';

                $('#labelIframe')[0].style.display = 'none';

                $('#labelImg')[0].style.display = 'none';

                setTimeout(function () {

                    $('#labelVideo')[0].src = $(self).attr('dataSource');

                    $('#labelVideo')[0].play();



                }, 1500)

            }

            $('#imgDescribe').html($(self).attr('description'));








                $('#labelBoard').fadeIn();













            staticViewDirection = getViewDirection();

            staticViewDirectionY = getViewDirectionY();

            changeTransform(label.id);






        })





    }









}

$('.removeMattertag').click(function(){
    modelData.tags.splice(clickWhich,1)
    $('#labelBoard').fadeOut();
    document.body.removeChild(document.querySelector('#'+removeLabelId))



})

function changeTransform(id) {

    $('#labelBoard').css({ 'opacity': '1' });

    $('.Css3dRenderer').css({ 'transform': 'none' });

    document.body.addEventListener('touchstart', function (ed) {

        $('.FlexEmbed-mask').css('display', 'block');

        document.body.addEventListener('touchmove', function (em) {



            $('#labelBoard').css({

                'opacity': 1 - Math.abs((em.touches[0].clientX - ed.touches[0].clientX + em.touches[0].clientY - ed.touches[0].clientY) / 800),

                'transform': 'perspective(500px)',

                'transform-style': 'preserve-3d'

            });

            $('.Css3dRenderer').css({ 'transform': 'rotatey(' + -15 * (em.touches[0].clientX - ed.touches[0].clientX) / 800 + 'deg) rotatex(' + 55 * (em.touches[0].clientY - ed.touches[0].clientY) / 800 + 'deg)' })

        })



    })



    // $('body').mousedown(function(ed) {

    //     $('.FlexEmbed-mask').css('display', 'block');

    //     $('body').mousemove(function(em) {



    //         $('#labelBoard').css({

    //             'opacity': 1 - Math.abs((em.clientX - ed.clientX + em.clientY - ed.clientY) / 800),

    //             'transform': 'perspective(500px)',

    //             'transform-style': 'preserve-3d'

    //         });

    //         $('.Css3dRenderer').css({ 'transform': 'rotatey(' + -15 * (em.clientX - ed.clientX) / 800 + 'deg) rotatex(' + 55 * (em.clientY - ed.clientY) / 800 + 'deg)' })

    //     })



    // })



    // $('body').mousemove(function(e) {

    //     if (staticViewDirection != undefined & staticViewDirectionY != undefined) {



    //         totalDeviation = (getViewDirection() - staticViewDirection)



    //         $('#labelBoard').css({

    //             'opacity': 1 - Math.abs(totalDeviation / Math.PI) * Math.PI,

    //             'transform': 'perspective(500px)',

    //             'transform-style': 'preserve-3d'

    //         });

    //         $('.Css3dRenderer').css({ 'transform': 'rotatey(' + getViewDirection() * 15 + 'deg) rotatex(' + getViewDirectionY() * 25 + 'deg)' })

    //             // $('.Css3dRenderer').css({ 'transform': 'rotatey(' + getViewDirectionY() * 15 + 'deg)' })

    // $('body').mouseup(function(e) {



    //     // $('#labelBoard').fadeOut();

    //     $('body').unbind('mousemove');



    //     // $('body').unbind('mousedown');



    // })

    document.body.addEventListener('touchend', function () {

        $('body').unbind('mousemove');



    })





    $('.IconButton--close').click(function () {

        $('#labelVideo')[0].src = '';

        $('#labelIframe')[0].src = '';

        $('#labelImg')[0].src = '';

        $('#labelBoard').fadeOut();

    })

    //加临时标签,解决iframe mouseUp问题

    // $('.FlexEmbed-mask').mouseenter(function(e) {

    //     if (e.buttons == 0) {

    //         //e.buttons == 0 鼠标左击没有被按住

    //         $(this).css('display', 'none')

    //     }

    // })

    // $('.FlexEmbed-content').mouseout(function() {

    //     $('.FlexEmbed-mask').css('display', 'block')

    // })















}
