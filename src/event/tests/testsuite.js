YUI.add('event-synthetic-test', function(Y) {

// Not sure why the module isn't getting included
if (!Y.Node.prototype.simulate) {
    Y.Node.prototype.simulate = function(type, options) {
        Y.Event.simulate(this._node, type, options);
    };
}
Y.Node.prototype.click = function () { this.simulate('click'); };



var suite = new Y.Test.Suite("Y.SyntheticEvent");

function initTestbed() {
    var testbed = Y.one('#testbed'),
        body;

    if (!testbed) {
        body = Y.one('body');
        testbed = body.create('<div id="testbed"></div>');
        body.prepend(testbed);
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
            '<p id="inner_1_p1_no"><em>no</em></p>' +
            '<p id="inner_1_p2_yes">yes</p>' +
        '</div>' +
        '<p id="p3_no">no</p>' +
    '</div>' +
'</div>');
}

function initSynth() {
    Y.Event.define('synth', {
        on: function (node, sub, notifier, filter) {
            var method = (filter) ? 'delegate' : 'on';

            sub._handle = node[method]('click',
                Y.bind(notifier.fire, notifier), filter);
        },

        delegate: function () {
            this.on.apply(this, arguments);
        },

        detach: function (node, sub) {
            sub._handle.detach();
        },

        detachDelegate: function () {
            this.detach.apply(this, arguments);
        }
    }, true);
}

function setUp() {
    initTestbed();
    initSynth();
}

function destroyTestbed() {
    var testbed = Y.one('#testbed');
    if (testbed) {
        testbed.purge(true).remove();
    }
}

function undefineSynth() {
    delete Y.Node.DOM_EVENTS.synth;
    delete Y.Env.evt.plugins.synth;
}

function tearDown() {
    undefineSynth();
    destroyTestbed();
}

/******************************************************************************/
/******************************  Tests begin here  ****************************/
/******************************************************************************/

suite.add(new Y.Test.Case({
    name: "Y.Event.define",

    "Y.Event.define(name) should add to DOM_EVENTS": function () {
        delete Y.Node.DOM_EVENTS.mouseover;
        
        Y.Assert.isUndefined(Y.Node.DOM_EVENTS.mouseover);

        Y.Event.define('mouseover');

        Y.Assert.isNotUndefined(Y.Node.DOM_EVENTS.mouseover);
    },

    "Y.Event.define([name1, name2]) should add to DOM_EVENTS": function () {
        delete Y.Node.DOM_EVENTS.mouseover;
        delete Y.Node.DOM_EVENTS.mouseout;
        
        Y.Assert.isUndefined(Y.Node.DOM_EVENTS.mouseover);
        Y.Assert.isUndefined(Y.Node.DOM_EVENTS.mouseout);

        Y.Event.define(['mouseover', 'mouseout']);

        Y.Assert.isNotUndefined(Y.Node.DOM_EVENTS.mouseover);
        Y.Assert.isNotUndefined(Y.Node.DOM_EVENTS.mouseout);
    },

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

    setUp: setUp,
    tearDown: tearDown,

    "test Y.on('synth', fn, node)": function () {
        var target = Y.one("#item3"),
            type, currentTarget, thisObj;

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
        }, target);

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
    },

    "test Y.on('synth', fn, node, thisObj)": function () {
        var target = Y.one("#item3"),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo;

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
        }, target, obj);

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
    },

    "test Y.on('synth', fn, node, thisObj, arg)": function () {
        var target = Y.one("#item3"),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo, arg;

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
            arg = x;
        }, target, obj, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
        Y.Assert.areSame('arg!', arg);
    },

    "test Y.on('synth', fn, node, null, arg)": function () {
        var target = Y.one("#item3"),
            type, currentTarget, thisObj, arg;

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            arg = x;
        }, target, null, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame('arg!', arg);
    },

    "test Y.on('synth', fn, el)": function () {
        var targetEl = Y.DOM.byId('item3'),
            target = Y.one(targetEl),
            type, currentTarget, thisObj;

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
        }, targetEl);

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
    },

    "test Y.on('synth', fn, el, thisObj)": function () {
        var targetEl = Y.DOM.byId("item3"),
            target = Y.one(targetEl),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo;

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
        }, targetEl, obj);

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
    },

    "test Y.on('synth', fn, el, thisObj, arg)": function () {
        var targetEl = Y.DOM.byId("item3"),
            target = Y.one(targetEl),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo, arg;

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
            arg = x;
        }, targetEl, obj, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
        Y.Assert.areSame('arg!', arg);
    },

    "test Y.on('synth', fn, el, null, arg)": function () {
        var targetEl = Y.DOM.byId("item3"),
            target = Y.one(targetEl),
            type, currentTarget, thisObj, arg;

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            arg = x;
        }, targetEl, null, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame('arg!', arg);
    },

    "test Y.on('synth', fn, selectorOne)": function () {
        var target = Y.one('#item3'),
            type, currentTarget, thisObj;

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
        }, '#item3');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
    },

    "test Y.on('synth', fn, selectorOne, thisObj)": function () {
        var target = Y.one('#item3'),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo;

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
        }, '#item3', obj);

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
    },

    "test Y.on('synth', fn, selectorOne, thisObj, arg)": function () {
        var target = Y.one('#item3'),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo, arg;

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
            arg = x;
        }, '#item3', obj, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
        Y.Assert.areSame('arg!', arg);
    },

    "test Y.on('synth', fn, selectorOne, null, arg)": function () {
        var target = Y.one('#item3'),
            type, currentTarget, thisObj, arg;

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            arg = x;
        }, '#item3', null, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame('arg!', arg);
    },

    "test Y.on('synth', fn, selectorMultiple)": function () {
        var item1 = Y.one('#item1'),
            item2 = Y.one('#item2'),
            item3 = Y.one('#item3'),
            type = [],
            currentTarget = [],
            thisObj = [];

        Y.on('synth', function (e) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
        }, '#outer li');

        item1.click();
        item2.click();
        item3.click();

        Y.ArrayAssert.itemsAreSame(['synth','synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], currentTarget);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], thisObj);
    },

    "test Y.on('synth', fn, selectorMultiple, thisObj)": function () {
        var item1 = Y.one('#item1'),
            item2 = Y.one('#item2'),
            item3 = Y.one('#item3'),
            obj  = { foo: 'bar' },
            type = [],
            currentTarget = [],
            thisObj = [],
            foo = [];

        Y.on('synth', function (e) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
        }, '#outer li', obj);

        item1.click();
        item2.click();
        item3.click();

        Y.ArrayAssert.itemsAreSame(['synth','synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(['bar', 'bar', 'bar'], foo);
    },

    "test Y.on('synth', fn, selectorMultiple, thisObj, arg)": function () {
        var item1 = Y.one('#item1'),
            item2 = Y.one('#item2'),
            item3 = Y.one('#item3'),
            obj  = { foo: 'bar' },
            type = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            arg = [];

        Y.on('synth', function (e, x) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            arg.push(x);
        }, '#outer li', obj, 'arg!');

        item1.click();
        item2.click();
        item3.click();

        Y.ArrayAssert.itemsAreSame(['synth','synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(['bar', 'bar', 'bar'], foo);
        Y.ArrayAssert.itemsAreSame(['arg!', 'arg!', 'arg!'], arg);
    },

    "test Y.on('synth', fn, selectorMultiple, null, arg)": function () {
        var item1 = Y.one('#item1'),
            item2 = Y.one('#item2'),
            item3 = Y.one('#item3'),
            type = [],
            currentTarget = [],
            thisObj = [],
            arg = [];

        Y.on('synth', function (e, x) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            arg.push(x);
        }, '#outer li', null, 'arg!');

        item1.click();
        item2.click();
        item3.click();

        Y.ArrayAssert.itemsAreSame(['synth','synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], currentTarget);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], thisObj);
        Y.ArrayAssert.itemsAreSame(['arg!', 'arg!', 'arg!'], arg);
    },

    "test Y.on('synth', fn, notYetAvailable)": function () {
        var inner = Y.one('#inner'),
            test = this,
            type = [],
            currentTarget = [],
            thisObj = [];

        inner.all('#p4').remove();

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
        }, '#p4');

        inner.append("<p id='p4'>Added</p>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var p4 = inner.one('#p4');
                if (p4) {
                    p4.click();
                    Y.Assert.areSame('synth', type);
                    Y.Assert.areSame(p4, currentTarget);
                    Y.Assert.areSame(p4, thisObj);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#p4');

        test.wait();
    },

    "test Y.on('synth', fn, notYetAvailable, thisObj)": function () {
        var inner = Y.one('#inner'),
            test = this,
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo;

        inner.all('#p4').remove();

        Y.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
        }, '#p4', obj);

        inner.append("<p id='p4'>Added</p>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var p4 = inner.one('#p4');
                if (p4) {
                    p4.click();
                    Y.Assert.areSame('synth', type);
                    Y.Assert.areSame(p4, currentTarget);
                    Y.Assert.areSame(obj, thisObj);
                    Y.Assert.areSame('bar', foo);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#p4');

        test.wait();
    },

    "test Y.on('synth', fn, notYetAvailable, thisObj, arg)": function () {
        var inner = Y.one('#inner'),
            test = this,
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo, arg;

        inner.all('#p4').remove();

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
            arg = x;
        }, '#p4', obj, 'arg!');

        inner.append("<p id='p4'>Added</p>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var p4 = inner.one('#p4');
                if (p4) {
                    p4.click();
                    Y.Assert.areSame('synth', type);
                    Y.Assert.areSame(p4, currentTarget);
                    Y.Assert.areSame(obj, thisObj);
                    Y.Assert.areSame('bar', foo);
                    Y.Assert.areSame('arg!', arg);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#p4');

        test.wait();
    },

    "test Y.on('synth', fn, notYetAvailable, null, arg)": function () {
        var inner = Y.one('#inner'),
            test = this,
            type, currentTarget, thisObj, arg;

        inner.all('#p4').remove();

        Y.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            arg = x;
        }, '#p4', null, 'arg!');

        inner.append("<p id='p4'>Added</p>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var p4 = inner.one('#p4');
                if (p4) {
                    p4.click();
                    Y.Assert.areSame('synth', type);
                    Y.Assert.areSame(p4, currentTarget);
                    Y.Assert.areSame(p4, thisObj);
                    Y.Assert.areSame('arg!', arg);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#p4');

        test.wait();
    }
}));

suite.add(new Y.Test.Case({
    name: 'node.on',

    setUp: setUp,
    tearDown: tearDown,

    "test node.on(x, fn)": function () {
        var target = Y.one("#item3"),
            type, currentTarget, thisObj;

        target.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
        });

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
    },

    "test node.on(x, fn, thisObj)": function () {
        var target = Y.one("#item3"),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo;

        target.on('synth', function (e) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
        }, obj);

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
    },

    "test node.on(x, fn, thisObj, arg)": function () {
        var target = Y.one("#item3"),
            obj = { foo: 'bar' },
            type, currentTarget, thisObj, foo, arg;

        target.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            foo = this.foo;
            arg = x;
        }, obj, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame(obj.foo, thisObj.foo);
        Y.Assert.areSame('arg!', arg);
    },

    "test node.on(x, fn, null, arg)": function () {
        var target = Y.one("#item3"),
            type, currentTarget, thisObj, arg;

        target.on('synth', function (e, x) {
            type = e.type;
            currentTarget = e.currentTarget;
            thisObj = this;
            arg = x;
        }, null, 'arg!');

        target.click();

        Y.Assert.areSame('synth', type);
        Y.Assert.areSame(target, currentTarget);
        Y.Assert.areSame(target, thisObj);
        Y.Assert.areSame('arg!', arg);
    }
}));

