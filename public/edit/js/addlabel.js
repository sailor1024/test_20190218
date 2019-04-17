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

function operateMatter() {}

$('.removeMattertag').click(function(){



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
