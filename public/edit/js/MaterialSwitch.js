function MaterialSwitch(group){
    //模型原有材质
    this.matOrign = [];
    //立方图材质
    this.matCube = new THREE.ShaderMaterial( {
        uniforms: {
            texture1:{value:null},
            texture2:{value:null},
            viewPoint1:{value:new THREE.Vector3()},
            viewPoint2:{value:new THREE.Vector3()},
            q1:{value:new THREE.Vector4(0,0,0,1)},
            q2:{value:new THREE.Vector4(0,0,0,1)},
            progress:{value:1.0},
        },
        vertexShader:  `vec4 quaternionMul(vec4 q, vec4 r) { vec3 qv = q.xyz; vec3 rv = r.xyz; return vec4( cross(qv, rv) + qv * r.w + q.w * rv, q.w * r.w - dot(qv, rv)); } vec4 rotate(vec4 q, vec4 p) { vec4 c = vec4(-1.0 * q.xyz, q.w); vec4 t = quaternionMul(q, p); return quaternionMul(t, c); }  uniform vec3 viewPoint1; uniform vec3 viewPoint2; uniform vec4 q1; uniform vec4 q2; varying vec3 vUv1; varying vec3 vUv2; 
        void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vUv1 = worldPosition.xyz - viewPoint1; vec4 r = rotate(q1, vec4(vUv1, 1.0)); vUv1 = r.xyz/r.w; vUv1.x = - vUv1.x; vUv2 = worldPosition.xyz - viewPoint2; r = rotate(q2, vec4(vUv2, 1.0)); vUv2 = r.xyz/r.w; vUv2.x = - vUv2.x;  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); gl_Position  = projectionMatrix * mvPosition; }`,
        fragmentShader: `uniform samplerCube texture1; uniform samplerCube texture2; uniform float progress; varying vec3 vUv1; varying vec3 vUv2; void main() { vec4 color1 = textureCube(texture1, vUv1); vec4 color2 = textureCube(texture2, vUv2); gl_FragColor = mix(color1, color2,  progress); }`,
        //side: THREE.BackSide
    });

    this.textureLoaded1 = false; //是否设置了纹理1
    this.textureLoaded2 = false; //是否设置了纹理2
    this.viewpointSet = false; // 是否设置了位置点
    this.progress = 0.0; //移动进度

    this.updateModel(group);
}

Object.assign(MaterialSwitch.prototype, {
    updateModel(group){
        this.matOrign.length = 0
        this.group = group;
        var scope = this;
        this.group && this.group.traverse( function (child) {
            if ( child.isMesh ) {
                // child.material.map.encoding = THREE.LinearEncoding;// .sRGBEncoding;
                // scope.matOrign.push(child.material);
                var mat = new THREE.MeshBasicMaterial();
				//mat.side = THREE.DoubleSide;
                mat.side = THREE.FrontSide;
                mat.map = child.material.map;
                mat.map.encoding = THREE.LinearEncoding;// .sRGBEncoding;
                child.material = mat;
                scope.matOrign.push(mat);
            }
        } );
    },
    restore(){
        var index = 0;
        var scope = this;
        this.group && this.group.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material = scope.matOrign[index++];
            }
        });
        this.clear();
    },
    useCubemap(){
        if(!this.loaded()) {
            console.warn("cubemap not loaded");
            return;
        }

        this._useCubemap();
    },
    loaded(){ //判断是否已加载
        return this.textureLoaded1 && this.viewpointSet;
    },
    clear(){ //设置为未加载
        this.textureLoaded1 = false;
        this.textureLoaded2 = false;
        this.viewpointSet = false;
    },
    setTarget(point){ //设置目标点位置
        if(!this.viewpointSet){ //直接移动到
            this.matCube.uniforms.viewPoint1.value = point;
            this.viewpointSet = true;
            this.textureLoaded1 = false;
        }else{//从当前点移动
            this.matCube.uniforms.viewPoint1.value = this.matCube.uniforms.viewPoint2.value;
            this.matCube.uniforms.texture1.value = this.matCube.uniforms.texture2.value;
            this.matCube.uniforms.q1.value = this.matCube.uniforms.q2.value;
        }
        this.textureLoaded2 = false;
        this.matCube.uniforms.viewPoint2.value = point;
        this.matCube.uniforms.progress.value = 0.0;
        this.matCube.needsUpdate = true; //setTargetTexture后刷新
    },
    setTargetTexture(texture, q){ //需要先设置目标点位置，后设置目标点纹理
        if(!this.textureLoaded1){ //保证同时设置
            this.matCube.uniforms.texture1.value = texture;
            this.matCube.uniforms.q1.value = q;
            this.textureLoaded1 = true;
        }else{
            this.textureLoaded2 = true;
            this.matCube.uniforms.progress.value = this.progress;
        }

        this.matCube.uniforms.texture2.value = texture;
        this.matCube.uniforms.q2.value = q;
        this.matCube.needsUpdate = true;
    },
    updateProgress(progress){
        this.progress = progress;
        this.matCube.uniforms.progress.value = (this.textureLoaded2?progress:0);
        this.matCube.needsUpdate = true;
    },
    _useCubemap(){
        var scope = this;
        this.group && this.group.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material = scope.matCube;
            }
        } );
    },

});

