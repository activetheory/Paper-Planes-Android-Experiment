Class(function PlaneFoldGeometry() {
    Inherit(this, Component);
    var _this = this;
    var _geometry, _frontShader, _backShader, _frontMesh, _backMesh, _frontMixer, _backMixer;

    this.mesh = new THREE.Group();
    this.object3D = new THREE.Group();
    this.flipContainer = new THREE.Group();
    this.swayContainer = new THREE.Group();

    var _frame = 91;

    //*** Constructor
    (function () {
        initGeometry();
        initShader();
        initMesh();
        initAnimation();
    })();

    function initGeometry() {
        _geometry = PlaneFoldGeometry.getGeometry();
    }

    function initShader() {
        var borderTexture = Utils3D.getTexture('assets/images/plane/border.jpg');
        var matCapTexture = Utils3D.getTexture('assets/images/plane/matcap2.jpg');
        var foldTexture = Utils3D.getTexture('assets/images/plane/fold.jpg');
        var splatTexture = Utils3D.getTexture('assets/images/stamps/splat.png');

        _frontShader = _this.initClass(Shader, 'PlaneFold', 'PlaneFold');
        _frontShader.uniforms = {
            tBorder: {type: 't', value: borderTexture},
            tMatCap: {type: 't', value: matCapTexture},
            tFold: {type: 't', value: foldTexture},
            tStamp: {type: 't', value: null},
            tSplat: {type: 't', value: splatTexture},
            fIntensity: {type: 'f', value: 1},
            fAge: {type: 'f', value: 0},
            fFade: {type: 'f', value: 0},
            splatColor: {type: 'c', value: new THREE.Color('#f00')},
            splatAlpha: {type: 'f', value: 0},
            splatScale: {type: 'f', value: 0},
            splatPosition: {type: 'v2', value: new THREE.Vector2()},
            stripColor: {type: 'c', value: new THREE.Color(0xffffff)},
            stripAlpha: {type: 'f', value: 0},
        };
        _frontShader.material.morphTargets = true;
        _frontShader.material.morphNormals = true;
        _frontShader.material.side = THREE.FrontSide;
        _frontShader.material.extensions.derivatives = true;

        _backShader = _this.initClass(Shader, 'PlaneFold', 'PlaneFold');
        _backShader.uniforms = {
            tBorder: {type: 't', value: borderTexture},
            tMatCap: {type: 't', value: matCapTexture},
            tFold: {type: 't', value: foldTexture},
            tStamp: {type: 't', value: null},
            tSplat: {type: 't', value: null},
            fIntensity: {type: 'f', value: 0.05},
            fAge: {type: 'f', value: 0},
            fFade: {type: 'f', value: 0},
            splatColor: {type: 'c', value: new THREE.Color()},
            splatAlpha: {type: 'f', value: 0},
            splatScale: {type: 'f', value: 0},
            splatPosition: {type: 'v2', value: new THREE.Vector2()},
            stripColor: {type: 'c', value: new THREE.Color(0xffffff)},
            stripAlpha: {type: 'f', value: 0},
        };
        _backShader.material.morphTargets = true;
        _backShader.material.morphNormals = true;
        _backShader.material.side = THREE.BackSide;
        _backShader.material.extensions.derivatives = true;
    }

    function initMesh() {
        _frontMesh = new THREE.Mesh(_geometry, _frontShader.material);
        _backMesh = new THREE.Mesh(_geometry, _backShader.material);
        _frontMesh.frustumCulled = false;
        _backMesh.frustumCulled = false;
        _this.mesh.add(_frontMesh);
        _this.mesh.add(_backMesh);
        _this.object3D.add(_this.mesh);
        _this.object3D.rotation.order ='YXZ';
        _this.flipContainer.add(_this.object3D);
        _this.flipContainer.rotation.order ='YXZ';
        _this.swayContainer.add(_this.flipContainer);
        _this.swayContainer.rotation.order ='YXZ';
    }

    function initAnimation() {
        _frontMixer = new THREE.AnimationMixer(_frontMesh);
        _frontMixer.clipAction(_geometry.animations[0]).setDuration(96).play();
        _frontMixer.update(_frame);

        _backMixer = new THREE.AnimationMixer(_backMesh);
        _backMixer.clipAction(_geometry.animations[0]).setDuration(96).play();
        _backMixer.update(_frame);
    }

    //*** Event handlers

    //*** Public methods
    this.age = function() {
        _frontShader.uniforms.fAge.value = 1;
        _backShader.uniforms.fAge.value = 1;
    };

    this.update = function(frame) {
        var diff = frame - _frame;
        _frontMixer.update(diff);
        _backMixer.update(diff);
        _frame = frame;
    };

    this.get('frame', function() {
        return _frame;
    });

    this.set('fade', function(value) {
        _frontShader.uniforms.fFade.value = value;
        _backShader.uniforms.fFade.value = value;
    });

    this.set('stripColor', function(value) {
        if (value == null) {
            _frontShader.uniforms.stripAlpha.value = 0;
            _backShader.uniforms.stripAlpha.value = 0;
            return;
        }
        _frontShader.uniforms.stripColor.value.set(value);
        _backShader.uniforms.stripColor.value.set(value);
        _frontShader.uniforms.stripAlpha.value = 1;
        _backShader.uniforms.stripAlpha.value = 1;
    });

    this.set('depth', function(value) {
        _frontShader.material.depthTest = value;
        _frontShader.material.depthWrite = value;
        _backShader.material.depthTest = value;
        _backShader.material.depthWrite = value;
    });

    this.destroy = function() {
        _frontShader.material.dispose();
        _backShader.material.dispose();
    };

}, function() {
    var _geometry;
    PlaneFoldGeometry.getGeometry = function() {
        if (_geometry) return _geometry;
        _geometry = Utils3D.loadGeometry('planeFold');
        projectUVsOnAxis(_geometry);
        return _geometry;
    };

    function projectUVsOnAxis(geometry) {
        geometry.computeBoundingBox();
        var max = geometry.boundingBox.max;
        var min = geometry.boundingBox.min;
        var offset = new THREE.Vector2(0 - min.x, 0 - min.z);
        var range = new THREE.Vector2(max.x - min.x, max.z - min.z);
        geometry.faceVertexUvs[0] = [];
        geometry.faces.forEach(function(face) {
            var v1 = geometry.vertices[face.a];
            var v2 = geometry.vertices[face.b];
            var v3 = geometry.vertices[face.c];
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.z + offset.y) / range.y),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.z + offset.y) / range.y),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.z + offset.y) / range.y)
            ]);
        });
        geometry.uvsNeedUpdate = true;
    }

});