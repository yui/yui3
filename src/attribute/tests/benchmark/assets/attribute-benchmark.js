YUI.add('attribute-benchmark', function (Y) {

var multi = new Y.Multi({
        seeds: {
            oldY: {
                url: 'http://yui.yahooapis.com/3.6.0/build/yui/yui.js',
                use: ['attribute', 'base-build']
            },

            newY: {
                url: '../../../../build/yui/yui.js',
                use: ['attribute', 'base-build']
            }
        }
    }),

    suite = new Benchmark.Suite('Y.Attribute', {
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

Y.AttributeBenchmark = {
    multi: multi,
    suite: suite
};

function setup() {
    var multi = Y.AttributeBenchmark.multi;

    function OldClass() {}
    function NewClass() {}

    OldClass.ATTRS = NewClass.ATTRS = {
        initA: {value: 'a'},
        initB: {value: 'b'},
        initC: {value: 'c'},
        initD: {value: {subA: 'a', subB: {subSubB: 'a'}, subC: 'c'}}
    };

    multi.oldY.augment(OldClass, multi.oldY.Attribute);
    multi.newY.augment(NewClass, multi.newY.Attribute);

    var oldInstance = new OldClass(),
        newInstance = new NewClass();

    oldInstance.set('initB', 'modifiedB');
    newInstance.set('initB', 'modifiedB');

    var OldBaseClass = multi.oldY.Base.create('oldBaseClass', multi.oldY.Base, [], {}, {
        ATTRS: {
            initA: {value: 'a'},
            initB: {value: 'b'},
            initC: {value: 'c'},
            initD: {value: {subA: 'a', subB: {subSubB: 'a'}, subC: 'c'}}
        }
    });

    var NewBaseClass = multi.newY.Base.create('newBaseClass', multi.newY.Base, [], {}, {
        ATTRS: {
            initA: {value: 'a'},
            initB: {value: 'b'},
            initC: {value: 'c'},
            initD: {value: {subA: 'a', subB: {subSubB: 'a'}, subC: 'c'}}
        }
    });

    var OldBaseCoreClass = multi.oldY.Base.create('oldBaseCoreClass', multi.oldY.BaseCore, [], {}, {
        ATTRS: {
            initA: {value: 'a'},
            initB: {value: 'b'},
            initC: {value: 'c'},
            initD: {value: {subA: 'a', subB: {subSubB: 'a'}, subC: 'c'}}
        }
    });

    var NewBaseCoreClass = multi.newY.Base.create('newBaseCoreClass', multi.newY.BaseCore, [], {}, {
        ATTRS: {
            initA: {value: 'a'},
            initB: {value: 'b'},
            initC: {value: 'c'},
            initD: {value: {subA: 'a', subB: {subSubB: 'a'}, subC: 'c'}}
        }
    });
}

function teardown() {
    // nothing to see here
}

Y.config.win.noop = function () {
    window.nothing = arguments;
};

// -- Initialization -----------------------------------------------------------

suite.add('[Old] initialization (non-Base)', function () {
    noop(new OldClass());
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] initialization (non-Base)', function () {
    noop(new NewClass());
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] initialization (Base)', function () {
    noop(new OldBaseClass());
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] initialization (Base)', function () {
    noop(new NewBaseClass());
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] initialization (BaseCore)', function () {
    noop(new OldBaseCoreClass());
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] initialization (BaseCore)', function () {
    noop(new NewBaseCoreClass());
}, {
    setup   : setup,
    teardown: teardown
});

// -- addAttrs() ---------------------------------------------------------------

suite.add('[Old] addAttrs()', function () {
    oldInstance.addAttrs({
        a: {value: 'a'},
        b: {value: 'b', lazyAdd: true},
        c: {value: 'c', lazyAdd: true},
        d: {value: {subA: 'a', subB: {subSubB: 'a'}, subC: 'c'}}
    });

    noop(oldInstance);
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] addAttrs()', function () {
    newInstance.addAttrs({
        a: {value: 'a'},
        b: {value: 'b', lazyAdd: true},
        c: {value: 'c', lazyAdd: true},
        d: {value: {subA: 'a', subB: {subSubB: 'a'}, subC: 'c'}}
    });

    noop(newInstance);
}, {
    setup   : setup,
    teardown: teardown
});

// -- get() --------------------------------------------------------------------

suite.add('[Old] get() [simple]', function () {
    noop(oldInstance.get('initA'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] get() [simple]', function () {
    noop(newInstance.get('initA'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] get() [object]', function () {
    noop(oldInstance.get('initD'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] get() [object]', function () {
    noop(newInstance.get('initD'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] get() [sub-property]', function () {
    noop(oldInstance.get('initD.subB.subSubB'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] get() [sub-property]', function () {
    noop(newInstance.get('initD.subB.subSubB'));
}, {
    setup   : setup,
    teardown: teardown
});

// -- getAttrs() ---------------------------------------------------------------

suite.add('[Old] getAttrs() [all]', function () {
    noop(oldInstance.getAttrs());
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] getAttrs() [all]', function () {
    noop(newInstance.getAttrs());
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] getAttrs() [named]', function () {
    noop(oldInstance.getAttrs(['initA', 'initC', 'initD']));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] getAttrs() [named]', function () {
    noop(newInstance.getAttrs(['initA', 'initC', 'initD']));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] getAttrs() [modified]', function () {
    noop(oldInstance.getAttrs(true));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] getAttrs() [modified]', function () {
    noop(newInstance.getAttrs(true));
}, {
    setup   : setup,
    teardown: teardown
});

// -- set() --------------------------------------------------------------------

suite.add('[Old] set() [simple]', function () {
    noop(oldInstance.set('initA', 'setA'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] set() [simple]', function () {
    noop(newInstance.set('initA', 'setA'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] set() [object]', function () {
    noop(oldInstance.set('initA', {subA: 'a', subB: {subSubB: 'b'}, subC: 'c'}));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] set() [object]', function () {
    noop(newInstance.set('initA', {subA: 'a', subB: {subSubB: 'b'}, subC: 'c'}));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[Old] set() [sub-property]', function () {
    noop(oldInstance.set('initD.subB.subSubB', 'foo'));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] set() [sub-property]', function () {
    noop(newInstance.set('initD.subB.subSubB', 'foo'));
}, {
    setup   : setup,
    teardown: teardown
});

// -- setAttrs() ---------------------------------------------------------------

suite.add('[Old] setAttrs()', function () {
    noop(oldInstance.setAttrs({
        initA: 'newA',
        initB: 'newB',
        'initD.subB.subSubB': 'newSubSubB'
    }));
}, {
    setup   : setup,
    teardown: teardown
});

suite.add('[New] setAttrs()', function () {
    noop(newInstance.setAttrs({
        initA: 'newA',
        initB: 'newB',
        'initD.subB.subSubB': 'newSubSubB'
    }));
}, {
    setup   : setup,
    teardown: teardown
});

}, '@VERSION@', {requires: ['multi']});
