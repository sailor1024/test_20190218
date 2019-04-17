//根据扫描位置点、大小、高度创建图示
function AnchorManager(points, size, cameraHeight, scene,pointPath)
{
    var textureLoader = new THREE.TextureLoader();
    //this.textureHighlight = textureLoader.load( "image/point1.png" );
    // this.matHover = new THREE.MeshBasicMaterial({
    //     alphaTest: 0.5,
    //     color: 0xccccff,
    //     map:  textureLoader.load( "image/point1.png" )
    //
    // });

    this.modelData=modelData;
    var pointPathFull = "image/"+ pointPath;

    this.matNormal = new THREE.MeshBasicMaterial({
        //alphaTest: 0.5,
        color: 0xffffff,
        side:THREE.DoubleSide,
        depthTest:true,
        transparent:true,
        opacity:0.5,
        map: textureLoader.load(pointPathFull)
        //map: textureLoader.load("image/point5.png")
    });

    this.matHint = new THREE.MeshBasicMaterial({
        //alphaTest: 0.5,
        color: 0xffffff,
        side:THREE.DoubleSide,
        depthTest:false,
        transparent:true,
        opacity:0.5,
        map: textureLoader.load("image/point.png")
    });

    var geometry = new THREE.PlaneBufferGeometry( size, size, 1);
    geometry.rotateX(-Math.PI/2);

    for(var i=0; i<points.length; ++i){
        var quad = new THREE.Mesh( geometry, this.matNormal );
        quad.position.set(points[i].x, points[i].y - cameraHeight + 0.2, points[i].z);
        quad.renderOrder = 1;
        scene.add( quad );
   }

    var geometry2 = new THREE.PlaneBufferGeometry( size, size, 1);
   this.posHint = new THREE.Mesh( geometry2, this.matHint);
   this.posHint.renderOrder = 2;
   //scene.add( this.posHint );
   this.raycaster = new THREE.Raycaster();

    this.anchorPoint = new THREE.Vector3(0, 0, 0);
    this.anchorNormal = new THREE.Vector3(0, 1, 0);
}

AnchorManager.prototype.highlight = function(){
    this.matNormal.opacity = 1.0;
    //this.matNormal.color.setRGB(10.0, 0, 0);
}

AnchorManager.prototype.normal = function(){
    this.matNormal.opacity = 0.5;
}

AnchorManager.prototype.updateHint = function(x, y){
    var pos = new THREE.Vector2(x, y);
    this.raycaster.setFromCamera( pos, cameraController.getCurrentCamera() );

    var minDistance = 99999;
    var point = new THREE.Vector3();
    var rayScope = this.raycaster;
    var normalScope = new THREE.Vector3(0, 1, 0);
    var intersects;
    if(model){
        model.traverse(function(child) {
            if (child.isMesh) {
                var intersects = rayScope.intersectObject( child );
                if ( intersects.length > 0 && intersects[0].distance < minDistance) {
                    var intersect = intersects[0];
                    point.copy(intersect.point);
                    var face = intersect.face;
                    //     var linePosition = line.geometry.attributes.position;
                    var meshPosition = child.geometry.attributes.position;
                    var p1 = new THREE.Vector3(meshPosition.getX(face.a), meshPosition.getY(face.a), meshPosition.getZ(face.a));
                    var p2 = new THREE.Vector3(meshPosition.getX(face.b), meshPosition.getY(face.b), meshPosition.getZ(face.b));
                    var p3 = new THREE.Vector3(meshPosition.getX(face.c), meshPosition.getY(face.c), meshPosition.getZ(face.c));

                    p2.sub(p1);
                    p3.sub(p1);
                    normalScope = p2.clone().cross(p3);
                    var q = new THREE.Quaternion();
                    child.getWorldQuaternion(q);
                    normalScope.applyQuaternion(q);
                    normalScope.normalize();
                }
            }
        });
    }
    else{
        let vector = new THREE.Vector3(x, y, 1).unproject(cameraController.getCurrentCamera());

        if (modeSwitch.isOrthographic()) {
            ;
        } else {
            let cameraPos = new THREE.Vector3();
            cameraController.getCurrentCamera().getWorldPosition(cameraPos);
            vector.sub(cameraPos);
            vector.normalize();
            if (vector.y < 0) {
                vector.multiplyScalar(-1.0 / vector.y * (cameraPos.y- modelData.groundHeight));
                vector.x += cameraPos.x;
                vector.z += cameraPos.z;
            }
            point.set(vector.x, modelData.groundHeight, vector.z);
        }

    }

    this.anchorPoint.copy(point);
    this.anchorNormal.copy(normalScope);
    this.posHint.position.copy(point);
    this.posHint.lookAt(point.add(normalScope));
}
var switchAdd;
var selectVideo;
var videoobjectsArray = [];
var videoobjectsArrayAll = [];
var videoSelet;
// setTimeout(function(){
//     mainCanvas.addEventListener('mouseup', onDocumentMouseupVideo, false);

