Class(function World() {
    Inherit(this, Component);
    var _this = this;
    var _renderer, _scene, _camera, _controls;

    //*** Constructor
    (function () {
        initWorld();
        addHandlers();
        resize();
        Render.start(loop);
    })();

    function initWorld() {
        _renderer = new THREE.WebGLRenderer();
        _renderer.setPixelRatio(Tests.getDPR());
        _renderer.setSize(Stage.width, Stage.height);
        _renderer.setClearColor(0xffffff);

        _scene = new THREE.Scene();

        _camera = new THREE.PerspectiveCamera(35, Stage.width / Stage.height, 1, 10000);
        _camera.position.set(0, 0, -700);
        _camera.positionTarget = new THREE.Vector3(0, 0, -700);
        _camera.target = new THREE.Vector3();
        _camera.lookAt(_camera.target);
    }

    //*** Event handlers
    function addHandlers() {
        _this.events.subscribe(HydraEvents.RESIZE, resize);
    }

    function resize() {
        _renderer.setSize(Stage.width, Stage.height);
        _camera.aspect = Stage.width / Stage.height;
        _camera.updateProjectionMatrix();
    }

    function loop() {
        _renderer.render(_scene, _camera);
    }

    //*** Public methods
    _this.get('renderer', function() {
        return _renderer;
    });

    _this.get('scene', function() {
        return _scene;
    });

    _this.get('camera', function() {
        return _camera;
    });

}, 'singleton');