suite.add(new Y.Test.Case({
    name: 'nodelist.on',

    setUp: setUp,
    tearDown: tearDown,

    "test nodelist.on(x, fn)": function () {
        var targets = Y.all("#inner p"),
            type = [],
            currentTarget = [],
            thisObj = [];

        targets.on('synth', function (e) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
        });

        Y.one("#p1_no").click();
        Y.one("#p3_no").click();
        Y.one("#inner_1_p1_no").click();

        Y.ArrayAssert.itemsAreSame(['synth', 'synth', 'synth'], type);
        Y.ArrayAssert.itemsAreSame(
            [Y.one('#p1_no'), Y.one('#p3_no'), Y.one('#inner_1_p1_no')],
            currentTarget);
        Y.ArrayAssert.itemsAreSame([targets, targets, targets], thisObj);
    },

    "test nodelist.on(x, fn, thisObj)": function () {
        var targets = Y.all("#inner p"),
            obj = { foo: 'bar' },
            type = [],
            currentTarget = [],
            thisObj = [],
            foo = [];

        targets.on('synth', function (e) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
        }, obj);

        Y.one("#p1_no").click();
        Y.one("#p3_no").click();
        Y.one("#inner_1_p1_no").click();

        Y.ArrayAssert.itemsAreSame(['synth', 'synth', 'synth'], type);
        Y.ArrayAssert.itemsAreSame(
            [Y.one('#p1_no'), Y.one('#p3_no'), Y.one('#inner_1_p1_no')],
            currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(['bar', 'bar', 'bar'], foo);
    },

    "test nodelist.on(x, fn, thisObj, arg)": function () {
        var targets = Y.all("#inner p"),
            obj = { foo: 'bar' },
            type = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            arg = [];

        targets.on('synth', function (e, x) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            arg.push(x);
        }, obj, 'arg!');

        Y.one("#p1_no").click();
        Y.one("#p3_no").click();
        Y.one("#inner_1_p1_no").click();

        Y.ArrayAssert.itemsAreSame(['synth', 'synth', 'synth'], type);
        Y.ArrayAssert.itemsAreSame(
            [Y.one('#p1_no'), Y.one('#p3_no'), Y.one('#inner_1_p1_no')],
            currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(['bar', 'bar', 'bar'], foo);
        Y.ArrayAssert.itemsAreSame(['arg!', 'arg!', 'arg!'], arg);
    },

    "test nodelist.on(x, fn, null, arg)": function () {
        var targets = Y.all("#inner p"),
            type = [],
            currentTarget = [],
            thisObj = [],
            arg = [];

        targets.on('synth', function (e, x) {
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            arg.push(x);
        }, null, 'arg!');

        Y.one("#p1_no").click();
        Y.one("#p3_no").click();
        Y.one("#inner_1_p1_no").click();

        Y.ArrayAssert.itemsAreSame(['synth', 'synth', 'synth'], type);
        Y.ArrayAssert.itemsAreSame(
            [Y.one('#p1_no'), Y.one('#p3_no'), Y.one('#inner_1_p1_no')],
            currentTarget);
        Y.ArrayAssert.itemsAreSame([targets, targets, targets], thisObj);
        Y.ArrayAssert.itemsAreSame(['arg!', 'arg!', 'arg!'], arg);
    }
}));

