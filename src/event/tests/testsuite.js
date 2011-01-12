YUI.add('event-synthetic-test', function(Y) {

var suite = new Y.Test.Suite("Y.SyntheticEvent");

function initTestbed() {
    var testbed = Y.one('#testbed'),
        outer   = Y.one('#outer'),
        body;

    if (!testbed) {
        body = Y.one('body');
        testbed = body.create('<div id="testbed"></div>');
        body.prepend(testbed);
    }

    if (outer) {
        outer.destroy(true);
    }

    testbed.setContent(
'<div id="outer">' +
    '<button id="button1">Button 1 text</button>' +
    '<ul class="nested">' +
        '<li id="item1">Item 1</li>' +
        '<li id="item2" class="nested">Item 2</li>' +
        '<li id="item3">Item 3</li>' +
    '</ul>' +
    '<div id="inner">' +
        '<p id="p1_no">no</p>' +
        '<p id="p2_yes">yes</p>' +
        '<div id="inner_1">' +
            '<p id="inner_1_p1_no">no</p>' +
            '<p id="inner_1_p2_yes">yes</p>' +
        '</div>' +
        '<p id="p3_no">no</p>' +
    '</div>' +
'</div>');
}

// Y.on(x, fn, node)
// Y.on(x, fn, node, thisObj)
// Y.on(x, fn, node, thisObj, arg)
// Y.on(x, fn, node, null, arg)

// Y.on(x, fn, el)
// Y.on(x, fn, el, thisObj)
// Y.on(x, fn, el, thisObj, arg)
// Y.on(x, fn, el, null, arg)

// Y.on(x, fn, selectorOne)
// Y.on(x, fn, selectorOne, thisObj)
// Y.on(x, fn, selectorOne, thisObj, arg)
// Y.on(x, fn, selectorOne, null, arg)

// Y.on(x, fn, selectorMultiple)
// Y.on(x, fn, selectorMultiple, thisObj)
// Y.on(x, fn, selectorMultiple, thisObj, arg)
// Y.on(x, fn, selectorMultiple, null, arg)

// Y.on(x, fn, notYetAvailable)
// Y.on(x, fn, notYetAvailable, thisObj)
// Y.on(x, fn, notYetAvailable, thisObj, arg)
// Y.on(x, fn, notYetAvailable, null, arg)

// node.on(x, fn)
// node.on(x, fn, thisObj)
// node.on(x, fn, thisObj, arg)
// node.on(x, fn, null, arg)

// nodelist.on(x, fn)
// nodelist.on(x, fn, thisObj)
// nodelist.on(x, fn, thisObj, arg)
// nodelist.on(x, fn, null, arg)

// node.on(x, fn) + node.on(x, fn) vs dup
// Y.on(x, fn) + node.on(x, fn) vs dup
// nodelist.on(x, fn) + node.on(x, fn) vs dup
suite.add(new Y.Test.Case({
    name: "API",

    "Y.Event.define should register a new synth in DOM_EVENTS": function () {
        Y.Event.define('synth', {
            index: 0
        });

        Y.Assert.isNotUndefined(Y.Node.DOM_EVENTS.synth);
        Y.Assert.isNotUndefined(Y.Env.evt.plugins.synth);
        Y.Assert.isNotUndefined(Y.Node.DOM_EVENTS.synth.eventDef);
        Y.Assert.areSame(0, Y.Node.DOM_EVENTS.synth.eventDef.index);
    },

    "Subsequent Y.Event.define() should not overwrite existing synth": function () {
        Y.Event.define('synth', {
            index: 1
        });

        Y.Assert.areSame(0, Y.Node.DOM_EVENTS.synth.eventDef.index);
    },

    "Y.Event.define(..., true) should overwrite existing synth": function () {
        Y.Event.define('synth', {
            index: 2
        }, true);

        Y.Assert.areSame(2, Y.Node.DOM_EVENTS.synth.eventDef.index);
    }
}));

suite.add(new Y.Test.Case({
    name: "Y.on",

    setUp: initTestbed,

    "test Y.on('synth', fn, selector)": function () {

    }
}));

suite.add(new Y.Test.Case({
    tearDown: function () {
        Y.one('#outer').remove(true);
    },

    "test ": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "Attributes",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));


suite.add(new Y.Test.Case({
    name: "Runtime expectations",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "Bugs",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['test', 'event-synthetic']});
