Class(function PlaneFlockingThreadConverter(_particles) {
    Inherit(this, Component);
    var _this = this;

    var OFFSET = 7;
    var _buffer = {};
    var _pool;

    //*** Constructor
    (function () {

    })();

    function initPool() {
        _pool = new ObjectPool();
        for (var i = 0; i < 20; i++) {
            var array = new Float32Array(_particles.length * OFFSET);
            _pool.insert(array);
        }
    }

    //*** Event handlers

    //*** Public methods
    this.convert = function() {
        if (!_pool) initPool();
        var values = _pool.get() || new Float32Array(_particles.length * OFFSET);
        var p = _particles.start();
        var index = 0;
        while (p) {
            values[index * OFFSET + 0] = p.finalPosition.x;
            values[index * OFFSET + 1] = p.finalPosition.y;
            values[index * OFFSET + 2] = p.finalPosition.z;

            values[index * OFFSET + 3] = p.rotation.x;
            values[index * OFFSET + 4] = p.rotation.y;
            values[index * OFFSET + 5] = p.rotation.z;
            values[index * OFFSET + 6] = p.rotation.w;

            index++;
            p = _particles.next();
        }

        _buffer.values = values;
        return _buffer;
    }

    this.recycle = function(array) {
        _pool.put(array);
    }
});