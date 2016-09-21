Class(function FlockingBehavior() {
    Inherit(this, Component);
    var _this = this;

    var _config = {};
    _config.separation = 20;
    _config.separationMaxSpeed = 1000;
    _config.alignmentNeighborDist = 80;
    _config.alignmentMaxSpeed = 1000;
    _config.cohesionNeighborDist = 800;
    _config.cohesionMaxSpeed = 200;

    var _negate = new Vector3();

    var _separation = _this.initClass(FlockingSeparation, _config.separation, _config.separationMaxSpeed);
    var _align = _this.initClass(FlockingAlignment, _config.alignmentNeighborDist, _config.alignmentMaxSpeed);
    var _cohesion = _this.initClass(FlockingCohesion, _config.cohesionNeighborDist, _config.cohesionMaxSpeed);

    var _area = 2000;
    var _spaces = 7;
    var _cube = [];

    var _calc = new Vector3();

    function checkPosition(p) {
        var x = ~~(Utils.range(p.pos.x, -_area, _area, 0, _spaces));
        var y = ~~(Utils.range(p.pos.y, -_area, _area, 0, _spaces));
        var z = ~~(Utils.range(p.pos.z, -_area, _area, 0, _spaces));

        if (!_cube[x]) _cube[x] = [];
        if (!_cube[x][y]) _cube[x][y] = [];
        if (!_cube[x][y][z]) _cube[x][y][z] = [];

        var lookup = _cube[x][y][z];
        if (p.location != lookup) {
            if (p.location) p.location.findAndRemove(p);
            lookup.push(p);
        }

        p.location = lookup;
    }

    //*** Public methods
    this.applyBehavior = function(p) {
        checkPosition(p);
        _separation.init(p);
        _align.init(p);
        _cohesion.init(p);

        var len = p.location.length;

        for (var i = len-1; i > -1; i--) {
            var f = p.location[i];
            if (f == p) continue;

            _calc.subVectors(p.pos, f.pos);
            var distSq = _calc.lengthSq();

            _separation.compare(p, f, distSq, _calc);
            _align.compare(p, f, distSq, _calc);
            _cohesion.compare(p, f, distSq, _calc);
        }

        _separation.calculate(p);
        _align.calculate(p);
        _cohesion.calculate(p);

        p.vel.multiply(p.friction);

        if (p.pos.lengthSq() < 180 * 180 || p.vel.lengthSq() < 1) {
            _negate.copy(p.pos).multiply(-0.2);
            p.applyForce(_negate);
        }
    }

    this.set('separation', function(value) {
        _config.separation = value;
        _separation.separation = value;
    });

    this.set('separationMaxSpeed', function(value) {
        _config.separationMaxSpeed = value;
        _separation.maxSpeed = value;
    });

    this.set('alignmentNeighborDist', function(value) {
        _config.alignmentNeighborDist = value;
        _align.neighborDist = value;
    });

    this.set('alignmentMaxSpeed', function(value) {
        _config.alignmentMaxSpeed = value;
        _align.maxSpeed = value;
    });

    this.set('cohesionNeighborDist', function(value) {
        _config.cohesionNeighborDist = value;
        _cohesion.neighborDist = value;
    });

    this.set('cohesionMaxSpeed', function(value) {
        _config.cohesionMaxSpeed = value;
        _cohesion.maxSpeed = value;
    });
});