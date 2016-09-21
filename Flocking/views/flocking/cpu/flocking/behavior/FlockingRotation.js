Class(function FlockingRotation() {
    Inherit(this, Component);
    var _this = this;

    var _origin = new Vector3(0, 0, -1);
    var _u = new Vector3();
    var _c = new Vector3();
    var _axis = new Vector3(0, 0, -1);
    var _z = new THREE.Quaternion();

    //*** Constructor
    (function () {

    })();

    //*** Event handlers

    //*** Public methods
    this.applyBehavior = function(p) {
        _u.copyFrom(p.vel);
        _u.normalize();
        _c.copyFrom(_u);
        var cos_theta = _u.dot(_origin);
        var angle = Math.acos(cos_theta);
        _c.cross(_origin);
        _c.normalize();
        p.targetRotation.setFromAxisAngle(_c, angle);

        _z.setFromAxisAngle(_axis, -0.5 + p.random * 2);
        p.targetRotation.multiply(_z);

        p.rotation.slerp(p.targetRotation, 0.07);
        p.finalPosition.lerp(p.pos, 0.1);
    }
});