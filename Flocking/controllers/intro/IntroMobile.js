Class(function IntroMobile() {
    Inherit(this, View);
    var _this = this;
    var $this;
    var _flocking;

    //*** Constructor
    (function () {
        initHTML();
        style();
        initFlocking();
        addHandlers();
        Render.start(loop);
    })();

    function initHTML() {
        $this = _this.element;
    }

    function style() {
        $this.css({position: 'static'});
    }

    function initFlocking() {
        _flocking = PlaneFlocking.instance();
        _flocking.init(Tests.slowMeshUpload() ? 100 : 300, 4);
        World.instance().scene.add(_flocking.object3D);
        
        var s = 0.15;
        _flocking.object3D.scale.set(s, s, s);
        _flocking.object3D.position.set(0, -33, 0);

        _this.events.fire(PlanesEvents.PAUSE_FLOCKING);
        _this.delayedCall(animateIn, 300);
    }

    function loop() {
        _flocking.object3D.rotation.y += 0.0007;
        _flocking.object3D.rotation.x += 0.0004;
    }

    function animateIn() {
        _this.events.fire(PlanesEvents.RESUME_FLOCKING);
    }

    //*** Event handlers
    function addHandlers() {
        _this.events.subscribe(PlanesEvents.NEW_PLANE, complete);
    }

    function complete() {
        hideElements(function() {
            _this.events.fire(HydraEvents.COMPLETE);
        });
    }

    function hideElements(callback) {
        _flocking.animateOut(callback);
    }

    //*** Public methods
    this.animateOut = function(callback) {
        $this.tween({opacity: 0}, 500, 'easeOutCubic', function() {
            if (typeof callback == 'function') callback();
        });
    };

    this.onDestroy = function() {
        Render.stop(loop);
        World.instance().scene.remove(_flocking.object3D);
    };

});