
function Module3D(renderder, scene, cameraController){
    this.renderer = renderder;
    this.scene = scene;
    this.cameraController = cameraController;
}

Object.assign(Module3D.prototype, {
    setSize(width, height){
        this.cameraController.resize(width, height);
        this.renderer.setSize(width, height);
    },
    getSize(){
        this.renderer.getSize ();
    },
    getImgData(width, height){
        var size = this.renderer.getSize ();
        this.renderer.setSize(width, height, true);

        var cam = this.cameraController.getCurrentCamera();
        var aspectOld = cam.aspect;

        cam.aspect = width/height;
        cam.updateProjectionMatrix();

        this.renderer.render(this.scene, cam);
        var data = this.renderer.domElement.toDataURL('image/jpeg', 0.75);

        cam.aspect = aspectOld;
        cam.updateProjectionMatrix();
        this.renderer.setSize(size.width, size.height);
        return data;
    },
    //获取当前鼠标点位置
    getAnchorPoint(){
        return anchorManager.anchorPoint.clone();
    },
    //获取当前鼠标点位置法线
    getAnchorNormal(){
        return anchorManager.anchorNormal.clone();
    },
    //根据位置法线距离计算点坐标
    calcPosition(point, normal, distance){
        return new THREE.Vector3(
            point.x + normal.x * distance,
            point.y + normal.y * distance,
            point.z + normal.z * distance
        )
    },
    //当前点索引
    getBubbleIndex(){
        return targetIndex;
    },
    //获取可以看到pos的位置点索引,maxLen最远可见距离，默认20；此方法比较耗时，不要高频调用
    getVisibleBubbleList(pos, maxLen){
        maxLen = maxLen || 20;
        let list = [];
        for (let i = 0; i < viewPoint.length; ++i) {
            let pt  = viewPoint[i];
            let dir = new THREE.Vector3(pos.x - pt.x, pos.y - pt.y, pos.z - pt.z);
            let len = dir.length()-0.1;
            if(len < maxLen){
                let raycaster = new THREE.Raycaster(pt, dir.normalize(), 0, len);
                let found  = false;
                model.traverse(function(child) {
                    if (child.isMesh && !found) {
                        let intersects = raycaster.intersectObject( child );
                        if ( intersects.length > 0 && intersects[0].distance < len) {
                            found = true;
                        }
                    }
                });
                if(!found){
                    list.push(i);
                }
            }
        }

        return list;
    }
});
