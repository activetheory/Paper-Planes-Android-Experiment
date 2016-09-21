window.onload = function() {
    var _scene, _renderer, _camera, _mesh;

    init3D();
    initBridge();
    addTouchListener();

    function init3D() {
        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        _renderer = new THREE.WebGLRenderer();
        _renderer.setPixelRatio(window.devicePixelRatio);
        _renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(_renderer.domElement);

        _camera.position.z = 100;

        var geom = new THREE.IcosahedronGeometry(20, 2);
        var mat = new THREE.MeshNormalMaterial();
        _mesh = new THREE.Mesh(geom, mat);
        _scene.add(_mesh);

        _renderer.render(_scene, _camera);
    }

    function sendToNative(object) {
        window.native.postMessage(JSON.stringify(object));
    }

    function addTouchListener() {
        window.addEventListener('touchend', e => {
            sendToNative({title: 'Title from JavaScript', body: 'Body from JavaScript'});
        });
    }

    window.messageFromJava = function(message) {
        console.log('Message from Java', message);
    }

    window.onResize = function() {
        _renderer.setSize(window.innerWidth, window.innerHeight);
        _renderer.render(_scene, _camera);
    }
}
