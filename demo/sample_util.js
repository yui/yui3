YUI.add('anim', function(Y) {
    /**
     * Handles animation queueing and threading.
     * @class Anim
     */
    Anim = function() {
        Anim.superclass.constructor.apply(this, arguments);
    };

    Anim.NAME = 'anim';

    Anim.ATTRS = {
        node: {
            set: function(node) {
                return Y.Node.get(node);
            }
        }

    };

    var proto = {
        play: function() {},
        pause: function() {},
        stop: function() {}
    };

    Y.extend(Anim, Y.Base, proto);
    Y.Anim = Anim;

}, '3.0.0', {requires: ['base']});