suite.add(new Y.Test.Case({
    name: 'preventDups',

    setUp: initTestbed,
    tearDown: tearDown,

    initUniqueSynth: function () {
        Y.Event.define('synth', {
            preventDups: true,

            on: function (node, sub, notifier, filter) {
                var method = (filter) ? 'delegate' : 'on';

                sub._handle = node[method]('click',
                    Y.bind(notifier.fire, notifier), filter);
            },

            detach: function (node, sub) {
                sub._handle.detach();
            }
        }, true);
    },

    "node.on(x, fn) + node.on(x, fn) should  allow dups": function () {
        initSynth();

        var target = Y.one("#item1"),
            count = 0;

        function increment() {
            count++;
        }

        target.on('synth', increment);
        target.on('synth', increment);

        Y.one("#item1").click();

        Y.Assert.areSame(2, count);
    },

    "Y.on(x, fn) + node.on(x, fn) should allow dups": function () {
        initSynth();

        var count = 0;

        function increment() {
            count++;
        }

        Y.one('#item1').on('synth', increment);
        Y.on('synth', increment, '#item1');

        Y.one("#item1").click();

        Y.Assert.areSame(2, count);
    },

    "nodelist.on(x, fn) + node.on(x, fn) should allow dups": function () {
        initSynth();

        var count = 0;

        function increment() {
            count++;
        }

        Y.all("#item1").on('synth', increment);
        Y.one("#item1").on('synth', increment);

        Y.one("#item1").click();

        Y.Assert.areSame(2, count);
    },

    "preventDups:true node.on(x, fn) + node.on(x, fn) should prevent dups": function () {
        this.initUniqueSynth();

        var target = Y.one("#item1"),
            count = 0;

        function increment() {
            count++;
        }

        target.on('synth', increment);
        target.on('synth', increment);

        Y.one("#item1").click();

        Y.Assert.areSame(1, count);
    },

    "preventDups:true Y.on(x, fn) + node.on(x, fn) should prevent dups": function () {
        this.initUniqueSynth();

        var count = 0;

        function increment() {
            count++;
        }

        Y.one('#item1').on('synth', increment);
        Y.on('synth', increment, '#item1');

        Y.one("#item1").click();

        Y.Assert.areSame(1, count);
    },

    "preventDups:true nodelist.on(x, fn) + node.on(x, fn) should prevent dups": function () {
        this.initUniqueSynth();

        var count = 0;

        function increment() {
            count++;
        }

        Y.all("#item1").on('synth', increment);
        Y.one("#item1").on('synth', increment);

        Y.one("#item1").click();

        Y.Assert.areSame(1, count);
    }
}));

