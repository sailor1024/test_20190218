//options.js
//调试信息
function setupOption() {
    if (!debugMode) {
        return;
    }
    var Options = function () {
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
        this.ortho = function () {
            if (modeSwitch.isOrthographic()) {
                modeSwitch.setOverallMode();
            } else {
                var cam = cameraController.getCurrentCamera();
                var pos = new THREE.Vector3();
                var q = new THREE.Quaternion();
                cam.getWorldPosition(pos);
                cam.getWorldQuaternion(q);
                var up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
                var dir = new THREE.Vector3();
                cam.getWorldDirection(dir);
                var xAxis = dir.clone().cross(up);
                var mat4 = new THREE.Matrix4();
                mat4.makeBasis(xAxis, up, dir.clone().multiplyScalar(-1));
                q.setFromRotationMatrix(mat4);
                setOrthographic(pos, q);
            }
        };
        this.orthoTo = function () {
            setOrthographic(new THREE.Vector3(-8.97, 33.33, -13.45), new THREE.Quaternion(0.496006594424995, 0.5039617706149377, 0.5039612666534192, -0.49600709043183744));
        };
        this.cubeMap1 = function () {
            setWalkingViewPoint(0);
        };
        this.cubeMap2 = function () {
            setWalkingViewPoint(1);
        };
        var oInput = document.createElement('input');
        document.body.appendChild(oInput);
        this.cameraInfo = function () { //将相机位置、朝向输出到控制台和剪切板
            var cam = cameraController.getCurrentCamera();
            var pos = new THREE.Vector3();
            var q = new THREE.Quaternion();
            cam.getWorldPosition(pos);
            cam.getWorldQuaternion(q);
            var text = JSON.stringify({
                index: targetIndex,
                camera: {
                    pos: [parseInt(pos.x * 100) / 100, parseInt(pos.y * 100) / 100, parseInt(pos.z * 100) / 100],
                    q: [parseInt(q.x * 100000) / 100000, parseInt(q.y * 100000) / 100000, parseInt(q.z * 100000) / 100000, parseInt(q.w * 100000) / 100000],
                    qd: [q.x, q.y, q.z, q.w]
                }
            });
            oInput.value = text;
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
        };
        this.setCameraPos = function () {
            setWalkingViewPoint(46, new THREE.Quaternion(-0.0696, 0.6753, 0.0642, 0.7313));
        };
        this.moveTo = function () {
            setOverallView(new THREE.Vector3(-8.97, 33.33, -13.45), new THREE.Quaternion(0.496006594424995, 0.5039617706149377, 0.5039612666534192, -0.49600709043183744));
        }
        this.play = function () {
            animateControl.play("main");
        }
        this.pause = function () {
            animateControl.pause();
        }
        this.continue = function () {
            animateControl.continue();
        }
        this.stop = function () {
            animateControl.stop();
        }
        this.zoomin = function () {
            var c = cameraController.getCurrentCamera();
            if (c.fov > 10) {
                c.fov *= 0.9;
                console.log(c.fov);
                c.updateProjectionMatrix();
            }
        };
        this.zoomout = function () {
            var c = cameraController.getCurrentCamera();
            if (c.fov < 90) {
                c.fov *= 1.1;
                console.log(c.fov);
                c.updateProjectionMatrix();
            }
        };
        this.save = function () {
            var w = window.open('', '');
            w.document.title = "Screenshot";
            var img = new Image();
            img.src = module3D.getImgData(162, 100); // renderer.domElement.toDataURL();
            w.document.body.appendChild(img);
        };
        this.saveImg = function () {
            var ren = new THREE.WebGLRenderer({
                antialias: true
            });
            ren.setSize(2048, 2048);
            var cam = new THREE.PerspectiveCamera(90, 1, 0.1, 500);
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
            for (var i = 0; i < 6; ++i) {
                var img = new Image();
                img.width = 256;
                img.height = 256;
                cam.lookAt(target[i].add(cam.position));
                ren.render(scene, cam);
                if (Modernizr.webplossless) {
                    img.src = ren.domElement.toDataURL('image/webp');
                } else {
                    img.src = ren.domElement.toDataURL('image/jpeg', 0.75);
                }
                w.document.write(targetIndex * 6 + i);
                w.document.body.appendChild(img);
            }
        };
        this.saveBK = function () {
            var w = window.open("", i);
            w.document.write("index:" + targetIndex + " file: ");
            var vp = modelData.viewPoints[targetIndex];
            if (vp.inlineVideo) {
                var count = vp.inlineVideo.length;
                var ren = new THREE.WebGLRenderer({
                    antialias: true
                });
                for (var i = 0; i < count; ++i) {
                    videoController.videoPlanes[i].visible = false;
                    ren.setSize(videoController.videos[i].videoWidth, videoController.videos[i].videoHeight);
                    var pos = vp.inlineVideo[i].position;
                    var p = new THREE.Vector3(pos.x, pos.y, pos.z);
                    var cp = new THREE.Vector3();
                    cameraController.getCurrentCamera().getWorldPosition(cp);
                    var len = cp.clone().sub(p).length();
                    var cam = new THREE.PerspectiveCamera(Math.atan(vp.inlineVideo[i].height / 2 / len) * 360 / Math.PI, vp.inlineVideo[i].width / vp.inlineVideo[i].height, 0.1, 500);
                    cam.position.copy(cp);
                    cam.lookAt(p);
                    var img = new Image();
                    img.width = videoController.videos[i].videoWidth;
                    img.height = videoController.videos[i].videoHeight;
                    ren.render(scene, cam);
                    img.src = ren.domElement.toDataURL('image/jpeg', 0.8);
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


//options.js end

//GltfLoader.js
/**
 * @author Rich Tibbett / https://github.com/richtr
 * @author mrdoob / http://mrdoob.com/
 * @author Tony Parisi / http://www.tonyparisi.com/
 * @author Takahiro / https://github.com/takahirox
 * @author Don McCurdy / https://www.donmccurdy.com
 */

THREE.GLTFLoader = (function () {
    function GLTFLoader(manager) {
        this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        this.dracoLoader = null;
    }
    GLTFLoader.prototype = {
        constructor: GLTFLoader,
        crossOrigin: 'Anonymous',
        load: function (url, onLoad, onProgress, onError) {
            var scope = this;
            var path = this.path !== undefined ? this.path : THREE.LoaderUtils.extractUrlBase(url);
            var loader = new THREE.FileLoader(scope.manager);
            loader.setResponseType('arraybuffer');
            loader.load(url, function (data) {
                try {
                    scope.parse(data, path, onLoad, onError);
                } catch (e) {
                    if (onError !== undefined) {
                        onError(e);
                    } else {
                        throw e;
                    }
                }
            }, onProgress, onError);
        },
        setCrossOrigin: function (value) {
            this.crossOrigin = value;
            return this;
        },
        setPath: function (value) {
            this.path = value;
            return this;
        },
        setDRACOLoader: function (dracoLoader) {
            this.dracoLoader = dracoLoader;
            return this;
        },
        parse: function (data, path, onLoad, onError) {
            var content;
            var extensions = {};
            if (typeof data === 'string') {
                content = data;
            } else {
                var magic = THREE.LoaderUtils.decodeText(new Uint8Array(data, 0, 4));
                if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
                    try {
                        extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
                    } catch (error) {
                        if (onError) onError(error);
                        return;
                    }
                    content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;
                } else {
                    content = THREE.LoaderUtils.decodeText(new Uint8Array(data));
                }
            }
            var json = JSON.parse(content);
            if (json.asset === undefined || json.asset.version[0] < 2) {
                if (onError) onError(new Error('THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported. Use LegacyGLTFLoader instead.'));
                return;
            }
            if (json.extensionsUsed) {
                if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_LIGHTS) >= 0) {
                    extensions[EXTENSIONS.KHR_LIGHTS] = new GLTFLightsExtension(json);
                }
                if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_MATERIALS_UNLIT) >= 0) {
                    extensions[EXTENSIONS.KHR_MATERIALS_UNLIT] = new GLTFMaterialsUnlitExtension(json);
                }
                if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS) >= 0) {
                    extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS] = new GLTFMaterialsPbrSpecularGlossinessExtension();
                }
                if (json.extensionsUsed.indexOf(EXTENSIONS.KHR_DRACO_MESH_COMPRESSION) >= 0) {
                    extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION] = new GLTFDracoMeshCompressionExtension(this.dracoLoader);
                }
            }
            console.time('GLTFLoader');
            var parser = new GLTFParser(json, extensions, {
                path: path || this.path || '',
                crossOrigin: this.crossOrigin,
                manager: this.manager
            });
            parser.parse(function (scene, scenes, cameras, animations, asset) {
                var glTF = {
                    scene: scene,
                    scenes: scenes,
                    cameras: cameras,
                    animations: animations,
                    asset: asset
                };
                onLoad(glTF);
            }, onError);
        }
    };
    /* GLTFREGISTRY */
    function GLTFRegistry() {
        var objects = {};
        return {
            get: function (key) {
                return objects[key];
            },
            add: function (key, object) {
                objects[key] = object;
            },
            remove: function (key) {
                delete objects[key];
            },
            removeAll: function () {
                objects = {};
            }
        };
    }
    /*********************************/
    /********** EXTENSIONS ***********/
    /*********************************/
    var EXTENSIONS = {
        KHR_BINARY_GLTF: 'KHR_binary_glTF',
        KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
        KHR_LIGHTS: 'KHR_lights',
        KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
        KHR_MATERIALS_UNLIT: 'KHR_materials_unlit'
    };
    /**
     * Lights Extension
     *
     * Specification: PENDING
     */
    function GLTFLightsExtension(json) {
        this.name = EXTENSIONS.KHR_LIGHTS;
        this.lights = {};
        var extension = (json.extensions && json.extensions[EXTENSIONS.KHR_LIGHTS]) || {};
        var lights = extension.lights || {};
        for (var lightId in lights) {
            var light = lights[lightId];
            var lightNode;
            var color = new THREE.Color().fromArray(light.color);
            switch (light.type) {
                case 'directional':
                    lightNode = new THREE.DirectionalLight(color);
                    lightNode.position.set(0, 0, 1);
                    break;
                case 'point':
                    lightNode = new THREE.PointLight(color);
                    break;
                case 'spot':
                    lightNode = new THREE.SpotLight(color);
                    lightNode.position.set(0, 0, 1);
                    break;
                case 'ambient':
                    lightNode = new THREE.AmbientLight(color);
                    break;
            }
            if (lightNode) {
                if (light.constantAttenuation !== undefined) {
                    lightNode.intensity = light.constantAttenuation;
                }
                if (light.linearAttenuation !== undefined) {
                    lightNode.distance = 1 / light.linearAttenuation;
                }
                if (light.quadraticAttenuation !== undefined) {
                    lightNode.decay = light.quadraticAttenuation;
                }
                if (light.fallOffAngle !== undefined) {
                    lightNode.angle = light.fallOffAngle;
                }
                if (light.fallOffExponent !== undefined) {
                    console.warn('THREE.GLTFLoader:: light.fallOffExponent not currently supported.');
                }
                lightNode.name = light.name || ('light_' + lightId);
                this.lights[lightId] = lightNode;
            }
        }
    }
    /**
     * Unlit Materials Extension (pending)
     *
     * PR: https://github.com/KhronosGroup/glTF/pull/1163
     */
    function GLTFMaterialsUnlitExtension(json) {
        this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
    }
    GLTFMaterialsUnlitExtension.prototype.getMaterialType = function (material) {
        return THREE.MeshBasicMaterial;
    };
    GLTFMaterialsUnlitExtension.prototype.extendParams = function (materialParams, material, parser) {
        var pending = [];
        materialParams.color = new THREE.Color(1.0, 1.0, 1.0);
        materialParams.opacity = 1.0;
        var metallicRoughness = material.pbrMetallicRoughness;
        if (metallicRoughness) {
            if (Array.isArray(metallicRoughness.baseColorFactor)) {
                var array = metallicRoughness.baseColorFactor;
                materialParams.color.fromArray(array);
                materialParams.opacity = array[3];
            }
            if (metallicRoughness.baseColorTexture !== undefined) {
                pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture.index));
            }
        }
        return Promise.all(pending);
    };
    /* BINARY EXTENSION */
    var BINARY_EXTENSION_BUFFER_NAME = 'binary_glTF';
    var BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
    var BINARY_EXTENSION_HEADER_LENGTH = 12;
    var BINARY_EXTENSION_CHUNK_TYPES = {
        JSON: 0x4E4F534A,
        BIN: 0x004E4942
    };

    function GLTFBinaryExtension(data) {
        this.name = EXTENSIONS.KHR_BINARY_GLTF;
        this.content = null;
        this.body = null;
        var headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
        this.header = {
            magic: THREE.LoaderUtils.decodeText(new Uint8Array(data.slice(0, 4))),
            version: headerView.getUint32(4, true),
            length: headerView.getUint32(8, true)
        };
        if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
            throw new Error('THREE.GLTFLoader: Unsupported glTF-Binary header.');
        } else if (this.header.version < 2.0) {
            throw new Error('THREE.GLTFLoader: Legacy binary file detected. Use LegacyGLTFLoader instead.');
        }
        var chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
        var chunkIndex = 0;
        while (chunkIndex < chunkView.byteLength) {
            var chunkLength = chunkView.getUint32(chunkIndex, true);
            chunkIndex += 4;
            var chunkType = chunkView.getUint32(chunkIndex, true);
            chunkIndex += 4;
            if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
                var contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
                this.content = THREE.LoaderUtils.decodeText(contentArray);
            } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
                var byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
                this.body = data.slice(byteOffset, byteOffset + chunkLength);
            }
            // Clients must ignore chunks with unknown types.
            chunkIndex += chunkLength;
        }
        if (this.content === null) {
            throw new Error('THREE.GLTFLoader: JSON content not found.');
        }
    }
    /**
     * DRACO Mesh Compression Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/pull/874
     */
    function GLTFDracoMeshCompressionExtension(dracoLoader) {
        if (!dracoLoader) {
            throw new Error('THREE.GLTFLoader: No DRACOLoader instance provided.');
        }
        this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
        this.dracoLoader = dracoLoader;
    }
    GLTFDracoMeshCompressionExtension.prototype.decodePrimitive = function (primitive, parser) {
        var dracoLoader = this.dracoLoader;
        var bufferViewIndex = primitive.extensions[this.name].bufferView;
        var gltfAttributeMap = primitive.extensions[this.name].attributes;
        var threeAttributeMap = {};
        for (var attributeName in gltfAttributeMap) {
            if (!(attributeName in ATTRIBUTES)) continue;
            threeAttributeMap[ATTRIBUTES[attributeName]] = gltfAttributeMap[attributeName];
        }
        return parser.getDependency('bufferView', bufferViewIndex).then(function (bufferView) {
            return new Promise(function (resolve) {
                dracoLoader.decodeDracoFile(bufferView, resolve, threeAttributeMap);
            });
        });
    };
    /**
     * Specular-Glossiness Extension
     *
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness
     */
    function GLTFMaterialsPbrSpecularGlossinessExtension() {
        return {
            name: EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,
            specularGlossinessParams: [
                'color',
                'map',
                'lightMap',
                'lightMapIntensity',
                'aoMap',
                'aoMapIntensity',
                'emissive',
                'emissiveIntensity',
                'emissiveMap',
                'bumpMap',
                'bumpScale',
                'normalMap',
                'displacementMap',
                'displacementScale',
                'displacementBias',
                'specularMap',
                'specular',
                'glossinessMap',
                'glossiness',
                'alphaMap',
                'envMap',
                'envMapIntensity',
                'refractionRatio',
            ],
            getMaterialType: function () {
                return THREE.ShaderMaterial;
            },
            extendParams: function (params, material, parser) {
                var pbrSpecularGlossiness = material.extensions[this.name];
                var shader = THREE.ShaderLib['standard'];
                var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
                var specularMapParsFragmentChunk = [
                    '#ifdef USE_SPECULARMAP',
                    '   uniform sampler2D specularMap;',
                    '#endif'
                ].join('\n');
                var glossinessMapParsFragmentChunk = [
                    '#ifdef USE_GLOSSINESSMAP',
                    '   uniform sampler2D glossinessMap;',
                    '#endif'
                ].join('\n');
                var specularMapFragmentChunk = [
                    'vec3 specularFactor = specular;',
                    '#ifdef USE_SPECULARMAP',
                    '   vec4 texelSpecular = texture2D( specularMap, vUv );',
                    '   texelSpecular = sRGBToLinear( texelSpecular );',
                    '   // reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture',
                    '   specularFactor *= texelSpecular.rgb;',
                    '#endif'
                ].join('\n');
                var glossinessMapFragmentChunk = [
                    'float glossinessFactor = glossiness;',
                    '#ifdef USE_GLOSSINESSMAP',
                    '   vec4 texelGlossiness = texture2D( glossinessMap, vUv );',
                    '   // reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture',
                    '   glossinessFactor *= texelGlossiness.a;',
                    '#endif'
                ].join('\n');
                var lightPhysicalFragmentChunk = [
                    'PhysicalMaterial material;',
                    'material.diffuseColor = diffuseColor.rgb;',
                    'material.specularRoughness = clamp( 1.0 - glossinessFactor, 0.04, 1.0 );',
                    'material.specularColor = specularFactor.rgb;',
                ].join('\n');
                var fragmentShader = shader.fragmentShader
                    .replace('#include <specularmap_fragment>', '')
                    .replace('uniform float roughness;', 'uniform vec3 specular;')
                    .replace('uniform float metalness;', 'uniform float glossiness;')
                    .replace('#include <roughnessmap_pars_fragment>', specularMapParsFragmentChunk)
                    .replace('#include <metalnessmap_pars_fragment>', glossinessMapParsFragmentChunk)
                    .replace('#include <roughnessmap_fragment>', specularMapFragmentChunk)
                    .replace('#include <metalnessmap_fragment>', glossinessMapFragmentChunk)
                    .replace('#include <lights_physical_fragment>', lightPhysicalFragmentChunk);
                delete uniforms.roughness;
                delete uniforms.metalness;
                delete uniforms.roughnessMap;
                delete uniforms.metalnessMap;
                uniforms.specular = {
                    value: new THREE.Color().setHex(0x111111)
                };
                uniforms.glossiness = {
                    value: 0.5
                };
                uniforms.specularMap = {
                    value: null
                };
                uniforms.glossinessMap = {
                    value: null
                };
                params.vertexShader = shader.vertexShader;
                params.fragmentShader = fragmentShader;
                params.uniforms = uniforms;
                params.defines = {
                    'STANDARD': ''
                };
                params.color = new THREE.Color(1.0, 1.0, 1.0);
                params.opacity = 1.0;
                var pending = [];
                if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {
                    var array = pbrSpecularGlossiness.diffuseFactor;
                    params.color.fromArray(array);
                    params.opacity = array[3];
                }
                if (pbrSpecularGlossiness.diffuseTexture !== undefined) {
                    pending.push(parser.assignTexture(params, 'map', pbrSpecularGlossiness.diffuseTexture.index));
                }
                params.emissive = new THREE.Color(0.0, 0.0, 0.0);
                params.glossiness = pbrSpecularGlossiness.glossinessFactor !== undefined ? pbrSpecularGlossiness.glossinessFactor : 1.0;
                params.specular = new THREE.Color(1.0, 1.0, 1.0);
                if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {
                    params.specular.fromArray(pbrSpecularGlossiness.specularFactor);
                }
                if (pbrSpecularGlossiness.specularGlossinessTexture !== undefined) {
                    var specGlossIndex = pbrSpecularGlossiness.specularGlossinessTexture.index;
                    pending.push(parser.assignTexture(params, 'glossinessMap', specGlossIndex));
                    pending.push(parser.assignTexture(params, 'specularMap', specGlossIndex));
                }
                return Promise.all(pending);
            },
            createMaterial: function (params) {
                // setup material properties based on MeshStandardMaterial for Specular-Glossiness
                var material = new THREE.ShaderMaterial({
                    defines: params.defines,
                    vertexShader: params.vertexShader,
                    fragmentShader: params.fragmentShader,
                    uniforms: params.uniforms,
                    fog: true,
                    lights: true,
                    opacity: params.opacity,
                    transparent: params.transparent
                });
                material.isGLTFSpecularGlossinessMaterial = true;
                material.color = params.color;
                material.map = params.map === undefined ? null : params.map;
                material.lightMap = null;
                material.lightMapIntensity = 1.0;
                material.aoMap = params.aoMap === undefined ? null : params.aoMap;
                material.aoMapIntensity = 1.0;
                material.emissive = params.emissive;
                material.emissiveIntensity = 1.0;
                material.emissiveMap = params.emissiveMap === undefined ? null : params.emissiveMap;
                material.bumpMap = params.bumpMap === undefined ? null : params.bumpMap;
                material.bumpScale = 1;
                material.normalMap = params.normalMap === undefined ? null : params.normalMap;
                if (params.normalScale) material.normalScale = params.normalScale;
                material.displacementMap = null;
                material.displacementScale = 1;
                material.displacementBias = 0;
                material.specularMap = params.specularMap === undefined ? null : params.specularMap;
                material.specular = params.specular;
                material.glossinessMap = params.glossinessMap === undefined ? null : params.glossinessMap;
                material.glossiness = params.glossiness;
                material.alphaMap = null;
                material.envMap = params.envMap === undefined ? null : params.envMap;
                material.envMapIntensity = 1.0;
                material.refractionRatio = 0.98;
                material.extensions.derivatives = true;
                return material;
            },
            /**
             * Clones a GLTFSpecularGlossinessMaterial instance. The ShaderMaterial.copy() method can
             * copy only properties it knows about or inherits, and misses many properties that would
             * normally be defined by MeshStandardMaterial.
             *
             * This method allows GLTFSpecularGlossinessMaterials to be cloned in the process of
             * loading a glTF model, but cloning later (e.g. by the user) would require these changes
             * AND also updating `.onBeforeRender` on the parent mesh.
             *
             * @param  {THREE.ShaderMaterial} source
             * @return {THREE.ShaderMaterial}
             */
            cloneMaterial: function (source) {
                var target = source.clone();
                target.isGLTFSpecularGlossinessMaterial = true;
                var params = this.specularGlossinessParams;
                for (var i = 0, il = params.length; i < il; i++) {
                    target[params[i]] = source[params[i]];
                }
                return target;
            },
            // Here's based on refreshUniformsCommon() and refreshUniformsStandard() in WebGLRenderer.
            refreshUniforms: function (renderer, scene, camera, geometry, material, group) {
                if (material.isGLTFSpecularGlossinessMaterial !== true) {
                    return;
                }
                var uniforms = material.uniforms;
                var defines = material.defines;
                uniforms.opacity.value = material.opacity;
                uniforms.diffuse.value.copy(material.color);
                uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity);
                uniforms.map.value = material.map;
                uniforms.specularMap.value = material.specularMap;
                uniforms.alphaMap.value = material.alphaMap;
                uniforms.lightMap.value = material.lightMap;
                uniforms.lightMapIntensity.value = material.lightMapIntensity;
                uniforms.aoMap.value = material.aoMap;
                uniforms.aoMapIntensity.value = material.aoMapIntensity;
                // uv repeat and offset setting priorities
                // 1. color map
                // 2. specular map
                // 3. normal map
                // 4. bump map
                // 5. alpha map
                // 6. emissive map
                var uvScaleMap;
                if (material.map) {
                    uvScaleMap = material.map;
                } else if (material.specularMap) {
                    uvScaleMap = material.specularMap;
                } else if (material.displacementMap) {
                    uvScaleMap = material.displacementMap;
                } else if (material.normalMap) {
                    uvScaleMap = material.normalMap;
                } else if (material.bumpMap) {
                    uvScaleMap = material.bumpMap;
                } else if (material.glossinessMap) {
                    uvScaleMap = material.glossinessMap;
                } else if (material.alphaMap) {
                    uvScaleMap = material.alphaMap;
                } else if (material.emissiveMap) {
                    uvScaleMap = material.emissiveMap;
                }
                if (uvScaleMap !== undefined) {
                    // backwards compatibility
                    if (uvScaleMap.isWebGLRenderTarget) {
                        uvScaleMap = uvScaleMap.texture;
                    }
                    var offset;
                    var repeat;
                    if (uvScaleMap.matrix !== undefined) {
                        // > r88.
                        if (uvScaleMap.matrixAutoUpdate === true) {
                            offset = uvScaleMap.offset;
                            repeat = uvScaleMap.repeat;
                            var rotation = uvScaleMap.rotation;
                            var center = uvScaleMap.center;
                            uvScaleMap.matrix.setUvTransform(offset.x, offset.y, repeat.x, repeat.y, rotation, center.x, center.y);
                        }
                        uniforms.uvTransform.value.copy(uvScaleMap.matrix);
                    } else {
                        // <= r87. Remove when reasonable.
                        offset = uvScaleMap.offset;
                        repeat = uvScaleMap.repeat;
                        uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
                    }
                }
                uniforms.envMap.value = material.envMap;
                uniforms.envMapIntensity.value = material.envMapIntensity;
                uniforms.flipEnvMap.value = (material.envMap && material.envMap.isCubeTexture) ? -1 : 1;
                uniforms.refractionRatio.value = material.refractionRatio;
                uniforms.specular.value.copy(material.specular);
                uniforms.glossiness.value = material.glossiness;
                uniforms.glossinessMap.value = material.glossinessMap;
                uniforms.emissiveMap.value = material.emissiveMap;
                uniforms.bumpMap.value = material.bumpMap;
                uniforms.normalMap.value = material.normalMap;
                uniforms.displacementMap.value = material.displacementMap;
                uniforms.displacementScale.value = material.displacementScale;
                uniforms.displacementBias.value = material.displacementBias;
                if (uniforms.glossinessMap.value !== null && defines.USE_GLOSSINESSMAP === undefined) {
                    defines.USE_GLOSSINESSMAP = '';
                    // set USE_ROUGHNESSMAP to enable vUv
                    defines.USE_ROUGHNESSMAP = '';
                }
                if (uniforms.glossinessMap.value === null && defines.USE_GLOSSINESSMAP !== undefined) {
                    delete defines.USE_GLOSSINESSMAP;
                    delete defines.USE_ROUGHNESSMAP;
                }
            }
        };
    }
    /*********************************/
    /********** INTERPOLATION ********/
    /*********************************/
    // Spline Interpolation
    // Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
    function GLTFCubicSplineInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        THREE.Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
    };
    GLTFCubicSplineInterpolant.prototype = Object.create(THREE.Interpolant.prototype);
    GLTFCubicSplineInterpolant.prototype.constructor = GLTFCubicSplineInterpolant;
    GLTFCubicSplineInterpolant.prototype.interpolate_ = function (i1, t0, t, t1) {
        var result = this.resultBuffer;
        var values = this.sampleValues;
        var stride = this.valueSize;
        var stride2 = stride * 2;
        var stride3 = stride * 3;
        var td = t1 - t0;
        var p = (t - t0) / td;
        var pp = p * p;
        var ppp = pp * p;
        var offset1 = i1 * stride3;
        var offset0 = offset1 - stride3;
        var s0 = 2 * ppp - 3 * pp + 1;
        var s1 = ppp - 2 * pp + p;
        var s2 = -2 * ppp + 3 * pp;
        var s3 = ppp - pp;
        // Layout of keyframe output values for CUBICSPLINE animations:
        //   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
        for (var i = 0; i !== stride; i++) {
            var p0 = values[offset0 + i + stride]; // splineVertex_k
            var m0 = values[offset0 + i + stride2] * td; // outTangent_k * (t_k+1 - t_k)
            var p1 = values[offset1 + i + stride]; // splineVertex_k+1
            var m1 = values[offset1 + i] * td; // inTangent_k+1 * (t_k+1 - t_k)
            result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
        }
        return result;
    };
    /*********************************/
    /********** INTERNALS ************/
    /*********************************/
    /* CONSTANTS */
    var WEBGL_CONSTANTS = {
        FLOAT: 5126,
        //FLOAT_MAT2: 35674,
        FLOAT_MAT3: 35675,
        FLOAT_MAT4: 35676,
        FLOAT_VEC2: 35664,
        FLOAT_VEC3: 35665,
        FLOAT_VEC4: 35666,
        LINEAR: 9729,
        REPEAT: 10497,
        SAMPLER_2D: 35678,
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6,
        UNSIGNED_BYTE: 5121,
        UNSIGNED_SHORT: 5123
    };
    var WEBGL_TYPE = {
        5126: Number,
        //35674: THREE.Matrix2,
        35675: THREE.Matrix3,
        35676: THREE.Matrix4,
        35664: THREE.Vector2,
        35665: THREE.Vector3,
        35666: THREE.Vector4,
        35678: THREE.Texture
    };
    var WEBGL_COMPONENT_TYPES = {
        5120: Int8Array,
        5121: Uint8Array,
        5122: Int16Array,
        5123: Uint16Array,
        5125: Uint32Array,
        5126: Float32Array
    };
    var WEBGL_FILTERS = {
        9728: THREE.NearestFilter,
        9729: THREE.LinearFilter,
        9984: THREE.NearestMipMapNearestFilter,
        9985: THREE.LinearMipMapNearestFilter,
        9986: THREE.NearestMipMapLinearFilter,
        9987: THREE.LinearMipMapLinearFilter
    };
    var WEBGL_WRAPPINGS = {
        33071: THREE.ClampToEdgeWrapping,
        33648: THREE.MirroredRepeatWrapping,
        10497: THREE.RepeatWrapping
    };
    var WEBGL_TEXTURE_FORMATS = {
        6406: THREE.AlphaFormat,
        6407: THREE.RGBFormat,
        6408: THREE.RGBAFormat,
        6409: THREE.LuminanceFormat,
        6410: THREE.LuminanceAlphaFormat
    };
    var WEBGL_TEXTURE_DATATYPES = {
        5121: THREE.UnsignedByteType,
        32819: THREE.UnsignedShort4444Type,
        32820: THREE.UnsignedShort5551Type,
        33635: THREE.UnsignedShort565Type
    };
    var WEBGL_SIDES = {
        1028: THREE.BackSide, // Culling front
        1029: THREE.FrontSide // Culling back
        //1032: THREE.NoSide   // Culling front and back, what to do?
    };
    var WEBGL_DEPTH_FUNCS = {
        512: THREE.NeverDepth,
        513: THREE.LessDepth,
        514: THREE.EqualDepth,
        515: THREE.LessEqualDepth,
        516: THREE.GreaterEqualDepth,
        517: THREE.NotEqualDepth,
        518: THREE.GreaterEqualDepth,
        519: THREE.AlwaysDepth
    };
    var WEBGL_BLEND_EQUATIONS = {
        32774: THREE.AddEquation,
        32778: THREE.SubtractEquation,
        32779: THREE.ReverseSubtractEquation
    };
    var WEBGL_BLEND_FUNCS = {
        0: THREE.ZeroFactor,
        1: THREE.OneFactor,
        768: THREE.SrcColorFactor,
        769: THREE.OneMinusSrcColorFactor,
        770: THREE.SrcAlphaFactor,
        771: THREE.OneMinusSrcAlphaFactor,
        772: THREE.DstAlphaFactor,
        773: THREE.OneMinusDstAlphaFactor,
        774: THREE.DstColorFactor,
        775: THREE.OneMinusDstColorFactor,
        776: THREE.SrcAlphaSaturateFactor
        // The followings are not supported by Three.js yet
        //32769: CONSTANT_COLOR,
        //32770: ONE_MINUS_CONSTANT_COLOR,
        //32771: CONSTANT_ALPHA,
        //32772: ONE_MINUS_CONSTANT_COLOR
    };
    var WEBGL_TYPE_SIZES = {
        'SCALAR': 1,
        'VEC2': 2,
        'VEC3': 3,
        'VEC4': 4,
        'MAT2': 4,
        'MAT3': 9,
        'MAT4': 16
    };
    var ATTRIBUTES = {
        POSITION: 'position',
        NORMAL: 'normal',
        TEXCOORD_0: 'uv',
        TEXCOORD0: 'uv', // deprecated
        TEXCOORD: 'uv', // deprecated
        TEXCOORD_1: 'uv2',
        COLOR_0: 'color',
        COLOR0: 'color', // deprecated
        COLOR: 'color', // deprecated
        WEIGHTS_0: 'skinWeight',
        WEIGHT: 'skinWeight', // deprecated
        JOINTS_0: 'skinIndex',
        JOINT: 'skinIndex' // deprecated
    }
    var PATH_PROPERTIES = {
        scale: 'scale',
        translation: 'position',
        rotation: 'quaternion',
        weights: 'morphTargetInfluences'
    };
    var INTERPOLATION = {
        CUBICSPLINE: THREE.InterpolateSmooth, // We use custom interpolation GLTFCubicSplineInterpolation for CUBICSPLINE.
        // KeyframeTrack.optimize() can't handle glTF Cubic Spline output values layout,
        // using THREE.InterpolateSmooth for KeyframeTrack instantiation to prevent optimization.
        // See KeyframeTrack.optimize() for the detail.
        LINEAR: THREE.InterpolateLinear,
        STEP: THREE.InterpolateDiscrete
    };
    var STATES_ENABLES = {
        2884: 'CULL_FACE',
        2929: 'DEPTH_TEST',
        3042: 'BLEND',
        3089: 'SCISSOR_TEST',
        32823: 'POLYGON_OFFSET_FILL',
        32926: 'SAMPLE_ALPHA_TO_COVERAGE'
    };
    var ALPHA_MODES = {
        OPAQUE: 'OPAQUE',
        MASK: 'MASK',
        BLEND: 'BLEND'
    };
    /* UTILITY FUNCTIONS */
    function resolveURL(url, path) {
        // Invalid URL
        if (typeof url !== 'string' || url === '') return '';
        // Absolute URL http://,https://,//
        if (/^(https?:)?\/\//i.test(url)) return url;
        // Data URI
        if (/^data:.*,.*$/i.test(url)) return url;
        // Blob URL
        if (/^blob:.*$/i.test(url)) return url;
        // Relative URL
        return path + url;
    }
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
     */
    function createDefaultMaterial() {
        return new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0x000000,
            metalness: 1,
            roughness: 1,
            transparent: false,
            depthTest: true,
            side: THREE.FrontSide
        });
    }
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
     *
     * @param {THREE.Mesh} mesh
     * @param {GLTF.Mesh} meshDef
     * @param {GLTF.Primitive} primitiveDef
     * @param {Array<THREE.BufferAttribute>} accessors
     */
    function addMorphTargets(mesh, meshDef, primitiveDef, accessors) {
        var geometry = mesh.geometry;
        var material = mesh.material;
        var targets = primitiveDef.targets;
        var morphAttributes = geometry.morphAttributes;
        morphAttributes.position = [];
        morphAttributes.normal = [];
        material.morphTargets = true;
        for (var i = 0, il = targets.length; i < il; i++) {
            var target = targets[i];
            var attributeName = 'morphTarget' + i;
            var positionAttribute, normalAttribute;
            if (target.POSITION !== undefined) {
                // Three.js morph formula is
                //   position
                //     + weight0 * ( morphTarget0 - position )
                //     + weight1 * ( morphTarget1 - position )
                //     ...
                // while the glTF one is
                //   position
                //     + weight0 * morphTarget0
                //     + weight1 * morphTarget1
                //     ...
                // then adding position to morphTarget.
                // So morphTarget value will depend on mesh's position, then cloning attribute
                // for the case if attribute is shared among two or more meshes.
                positionAttribute = cloneBufferAttribute(accessors[target.POSITION]);
                var position = geometry.attributes.position;
                for (var j = 0, jl = positionAttribute.count; j < jl; j++) {
                    positionAttribute.setXYZ(
                        j,
                        positionAttribute.getX(j) + position.getX(j),
                        positionAttribute.getY(j) + position.getY(j),
                        positionAttribute.getZ(j) + position.getZ(j)
                    );
                }
            } else if (geometry.attributes.position) {
                // Copying the original position not to affect the final position.
                // See the formula above.
                positionAttribute = cloneBufferAttribute(geometry.attributes.position);
            }
            if (positionAttribute !== undefined) {
                positionAttribute.name = attributeName;
                morphAttributes.position.push(positionAttribute);
            }
            if (target.NORMAL !== undefined) {
                material.morphNormals = true;
                // see target.POSITION's comment
                normalAttribute = cloneBufferAttribute(accessors[target.NORMAL]);
                var normal = geometry.attributes.normal;
                for (var j = 0, jl = normalAttribute.count; j < jl; j++) {
                    normalAttribute.setXYZ(
                        j,
                        normalAttribute.getX(j) + normal.getX(j),
                        normalAttribute.getY(j) + normal.getY(j),
                        normalAttribute.getZ(j) + normal.getZ(j)
                    );
                }
            } else if (geometry.attributes.normal !== undefined) {
                normalAttribute = cloneBufferAttribute(geometry.attributes.normal);
            }
            if (normalAttribute !== undefined) {
                normalAttribute.name = attributeName;
                morphAttributes.normal.push(normalAttribute);
            }
        }
        mesh.updateMorphTargets();
        if (meshDef.weights !== undefined) {
            for (var i = 0, il = meshDef.weights.length; i < il; i++) {
                mesh.morphTargetInfluences[i] = meshDef.weights[i];
            }
        }
        // .extras has user-defined data, so check that .extras.targetNames is an array.
        if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
            for (var i = 0, il = meshDef.extras.targetNames.length; i < il; i++) {
                mesh.morphTargetDictionary[meshDef.extras.targetNames[i]] = i;
            }
        }
    }

    function isPrimitiveEqual(a, b) {
        if (a.indices !== b.indices) {
            return false;
        }
        var attribA = a.attributes || {};
        var attribB = b.attributes || {};
        var keysA = Object.keys(attribA);
        var keysB = Object.keys(attribB);
        if (keysA.length !== keysB.length) {
            return false;
        }
        for (var i = 0, il = keysA.length; i < il; i++) {
            var key = keysA[i];
            if (attribA[key] !== attribB[key]) {
                return false;
            }
        }
        return true;
    }

    function getCachedGeometry(cache, newPrimitive) {
        for (var i = 0, il = cache.length; i < il; i++) {
            var cached = cache[i];
            if (isPrimitiveEqual(cached.primitive, newPrimitive)) {
                return cached.promise;
            }
        }
        return null;
    }

    function cloneBufferAttribute(attribute) {
        if (attribute.isInterleavedBufferAttribute) {
            var count = attribute.count;
            var itemSize = attribute.itemSize;
            var array = attribute.array.slice(0, count * itemSize);
            for (var i = 0; i < count; ++i) {
                array[i] = attribute.getX(i);
                if (itemSize >= 2) array[i + 1] = attribute.getY(i);
                if (itemSize >= 3) array[i + 2] = attribute.getZ(i);
                if (itemSize >= 4) array[i + 3] = attribute.getW(i);
            }
            return new THREE.BufferAttribute(array, itemSize, attribute.normalized);
        }
        return attribute.clone();
    }
    /* GLTF PARSER */
    function GLTFParser(json, extensions, options) {
        this.json = json || {};
        this.extensions = extensions || {};
        this.options = options || {};
        // loader object cache
        this.cache = new GLTFRegistry();
        // BufferGeometry caching
        this.primitiveCache = [];
        this.textureLoader = new THREE.TextureLoader(this.options.manager);
        this.textureLoader.setCrossOrigin(this.options.crossOrigin);
        this.fileLoader = new THREE.FileLoader(this.options.manager);
        this.fileLoader.setResponseType('arraybuffer');
    }
    GLTFParser.prototype.parse = function (onLoad, onError) {
        var json = this.json;
        // Clear the loader cache
        this.cache.removeAll();
        // Mark the special nodes/meshes in json for efficient parse
        this.markDefs();
        // Fire the callback on complete
        this.getMultiDependencies([
            'scene',
            'animation',
            'camera'
        ]).then(function (dependencies) {
            var scenes = dependencies.scenes || [];
            var scene = scenes[json.scene || 0];
            var animations = dependencies.animations || [];
            var asset = json.asset;
            var cameras = dependencies.cameras || [];
            onLoad(scene, scenes, cameras, animations, asset);
        }).catch(onError);
    };
    /**
     * Marks the special nodes/meshes in json for efficient parse.
     */
    GLTFParser.prototype.markDefs = function () {
        var nodeDefs = this.json.nodes || [];
        var skinDefs = this.json.skins || [];
        var meshDefs = this.json.meshes || [];
        var meshReferences = {};
        var meshUses = {};
        // Nothing in the node definition indicates whether it is a Bone or an
        // Object3D. Use the skins' joint references to mark bones.
        for (var skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
            var joints = skinDefs[skinIndex].joints;
            for (var i = 0, il = joints.length; i < il; i++) {
                nodeDefs[joints[i]].isBone = true;
            }
        }
        // Meshes can (and should) be reused by multiple nodes in a glTF asset. To
        // avoid having more than one THREE.Mesh with the same name, count
        // references and rename instances below.
        //
        // Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
        for (var nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
            var nodeDef = nodeDefs[nodeIndex];
            if (nodeDef.mesh !== undefined) {
                if (meshReferences[nodeDef.mesh] === undefined) {
                    meshReferences[nodeDef.mesh] = meshUses[nodeDef.mesh] = 0;
                }
                meshReferences[nodeDef.mesh]++;
                // Nothing in the mesh definition indicates whether it is
                // a SkinnedMesh or Mesh. Use the node's mesh reference
                // to mark SkinnedMesh if node has skin.
                if (nodeDef.skin !== undefined) {
                    meshDefs[nodeDef.mesh].isSkinnedMesh = true;
                }
            }
        }
        this.json.meshReferences = meshReferences;
        this.json.meshUses = meshUses;
    };
    /**
     * Requests the specified dependency asynchronously, with caching.
     * @param {string} type
     * @param {number} index
     * @return {Promise<Object>}
     */
    GLTFParser.prototype.getDependency = function (type, index) {
        var cacheKey = type + ':' + index;
        var dependency = this.cache.get(cacheKey);
        if (!dependency) {
            var fnName = 'load' + type.charAt(0).toUpperCase() + type.slice(1);
            dependency = this[fnName](index);
            this.cache.add(cacheKey, dependency);
        }
        return dependency;
    };
    /**
     * Requests all dependencies of the specified type asynchronously, with caching.
     * @param {string} type
     * @return {Promise<Array<Object>>}
     */
    GLTFParser.prototype.getDependencies = function (type) {
        var dependencies = this.cache.get(type);
        if (!dependencies) {
            var parser = this;
            var defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || [];
            dependencies = Promise.all(defs.map(function (def, index) {
                return parser.getDependency(type, index);
            }));
            this.cache.add(type, dependencies);
        }
        return dependencies;
    };
    /**
     * Requests all multiple dependencies of the specified types asynchronously, with caching.
     * @param {Array<string>} types
     * @return {Promise<Object<Array<Object>>>}
     */
    GLTFParser.prototype.getMultiDependencies = function (types) {
        var results = {};
        var pendings = [];
        for (var i = 0, il = types.length; i < il; i++) {
            var type = types[i];
            var value = this.getDependencies(type);
            value = value.then(function (key, value) {
                results[key] = value;
            }.bind(this, type + (type === 'mesh' ? 'es' : 's')));
            pendings.push(value);
        }
        return Promise.all(pendings).then(function () {
            return results;
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
     * @param {number} bufferIndex
     * @return {Promise<ArrayBuffer>}
     */
    GLTFParser.prototype.loadBuffer = function (bufferIndex) {
        var bufferDef = this.json.buffers[bufferIndex];
        var loader = this.fileLoader;
        if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
            throw new Error('THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.');
        }
        // If present, GLB container is required to be the first buffer.
        if (bufferDef.uri === undefined && bufferIndex === 0) {
            return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
        }
        var options = this.options;
        return new Promise(function (resolve, reject) {
            loader.load(resolveURL(bufferDef.uri, options.path), resolve, undefined, function () {
                reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
            });
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
     * @param {number} bufferViewIndex
     * @return {Promise<ArrayBuffer>}
     */
    GLTFParser.prototype.loadBufferView = function (bufferViewIndex) {
        var bufferViewDef = this.json.bufferViews[bufferViewIndex];
        return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {
            var byteLength = bufferViewDef.byteLength || 0;
            var byteOffset = bufferViewDef.byteOffset || 0;
            return buffer.slice(byteOffset, byteOffset + byteLength);
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
     * @param {number} accessorIndex
     * @return {Promise<THREE.BufferAttribute|THREE.InterleavedBufferAttribute>}
     */
    GLTFParser.prototype.loadAccessor = function (accessorIndex) {
        var parser = this;
        var json = this.json;
        var accessorDef = this.json.accessors[accessorIndex];
        if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
            // Ignore empty accessors, which may be used to declare runtime
            // information about attributes coming from another source (e.g. Draco
            // compression extension).
            return null;
        }
        var pendingBufferViews = [];
        if (accessorDef.bufferView !== undefined) {
            pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView));
        } else {
            pendingBufferViews.push(null);
        }
        if (accessorDef.sparse !== undefined) {
            pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.indices.bufferView));
            pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.values.bufferView));
        }
        return Promise.all(pendingBufferViews).then(function (bufferViews) {
            var bufferView = bufferViews[0];
            var itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
            var TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
            // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
            var elementBytes = TypedArray.BYTES_PER_ELEMENT;
            var itemBytes = elementBytes * itemSize;
            var byteOffset = accessorDef.byteOffset || 0;
            var byteStride = json.bufferViews[accessorDef.bufferView].byteStride;
            var normalized = accessorDef.normalized === true;
            var array, bufferAttribute;
            // The buffer is not interleaved if the stride is the item size in bytes.
            if (byteStride && byteStride !== itemBytes) {
                var ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType;
                var ib = parser.cache.get(ibCacheKey);
                if (!ib) {
                    // Use the full buffer if it's interleaved.
                    array = new TypedArray(bufferView);
                    // Integer parameters to IB/IBA are in array elements, not bytes.
                    ib = new THREE.InterleavedBuffer(array, byteStride / elementBytes);
                    parser.cache.add(ibCacheKey, ib);
                }
                bufferAttribute = new THREE.InterleavedBufferAttribute(ib, itemSize, byteOffset / elementBytes, normalized);
            } else {
                if (bufferView === null) {
                    array = new TypedArray(accessorDef.count * itemSize);
                } else {
                    array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
                }
                bufferAttribute = new THREE.BufferAttribute(array, itemSize, normalized);
            }
            // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
            if (accessorDef.sparse !== undefined) {
                var itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
                var TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
                var byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
                var byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
                var sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
                var sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
                if (bufferView !== null) {
                    // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
                    bufferAttribute.setArray(bufferAttribute.array.slice());
                }
                for (var i = 0, il = sparseIndices.length; i < il; i++) {
                    var index = sparseIndices[i];
                    bufferAttribute.setX(index, sparseValues[i * itemSize]);
                    if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
                    if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
                    if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
                    if (itemSize >= 5) throw new Error('THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.');
                }
            }
            return bufferAttribute;
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
     * @param {number} textureIndex
     * @return {Promise<THREE.Texture>}
     */
    GLTFParser.prototype.loadTexture = function (textureIndex) {
        var parser = this;
        var json = this.json;
        var options = this.options;
        var textureLoader = this.textureLoader;
        var URL = window.URL || window.webkitURL;
        var textureDef = json.textures[textureIndex];
        var source = json.images[textureDef.source];
        var sourceURI = source.uri;
        var isObjectURL = false;
        if (source.bufferView !== undefined) {
            // Load binary image data from bufferView, if provided.
            sourceURI = parser.getDependency('bufferView', source.bufferView).then(function (bufferView) {
                isObjectURL = true;
                var blob = new Blob([bufferView], {
                    type: source.mimeType
                });
                sourceURI = URL.createObjectURL(blob);
                return sourceURI;
            });
        }
        return Promise.resolve(sourceURI).then(function (sourceURI) {
            // Load Texture resource.
            var loader = THREE.Loader.Handlers.get(sourceURI) || textureLoader;
            return new Promise(function (resolve, reject) {
                loader.load(resolveURL(sourceURI, options.path), resolve, undefined, reject);
            });
        }).then(function (texture) {
            // Clean up resources and configure Texture.
            if (isObjectURL === true) {
                URL.revokeObjectURL(sourceURI);
            }
            texture.flipY = false;
            if (textureDef.name !== undefined) texture.name = textureDef.name;
            texture.format = textureDef.format !== undefined ? WEBGL_TEXTURE_FORMATS[textureDef.format] : THREE.RGBAFormat;
            if (textureDef.internalFormat !== undefined && texture.format !== WEBGL_TEXTURE_FORMATS[textureDef.internalFormat]) {
                console.warn('THREE.GLTFLoader: Three.js does not support texture internalFormat which is different from texture format. ' +
                    'internalFormat will be forced to be the same value as format.');
            }
            texture.type = textureDef.type !== undefined ? WEBGL_TEXTURE_DATATYPES[textureDef.type] : THREE.UnsignedByteType;
            var samplers = json.samplers || {};
            var sampler = samplers[textureDef.sampler] || {};
            texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || THREE.LinearFilter;
            texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || THREE.LinearMipMapLinearFilter;
            texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || THREE.RepeatWrapping;
            texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || THREE.RepeatWrapping;
            return texture;
        });
    };
    /**
     * Asynchronously assigns a texture to the given material parameters.
     * @param {Object} materialParams
     * @param {string} textureName
     * @param {number} textureIndex
     * @return {Promise}
     */
    GLTFParser.prototype.assignTexture = function (materialParams, textureName, textureIndex) {
        return this.getDependency('texture', textureIndex).then(function (texture) {
            materialParams[textureName] = texture;
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
     * @param {number} materialIndex
     * @return {Promise<THREE.Material>}
     */
    GLTFParser.prototype.loadMaterial = function (materialIndex) {
        var parser = this;
        var json = this.json;
        var extensions = this.extensions;
        var materialDef = this.json.materials[materialIndex];
        var materialType;
        var materialParams = {};
        var materialExtensions = materialDef.extensions || {};
        var pending = [];
        if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
            var sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
            materialType = sgExtension.getMaterialType(materialDef);
            pending.push(sgExtension.extendParams(materialParams, materialDef, parser));
        } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
            var kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
            materialType = kmuExtension.getMaterialType(materialDef);
            pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
        } else if (materialDef.pbrMetallicRoughness !== undefined) {
            // Specification:
            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material
            materialType = THREE.MeshStandardMaterial;
            var metallicRoughness = materialDef.pbrMetallicRoughness;
            materialParams.color = new THREE.Color(1.0, 1.0, 1.0);
            materialParams.opacity = 1.0;
            if (Array.isArray(metallicRoughness.baseColorFactor)) {
                var array = metallicRoughness.baseColorFactor;
                materialParams.color.fromArray(array);
                materialParams.opacity = array[3];
            }
            if (metallicRoughness.baseColorTexture !== undefined) {
                pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture.index));
            }
            materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
            materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;
            if (metallicRoughness.metallicRoughnessTexture !== undefined) {
                var textureIndex = metallicRoughness.metallicRoughnessTexture.index;
                pending.push(parser.assignTexture(materialParams, 'metalnessMap', textureIndex));
                pending.push(parser.assignTexture(materialParams, 'roughnessMap', textureIndex));
            }
        } else {
            materialType = THREE.MeshPhongMaterial;
        }
        if (materialDef.doubleSided === true) {
            materialParams.side = THREE.DoubleSide;
        }
        var alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
        if (alphaMode === ALPHA_MODES.BLEND) {
            materialParams.transparent = true;
        } else {
            materialParams.transparent = false;
            if (alphaMode === ALPHA_MODES.MASK) {
                materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;
            }
        }
        if (materialDef.normalTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
            pending.push(parser.assignTexture(materialParams, 'normalMap', materialDef.normalTexture.index));
            materialParams.normalScale = new THREE.Vector2(1, 1);
            if (materialDef.normalTexture.scale !== undefined) {
                materialParams.normalScale.set(materialDef.normalTexture.scale, materialDef.normalTexture.scale);
            }
        }
        if (materialDef.occlusionTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
            pending.push(parser.assignTexture(materialParams, 'aoMap', materialDef.occlusionTexture.index));
            if (materialDef.occlusionTexture.strength !== undefined) {
                materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
            }
        }
        if (materialDef.emissiveFactor !== undefined && materialType !== THREE.MeshBasicMaterial) {
            materialParams.emissive = new THREE.Color().fromArray(materialDef.emissiveFactor);
        }
        if (materialDef.emissiveTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
            pending.push(parser.assignTexture(materialParams, 'emissiveMap', materialDef.emissiveTexture.index));
        }
        return Promise.all(pending).then(function () {
            var material;
            if (materialType === THREE.ShaderMaterial) {
                material = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(materialParams);
            } else {
                material = new materialType(materialParams);
            }
            if (materialDef.name !== undefined) material.name = materialDef.name;
            // Normal map textures use OpenGL conventions:
            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#materialnormaltexture
            if (material.normalScale) {
                material.normalScale.x = -material.normalScale.x;
            }
            // emissiveTexture and baseColorTexture use sRGB encoding.
            if (material.map) material.map.encoding = THREE.sRGBEncoding;
            if (material.emissiveMap) material.emissiveMap.encoding = THREE.sRGBEncoding;
            if (materialDef.extras) material.userData = materialDef.extras;
            return material;
        });
    };
    /**
     * @param  {THREE.BufferGeometry} geometry
     * @param  {GLTF.Primitive} primitiveDef
     * @param  {Array<THREE.BufferAttribute>} accessors
     */
    function addPrimitiveAttributes(geometry, primitiveDef, accessors) {
        var attributes = primitiveDef.attributes;
        for (var gltfAttributeName in attributes) {
            var threeAttributeName = ATTRIBUTES[gltfAttributeName];
            var bufferAttribute = accessors[attributes[gltfAttributeName]];
            // Skip attributes already provided by e.g. Draco extension.
            if (!threeAttributeName) continue;
            if (threeAttributeName in geometry.attributes) continue;
            geometry.addAttribute(threeAttributeName, bufferAttribute);
        }
        if (primitiveDef.indices !== undefined && !geometry.index) {
            geometry.setIndex(accessors[primitiveDef.indices]);
        }
    }
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
     * @param {Array<Object>} primitives
     * @return {Promise<Array<THREE.BufferGeometry>>}
     */
    GLTFParser.prototype.loadGeometries = function (primitives) {
        var parser = this;
        var extensions = this.extensions;
        var cache = this.primitiveCache;
        return this.getDependencies('accessor').then(function (accessors) {
            var geometries = [];
            var pending = [];
            for (var i = 0, il = primitives.length; i < il; i++) {
                var primitive = primitives[i];
                // See if we've already created this geometry
                var cached = getCachedGeometry(cache, primitive);
                var geometry;
                if (cached) {
                    // Use the cached geometry if it exists
                    pending.push(cached.then(function (geometry) {
                        geometries.push(geometry);
                    }));
                } else if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
                    // Use DRACO geometry if available
                    var geometryPromise = extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
                        .decodePrimitive(primitive, parser)
                        .then(function (geometry) {
                            addPrimitiveAttributes(geometry, primitive, accessors);
                            geometries.push(geometry);
                            return geometry;
                        });
                    cache.push({
                        primitive: primitive,
                        promise: geometryPromise
                    });
                    pending.push(geometryPromise);
                } else {
                    // Otherwise create a new geometry
                    geometry = new THREE.BufferGeometry();
                    addPrimitiveAttributes(geometry, primitive, accessors);
                    // Cache this geometry
                    cache.push({
                        primitive: primitive,
                        promise: Promise.resolve(geometry)
                    });
                    geometries.push(geometry);
                }
            }
            return Promise.all(pending).then(function () {
                return geometries;
            });
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
     * @param {number} meshIndex
     * @return {Promise<THREE.Group|THREE.Mesh|THREE.SkinnedMesh>}
     */
    GLTFParser.prototype.loadMesh = function (meshIndex) {
        var scope = this;
        var json = this.json;
        var extensions = this.extensions;
        var meshDef = this.json.meshes[meshIndex];
        return this.getMultiDependencies([
            'accessor',
            'material'
        ]).then(function (dependencies) {
            var group = new THREE.Group();
            var primitives = meshDef.primitives;
            return scope.loadGeometries(primitives).then(function (geometries) {
                for (var i = 0, il = primitives.length; i < il; i++) {
                    var primitive = primitives[i];
                    var geometry = geometries[i];
                    var material = primitive.material === undefined ?
                        createDefaultMaterial() :
                        dependencies.materials[primitive.material];
                    if (material.aoMap &&
                        geometry.attributes.uv2 === undefined &&
                        geometry.attributes.uv !== undefined) {
                        console.log('THREE.GLTFLoader: Duplicating UVs to support aoMap.');
                        geometry.addAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
                    }
                    // If the material will be modified later on, clone it now.
                    var useVertexColors = geometry.attributes.color !== undefined;
                    var useFlatShading = geometry.attributes.normal === undefined;
                    var useSkinning = meshDef.isSkinnedMesh === true;
                    var useMorphTargets = primitive.targets !== undefined;
                    if (useVertexColors || useFlatShading || useSkinning || useMorphTargets) {
                        if (material.isGLTFSpecularGlossinessMaterial) {
                            var specGlossExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
                            material = specGlossExtension.cloneMaterial(material);
                        } else {
                            material = material.clone();
                        }
                    }
                    if (useVertexColors) {
                        material.vertexColors = THREE.VertexColors;
                        material.needsUpdate = true;
                    }
                    if (useFlatShading) {
                        material.flatShading = true;
                    }
                    var mesh;
                    if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
                        primitive.mode === undefined) {
                        if (useSkinning) {
                            mesh = new THREE.SkinnedMesh(geometry, material);
                            material.skinning = true;
                        } else {
                            mesh = new THREE.Mesh(geometry, material);
                        }
                        if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                            mesh.drawMode = THREE.TriangleStripDrawMode;
                        } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                            mesh.drawMode = THREE.TriangleFanDrawMode;
                        }
                    } else if (primitive.mode === WEBGL_CONSTANTS.LINES ||
                        primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ||
                        primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
                        var cacheKey = 'LineBasicMaterial:' + material.uuid;
                        var lineMaterial = scope.cache.get(cacheKey);
                        if (!lineMaterial) {
                            lineMaterial = new THREE.LineBasicMaterial();
                            THREE.Material.prototype.copy.call(lineMaterial, material);
                            lineMaterial.color.copy(material.color);
                            lineMaterial.lights = false; // LineBasicMaterial doesn't support lights yet
                            scope.cache.add(cacheKey, lineMaterial);
                        }
                        material = lineMaterial;
                        if (primitive.mode === WEBGL_CONSTANTS.LINES) {
                            mesh = new THREE.LineSegments(geometry, material);
                        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
                            mesh = new THREE.Line(geometry, material);
                        } else {
                            mesh = new THREE.LineLoop(geometry, material);
                        }
                    } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
                        var cacheKey = 'PointsMaterial:' + material.uuid;
                        var pointsMaterial = scope.cache.get(cacheKey);
                        if (!pointsMaterial) {
                            pointsMaterial = new THREE.PointsMaterial();
                            THREE.Material.prototype.copy.call(pointsMaterial, material);
                            pointsMaterial.color.copy(material.color);
                            pointsMaterial.map = material.map;
                            pointsMaterial.lights = false; // PointsMaterial doesn't support lights yet
                            scope.cache.add(cacheKey, pointsMaterial);
                        }
                        material = pointsMaterial;
                        mesh = new THREE.Points(geometry, material);
                    } else {
                        throw new Error('THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode);
                    }
                    mesh.name = meshDef.name || ('mesh_' + meshIndex);
                    if (useMorphTargets) {
                        addMorphTargets(mesh, meshDef, primitive, dependencies.accessors);
                    }
                    if (meshDef.extras !== undefined) mesh.userData = meshDef.extras;
                    if (primitive.extras !== undefined) mesh.geometry.userData = primitive.extras;
                    // for Specular-Glossiness.
                    if (material.isGLTFSpecularGlossinessMaterial === true) {
                        mesh.onBeforeRender = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].refreshUniforms;
                    }
                    if (primitives.length > 1) {
                        mesh.name += '_' + i;
                        group.add(mesh);
                    } else {
                        return mesh;
                    }
                }
                return group;
            });
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
     * @param {number} cameraIndex
     * @return {Promise<THREE.Camera>}
     */
    GLTFParser.prototype.loadCamera = function (cameraIndex) {
        var camera;
        var cameraDef = this.json.cameras[cameraIndex];
        var params = cameraDef[cameraDef.type];
        if (!params) {
            console.warn('THREE.GLTFLoader: Missing camera parameters.');
            return;
        }
        if (cameraDef.type === 'perspective') {
            var aspectRatio = params.aspectRatio || 1;
            var xfov = params.yfov * aspectRatio;
            camera = new THREE.PerspectiveCamera(THREE.Math.radToDeg(xfov), aspectRatio, params.znear || 1, params.zfar || 2e6);
        } else if (cameraDef.type === 'orthographic') {
            camera = new THREE.OrthographicCamera(params.xmag / -2, params.xmag / 2, params.ymag / 2, params.ymag / -2, params.znear, params.zfar);
        }
        if (cameraDef.name !== undefined) camera.name = cameraDef.name;
        if (cameraDef.extras) camera.userData = cameraDef.extras;
        return Promise.resolve(camera);
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
     * @param {number} skinIndex
     * @return {Promise<Object>}
     */
    GLTFParser.prototype.loadSkin = function (skinIndex) {
        var skinDef = this.json.skins[skinIndex];
        var skinEntry = {
            joints: skinDef.joints
        };
        if (skinDef.inverseBindMatrices === undefined) {
            return Promise.resolve(skinEntry);
        }
        return this.getDependency('accessor', skinDef.inverseBindMatrices).then(function (accessor) {
            skinEntry.inverseBindMatrices = accessor;
            return skinEntry;
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
     * @param {number} animationIndex
     * @return {Promise<THREE.AnimationClip>}
     */
    GLTFParser.prototype.loadAnimation = function (animationIndex) {
        var json = this.json;
        var animationDef = this.json.animations[animationIndex];
        return this.getMultiDependencies([
            'accessor',
            'node'
        ]).then(function (dependencies) {
            var tracks = [];
            for (var i = 0, il = animationDef.channels.length; i < il; i++) {
                var channel = animationDef.channels[i];
                var sampler = animationDef.samplers[channel.sampler];
                if (sampler) {
                    var target = channel.target;
                    var name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
                    var input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input;
                    var output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output;
                    var inputAccessor = dependencies.accessors[input];
                    var outputAccessor = dependencies.accessors[output];
                    var node = dependencies.nodes[name];
                    if (node) {
                        node.updateMatrix();
                        node.matrixAutoUpdate = true;
                        var TypedKeyframeTrack;
                        switch (PATH_PROPERTIES[target.path]) {
                            case PATH_PROPERTIES.weights:
                                TypedKeyframeTrack = THREE.NumberKeyframeTrack;
                                break;
                            case PATH_PROPERTIES.rotation:
                                TypedKeyframeTrack = THREE.QuaternionKeyframeTrack;
                                break;
                            case PATH_PROPERTIES.position:
                            case PATH_PROPERTIES.scale:
                            default:
                                TypedKeyframeTrack = THREE.VectorKeyframeTrack;
                                break;
                        }
                        var targetName = node.name ? node.name : node.uuid;
                        var interpolation = sampler.interpolation !== undefined ? INTERPOLATION[sampler.interpolation] : THREE.InterpolateLinear;
                        var targetNames = [];
                        if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
                            // node should be THREE.Group here but
                            // PATH_PROPERTIES.weights(morphTargetInfluences) should be
                            // the property of a mesh object under node.
                            // So finding targets here.
                            node.traverse(function (object) {
                                if (object.isMesh === true && object.material.morphTargets === true) {
                                    targetNames.push(object.name ? object.name : object.uuid);
                                }
                            });
                        } else {
                            targetNames.push(targetName);
                        }
                        // KeyframeTrack.optimize() will modify given 'times' and 'values'
                        // buffers before creating a truncated copy to keep. Because buffers may
                        // be reused by other tracks, make copies here.
                        for (var j = 0, jl = targetNames.length; j < jl; j++) {
                            var track = new TypedKeyframeTrack(
                                targetNames[j] + '.' + PATH_PROPERTIES[target.path],
                                THREE.AnimationUtils.arraySlice(inputAccessor.array, 0),
                                THREE.AnimationUtils.arraySlice(outputAccessor.array, 0),
                                interpolation
                            );
                            // Here is the trick to enable custom interpolation.
                            // Overrides .createInterpolant in a factory method which creates custom interpolation.
                            if (sampler.interpolation === 'CUBICSPLINE') {
                                track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
                                    // A CUBICSPLINE keyframe in glTF has three output values for each input value,
                                    // representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
                                    // must be divided by three to get the interpolant's sampleSize argument.
                                    return new GLTFCubicSplineInterpolant(this.times, this.values, this.getValueSize() / 3, result);
                                };
                                // Workaround, provide an alternate way to know if the interpolant type is cubis spline to track.
                                // track.getInterpolation() doesn't return valid value for custom interpolant.
                                track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
                            }
                            tracks.push(track);
                        }
                    }
                }
            }
            var name = animationDef.name !== undefined ? animationDef.name : 'animation_' + animationIndex;
            return new THREE.AnimationClip(name, undefined, tracks);
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
     * @param {number} nodeIndex
     * @return {Promise<THREE.Object3D>}
     */
    GLTFParser.prototype.loadNode = function (nodeIndex) {
        var json = this.json;
        var extensions = this.extensions;
        var meshReferences = this.json.meshReferences;
        var meshUses = this.json.meshUses;
        var nodeDef = this.json.nodes[nodeIndex];
        return this.getMultiDependencies([
            'mesh',
            'skin',
            'camera'
        ]).then(function (dependencies) {
            var node;
            if (nodeDef.isBone === true) {
                node = new THREE.Bone();
            } else if (nodeDef.mesh !== undefined) {
                var mesh = dependencies.meshes[nodeDef.mesh];
                node = mesh.clone();
                // for Specular-Glossiness
                if (mesh.isGroup === true) {
                    for (var i = 0, il = mesh.children.length; i < il; i++) {
                        var child = mesh.children[i];
                        if (child.material && child.material.isGLTFSpecularGlossinessMaterial === true) {
                            node.children[i].onBeforeRender = child.onBeforeRender;
                        }
                    }
                } else {
                    if (mesh.material && mesh.material.isGLTFSpecularGlossinessMaterial === true) {
                        node.onBeforeRender = mesh.onBeforeRender;
                    }
                }
                if (meshReferences[nodeDef.mesh] > 1) {
                    node.name += '_instance_' + meshUses[nodeDef.mesh]++;
                }
            } else if (nodeDef.camera !== undefined) {
                node = dependencies.cameras[nodeDef.camera];
            } else if (nodeDef.extensions &&
                nodeDef.extensions[EXTENSIONS.KHR_LIGHTS] &&
                nodeDef.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {
                var lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
                node = lights[nodeDef.extensions[EXTENSIONS.KHR_LIGHTS].light];
            } else {
                node = new THREE.Object3D();
            }
            if (nodeDef.name !== undefined) {
                node.name = THREE.PropertyBinding.sanitizeNodeName(nodeDef.name);
            }
            if (nodeDef.extras) node.userData = nodeDef.extras;
            if (nodeDef.matrix !== undefined) {
                var matrix = new THREE.Matrix4();
                matrix.fromArray(nodeDef.matrix);
                node.applyMatrix(matrix);
            } else {
                if (nodeDef.translation !== undefined) {
                    node.position.fromArray(nodeDef.translation);
                }
                if (nodeDef.rotation !== undefined) {
                    node.quaternion.fromArray(nodeDef.rotation);
                }
                if (nodeDef.scale !== undefined) {
                    node.scale.fromArray(nodeDef.scale);
                }
            }
            return node;
        });
    };
    /**
     * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
     * @param {number} sceneIndex
     * @return {Promise<THREE.Scene>}
     */
    GLTFParser.prototype.loadScene = function () {
        // scene node hierachy builder
        function buildNodeHierachy(nodeId, parentObject, json, allNodes, skins) {
            var node = allNodes[nodeId];
            var nodeDef = json.nodes[nodeId];
            // build skeleton here as well
            if (nodeDef.skin !== undefined) {
                var meshes = node.isGroup === true ? node.children : [node];
                for (var i = 0, il = meshes.length; i < il; i++) {
                    var mesh = meshes[i];
                    var skinEntry = skins[nodeDef.skin];
                    var bones = [];
                    var boneInverses = [];
                    for (var j = 0, jl = skinEntry.joints.length; j < jl; j++) {
                        var jointId = skinEntry.joints[j];
                        var jointNode = allNodes[jointId];
                        if (jointNode) {
                            bones.push(jointNode);
                            var mat = new THREE.Matrix4();
                            if (skinEntry.inverseBindMatrices !== undefined) {
                                mat.fromArray(skinEntry.inverseBindMatrices.array, j * 16);
                            }
                            boneInverses.push(mat);
                        } else {
                            console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', jointId);
                        }
                    }
                    mesh.bind(new THREE.Skeleton(bones, boneInverses), mesh.matrixWorld);
                }
            }
            // build node hierachy
            parentObject.add(node);
            if (nodeDef.children) {
                var children = nodeDef.children;
                for (var i = 0, il = children.length; i < il; i++) {
                    var child = children[i];
                    buildNodeHierachy(child, node, json, allNodes, skins);
                }
            }
        }
        return function loadScene(sceneIndex) {
            var json = this.json;
            var extensions = this.extensions;
            var sceneDef = this.json.scenes[sceneIndex];
            return this.getMultiDependencies([
                'node',
                'skin'
            ]).then(function (dependencies) {
                var scene = new THREE.Scene();
                if (sceneDef.name !== undefined) scene.name = sceneDef.name;
                if (sceneDef.extras) scene.userData = sceneDef.extras;
                var nodeIds = sceneDef.nodes || [];
                for (var i = 0, il = nodeIds.length; i < il; i++) {
                    buildNodeHierachy(nodeIds[i], scene, json, dependencies.nodes, dependencies.skins);
                }
                // Ambient lighting, if present, is always attached to the scene root.
                if (sceneDef.extensions &&
                    sceneDef.extensions[EXTENSIONS.KHR_LIGHTS] &&
                    sceneDef.extensions[EXTENSIONS.KHR_LIGHTS].light !== undefined) {
                    var lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
                    scene.add(lights[sceneDef.extensions[EXTENSIONS.KHR_LIGHTS].light]);
                }
                return scene;
            });
        };
    }();
    return GLTFLoader;
})();

//GltfLoader.js end

//PointerLockControls.js

THREE.PointerLockControls = function (camera) {
    this.pixelToRotation = 0.002;
    this.minRotateX = Math.PI / 6.0;
    this.maxRotateX = -Math.PI / 4.9; //-Math.PI/4.0;
    var scope = this;
    this.enabled = false;
    this.enableZoom = true;
    this.enableDamping = true;
    this.keepMove = false;
    this.curVelX = 1.0;
    this.curVelY = 1.0;
    this.dampingFactor = 0.03;
    this.clock = new THREE.Clock();
    this.timeDelta = 0.1;
    this.bouncingStep = 0.1;
    this.bouncePoint = new THREE.Vector3();
    this.bounceDir = new THREE.Vector3();
    this.bounceLock=false;
    this.bouncingCount = 20;
    this.bouncingTime = 0;
    this.bouncing = false;
    this.prohibitionMoveAndClick = false;
    camera.rotation.set(0, 0, 0);
    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);
    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add(pitchObject);
    var PI_3 = Math.PI / 3;
    var PI_4 = Math.PI / 4;
    var PI_5 = Math.PI / 5;
    var PI_6 = Math.PI / 6;

    var onMouseMove = function (event) {
        
        if (scope.enabled === false) return;
        if (!cameraController.isEnableRotate()) return;
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        yawObject.rotation.y += movementX * scope.pixelToRotation;
        pitchObject.rotation.x += movementY * scope.pixelToRotation;       
        scope.timeDelta = scope.clock.getDelta();
        scope.curVelX = movementY * scope.pixelToRotation / scope.timeDelta;
        scope.curVelY = movementX * scope.pixelToRotation / scope.timeDelta;
        pitchObject.rotation.x = Math.max( - PI_3, Math.min(PI_6, pitchObject.rotation.x ) );
         //pitchObject.rotation.x = Math.max(scope.maxRotateX, Math.min(scope.minRotateX, pitchObject.rotation.x));
    };
    var speed,dx,ux,dt,ut,recordPos;
    
    var onMouseDown = function (event) {

        scope.keepMove = false;
        
        if(!isMobile){
            
            dx=event.clientX;
            dt=(new Date()).getTime();
            recordPos=yawObject.rotation.y;
        }
    
    };
    var onMouseUp = function (event) {
        
        scope.keepMove = true;
        if(!isMobile){
            
            ux=event.clientX;
            ut=(new Date()).getTime();
            // if()
            speed=((ux-dx)/(ut-dt))/200;
           var timer= setInterval(function(){
                speed=speed*0.99;
                if(speed){
                    // camera.rotation.y+=speed;
                    yawObject.rotation.y+=speed;
                }
                else{
                    clearInterval(timer)
                }
                if((speed>0&&speed<=0.00015||(speed<0&&speed>=-0.00015))){
                    clearInterval(timer)
                }
    
            },1)
         
        }
 

    };
    var onMouseWheel = function (event) {
        // if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;
        event.preventDefault();
        event.stopPropagation();
        handleMouseWheel(event);
    };

    function handleMouseWheel(e) {
        e.preventDefault();
        // if(camera.fov<=35||camera.fov<=95){
        //     camera.fov=36
        // }
        //e.stopPropagation();
        // if(targetMoved)

        if (targetMoved) {
            if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件
                if (e.wheelDelta > 0) { //当滑轮向上滚动时
                    if (camera.fov >= 30) {
                        camera.fov -= 1;
                    }
                } else { //当滑轮向下滚动时
                    if (camera.fov <= 100) {
                        camera.fov += 1;
                    }
                }
            } else if (e.detail) { //Firefox滑轮事件
                if (e.detail > 0) { //当滑轮向上滚动时
                    if (camera.fov >= 30) {
                        camera.fov -= 1;
                    }
                } else { //当滑轮向下滚动时
                    if (camera.fov <= 100) {
                        camera.fov += 1;
                    }
                }
            }
            //改变fov值，并更新场景的渲染
            // camera.fov = fov;
            camera.updateProjectionMatrix();
            
            renderer.render(scene, camera);
        }
    };
    // this.bounce = function(curPoint, mousePoint) {
    //     if (scope.bouncingTime > 0 && scope.bouncingTime < 20) {
    //         return;
    //     }
    //     var bounceDir = new THREE.Vector3();
    //     bounceDir.subVectors(mousePoint, curPoint);
    //     scope.bouncingStep = bounceDir.length() / 800.0;
    //     bounceDir.normalize();
    //     scope.bouncePoint = curPoint;
    //     scope.bounceDir = bounceDir;
    //     scope.bouncing = true;
    //     scope.bouncingTime = 0;
    // }

    this.bounce = function (curPoint, mousePoint) {
        //Wall collision
        var scope=this;
        scope.bounceLock=true;
        var recordFov = camera.fov; //记录此时的recordFov,因为可能由于滚轮或者双指改变
        var timer1;
        var timer2;
        clearInterval(timer1);
        clearInterval(timer2);
        var timer1 = setInterval(function () {
            camera.fov -= 1;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            if (camera.fov <= recordFov - 3) {
                clearInterval(timer1);
                timer2 = setInterval(function () {
                    camera.fov += 0.1;
                    if (camera.fov >= recordFov) {
                        clearInterval(timer2);
                        camera.fov = recordFov;
                        scope.bounceLock=false;
                    }
                    camera.updateProjectionMatrix();
                    renderer.render(scene, camera);
                }, 25)
            }
        }, 25)
    };
    
    this.update = function () {
        if (scope.keepMove) {
            // var xmoving = true;
            // var ymoving = true;
            // if (scope.curVelY < 0.001 && scope.curVelY > -0.001) {
            //     scope.curVelY = 0.0;
            //     ymoving = false;
            // } else {
            //     scope.curVelY = scope.curVelY * (1.0 - scope.dampingFactor);
            // }

            // if (scope.curVelX < 0.001 && scope.curVelX > -0.001) {
            //     scope.curVelX = 0.0;
            //     xmoving = false;
            // } else {
            //     scope.curVelX = scope.curVelX * (1.0 - scope.dampingFactor);
            // }
            // if (xmoving == false && ymoving == false) {
            //     scope.keepMove = false;
            // }
            // scope.timeDelta = scope.clock.getDelta();
            // if(scope.curVelY<0&&scope.curVelY<=-10){
            //     scope.curVelY=-10
            // }
            // if(scope.curVelY>0&&scope.curVelY>=10){
            //     scope.curVelY=10
            // }
            //     yawObject.rotation.y += (scope.curVelY * scope.timeDelta)/2;

            // pitchObject.rotation.x += scope.curVelX * scope.timeDelta;
            // pitchObject.rotation.x = Math.max(scope.maxRotateX, Math.min(scope.minRotateX, pitchObject.rotation.x));
        }
        // if (scope.bouncing) {
        //     //console.log("scope.bouncingTime"+scope.bouncingTime);
        //     //console.log("scope step = "+scope.bouncingStep );
        //     //console.log("scope dir x = "+scope.bounceDir.x+" y="+scope.bounceDir.y+" z=" + scope.bounceDir.z);
        //     if (scope.bouncingTime <= 10) {
        //         var curPos = new THREE.Vector3();
        //         curPos.x = scope.bouncingStep * scope.bounceDir.x;
        //         curPos.y = scope.bouncingStep * scope.bounceDir.y;
        //         curPos.z = scope.bouncingStep * scope.bounceDir.z;
        //         //console.log("curPos x = "+curPos.x+" y="+curPos.y+" z=" + curPos.z);
        //         yawObject.position.x += curPos.x;
        //         yawObject.position.y += curPos.y;
        //         yawObject.position.z += curPos.z;
        //         //console.log("yawObject position x="+ yawObject.position.x+ " y= "+ yawObject.position.y + " z= "+ yawObject.position.z);
        //     } else {
        //         var curPos = new THREE.Vector3();
        //         curPos.x = scope.bouncingStep * scope.bounceDir.x;
        //         curPos.y = scope.bouncingStep * scope.bounceDir.y;
        //         curPos.z = scope.bouncingStep * scope.bounceDir.z;
        //         //console.log("curPos x = "+curPos.x+" y="+curPos.y+" z=" + curPos.z);
        //         yawObject.position.x -= curPos.x;
        //         yawObject.position.y -= curPos.y;
        //         yawObject.position.z -= curPos.z;
        //         //console.log("yawObject position x="+ yawObject.position.x+ " y= "+ yawObject.position.y + " z= "+ yawObject.position.z);
        //     }
        //     scope.bouncingTime += 1;
        //     if (scope.bouncingTime >= 20) {
        //         scope.bouncing = false;
        //         scope.bouncingTime = 0;
        //     }
        // }
    }
    this.touchX = this.touchY = 0;
    var touchStartX;
    var pageX, pageY, initX, initY, isTouch = false;
    var start = [];
    var onTouchStart = function (event) {
        // scope.touchX = event.changedTouches[0].clientX;
        // scope.touchY = event.changedTouches[0].clientY;
        // scope.keepMove = false;
        // scope.timeDelta = scope.clock.getDelta();
        pageX = event.targetTouches[0].pageX;
        pageY = event.targetTouches[0].pageY;
        //初始位置的X，Y 坐标  
        initX = event.target.offsetLeft;
        initY = event.target.offsetTop;
        scope.touchX = event.changedTouches[0].clientX;
        scope.touchY = event.changedTouches[0].clientY;
        touchStartX = event.changedTouches[0].clientX;
        scope.keepMove = false;
        scope.timeDelta = scope.clock.getDelta();
        if (event.touches.length == 2) {
            start = event.touches; //得到第一组两个点
        }
        isTouch = true;
        dx=scope.touchX;
        dt=(new Date()).getTime();
        recordPos=yawObject.rotation.y;
    };
    function getDistance(p1, p2) {
        var x = p2.pageX - p1.pageX,
            y = p2.pageY - p1.pageY;
        return Math.sqrt((x * x) + (y * y));
    };
    var onTouchMove = function (event) {
        if (event.touches.length == 1 && isTouch) {
            //if ( scope.enabled === false ) return;
            // event.preventDefault();
            // 判断默认行为是否可以被禁用
            // if (event.cancelable) {
            //     // 判断默认行为是否已经被禁用
            //     if (!event.defaultPrevented) {
            //         event.preventDefault();
            //     }
            // }
            // event.stopPropagation();
            // event.preventDefault();
            // event.stopPropagation();
            if (!cameraController.isEnableRotate()) return;

            yawObject.rotation.y += (event.changedTouches[0].clientX - scope.touchX) * scope.pixelToRotation * 1; //21081123修改触摸屏滑动参数；
            pitchObject.rotation.x += (event.changedTouches[0].clientY - scope.touchY) * scope.pixelToRotation * 1; //21081123修改触摸屏滑动参数；
            //pitchObject.rotation.x = Math.max( - PI_3, Math.min(PI_6, pitchObject.rotation.x ) );
            pitchObject.rotation.x = Math.max(scope.maxRotateX, Math.min(scope.minRotateX, pitchObject.rotation.x));
            scope.timeDelta = scope.clock.getDelta();
            scope.curVelY = ((event.changedTouches[0].clientX - scope.touchX) * scope.pixelToRotation * 4) / scope.timeDelta;
            scope.curVelX = ((event.changedTouches[0].clientY - scope.touchY) * scope.pixelToRotation * 3) / scope.timeDelta;
            scope.touchX = event.changedTouches[0].clientX;
            scope.touchY = event.changedTouches[0].clientY;
        }
        if (event.touches.length >= 2 && isTouch) {
            // var now = event.touches;
            // var scale = (getDistance(now[0], now[1]) / getDistance(start[0], start[1]));
            // event.scale = scale.toFixed(2);
            // if (targetMoved) {
            //     if (scale > 1) {
            //         if (camera.fov >= 25) {
            //             camera.fov -= .8;
            //         }
            //     } else {
            //         if (camera.fov <= 105) {
            //             camera.fov += .8;
            //         }
            //     }
            //     //改变fov值，并更新场景的渲染
            //     // camera.fov = fov;
            //     camera.updateProjectionMatrix();
                
            //     renderer.render(scene, camera);
            // }
        }
    };
    
    var onTouchEnd = function (event) {
        if (isTouch) {
            isTouch = false;
        }
        scope.touchX = event.changedTouches[0].clientX;
        scope.touchY = event.changedTouches[0].clientY;
        // if (Math.abs(scope.touchX - touchStartX) < 100) {
        //     return
        // }
        scope.keepMove = true;
        ux=scope.touchX;
        ut=(new Date()).getTime();
        // if()
        speed=((ux-dx)/(ut-dt))/80;

      var timer= setInterval(function(){
            speed=speed*0.99;

            if(speed){
                yawObject.rotation.y+=speed;

            }
            else{
                clearInterval(timer)
            }
            if((speed>0&&speed<=0.0001||(speed<0&&speed>=-0.0001))){
                clearInterval(timer)
            }

        },1)
    };
    this.dispose = function () {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        document.removeEventListener('mousedown', onMouseDown, false);
        document.removeEventListener('touchstart', onTouchStart, false);
        document.removeEventListener('touchmove', onTouchMove, false);
        document.removeEventListener('touchend', onTouchEnd, false);
    };
    document.addEventListener('touchstart', onTouchStart,  {
        passive: false
    });
    //document.addEventListener( 'touchmove', onTouchMove, false);
    document.addEventListener('touchmove', onTouchMove,  {
        passive: false
    });
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('touchend', onTouchEnd,  {
        passive: false
    });


    this.enabled = false;
    this.getObject = function () {

        return yawObject;
    };
    this.getDirection = function () {
        // assumes the camera itself is not rotated
        var direction = new THREE.Vector3(0, 0, -1);
        var rotation = new THREE.Euler(0, 0, 0, "YXZ");
        return function (v) {
            rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
            v.copy(direction).applyEuler(rotation);
            return v;
        };
    }();
};

//PointerLockControls.js end

//OrbitControls.js

var orthoCameraRotation = true;
THREE.OrbitControls = function (object, domElement) {
    this.object = object;
    this.domElement = (domElement !== undefined) ? domElement : document;
    // Set to false to disable this control
    this.enabled = true;
    // "target" sets the location of focus, where the object orbits around
    this.target = new THREE.Vector3();
    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;
    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;
    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians
    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.minAzimuthAngle = -Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians
    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = true;
    this.dampingFactor = 0.25;
    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    this.enableZoom = true;
    this.zoomSpeed = 1.0;
    // Set to false to disable rotating
    this.enableRotate = true;
    this.rotateSpeed = 1.0;
    // Set to false to disable panning
    this.enablePan = true;
    this.panSpeed = 1.0;
    this.screenSpacePanning = false; // if true, pan in screen-space
    this.keyPanSpeed = 7.0; // pixels moved per arrow key push
    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    this.autoRotate = false;
    this.autoRotateSpeed = 0.5; // 30 seconds per round when fps is 60
    // Set to false to disable use of the keys
    this.enableKeys = true;
    // The four arrow keys
    this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40
    };
    // Mouse buttons
    this.mouseButtons = {
        LEFT: THREE.MOUSE.LEFT,
        MIDDLE: THREE.MOUSE.MIDDLE,
        RIGHT: THREE.MOUSE.RIGHT
    };
    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;
    //
    // public methods
    //
    this.getPolarAngle = function () {
        return spherical.phi;
    };
    this.getAzimuthalAngle = function () {
        return spherical.theta;
    };
    this.saveState = function () {
        scope.target0.copy(scope.target);
        scope.position0.copy(scope.object.position);
        scope.zoom0 = scope.object.zoom;
    };
    this.reset = function () {
        scope.target.copy(scope.target0);
        scope.object.position.copy(scope.position0);
        scope.object.zoom = scope.zoom0;
        scope.object.updateProjectionMatrix();
        scope.dispatchEvent(changeEvent);
        scope.update();
        state = STATE.NONE;
    };
    // this method is exposed, but perhaps it would be better if we can make it private...
    this.update = function () {
        var offset = new THREE.Vector3();
        // so camera.up is the orbit axis
        var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
        var quatInverse = quat.clone().inverse();
        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();
        return function update() {
            var position = scope.object.position;
            offset.copy(position).sub(scope.target);
            // rotate offset to "y-axis-is-up" space
            offset.applyQuaternion(quat);
            // angle from z-axis around y-axis
            spherical.setFromVector3(offset);
            if (scope.autoRotate && state === STATE.NONE) {
                rotateLeft(getAutoRotationAngle());
            }
            spherical.theta += sphericalDelta.theta;
            spherical.phi += sphericalDelta.phi;
            // restrict theta to be between desired limits
            spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));
            // restrict phi to be between desired limits
            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
            spherical.makeSafe();
            spherical.radius *= scale;
            // restrict radius to be between desired limits
            spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
            // move target to panned location
            scope.target.add(panOffset);
            offset.setFromSpherical(spherical);
            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion(quatInverse);
            position.copy(scope.target).add(offset);
            scope.object.lookAt(scope.target);
            if (scope.enableDamping === true) {
                sphericalDelta.theta *= (1 - scope.dampingFactor);
                sphericalDelta.phi *= (1 - scope.dampingFactor);
                panOffset.multiplyScalar(1 - scope.dampingFactor);
            } else {
                sphericalDelta.set(0, 0, 0);
                panOffset.set(0, 0, 0);
            }
            scale = 1;
            // update condition is:
            // min(camera displacement, camera rotation in radians)^2 > EPS
            // using small-angle approximation cos(x/2) = 1 - x^2 / 8
            if (zoomChanged ||
                lastPosition.distanceToSquared(scope.object.position) > EPS ||
                8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
                scope.dispatchEvent(changeEvent);
                lastPosition.copy(scope.object.position);
                lastQuaternion.copy(scope.object.quaternion);
                zoomChanged = false;
                return true;
            }
            return false;
        };
    }();
    this.dispose = function () {
        scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
        scope.domElement.removeEventListener('mousedown', onMouseDown, false);
        scope.domElement.removeEventListener('wheel', onMouseWheel, false);
        scope.domElement.removeEventListener('touchstart', onTouchStart, false);
        scope.domElement.removeEventListener('touchend', onTouchEnd, false);
        scope.domElement.removeEventListener('touchmove', onTouchMove, false);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        window.removeEventListener('keydown', onKeyDown, false);
        //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
    };
    //
    // internals
    //
    var scope = this;
    var changeEvent = {
        type: 'change'
    };
    var startEvent = {
        type: 'start'
    };
    var endEvent = {
        type: 'end'
    };
    var STATE = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_DOLLY_PAN: 4
    };
    var state = STATE.NONE;
    var EPS = 0.000001;
    // current position in spherical coordinates
    var spherical = new THREE.Spherical();
    var sphericalDelta = new THREE.Spherical();
    var scale = 1;
    var panOffset = new THREE.Vector3();
    var zoomChanged = false;
    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();
    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();
    var panDelta = new THREE.Vector2();
    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();

    function getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }

    function getZoomScale() {
        return Math.pow(0.95, scope.zoomSpeed);
    }

    function rotateLeft(angle) {
        sphericalDelta.theta -= angle;
    }

    function rotateUp(angle) {
        sphericalDelta.phi -= angle;
    }
    var panLeft = function () {
        var v = new THREE.Vector3();
        return function panLeft(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
            v.multiplyScalar(-distance);
            panOffset.add(v);
        };
    }();
    var panUp = function () {
        var v = new THREE.Vector3();
        return function panUp(distance, objectMatrix) {
            if (scope.screenSpacePanning === true) {
                v.setFromMatrixColumn(objectMatrix, 1);
            } else {
                v.setFromMatrixColumn(objectMatrix, 0);
                v.crossVectors(scope.object.up, v);
            }
            v.multiplyScalar(distance);
            panOffset.add(v);
        };
    }();
    // deltaX and deltaY are in pixels; right and down are positive
    var pan = function () {
        var offset = new THREE.Vector3();
        return function pan(deltaX, deltaY) {
            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
            if (scope.object.isPerspectiveCamera) {
                // perspective
                var position = scope.object.position;
                offset.copy(position).sub(scope.target);
                var targetDistance = offset.length();
                // half of the fov is center to top of screen
                targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);
                // we use only clientHeight here so aspect ratio does not distort speed
                panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
            } else if (scope.object.isOrthographicCamera) {
                // orthographic
                panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
            } else {
                // camera neither orthographic nor perspective
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false;
            }
        };
    }();

    function dollyIn(dollyScale) {
        if (scope.object.isPerspectiveCamera) {
            scale /= dollyScale;
        } else if (scope.object.isOrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }

    function dollyOut(dollyScale) {
        if (scope.object.isPerspectiveCamera) {
            scale *= dollyScale;
        } else if (scope.object.isOrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }
    //
    // event callbacks - update the object state
    //
    function handleMouseDownRotate(event) {
        //console.log( 'handleMouseDownRotate' );
        rotateStart.set(event.clientX, event.clientY); //T
        rotateEnd.set(event.clientX, event.clientY); //R
    }

    function handleMouseDownDolly(event) {
        //console.log( 'handleMouseDownDolly' );
        dollyStart.set(event.clientX, event.clientY); //H
        dollyEnd.set(event.clientX, event.clientY); //C
    }

    function handleMouseDownPan(event) {
        //console.log( 'handleMouseDownPan' );
        panStart.set(event.clientX, event.clientY); //M
        panEnd.set(event.clientX, event.clientY); //w
    }

    function handleMouseMoveRotate(event) {
        if (modeSwitch.isOrthographic()) { //zidong add 20180914
            if (orthoCameraRotation) {
                rotateDelta.subVectors(rotateEnd, event).multiplyScalar(scope.rotateSpeed);
                rotateEnd.set(event.clientX, event.clientY);
                orthoCamera.rotateZ(rotateDelta.x * 0.004); //20180920
                return;
            }
        }
        //console.log( 'handleMouseMoveRotate' );
        rotateEnd.set(event.clientX, event.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        rotateLeft(0.18 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
        rotateUp(0.18 * Math.PI * rotateDelta.y / element.clientHeight);
        //20180914_ning 修改速度模仿MP手感
        rotateStart.copy(rotateEnd);
        scope.update();
        // if (orbitCamera.rotation.x > 0) {
        //     if (rotateDelta.y < 0) {
        //         rotateDelta.y = 0;
        //     }else{
        //         var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        //         rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth);
        //         rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
        //         rotateStart.copy(rotateEnd);
        //         scope.update();
        //     }
        // }
        // else{
        //     var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        //     rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth);
        //     rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
        //     rotateStart.copy(rotateEnd);
        //     scope.update();
        // }
        //20180914_ning
    }

    function handleMouseMoveDolly(event) {
        if (modeSwitch.isOrthographic()) { //zidong中键放大缩小 add 20180914
            dollyDelta.subVectors(dollyEnd, event);
            dollyEnd.set(event.clientX, event.clientY);
            if (dollyDelta.x > 0) {
                if (orthoCamera.zoom > 2) {
                    return;
                }
                orthoCamera.zoom *= 1.05;
            } else if (dollyDelta.x < 0) {
                if (orthoCamera.zoom < 0.5) {
                    return;
                }
                orthoCamera.zoom *= 0.95;
            }
            orthoCamera.updateProjectionMatrix();
            return;
        }
        if (modeSwitch.isWalkingMode()) { //zidong中键放大缩小 add 20180914
            dollyDelta.subVectors(dollyEnd, event);
            dollyEnd.set(event.clientX, event.clientY);
            if (dollyDelta.x > 0) {
                if (pointerLockCamera.zoom > 2) {
                    return;
                }
                pointerLockCamera.zoom *= 1.05;
            } else if (dollyDelta.x < 0) {
                if (pointerLockCamera.zoom < 0.5) {
                    return;
                }
                pointerLockCamera.zoom *= 0.95;
            }
            pointerLockCamera.updateProjectionMatrix();
            return;
        }

        dollyEnd.set(event.clientX, event.clientY);
        dollyDelta.subVectors(dollyEnd, dollyStart);
        if (dollyDelta.y > 0) {
            dollyIn(getZoomScale());
        } else if (dollyDelta.y < 0) {
            dollyOut(getZoomScale());
        }
        dollyStart.copy(dollyEnd);
        scope.update();
    }

    function handleMouseMovePan(event) {
        if (modeSwitch.isOrthographic()) { //zidong移动 add 20180914
            panDelta.subVectors(panEnd, event).multiplyScalar(scope.panSpeed);
            panEnd.set(event.clientX, event.clientY);
            var localTransVector3 = new THREE.Vector3(panDelta.x * 0.25, panDelta.y * -0.25, 0).applyQuaternion(orthoCamera.quaternion);
            orthoCamera.position.add(localTransVector3);
            return;
        }
        panEnd.set(event.clientX, event.clientY);
        panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
        scope.update();
    }

    function handleMouseUp(event) {
        // console.log( 'handleMouseUp' );
    }

    function handleMouseWheel(event) {

        if (modeSwitch.isOrthographic()) { //zidong add 20180914
            if (event.deltaY < 0) {
                if (orthoCamera.zoom > 2) {
                    return;
                }
                orthoCamera.zoom *= 1.05;
                orthoCamera.updateProjectionMatrix();
            } else if (event.deltaY > 0) {
                if (orthoCamera.zoom < 0.5) {
                    return;
                }
                orthoCamera.zoom *= 0.95;
                orthoCamera.updateProjectionMatrix();
            }
            return;
        }
        if (modeSwitch.isWalkingMode()) { //20181205
            if (event.deltaY < 0) {
                if (pointerLockCamera.zoom > 2) {
                    return;
                }
                pointerLockCamera.zoom *= 1.05;
                pointerLockCamera.updateProjectionMatrix();
            } else if (event.deltaY > 0) {
                if (pointerLockCamera.zoom < 0.5) {
                    return;
                }
                pointerLockCamera.zoom *= 0.95;
                pointerLockCamera.updateProjectionMatrix();
            }
            return;
        }
        if (event.deltaY < 0) {
            dollyOut(getZoomScale());
        } else if (event.deltaY > 0) {
            dollyIn(getZoomScale());
        }
        scope.update();
    }

    function handleKeyDown(event) {
        //console.log( 'handleKeyDown' );
        switch (event.keyCode) {
            case scope.keys.UP:
                pan(0, scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.BOTTOM:
                pan(0, -scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.LEFT:
                pan(scope.keyPanSpeed, 0);
                scope.update();
                break;
            case scope.keys.RIGHT:
                pan(-scope.keyPanSpeed, 0);
                scope.update();
                break;
        }
        //20180919ning 绘制测量删除撤销；
        if (event.keyCode == 8) { //keycode为8表示退格键
            // console.log("测量删除撤销");
            // linedel();
        }
        //20180919ning 绘制测量保存json；
        if (event.keyCode == 83) { //keycode为83表示S键
            // console.log("测量保存");
            // SaveMeasure_Json();
        }
    }

    function handleTouchStartRotate(event) {
        //console.log( 'handleTouchStartRotate' );
        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
        panStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    function handleTouchStartDollyPan(event) {
        //console.log( 'handleTouchStartDollyPan' );
        if (scope.enableZoom) {
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            var distance = Math.sqrt(dx * dx + dy * dy);
            dollyStart.set(0, distance);
        }
        if (scope.enablePan) {
            var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
            var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
            panStart.set(x, y);
            rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
        }
    }

    function handleTouchMoveRotate(event) {
        //旋转改为移动，修改滑动速度20180918 ning
        if (scope.enablePan) {
            if (modeSwitch.isOrthographic()) { //zidong add 20180914
                var panEnd = new THREE.Vector2(event.touches[0].pageX, event.touches[0].pageY);
                panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
                panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                var localTransVector3 = new THREE.Vector3(panDelta.x * -0.3, panDelta.y * 0.3, 0).applyQuaternion(orthoCamera.quaternion);
                //2Dcamera.positionADD
                orthoCamera.position.add(localTransVector3);
                //orthoCamera.position.x += panDelta.x * -0.3;
                //orthoCamera.position.z += panDelta.y * -0.3;
                //console.log(orthoCamera.position);
            } else {
                rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
                var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
                rotateLeft(0.2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
                rotateUp(0.2 * Math.PI * rotateDelta.y / element.clientHeight);
                rotateStart.copy(rotateEnd);
                scope.update();
            }
        }
    }

    function handleTouchMoveDollyPan(event) {
        //console.log( 'handleTouchMoveDollyPan' );
        if (scope.enableZoom) {
            if (modeSwitch.isOrthographic()) { //zidong add 20180914
                //o = e,  y.subVectors(C, o), C.set(o.clientX, o.clientY);
                var EventTouchX = event.touches[0].pageX - event.touches[1].pageX;
                var EventTouchY = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(EventTouchX * EventTouchX + EventTouchY * EventTouchY);
                dollyEnd.set(0, distance);
                dollyDelta.subVectors(dollyEnd, dollyStart);
                dollyStart.set(0, distance);
                if (dollyDelta.y > 0) {
                    if (orthoCamera.zoom <= 2) {
                        orthoCamera.zoom *= 1.02;
                    }
                } else if (dollyDelta.y < 0) {
                    if (orthoCamera.zoom >= 0.5) {
                        orthoCamera.zoom *= 0.98;
                    }
                }
                orthoCamera.updateProjectionMatrix();
            } else if (modeSwitch.isWalkingMode()) {
                //o = e,  y.subVectors(C, o), C.set(o.clientX, o.clientY);
                var EventTouchX = event.touches[0].pageX - event.touches[1].pageX;
                var EventTouchY = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(EventTouchX * EventTouchX + EventTouchY * EventTouchY);
                dollyEnd.set(0, distance);
                dollyDelta.subVectors(dollyEnd, dollyStart);
                dollyStart.set(0, distance);
                if (dollyDelta.y > 0) {
                    if (pointerLockCamera.zoom <= 2) {
                        pointerLockCamera.zoom *= 1.02;
                    }
                } else if (dollyDelta.y < 0) {
                    if (pointerLockCamera.zoom >= 0.5) {
                        pointerLockCamera.zoom *= 0.98;
                    }
                }
                pointerLockCamera.updateProjectionMatrix();
            } else {
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                dollyEnd.set(0, distance);
                dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
                dollyIn(dollyDelta.y);
                dollyStart.copy(dollyEnd);
                scope.update();
            }
        }
        //移动改旋转20180918 ning
        if (modeSwitch.isOrthographic()) { //zidong add 20180914
            var rotateEnd = new THREE.Vector2(event.touches[0].pageX, event.touches[0].pageY);
            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
            rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
            orthoCamera.rotateZ(rotateDelta.x * -0.005);
            // return;
        } else {
            //console.log( 'handleTouchMoveRotate' );
            var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
            var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
            panEnd.set(x, y);
            panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
            pan(panDelta.x, panDelta.y);
            panStart.copy(panEnd);
            scope.update();
        }
    }

    function handleTouchEnd(event) {
        //console.log( 'handleTouchEnd' );
    }
    //
    // event handlers - FSM: listen for events and reset state
    //
    function onMouseDown(event) {
        if (scope.enabled === false) return;
        event.preventDefault();
        switch (event.button) {
            case scope.mouseButtons.LEFT:
                if (event.ctrlKey || event.metaKey) {
                    if (scope.enablePan === false) return;
                    handleMouseDownPan(event);
                    state = STATE.PAN;
                } else {
                    if (scope.enableRotate === false) return;
                    handleMouseDownRotate(event);
                    state = STATE.ROTATE;
                }
                break;
            case scope.mouseButtons.MIDDLE:
                if (scope.enableZoom === false) return;
                handleMouseDownDolly(event);
                state = STATE.DOLLY;
                break;
            case scope.mouseButtons.RIGHT:
                if (scope.enablePan === false) return;
                handleMouseDownPan(event);
                state = STATE.PAN;
                break;
        }
        if (state !== STATE.NONE) {
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);
            scope.dispatchEvent(startEvent);
        }
    }

    function onMouseMove(event) {
        if (scope.enabled === false) return;
        event.preventDefault();
        switch (state) {
            case STATE.ROTATE:
                if (scope.enableRotate === false) return;
                handleMouseMoveRotate(event);
                break;
            case STATE.DOLLY:
                if (scope.enableZoom === false) return;
                handleMouseMoveDolly(event);
                break;
            case STATE.PAN:
                if (scope.enablePan === false) return;
                handleMouseMovePan(event);
                break;
        }
    }

    function onMouseUp(event) {
        if (scope.enabled === false) return;
        handleMouseUp(event);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        scope.dispatchEvent(endEvent);
        state = STATE.NONE;
    }

    function onMouseWheel(event) {
        // console.log("scope.enabled",scope.enabled);
        // console.log("scope.enableZoom",scope.enableZoom);
        // console.log("state",state);
        if (!modeSwitch.isWalkingMode()) {
            if (scope.enabled === false || scope.enableZoom === false || (state !== STATE.NONE && state !== STATE.ROTATE)) return;
        }

        event.preventDefault();
        event.stopPropagation();
        scope.dispatchEvent(startEvent);
        handleMouseWheel(event);
        scope.dispatchEvent(endEvent);

    }

    function onKeyDown(event) {
        if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return;
        handleKeyDown(event);
    }

    function onTouchStart(event) {
        if (scope.enabled === false) return;
        switch (event.touches.length) {
            case 1: // one-fingered touch: rotate
                if (scope.enableRotate === false) return;
                handleTouchStartRotate(event);
                state = STATE.TOUCH_ROTATE;
                break;
            case 2: // two-fingered touch: dolly-pan
                if (scope.enableZoom === false && scope.enablePan === false) return;
                handleTouchStartDollyPan(event);
                state = STATE.TOUCH_DOLLY_PAN;
                break;
            default:
                state = STATE.NONE;
        }
        if (state !== STATE.NONE) {
            scope.dispatchEvent(startEvent);
        }
    }

    function onTouchMove(event) {
        // if (!modeSwitch.isWalkingMode()) {
        if (scope.enabled === false) return;
        event.preventDefault();
        event.stopPropagation();
        switch (event.touches.length) {
            case 1: // one-fingered touch: rotate
                if (scope.enableRotate === false) return;
                if (state !== STATE.TOUCH_ROTATE) return; // is this needed?
                handleTouchMoveRotate(event);
                break;
            case 2: // two-fingered touch: dolly-pan
                if (scope.enableZoom === false && scope.enablePan === false) return;
                if (state !== STATE.TOUCH_DOLLY_PAN) return; // is this needed?
                handleTouchMoveDollyPan(event);
                break;
            default:
                state = STATE.NONE;
        }
        // }else{
        // handleTouchMoveDollyPan(event);
        // handleTouchMoveRotate(event);
        // }

    }

    function onTouchEnd(event) {
        if (scope.enabled === false) return;
        handleTouchEnd(event);
        scope.dispatchEvent(endEvent);
        state = STATE.NONE;
    }

    function onContextMenu(event) {
        if (scope.enabled === false) return;
        event.preventDefault();
    }
    //
    scope.domElement.addEventListener('contextmenu', onContextMenu, false);
    scope.domElement.addEventListener('mousedown', onMouseDown, false);
    scope.domElement.addEventListener('wheel', onMouseWheel, {
        passive: false
    });
    scope.domElement.addEventListener('touchstart', onTouchStart, {
        passive: false
    });
    scope.domElement.addEventListener('touchend', onTouchEnd, {
        passive: false
    });
    scope.domElement.addEventListener('touchmove', onTouchMove, {
        passive: false
    });
    window.addEventListener('keydown', onKeyDown, false);
    // force an update at start
    this.update();
};
THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;
Object.defineProperties(THREE.OrbitControls.prototype, {
    center: {
        get: function () {
            console.warn('THREE.OrbitControls: .center has been renamed to .target');
            return this.target;
        }
    },
    // backward compatibility
    noZoom: {
        get: function () {
            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            return !this.enableZoom;
        },
        set: function (value) {
            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            this.enableZoom = !value;
        }
    },
    noRotate: {
        get: function () {
            console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
            return !this.enableRotate;
        },
        set: function (value) {
            console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
            this.enableRotate = !value;
        }
    },
    noPan: {
        get: function () {
            console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
            return !this.enablePan;
        },
        set: function (value) {
            console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
            this.enablePan = !value;
        }
    },
    noKeys: {
        get: function () {
            console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
            return !this.enableKeys;
        },
        set: function (value) {
            console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
            this.enableKeys = !value;
        }
    },
    staticMoving: {
        get: function () {
            console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
            return !this.enableDamping;
        },
        set: function (value) {
            console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
            this.enableDamping = !value;
        }
    },
    dynamicDampingFactor: {
        get: function () {
            console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
            return this.dampingFactor;
        },
        set: function (value) {
            console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
            this.dampingFactor = value;
        }
    }
});
//OrbitControls.js end

//AnchorManager.js

var quadArray = [];
//根据扫描位置点、大小、高度创建图示
function AnchorManager(points, size, cameraHeight, scene, pointPath) {
    var textureLoader = new THREE.TextureLoader();
    //this.textureHighlight = textureLoader.load( "image/point1.png" );
    // this.matHover = new THREE.MeshBasicMaterial({
    //     alphaTest: 0.5,
    //     color: 0xccccff,
    //     map:  textureLoader.load( "image/point1.png" )
    //
    // });

    this.modelData = modelData;
    var pointPathFull = "image/" + pointPath;
    console.log(pointPathFull)
    this.highlightTex1 = textureLoader.load("image/R_01.png");
    this.highlightTex2 = textureLoader.load("image/R_02.png");
    this.highlightTex3 = textureLoader.load("image/R_03.png");
    this.highlightTex4 = textureLoader.load("image/R_04.png");
    this.highlightTex5 = textureLoader.load("image/R_05.png");
    this.highlightTex6 = textureLoader.load("image/R_06.png");
    this.quadArray = [];
    this.matNormal = new THREE.MeshBasicMaterial({
        //alphaTest: 0.5,
        color: 0xffffff,
        side: THREE.DoubleSide,
        depthTest: true,
        transparent: true,
        opacity: 0.5,
        map: textureLoader.load(pointPathFull)
        //map: textureLoader.load("image/point5.png")
    });

    this.matHint = new THREE.MeshBasicMaterial({
        //alphaTest: 0.5,
        color: 0xffffff,
        side: THREE.DoubleSide,
        depthTest: false,
        transparent: true,
        opacity: 1,
        map: textureLoader.load("image/R_06.png")
    });

    var geometry = new THREE.PlaneBufferGeometry(size, size, 1);
    geometry.rotateX(-Math.PI / 2);

    var matNormal;
    var quad;
    for (var i = 0; i < points.length; ++i) {
        matNormal = new THREE.MeshBasicMaterial({
            //alphaTest: 0.5,
            color: 0xffffff,
            side: THREE.DoubleSide,
            depthTest: true,
            transparent: true,
            opacity: 0.5,
            map: textureLoader.load(pointPathFull),
            polygonOffset: true,
            polygonOffsetFactor: -150,
            //map: textureLoader.load("image/point5.png")
        });


        quad = new THREE.Mesh(geometry, matNormal);
        quad.polygonOffsetFactor = 0;
        quad.polygonOffsetUnits = 2.0;
        quad.position.set(points[i].x, points[i].y - cameraHeight, points[i].z);
        quad.renderOrder = 2;
        this.quadArray.push(quad);
        quadArray.push(quad);
        scene.add(quad);
    }

    var geometry2 = new THREE.PlaneBufferGeometry(size, size, 1);
    this.posHint = new THREE.Mesh(geometry2, this.matHint);
    this.posHint.renderOrder = 2;
    //scene.add( this.posHint );
    this.raycaster = new THREE.Raycaster();

    this.anchorPoint = new THREE.Vector3(0, 0, 0);
    this.anchorNormal = new THREE.Vector3(0, 1, 0);
}

AnchorManager.prototype.highlight = function () {
    this.matNormal.opacity = 1.0;
    //this.matNormal.color.setRGB(10.0, 0, 0);
}

AnchorManager.prototype.normal = function () {
    this.matNormal.opacity = 0.5;
}

AnchorManager.prototype.updateHint = function (x, y) {
    var pos = new THREE.Vector2(x, y);
    this.raycaster.setFromCamera(pos, cameraController.getCurrentCamera());

    var minDistance = 99999;
    var point = new THREE.Vector3();
    var rayScope = this.raycaster;
    var normalScope = new THREE.Vector3(0, 1, 0);
    if (model) {
        model.traverse(function (child) {
            if (child.isMesh) {
                var intersects = rayScope.intersectObject(child);
                if (intersects.length > 0 && intersects[0].distance < minDistance) {
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
    } else {
        let vector = new THREE.Vector3(x, y, 1).unproject(cameraController.getCurrentCamera());
        if (modeSwitch.isOrthographic()) {
            ;
        } else {
            let cameraPos = new THREE.Vector3();
            cameraController.getCurrentCamera().getWorldPosition(cameraPos);
            vector.sub(cameraPos);
            vector.normalize();
            if (vector.y < 0) {
                vector.multiplyScalar(-1.0 / vector.y * (cameraPos.y - modelData.groundHeight));
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
AnchorManager.prototype.creatVideo = function (x, y) {
    var pos = new THREE.Vector2(x, y);
    this.raycaster.setFromCamera(pos, cameraController.getCurrentCamera());

    var minDistance = 99999;
    var point = new THREE.Vector3();
    var rayScope = this.raycaster;
    var normalScope = new THREE.Vector3(0, 1, 0);
    if (model) {
        model.traverse(function (child) {
            if (child.isMesh) {
                var intersects = rayScope.intersectObject(child);
                if (intersects.length > 0 && intersects[0].distance < minDistance) {
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
    } else {
        let vector = new THREE.Vector3(x, y, 1).unproject(cameraController.getCurrentCamera());

        if (modeSwitch.isOrthographic()) {
            ;
        } else {
            let cameraPos = new THREE.Vector3();
            cameraController.getCurrentCamera().getWorldPosition(cameraPos);
            vector.sub(cameraPos);
            vector.normalize();
            if (vector.y < 0) {
                vector.multiplyScalar(-1.0 / vector.y * (cameraPos.y - modelData.groundHeight));
                vector.x += cameraPos.x;
                vector.z += cameraPos.z;
            }
            point.set(vector.x, modelData.groundHeight, vector.z);
        }

    }

    // this.anchorPoint.copy(point);
    // this.anchorNormal.copy(normalScope);
    // this.posHint.position.copy(point);
    // console.log(point,this.posHint.quaternion)
    // // console.log(point)
    // this.posHint.lookAt(point.add(normalScope));
    var geometry = new THREE.PlaneBufferGeometry(1, 1, 1);
    var video = document.createElement("video"); // .getElementById( 'video01' );
    video.autoplay = true;
    video.loop = true;
    var texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    var mat = new THREE.MeshBasicMaterial({ //暂时使用通用材质
        color: 0xffffff,
        depthTest: false,
        transparent: true,
        opacity: 1,
        map: texture,
        side: THREE.DoubleSide,
        polygonOffset: false,
        depthWrite: false,


    });
    var videoPlane = new THREE.Mesh(geometry, mat);
    console.log(this.modelData)
    var videoData = this.modelData.videos[0].inlineVideo;
    video.src = videoData.src;
    // videoPlane.rotation.z=(3.14159 / 4);
    // videoPlane.position.z=(-10.1);
    // videoPlane.renderDepth = -2;
    // mat.polygonOffsetFactor=1;
    // mat.polygonOffsetUnits=1;
    // videoPlane.renderOrder = 100;
    videoPlane.position.copy(point);
    var cam = cameraController.getCurrentCamera();
    var pos = new THREE.Vector3();
    var q = new THREE.Quaternion();
    cam.getWorldPosition(pos);
    cam.getWorldQuaternion(q);
    // geometry.rotateX(-Math.PI/2);
    // videoPlane.position.copy(pos);
    // videoPlane.quaternion.copy(q);

    // console.log(videoPlane)
    // console.log(videoPlane.position)
    // px.value=20;
    setTimeout(() => {
        $('.MapVideoContent-title input[data-index="One"]').val(videoPlane.position.x);
        $('.MapVideoContent-title input[data-index="Two"]').val(videoPlane.position.y);
        $('.MapVideoContent-title input[data-index="Three"]').val(videoPlane.position.z);
        $('.MapVideoContent-title input[data-index="Four"]').val(videoPlane.scale.x);
        $('.MapVideoContent-title input[data-index="Five"]').val(videoPlane.scale.y);
        $('.MapVideoContent-title input[data-index="Six"]').val(videoPlane.scale.z);
        $('.MapVideoContent-title input[data-index="Seven"]').val(videoPlane.rotation.x);
        $('.MapVideoContent-title input[data-index="Eight"]').val(videoPlane.rotation.y);
        $('.MapVideoContent-title input[data-index="Nine"]').val(videoPlane.rotation.z);

        chooseMap = new MapObj(videoPlane.position.x, videoPlane.position.y, videoPlane.position.z, videoPlane.scale.x, videoPlane.scale.y, videoPlane.scale.z, videoPlane.rotation.x, videoPlane.rotation.y, videoPlane.rotation.z);
        console.log(chooseMap)
    }, 500)

    videoPlane.lookAt(point.add(normalScope));
    if (switchAdd) {
        scene.add(videoPlane)

    }

    $('.rangeControls>.rangeContent>.range-field>input').on('input', function () {
        $(this).parent().siblings('.showVal').css('opacity', 0)
        let val = $(this).val();
        let key = $(this).attr('data-index');
        $(this).attr('value', val)
        if (key == 'One') {
            videoPlane.position.x = val;
            chooseMap.change(key, val);
        } else if (key == 'Two') {
            videoPlane.position.y = val;
            chooseMap.change(key, val);
        } else if (key == 'Three') {
            videoPlane.position.z = val;
            chooseMap.change(key, val);
        } else if (key == 'Four') {
            videoPlane.scale.y = val;
            chooseMap.change(key, val);
        } else if (key == 'Five') {
            videoPlane.scale.y = val;
            chooseMap.change(key, val);
        } else if (key == 'Six') {
            videoPlane.scale.y = val;
            chooseMap.change(key, val);
        } else if (key == 'Seven') {
            videoPlane.rotation.y = val;
            chooseMap.change(key, val);
        } else if (key == 'Eight') {
            videoPlane.rotation.y = val;
            chooseMap.change(key, val);
        } else if (key == 'Nine') {
            videoPlane.rotation.y = val;
            chooseMap.change(key, val);
        }
    })

}
AnchorManager.prototype.loadingTexture = function (targetIndex, loaded) {

    if (loaded == 1) {
        this.quadArray[targetIndex].material.map = this.highlightTex1;

    } else if (loaded == 2) {
        this.quadArray[targetIndex].material.map = this.highlightTex2;
    } else if (loaded == 3) {
        this.quadArray[targetIndex].material.map = this.highlightTex3;
    } else if (loaded == 4) {
        this.quadArray[targetIndex].material.map = this.highlightTex4;
    } else if (loaded == 5) {
        this.quadArray[targetIndex].material.map = this.highlightTex5;
    } else if (loaded == 6) {

        this.quadArray[targetIndex].material.map = this.highlightTex6;

    }



}
//AnchorManager.js end

//MaterialSwitch.js

function MaterialSwitch(group) {
    //模型原有材质
    this.matOrign = [];
    //立方图材质
    this.matCube = new THREE.ShaderMaterial({
        uniforms: {
            texture1: {
                value: null
            },
            texture2: {
                value: null
            },
            viewPoint1: {
                value: new THREE.Vector3()
            },
            viewPoint2: {
                value: new THREE.Vector3()
            },
            q1: {
                value: new THREE.Vector4(0, 0, 0, 1)
            },
            q2: {
                value: new THREE.Vector4(0, 0, 0, 1)
            },
            progress: {
                value: 1.0
            },
        },
        vertexShader: `vec4 quaternionMul(vec4 q, vec4 r) { vec3 qv = q.xyz; vec3 rv = r.xyz; return vec4( cross(qv, rv) + qv * r.w + q.w * rv, q.w * r.w - dot(qv, rv)); } vec4 rotate(vec4 q, vec4 p) { vec4 c = vec4(-1.0 * q.xyz, q.w); vec4 t = quaternionMul(q, p); return quaternionMul(t, c); }  uniform vec3 viewPoint1; uniform vec3 viewPoint2; uniform vec4 q1; uniform vec4 q2; varying vec3 vUv1; varying vec3 vUv2;
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
    updateModel(group) {
        this.matOrign.length = 0
        this.group = group;
        var scope = this;
        this.group && this.group.traverse(function (child) {
            if (child.isMesh) {
                // child.material.map.encoding = THREE.LinearEncoding;// .sRGBEncoding;
                // scope.matOrign.push(child.material);
                // var mat = new THREE.MeshBasicMaterial();
                 var mat = new THREE.MeshStandardMaterial();

                //mat.side = THREE.DoubleSide;
                mat.side = THREE.FrontSide;
                mat.map = child.material.map;
                mat.map.encoding = THREE.LinearEncoding; // .sRGBEncoding;
                child.material = mat;
                scope.matOrign.push(mat);
            }
        });
    },
    restore() {
        var index = 0;
        var scope = this;
        this.group && this.group.traverse(function (child) {
            if (child.isMesh) {
                child.material = scope.matOrign[index++];
            }
        });
        this.clear();
    },
    useCubemap() {
        if (!this.loaded()) {
            console.warn("cubemap not loaded");
            return;
        }
        this._useCubemap();
    },
    loaded() { //判断是否已加载
        return this.textureLoaded1 && this.viewpointSet;
    },
    clear() { //设置为未加载
        this.textureLoaded1 = false;
        this.textureLoaded2 = false;
        this.viewpointSet = false;
    },
    setTarget(point) { //设置目标点位置
        if (!this.viewpointSet) { //直接移动到
            this.matCube.uniforms.viewPoint1.value = point;
            this.viewpointSet = true;
            this.textureLoaded1 = false;
        } else { //从当前点移动
            this.matCube.uniforms.viewPoint1.value = this.matCube.uniforms.viewPoint2.value;
            this.matCube.uniforms.texture1.value = this.matCube.uniforms.texture2.value;
            this.matCube.uniforms.q1.value = this.matCube.uniforms.q2.value;
        }
        this.textureLoaded2 = false;
        this.matCube.uniforms.viewPoint2.value = point;
        this.matCube.uniforms.progress.value = 0.0;
        this.matCube.needsUpdate = true; //setTargetTexture后刷新
    },
    setTargetTexture(texture, q) { //需要先设置目标点位置，后设置目标点纹理
        if (!this.textureLoaded1) { //保证同时设置
            this.matCube.uniforms.texture1.value = texture;
            this.matCube.uniforms.q1.value = q;
            this.textureLoaded1 = true;

        } else {
            this.textureLoaded2 = true;
            this.matCube.uniforms.progress.value = this.progress;
        }
        this.matCube.uniforms.texture2.value = texture;
        this.matCube.uniforms.q2.value = q;
        this.matCube.needsUpdate = true;
    },
    updateProgress(progress) {
        this.progress = progress;
        this.matCube.uniforms.progress.value = (this.textureLoaded2 ? progress : 0);
        this.matCube.needsUpdate = true;
    },
    _useCubemap() {
        var scope = this;
        this.group && this.group.traverse(function (child) {
            if (child.isMesh) {
                child.material = scope.matCube;
            }
        });
    },
});

//MaterialSwitch.js end

//ModeSwitch.js

function ModeSwitch(surroundBox, materialSwitch, cb) {
    this.ModeOrbit = 1;
    this.ModePointerLock = 2;
    this.Orthographic = 3;

    this.cbModeChange = cb;
    this.currentMode = this.ModeOrbit;

    this.materialSwitch = materialSwitch;
    this.surroundBox = surroundBox;
}

Object.assign(ModeSwitch.prototype, {
    isOverallMode() {
        return this.currentMode == this.ModeOrbit;
    },
    isWalkingMode() {
        return this.currentMode == this.ModePointerLock;
    },
    isOrthographic() {
        return this.currentMode == this.Orthographic;
    },
    // getMode(){
    //     return this.currentMode;
    // },
    setOverallMode() {
        this.surroundBox.visible = false;
        this.materialSwitch.restore();
        this.currentMode = this.ModeOrbit;

        this.cbModeChange && this.cbModeChange(this);
    },
    setWalkingMode() {
        if (this.isOverallMode()) {
            this.surroundBox.visible = true;
            // this.materialSwitch.useCubemap();
            this.currentMode = this.ModePointerLock;
        }

        this.cbModeChange && this.cbModeChange(this);
    },
    setOrthographic() {
        this.currentMode = this.Orthographic;
        this.cbModeChange && this.cbModeChange(this);
    }
});

//ModeSwitch.js end

//CameraController.js
//控制相机移动，目前用于控制整体视图与漫游视图切换
function CameraController(orbitCamera, orbitControl, pointerLockCamera, pointLockControl, orthoCamera, modeSwitch, cbProgress, cbComplete) {
    this.orbitCamera = orbitCamera;
    this.pointerLockCamera = pointerLockCamera;
    this.orbitControl = orbitControl;
    this.pointerLockControl = pointLockControl;
    this.orthoCamera = orthoCamera;
    this.modeSwitch = modeSwitch;
    this.cbProgress = cbProgress; //进度回调
    this.cbComplete = cbComplete; //移动结束回调
    this.timeTotal = 1.2; //总用时设置
    this.timeHalf = this.timeTotal * 0.5; //一半用时
    this.moving = false; //是否移动中
    this.movingClock = new THREE.Clock(); //计时器
    this.moveDir = new THREE.Vector3(); //移动方向,单位矢量
    this.accelerate = 0.0; //加速度
    this.totalLength = 0.0; //总长度
    this.startPoint = new THREE.Vector3(); //起点
    this.endPoint = new THREE.Vector3(); //终点
    this.startOrient = new THREE.Quaternion();
    this.endOrient = new THREE.Quaternion();
    this.setWalking = modeSwitch.isOverallMode();
    this.enableRotate = true; //是否允许移动时旋转相机(指定目的朝向时禁止手工)
    this.pixelToRotation = 0.002;
}
//移动时隐藏标签判断
var moveTagVisible = true;
var changeQuick=true;

Object.assign(CameraController.prototype, {
    isEnableRotate() {
        return !this.moving || this.enableRotate;
    },
    setTimeTotal(time) {
        this.timeTotal = time; //总用时设置
        this.timeHalf = this.timeTotal * 0.5; //一半用时
    },
    resetTime() {
        this.timeTotal = 1.2; //总用时设置
        this.timeHalf = this.timeTotal * 0.5; //一半用时
    },
    getCurrentCamera() {
        if (this.modeSwitch.isOverallMode()) {
            return this.orbitCamera;
        } else if (this.modeSwitch.isWalkingMode()) {
            return this.pointerLockCamera;
        } else {
            return this.orthoCamera;
        }
    },
    resize(width, height) {
        this.orbitCamera.aspect = this.pointerLockCamera.aspect = width / height;
        this.pointerLockCamera.updateProjectionMatrix();
        this.orbitCamera.updateProjectionMatrix();
        var fov = this.getCurrentCamera().fov;
        this.pointerLockControl.pixelToRotation = this.pixelToRotation = fov * Math.PI / 180 / height;
    },
    moveTo(posDst, orient) { //两点移动：俯视图切换到漫游或漫游点间移动, orient朝向，可省略
        this.enableRotate = !orient; //是否允许移动时旋转相机

        if (this.modeSwitch.isOverallMode()) {
            this.orbitCamera.getWorldPosition(this.startPoint);
            this.orbitCamera.getWorldQuaternion(this.startOrient);
        } else {
            this.pointerLockCamera.getWorldPosition(this.startPoint);
            this.pointerLockCamera.getWorldQuaternion(this.startOrient);
            if (orient) { //直接旋转相机
                var yawObject = this.pointerLockControl.getObject();
                yawObject.rotation.set(0, 0, 0);
                yawObject.children[0].rotation.set(0, 0, 0);
                pointerLockCamera.setRotationFromQuaternion(this.startOrient);
            }
        }
        this.endPoint.copy(posDst);
        this.moveDir.subVectors(this.endPoint, this.startPoint);
        this.totalLength = this.moveDir.length();
        if (this.totalLength > 0) this.moveDir.divideScalar(this.totalLength);
        this.accelerate = this.totalLength / this.timeHalf / this.timeHalf;
        this.moving = true;
        this.movingClock.start();
        if (orient) {
            this.endOrient.copy(orient);
        } else {
            if (this.modeSwitch.isOverallMode()) //俯视图切换到漫游需要改变朝向
            {
                this.orbitCamera.getWorldQuaternion(this.startOrient);
                var dir = new THREE.Vector3();
                this.orbitCamera.getWorldDirection(dir);
                dir.y = 0;
                dir.normalize();
                var up = new THREE.Vector3(0, 1, 0);
                var xAxis = dir.clone().cross(up);
                var mat4 = new THREE.Matrix4();
                mat4.makeBasis(xAxis, up, dir.multiplyScalar(-1));
                this.endOrient.setFromRotationMatrix(mat4);
            } else {
                this.endOrient.copy(this.startOrient);
            }
        }
        this._adjustOrient(this.endPoint, this.endOrient);
        if (moveTagVisible) {
            TagDivvisible(false); //移动时隐藏标签
        }
    },
    moveFromPoint(distance) { //漫游图切换到俯视图
        var dir = new THREE.Vector3();
        this.pointerLockCamera.getWorldDirection(dir);
        if (dir.y > -0.5) //最小俯视角度
        {
            dir.y = -0.6;
        }
        dir.normalize();
        this.moveDir.copy(dir.multiplyScalar(-1));
        this.pointerLockCamera.getWorldPosition(this.startPoint);
        this.endPoint.addVectors(this.moveDir.clone().multiplyScalar(distance), this.startPoint); {
            dir.subVectors(modelCenter, this.endPoint);
            dir.normalize();
            var up = new THREE.Vector3(0, 1, 0);
            var xAxis = dir.clone().cross(up);
            up = xAxis.clone().cross(dir);
            var mat4 = new THREE.Matrix4();
            mat4.makeBasis(xAxis, up, dir.clone().multiplyScalar(-1));
            this.endOrient.setFromRotationMatrix(mat4);
        }
        this.moveTo(this.endPoint, this.endOrient);
    },
    update() {
        if (!this.moving) return;

        var t = this.movingClock.getElapsedTime();
        if(isOverallModeToWalkingMode&&modeSwitch.isOverallMode())
        {
            if(t>0.5&&t<1.18){
                if(renderer.domElement.style.opacity>=0){
                    renderer.domElement.style.opacity-=0.025;

                }
            }


            if(changeQuick&&t>1.18){
                changeQuick=false;
                materialSwitch.useCubemap();
                timer2()
            
        
            }
            function timer2(){
                var timer2=setInterval(function(){
                    renderer.domElement.style.opacity= parseFloat(renderer.domElement.style.opacity)+ 0.025;
                        if(renderer.domElement.style.opacity>=1){
                            renderer.domElement.style.opacity=1;
                            clearInterval(timer2);
                            isOverallModeToWalkingMode=true;
                           
                        }                             
                },10)
            }

        }
        if (t >= this.timeTotal) //移动结束
        {
            this.moving = false;
            this.movingClock.stop();
            if (this.modeSwitch.isOverallMode()) {
                this.orbitCamera.position.copy(this.endPoint);
                this.orbitCamera.setRotationFromQuaternion(this.endOrient);
            } else {
                this.pointerLockControl.getObject().position.copy(this.endPoint);
            }
            this.adjustPointLock();
            this.cbComplete();
            return;
        }
        var dst;
        if (t <= this.timeHalf) {
            dst = 0.5 * this.accelerate * t * t;
        } else {
            dst = this.totalLength - 0.5 * this.accelerate * (this.timeTotal - t) * (this.timeTotal - t);
        }
        var pt = this.moveDir.clone().multiplyScalar(dst).add(this.startPoint);
        var q = new THREE.Quaternion();
        THREE.Quaternion.slerp(this.startOrient, this.endOrient, q, t / this.timeTotal);
        if (this.modeSwitch.isOverallMode()) {
            this.orbitCamera.position.copy(pt);
            this.orbitCamera.setRotationFromQuaternion(q);
        } else {
            this.pointerLockControl.getObject().position.copy(pt);
            if (!this.enableRotate) {
                this.pointerLockCamera.setRotationFromQuaternion(q);
            }
        }
        this.cbProgress(t / this.timeTotal);
    },
    adjustPointLock() { //俯视图切换到漫游视图, 使pointerLockCamera与orbitCamera朝向一致
        var yawObject = this.pointerLockControl.getObject();
        yawObject.position.copy(this.endPoint);
        var dir = new THREE.Vector3(0, 0, -1);
        if (this.enableRotate) {
            if (this.modeSwitch.isOverallMode()) {
                this.orbitCamera.getWorldDirection(dir);
            } else {
                this.pointerLockCamera.getWorldDirection(dir);
            }
        } else {
            dir.applyQuaternion(this.endOrient); // 移动过程可能改变了相机, 改为禁止移动时转动相机（in PointerLockControls.js）
        }
        this.pointerLockCamera.rotation.set(0, 0, 0);
        yawObject.rotation.y = Math.atan2(-dir.x, -dir.z);
        yawObject.children[0].rotation.x = Math.asin(dir.y / dir.length());
    },
    _adjustOrient(pos, orient) { //矫正目标位置、朝向与orbitControl一致
        var delta = new THREE.Vector3().subVectors(modelCenter, pos);
        var targetDir = new THREE.Vector3(0, 0, -1).applyQuaternion(orient); //
        var target = targetDir.clone().multiplyScalar(delta.length()).add(pos);
        var q = orient.clone();
        //因为数据精度问题，orbitControl内部变量不能一次计算就保持一致（在pan之后不能保持一致，大概还有其他内部控制不到的内部变量）
        for (var i = 0; i < 100; ++i) {
            this.orbitCamera.position.copy(pos);
            this.orbitControl.target.copy(target);
            this.orbitControl.update();
            this.orbitCamera.getWorldQuaternion(orient);
            if (Math.abs(q.x - orient.x) + Math.abs(q.w - orient.w) < 0.0000000001) break;
            q.copy(orient);
        }
    }
});

//CameraController.js end

//TextureManager.js

//处理纹理加载， 加载后通过cbLoadComplete通知
//将来扩展：依据浏览器、手机检测结果，加载不同的纹理
//viewPoint:{x y z, path}: path+face-n.png or path = xxx.ktx
function TextureManager(renderer, cubeUrls, smallUrls, cbLoadComplete, cacheSize) {
    this.renderer = renderer;
    this.cubeUrls = cubeUrls;
    this.smallUrls = smallUrls;
    this.cbLoadComplete = cbLoadComplete; //纹理加载结束回调
    this.cacheSize = cacheSize || 4; //缓存大小
    this.loaded = []; //已加载纹理： {index, visitNum, texture1, texture2 }, 因为数量少，直接使用数组, visitNum从小排列
    this.visitNum = 0;
    this.loadingIndex = -1;
    //延迟高清纹理加载
    this.loadingData = {
        index: -1,
        images: [],
        updatedFaces: 6
    }; //加载中的数据
    this.dataTexture = new THREE.DataTexture(new Uint8Array([0, 120, 120, 255]), 1, 1); //初始数据
    this.cubeTexture = new THREE.CubeTexture();
    this.gl = renderer.getContext();
    this.glutils = THREE.WebGLUtils(this.gl, renderer.extensions);
    this.glFormat = this.glutils.convert(THREE.RGBAFormat);
    this.glType = this.glutils.convert(THREE.UnsignedByteType);
    this.frameCount = 1;
    this.textureArr=[];
    this.group='';
    this.wantingTextureArr=[];
}
var groupArr=[];
var planeX=0.9;
var meshArr=[]; //控流
function limitSpeed(){
    setInterval(function(){
        if(meshArr.length>0){
            meshArr[0].visible=true;
            meshArr.shift();
        }
    },30)
   
   
}
limitSpeed()
Object.assign(TextureManager.prototype, {
    loadTexture(index, ifcanmove) {
        var scope = this;
        this.loadingIndex = index;
        var plane = new THREE.PlaneGeometry(planeX,planeX,100);
        var r = scope._getLoadIndex(index); //加载材质成功后返回数值
        if (r >= 0) { //已加载
            if (ifcanmove) {
                moveTagVisible = true; //移动隐藏
                setWalkingViewPoint(index);
                // console.log(groupArr)
                // for(var i=0;i<groupArr.length;i++){
                //     if(groupArr[i].gid==index){
                //         this.fetchWantingTexture(index,groupArr[i])
                //         this.group=groupArr[i];
                //     }
                // }
                this.textureArr=[];
                for(var tI=6*index;tI<6*index+6;tI++){
                    for(var j=0;j<4;j++){ 
                        for(var i=0;i<4;i++){
                                this.textureArr.push({url:rootPath+tilesPath+'2k_'+tI+'_'+i+'_'+j+'.jpg',face:tI%6,i:i,j:j,index:index})
                            }
                        }
                    }
                    scope.fetchWantingTexture(index)
       
            }
            scope.loaded[r].visitNum == ++scope.visitNum; //修改访问计数
            if (scope.loaded[r].texture2 != null) {
                scope._onTextureLoaded(index, scope.loaded[r].texture2);
            } else {
                scope._onTextureLoaded(index, scope.loaded[r].texture1);
                if (index == scope.loadingIndex) { //避免无效加载
                    // scope._loadHighTexture(index);
                }
            }
            for(var j=0;j<groupArr.length;j++){
                groupArr[j].visible=false

            }
         
       
            
        } else //未加载
        {       
        // if(this.textureArr.length>0){
        //     this.wantingTextureArr.push({index:this.textureArr[0].index,children:this.textureArr});
        //     this.textureArr=[];
        // }
        // onPreLoadTexture(0)
 
        // if (ifcanmove) {//影响漫游事件所以屏蔽
            for(var tI=6*index;tI<6*index+6;tI++){
                for(var j=0;j<4;j++){ 
                    for(var i=0;i<4;i++){
                            this.textureArr.push({url:rootPath+tilesPath+'2k_'+tI+'_'+i+'_'+j+'.jpg',face:tI%6,i:i,j:j,index:index})
                        }
                    }
                }
            var group = new THREE.Group();
            group.quaternion.set(modelData.viewPoints[index].q[0],modelData.viewPoints[index].q[1],modelData.viewPoints[index].q[2],modelData.viewPoints[index].q[3]) 
            group.position.set(modelData.viewPoints[index].x,modelData.viewPoints[index].y-0.18,modelData.viewPoints[index].z);
            group.rotation.y+=Math.PI
            group.gid=index;
            groupArr.push(group)
            this.group=group;
            // scope.downloaded2kTexture(index,scope.group,plane)
       
            new THREE.CubeTextureLoader().load(scope.smallUrls[index], function(t) {

            var item = scope._getIdle();
            item.index = index;
            item.visitNum = ++scope.visitNum;
            item.texture1 = t;
            item.texture2 = null;
             scope._onTextureLoaded(index, t);
            for(var j=0;j<groupArr.length;j++){
                groupArr[j].visible=false;
            }
            // if (ifcanmove) {
                setTimeout(function() {
                    setWalkingViewPoint(index);
                    scope.downloaded2kTexture(index,scope.group,plane)
                    
                    // scope.load2KTexture(index)
                }, 0)
          
            // }

            // if (index == scope.loadingIndex) { //避免无效加载
            //     scope._loadHighTexture(index);
            // }
        },function(loaded){
            // console.log(anchorManager)
            anchorManager.loadingTexture(index,loaded);

        });
                    
        // }

        }
    },
 

    deleteGroup(group) {
        //console.log(group);
        if (!group) return;
        // 删除掉所有的模型组内的mesh
  
        group.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
                item.geometry.dispose(); // 删除几何体
                item.material.dispose(); // 删除材质
                                
                
            }
        });
        scene.remove(group)
    },


    downloaded2kTexture(index,group,plane,mesh1){
        var scope=this;
        if(scope.textureArr.length>0){
            if(mesh1){
                meshArr.push(mesh1);
            }
            // $.ajax({
            //     type:'get',
            //       url: scope.textureArr[0].url,
            //       success: function(data) {

                    // let plane = new THREE.PlaneGeometry(planeX,planeX,100);
                    if(!scope.textureArr[0]){
                        return;
                    }
                   let  mat =new THREE.MeshBasicMaterial({
                        map:new THREE.TextureLoader().load(scope.textureArr[0].url,function(){
                            // mesh.visible=true;
                            scope.textureArr.shift();
                            scope.downloaded2kTexture(index,scope.group,plane,mesh);
                        }),
                        depthTest:false,
                        side:THREE.FrontSide 
                    })
                    let mesh=new THREE.Mesh(plane, mat);
                    mesh.visible=false;
                    mesh.renderOrder = 50;
                     mesh.id=scope.textureArr[0].index;
                    if(scope.textureArr[0].index==group.gid){
                        group.add(mesh)

                    }
           
                    switch ( scope.textureArr[0].face)
                    {
                        case 0 :
                        {
                            mesh.position.set(planeX*(2),planeX*(-scope.textureArr[0].j+1.7),planeX*(-1.5+scope.textureArr[0].i))
                            mesh.rotateY(-Math.PI/2);
                            break;
                        }
                        case 1 :
                        {
                            mesh.position.set(planeX*(-2),planeX*(-scope.textureArr[0].j+1.7),planeX*(1.5-scope.textureArr[0].i))
                            mesh.rotateY(Math.PI/2)
                            break;
                        }
                        case 2 :
                        {
                            mesh.position.set(planeX*(scope.textureArr[0].i-1.5),planeX*(2.2),planeX*(-scope.textureArr[0].j+1.5))
                            mesh.rotateX(Math.PI/2)
                            break;
                        }
                        case 3 :
                        {
                            mesh.position.set(planeX*(scope.textureArr[0].i-1.5),planeX*(-1.8),planeX*(scope.textureArr[0].j-1.5))
                            mesh.rotateX(-Math.PI/2)
                            break;
                        }
                        case 4 :
                        {
                            mesh.position.set(planeX*(-1.5+scope.textureArr[0].i),planeX*(-scope.textureArr[0].j+1.7),planeX*(-2))

                            break;
                        }
                        case 5 :
                        {
                            mesh.position.set(planeX*(1.5-scope.textureArr[0].i),planeX*(-scope.textureArr[0].j+1.7),planeX*2)
                            mesh.rotateY(Math.PI)
                            break;
                        }
                    }
              
            //       }
            //    });
        }
    },
    fetchWantingTexture(index,mesh1){
        var scope=this;
        if(scope.textureArr.length>0){

        for(var i=0;i<groupArr.length;i++){
            if(groupArr[i].gid==index){
                this.group=groupArr[i]
            }
        }
        if(mesh1){
            meshArr.push(mesh1);
        }
        for(var i=0;i<this.group.children.length;i++){

            // console.log(this.group.children[i].material.map.image)
            if(this.group.children[i].material.map.image&&this.group.children[i].material.map.image.src.indexOf(scope.textureArr[0].url)!=-1){
                scope.textureArr.shift();
                scope.fetchWantingTexture(index);
                return ;
            }
        }
        // $.ajax({
        //     type:'get',
        //       url: scope.textureArr[0].url,
        //       success: function(data) {

                let plane = new THREE.PlaneGeometry(planeX,planeX,100);
                if(!scope.textureArr[0].url){
                    return;
                }
                let mat =new THREE.MeshBasicMaterial({
                    map:new THREE.TextureLoader().load(scope.textureArr[0].url,function(){
                        // mesh.visible=true;
                        scope.textureArr.shift();
                        scope.fetchWantingTexture(index,mesh);
                    }),
                    depthTest:false,
                    side:THREE.DoubleSide 
                })

                let mesh=new THREE.Mesh(plane, mat);
                mesh.visible=false;
                mesh.renderOrder = 50;
                scope.group.add(mesh)
         
                switch ( scope.textureArr[0].face)
                {
                    case 0 :
                    {
                        mesh.position.set(planeX*(2),planeX*(-scope.textureArr[0].j+1.7),planeX*(-1.5+scope.textureArr[0].i))
                        mesh.rotateY(-Math.PI/2);
                        break;
                    }
                    case 1 :
                    {
                        mesh.position.set(planeX*(-2),planeX*(-scope.textureArr[0].j+1.7),planeX*(1.5-scope.textureArr[0].i))
                        mesh.rotateY(Math.PI/2)
                        break;
                    }
                    case 2 :
                    {
                        mesh.position.set(planeX*(scope.textureArr[0].i-1.5),planeX*(2.2),planeX*(-scope.textureArr[0].j+1.5))
                        mesh.rotateX(Math.PI/2)
                        break;
                    }
                    case 3 :
                    {
                        mesh.position.set(planeX*(scope.textureArr[0].i-1.5),planeX*(-1.8),planeX*(scope.textureArr[0].j-1.5))
                        mesh.rotateX(-Math.PI/2)
                        break;
                    }
                    case 4 :
                    {
                        mesh.position.set(planeX*(-1.5+scope.textureArr[0].i),planeX*(-scope.textureArr[0].j+1.7),planeX*(-2))

                        break;
                    }
                    case 5 :
                    {
                        mesh.position.set(planeX*(1.5-scope.textureArr[0].i),planeX*(-scope.textureArr[0].j+1.7),planeX*2)
                        mesh.rotateY(Math.PI)
                        break;
                    }
                }
               
        //       }
        //    });
        }
    },
    update() {
        var face = this.loadingData.updatedFaces;
        if (face < 6 && this.loadingData.index == this.loadingIndex && --this.frameCount == 0) {
            this.frameCount = 1;
            var textureProperties = this.renderer.properties.get(this.cubeTexture);
            var activeTexture = this.gl.getParameter(this.gl.TEXTURE_BINDING_CUBE_MAP);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.cubeTexture.flipY);
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, this.glFormat, this.glFormat, this.glType, this.loadingData.images[face]);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, activeTexture);
            if (++this.loadingData.updatedFaces == 6) {
                this._onTextureLoaded(this.loadingData.index, this.cubeTexture);
            }
        }
    },
    _loadHighTexture(index) { //加载高清纹理
        
        var scope = this;
        var r = scope._getLoadIndex(index);
        if (r == -1) return;
        scope.loaded[r].visitNum == ++scope.visitNum; //修改访问计数
        if (scope.loaded[r].texture2 != null) { //已加载高清
            return;
        }
        new THREE.CubeTextureLoader().load(scope.cubeUrls[index], function (t) {
            //scope._onTextureLoaded(index, t); //原立即加载
            scope.loaded[r].texture2 = t;
            scope.loadingData.index = index;
            scope.loadingData.images = t.images;
            scope.loadingData.updatedFaces = 0;
            scope.cubeTexture = new THREE.CubeTexture()
            for (var i = 0; i < 6; ++i) {
                scope.cubeTexture.images[i] = scope.dataTexture;
            }
            scope.cubeTexture.needsUpdate = true;
            scope.renderer.setTextureCube(scope.cubeTexture, 0);
            scope.cubeTexture.needsUpdate = false;
            //renderer.setTextureParameters(gl.TEXTURE_CUBE_MAP, tCube, true );
            var textureProperties = scope.renderer.properties.get(scope.cubeTexture);
            var activeTexture = scope.gl.getParameter(scope.gl.TEXTURE_BINDING_CUBE_MAP);
            scope.gl.bindTexture(scope.gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
            scope.gl.texParameteri(scope.gl.TEXTURE_CUBE_MAP, scope.gl.TEXTURE_WRAP_S, scope.glutils.convert(scope.cubeTexture.wrapS));
            scope.gl.texParameteri(scope.gl.TEXTURE_CUBE_MAP, scope.gl.TEXTURE_WRAP_T, scope.glutils.convert(scope.cubeTexture.wrapT));
            scope.gl.texParameteri(scope.gl.TEXTURE_CUBE_MAP, scope.gl.TEXTURE_MAG_FILTER, scope.glutils.convert(THREE.LinearFilter));
            scope.gl.texParameteri(scope.gl.TEXTURE_CUBE_MAP, scope.gl.TEXTURE_MIN_FILTER, scope.glutils.convert(THREE.LinearFilter));
            scope.gl.bindTexture(scope.gl.TEXTURE_CUBE_MAP, activeTexture);
        });
    },
    _onTextureLoaded(index, t) {
        t.generateMipmaps = false;
        t.minFilter = THREE.LinearFilter;
        this.cbLoadComplete(index, t);
    },
    _getIdle() { //获取最后访问节点或者新节点（缓存尚未满时）
        var item;
        if (this.loaded.length < this.cacheSize) {
            item = {};
            this.loaded.push(item);
        } else {
            item = this.loaded[0];
            for (var i = 1; i < this.loaded.length; ++i) {
                if (this.loaded[i].visitNum < item.visitNum) {
                    item = this.loaded[i];
                }
            }
            item.texture1.dispose();
            for(var j=0;j<groupArr.length;j++){
                if(groupArr[j].gid==item.index){
                    this.deleteGroup(groupArr[j])
                    // for(var k=0;k<groupArr[j].children.length;k++){
                        // groupArr[j].children[k].material.map=null;
                        groupArr[j]=null;
                        delete groupArr[j]
                        // scene.remove( groupArr[j])
                    // }
                    groupArr.splice(j,1);
                }
            }
        }
        return item;
    },
    _getLoadIndex(index) {
        for (var i = 0; i < this.loaded.length; ++i) {
            if (this.loaded[i].index == index) return i;
        }
        return -1;
    }
});

//TextureManager.js end

//VideoController.js

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
        targetMoved=true;
        console.log("moveTo", index);
        if (playstage) {
            pause = true;
        }
        if (index == -1) return;
        // var vp = this.modelData.viewPoints[index];
        // if (vp.inlineVideo) {
        //     var count = vp.inlineVideo.length;
        //     for (var i = 0; i < count; ++i) {
        //         var videoData = this._getVideoData(vp.inlineVideo[i].index);
        //         if (videoData.src.endsWith(".webm") || videoData.src.endsWith(".mp4")) {
        //             this.videos[i].src = videoData.src;
        //         } else {
        //             this.videos[i].src = videoData.src + this.ext;
        //         }
        //         this.videoPlanes[i].scale.x = vp.inlineVideo[i].width;
        //         this.videoPlanes[i].scale.y = vp.inlineVideo[i].height;
        //         var pos = vp.inlineVideo[i].position;
        //         this.videoPlanes[i].position.set(pos.x, pos.y, pos.z);
        //         this.videoPlanes[i].lookAt(vp.x, vp.y, vp.z);
        //     }
        //     this.currentIndex = index;
        // }
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

//VideoController.js end

//AnimateControl.js

function AnimateControl(data) {
    this.data = data;
    this.commands = {};
    this.addCommand(new ScriptCommand());
    this.clock = new THREE.Clock(); //计时器
    this.playing = false;
    this.timeElapsed = 0.0; //已播放时间
    this.currentFrames = []; //当前所有帧（命令）
    this.currentFrame = 0; //当前待播放帧索引，要求数据按起始时间排序
    this.execFrames = []; //当前执行中的命令
    this.signalStop = new signals.Signal();
}
AnimateControl.Stoped = 0;
AnimateControl.Playing = 1;
AnimateControl.Pause = 2;
Object.assign(AnimateControl.prototype, {
    addCommand(command) {
        this.commands[command.getType()] = command;
    },
    getState() {
        if (this.playing) return AnimateControl.Playing;
        if (this.execFrames.length == 0 && this.currentFrame >= this.currentFrames.length)
            return AnimateControl.Stoped;
        return AnimateControl.Pause;
    },
    play(name) {
        if (!this.data.hasOwnProperty(name)) return;
        this.currentFrames = this.data[name].frames;
        this.currentFrame = 0;
        this.execFrames = [];
        this.playing = true;
        this.timeElapsed = 0;
        this.clock.start();
        this.update();
    },
    pause() {
        this.clock.stop();
        this.playing = false;
        for (var i = this.execFrames.length - 1; i >= 0; --i) {
            var frame = this.execFrames[i];
            var command = this.commands[frame.type];
            if (command) {
                this.commands[frame.type].pause(frame);
            }
        }
    },
    continue() {
        this.clock.start();
        this.playing = true;
        for (var i = this.execFrames.length - 1; i >= 0; --i) {
            var frame = this.execFrames[i];
            var command = this.commands[frame.type];
            if (command) {
                this.commands[frame.type].continue(frame);
            }
        }
    },
    stop() {
        for (var i = this.execFrames.length - 1; i >= 0; --i) {
            var frame = this.execFrames[i];
            var command = this.commands[frame.type];
            if (command) {
                this.commands[frame.type].stop(frame);
            }
        }
        this.playing = false;
        this.currentFrames = [];
        this.currentFrame = 0;
        this.execFrames = [];
        this.signalStop.dispatch();
    },
    update() {
        if (!this.playing) return;
        this.timeElapsed += this.clock.getDelta();
        //更新播放
        for (var i = this.execFrames.length - 1; i >= 0; --i) {
            var frame = this.execFrames[i];
            if (this.timeElapsed > frame.start + frame.duration) { //结束
                this.execFrames.splice(i, 1);
                this.commands[frame.type].stop(frame);
                if (this.execFrames.length == 0 && this.currentFrame >= this.currentFrames.length) {
                    this.stop();
                }
            } else {
                if (frame.update) {
                    this.commands[frame.type].update(frame, this.timeElapsed - frame.start)
                }
            }
        }
        //开始播放
        while (this.currentFrame < this.currentFrames.length &&
            this.currentFrames[this.currentFrame].start <= this.timeElapsed) {
            var frame = this.currentFrames[this.currentFrame];
            var command = this.commands[frame.type];
            if (command) {
                this.execFrames.push(frame);
                command.start(frame);
            }
            ++this.currentFrame;
        }
    }
});

//AnimateControl.js end

//Module3D.js

function Module3D(renderder, scene, cameraController) {
    this.renderer = renderder;
    this.scene = scene;
    this.cameraController = cameraController;
}
Object.assign(Module3D.prototype, {
    setSize(width, height) {
        this.cameraController.resize(width, height);
        this.renderer.setSize(width, height);
    },
    getSize() {
        this.renderer.getSize();
    },
    getImgData(width, height) {
        var size = this.renderer.getSize();
        this.renderer.setSize(width, height, true);
        var cam = this.cameraController.getCurrentCamera();
        var aspectOld = cam.aspect;
        cam.aspect = width / height;
        cam.updateProjectionMatrix();
        
        this.renderer.render(this.scene, cam);
        var data = this.renderer.domElement.toDataURL('image/jpeg', 0.75);
        cam.aspect = aspectOld;
        cam.updateProjectionMatrix();
        this.renderer.setSize(size.width, size.height);
        return data;
    },
    //获取当前鼠标点位置
    getAnchorPoint() {
        return anchorManager.anchorPoint.clone();
    },
    //获取当前鼠标点位置法线
    getAnchorNormal() {
        return anchorManager.anchorNormal.clone();
    },
    //根据位置法线距离计算点坐标
    calcPosition(point, normal, distance) {
        return new THREE.Vector3(
            point.x + normal.x * distance,
            point.y + normal.y * distance,
            point.z + normal.z * distance
        )
    },
    //当前点索引
    getBubbleIndex() {
        return targetIndex;
    },
    //获取可以看到pos的位置点索引,maxLen最远可见距离，默认20；此方法比较耗时，不要高频调用
    getVisibleBubbleList(pos, maxLen) {
        maxLen = maxLen || 20;
        let list = [];
        for (let i = 0; i < viewPoint.length; ++i) {
            let pt = viewPoint[i];
            let dir = new THREE.Vector3(pos.x - pt.x, pos.y - pt.y, pos.z - pt.z);
            let len = dir.length() - 0.1;
            if (len < maxLen) {
                let raycaster = new THREE.Raycaster(pt, dir.normalize(), 0, len);
                let found = false;
                model.traverse(function (child) {
                    if (child.isMesh && !found) {
                        let intersects = raycaster.intersectObject(child);
                        if (intersects.length > 0 && intersects[0].distance < len) {
                            found = true;
                        }
                    }
                });
                if (!found) {
                    list.push(i);
                }
            }
        }
        return list;
    }
});

//Module3D.js end

//ScriptCommand.js
//播放控制
function ScriptCommand() {

}

Object.assign(ScriptCommand.prototype, {
    getType() {
        return "script";
    },
    start(frame) {
        eval(frame.data);
    },
    update(frame, timeElapsed) { },
    pause(frame) { },
    continue(frame) { },
    stop(frame) { }
});

//ScriptCommand.js end

//multithread.js
! function () {

    var URL = window.URL || window.webkitURL;
    if (!URL) {
        throw new Error('This browser does not support Blob URLs');
    }

    if (!window.Worker) {
        throw new Error('This browser does not support Web Workers');
    }

    function Multithread(threads) {
        this.threads = Math.max(2, threads | 0);
        this._queue = [];
        this._queueSize = 0;
        this._activeThreads = 0;
        this._debug = {
            start: 0,
            end: 0,
            time: 0
        };
    }

    Multithread.prototype._worker = {
        JSON: function () {
            var /**/ name /**/ = ( /**/ func /**/);
            self.addEventListener('message', function (e) {
                var data = e.data;
                var view = new DataView(data);
                var len = data.byteLength;
                var str = Array(len);
                for (var i = 0; i < len; i++) {
                    str[i] = String.fromCharCode(view.getUint8(i));
                }
                var args = JSON.parse(str.join(''));
                var value = ( /**/ name /**/).apply( /**/ name /**/, args);
                try {
                    data = JSON.stringify(value);
                } catch (e) {
                    throw new Error('Parallel function must return JSON serializable response');
                }
                len = typeof (data) === 'undefined' ? 0 : data.length;
                var buffer = new ArrayBuffer(len);
                view = new DataView(buffer);
                for (i = 0; i < len; i++) {
                    view.setUint8(i, data.charCodeAt(i) & 255);
                }
                self.postMessage(buffer, [buffer]);
                self.close();
            })
        },
        Int32: function () {
            var /**/ name /**/ = ( /**/ func /**/);
            self.addEventListener('message', function (e) {
                var data = e.data;
                var view = new DataView(data);
                var len = data.byteLength / 4;
                var arr = Array(len);
                for (var i = 0; i < len; i++) {
                    arr[i] = view.getInt32(i * 4);
                }
                var value = ( /**/ name /**/).apply( /**/ name /**/, arr);
                if (!(value instanceof Array)) {
                    value = [value];
                }
                len = value.length;
                var buffer = new ArrayBuffer(len * 4);
                view = new DataView(buffer);
                for (i = 0; i < len; i++) {
                    view.setInt32(i * 4, value[i]);
                }
                self.postMessage(buffer, [buffer]);
                self.close();
            })
        },
        Float64: function () {
            var /**/ name /**/ = ( /**/ func /**/);
            self.addEventListener('message', function (e) {
                var data = e.data;
                var view = new DataView(data);
                var len = data.byteLength / 8;
                var arr = Array(len);
                for (var i = 0; i < len; i++) {
                    arr[i] = view.getFloat64(i * 8);
                }
                var value = ( /**/ name /**/).apply( /**/ name /**/, arr);
                if (!(value instanceof Array)) {
                    value = [value];
                }
                len = value.length;
                var buffer = new ArrayBuffer(len * 8);
                view = new DataView(buffer);
                for (i = 0; i < len; i++) {
                    view.setFloat64(i * 8, value[i]);
                }
                self.postMessage(buffer, [buffer]);
                self.close();
            })
        }
    };

    Multithread.prototype._encode = {
        JSON: function (args) {
            try {
                var data = JSON.stringify(args);
            } catch (e) {
                throw new Error('Arguments provided to parallel function must be JSON serializable');
            }
            len = data.length;
            var buffer = new ArrayBuffer(len);
            var view = new DataView(buffer);
            for (var i = 0; i < len; i++) {
                view.setUint8(i, data.charCodeAt(i) & 255);
            }
            return buffer;
        },
        Int32: function (args) {
            len = args.length;
            var buffer = new ArrayBuffer(len * 4);
            var view = new DataView(buffer);
            for (var i = 0; i < len; i++) {
                view.setInt32(i * 4, args[i]);
            }
            return buffer;
        },
        Float64: function (args) {
            len = args.length;
            var buffer = new ArrayBuffer(len * 8);
            var view = new DataView(buffer);
            for (var i = 0; i < len; i++) {
                view.setFloat64(i * 8, args[i]);
            }
            return buffer;
        }
    };

    Multithread.prototype._decode = {
        JSON: function (data) {
            var view = new DataView(data);
            var len = data.byteLength;
            var str = Array(len);
            for (var i = 0; i < len; i++) {
                str[i] = String.fromCharCode(view.getUint8(i));
            }
            if (!str.length) {
                return;
            } else {
                return JSON.parse(str.join(''));
            }
        },
        Int32: function (data) {
            var view = new DataView(data);
            var len = data.byteLength / 4;
            var arr = Array(len);
            for (var i = 0; i < len; i++) {
                arr[i] = view.getInt32(i * 4);
            }
            return arr;
        },
        Float64: function (data) {
            var view = new DataView(data);
            var len = data.byteLength / 8;
            var arr = Array(len);
            for (var i = 0; i < len; i++) {
                arr[i] = view.getFloat64(i * 8);
            }
            return arr;
        },
    };

    Multithread.prototype._execute = function (resource, args, type, callback) {
        if (!this._activeThreads) {
            this._debug.start = (new Date).valueOf();
        }
        if (this._activeThreads < this.threads) {
            this._activeThreads++;
            var t = (new Date()).valueOf();
            var worker = new Worker(resource);
            var buffer = this._encode[type](args);
            var decode = this._decode[type];
            var self = this;
            if (type === 'JSON') {
                var listener = function (e) {
                    callback.call(self, decode(e.data));
                    self.ready();
                };
            } else {
                var listener = function (e) {
                    callback.apply(self, decode(e.data));
                    self.ready();
                };
            }
            worker.addEventListener('message', listener);
            worker.postMessage(buffer, [buffer]);
        } else {
            this._queueSize++;
            this._queue.push([resource, args, type, callback]);
        }
    };

    Multithread.prototype.ready = function () {
        this._activeThreads--;
        if (this._queueSize) {
            this._execute.apply(this, this._queue.shift());
            this._queueSize--;
        } else if (!this._activeThreads) {
            this._debug.end = (new Date).valueOf();
            this._debug.time = this._debug.end - this._debug.start;
        }
    };

    Multithread.prototype._prepare = function (fn, type) {

        fn = fn;

        var name = fn.name;
        var fnStr = fn.toString();
        if (!name) {
            name = '$' + ((Math.random() * 10) | 0);
            while (fnStr.indexOf(name) !== -1) {
                name += ((Math.random() * 10) | 0);
            }
        }

        var script = this._worker[type]
            .toString()
            .replace(/^.*?[\n\r]+/gi, '')
            .replace(/\}[\s]*$/, '')
            .replace(/\/\*\*\/name\/\*\*\//gi, name)
            .replace(/\/\*\*\/func\/\*\*\//gi, fnStr);

        var resource = URL.createObjectURL(new Blob([script], {
            type: 'text/javascript'
        }));

        return resource;

    };

    Multithread.prototype.process = function (fn, callback) {

        var resource = this._prepare(fn, 'JSON');
        var self = this;

        return function () {
            self._execute(resource, [].slice.call(arguments), 'JSON', callback)
        };

    };

    Multithread.prototype.processInt32 = function (fn, callback) {

        var resource = this._prepare(fn, 'Int32');
        var self = this;

        return function () {
            self._execute(resource, [].slice.call(arguments), 'Int32', callback)
        };

    };

    Multithread.prototype.processFloat64 = function (fn, callback) {

        var resource = this._prepare(fn, 'Float64');
        var self = this;

        return function () {
            self._execute(resource, [].slice.call(arguments), 'Float64', callback)
        };

    };

    window['Multithread'] = Multithread;

}();
//multithread.js end

//main.js
"use strict";

var debugMode = false || document.URL.indexOf('debug') > 0;
var modelData;
var ismouseMoved = false;
var container;
var scene, renderer;
var anchorManager; //扫描点指示图标
var materialSwitch; //材质切换控制
var modeSwitch; //视图切换
var cameraController; //相机移动控制
var textureManager; //材质加载
var videoController; //视频纹理管理
var animateControl; //动画播放控制
var module3D; // 3D控制模块，对外接口
var pointerLockControl, orbitControl;
var modelCenter = new THREE.Vector3(); //模型中心
var modelSize = 30; //模型包围盒对角线长度
var modelmaxX; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning
var modelmaxY; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning
var pointerLockCamera, orbitCamera, orthoCamera;
var model = null; //模型
var modelMiniMap; //模型
var cube; //展示立方图正方体
var underCompass; //下方图片
var viewPoint = []; //vector3 各视点位置
var viewPointQ = []; //vector4， 各视点立方图旋转
var nearestPointsIndex;
var targetIndex = -1; //目标位置索引
var targetMoved = false; //是否已移动到目标点
var curIndex = -1;
var changeToOrthographic = false; //转换为正交视图
var orthographicCallback; //转换后回调
var TagControlWalk = true; //判断点击在标签上不进行移动20181015
var MeshMove = false;
var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
var isMobile = isIOS || /Android|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);

function getQueryString(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2]));
    return null;

}
var dirname = getQueryString('p');

var scanPath = '';
var tilesPath=''
if(isMobile){
    tilesPath='tiles_m2/';
}
else{
    tilesPath='tiles_p/';
}
if (getQueryString('p') != null) {
    // rootPath = "https://todo.kangyun3d.cn/scanItems/path/" + getQueryString('p') + '/';
    rootPath = "./path/" + getQueryString('p') + '/';

    scanPath = getQueryString('p')+'/';
}
else{
    rootPath = "https://todo.kangyun3d.cn/scanItems/path/" + getQueryString('p') + '/';
    rootPath = './1235/';

    scanPath = getQueryString('p')+'/';
}


var imagePath = rootPath + '1k/';
var limagePath = rootPath + '1k/';
var fileExt = ".jpg"; //webp

container = document.getElementById('container');
renderer = new THREE.WebGLRenderer();

var background = new THREE.Color(0x181a1c);
renderer.setClearColor(background);
//renderer.autoClearColor = false;
renderer.setPixelRatio(window.devicePixelRatio);

//模型加载
var ifKEy = true;
function onWindowResize() {
    
    if (ifKEy) {
        // //百度地图加载
        // var map = new BMap.Map("allmap");
        // var point = new BMap.Point(longitude, latitude);
        // var marker = new BMap.Marker(point); // 创建标注
        // map.addOverlay(marker); // 将标注添加到地图中
        // map.centerAndZoom(point, 15);
        // map.enableScrollWheelZoom(true);
        // map.disableDragging();
        // var opts = {
        //     width: 200, // 信息窗口宽度
        //     height: 100, // 信息窗口高度
        //     title: initAddress, // 信息窗口标题
        //     enableMessage: true, //设置允许信息窗发送短息
        //     message: ""
        // }
        // var infoWindow = new BMap.InfoWindow(initAddress, opts); // 创建信息窗口对象 
        // marker.addEventListener("click", function () {
        //     map.openInfoWindow(infoWindow, point); //开启信息窗口
        // });
        // // 创建地址解析器实例
        // var myGeo = new BMap.Geocoder();
        // // 将地址解析结果显示在地图上,并调整地图视野
        // myGeo.getPoint(initAddress, function (point) {
        //     if (point) {
        //         map.centerAndZoom(point, 16);
        //         map.addOverlay(new BMap.Marker(point));
        //     } else {
        //         console.log("您选择地址没有解析到结果!");
        //     }
        // }, "广州市");
        // ifKEy = false;
    }
    $('.js-modal').hide();
    renderer.setSize(window.innerWidth, window.innerHeight);
    module3D.setSize(window.innerWidth, window.innerHeight);
}

renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);

renderer.domElement.addEventListener('mousedown', onMouseDown, false); ////避免不能点击其他元素
document.addEventListener('mouseup', onMouseUp, false); //renderer.domElement无法释放！
document.addEventListener('click', ondblclick, false);
renderer.domElement.addEventListener('mousemove', onMainMouseMove, false);
//renderer.domElement.addEventListener('click', mainOnClick, false);
renderer.domElement.addEventListener('touchstart', onTouchStart, {
    passive: false
});
renderer.domElement.addEventListener('touchend', onTouchEnd, false);
renderer.domElement.addEventListener('touchmove', onTouchMove, {
    passive: false
});
renderer.domElement.style.opacity=1;
scene = new THREE.Scene();
var ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

//设置模型背景
$("#smg").fadeOut(800);//背景图隐藏
var texture = new THREE.TextureLoader().load("image/background.jpg");
scene.background = texture;

// 改为获取接口model.json数据
var get_scan_model = function () {
    "use strict";
    return new Promise((resolve, reject) => {
        $.post(phpedit_url + "edit/get_scan_model", {
            path: scanPath
        }, function (data) {
            let res = JSON.parse(data);
            if (res.code == 200) {
                console.log('开始5')
                resolve(res.data);

            } else {
                reject(res.message)
                
            }
        })
    })
}
get_scan_model()
    .then((data) => {
        modelData = data;
        var cubeUrls = [];
        var smallUrls = [];
        for (var i = 0, len = modelData.viewPoints.length; i < len; ++i) {
            var pt = modelData.viewPoints[i];
            viewPoint.push(new THREE.Vector3(pt.x, pt.y, pt.z));
            var q = pt.q;
            viewPointQ.push(new THREE.Vector4(-q[0], -q[1], -q[2], q[3]));
            var urls = [];
            var urls2 = [];
            for (var j = 0; j < 6; ++j) {
                urls.push(imagePath + (i * 6 + j) + fileExt);
                urls2.push(limagePath + (i * 6 + j) + fileExt);
            }    
            cubeUrls.push(urls);
            smallUrls.push(urls2);
        }
        
        if (isMobile) {
            textureManager = new TextureManager(renderer, smallUrls, smallUrls, onTexutueLoaded);
        } else {
            textureManager = new TextureManager(renderer, cubeUrls, smallUrls, onTexutueLoaded);
        }

        init();
        initNearestPoint();
        setupOption();
    })
    .catch((err) => {
        console.log(err);
        localModel();
        
    })
    


// localModel();
// 本地测试
function localModel() {
           $.ajax({
                type:'get',
                  url: rootPath + "model.json",
                  success: function(obj) {
                    modelData = obj;
                    var cubeUrls = [];
                    var smallUrls = [];
              
                    for (var i = 0, len = modelData.viewPoints.length; i < len; ++i) {
                        var pt = modelData.viewPoints[i];
                        viewPoint.push(new THREE.Vector3(pt.x, pt.y, pt.z));
                        var q = pt.q;
                        viewPointQ.push(new THREE.Vector4(-q[0], -q[1], -q[2], q[3]));
                        var urls = [];
                        var urls2 = [];
                        for (var j = 0; j < 6; ++j) {
                            urls.push(imagePath + (i * 6 + j) + fileExt);
                            urls2.push(limagePath + (i * 6 + j) + fileExt);
                        }
                        cubeUrls.push(urls);
                        smallUrls.push(urls2);
                    }
                    if (isMobile) {
                        textureManager = new TextureManager(renderer, smallUrls, smallUrls, onTexutueLoaded);
                    } else {
                        textureManager = new TextureManager(renderer, cubeUrls, smallUrls, onTexutueLoaded);
                    }
            
                    init();
                    initNearestPoint();
                    // setupOption();
                  },
                  error:function(a,b,c){
                    get_scan_model()
                        .then((data) => {
                            modelData = data;
                            var cubeUrls = [];
                            var smallUrls = [];
                            for (var i = 0, len = modelData.viewPoints.length; i < len; ++i) {
                                var pt = modelData.viewPoints[i];
                                viewPoint.push(new THREE.Vector3(pt.x, pt.y, pt.z));
                                var q = pt.q;
                                viewPointQ.push(new THREE.Vector4(-q[0], -q[1], -q[2], q[3]));
                                var urls = [];
                                var urls2 = [];
                                for (var j = 0; j < 6; ++j) {
                                    urls.push(imagePath + (i * 6 + j) + fileExt);
                                    urls2.push(limagePath + (i * 6 + j) + fileExt);
                                }
                                cubeUrls.push(urls);
                                smallUrls.push(urls2);
                            }

                            if (isMobile) {
                                textureManager = new TextureManager(renderer, smallUrls, smallUrls, onTexutueLoaded);
                            } else {
                                textureManager = new TextureManager(renderer, cubeUrls, smallUrls, onTexutueLoaded);
                            }

                            init();
                            initNearestPoint();
                            setupOption();
                        })
                        .catch((err) => {
                            console.log(err);
                            localModel();
                        })
                    
                  }
                })

    // $.getJSON(rootPath + "model.json?ver=" + Math.random(), function (obj) {
        
    //     modelData = obj;
    //     console.log(modelData)
    //     var cubeUrls = [];
    //     var smallUrls = [];
  
    //     for (var i = 0, len = modelData.viewPoints.length; i < len; ++i) {
    //         var pt = modelData.viewPoints[i];
    //         viewPoint.push(new THREE.Vector3(pt.x, pt.y, pt.z));
    //         var q = pt.q;
    //         viewPointQ.push(new THREE.Vector4(-q[0], -q[1], -q[2], q[3]));
    //         var urls = [];
    //         var urls2 = [];
    //         for (var j = 0; j < 6; ++j) {
    //             urls.push(imagePath + (i * 6 + j) + fileExt);
    //             urls2.push(limagePath + (i * 6 + j) + fileExt);
    //         }
    //         cubeUrls.push(urls);
    //         smallUrls.push(urls2);
    //     }
    //     if (isMobile) {
    //         textureManager = new TextureManager(renderer, smallUrls, smallUrls, onTexutueLoaded);
    //     } else {
    //         textureManager = new TextureManager(renderer, cubeUrls, smallUrls, onTexutueLoaded);
    //     }

    //     init();
    //     initNearestPoint();
    //     // setupOption();
    // });
}

function init() {
    document.body.addEventListener('touchmove', function (e) {
        var target = e.target;
        if(target.id != 'houseDetail'){//不是房屋详情的地方，都阻止下拉滑动的效果
            e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
        }
    }, {
            passive: false
        });

    var aspect = window.innerWidth / window.innerHeight;
    pointerLockCamera = new THREE.PerspectiveCamera(92, aspect, 0.2, 5000);
    orbitCamera = new THREE.PerspectiveCamera(65, aspect, 0.2, 5000);
    orthoCamera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.5, 5000);
    scene.add(orbitCamera);
    pointerLockControl = new THREE.PointerLockControls(pointerLockCamera);
    //pointerLockControl.enabled = true;
    scene.add(pointerLockControl.getObject());
    orbitControl = new THREE.OrbitControls(orbitCamera, renderer.domElement);
    orbitControl.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    orbitControl.dampingFactor = 0.1; // 0.25 3D视角阻尼;
    orbitControl.enablePan = true;
    orbitControl.enableZoom = true; //20180914_ning
    orbitControl.panningMode = THREE.HorizontalPanning; // default is THREE.ScreenSpacePanning
    orbitControl.panSpeed = 0.1; //20180914_ning
    orbitControl.maxPolarAngle = Math.PI / 2;
    //Set the farthest distance from the origin of the camera
    orbitControl.minDistance = 30;
    //Set the farthest distance from the origin of the camera 
    orbitControl.maxDistance = 80;
    //orbitControl.enablePan = debugMode;
    if (debugMode) {
        orbitControl.maxPolarAngle = Math.PI;
        var axesHelper = new THREE.AxesHelper(15);
        scene.add(axesHelper);
    }
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    videoController = new VideoController(modelData, scene, !isAndroid && !isiOS);
    //load model
    var loader = new THREE.GLTFLoader();
    if (document.URL.indexOf('nomodel') == -1) {
        if (modelData.modelSmall && modelData.modelSmall.length > 0) {
            loader.load(rootPath + modelData.modelSmall, function (gltf) {
                initLoadedModel(gltf.scene);
                onWindowResize();
                loader.load(rootPath + modelData.modelPath, function (gltf) {
                    scene.remove(model);
                    scene.add(gltf.scene);
                    gltf.scene.rotateX(-Math.PI * 0.5);
                    materialSwitch.updateModel(gltf.scene);
                    model = gltf.scene;
                });
            },
                undefined,
                function (error) {
                    initLoadedModel(null);
                }
            );
        } else {
            loader.load(rootPath + modelData.modelPath, function (gltf) {
                initLoadedModel(gltf.scene);
                onWindowResize();
            },
                undefined,
                function (error) {
                    //initLoadedModel(null);//进入场景出错屏蔽后正常
                }
            );
        }
    } else {
        initLoadedModel(null);
        onWindowResize();
    }

    onInit();
   var edit= document.createElement('script');
   edit.src='js/edit.js'
   document.body.appendChild(edit)
   var beike= document.createElement('script');
   beike.src='js/beiKe.js'
   document.body.appendChild(beike)


}
if(window.location.href.indexOf('localhost')!=-1){
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px'; //显示在屏幕左上角的地方。
container.appendChild( stats.domElement );//添加到container之
}


function initNearestPoint() {
    nearestPointsIndex = new Array();
    var len = viewPoint.length;
    for (var i = 0; i < len; i++) {
        var pointIndexs = getNearestKPoints(i);
        nearestPointsIndex[i] = pointIndexs;
    }
}

function initLoadedModel(group) {
    model = group;
    
    materialSwitch = new MaterialSwitch(model);
    if (model) {

        model.rotateX(-Math.PI * 0.5); //Modification of Model Direction
        scene.add(model);
        var box = new THREE.Box3();
        model.traverse(function (child) {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                box.union(child.geometry.boundingBox);
            }
        });
        //包围盒信息
        modelCenter.x = (box.max.x + box.min.x) / 2;
        modelCenter.y = (box.max.z + box.min.z) / 2;
        modelCenter.z = -(box.max.y + box.min.y) / 2;
        modelSize = box.max.clone().sub(box.min).length();
        modelData.groundHeight = box.min.z;
        modelmaxX = box.max.x; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning
        modelmaxY = box.max.y; //包圍盒尺寸用於判斷適合的縮放值 20180920Ning
        var box2 = box.clone();
        box2.min.multiplyScalar(1.1);
        box2.max.multiplyScalar(1.1);
        var sizex = box2.max.x - box2.min.x;
        var sizey = box2.max.z - box2.min.z;
        var sizez = box2.max.y - box2.min.y;
        cube = new THREE.Mesh(new THREE.BoxGeometry(sizex, sizey, sizez), materialSwitch.matCube);
        cube.position.set(box2.max.x - sizex / 2, box2.max.z - sizey / 2, -box.min.y - sizez / 2);
     
  
        
    } else {
        cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialSwitch.matCube);
        modelData.groundHeight = viewPoint[0].y - modelData.cameraHeight;
    }
    cube.geometry.scale(-1, 1, 1);
    scene.add(cube);
    var pointPath = "point5.png"; //20180914ning
    anchorManager = new AnchorManager(viewPoint, modelData.anchorSize, modelData.cameraHeight, scene, pointPath); //need groundheight
    modeSwitch = new ModeSwitch(cube, materialSwitch, onModeChange);
    cameraController = new CameraController(orbitCamera, orbitControl, pointerLockCamera, pointerLockControl, orthoCamera, modeSwitch, onMoving, onMoved);
    module3D = new Module3D(renderer, scene, cameraController);
    
    onModelLoaded();
    // $.getJSON(rootPath + "animate.json", function (obj) {
    //     animateControl = new AnimateControl(obj);
    // });

    setupCompass();
    if (model) {
        setDefaultOverallView(); //Clear the bounding box
    } else {
        modeSwitch.setWalkingMode();
        setWalkingViewPoint(0);
    }
    modelMiniMap = model.clone();
    // console.log("modelMiniMap", modelMiniMap);
    intiMiniMap();

    visibleNav(false);//一开始隐藏nav
    init_ApartmentMap();

    initComposer();
    animate();
}

//后期处理 Ning+ 20190401
var selectedObjects = [];
var composer, effectFXAA, outlinePass;

function initrenderPass(a,b) {
    renderPass = new THREE.RenderPass(a, b);
}

function initComposer() {
    // postprocessing 
    composer = new THREE.EffectComposer(renderer);

    renderPass = new THREE.RenderPass(scene, cameraController.getCurrentCamera());
    composer.addPass(renderPass);

    outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, cameraController.getCurrentCamera());
    composer.addPass(outlinePass);

    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    effectFXAA.renderToScreen = true;
    composer.addPass(effectFXAA);
    selectedObjects.push(scene);
    // console.log(selectedObjects);
    outlinePass.selectedObjects = selectedObjects;

    outlinePass.edgeStrength = 1.8; // 0.01～10 强度
    outlinePass.edgeGlow = 0.0; // 0.0～1 羽化
    outlinePass.edgeThickness = 1; // 1～4 边缘
    outlinePass.pulsePeriod = 0; // 0.0～5 周期
    outlinePass.visibleEdgeColor = new THREE.Color(0xffffff);
    outlinePass.hiddenEdgeColor = new THREE.Color(0xffffff);
}

function setupCompass() {
    
    var textureLoader = new THREE.TextureLoader();
    var compassPath = "image/" + "compass2.png";
    var mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        depthTest: false,
        transparent: true,
        opacity:0,
        map: textureLoader.load(compassPath)
        //map: textureLoader.load("image/compass.png")
    });
    var geometry = new THREE.PlaneBufferGeometry(modelData.cameraHeight * 1.2, modelData.cameraHeight * 1.2, 1);
    //var geometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 1);
    geometry.rotateX(-Math.PI / 2);
    underCompass = new THREE.Mesh(geometry, mat);
    underCompass.renderOrder = 1;
    // underCompass.visible = false;
    // underCompass.material.opacity=0;
    scene.add(underCompass);
}

var posMouseDown = {
    x: 0,
    y: 0
};

function onMouseDown(e) {
    //测量模式下3D视角进入moveto关闭 20180918ning
    if (CanvasState) {
        ismouseMoved = false;
        posMouseDown.x = e.offsetX;
        posMouseDown.y = e.offsetY;
        if ((e.buttons & 1) == 1 && modeSwitch.isWalkingMode()) {
            pointerLockControl.enabled = true;
        }
    }
    $('#previous-show').hide(100);
    $('#play-show').hide(100);
    $('#next-show').hide(100);
    $('#mapBtn3D-show').hide(100);
    $(".ControlMessage").animate({
        opacity: "0"
    }, 200);
    $('.ControlMessage').hide(200);

    // $('.titlebar-text-arrow>img').removeClass('active')
    // $('.js-slide-area').removeClass('active');
    // $('.js-modal').removeClass('active').hide();
}


function onMainMouseMove(e) {
    if (e.offsetX != posMouseDown.x || e.offsetY != posMouseDown.y) { //有时mousedown后会直接触发mousemove
        ismouseMoved = true;
    }
    var size = renderer.getSize();
    var mousex = (e.offsetX / size.width) * 2 - 1;
    var mousey = -(e.offsetY / size.height) * 2 + 1;
    anchorManager && anchorManager.updateHint(mousex, mousey);
    if (debugMode && cameraController) {
        var pos = module3D.getAnchorPoint();
        showInfo("x: " + pos.x.toFixed(2) + ", y:" + pos.y.toFixed(2) + ", z:" + pos.z.toFixed(2));
    }
    onMouseMove(e);
    $('.js-slide-area').removeClass('active');
}

var touchX;
var touchY;

function onTouchStart(event) {
    $('.js-slide-area').removeClass('active');
    ismouseMoved = false;
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;
    ismouseMoved = false;
    if (modeSwitch.isWalkingMode()) {
        pointerLockControl.enabled = true;
    }
};

function onTouchMove(event) {
    $('.js-slide-area').removeClass('active');

    var curTouchX = event.changedTouches[0].clientX;
    var curTouchY = event.changedTouches[0].clientY;

    if (curTouchX != touchX || curTouchY != touchY) { //有时mousedown后会直接触发mousemove
        ismouseMoved = true;
    }

    var size = renderer.getSize();
    var mousex = (curTouchX / size.width) * 2 - 1;
    var mousey = -(curTouchY / size.height) * 2 + 1;
    anchorManager && anchorManager.updateHint(mousex, mousey);

    if (debugMode && cameraController) {
        var pos = module3D.getAnchorPoint();
        showInfo("x: " + pos.x.toFixed(2) + ", y:" + pos.y.toFixed(2) + ", z:" + pos.z.toFixed(2));
    }

    onMouseMove(event);
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;

};

function onTouchEnd(event) {

    if (modeSwitch.isWalkingMode()) {
        pointerLockControl.enabled = true;
    }
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;
    if (!ismouseMoved) {
        // mainOnClick(event);
        // ondblclick(event);
    }

}

function onMouseUp(e) {

    if (e.buttons == 0 && modeSwitch.isWalkingMode()) {
        pointerLockControl.enabled = false;
    }

    if (modeSwitch.isWalkingMode()) {
        mainOnClick(e);
    }

}

function ondblclick(e) {

    if (ismouseMoved) return;
    var size = renderer.getSize();
    var mousex = (e.offsetX / size.width) * 2 - 1;
    var mousey = -(e.offsetY / size.height) * 2 + 1;
    var vector;
    var mousePoint;
    if(cameraController.moving){
        return ;
    }
    // document.getElementsByClassName('title-change')[0].setAttribute('style', 'display:none');
    if (modeSwitch.isOverallMode()) {
        // 设置漫游按钮
        $('.js-minimap-buttons').children().removeClass('active');
        $('.js-panorama').addClass('active')
       
        vector = new THREE.Vector3(mousex, mousey, 1).unproject(orbitCamera);
        vector.sub(orbitCamera.position);
    } else if (modeSwitch.isOrthographic()) { //20180925_Ning_2D进入场景；
        orbitCamera.position.copy(orthoCamera.position);
        orbitCamera.rotation.copy(orthoCamera.rotation);
        vector = new THREE.Vector3(mousex, mousey, 1).unproject(orbitCamera);
        vector.sub(orthoCamera.position);
    }

    if (vector != undefined) {
        vector.normalize();
    }

    if (modeSwitch.isOverallMode()) {
        let icon = 'iconfont icon-three';
        $('.nav-icon-right-top>i:first-child').attr('class', icon)

        model.visible = true;
        if (vector.y < -0.05) { //限制过于水平（远）的点击
            var matched = -1;
            var maxDot = 0.5;
            var minDot = 2.0;
            var dir = new THREE.Vector3();
            for (var i = 0; i < viewPoint.length; ++i) {
                if (modeSwitch.isOverallMode() || i != targetIndex) {
                    if (modeSwitch.isOverallMode()) {
                        //
                        dir.subVectors(viewPoint[i], orbitCamera.position);
                        // dir.set(viewPoint[i].x - orbitCamera.position.x, deltaY, viewPoint[i].z - orbitCamera.position.z);
                    } else {
                        dir.subVectors(viewPoint[i], viewPoint[targetIndex]);
                        //dir.set(viewPoint[i].x - viewPoint[targetIndex].x, deltaY, viewPoint[i].z - viewPoint[targetIndex].z);
                    }
                    dir.y -= modelData.cameraHeight;
                    dir.normalize();
                    var temp = dir.dot(vector);
                    if (temp > maxDot) {
                        maxDot = temp;
                        matched = i;
                    }
                }
            }
            if (matched != -1) {
                Location();

                textureManager.loadTexture(matched, TagControlWalk)
                // setWalkingViewPoint(matched);
                // console.log("TagControlWalk", TagControlWalk);
                visibleNav(true);
                $('#monirenxing').hide(0);
                $('#mapBtn3D').show(0);
                $('#mapBtn2D').show(0);
            }
        }
        //return;
    }
    //2D平面点击
    if (modeSwitch.isOrthographic()) {
        let icon = 'iconfont icon-three';
        $('.nav-icon-right-top>i:first-child').attr('class', icon);

        model.visible = true;
        //if (vector.y < -0.05) { //限制过于水平（远）的点击
        var matched = -1;
        var maxDot = 0.5;
        var minDot = 2.0;
        var dir = new THREE.Vector3();
        for (var i = 0; i < viewPoint.length; ++i) {
            if (modeSwitch.isOrthographic() || i != targetIndex) {
                if (modeSwitch.isOrthographic()) {
                    //
                    dir.subVectors(viewPoint[i], orthoCamera.position);
                    // dir.set(viewPoint[i].x - orthoCamera.position.x, deltaY, viewPoint[i].z - orthoCamera.position.z);
                } else {
                    dir.subVectors(viewPoint[i], viewPoint[targetIndex]);
                    //dir.set(viewPoint[i].x - viewPoint[targetIndex].x, deltaY, viewPoint[i].z - viewPoint[targetIndex].z);
                }
                //dir.y -= modelData.cameraHeight;
                dir.normalize();
                var temp = dir.dot(vector);
                // console.log("temp:",temp);
                if (temp > maxDot) {
                    maxDot = temp;
                    matched = i;
                    // console.log("temp:",temp);
                }
            }
        }
        if (matched != -1) {
            textureManager.loadTexture(matched, TagControlWalk)
            console.log("TagControlWalk", TagControlWalk);
            visibleNav(true);
            $('#monirenxing').hide(0);
            $('#mapBtn3D').show(0);
            $('#mapBtn2D').show(0);
        }
    }
}



function mainOnClick(e) {
    e.preventDefault();
    if (ismouseMoved) return;
    // 接入贴图操作
    var mousex = (e.clientX / window.innerWidth) * 2 - 1;
    var mousey = -(e.clientY / window.innerHeight) * 2 + 1;
    // return

    if (!targetMoved) {
        // if (modeSwitch.isWalkingMode()) {
            return;
        // }
    }
    targetMoved=false;

    var size = renderer.getSize();
    var mousex = (e.offsetX / size.width) * 2 - 1;
    var mousey = -(e.offsetY / size.height) * 2 + 1;
    var vector;
    var mousePoint;

    if (modeSwitch.isWalkingMode()) {
        vector = new THREE.Vector3(mousex, mousey, 1).unproject(pointerLockCamera);
        vector.sub(pointerLockControl.getObject().position);
    }
    // vector.normalize();
    if (vector != undefined) {
        vector.normalize();
    }
    if (modeSwitch.isWalkingMode()) {
         //model.visible = true;
         mousePoint = module3D.getAnchorPoint();
         //mousePoint.y += modelData.cameraHeight;
         //mousePoint.y=0.0;
         const DIST_THRESHHOLD = 1.5; //0.5;  
         const NEAR_DIST_LOW_THRESH = 4.0;
         const NEAR_DIST_HIGH_THRESH = 30.0;
         var minMouseDist = 10000.0;
         var minMouseIndex = -1;
         for (var i = 0; i < viewPoint.length; ++i) {
             var curViewPoint = viewPoint[i];
             var distDir = new THREE.Vector3();
             distDir.subVectors(curViewPoint, mousePoint);
             var dist = distDir.length();
             if (dist < minMouseDist) {
                 minMouseDist = dist;
                 minMouseIndex = i;
             }
         }
         var curPoint = viewPoint[curIndex];
         var curMouseDir = new THREE.Vector3();
         curMouseDir.subVectors(mousePoint, curPoint);
         var curMouseDist = curMouseDir.length();
         var matched = -1;
         model.visible = true;
         //var matched = -1;
         var maxDot = 0.5;
         var minDot = 2.0;
         var dir = new THREE.Vector3();
         for (var i = 0; i < viewPoint.length; ++i) {
             if (modeSwitch.isOverallMode() || i != targetIndex) {
                 if (modeSwitch.isOverallMode()) {
                     //
                     dir.subVectors(viewPoint[i], orbitCamera.position);
                     // dir.set(viewPoint[i].x - orbitCamera.position.x, deltaY, viewPoint[i].z - orbitCamera.position.z);
                 } else {
                     dir.subVectors(viewPoint[i], viewPoint[targetIndex]);
                     //dir.set(viewPoint[i].x - viewPoint[targetIndex].x, deltaY, viewPoint[i].z - viewPoint[targetIndex].z);
                 }
                 dir.y -= modelData.cameraHeight;
                 dir.normalize();
                 var temp = dir.dot(vector);
                 if (temp > maxDot) {
                     maxDot = temp;
                     matched = i;
                 }
             }
         }
         if (matched != -1) {
             if (1 - maxDot < 0.005) {
                 textureManager.loadTexture(matched, TagControlWalk);
                 // setWalkingViewPoint(matched);
             } else {
                 var nearPoints = nearestPointsIndex[curIndex];
                 var minAngle = 3.1415026;
                 var minPointIndex = -1;
                 var minDist = 1000000.0;
                 var dir = new THREE.Vector3();
                 cameraController.getCurrentCamera().getWorldDirection(dir);
                 dir.normalize();
                 for (var i = 0; i < nearPoints.length; i++) {
                     var nearPointIndex = nearPoints[i];
                     var curNearPoint = viewPoint[nearPointIndex];
                     var curDir = new THREE.Vector3();
                     curDir.subVectors(curNearPoint, curPoint);
                     var curDist = curDir.length();
                     curDir.normalize();
                     var curAngle = Math.acos(dir.dot(curDir));
                     const PI = 3.1415926;
                     if (curAngle < PI / 3.0 && curAngle >= -PI / 3.0) {
                         if (curDist < minDist) {
                             minDist = curDist;
                             minPointIndex = nearPointIndex;
                         }
                     } else {
                         if (i == 4 && minPointIndex == -1) {
 
                     if(!pointerLockControl.bounceLock){
                     
                             pointerLockControl.bounce(curPoint, mousePoint);
 
                         }
                             targetMoved=true;
                         }
                     }
                 }
                 if (minPointIndex != -1) {
                     textureManager.loadTexture(minPointIndex, TagControlWalk);
                 }
             }
         } else {
             if(!pointerLockControl.bounceLock){
                 pointerLockControl.bounce();
 
             }
             targetMoved=true;
         }
    }


}

function onModeChange() {

    underCompass.visible = modeSwitch.isWalkingMode();
    orbitControl.enabled = modeSwitch.isOverallMode() || modeSwitch.isOrthographic();
    pointerLockControl.enabled = false;

}

function animate() {

    requestAnimationFrame(animate);
     
    orbitControl.update(); //刷新摄像机运算
    pointerLockControl.update();

    cameraController.update();
    if (!cameraController.moving) {
        textureManager.update();
    }

    animateControl && animateControl.update();
    if (MeshMove) {
        renderMesh();
    }

    //Automatic rotation of roaming mode
    if (playstage) {
        if (pause) {
            orthoCamera.rotation.z -= 0.0025;
            pointerLockControl.getObject().rotation.y -= 0.0025;
        }
    }

    initzoom();

    if (modeSwitch.isWalkingMode()) {
        renderer.render(scene, cameraController.getCurrentCamera());
    }else{
        composer.render();
    }  

    // onAnimate();
    if(window.location.href.indexOf('localhost')!=-1){
        stats.update();//更新当前统计
    }
        
}

function getWindowPos(x, y, z) {

    var camera = cameraController.getCurrentCamera();
    var v = new THREE.Vector3(x, y, z).project(camera);

    if (v.z < -1 || v.z > 1) return {
        x: -999,
        y: -999
    };

    var size = renderer.getSize();

    return {
        x: Math.floor((v.x + 1.0) * size.width * 0.5),
        y: Math.floor((1.0 - v.y) * size.height * 0.5)
    };

}

//获取屏幕位置空间坐标，当前为指向的地面坐标
function getMousePos3D(x, y) {

    var size = renderer.getSize();
    var mousex = (x / size.width) * 2 - 1;
    var mousey = -(y / size.height) * 2 + 1;
    var vector = new THREE.Vector3(mousex, mousey, 1).unproject(cameraController.getCurrentCamera());
    var pos = new THREE.Vector3();
    cameraController.getCurrentCamera().getWorldPosition(pos);

    if (modeSwitch.isOrthographic()) {
        //showInfo("x: " + vector.x.toFixed(2) + ", z:" + vector.z.toFixed(2));
    } else {

        vector.sub(pos);
        vector.normalize();
        if (vector.y < 0) {
            vector.multiplyScalar(-1.0 / vector.y * (pos.y - modelData.groundHeight));
            vector.x += pos.x;
            vector.z += pos.z;
            //showInfo("x: " + (vector.x + pos.x).toFixed(2) + ", z:" + (vector.z + pos.z).toFixed(2));
        }
    }

    return {
        x: vector.x,
        y: modelData.groundHeight,
        z: vector.z
    };

}



function setDefaultOverallView() {
    materialSwitch.restore();
    modeSwitch.setOverallMode();
    anchorManager.highlight();
    targetIndex = -1;
    targetMoved = false;
    // orbitCamera.position.set(modelCenter.x, modelCenter.y + modelSize / 3, modelCenter.x + modelSize / 2);
    orbitCamera.position.set(modelCenter.x, modelCenter.y + modelSize, modelCenter.z);
    orbitControl.target.copy(modelCenter);
    orbitControl.update();

}


var isOverallModeToWalkingMode;
function setOverallView(position, orient) {
    if(cameraController.moving) return;
    isOverallModeToWalkingMode=false;
    if (position) {
        cameraController.moveTo(position, orient)
    } else {
        cameraController.moveFromPoint(modelSize);
    }

    if (!modeSwitch.isOverallMode()) {
        materialSwitch.restore();
        modeSwitch.setOverallMode();
        anchorManager.highlight();
        targetIndex = -1;
        targetMoved = false;
    }

    videoController.turnOff();
    for(var j=0;j<groupArr.length;j++){
        if(groupArr[j].gid||groupArr[j].gid==0){

                scene.remove(groupArr[j])
                groupArr[j].visible=false

            
        }

    }

}

function CameraZoomRecovery() {
    if (pointerLockCamera.zoom != 1) {
        pointerLockCamera.zoom = 1;
        pointerLockCamera.updateProjectionMatrix();
    }
}


function setWalkingViewPoint(index, orient) {
    if(cameraController.moving) return;
    isOverallModeToWalkingMode=true;

    //进入第一视角自动隐藏标尺Ning_20180925
    //HiddenMeasure();
    //console.log("HiddenMeasure");
    displayDrawing(false);
    // TagsVisible(true);
    StopTimerAnimateEntrance();
    CameraZoomRecovery();
    HiddenMeasure2D(); //隐藏2D标尺
    ShowMeasure3D(); //显示3D标尺
    if (index < 0 || index >= viewPoint.length) index = 0;
    if (model == null) {
        if (targetIndex != -1) {
            let dir = viewPoint[targetIndex].clone().sub(viewPoint[index]);
            let len = dir.length();
            dir.divideScalar(len);
            cube.scale.set(modelData.cameraHeight * 2, modelData.cameraHeight * 2, len * 2 + modelData.cameraHeight * 2);
            cube.rotation.set(0, Math.atan2(dir.x, dir.z), 0);
            cube.position.copy(viewPoint[targetIndex]);

        } else {
            cube.scale.set(modelData.cameraHeight * 2, modelData.cameraHeight * 2, modelData.cameraHeight * 2);
            cube.position.copy(viewPoint[index]);
        }

    }

    onWalkingViewPoint(index, orient);

    if (modeSwitch.isOrthographic()) {
        modeSwitch.setOverallMode();
    }
    anchorManager.normal();
    targetIndex = index;
    targetMoved = false;
    cameraController.moveTo(viewPoint[index], orient);
    videoController.turnOff();
    materialSwitch.setTarget(viewPoint[index]);
    textureManager.loadTexture(index, false);
    underCompass.position.set(viewPoint[index].x, modelData.groundHeight+0.2, viewPoint[index].z);
    meshArr=[];
    // underCompass.visible=false;
    underCompass.material.opacity=0;
    var timer= setInterval(function(){
        underCompass.material.opacity= parseFloat(parseFloat(underCompass.material.opacity)+parseFloat(0.1)) ;
        if(underCompass.material.opacity>=1){
            underCompass.material.opacity=1;
            clearInterval(timer)
        }

    },100)
}


//Mesh模式 Ning_20181102Edit
function setWalkingMeshView(index, orient) {

    if (modeSwitch.isOrthographic()) {
        setWalkingViewPoint(index, orient)
    } else if (modeSwitch.isOverallMode()) {
        setWalkingViewPoint(index, orient)
    }

    modeSwitch.setWalkingMode();
    cube.visible = false;
    materialSwitch.restore();

}

function setOrthographic(position, orient, cb) {
    
    orthographicCallback = cb;
    setOverallView(position, orient);
    changeToOrthographic = true;
    orthoCamera.zoom = 1;

}


// var changeQuick;
function onMoving(progress) {
    materialSwitch.updateProgress(progress);
    // if(modeSwitch.isOverallMode())
    //     {
    //         if(onMoving&&progress>0.9){
    //             changeQuick=false;
    //             materialSwitch.useCubemap();
        
    //         }

    //     }

}


function onMoved() { //移动结束
    changeQuick=true;
    if (changeToOrthographic) { //转换到正视图

        changeToOrthographic = false;
        modeSwitch.setOrthographic();
        var pos = cameraController.endPoint;
        var orient = cameraController.endOrient;
        var height = pos.y - modelData.groundHeight;
        var h = height * Math.tan(orbitCamera.fov * Math.PI / 360);
        var w = h * orbitCamera.aspect;
        orthoCamera.left = -w;
        orthoCamera.right = w;
        orthoCamera.top = h;
        orthoCamera.bottom = -h;
        orthoCamera.position.copy(pos);
        orthoCamera.setRotationFromQuaternion(orient);
        orthoCamera.updateProjectionMatrix();
        orthographicCallback && orthographicCallback();

    }

    targetMoved = true;
    videoController.moveTo(targetIndex);

    if (targetIndex != -1) {
        switchToWalkingMode();
        curIndex = targetIndex;
        //  underCompass.position.set(viewPoint[targetIndex].x, modelData.groundHeight, viewPoint[targetIndex].z);
        //  underCompass.visible=true;
 
    }
        $.each(groupArr,function(index,value){
            if(value.gid==targetIndex){
                value.visible=true;
                scene.add(value)      
            }
            else{
                value.visible=false;    
                scene.remove(value)
            }
        })

    // for(var j=0;j<groupArr.length;j++){
    //     if(groupArr[j].gid||groupArr[j].gid==0){
    //         if(groupArr[j].gid==targetIndex){
    //             groupArr[j].visible=true;
    //             scene.add(groupArr[j])
    //         }
    //         else{
    //             scene.remove(groupArr[j])
    //             groupArr[j].visible=false;
    //         }
    //     }

    // }

}


var num_threads = 4;
var MT = new Multithread(num_threads);
var scope = this;

function onPreLoadTexture(targetIndex) {

    if (modeSwitch.isOrthographic() || modeSwitch.isOverallMode()) {
        return; //解除切换2D与3D视角的Error；20180918ning
    }

    var nearPoints = nearestPointsIndex[targetIndex];
    var j = targetIndex;
    var funcInADifferentThread = MT.process(

        function () { },

        function () {
            for (var i = 0; i < nearPoints.length; i++) {
                textureManager.loadTexture(nearPoints[i], false);
            }
        }

    );

    funcInADifferentThread(targetIndex);
}


function onTexutueLoaded(index, texture) { //纹理加载完毕
    if (targetIndex == index) {
        materialSwitch.setTargetTexture(texture, viewPointQ[index]);
        switchToWalkingMode();
    }

}


function switchToWalkingMode() { //从总览模式切换到漫游模式
    if (targetMoved && materialSwitch.loaded() && !modeSwitch.isWalkingMode()) {
        modeSwitch.setWalkingMode();
    // materialSwitch.useCubemap();


    }
}

//返回当前方向, -z为0, 逆时针旋转[-PI, +PI]
function getViewDirection() {

    var dir = new THREE.Vector3();

    cameraController.getCurrentCamera().getWorldDirection(dir);

    return Math.atan2(-dir.x, -dir.z);

}

//返回当前相机俯仰角度[-PI/2, +PI/2]

function getViewDirectionY() {

    var dir = new THREE.Vector3();

    cameraController.getCurrentCamera().getWorldDirection(dir);

    return Math.atan2(dir.y, dir.x * dir.x + dir.z * dir.z);

}



function rotateToPixel(rotateAngle) {

    return rotateAngle / cameraController.pixelToRotation;

}

//根据旋转角度计算移动距离
function sortPoint(a, b) {
    var distA = 0.0;
    distA += (a.point.x) * (a.point.x);
    distA += (a.point.y) * (a.point.y);
    distA += (a.point.z) * (a.point.z);
    var distB = 0.0;
    distB += (b.point.x) * (b.point.x);
    distB += (b.point.y) * (b.point.y);
    distB += (b.point.z) * (b.point.z);
    var distDiff = Math.abs(distA - distB);
    if (distDiff < 0.001) {
        var xDiff = Math.abs(a.point.x - b.point.x);
        if (xDiff < 0.001) {
            return a.point.z - b.point.z;
        }
        return a.point.x - b.point.x;
    }
    return distA - distB;
}



function getNearestKPoints(curIndex) {

    var resultPoints = [];
    var tempPoints = [];
    var curPoint = viewPoint[curIndex];
    var len = viewPoint.length;

    for (var i = 0; i < len; i++) {
        if (i == curIndex) {
            continue;
        }

        var point = viewPoint[i];
        var newPoint = new THREE.Vector3(point.x - curPoint.x, point.y - curPoint.y, point.z - curPoint.z);
        var tempPoint = Object();
        tempPoint.index = i;
        tempPoint.point = newPoint;
        tempPoints.push(tempPoint);

    }

    var K = 5;
    tempPoints.sort(sortPoint);

    for (var i = 0; i < tempPoints.length; i++) {
        var tempPoint = tempPoints[i];
    }
    if(tempPoints.length<=K){
        K=tempPoints.length
    }
    for (var i = 0; i < K; i++) {
        resultPoints.push(tempPoints[i].index);
    }
    return resultPoints;
}

//main.js end