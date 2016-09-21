Class(function PlanePinch(_tl) {
    Inherit(this, Component);
    var _this = this;
    var _pinch;

    var _elapsedTarget = 0;
    var _lastPercent = 0;
    var _threshold = 0.3;

    //*** Constructor
    (function () {
        initPinch();
        addHandlers();
        Render.start(loop);
    })();

    function initPinch() {
        _pinch = _this.initClass(PinchMechanism);
        _pinch.max = 300;
        _pinch.start();
    }

    function loop() {
        _elapsedTarget = _pinch.percent;
        _tl.elapsed += (_elapsedTarget - _tl.elapsed) * 0.2;
        _lastPercent = _elapsedTarget;
        _tl.update();

        if (_tl.elapsed > 0.001 && !_this.startPinching) {
            _this.startPinching = true;
            if (typeof _this.onStart == 'function') _this.onStart();
        }

        if (_tl.elapsed > 0.99) {
            Render.stop(loop);
            if (typeof _this.onComplete == 'function') _this.onComplete();
        }
    }

    //*** Event handlers
    function addHandlers() {
        _pinch.events.add(HydraEvents.COMPLETE, pinchSnap);
    }

    function pinchSnap(force) {
        var to = typeof force == 'number' ? force : 1;
        var time = Math.max(0.01, Math.abs(_pinch.percent - to) * 1000);
        _pinch.snapTo(to, time);

        _threshold = to == 1 ? 0.7 : 0.3;

        if (to == 1) _pinch.stop();
    }

    //*** Public methods
    this.snap = pinchSnap;
    this.onDestroy = function() {
        Render.stop(loop);
    };

});