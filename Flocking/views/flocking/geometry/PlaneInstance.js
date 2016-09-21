Class(function PlaneInstance(_shaderName, _textureSize, _numInstances) {
    Inherit(this, Component);
    var _this = this;
    var _geometry, _shader, _mesh;

    _numInstances = _numInstances || _textureSize * _textureSize;

    this.object3D = new THREE.Group();

    //*** Constructor
    (function () {
        initGeometry();
        initInstances();
        initShader();
        initMesh();
        Render.start(loop);
    })();

    function initGeometry() {
        _geometry = new THREE.InstancedBufferGeometry();

        var data = Hydra.JSON['plane'];
        _geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.vertices), 3));
        _geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uvs), 2));
        _geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normals), 3));
    }

    function initInstances() {
        var offsets = new THREE.InstancedBufferAttribute(new Float32Array(_numInstances * 3), 3).setDynamic(true);
        var orientations = new THREE.InstancedBufferAttribute(new Float32Array(_numInstances * 4), 4).setDynamic(true);
        var random = new THREE.InstancedBufferAttribute(new Float32Array(_numInstances * 3), 3);
        var released = new THREE.InstancedBufferAttribute(new Float32Array(_numInstances), 1);

        for (var i = 0; i < _numInstances; i++) {
            random.setXYZ(i, Utils.doRandom(0.5, 1.5, 2), Utils.doRandom(0.6, 1.5, 2), Utils.doRandom(0.5, 1.0, 2));
            released.setX(i, 1);
            offsets.setX(i, -1000);
        }

        _geometry.addAttribute('offset', offsets);
        _geometry.addAttribute('orientation', orientations);
        _geometry.addAttribute('coords', coords);
        _geometry.addAttribute('random', random);
        _geometry.addAttribute('released', released);
    }

    function initShader() {
        _shader = _this.initClass(Shader, _shaderName, _shaderName);
        _shader.uniforms = {
            tMatCap: {type: 't', value: Utils3D.getTexture('assets/images/plane/matcap.jpg')},
            time: {type: 'f', value: 1},
            alpha: {type: 'f', value: 1},
        };
        _shader.material.transparent = true;
        _shader.material.side = THREE.DoubleSide;
    }

    function initMesh() {
        _mesh = new THREE.Mesh(_geometry, _shader.material);
        _mesh.frustumCulled = false;
        _this.object3D.add(_mesh);
    }

    function loop(t, dt, delta) {
        _shader.uniforms.time.value += delta;
    }

    //*** Event handlers

    //*** Public methods
    this.get('geometry', function() {
        return _geometry;
    });

    this.get('shader', function() {
        return _shader;
    });

    this.fadeIn = function(callback, delay) {
        Render.start(loop);
        _shader.material.depthTest = true;
        _shader.tween('alpha', 1, 1000, 'easeOutCubic', delay || 0, function() {if (typeof callback == 'function') callback()});
    };

    this.fadeOut = function(callback) {
        _shader.material.depthTest = false;
        _shader.tween('alpha', 0, 1000, 'easeOutCubic', function() {
            Render.stop(loop);
            if (typeof callback == 'function') callback();
        });
    };

    this.onDestroy = function() {
        Render.stop(loop);
    };

});