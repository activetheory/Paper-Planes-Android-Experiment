Class(function PlaneFoldAnimation(_plane) {
    Inherit(this, Component);
    var _this = this;
    var _teaseTwn, _foldTwn, _centerTwn;
    var _catchTweens = [];
    var _time = 0;

    var _swayStrength = 1;
    var _lastTime = 0;

    //*** Constructor
    (function () {
        Render.start(loop);
    })();

    function loop(t, dt, delta) {
        _time += delta;
        _plane.swayContainer.rotation.x = _swayStrength * Utils.range(Math.sin(_time * 0.001 + 1.2), -1, 1, -0.02, 0.02);
        _plane.swayContainer.rotation.z = _swayStrength * Utils.range(Math.sin(_time * 0.002 + 1.2), -1, 1, -0.05, 0.05);
    }

    //*** Event handlers

    //*** Public methods
    this.set('swayStrength', function(value) {
        _swayStrength = value;
    });

    this.toCenter = function(callback) {
        var s = 1;
        _catchTweens[1] = TweenManager.tween(_plane.object3D.scale, {x: s, y: s, z: s}, 1500, 'easeInOutCubic');
        _centerTwn = TweenManager.tween(_plane.object3D.position, {x: 0, y: 1, z: 0}, 1600, 'easeInOutQuad', callback);
        _catchTweens[2] = TweenManager.tween(_plane.object3D.rotation, {x: 0.15, y: 5.3, z: 0.4}, 1500, 'easeInOutQuad');
    };

    this.createPinchingTimeline = function() {
        var tl = _this.initClass(TweenTimeline);

        var temp = {a: _plane.frame};
        var s = 1.3;
        tl.onUpdate = function(alpha) {
            _swayStrength = 1 - alpha;
            _plane.update(temp.a);
            _plane.fade = alpha;
        };

        tl.add(temp, {a: 96}, 650, 'easeInOutCubic');
        tl.add(_plane.object3D.scale, {x: s, y: s, z: s}, 650, 'easeInOutCubic');
        tl.add(_plane.object3D.position, {x: 0, y: 0, z: 0}, 500, 'easeInOutQuad');
        tl.add(_plane.object3D.rotation, {x: 1.54, y: 6.28, z: 3.14}, 700, 'easeInOutQuad');

        return tl;
    };

    this.onDestroy = function() {
        _catchTweens.forEach(function(tween) {
            if (tween && tween.stop) tween.stop();
        });
        if (_centerTwn && _centerTwn.stop) _centerTwn.stop();
        if (_teaseTwn && _teaseTwn.stop) _teaseTwn.stop();
        if (_foldTwn && _foldTwn.stop) _foldTwn.stop();
        Render.stop(loop);
    };

});