//调试信息
function setupOption(){
    if (!debugMode) { return;}

    var Options = function () {
        //this.message = 'dat.gui';
        this.default = function () {
            setDefaultOverallView();
        };
        this.view = function () { //视图切换
            if (modeSwitch.isWalkingMode()) {
                setOverallView();
            } else {
                setWalkingViewPoint(targetIndex);
            }
        };

        this.toggleVisible = function () {
            cube.visible = !cube.visible;
        };
        this.useCube = function () {
            materialSwitch._useCubemap();
        };
        this.restore = function () {
            materialSwitch.restore();
        };
        this.overall = function () {
            setOverallView();
        };
        this.walking = function () {
            setWalkingViewPoint(targetIndex);
        };
        this.ortho = function(){
            if(modeSwitch.isOrthographic()){
                modeSwitch.setOverallMode();
            }else{
                var cam = cameraController.getCurrentCamera();
                var pos =new THREE.Vector3();
                var q = new THREE.Quaternion();
                cam.getWorldPosition(pos);
                cam.getWorldQuaternion(q);

                var up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
                var dir =new THREE.Vector3();
                cam.getWorldDirection(dir);
                var xAxis = dir.clone().cross(up);
                var mat4 = new THREE.Matrix4();
                mat4.makeBasis(xAxis, up, dir.clone().multiplyScalar(-1));

                q.setFromRotationMatrix(mat4);
                setOrthographic(pos, q);
            }
        };
        this.orthoTo = function(){
            setOrthographic(new THREE.Vector3(-8.97,33.33,-13.45), new THREE.Quaternion(0.496006594424995,0.5039617706149377,0.5039612666534192,-0.49600709043183744));
        }
        this.cubeMap1 = function () {
            setWalkingViewPoint(0);
        };
        this.cubeMap2 = function () {
            setWalkingViewPoint(1);

        };

        var oInput = document.createElement('input');
        document.body.appendChild(oInput);
        this.cameraInfo = function(){ //将相机位置、朝向输出到控制台和剪切板
            var cam = cameraController.getCurrentCamera();
            var pos =new THREE.Vector3();
            var q = new THREE.Quaternion();
            cam.getWorldPosition(pos);
            cam.getWorldQuaternion(q);
            var text = JSON.stringify({
                index:targetIndex,
                camera:{
                    pos:[parseInt(pos.x*100)/100, parseInt(pos.y*100)/100, parseInt(pos.z*100)/100 ],
                    q:[parseInt(q.x*100000)/100000, parseInt(q.y*100000)/100000, parseInt(q.z*100000)/100000, parseInt(q.w*100000)/100000],
                    qd:[q.x, q.y, q.z, q.w]
                }});
            console.log(text);
            //
            // var delta = new THREE.Vector3().subVectors(modelCenter, pos);
            // var targetDir = new THREE.Vector3(0, 0, -1).applyQuaternion(q);//
            // var target = targetDir.clone().multiplyScalar(delta.length()).add(pos);
            // this.orbitControl.target.copy(target);
            // this.orbitControl.update();
            //
            // console.log(this.endOrient);
            // this.orbitCamera.getWorldQuaternion(this.endOrient);
            // console.log(this.endOrient);



            oInput.value = text;
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
        };
        this.setCameraPos = function(){
            //{"index":46,"camera":{"pos":[-7.23,1.67,-22.13],"q":[-0.0696,0.6753,0.0642,0.7313]}}
            //targetIndex = 46;
            setWalkingViewPoint(46, new THREE.Quaternion(-0.0696,0.6753,0.0642,0.7313));
            //cameraController.moveTo(new THREE.Vector3(-7.23,1.67,-22.13), );
        };
        this.moveTo = function (){
            //setOverallView(new THREE.Vector3(-8.97,33.33,-13.45), new THREE.Quaternion(-0.0696,0.6753,0.0642,0.7313));
            //-0.5047,0.4951,0.4951,0.5047
            setOverallView(new THREE.Vector3(-8.97,33.33,-13.45), new THREE.Quaternion(0.496006594424995,0.5039617706149377,0.5039612666534192,-0.49600709043183744));
        }
        this.play = function(){
            animateControl.play("main");
        }
        this.pause = function(){
            animateControl.pause();
        }
        this.continue = function(){
            animateControl.continue();
        }
        this.stop = function(){
            animateControl.stop();
        }

        this.zoomin = function () {
            var c = cameraController.getCurrentCamera();
            if(c.fov > 10){
                c.fov*=0.9;
                console.log(c.fov);
                c.updateProjectionMatrix();
            }
        };
        this.zoomout = function () {
            var c = cameraController.getCurrentCamera();
            if(c.fov < 90){
                c.fov*=1.1;
                console.log(c.fov);
                c.updateProjectionMatrix();
            }
        };
        this.save = function(){
            //var dataURL = renderer.domElement.toDataURL();
            //window.open(dataURL, "image");

            var w = window.open('', '');
            w.document.title = "Screenshot";
            //w.document.body.style.backgroundColor = "red";
            var img = new Image();
            // renderer.render(scene, cameraController.getCurrentCamera());
            img.src = module3D.getImgData(162, 100);// renderer.domElement.toDataURL();
            w.document.body.appendChild(img);
        };

        this.saveImg = function(){
            var ren = new THREE.WebGLRenderer({antialias:true});
            ren.setSize(2048, 2048);

            var cam = new THREE.PerspectiveCamera(90,1, 0.1, 500 );
            cameraController.getCurrentCamera().getWorldPosition(cam.position);
            var target = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, -1, 0),
                new THREE.Vector3(0, 0, -1), //-z , +z!!!!
                new THREE.Vector3(0, 0, 1),
            ];

            var w = window.open("", i);
            w.document.write("index:" + targetIndex + " file: ");
            for(var i=0; i<6; ++i){
                var img = new Image();
                img.width = 256;
                img.height = 256;
                cam.lookAt(target[i].add(cam.position));
                ren.render(scene, cam);
                if(Modernizr.webplossless) {
                    img.src = ren.domElement.toDataURL('image/webp');
                }
                else {
                    img.src = ren.domElement.toDataURL('image/jpeg', 0.75);
                }
                w.document.write(targetIndex * 6 +i);
                w.document.body.appendChild(img);
            }
        };
        this.saveBK = function(){
            var w = window.open("", i);
            w.document.write("index:" + targetIndex + " file: ");
            var vp = modelData.viewPoints[targetIndex];
            if(vp.inlineVideo){
                var count = vp.inlineVideo.length;
                var ren = new THREE.WebGLRenderer({antialias:true});
                for(var i=0; i<count; ++i){
                    videoController.videoPlanes[i].visible = false;
                    ren.setSize(videoController.videos[i].videoWidth, videoController.videos[i].videoHeight);

                    var pos = vp.inlineVideo[i].position;
                    var p = new THREE.Vector3(pos.x, pos.y, pos.z);
                    var cp  = new THREE.Vector3();
                    cameraController.getCurrentCamera().getWorldPosition(cp);
                    var len = cp.clone().sub(p).length();

                    var cam = new THREE.PerspectiveCamera(Math.atan(vp.inlineVideo[i].height/2/len)*360/Math.PI , vp.inlineVideo[i].width/vp.inlineVideo[i].height, 0.1, 500 );
                    cam.position.copy(cp);
                    cam.lookAt(p);

                    var img = new Image();
                    img.width = videoController.videos[i].videoWidth;
                    img.height = videoController.videos[i].videoHeight;
                    ren.render(scene, cam);
                    // if(Modernizr.webplossless) {
                    //     img.src = ren.domElement.toDataURL('image/webp');
                    // }
                    // else {
                    img.src = ren.domElement.toDataURL('image/jpeg', 0.8);
                    //}
                    w.document.write(videoController.videos[i].src);
                    w.document.body.appendChild(img);
                }
            }
        };
    };
    var options = new Options();
    var gui = new dat.GUI();
    for (var prop in options) {
        if (!options.hasOwnProperty(prop)) continue;
        gui.add(options, prop);
    }
}

