Class(function FlockingSeparation(_separation, _maxSpeed) {
    Inherit(this, Component);
    var _this = this;

    var _separationSq = _separation * _separation;

    var _calc = new Vector3();
    var _steer = new Vector3();

    //*** Public methods
    this.init = function(p) {
        p.sCount = 0;
        if (!p.sSum) p.sSum = new Vector3();
        p.sSum.clear();
    };

    this.compare = function(p, f, distSq, calc) {
        if (!p.sepSq) p.sepSq = Math.pow(_separation * p.separationOffset, 2);
        if (distSq < p.sepSq) {
            _calc.copyFrom(calc).multiply(p.separationOffset).normalize();
            p.sSum.add(_calc);
            p.sCount++;
        }
    };

    this.calculate = function(p) {
        if (p.sCount > 0) {
            p.sSum.divide(p.sCount);
            p.sSum.setLength(_maxSpeed);

            _steer.subVectors(p.sSum, p.vel);

            p.applyForce(_steer);
        }
    };

    this.set('separation', function(value) {
        _separation = value;
        _separationSq = _separation * _separation;
    });

    this.set('maxSpeed', function(value) {
        _maxSpeed = value;
    });
});