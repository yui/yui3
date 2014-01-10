YUI.add('base-core-benchmark', function (Y) {

var suite = Y.BenchmarkSuite = new Benchmark.Suite();

    // MyBaseCore

    var MyBaseCore20 = function() {
        MyBaseCore20.superclass.constructor.apply(this, arguments);
    };

    Y.extend(MyBaseCore20, Y.BaseCore);

    MyBaseCore20.NAME = 'myBase20';

    MyBaseCore20.ATTRS = {

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

    var MyBaseCore20Ideal = function() {
        MyBaseCore20Ideal.superclass.constructor.apply(this, arguments);
    };

    Y.extend(MyBaseCore20Ideal, Y.BaseCore);

    MyBaseCore20Ideal.NAME = 'myBaseCore20Ideal';

    MyBaseCore20Ideal.ATTRS = {

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
            valueFn: function() {
                return {};
            }
        },

        attr9: {
            valueFn : function() {
                return [];
            }
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
            valueFn: function() {
                return ['default'];
            },

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

    var MyBaseCore10 = function() {
        MyBaseCore10.superclass.constructor.apply(this, arguments);
    };

    Y.extend(MyBaseCore10, Y.BaseCore);

    MyBaseCore10.NAME = 'myBaseCore10';

    MyBaseCore10.ATTRS = {

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

    var MyBaseCore = function() {
       MyBaseCore.superclass.constructor.apply(this, arguments);
    };

    MyBaseCore.NAME = "myBaseCore";

    Y.extend(MyBaseCore, Y.BaseCore);

var GLOBAL_MY_BASE_CORE_10 = new MyBaseCore10();
var UNIQUE_VALUE = 10;

// BaseCore

suite.add('BaseCore', function () {
   var b = new Y.BaseCore();
});

suite.add('MyBaseCore', function () {
   var b = new MyBaseCore();
});

suite.add('MyBaseCore with 10 simple value attributes', function () {
   var b = new MyBaseCore10();
});

suite.add('MyBaseCore with 20 varied attributes', function () {
   var b = new MyBaseCore20();
});

suite.add('MyBaseCore with 20 varied attributes (using perf. best practices)', function () {
   var b = new MyBaseCore20Ideal();
});

suite.add('MyBaseCore with 10 simple value attributes - set', function () {
    GLOBAL_MY_BASE_CORE_10.set("attr1", UNIQUE_VALUE++);
});

suite.add('MyBaseCore with 10 simple value attributes - get', function () {
   var val = GLOBAL_MY_BASE_CORE_10.get("attr2");
});

}, '@VERSION@', {requires: ['base-core']});
