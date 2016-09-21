Class(function FlockingAlignment(_neighborDist, _maxSpeed) {
    Inherit(this, Component);
    var _this = this;

    var _neighborSq = _neighborDist * _neighborDist;

    var _steer = new Vector3();

    //*** Public methods
    this.init = function(p) {
        p.aCount = 0;
        if (!p.aSum) p.aSum = new Vector3();
        p.aSum.clear();
    };

    this.compare = function(p, f, distSq, calc) {
        if (!p.neighborSq) p.neighborSq = Math.pow(_neighborDist * p.alignmentOffset, 2);
        if (distSq < p.neighborSq) {
            p.aSum.add(f.vel);
            p.aCount++;
        }
    };

    this.calculate = function(p) {
        if (p.aCount > 0) {
            var sum = p.aSum;
            sum.divide(p.aCount).normalize().multiply(_maxSpeed);

            _steer.subVectors(sum, p.vel);

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