YUI.add('event-synthetic-tests', function(Y) {

Y.Node.prototype.click = function (options) {
    Y.Event.simulate(this._node, 'click', options);
};
Y.NodeList.importMethod(Y.Node.prototype, 'click');



var suite = new Y.Test.Suite("Y.SyntheticEvent"),
    areSame = Y.Assert.areSame;

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
        '<li id="item3"><p>Item 3</p></li>' +
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
        areSame(0, Y.Node.DOM_EVENTS.synth.eventDef.index);
    },

    "Subsequent Y.Event.define() should not overwrite existing synth": function () {
        Y.Event.define('synth', {
            index: 1
        });

        areSame(0, Y.Node.DOM_EVENTS.synth.eventDef.index);
    },

    "Y.Event.define(..., true) should overwrite existing synth": function () {
        Y.Event.define('synth', {
            index: 2
        }, true);

        areSame(2, Y.Node.DOM_EVENTS.synth.eventDef.index);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
        areSame('arg!', arg);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
        areSame('arg!', arg);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
        areSame('arg!', arg);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
        areSame('arg!', arg);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
        areSame('arg!', arg);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
        areSame('arg!', arg);
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
                    areSame('synth', type);
                    areSame(p4, currentTarget);
                    areSame(p4, thisObj);
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
                    areSame('synth', type);
                    areSame(p4, currentTarget);
                    areSame(obj, thisObj);
                    areSame('bar', foo);
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
                    areSame('synth', type);
                    areSame(p4, currentTarget);
                    areSame(obj, thisObj);
                    areSame('bar', foo);
                    areSame('arg!', arg);
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
                    areSame('synth', type);
                    areSame(p4, currentTarget);
                    areSame(p4, thisObj);
                    areSame('arg!', arg);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(obj, thisObj);
        areSame(obj.foo, thisObj.foo);
        areSame('arg!', arg);
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

        areSame('synth', type);
        areSame(target, currentTarget);
        areSame(target, thisObj);
        areSame('arg!', arg);
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

        areSame(2, count);
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

        areSame(2, count);
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

        areSame(2, count);
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

        areSame(1, count);
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

        areSame(1, count);
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

        areSame(1, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["bar"], foo);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame(["arg!"], arg);
        Y.ArrayAssert.itemsAreSame([inner], container);

        b.click();

        areSame(2, count);
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

                    areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([a], thisObj);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    areSame(2, count);
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

                    areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([obj], thisObj);
                    Y.ArrayAssert.itemsAreSame(["bar"], foo);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    areSame(2, count);
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

                    areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([obj], thisObj);
                    Y.ArrayAssert.itemsAreSame(["bar"], foo);
                    Y.ArrayAssert.itemsAreSame(["arg!"], arg);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    areSame(2, count);
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

                    areSame(1, count);
                    Y.ArrayAssert.itemsAreSame(['synth'], type);
                    Y.ArrayAssert.itemsAreSame([a], target);
                    Y.ArrayAssert.itemsAreSame([a], currentTarget);
                    Y.ArrayAssert.itemsAreSame([a], thisObj);
                    Y.ArrayAssert.itemsAreSame(["arg!"], arg);
                    Y.ArrayAssert.itemsAreSame([inner1], container);

                    b.click();

                    areSame(2, count);
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
        var count = 0,
            type = [],
            target = [],
            currentTarget = [],
            thisObj = [],
            container = [],
            nested = Y.one('.nested'),
            inner = Y.one('#inner'),
            a = Y.one('#item3 p'),
            b = Y.one("#inner_1_p1_no em");

        Y.delegate('synth', function (e) {
            count++;
            type.push(e.type);
            target.push(e.target);
            currentTarget.push(e.currentTarget);
            thisObj.push(this);
            container.push(e.container);
        }, ".nested, #inner", 'p');

        a.click();

        areSame(1, count);
        Y.ArrayAssert.itemsAreSame(['synth'], type);
        Y.ArrayAssert.itemsAreSame([a], target);
        Y.ArrayAssert.itemsAreSame([a], currentTarget);
        Y.ArrayAssert.itemsAreSame([a], thisObj);
        Y.ArrayAssert.itemsAreSame([nested], container);

        b.click();

        areSame(2, count);
        Y.ArrayAssert.itemsAreSame(['synth', 'synth'], type);
        Y.ArrayAssert.itemsAreSame([a, b], target);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], currentTarget);
        Y.ArrayAssert.itemsAreSame([a, b.ancestor('p')], thisObj);
        Y.ArrayAssert.itemsAreSame([nested, inner], container);

    }
}));

