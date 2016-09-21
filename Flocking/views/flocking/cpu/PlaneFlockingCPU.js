Class(function PlaneFlockingCPU(_numParticles, _numThreads, _geometry) {
    Inherit(this, Component);
    var _this = this;
    var _chunks = [];

    //*** Constructor
    (function () {
        initChunks();
        addHandlers();
    })();

    function initChunks() {
        for (var i = 0; i < _numThreads; i++) {
            var chunk = _this.initClass(PlaneFlockingChunk, i, Math.floor(_numParticles / _numThreads), _geometry, _numThreads);
            _chunks.push(chunk);
        }
    }

    //*** Event handlers
    function addHandlers() {
        _this.events.subscribe(PlanesEvents.PAUSE_FLOCKING, pause);
        _this.events.subscribe(PlanesEvents.RESUME_FLOCKING, resume);
    }

    function pause() {
        _chunks.forEach(function(chunk) {
            chunk.pause();
        });
    }

    function resume() {
        _chunks.forEach(function(chunk) {
            chunk.resume();
        });
    }

    //*** Public methods
    this.disperse = function() {
        _chunks.forEach(function(chunk) {
            chunk.disperse();
        });
        _this.delayedCall(pause, 1000);
    };

    this.assemble = function() {
        _chunks.forEach(function(chunk) {
            chunk.assemble();
        });
    };

});