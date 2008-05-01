YUI.add('sample', function(Y) {
    /**
     * Basic template for utilities that consume Nodes 
     * @class Sample
     */
    var Sample = function() {
        Sample.superclass.constructor.apply(this, arguments);
    };

    Sample.NAME = '';

    Sample.ATTRS = {
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

    Y.extend(Sample, Y.Base, proto);
    Y.sample = Sample;

}, '3.0.0', {requires: ['base']});
