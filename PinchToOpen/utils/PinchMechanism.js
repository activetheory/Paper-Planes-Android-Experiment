Class(function PinchMechanism() {
    Inherit(this, Component);
    var _this = this;

    var _p0 = new Vector2();
    var _p1 = new Vector2();
    var _calc = new Vector2();
    var _dist = 0;
    var _start = 0;
    var _percent = 0;
    var _touching = false;

    this.max = 150;

    function setTouches(e) {
        var p0 = e.touches[0];
        var p1 = e.touches[1];
        if (p0) _p0.set(p0.pageX, p0.pageY);
        if (p1) _p1.set(p1.pageX, p1.pageY);
    }

    //*** Event handlers
    function addListeners() {
        Stage.bind('touchstart', touchStart);
        Stage.bind('touchend', touchEnd);
        Stage.bind('touchcancel', touchEnd);
    }

    function removeListeners() {
        Stage.unbind('touchstart', touchStart);
        Stage.unbind('touchend', touchEnd);
        Stage.unbind('touchcancel', touchEnd);
        Stage.unbind('touchmove', touchMove);
    }

    function touchStart(e) {
        if (e.touches.length == 2 && !_touching) {
            _touching = true;
            _start = _percent;
            setTouches(e);
            Stage.bind('touchmove', touchMove);
            _dist = _calc.subVectors(_p0, _p1).length();
        }
    }

    function touchMove(e) {
        setTouches(e);
        var dist = _calc.subVectors(_p0, _p1).length();
        var absDist = dist - _dist;
        var perc = Utils.range(absDist, 0, _this.max, 0, 1);
        _percent = Utils.clamp(_start + perc, 0, 1);
    }

    function touchEnd(e) {
        if (!_touching) return;
        _touching = false;
        _start = _percent;
        Stage.unbind('touchmove', touchMove);
        _this.events.fire(HydraEvents.COMPLETE);
    }

    //*** Public methods
    this.set('percent', function(value) {
        _percent = value;
    });

    this.get('percent', function() {
        return _percent;
    });

    this.start = function() {
        addListeners();
    };

    this.stop = function() {
        removeListeners();
    };

    this.snapTo = function(to, time, callback) {
        var d = new DynamicObject({v: _percent});
        d.tween({v: to}, time, 'linear', function() {
            _percent = d.v;
            _start = d.v;
        }, callback);
    };

    this.onDestroy = function() {
        removeListeners();
    };
});