suite.add(new Y.Test.Case({
    name: "node.delegate",

    setUp: setUp,
    tearDown: tearDown,

    "test node.delegate(synth, fn, filter)": function () {
        var count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        inner.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            container.push(e.container);
        }, 'p');

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test node.delegate(synth, fn, filter, thisObj)": function () {
        var count = 0,
            obj = { foo: "bar" },
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        inner.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            container.push(e.container);
        }, 'p', obj);

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar", "bar"], foo);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test node.delegate(synth, fn, filter, thisObj, arg)": function () {
        var count = 0,
            obj = { foo: "bar" },
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            arg = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        inner.delegate('synth', function (e, x) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            arg.push(x);
            container.push(e.container);
        }, 'p', obj, 'arg!');

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar", "bar"], foo);
        Y.ArrayAssert.itemsAreSame(["arg!", "arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test node.delegate(synth, fn, filter, null, arg)": function () {
        var count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            arg = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        inner.delegate('synth', function (e, x) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            arg.push(x);
            container.push(e.container);
        }, 'p', null, "arg!");

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
        Y.ArrayAssert.itemsAreSame(["arg!", "arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    }

}));

suite.add(new Y.Test.Case({
    name: "Y.delegate",

    setUp: setUp,
    tearDown: tearDown,

    "test Y.delegate(synth, fn, node, filter)": function () {
        var count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        Y.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            container.push(e.container);
        }, inner, 'p');

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test Y.delegate(synth, fn, el, filter)": function () {
        var count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        Y.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            container.push(e.container);
        }, inner._node, 'p');

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test Y.delegate(synth, fn, selectorOne, filter)": function () {
        var count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        Y.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            container.push(e.container);
        }, "#inner", 'p');

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test Y.delegate(synth, fn, node, filter, thisObj)": function () {
        var count = 0,
            obj = { foo: "bar" },
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        Y.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            container.push(e.container);
        }, inner, 'p', obj);

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar", "bar"], foo);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test Y.delegate(synth, fn, node, filter, thisObj, arg)": function () {
        var count = 0,
            obj = { foo: "bar" },
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            arg = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        Y.delegate('synth', function (e, x) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            arg.push(x);
            container.push(e.container);
        }, inner, 'p', obj, 'arg!');

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar", "bar"], foo);
        Y.ArrayAssert.itemsAreSame(["arg!", "arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test Y.delegate(synth, fn, node, filter, null, arg)": function () {
        var count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            arg = [],
            container = [],
            inner = Y.one("#inner"),
            a = Y.one("#p1_no"),
            b = Y.one("#inner_1_p1_no em");

        Y.delegate('synth', function (e, x) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            arg.push(x);
            container.push(e.container);
        }, inner, 'p', null, "arg!");

        a.click();

        Y.Assert.areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        Y.Assert.areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
        Y.ArrayAssert.itemsAreSame(["arg!", "arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner, inner], container);
    },

    "test Y.delegate(synth, fn, notAvailableYet, filter)": function () {
        var inner = Y.one('#inner'),
            test = this,
            count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            container = [];

        inner.empty();

        Y.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            container.push(e.container);
        }, '#inner_1', 'p');

        inner.setContent("<div id='inner_1'><p id='pass1'>Added</p><div><p id='pass2'><em id='pass2-trigger'>Trigger</em></p></div></div>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var a = inner.one('#pass1'),
                    b = inner.one('#pass2-trigger'),
                    inner1 = inner.one('#inner_1');

                if (a && b && inner1) {
                    a.click();

                    Y.Assert.areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([a], thisObj);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    Y.Assert.areSame(2, count);
                    Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
                    Y.ArrayAssert.itemsAreSame([a, b], target);
                    Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
                    Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
                    Y.ArrayAssert.itemsAreSame([inner1, inner1], container);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#pass2-trigger');

        test.wait();
    },

    "test Y.delegate(synth, fn, notAvailableYet, filter, thisObj)": function () {
        var inner = Y.one('#inner'),
            obj = { foo: 'bar' },
            test = this,
            count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            container = [];

        inner.empty();

        Y.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            container.push(e.container);
        }, '#inner_1', 'p', obj);

        inner.setContent("<div id='inner_1'><p id='pass1'>Added</p><div><p id='pass2'><em id='pass2-trigger'>Trigger</em></p></div></div>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var a = inner.one('#pass1'),
                    b = inner.one('#pass2-trigger'),
                    inner1 = inner.one('#inner_1');

                if (a && b && inner1) {
                    a.click();

                    Y.Assert.areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([obj], thisObj);
                    Y.ArrayAssert.itemsAreSame(["bar"], foo);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    Y.Assert.areSame(2, count);
                    Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
                    Y.ArrayAssert.itemsAreSame([a, b], target);
                    Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
                    Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
                    Y.ArrayAssert.itemsAreSame(["bar", "bar"], foo);
                    Y.ArrayAssert.itemsAreSame([inner1, inner1], container);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#pass2-trigger');

        test.wait();
    },

    "test Y.delegate(synth, fn, notAvailableYet, filter, thisObj, arg)": function () {
        var inner = Y.one('#inner'),
            obj = { foo: 'bar' },
            test = this,
            count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            foo = [],
            arg = [],
            container = [];

        inner.empty();

        Y.delegate('synth', function (e, x) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            foo.push(this.foo);
            arg.push(x);
            container.push(e.container);
        }, '#inner_1', 'p', obj, "arg!");

        inner.setContent("<div id='inner_1'><p id='pass1'>Added</p><div><p id='pass2'><em id='pass2-trigger'>Trigger</em></p></div></div>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var a = inner.one('#pass1'),
                    b = inner.one('#pass2-trigger'),
                    inner1 = inner.one('#inner_1');

                if (a && b && inner1) {
                    a.click();

                    Y.Assert.areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([obj], thisObj);
                    Y.ArrayAssert.itemsAreSame(["bar"], foo);
                    Y.ArrayAssert.itemsAreSame(["arg!"], arg);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    Y.Assert.areSame(2, count);
                    Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
                    Y.ArrayAssert.itemsAreSame([a, b], target);
                    Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
                    Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
                    Y.ArrayAssert.itemsAreSame(["bar", "bar"], foo);
                    Y.ArrayAssert.itemsAreSame(["arg!", "arg!"], arg);
                    Y.ArrayAssert.itemsAreSame([inner1, inner1], container);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#pass2-trigger');

        test.wait();
    },

    "test Y.delegate(synth, fn, notAvailableYet, filter, null, arg)": function () {
        var inner = Y.one('#inner'),
            test = this,
            count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            arg = [],
            container = [];

        inner.empty();

        Y.delegate('synth', function (e, x) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            arg.push(x);
            container.push(e.container);
        }, '#inner_1', 'p', null, "arg!");

        inner.setContent("<div id='inner_1'><p id='pass1'>Added</p><div><p id='pass2'><em id='pass2-trigger'>Trigger</em></p></div></div>");

        // This is a tainted test because it's using a different synthetic
        // event to test that the synthetic event infrastructure is working
        // properly. The other option is to use Y.later, but that opens a race
        // condition.  The test is left in place because something is better
        // than nothing.
        Y.on("available", function () {
            test.resume(function () {
                var a = inner.one('#pass1'),
                    b = inner.one('#pass2-trigger'),
                    inner1 = inner.one('#inner_1');

                if (a && b && inner1) {
                    a.click();

                    Y.Assert.areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([a], thisObj);
                    Y.ArrayAssert.itemsAreSame(["arg!"], arg);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    Y.Assert.areSame(2, count);
                    Y.ArrayAssert.itemsAreSame(['synth','synth'], type);
                    Y.ArrayAssert.itemsAreSame([a, b], target);
                    Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
                    Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
                    Y.ArrayAssert.itemsAreSame(["arg!", "arg!"], arg);
                    Y.ArrayAssert.itemsAreSame([inner1, inner1], container);
                } else {
                    Y.Assert.fail("Something is wrong with onAvailable");
                }
            });
        }, '#pass2-trigger');

        test.wait();
    },

    "test Y.delegate(synth, fn, selectorMulti, filter)": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "Detach",

    setUp: setUp,
    tearDown: tearDown

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['test', 'event-synthetic', 'node-event-simulate']});
