Class(function PlaneFlockingChunk(_index, _numParticles, _geometry, _numThreads) {
    Inherit(this, Component);
    var _this = this;
    var _thread, _recycle, _render;

    var OFFSET = 7;

    //*** Constructor
    (function () {
        initThread();
        Render.start(loop);
    })();

    function initThread() {
        _thread = _this.initClass(Thread, PlaneFlockingThread);
        _thread.importScript(Config.PROXY + 'assets/js/lib/three.min.js');
        _thread.importClass(
            Vector2, Vector3, ParticlePhysics, EulerIntegrator, LinkedList, PlaneFlockingThreadConverter, Particle, WiggleBehavior,
            FlockingAlignment, FlockingAttract, FlockingBehavior, FlockingCohesion, FlockingSeparation, FlockingRotation,
            PlaneFlockingBehaviour, PlaneGravityBehaviour, PlaneGroundBehaviour, PlaneSpeedBehaviour, ObjectPool
        );
        _thread.init({total: _numParticles});
        _thread.on('transfer', updateGeometry);
    }

    function loop() {
        if (!_render) _render = {};
        _render.time = Render.TSL;
        _render.delta = Render.DELTA;
        _thread.render(_render);
    }

    //*** Event handlers
    function updateGeometry(e) {
        var releasedPlanes = [];
        for (var k = 0; k < _numThreads; k++) {
          releasedPlanes.push(0);
        }
        for (var i = 0, j = _index * _numParticles; i < e.values.length; i+= OFFSET, j++) {
            _geometry.attributes.offset.setXYZ(j,
                e.values[i + 0],
                e.values[i + 1],
                e.values[i + 2]
            );
            _geometry.attributes.orientation.setXYZW(j,
                e.values[i + 3],
                e.values[i + 4],
                e.values[i + 5],
                e.values[i + 6]
            );
            if (_geometry.attributes.released.getX(j) !== 0) {
              releasedPlanes[_index]++;
            }
        }
        _geometry.attributes.offset.needsUpdate = true;
        _geometry.attributes.orientation.needsUpdate = true;
        recycle(e.values);
    }

    function recycle(buffer) {
        if (!_recycle) _recycle = {transfer: true, msg: {buffers: []}};
        _recycle.msg.array = buffer;
        _recycle.msg.buffers.length = 0;
        _recycle.msg.buffers.push(buffer.buffer);
        _thread.recycleBuffer(_recycle);
    }

    //*** Public methods
    this.pause = function() {
        Render.stop(loop);
    };

    this.resume = function() {
        Render.start(loop);
    };

    this.disperse = function() {
        _this.isDispersed = true;
        _thread.disperse();
    };

    this.assemble = function() {
        if (!_this.isDispersed) return;
        _this.isDispersed = false;
        _thread.assemble();
    };

    this.onDestroy = function() {
        Render.stop(loop);
    };

});
