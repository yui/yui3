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

    var MyBase10 = function() {
        MyBase10.superclass.constructor.apply(this, arguments);
    };

    Y.extend(MyBase10, Y.Base);

    MyBase10.NAME = 'myBase10';

    MyBase10.ATTRS = {

        attr1: {
            value: "Foo"
        },

        attr2: {
            value: "Bar"
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
            value: false
        },

        attr7: {
            value: 10
        },

        attr8: {
            value: true
        },

        attr9: {
            value: false
        },

        attr10: {
            value: null
        }
    };

    var MyBase = function() {
       MyBase.superclass.constructor.apply(this, arguments);
    };

    MyBase.NAME = "myBase";

    Y.extend(MyBase, Y.Base);

    var GLOBAL_MY_BASE_10 = new MyBase10();
    var UNIQUE_VALUE = 10;
    var OPTS = {src:'internal'};

    suite.add('Base', function () {
       var b = new Y.Base();
    });

    suite.add('MyBase', function () {
       var b = new MyBase();
    });

    suite.add('MyBase with 10 simple value attributes', function () {
       var b = new MyBase10();
    });

    suite.add('MyBase with 20 varied attributes', function () {
       var b = new MyBase20();
    });

    suite.add('MyBase with 10 simple value attributes - set', function () {
        GLOBAL_MY_BASE_10.set("attr4", UNIQUE_VALUE++);
    });

    suite.add('MyBase with 10 simple value attributes - set with opts', function () {
        GLOBAL_MY_BASE_10.set("attr4", UNIQUE_VALUE++, OPTS);
    });

    suite.add('MyBase with 10 simple value attributes - get', function () {
       var val = GLOBAL_MY_BASE_10.get("attr2");
    });

    suite.add('MyModel with 2 ad-hoc attrs', function () {
        var b = new MyModel({
            label : 1,
            description : "01234567890"
        });
    });

}, '@VERSION@', {requires: ['base']});
