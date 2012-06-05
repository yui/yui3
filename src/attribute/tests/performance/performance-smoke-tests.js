YUI.add("attribute-performance-smoke-tests", function(Y) {

    function Test(cfg, lazy) {
        this._lazyAddAttrs = lazy;
        Test.superclass.constructor.apply(this, arguments);
    };

    Test.NAME = 'test';

    Test.ATTRS = {

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
            value: false
        },

        attr8: {
            value: true
        },

        attr9: {
            value: true
        },

        attr10: {
            value: false
        },

        attr11: {
            value: true
        },

        attr12: {
            value: false
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

    Y.extend(Test, Y.Base, {
        foo: function() {}
    });
            
    var perfSuite = new Y.Test.Suite({name:"Attribute Performance Tests"});
    perfSuite.add(new Y.Test.Case({

        name: "Performance Tests",

        testTimeConstruction: function() {
            var start, end, n = 20, t, i;

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test(null, false);
                t.getAttrs();
                t = null;
            }
            end = new Date().getTime();
            Y.log("Construction Time Populated (upfront): " + ((end-start)/n), "perf", "perf-test");

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test();
                t.getAttrs();
                t = null;
            }
            end = new Date().getTime();
            Y.log("Construction Time Populated (lazy): " + ((end-start)/n), "perf", "perf-test");

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test(null, false);
                t = null;
            }
            end = new Date().getTime();
            Y.log("Construction Time (upfront): " + ((end-start)/n), "perf", "perf-test");

            start = new Date().getTime();
            for (i = 0; i < n; i++) {
                t = new Test();
                t = null;
            }
            end = new Date().getTime();

            var time = (end-start)/n;
            var expectedTime = (Y.UA.ie && Y.UA.ie <= 6) ? 15 : 10;

            Y.log("Construction Time (lazy): " + time, "perf", "perf-test");

            Y.Assert.isTrue((time < expectedTime));
        },

        testStateForPerfSwitches : function() {

            // Lazy
            t = new Test();
            var x = t.getAttrs();

            // Non Lazy (Upfront)
            t = new Test(null, false);
            var y = t.getAttrs();

            // Lazy and Silent
            t = new Test(null, true, true);
            var z = t.getAttrs();

            Y.Assert.areEqual(Y.dump(x), Y.dump(y), "Lazy vs. Upfront: attr state is not equal");
            Y.Assert.areEqual(Y.dump(y), Y.dump(z), "Upfront vs. Lazy and Silent: attr state is not equal");
        }
    }));

    Y.Test.Runner.add(perfSuite);

}, "@VERSION@", {requires : ["base", "dump", "test"]});