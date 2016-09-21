Class(function PlaneCaught() {
    Inherit(this, Component);
    var _this = this;
    var _plane, _animation, _pinch, _stamp, _fold, _throw, _shadow;

    //*** Constructor
    (function () {
        initGeometry();
        initAnimation();
        initPinching();
    })();

    function initGeometry() {
        if (PlaneCaught.PLANE) {
            _plane = PlaneCaught.PLANE;
            _plane.update(91);
            _plane.flipContainer.rotation.x = 0;
            _plane.fade = 0;
            _plane.stripColor = null;
        } else {
            _plane = _this.initClass(PlaneFoldGeometry);
            PlaneCaught.PLANE = _plane;
            _plane.age();
        }
        _plane.depth = false;
        World.instance().scene.add(_plane.swayContainer);
    }

    function initAnimation() {
        _animation = _this.initClass(PlaneFoldAnimation, _plane);
        _animation.toCenter();
    }

    function initPinching() {
        var tl = _animation.createPinchingTimeline();

        _pinch = _this.initClass(PlanePinch, tl);
        _pinch.onComplete = function() {
            _pinch = _pinch.destroy();
            tl = tl.destroy();
        };
    }

    //*** Event handlers

    //*** Public methods
    this.onDestroy = function() {
        World.instance().scene.remove(_plane.swayContainer);
    };

});