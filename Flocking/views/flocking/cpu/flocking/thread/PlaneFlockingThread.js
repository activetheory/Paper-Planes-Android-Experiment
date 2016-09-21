Class(function PlaneFlockingThread() {
    Inherit(this, Component);
    var _this = this;
    var _system, _converter, _wiggle, _behavior, _attractor;
    var _particles = [];
    var _count = 0;

    //*** Constructor
    (function () {

    })();

    function initSystem() {
        var integrator = new EulerIntegrator();
        integrator.useDeltaTime = true;
        _system = _this.initClass(ParticlePhysics, integrator);
        _converter = _this.initClass(PlaneFlockingThreadConverter, _system.particles);
    }

    function initParticles(numParticles) {
        var max = 1000;
        for (var i = 0; i < numParticles; i++) {
            var p = new Particle(new Vector3(Utils.doRandom(-max, max), 0, 0), 0, 0);
            p.targetRotation = new THREE.Quaternion();
            p.rotation = new THREE.Quaternion();
            p.vel.set(
                Utils.doRandom(-1.0, 1.0, 2),
                Utils.doRandom(-1.0, 1.0, 2),
                Utils.doRandom(-1.0, 1.0, 2)
            );
            _system.addParticle(p);
            _particles.push(p);

            p.separationOffset = Utils.doRandom(0.8, 1.2, 2);
            p.alignmentOffset = Utils.doRandom(0.5, 2.0, 2);
            p.cohesionOffset = Utils.doRandom(0.9, 1.0, 2);
            p.friction = Utils.doRandom(0.9, 1.0, 3);
            p.gravityOffset = Utils.doRandom(0.9, 1.5, 2);
            p.random = Math.random();

            p.finalPosition = new Vector3();
        }
    }

    function initBehaviours() {
        _behavior = new FlockingBehavior();
        _system.addBehavior(_behavior);

        var attract = new Vector3();
        _wiggle = new WiggleBehavior(attract);
        _wiggle.scale = 60;
        _wiggle.speed = 20;
        _wiggle.attract = attract;

        _attractor = new FlockingAttract();
        _attractor.addPoint(attract, 100000, 350);
        _attractor.addPoint(new Vector3(), 600, -600);
        _system.addBehavior(_attractor);

        _system.addBehavior(new FlockingRotation());

        _system.friction = 0.993;
    }

    function loop(time, delta, mouse) {
        _count ++;
        _system.update();

        var data = _converter.convert();
        var message = {};
        var buffers = [];

        for (var key in data) {
            message[key] = data[key];
            buffers.push(data[key].buffer);
        }

        emit('transfer', message, buffers);
    }

    //*** Event handlers

    //*** Public methods
    this.init = function(e) {
        initSystem();
        initParticles(e.total);
        initBehaviours();
    };

    this.disperse = function() {
        _attractor.addPoint(new Vector3(0, 0, 0), 1000, 1000);
    };

    this.assemble = function() {
        _attractor.removeLastPoint();
    };

    this.render = function(e) {
        loop(e.time, e.delta, e.mouse);
    };

    this.recycleBuffer = function(e) {
        _converter.recycle(e.array);
    };

});