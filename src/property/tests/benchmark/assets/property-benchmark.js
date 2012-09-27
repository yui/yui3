YUI.add('property-benchmark', function (Y) {

var multi = new Y.Multi({
        seeds: {
            oldY: {
                url: 'http://yui.yahooapis.com/3.7.2/build/yui/yui.js',
                use: ['attribute']
            },

            newY: {
                url: '../../../../build/yui/yui.js',
                use: ['attribute', 'property']
            }
        }
    }),

    suite = new Benchmark.Suite('Y.Property', {
        onComplete: function (e) {
            Y.log('Finished.', 'info', 'TestRunner');
        },

        onCycle: function (e) {
            if (!e.target.aborted) {
                Y.log(String(e.target), 'info', 'TestRunner');
            }
        },

        onError: function (e) {
            Y.log(String(e.target.error), 'fail', 'TestRunner');
        },

        onStart: function (e) {
            Y.log('Running benchmark.', 'info', 'TestRunner');
        }
    });

Y.PropertyBenchmark = {
    multi: multi,
    suite: suite
};

function setup() {
    var multi = Y.PropertyBenchmark.multi,
        win   = Y.config.win,

        attrs = {
            a: {
                value: 'a value',
                readOnly: true
            },

            b: {
                getter: function () {
                    return 'b value';
                }
            },

            c: {
                value: {
                    subProp: {
                        subSubProp: 'c value'
                    }
                }
            }
        },

        props = {
            a: {
                value: 'a value'
            },

            b: {
                get: function () {
                    return 'b value';
                }
            },

            c: {
                writable: true,
                value: {
                    subProp: {
                        subSubProp: 'c value'
                    }
                }
            }
        };

    function AttrBaseClass() {
        this.addAttrs(attrs);
    }

    function AttrClass() {
        this.addAttrs(attrs);
    }

    function PropBaseClass() {
        this.defineProperties(props);
    }

    function PropClass() {
        this.defineProperties(props);
    }

    Y.augment(AttrBaseClass, multi.newY.AttributeCore);
    Y.augment(AttrClass, multi.newY.Attribute);
    Y.augment(PropBaseClass, multi.newY.Property.Base);
    Y.augment(PropClass, multi.newY.Property);

    var attrBaseInstance = new AttrBaseClass(),
        attrInstance     = new AttrClass(),
        propBaseInstance = new PropBaseClass(),
        propInstance     = new PropClass();
}

function teardown() {
    // nothing to see here
}

// -- Initialization -----------------------------------------------------------

suite.add('[AttrBase] Initialization', function () {
    win.result = new AttrBaseClass();
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[PropBase] Initialization', function () {
    win.result = new PropBaseClass();
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Attr] Initialization', function () {
    win.result = new AttrClass();
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Prop] Initialization', function () {
    win.result = new PropClass();
}, {
    setup   : setup,
    teardown: teardown
});

}, '@VERSION@', {requires: ['multi']});
