Class(function PlaneFlocking() {
    Inherit(this, Component);
    var _this = this;
    var _simulation, _planes, _numParticles, _numThreads;

    this.object3D = new THREE.Object3D();

    var _totalAdded = 0;

    //*** Constructor
    (function () {

    })();

    function initPlanes() {
        var textureSize = 16;
        _planes = _this.initClass(PlaneInstance, 'PlaneCPUInstance', textureSize, _numParticles);
        _this.object3D.add(_planes.object3D);
        _simulation = _this.initClass(PlaneFlockingCPU, _numParticles, _numThreads, _planes.geometry);
    }

    function updateLockedGeometry(numToAdd) {
        for (var i = 0; i < numToAdd; i++) {
            for (var j = 0; j < _numParticles; j++) {
                if (
                    _planes.geometry.attributes.released.array[j] === 0 &&
                    _planes.geometry.attributes.offset.array[j * 3 + 1] < -300
                ) {
                    _planes.geometry.attributes.released.setX(j, 1);
                    _totalAdded++;
                    break;
                }
            }
        }
        _planes.geometry.attributes.released.needsUpdate = true;
    }

    //*** Event handlers

    //*** Public methods
    this.init = function(numParticles, numThreads) {
        _numParticles = Math.round(numParticles * Tests.getPlaneReduce());
        _numThreads = numThreads;
        initPlanes();
    };

    this.animateOut = function() {
        _simulation.disperse();
        _planes.fadeOut();
    };

    this.animateIn = function() {
        _simulation.assemble();
        _planes.fadeIn();
    };

    this.addPlane = function() {
        if (_totalAdded >= _numParticles) return 'finished';
        var numToAdd = 5;
        numToAdd = Math.min(numToAdd, _numParticles - _totalAdded);
        updateLockedGeometry(numToAdd);
    };

}, 'singleton');