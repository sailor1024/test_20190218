function addLabel(id, pos) {
    $('#' + id).css({
        'left': pos.x + "px",
        'top': pos.y + "px"
    })



}
var staticViewDirection, staticViewDirectionY;
var deviationViewDirection, deviationViewDirectionY;
var totalDeviation;

function creatLabel() {;
    // for (var i = 0; i < modelData.tags.length; i++) {

    //     var label = document.createElement('img');
    //     label.setAttribute('id', modelData.tags[i].sid);
    //     label.setAttribute('class', 'label');
    //     label.setAttribute('src', modelData.tags[i].icon);
    //     label.setAttribute('dataSource', modelData.tags[i].url);
    //     label.setAttribute('type', modelData.tags[i].type);
    //     label.setAttribute('title', modelData.tags[i].label);
    //     label.setAttribute('goIndex', modelData.tags[i].goIndex);
    //     label.setAttribute('goAngle', modelData.tags[i].goAngle);
    //     label.setAttribute('position',JSON.stringify(modelData.tags[i].position));

    //     document.body.appendChild(label);



    //     $(label).bind('click', function(e) {
    //      var self=this;
    //      if(window.innerWidth<=500){
    //         window.location.href=$(self).attr('dataSource');
    //         return

    //     }
    //         if ($(this).attr('type') == 'iframe') {
               
    //             $('#labelImg')[0].src = '';
    //             $('#labelVideo')[0].src = '';
    //             $('#labelIframe')[0].style.display = 'block';
    //             $('#labelImg')[0].style.display = 'none';
    //             $('#labelVideo')[0].style.display = 'none';
    //             setTimeout(function(){
    //                 $('#labelIframe')[0].src = $(self).attr('dataSource');

    //             },1500)
    //         } else if ($(this).attr('type') == 'img') {
    //             $('#labelImg')[0].src = $(this).attr('dataSource');
    //             $('#labelIframe')[0].src = '';
    //             $('#labelVideo')[0].src = '';
    //             $('#labelImg')[0].style.display = 'block';
    //             $('#labelIframe')[0].style.display = 'none';
    //             $('#labelVideo')[0].style.display = 'none';
    //             setTimeout(function(){
    //                 $('#labelImg')[0].src = $(self).attr('dataSource');

    //             },1500)
    //         } else if ($(this).attr('type') == 'video') {
    //             $('#labelIframe')[0].src = '';
    //             $('#labelImg')[0].src = '';
    //             $('#labelVideo')[0].style.display = 'block';
    //             $('#labelIframe')[0].style.display = 'none';
    //             $('#labelImg')[0].style.display = 'none';
    //             setTimeout(function(){
    //                 $('#labelVideo')[0].src = $(self).attr('dataSource');
    //                 $('#labelVideo')[0].play();

    //             },1500)
    //         }

    //         // setWalkingViewPoint($(this).attr('goIndex'), new THREE.Quaternion($(this).attr('goAngle').split(',')[0], $(this).attr('goAngle').split(',')[1], $(this).attr('goAngle').split(',')[2], $(this).attr('goAngle').split(',')[3]));

    //         // $(".movingSpan").animate({
    //         //     'right': -(JSON.parse($(this).attr('position')).x) * 4.49 + 42 + 'px',
    //         //     'bottom': -(JSON.parse($(this).attr('position')).z) * 4.7 + 6 + 'px'

    //         // }, 1500);
    //         //    $(".movingSpan").animate({
    //         //     'right':       -(modelData.viewPoints[$(this).attr('goIndex')].x) * 4.49 +27+ 'px',
    //         //     'bottom':       -(modelData.viewPoints[$(this).attr('goIndex')].z) * 4.7 +6+ 'px'

    //         // }, 1500);
      
    //         setTimeout(function() {

    //             $('#labelBoard').fadeIn();

    //         }, 0)
    //         staticViewDirection = getViewDirection();
    //         staticViewDirectionY = getViewDirectionY();
    //         changeTransform(label.id);


    //     })
    // }
}

function changeTransform(id) {
    $('#labelBoard').css({ 'opacity': '1' });
    $('.Css3dRenderer').css({ 'transform': 'none' });
    document.body.addEventListener('touchstart', function(ed) {
        $('.FlexEmbed-mask').css('display', 'block');
        document.body.addEventListener('touchmove', function(em) {

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
    document.body.addEventListener('touchend', function() {
        $('body').unbind('mousemove');

    })


    $('.IconButton--close').click(function() {
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