// },1000)
  
function onDocumentMouseupVideo(){
    if (event.button == 0) {
        bindEvt(videoSelet)

        if(videoSelet){
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouse.x = ((event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth) * 2 - 1;
            mouse.y = -((event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight) * 2 + 1;
            
            var raycaster = new THREE.Raycaster();

            if (modeSwitch.isWalkingMode()) {
                raycaster.setFromCamera(mouse, pointerLockCamera);
                var octreeObjects = videoobjectsArray;
                intersects = raycaster.intersectObjects(octreeObjects);
            } else if (modeSwitch.isOrthographic()) {
                raycaster.setFromCamera(mouse, orthoCamera);
                var octreeObjects = videoobjectsArray;
                intersects = raycaster.intersectObjects(octreeObjects);
            } else if (modeSwitch.isOverallMode()) {
                raycaster.setFromCamera(mouse, orbitCamera);
                var octreeObjects = videoobjectsArray;
                intersects = raycaster.intersectObjects(octreeObjects);
            }
            if (intersects.length > 0) {
                selectVideo=true;
                    videoSelet=intersects[0].object;
                    initVal(videoSelet);
                    bindEvt(videoSelet);
                    for(var i=0;i<videoobjectsArray.length;i++){
                        videoobjectsArray[i].material.opacity=1
                    }
                    videoSelet.material.opacity=0.8;
                    popEdit('MapVideoContent')
                    console.log(videoSelet)
                // console.log(videoSelet)
            //    var border = new THREE.BoxHelper( videoSelet,0xFF0000 );//设置边框，这个边框不会旋转
            // //   var edges = new THREE.EdgesHelper( videoSelet, 0x0dc3b4 );//设置边框，可以旋转
            // //    scene.add( edges );
            //     scene.add( border );
                            
   

                $('.rangeControls>.rangeContent>.range-field>input').unbind('input')
             

                $('.rangeControls>.rangeContent>.range-field>input').on('input', function(){
                
                    $(this).parent().siblings('.showVal').css('opacity', 0)
                    let val = $(this).val();
                    let key = $(this).attr('data-index');
                    $(this).attr('value', val);
                    changeVal(videoSelet,key,val);
                })
          

               

            }
            else{
                selectVideo=false;
                for(var i=0;i<videoobjectsArray.length;i++){
                    videoobjectsArray[i].material.opacity=1
                }
            }
        
            

        

    }
}

}
function changeVal(videoType,key,val){

    if (key == 'px') {
        videoType.position.x = val;
        // chooseMap.change(key, val);
    } else if (key == 'py') {
        videoType.position.y = val;
        // chooseMap.change(key, val);
    } else if (key == 'pz') {
        videoType.position.z = val;
        // chooseMap.change(key, val);
    } else if (key == 'sx') {
        videoType.scale.x = val;
        // chooseMap.change(key, val);
    } else if (key == 'sy') {
        videoType.scale.y = val;
        // chooseMap.change(key, val);
    } else if (key == 'sz') {
        videoType.scale.z = val;
        // chooseMap.change(key, val);
    } else if (key == 'ox') {
        videoType.rotation.x = val;
        // chooseMap.change(key, val);
    } else if (key == 'oy') {
        videoType.rotation.y = val;
        // chooseMap.change(key, val);
    } else if (key == 'oz') {
        videoType.rotation.z = val;
        // chooseMap.change(key, val);
    }
}

function initStep(videoType){
    if(videoType.position.x<0){
        $('.MapVideoContent-title input[data-index="px"]').attr('min',2*videoType.position.x);    
        $('.MapVideoContent-title input[data-index="px"]').attr('max',0);   
    }
    else{
        $('.MapVideoContent-title input[data-index="px"]').attr('min',0)    
        $('.MapVideoContent-title input[data-index="px"]').attr('max',2*videoType.position.x) 
    }                 
    if(videoType.position.y<0){
        $('.MapVideoContent-title input[data-index="py"]').attr('min',2*videoType.position.y)    
        $('.MapVideoContent-title input[data-index="py"]').attr('max',0)   
    }
    else{
        $('.MapVideoContent-title input[data-index="py"]').attr('min',0)    
        $('.MapVideoContent-title input[data-index="py"]').attr('max',2*videoType.position.y) 
    }  
    if(videoType.position.z<0){
        $('.MapVideoContent-title input[data-index="pz"]').attr('min',2*videoType.position.z)    
        $('.MapVideoContent-title input[data-index="pz"]').attr('max',0)   
    }
    else{
        $('.MapVideoContent-title input[data-index="pz"]').attr('min',0)    
        $('.MapVideoContent-title input[data-index="pz"]').attr('max',2*videoType.position.z) 
    }  
    $('.MapVideoContent-title input[data-index="sx"]').attr('min',0)    
    $('.MapVideoContent-title input[data-index="sx"]').attr('max',2*videoType.scale.x) 
    $('.MapVideoContent-title input[data-index="sy"]').attr('min',0)    
    $('.MapVideoContent-title input[data-index="sy"]').attr('max',2*videoType.scale.y) 
    $('.MapVideoContent-title input[data-index="sz"]').attr('min',0)    
    $('.MapVideoContent-title input[data-index="sz"]').attr('max',2*videoType.scale.z)
    $('.MapVideoContent-title input[data-index="px"]').attr('step',Math.abs(videoType.position.x)/100)  
    $('.MapVideoContent-title input[data-index="py"]').attr('step',Math.abs(videoType.position.y)/100)   
    $('.MapVideoContent-title input[data-index="pz"]').attr('step',Math.abs(videoType.position.z)/100)   
    $('.MapVideoContent-title input[data-index="sx"]').attr('step',Math.abs(videoType.scale.x)/100)  
    $('.MapVideoContent-title input[data-index="sy"]').attr('step',Math.abs(videoType.scale.y)/100) 
    $('.MapVideoContent-title input[data-index="sz"]').attr('step',Math.abs(videoType.scale.z)/100) 
}
function initVal(videoType,ifinit){

    
    $('.MapVideoContent-title input[data-index="px"]').val(videoType.position.x); 
    $('.MapVideoContent-title input[data-index="py"]').val(videoType.position.y);
    $('.MapVideoContent-title input[data-index="pz"]').val(videoType.position.z);
    $('.MapVideoContent-title input[data-index="sx"]').val(videoType.scale.x);
    $('.MapVideoContent-title input[data-index="sy"]').val(videoType.scale.y);
    $('.MapVideoContent-title input[data-index="sz"]').val(videoType.scale.z);
    $('.MapVideoContent-title input[data-index="ox"]').val(videoType.rotation.x);
    $('.MapVideoContent-title input[data-index="oy"]').val(videoType.rotation.y);
    $('.MapVideoContent-title input[data-index="oz"]').val(videoType.rotation.z);

    if(ifinit){
        videoType.position.y= -0.79;
        videoType.scale.y=2.3;
    }  


}
function bindEvt(videoSelet){
    $('.rangeControls>a[data-key=reduce]').unbind('click');
    $('.rangeControls>a[data-key=add]').unbind('click');
    $('.rangeControls>a[data-key=reduce]').click(function(e) {
        
        pan = false;
        e.stopPropagation();
        let key = $(this).attr('data-index');
        let val = $(this).siblings('.rangeContent').find('.range-field').find('input').val();
        var step=$(this).siblings('.rangeContent').find('.range-field').find('input').attr('step');
        val-=step;
        $(this).siblings('.rangeContent').find('.range-field').find('input').val(val);
        changeVal(videoSelet,key,val)


        // chooseMap.change(key, val);

    })

    $('.rangeControls>a[data-key=add]').click(function(e) {
        
        e.stopPropagation();
        let key = $(this).attr('data-index');
        let val = $(this).siblings('.rangeContent').find('.range-field').find('input').val();
        var step=$(this).siblings('.rangeContent').find('.range-field').find('input').attr('step')
        // val+=0.1;
        val=parseFloat(val)+parseFloat(step);
        $(this).siblings('.rangeContent').find('.range-field').find('input').val(val);
  
        changeVal(videoSelet,key,val)

        // chooseMap.change(key, val);
    })
}
AnchorManager.prototype.creatVideo = function(x, y){
    var pos = new THREE.Vector2(x, y);
    this.raycaster.setFromCamera( pos, cameraController.getCurrentCamera() );
    var minDistance = 99999;
    var point = new THREE.Vector3();
    var rayScope = this.raycaster;
    var normalScope = new THREE.Vector3(0, 1, 0);
    //储存标签到数组供选取；

    if(model){
        model.traverse(function(child) {
            if (child.isMesh) {
                var intersects = rayScope.intersectObject( child );
                if ( intersects.length > 0 && intersects[0].distance < minDistance) {
                    var intersect = intersects[0];
                    point.copy(intersect.point);

                    var face = intersect.face;
                    //     var linePosition = line.geometry.attributes.position;
                    var meshPosition = child.geometry.attributes.position;
                    var p1 = new THREE.Vector3(meshPosition.getX(face.a), meshPosition.getY(face.a), meshPosition.getZ(face.a));
                    var p2 = new THREE.Vector3(meshPosition.getX(face.b), meshPosition.getY(face.b), meshPosition.getZ(face.b));
                    var p3 = new THREE.Vector3(meshPosition.getX(face.c), meshPosition.getY(face.c), meshPosition.getZ(face.c));

                    p2.sub(p1);
                    p3.sub(p1);
                    normalScope = p2.clone().cross(p3);
                    var q = new THREE.Quaternion();
                    child.getWorldQuaternion(q);
                    // console.log(normalScope);
                    normalScope.applyQuaternion(q);
                    // console.log(normalScope)
                    normalScope.normalize();
                }
            }
        });
    }
    else{
        let vector = new THREE.Vector3(x, y, 1).unproject(cameraController.getCurrentCamera());

        if (modeSwitch.isOrthographic()) {
            ;
        } else {
            let cameraPos = new THREE.Vector3();
            cameraController.getCurrentCamera().getWorldPosition(cameraPos);
            vector.sub(cameraPos);
            vector.normalize();
            if (vector.y < 0) {
                vector.multiplyScalar(-1.0 / vector.y * (cameraPos.y- modelData.groundHeight));
                vector.x += cameraPos.x;
                vector.z += cameraPos.z;
            }
            point.set(vector.x, modelData.groundHeight, vector.z);
        }

    }

        // setTimeout(() => {
        //     $('.MapVideoContent-title input[data-index="px"]').val(videoOrdinary.position.x);
        //     $('.MapVideoContent-title input[data-index="py"]').val(0);
        //     $('.MapVideoContent-title input[data-index="pz"]').val(videoOrdinary.position.z);
        //     $('.MapVideoContent-title input[data-index="sx"]').val(videoOrdinary.scale.x);
        //     $('.MapVideoContent-title input[data-index="sy"]').val(videoOrdinary.scale.y);
        //     $('.MapVideoContent-title input[data-index="sz"]').val(videoOrdinary.scale.z);
        //     $('.MapVideoContent-title input[data-index="ox"]').val(videoOrdinary.rotation.x);
        //     $('.MapVideoContent-title input[data-index="oy"]').val(videoOrdinary.rotation.y);
        //     $('.MapVideoContent-title input[data-index="oz"]').val(videoOrdinary.rotation.z);

        //     chooseMap = new MapObj(videoPlane.position.x, videoPlane.position.y, videoPlane.position.z, videoPlane.scale.x, videoPlane.scale.y, videoPlane.scale.z, videoPlane.rotation.x, videoPlane.rotation.y, videoPlane.rotation.z);
        //     console.log(chooseMap)
        // }, 500)
        // videoPlane.lookAt(point.add(normalScope));
        if(switchAdd){
            if(FileType=='realTime'){
                var videoRTC= document.querySelector('.remoteVideo');
                var script=document.createElement('script');
                script.src='js/SkyRTC-client.js';
                document.body.appendChild(script)
                $('#videos').css('display','none')
                // var video = document.querySelector('.remoteVideo');
              
                var textureLoader = new THREE.TextureLoader();
                var texture = new THREE.VideoTexture( videoRTC );
                var geometry = new THREE.PlaneBufferGeometry( 1, 1, 1);
                texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    var mat = new THREE.MeshBasicMaterial({ //暂时使用通用材质
                        color: 0xffffff,
                        depthTest:false,
                        transparent:true,
                        opacity:1,
                        map: textureLoader.load('image/background.jpg'),
                        side:THREE.FrontSide,
                        polygonOffset:false,    
                        depthWrite:false,
                        // THREE.FrontSide
                        // THREE.BackSide
                        // THREE.DoubleSide
                    });
                
                    var videoPlaneRtc = new THREE.Mesh(geometry, mat );
                    videoPlaneRtc.position.copy(point);
                    var cam = cameraController.getCurrentCamera();
                    var pos =new THREE.Vector3();
                    var q = new THREE.Quaternion();
                    cam.getWorldPosition(pos);
                    cam.getWorldQuaternion(q); 
                    videoPlaneRtc.lookAt(point.add(normalScope));           
                    scene.add(videoPlaneRtc)
                    videoSelet=videoPlaneRtc;
                    videoobjectsArray.push(videoPlaneRtc)
                    setTimeout(function(){
                        if(videoRTC.id){
                            mat.map=texture            
                        }
                    },2000)
                    initStep(videoPlaneRtc)
                 
                    setTimeout(function(){
                        initVal(videoPlaneRtc);
                        bindEvt(videoPlaneRtc)
                    },20)
                  
                        
                        $('.rangeControls>.rangeContent>.range-field>input').unbind('input')
                        $('.rangeControls>.rangeContent>.range-field>input').on('input', function(){
                            $(this).parent().siblings('.showVal').css('opacity', 0)
                            let val = $(this).val();
                            let key = $(this).attr('data-index');
                            $(this).attr('value', val)
                            changeVal(videoPlaneRtc,key,val)

                        })
                     // chooseMap = new MapObj(videoPlane.position.x, videoPlane.position.y, videoPlane.position.z, videoPlane.scale.x, videoPlane.scale.y, videoPlane.scale.z, videoPlane.rotation.x, videoPlane.rotation.y, videoPlane.rotation.z);
                          // console.log(chooseMap)
           
                    // $('.rangeControls>.rangeContent>.range-field>input').on('input', function(){
                    //     $(this).parent().siblings('.showVal').css('opacity', 0)
                    //     let val = $(this).val();
                    //     let key = $(this).attr('data-index');
                    //     $(this).attr('value', val);
                    //     changeVal(videoPlaneRtc,key,val)
                    // })
            }
            else if(FileType=='Uploading'){
                var geometry = new THREE.PlaneBufferGeometry( 1, 1, 1);
                var video = document.createElement("video");// .getElementById( 'video01' );
                video.autoplay = true;
                video.loop = true;
                var texture = new THREE.VideoTexture( video );
                texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    var mat = new THREE.MeshBasicMaterial({ //暂时使用通用材质
                        color: 0xffffff,
                        depthTest:false,
                        transparent:true,
                        opacity:1,
                        map: texture,
                        side:THREE.FrontSide,
                        polygonOffset:false,    
                        depthWrite:false
                               // THREE.FrontSide
                        // THREE.BackSide
                        // THREE.DoubleSide
                    });
                    // geometry.rotateX(-Math.PI);
                    var videoOrdinary = new THREE.Mesh(geometry, mat );
                    var videoData = this.modelData.videos[0].inlineVideo;

                    video.src = videoData.src;
                    videoOrdinary.position.copy(point);
                    var cam = cameraController.getCurrentCamera();
                    var pos =new THREE.Vector3();
                    var q = new THREE.Quaternion(); 
                    cam.getWorldPosition(pos);
                    cam.getWorldQuaternion(q);
                    videoOrdinary.lookAt(point.add(normalScope));
                    scene.add(videoOrdinary);
                    videoSelet=videoOrdinary;
                    videoobjectsArray.push(videoOrdinary)
                    
                    console.log(videoOrdinary.position)
                    initStep(videoOrdinary)
                    
                    setTimeout(function(){
                        initVal(videoOrdinary);
                        bindEvt(videoOrdinary)
                    },20)
      
                    $('.rangeControls>.rangeContent>.range-field>input').unbind('input')
                    $('.rangeControls>.rangeContent>.range-field>input').on('input', function(){
                        $(this).parent().siblings('.showVal').css('opacity', 0)
                        let val = $(this).val();
                        let key = $(this).attr('data-index');
                        $(this).attr('value', val)
                        changeVal(videoOrdinary,key,val)

                    })
                 // chooseMap = new MapObj(videoPlane.position.x, videoPlane.position.y, videoPlane.position.z, videoPlane.scale.x, videoPlane.scale.y, videoPlane.scale.z, videoPlane.rotation.x, videoPlane.rotation.y, videoPlane.rotation.z);
                      // console.log(chooseMap)
      
                // $('.rangeControls>.rangeContent>.range-field>input').on('input', function(){
                //     $(this).parent().siblings('.showVal').css('opacity', 0)
                //     let val = $(this).val();
                //     let key = $(this).attr('data-index');
                //     $(this).attr('value', val)
                //     changeVal(videoOrdinary,key,val)
                // })
            }
            else if(FileType=='transparent'){
                var geometry = new THREE.PlaneBufferGeometry( 1, 1, 1);
                var video = document.createElement("video");// .getElementById( 'video01' );
                video.autoplay = true;
                video.loop = true;
                var texture = new THREE.VideoTexture( video );
                texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    var mat = new THREE.MeshBasicMaterial({ //暂时使用通用材质
                        color: 0xffffff,
                        depthTest:false,
                        transparent:true,
                        opacity:1,
                        map: texture,
                        side:THREE.BackSide,
                        polygonOffset:false,    
                        depthWrite:false,
                        // THREE.FrontSide
                            // THREE.BackSide
                            // THREE.DoubleSide
            
                    });
                    // geometry.rotateX(-Math.PI);
            
                    var videoTransparent = new THREE.Mesh(geometry, mat );
                    var videoData = this.modelData.videos[1].inlineVideo;
                    video.src = videoData.src;
                    videoTransparent.position.copy(point);
                    var cam = cameraController.getCurrentCamera();
                    var pos =new THREE.Vector3();
                    var q = new THREE.Quaternion(); 
                    cam.getWorldPosition(pos);
                    cam.getWorldQuaternion(q);
                    scene.add(videoTransparent);
                    videoSelet=videoTransparent;
                    videoobjectsArray.push(videoTransparent)
                    initStep(videoTransparent)

                    setTimeout(function(){
                    initVal(videoTransparent,true);
                    bindEvt(videoTransparent)
                    },20)

             
                    // initVal(videoTransparent,true);
                    // initStep(videoTransparent)
                    // bindEvt(videoTransparent)

                            $('.rangeControls>.rangeContent>.range-field>input').unbind('input')
                            $('.rangeControls>.rangeContent>.range-field>input').on('input', function(){
                                $(this).parent().siblings('.showVal').css('opacity', 0)
                                let val = $(this).val();
                                let key = $(this).attr('data-index');
                                $(this).attr('value', val)
                                changeVal(videoTransparent,key,val)
                            })
                
                    // chooseMap = new MapObj(videoPlane.position.x, videoPlane.position.y, videoPlane.position.z, videoPlane.scale.x, videoPlane.scale.y, videoPlane.scale.z, videoPlane.rotation.x, videoPlane.rotation.y, videoPlane.rotation.z);
                    // console.log(chooseMap)
              
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
                    scene.remove(videoSelet);
                    for(var i=0;i<videoobjectsArray.length;i++){
                        if(videoobjectsArray[i]==videoSelet){
                            videoobjectsArray.splice(i,1)
                        }
                    }
                    
                })

            
      

}