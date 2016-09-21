Class(function FlockingCohesion(_neighborDist, _maxSpeed) {
    Inherit(this, Component);
    var _this = this;

    var _neighborSq = _neighborDist * _neighborDist;

    var _seek = new Vector3();
    var _steer = new Vector3();

    //*** Public methods
    this.init = function(p) {
        p.cCount = 0;
        if (!p.cSum) p.cSum = new Vector3();
        p.cSum.clear();
    };

    this.compare = function(p, f, distSq, calc) {
        if (!p.neighorSq) p.neighborSq = Math.pow(_neighborDist * p.cohesionOffset, 2);
        if (distSq < p.neighborSq) {
            p.cSum.add(f.pos);
            p.cCount++;
        }
    };

    this.calculate = function(p) {
        if (p.cCount > 0) {
            var sum = p.cSum;
            sum.divide(p.cCount);

            _seek.subVectors(sum, p.pos);
            _seek.normalize().multiply(_maxSpeed);

            _steer.subVectors(_seek, p.vel);

            p.applyForce(_steer);
        }
    };

    this.set('neighborDist', function(value) {
        _neighborDist = value;
        _neighborSq = _neighborDist * _neighborDist;
    });

    this.set('maxSpeed', function(value) {
        _maxSpeed = value;
    });
});