suite.add(new Y.Test.Case({
    name: "Detach",

    setUp: setUp,
    tearDown: tearDown,

    _should: {
        fail: {
            // TODO: Can this be made to work?
            "test nodelist.on('cat|__', fn) + nodelist.detach('cat|___')": true,
            "test nodelist.on('cat|__', fn) + nodelist.detach('cat|___', fn)": true,
            "test nodelist.on('cat|__', fn) + node.detach('cat|*')": true,
            "test Y.on('cat|__', fn, multiSelector) + nodelist.detach('cat|___')": true,
            "test Y.on('cat|__', fn, multiSelector) + nodelist.detach('cat|___', fn)": true,
            "test Y.on('cat|__', fn, multiSelector) + node.detach('cat|*')": true
        }
    },

    "test node.on() + node.detach(synth, fn)": function () {
        var count = 0,
            target = Y.one('#button1');

        function fn() {
            count++;
        }

        target.on('synth', fn);

        target.click();

        areSame(1, count);

        target.detach('synth', fn);

        target.click();

        areSame(1, count);

        target.on('synth', fn);
        target.on('synth', fn);
        target.on('click', fn);

        target.click();

        areSame(4, count);

        target.detach('synth', fn);

        target.click();

        areSame(5, count);
    },

    "test node.on(synth, fn, thisObj) + node.detach(synth, fn)": function () {
        var count = 0,
            a = {},
            b = {},
            target = Y.one('#button1');

        function fn() {
            count++;
        }

        target.on('synth', fn, a);

        target.click();

        areSame(1, count);

        target.detach('synth', fn);

        target.click();

        areSame(1, count);

        target.on('synth', fn, a);
        target.on('synth', fn, b);

        target.click();

        areSame(3, count);

        target.detach('synth', fn);

        target.click();

        areSame(3, count);
    },

    "test node.on() + node.detach(synth)": function () {
        var count = 0,
            target = Y.one('#button1');

        function fn() {
            count++;
        }

        target.on('synth', fn);

        target.click();

        areSame(1, count);

        target.detach('synth');

        target.click();

        areSame(1, count);

        target.on('synth', fn);
        target.on('synth', fn);
        target.on('click', fn);

        target.click();

        areSame(4, count);

        target.detach('synth');

        target.click();

        areSame(5, count);
    },

    "test node.on() + node.detach()": function () {
        var count = 0,
            target = Y.one('#button1');

        function fn() {
            count++;
        }

        target.on('synth', fn);

        target.click();

        areSame(1, count);

        target.detach();

        target.click();

        areSame(1, count);

        target.on('synth', fn);
        target.on('synth', fn);
        target.on('click', fn);

        target.click();

        areSame(4, count);

        target.detach();

        target.click();

        areSame(4, count);
    },

    "test node.on() + node.detachAll()": function () {
        var count = 0,
            target = Y.one('#button1');

        function fn() {
            count++;
        }

        target.on('synth', fn);

        target.click();

        areSame(1, count);

        target.detachAll();

        target.click();

        areSame(1, count);

        target.on('synth', fn);
        target.on('synth', fn);
        target.on('click', fn);

        target.click();

        areSame(4, count);

        target.detachAll();

        target.click();

        areSame(4, count);
    },

    "test node.on() + node.purge(true, synth)": function () {
        var count = 0,
            target = Y.one('#button1');

        function fn() {
            count++;
        }

        target.on('synth', fn);

        target.click();

        areSame(1, count);

        target.purge(true, 'synth');

        target.click();

        areSame(1, count);

        target.on('synth', fn);
        target.on('synth', fn);
        target.on('click', fn);

        target.click();

        areSame(4, count);

        target.purge(true, 'synth');

        target.click();

        areSame(5, count);
    },

    "test node.on() + parent.purge(true, synth)": function () {
        var count = 0,
            target = Y.one('#button1'),
            parent = target.get('parentNode');

        function fn() {
            count++;
        }

        target.on('synth', fn);

        target.click();

        areSame(1, count);

        parent.purge(true, 'synth');

        target.click();

        areSame(1, count);

        target.on('synth', fn);
        target.on('synth', fn);
        target.on('click', fn);

        target.click();

        areSame(4, count);

        parent.purge(true, 'synth');

        target.click();

        areSame(5, count);
    },

    "test nodelist.on(synth, fn) + node.detach(synth, fn)": function () {
        var count = 0,
            all = Y.all('.nested li'),
            item = all.item(0);

        function increment() {
            count++;
        }

        all.on('synth', increment);

        item.click();

        areSame(1, count);

        item.detach('synth', increment);

        item.click();

        areSame(1, count);
    },

    "test nodelist.on(synth, fn) + node.detach(synth)": function () {
        var count = 0,
            all = Y.all('.nested li'),
            item = all.item(0);

        function increment() {
            count++;
        }

        all.on('synth', increment);

        item.click();

        areSame(1, count);

        item.detach('synth');

        item.click();

        areSame(1, count);
    },

    "test node.on(synth, fn) + nodelist.detach(synth, fn)": function () {
        var count = 0,
            all = Y.all('.nested li'),
            item = all.item(0);

        function increment() {
            count++;
        }

        item.on('synth', increment);

        item.click();

        areSame(1, count);

        all.detach('synth', increment);

        item.click();

        areSame(1, count);
    },

    "test node.on(synth, fn) + nodelist.detach(synth)": function () {
        var count = 0,
            all = Y.all('.nested li'),
            item = all.item(0);

        function increment() {
            count++;
        }

        item.on('synth', increment);

        item.click();

        areSame(1, count);

        all.detach('synth');

        item.click();

        areSame(1, count);
    },

    "test node.on() + handle.detach()": function () {
        var count = 0,
            item = Y.one('#button1'),
            sub;

        function increment() {
            count++;
        }

        sub = item.on('synth', increment);

        item.click();

        areSame(1, count);

        sub.detach();

        item.click();

        areSame(1, count);
    },

    "test nodelist.on() + handle.detach()": function () {
        var count = 0,
            items = Y.all('.nested li'),
            one = items.item(0),
            two = items.item(1),
            three = items.item(2),
            sub;

        function increment() {
            count++;
        }

        sub = items.on('synth', increment);

        one.click();
        areSame(1, count);

        two.click();
        areSame(2, count);

        three.click();
        areSame(3, count);

        sub.detach();

        one.click();
        areSame(3, count);

        two.click();
        areSame(3, count);

        three.click();
        areSame(3, count);
    },

    "test nodelist.on() + nodelist.detach(synth, fn)": function () {
        var count = 0,
            items = Y.all('.nested li');

        function fn() {
            count++;
        }

        items.on('synth', fn);

        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);

        items.detach('synth', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);

        items.on('synth', fn);
        items.on('synth', fn);
        items.on('click', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(9, count);

        items.detach('synth', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);
    },

    "test nodelist.on(synth, fn, thisObj) + nodelist.detach(synth, fn)": function () {
        var count = 0,
            a = {},
            b = {},
            items = Y.all('.nested li');

        function fn() {
            count++;
        }

        items.on('synth', fn, a);

        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);

        items.detach('synth', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);

        items.on('synth', fn, a);
        items.on('synth', fn, b);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(6, count);

        items.detach('synth', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);
    },

    "test nodelist.on() + nodelist.detach(synth)": function () {
        var count = 0,
            items = Y.all('.nested li');

        function fn() {
            count++;
        }

        items.on('synth', fn);

        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);

        items.detach('synth');

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);

        items.on('synth', fn);
        items.on('synth', fn);
        items.on('click', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(9, count);

        items.detach('synth');

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);
    },

    "test nodelist.on() + nodelist.detach()": function () {
        var count = 0,
            items = Y.all('.nested li');

        function fn() {
            count++;
        }

        items.on('synth', fn);

        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);

        items.detach();

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);

        items.on('synth', fn);
        items.on('synth', fn);
        items.on('click', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(9, count);

        items.detach();

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);
    },

    "test nodelist.on() + nodelist.detachAll()": function () {
        var count = 0,
            items = Y.all('.nested li');

        function fn() {
            count++;
        }

        items.on('synth', fn);

        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);

        items.detachAll();

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);

        items.on('synth', fn);
        items.on('synth', fn);
        items.on('click', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(9, count);

        items.detachAll();

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);
    },

    "test nodelist.on() + parent.purge(true, synth)": function () {
        var count = 0,
            items = Y.all('.nested li'),
            parent = items.item(0).get('parentNode');

        function fn() {
            count++;
        }

        items.on('synth', fn);

        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);

        parent.purge(true, 'synth');

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(0, count);

        items.on('synth', fn);
        items.on('synth', fn);
        items.on('click', fn);

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(9, count);

        parent.purge(true, 'synth');

        count = 0;
        items.item(0).click();
        items.item(1).click();
        items.item(2).click();

        areSame(3, count);
    },

    "test node.on('cat|__', fn) + node.detach('cat|___')": function () {
        var count = 0,
            item = Y.one('#button1');

        function increment() {
            count++;
        }

        item.on('cat|synth', increment);

        item.click();

        areSame(1, count);

        item.detach('cat|synth');

        item.click();

        areSame(1, count);
    },

    "test node.on('cat|__', fn) + node.detach('cat|___', fn)": function () {
        var count = 0,
            item = Y.one('#button1');

        function increment() {
            count++;
        }

        item.on('cat|synth', increment);

        item.click();

        areSame(1, count);

        item.detach('cat|synth', increment);

        item.click();

        areSame(1, count);
    },

    "test node.on('cat|__', fn) + node.detach('cat|*')": function () {
        var count = 0,
            item = Y.one('#button1');

        function increment() {
            count++;
        }

        item.on('cat|synth', increment);

        item.click();

        areSame(1, count);

        item.detach('cat|*');

        item.click();

        areSame(1, count);
    },

    "test Y.on('cat|__', fn, sel) + node.detach('cat|___')": function () {
        var count = 0,
            item = Y.one('#button1');

        function increment() {
            count++;
        }

        Y.on('cat|synth', increment, '#button1');

        item.click();

        areSame(1, count);

        item.detach('cat|synth');

        item.click();

        areSame(1, count);
    },

    "test Y.on('cat|__', fn, sel) + node.detach('cat|___', fn)": function () {
        var count = 0,
            item = Y.one('#button1');

        function increment() {
            count++;
        }

        Y.on('cat|synth', increment, '#button1');

        item.click();

        areSame(1, count);

        item.detach('cat|synth', increment);

        item.click();

        areSame(1, count);
    },

    "test Y.on('cat|__', fn) + node.detach('cat|*')": function () {
        var count = 0,
            item = Y.one('#button1');

        function increment() {
            count++;
        }

        Y.on('cat|synth', increment, '#button1');

        item.click();

        areSame(1, count);

        item.detach('cat|*');

        item.click();

        areSame(1, count);
    },

    "test nodelist.on('cat|__', fn) + nodelist.detach('cat|___')": function () {
        var count = 0,
            items = Y.all('#inner p');

        function increment() {
            count++;
        }

        items.on('cat|synth', increment);

        items.click();

        areSame(5, count);

        items.detach('cat|synth');

        items.click();

        areSame(5, count);
    },

    "test nodelist.on('cat|__', fn) + nodelist.detach('cat|___', fn)": function () {
        var count = 0,
            items = Y.all('#inner p');

        function increment() {
            count++;
        }

        items.on('cat|synth', increment);

        items.click();

        areSame(5, count);

        items.detach('cat|synth', increment);

        items.click();

        areSame(5, count);
    },

    "test nodelist.on('cat|__', fn) + node.detach('cat|*')": function () {
        var count = 0,
            items = Y.all('#inner p');

        function increment() {
            count++;
        }

        items.on('cat|synth', increment);

        items.click();

        areSame(5, count);

        items.detach('cat|*');

        items.click();

        areSame(5, count);
    },

    "test Y.on('cat|__', fn, multiSelector) + nodelist.detach('cat|___')": function () {
        var count = 0,
            items = Y.all('#inner p');

        function increment() {
            count++;
        }

        Y.on('cat|synth', increment, '#inner p');

        items.click();

        areSame(5, count);

        items.detach('cat|synth');

        items.click();

        areSame(5, count);
    },

    "test Y.on('cat|__', fn, multiSelector) + nodelist.detach('cat|___', fn)": function () {
        var count = 0,
            items = Y.all('#inner p');

        function increment() {
            count++;
        }

        Y.on('cat|synth', increment, '#inner p');

        items.click();

        areSame(5, count);

        items.detach('cat|synth', increment);

        items.click();

        areSame(5, count);
    },

    "test Y.on('cat|__', fn, multiSelector) + node.detach('cat|*')": function () {
        var count = 0,
            items = Y.all('#inner p');

        function increment() {
            count++;
        }

        Y.on('cat|synth', increment, '#inner p');

        items.click();

        areSame(5, count);

        items.detach('cat|*');

        items.click();

        areSame(5, count);
    }
    // Y.on('cat|_', fn, multiSelector) + nodelist.detach('cat|_'[, fn]);
}));

suite.add(new Y.Test.Case({
    name: "processArgs",

    setUp: setUp,
    tearDown: tearDown


}));

suite.add(new Y.Test.Case({
    name: "Notifier",

    setUp: setUp,
    tearDown: tearDown


}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['event-synthetic', 'test', 'node-event-simulate']});
