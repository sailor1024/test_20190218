$(function() {

var mattertag;



// 标签块点击
$('.matterIcon').click(function(){

  // $('.content-nav-right').toggle(100);
  $('.content-nav-right').show(200);



  $('.mattertagBoard').show(100)

  $('.labelBoard').hide()
  $('.guildBoard').hide();
  $('.imgEdit').hide(100);

})
// 导览点击
$('.guild').click(function(){
  $('.title_mes_main').animate({top:0+'px'});
  // $('.content-nav-right').toggle(100);
  $('.content-nav-right').show(200);
  $('.guildBoard').show(100)
  $('.mattertagBoard').hide()
  $('.labelBoard').hide();
  $('.imgEdit').hide(100);
})


// 信息块点击
$('.buttonShow>li').click(function (e) {
  var index = $(this).attr('data-index');
  e.stopPropagation();
  e.preventDefault();
  if (index == 1) {
    // 显示标题与简介
    if ($(this).find('label').attr('class').indexOf('active') != -1) {
      $(this).find('label').removeClass('active active1');
    } else {
      $(this).find('label').addClass('active active1');
    }

    // console.log($('.content-nav-right').getAttribute('style'))
    $('.content-nav-right').toggle(200);
    //
    $('.labelBoard').show(100);

    $('.mattertagBoard').hide();
    $('.guildBoard').hide();
    $('.imgEdit').hide(100);

    // setOverallView(new THREE.Vector3(-8.97,37.72,-13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));
    $('.scanTitle').animate({left:0+'px'},function(){
        $('.title_mes_main').animate({top:0+'px'});
    });
  } else if (index == 2) {
    if ($(this).find('label').attr('class').indexOf('active') != -1) {
      $(this).find('label').removeClass('active active1');
    } else {
      $(this).find('label').addClass('active active1');
    }
    // 显示预览按钮
    $('#previous').toggle(200);
    $('#play').toggle(200);
    $('#next').toggle(200);

  } else if (index == 3) {
    if ($(this).find('label').attr('class').indexOf('active') != -1) {
      $(this).find('label').removeClass('active active1');
    } else {
      $(this).find('label').addClass('active active1');
    }
    // 显示模型按钮
    $('#mapBtn3D').toggle(200);
  } else if (index == 4) {
    if ($(this).find('label').attr('class').indexOf('active') != -1) {
      $(this).find('label').removeClass('active active1');
    } else {
      $(this).find('label').addClass('active active1');
    }
    // 显示预览图集
    if ($('.pinBottom-container').attr('style') != undefined) {
      if ($('.pinBottom-container .swiper').height() != 0) {
        $("#pullTab").find('a span').css('background', 'url(./image/up.svg)no-repeat center center');

        $('.swiper').css({ 'height': '0' })

        $('.pinBottom-container').css({ 'bottom': '0' })

        $('.right_iconlist').css({ 'bottom': '17px' })
      } else {
        $("#pullTab").find('a span').css('background', 'url(./image/down.svg)no-repeat center center');

        $('.swiper').css({ 'height':'122px' });

        $('.pinBottom-container').css({ 'bottom': '117px' });

        $('.right_iconlist').css({ 'bottom': '130px' });
      }
    } else {
      // top
       $("#pullTab").find('a span').css('background', 'url(./image/down.svg)no-repeat center center');

       $('.swiper').css({ 'height':'122px' });

       $('.pinBottom-container').css({ 'bottom': '117px' });

       $('.right_iconlist').css({ 'bottom': '130px' });
    }
  } else {
    // 没有任何操作
  }
})

$('.labelIcon').click(function(e){
  // 显示标题与简介
  // $('.content-nav-right').toggle(200);
  // //
  // $('.labelBoard').show(100);
  //
  // $('.mattertagBoard').hide();
  // $('.guildBoard').hide();
  //
  // // setOverallView(new THREE.Vector3(-8.97,37.72,-13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));
  // $('.scanTitle').animate({left:0+'px'},function(){
  //       $('.title_mes_main').animate({top:0+'px'});
  // });
})
// 保存修改点击
$('.savemodify').click(function(){
    window.parent.postMessage('savesuccess', '*');
    if(!modelData["msg"]){
    modelData["msg"]={};

    }
    modelData.msg['pageTitle']=$('#pageTitle').text();
    modelData.msg['pageMsg']=$('#pageMsg').text();
    modelData.msg['pageLocation']=$('#pageLocation').text();
    modelData.msg['pageUrl']=$('#pageUrl').text();
    sendAjax()
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
$('.addMattertag').click(function(ec){

  mattertag=document.createElement('img');

  var description = $(".description").val();

  var tagType = $(".type-selecta").attr('value');

  if (!description) {
    window.parent.postMessage('nodesbute', '*')

    return ;

  } else if (uploadSoure == ''&&$('#textarea12').val()=='') {


    window.parent.postMessage('nofile', '*')

    return ;

  }
  else if($('#textarea12').val()!=''){

    uploadSoure=$('#textarea12').val()
  }

  switch($(".type-selecta").attr('value'))

    {

        case 'pic':

        mattertag.src='./image/pictag.svg';
        mattertag.setAttribute('type','img')
        mattertag.title='图文'


        break;

        case 'video':

        mattertag.src='./image/videotag.svg';
        mattertag.title='视频'
        mattertag.setAttribute('type','video')

        break;

        case 'model':

        mattertag.src='./image/3Dtab.svg';
        mattertag.title='模型'
        mattertag.setAttribute('type','iframe')

        break;

        case 'panorama':

        mattertag.src='./image/360tab.svg';
        mattertag.title='全景'
        mattertag.setAttribute('type','iframe')

        break;

        default:

        mattertag.src='./image/pictag.svg';

        mattertag.setAttribute('type','img')

    }

  mattertag.id='movematter'

  document.body.appendChild(mattertag)



  isAddMatterTag=true



  sendAjax()

})



$('.addLabelBoard').click(function(){



  setOverallView(new THREE.Vector3(-8.97,37.72,-13.45), new THREE.Quaternion(-0.707106394752022, 0.0002156406514078263, 0.0002156404357672827, 0.7071071018587705));



    var label=document.createElement('img');

    label.src='./image/point.png';

    label.setAttribute('type','img')



    label.id='movelabel'

    document.body.appendChild(label)

    isAddLabel=true;

    sendAjax()

})

// 截屏按钮
$('.snapshot').click(function(){



  //window.parent.postMessage('uploading', '*');

  var formData = new FormData();

  formData.append('file', module3D.getImgData(162, 100));

  formData.append('itemid', getQueryString('itemid'));

  var xhr = new XMLHttpRequest;

  xhr.open('post', phpedit_url + 'index/edit/screen_file');

  xhr.send(formData);

  xhr.onreadystatechange=function(res){

    if (xhr.readyState==4 && xhr.status==200){

      var json = JSON.parse(xhr.responseText);

      if (json.code == 1) {

        // window.parent.postMessage('uploadsuccess', '*');

        saveModesoure(json.data);

      } else {

        //window.parent.postMessage('uploadfail', '*');

      }

    }

  }
  sendAjax()

})



/**

 * 保存数据

 */
var timeer = 0
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

  modelData.slider.push({

    "src": imgsrc,

    "index": targetIndex,

    "timer": timer

  })

  


  // $('.snapshotList').append(`<li>

  // <img src="`+ imgsrc +`" alt=""></li>`)
  $('.snapshotList').append(`<li  class='snapshotListLi' style='position:relative' >
  <p>`+ timer +`</p>
  <img src="` + imgsrc + `" alt="" class="responsive-img"><span class='deleteListLi'  style='position:absolute;right:5px;top:0;font-size:20px;display:none'>x</span></li>`);

  $('.snapshotListLi').hover(function(ev){

    $(ev.currentTarget).find($('.deleteListLi')).css('display','inline')
},function(ev){
    $(ev.currentTarget).find($('.deleteListLi')).css('display','none')

})


    // 点击图片进行更改
    $('.snapshotList>li>img').click(function(e) {
      // 设置图片地址
      // $(this).prev().html()
      $('.imgEdit-content>img').attr('src', e.target.getAttribute('src'));
      // 设置图片名称
      $('.imgEdit-content>p').html($(this).prev().text());
      $('.imgEdit-ed>.row>.input-field>input').val($(this).prev().text());

      // 调用闭包函数

      let imgEditPname = $(this).prev();

      $('.imgEdit-bottom>a:first-child').click(function (e) {
          let name = $('.imgEdit #first_name2').val()
          let src = $('.imgEdit-content>img').attr('src');
          imgEditPname.html(name);
          for (let i = 0; i < modelData.slider.length; i++) {
              if (modelData.slider[i].src == src) {
                  modelData.slider[i].timer = name
                  sendAjax();
              }
          }
          // window.parent.postMessage('savesuccess', '*');
      })
      $('.imgEdit #first_name2').keydown(function (e) {
          if (e.keyCode == "13") {
            let name = $('.imgEdit #first_name2').val()
            let src = $('.imgEdit-content>img').attr('src');
            imgEditPname.html(name);
            for (let i = 0; i < modelData.slider.length; i++) {
                if (modelData.slider[i].src == src) {
                        modelData.slider[i].timer = name
                        sendAjax();
                }
            }
            // window.parent.postMessage('savesuccess', '*');
          }
      })
      $('.imgEdit-bottom>a:last-child').click(function (e) {
          console.log(e)
      })


      $('.content-nav-right').show(200);
      $('.mattertagBoard').hide(100);
      $('.guildBoard').hide(100);
      $('.labelBoard').hide(100);
      $('.imgEdit').show(100);
  });

// 图片删除
$('.deleteListLi').click(function(ev){

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
         if(json.src==$(ev.currentTarget).parents('.snapshotListLi').find('img').attr('src')){
             modelData.slider.splice(i,1)

             sendAjax()
         }

    }

    
    // 删除动画组中的数据
      for (let y = 0; y < animateControl.data.main.frames.length; y++) {
        let Yjson = animateControl.data.main.frames[y];
        if (Yjson.src == $(ev.currentTarget).parents('.snapshotListLi').find('img').attr('src')) {
            animateControl.data.main.frames.splice(y,1);
            sendAjaxAnimate();
            console.log(animateControl);
        }
    }

})


// 点击图片进行更改
$('.snapshotList>li>img').click(function(e) {
});

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
        "data": "setWalkingViewPoint("+ targetIndex +", new THREE.Quaternion(-0.07479598693762435,0.3715088062111147,0.030042869758602042,0.9249238850966532));",
        // 是我用来做删除判断的
        "src": imgsrc
      });

      sendAjaxAnimate();
    }
    catch (err) {
      console.log(err);
    }

    console.log(animateControl)

  sendAjax() 

  slider()

}
})
