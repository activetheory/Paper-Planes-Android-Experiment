Class(function FlockingAttract() {
    Inherit(this, Component);
    var _this = this;

    var _delta = new Vector3();
    var _points = [];

    //*** Public methods
    this.addPoint = function(pos, radius, strength) {
        pos.radius = radius;
        pos.strength = strength;
        pos.radiusSq = pos.radius * pos.radius;
        _points.push(pos);
    };

    this.removeLastPoint = function() {
        _points.pop();
    };

    this.applyBehavior = function(p) {
        if (p.fixed) return;

        _delta.clear().sub(p.pos);
        var distSq = _delta.lengthSq();

        for (var i = 0; i < _points.length; i++) {
            var point = _points[i];
            if (distSq < point.radiusSq && distSq > 0.000001) {
                _delta.normalize().multiply(1.0 - distSq / point.radiusSq);
                p.acc.add(_delta.multiply(point.strength * p.gravityOffset));
            }
        }
    }
});