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

}, '@VERSION@', {requires: ['base']});
