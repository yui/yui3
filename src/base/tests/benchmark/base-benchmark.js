YUI.add('base-benchmark', function (Y) {

var suite = Y.BenchmarkSuite = new Benchmark.Suite();

    var MyBase20 = function() {
        MyBase20.superclass.constructor.apply(this, arguments);
    };

    Y.extend(MyBase20, Y.Base);

    MyBase20.NAME = 'myBase20';

    MyBase20.ATTRS = {

        attr1: {
            value: "Foo",
            setter: function(n) {
                return n;
            }
        },

        attr2: {
            value: "Bar",
            setter: function(n) {
                return n;
            }
        },

        attr3: {
            value: true
        },

        attr4: {
            value: 3
        },

        attr5: {
            value: 3
        },

        attr6: {
            value: false,
            setter: function(lock) {
                return lock;
            }
        },

        attr7: {
            value: 10
        },

        attr8: {
            value: {}
        },

        attr9: {
            value: []
        },

        attr10: {
            value: "Foobar"
        },

        attr11: {
            value: 25
        },

        attr12: {
            value: null
        },

        attr13: {
            value: false
        },

        attr14: {
            value: false,
            setter: function(val) {
                return val;
            }
        },

        attr15: {
            value: null,
            setter: function(val) {
                return false;
            }
        },

        attr16: {
            value: ['default'],

            getter: function() {
                return false;
            },

            setter: function(g) {
                return g;
            }
        },
        attr17: {
            value: null,
            setter: function(g) {
                return g;
            }
        },
        attr18: {
            writeOnce: true,
            value: null
        },
        attr19: {
            writeOnce: true,
            value: null
        },
        attr20: {
            writeOnce: true,
            value: null
        }
    };

    var MyBase = function() {
	   MyBase.superclass.constructor.apply(this, arguments);
    };
    
    MyBase.NAME = "myBase";

    Y.extend(MyBase, Y.Base);

suite.add('Base', function () {
   var b = new Y.Base();    
});

suite.add('MyBase', function () {
   var b = new MyBase();   
});

suite.add('MyBase with 20 varied attributes', function () {
   var b = new MyBase20(); 
});

}, '@VERSION@', {requires: ['base']});
