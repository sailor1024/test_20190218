function VideoController(modelData, scene, enable) {
    this.enable = enable;
    if (!enable) {
        return;
    }

    this.ext = ".mp4";

    this.modelData = modelData;
    this.videoPlanes = []; //视频显示屏
    this.videos = []; //视频dom
    //this.videoTextures = [];//视频纹理

    this.currentIndex = -1;

    var count = this._getMaxVideoCount();

    var geometry = new THREE.PlaneBufferGeometry(1, 1, 1);
    for (var i = 0; i < count; ++i) {
        var video = document.createElement("video"); // .getElementById( 'video01' );
        video.autoplay = true;
        video.loop = true;
        this.videos.push(video);

        var texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        // this.videoTextures.push(texture);

        var mat = new THREE.MeshBasicMaterial({ //暂时使用通用材质
            color: 0xffffff,
            depthTest: false,
            alphaTest: 0.5,
            map: texture
        });

        var videoPlane = new THREE.Mesh(geometry, mat);
        this.videoPlanes.push(videoPlane);
        videoPlane.renderOrder = 50;
        videoPlane.visible = false;
        scene.add(videoPlane);

        video.addEventListener("play", this._setupVideoPlane.bind(this, i));
    }
}

Object.assign(VideoController.prototype, {
    turnOff() {
        if (!this.enable) {
            return;
        }

        if (this.currentIndex != -1) {
            var vp = this.modelData.viewPoints[this.currentIndex];
            if (vp.inlineVideo) {
                var count = vp.inlineVideo.length;
                for (var i = 0; i < count; ++i) {
                    this.videos[i].src = "";
                    this.videoPlanes[i].visible = false;
                }
            }
            this.currentIndex = -1;
        }
    },
    moveTo(index) {
        if (!this.enable) {
            return;
        }

        this.turnOff();
        console.log("moveTo", index);
        if (playstage) {
            pause = true;
        }

        if (index == -1) return;

        var vp = this.modelData.viewPoints[index];
        if (vp.inlineVideo) {
            var count = vp.inlineVideo.length;
            for (var i = 0; i < count; ++i) {
                var videoData = this._getVideoData(vp.inlineVideo[i].index);
                if (videoData.src.endsWith(".webm") || videoData.src.endsWith(".mp4")) {
                    this.videos[i].src = videoData.src;
                } else {
                    this.videos[i].src = videoData.src + this.ext;
                }
                this.videoPlanes[i].scale.x = vp.inlineVideo[i].width;
                this.videoPlanes[i].scale.y = vp.inlineVideo[i].height;
                var pos = vp.inlineVideo[i].position;
                this.videoPlanes[i].position.set(pos.x, pos.y, pos.z);
                this.videoPlanes[i].lookAt(vp.x, vp.y, vp.z);
            }
            this.currentIndex = index;
        }
    },
    _setupVideoPlane(index) {
        //console.log("_setupVideoPlane", index);
        // this.videos[index].play();
        // this.videos[index].pause();
        this.videoPlanes[index].visible = true;
    },
    _getVideoData(index) { //根据索引查询视频数据
        for (var i = 0; i < this.modelData.videos.length; ++i) {
            if (this.modelData.videos[i].index == index) {
                return this.modelData.videos[i];
            }
        }
    },
    _getMaxVideoCount() { //共存的视频个数
        var max = 0;
        for (var i = 0; i < this.modelData.viewPoints.length; ++i) {
            var vp = this.modelData.viewPoints[i];
            if (vp.inlineVideo && vp.inlineVideo.length > max) {
                max = vp.inlineVideo.length;
            }
        }
        return max;
    }
});