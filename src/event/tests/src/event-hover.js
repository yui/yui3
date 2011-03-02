function setUp() {
    var testbed = Y.one('#testbed'),
        body;

    if (!testbed) {
        body = Y.one('body');
        testbed = body.create('<div id="testbed"></div>');
        body.prepend(testbed);
    }

    testbed.setContent(
    '<ul id="items">' +
        '<li id="item1">' +
            '<div id="div1"><p id="p1"># <em id="em1">1</em></p></div>' +
        '</li>' +
        '<li id="item2">' +
            '<div id="div2"><p id="p2"># <em id="em2">2</em></p></div>' +
        '</li>' +
        '<li id="item3">' +
            '<div id="div3"><p id="p3"># <em id="em3">3</em></p></div>' +
        '</li>' +
    '</ul>');
}

function tearDown() {
    var testbed = Y.one('#testbed');

    if (testbed) {
        testbed.remove().destroy(true);
    }
}

function mouse(target, out) {
    var eventname = (out) ? 'mouseout' : 'mouseover',
        testbed = Y.one('#testbed'),
        testbedReached = false,
        ancestors = Y.one(target).ancestors(function(node) {
            if (node === testbed) {
                testbedReached = true;
            }
            return !testbedReached;
        }, true),
        i, len;

    if (out) {
        for (i = ancestors.size() - 1; i >= 1; --i) {
            Y.Event.simulate(
                ancestors._nodes[i],
                eventname,
                { relatedTarget: ancestors._nodes[i - 1] });
        }
    } else {
        for (i = 1, len = ancestors.size(); i < len; ++i) {
            Y.Event.simulate(
                ancestors._nodes[i],
                eventname,
                { relatedTarget: ancestors._nodes[i - 1] });
        }
    }
}

var suite = new Y.Test.Suite("event-hover"),
    areSame = Y.Assert.areSame;

suite.add(new Y.Test.Case({
    name: 'subscribe',

    setUp: setUp,
    tearDown: tearDown,

    "test node.on('hover', over, out)": function () {
        var overCount = 0,
            outCount = 0,
            target = Y.one('#em1'),
            overType, outType, overPhase, outPhase, overEType, outEType,
            overTarget, outTarget, overCurrentTarget, outCurrentTarget,
            overRelTarget, outRelTarget,
            overThisObj, outThisObj;

        function over(e) {
            overCount++;
            overType = e.type;
            overPhase = e.phase;
            overEType = e._event.type;
            overThisObj = this;
            overTarget = e.target;
            overCurrentTarget = e.currentTarget;
        }

        function out(e) {
            outCount++;
            outType = e.type;
            outPhase = e.phase;
            outEType = e._event.type;
            outThisObj = this;
            outTarget = e.target;
            outCurrentTarget = e.currentTarget;
        }

        target.on('hover', over, out);

        mouse('#em1');

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(target, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);

        Y.Assert.areSame(0, outCount);
        Y.Assert.isUndefined(outType);
        Y.Assert.isUndefined(outPhase);
        Y.Assert.isUndefined(outEType);
        Y.Assert.isUndefined(outThisObj);
        Y.Assert.isUndefined(outTarget);
        Y.Assert.isUndefined(outCurrentTarget);

        mouse("#em1", true);

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(target, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);

        Y.Assert.areSame(1, outCount);
        Y.Assert.areSame('hover', outType);
        Y.Assert.areSame('out', outPhase);
        Y.Assert.areSame('mouseout', outEType);
        Y.Assert.areSame(target, outThisObj);
        Y.Assert.areSame(target, outTarget);
        Y.Assert.areSame(target, outCurrentTarget);
    },

    "test container.on('hover', over, out)": function () {
        var overCount = 0,
            outCount = 0,
            target = Y.one('#item1'),
            overType, outType, overPhase, outPhase, overEType, outEType,
            overTarget, outTarget, overCurrentTarget, outCurrentTarget,
            overRelTarget, outRelTarget,
            overThisObj, outThisObj;

        function over(e) {
            overCount++;
            overType = e.type;
            overPhase = e.phase;
            overEType = e._event.type;
            overThisObj = this;
            overTarget = e.target;
            overCurrentTarget = e.currentTarget;
        }

        function out(e) {
            outCount++;
            outType = e.type;
            outPhase = e.phase;
            outEType = e._event.type;
            outThisObj = this;
            outTarget = e.target;
            outCurrentTarget = e.currentTarget;
        }

        target.on('hover', over, out);

        mouse('#em1');

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(target, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);

        Y.Assert.areSame(0, outCount);
        Y.Assert.isUndefined(outType);
        Y.Assert.isUndefined(outPhase);
        Y.Assert.isUndefined(outEType);
        Y.Assert.isUndefined(outThisObj);
        Y.Assert.isUndefined(outTarget);
        Y.Assert.isUndefined(outCurrentTarget);

        mouse("#em1", true);

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(target, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);

        Y.Assert.areSame(1, outCount);
        Y.Assert.areSame('hover', outType);
        Y.Assert.areSame('out', outPhase);
        Y.Assert.areSame('mouseout', outEType);
        Y.Assert.areSame(target, outThisObj);
        Y.Assert.areSame(target, outTarget);
        Y.Assert.areSame(target, outCurrentTarget);
    },

    "test Y.on('hover', over, out, '#foo')": function () {
        var overCount = 0,
            outCount = 0,
            target = Y.one('#item1'),
            overType, outType, overPhase, outPhase, overEType, outEType,
            overTarget, outTarget, overCurrentTarget, outCurrentTarget,
            overRelTarget, outRelTarget,
            overThisObj, outThisObj;

        function over(e) {
            overCount++;
            overType = e.type;
            overPhase = e.phase;
            overEType = e._event.type;
            overThisObj = this;
            overTarget = e.target;
            overCurrentTarget = e.currentTarget;
        }

        function out(e) {
            outCount++;
            outType = e.type;
            outPhase = e.phase;
            outEType = e._event.type;
            outThisObj = this;
            outTarget = e.target;
            outCurrentTarget = e.currentTarget;
        }

        Y.on('hover', over, out, '#item1');

        mouse('#em1');

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(target, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);

        Y.Assert.areSame(0, outCount);
        Y.Assert.isUndefined(outType);
        Y.Assert.isUndefined(outPhase);
        Y.Assert.isUndefined(outEType);
        Y.Assert.isUndefined(outThisObj);
        Y.Assert.isUndefined(outTarget);
        Y.Assert.isUndefined(outCurrentTarget);

        mouse("#em1", true);

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(target, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);

        Y.Assert.areSame(1, outCount);
        Y.Assert.areSame('hover', outType);
        Y.Assert.areSame('out', outPhase);
        Y.Assert.areSame('mouseout', outEType);
        Y.Assert.areSame(target, outThisObj);
        Y.Assert.areSame(target, outTarget);
        Y.Assert.areSame(target, outCurrentTarget);
    },

    "test nodelist.on('hover', over, out)": function () {
        var overCount = 0,
            outCount = 0,
            item1 = Y.one('#item1'),
            item2 = Y.one('#item2'),
            item3 = Y.one('#item3'),
            overType = [],
            overPhase = [],
            overEType = [],
            overTarget = [],
            overCurrentTarget = [],
            overRelTarget = [],
            overThisObj = [],
            outType = [],
            outPhase = [],
            outEType = [],
            outTarget = [],
            outCurrentTarget = [],
            outRelTarget = [],
            outThisObj = [];

        function over(e) {
            overCount++;
            overType.push(e.type);
            overPhase.push(e.phase);
            overEType.push(e._event.type);
            overThisObj.push(this);
            overTarget.push(e.target);
            overCurrentTarget.push(e.currentTarget);
        }

        function out(e) {
            outCount++;
            outType.push(e.type);
            outPhase.push(e.phase);
            outEType.push(e._event.type);
            outThisObj.push(this);
            outTarget.push(e.target);
            outCurrentTarget.push(e.currentTarget);
        }

        Y.all('#items li').on('hover', over, out);

        mouse('#em1'); mouse("#em1", true);

        Y.Assert.areSame(1, overCount);
        Y.ArrayAssert.itemsAreSame(['hover'], overType);
        Y.ArrayAssert.itemsAreSame(['over'], overPhase);
        Y.ArrayAssert.itemsAreSame(['mouseover'], overEType);
        Y.ArrayAssert.itemsAreSame([item1], overThisObj);
        Y.ArrayAssert.itemsAreSame([item1], overTarget);
        Y.ArrayAssert.itemsAreSame([item1], overCurrentTarget);

        Y.Assert.areSame(1, outCount);
        Y.ArrayAssert.itemsAreSame(['hover'], outType);
        Y.ArrayAssert.itemsAreSame(['out'], outPhase);
        Y.ArrayAssert.itemsAreSame(['mouseout'], outEType);
        Y.ArrayAssert.itemsAreSame([item1], outThisObj);
        Y.ArrayAssert.itemsAreSame([item1], outTarget);
        Y.ArrayAssert.itemsAreSame([item1], outCurrentTarget);

        mouse("#em2"); mouse("#em2", true);
        mouse("#em3"); mouse("#em3", true);

        Y.Assert.areSame(3, overCount);
        Y.ArrayAssert.itemsAreSame(['hover','hover','hover'], overType);
        Y.ArrayAssert.itemsAreSame(['over','over','over'], overPhase);
        Y.ArrayAssert.itemsAreSame(['mouseover','mouseover','mouseover'], overEType);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], overThisObj);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], overTarget);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], overCurrentTarget);

        Y.Assert.areSame(3, outCount);
        Y.ArrayAssert.itemsAreSame(['hover','hover','hover'], outType);
        Y.ArrayAssert.itemsAreSame(['out','out','out'], outPhase);
        Y.ArrayAssert.itemsAreSame(['mouseout','mouseout','mouseout'], outEType);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], outThisObj);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], outTarget);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], outCurrentTarget);
    },

    "test node.delegate('hover', over, out, filter)": function () {
        var overCount = 0,
            outCount = 0,
            items = Y.one('#items'),
            item1 = Y.one('#item1'),
            item2 = Y.one('#item2'),
            item3 = Y.one('#item3'),
            overType = [],
            overPhase = [],
            overEType = [],
            overTarget = [],
            overCurrentTarget = [],
            overRelTarget = [],
            overThisObj = [],
            outType = [],
            outPhase = [],
            outEType = [],
            outTarget = [],
            outCurrentTarget = [],
            outRelTarget = [],
            outThisObj = [],
            overContainer = [],
            outContainer = [];


        function over(e) {
            overCount++;
            overType.push(e.type);
            overPhase.push(e.phase);
            overEType.push(e._event.type);
            overThisObj.push(this);
            overTarget.push(e.target);
            overCurrentTarget.push(e.currentTarget);
            overContainer.push(e.container);
        }

        function out(e) {
            outCount++;
            outType.push(e.type);
            outPhase.push(e.phase);
            outEType.push(e._event.type);
            outThisObj.push(this);
            outTarget.push(e.target);
            outCurrentTarget.push(e.currentTarget);
            outContainer.push(e.container);
        }

        items.delegate('hover', over, out, 'li');

        mouse('#em1'); mouse("#em1", true);

        Y.Assert.areSame(1, overCount);
        Y.ArrayAssert.itemsAreSame(['hover'], overType);
        Y.ArrayAssert.itemsAreSame(['over'], overPhase);
        Y.ArrayAssert.itemsAreSame(['mouseover'], overEType);
        Y.ArrayAssert.itemsAreSame([item1], overThisObj);
        Y.ArrayAssert.itemsAreSame([item1], overTarget);
        Y.ArrayAssert.itemsAreSame([item1], overCurrentTarget);
        Y.ArrayAssert.itemsAreSame([items], overContainer);

        Y.Assert.areSame(1, outCount);
        Y.ArrayAssert.itemsAreSame(['hover'], outType);
        Y.ArrayAssert.itemsAreSame(['out'], outPhase);
        Y.ArrayAssert.itemsAreSame(['mouseout'], outEType);
        Y.ArrayAssert.itemsAreSame([item1], outThisObj);
        Y.ArrayAssert.itemsAreSame([item1], outTarget);
        Y.ArrayAssert.itemsAreSame([item1], outCurrentTarget);
        Y.ArrayAssert.itemsAreSame([items], overContainer);

        mouse("#em2"); mouse("#em2", true);
        mouse("#em3"); mouse("#em3", true);

        Y.Assert.areSame(3, overCount);
        Y.ArrayAssert.itemsAreSame(['hover','hover','hover'], overType);
        Y.ArrayAssert.itemsAreSame(['over','over','over'], overPhase);
        Y.ArrayAssert.itemsAreSame(['mouseover','mouseover','mouseover'], overEType);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], overThisObj);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], overTarget);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], overCurrentTarget);
        Y.ArrayAssert.itemsAreSame([items, items, items], overContainer);

        Y.Assert.areSame(3, outCount);
        Y.ArrayAssert.itemsAreSame(['hover','hover','hover'], outType);
        Y.ArrayAssert.itemsAreSame(['out','out','out'], outPhase);
        Y.ArrayAssert.itemsAreSame(['mouseout','mouseout','mouseout'], outEType);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], outThisObj);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], outTarget);
        Y.ArrayAssert.itemsAreSame([item1, item2, item3], outCurrentTarget);
        Y.ArrayAssert.itemsAreSame([items, items, items], outContainer);
    },

    "test node.on('hover', over, out, thisObj)": function () {
        var overCount = 0,
            outCount = 0,
            target = Y.one('#item1'),
            obj = { foo: 'foo' },
            overType, outType, overPhase, outPhase, overEType, outEType,
            overTarget, outTarget, overCurrentTarget, outCurrentTarget,
            overRelTarget, outRelTarget,
            overThisObj, outThisObj, overFoo, outFoo;

        function over(e) {
            overCount++;
            overType = e.type;
            overPhase = e.phase;
            overEType = e._event.type;
            overThisObj = this;
            overTarget = e.target;
            overCurrentTarget = e.currentTarget;
            overFoo = this.foo
        }

        function out(e) {
            outCount++;
            outType = e.type;
            outPhase = e.phase;
            outEType = e._event.type;
            outThisObj = this;
            outTarget = e.target;
            outCurrentTarget = e.currentTarget;
            outFoo = this.foo
        }

        target.on('hover', over, out, obj);

        mouse('#em1'); mouse("#em1", true);

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(obj, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);
        Y.Assert.areSame('foo', overFoo);

        Y.Assert.areSame(1, outCount);
        Y.Assert.areSame('hover', outType);
        Y.Assert.areSame('out', outPhase);
        Y.Assert.areSame('mouseout', outEType);
        Y.Assert.areSame(obj, outThisObj);
        Y.Assert.areSame(target, outTarget);
        Y.Assert.areSame(target, outCurrentTarget);
        Y.Assert.areSame('foo', outFoo);
    },

    "test Y.on('hover', over, out, '#foo', thisObj)": function () {
        var overCount = 0,
            outCount = 0,
            target = Y.one('#item1'),
            obj = { foo: 'foo' },
            overType, outType, overPhase, outPhase, overEType, outEType,
            overTarget, outTarget, overCurrentTarget, outCurrentTarget,
            overRelTarget, outRelTarget,
            overThisObj, outThisObj, overFoo, outFoo;

        function over(e) {
            overCount++;
            overType = e.type;
            overPhase = e.phase;
            overEType = e._event.type;
            overThisObj = this;
            overTarget = e.target;
            overCurrentTarget = e.currentTarget;
            overFoo = this.foo
        }

        function out(e) {
            outCount++;
            outType = e.type;
            outPhase = e.phase;
            outEType = e._event.type;
            outThisObj = this;
            outTarget = e.target;
            outCurrentTarget = e.currentTarget;
            outFoo = this.foo
        }

        Y.on('hover', over, out, '#item1', obj);

        mouse('#em1'); mouse("#em1", true);

        Y.Assert.areSame(1, overCount);
        Y.Assert.areSame('hover', overType);
        Y.Assert.areSame('over', overPhase);
        Y.Assert.areSame('mouseover', overEType);
        Y.Assert.areSame(obj, overThisObj);
        Y.Assert.areSame(target, overTarget);
        Y.Assert.areSame(target, overCurrentTarget);
        Y.Assert.areSame('foo', overFoo);

        Y.Assert.areSame(1, outCount);
        Y.Assert.areSame('hover', outType);
        Y.Assert.areSame('out', outPhase);
        Y.Assert.areSame('mouseout', outEType);
        Y.Assert.areSame(obj, outThisObj);
        Y.Assert.areSame(target, outTarget);
        Y.Assert.areSame(target, outCurrentTarget);
        Y.Assert.areSame('foo', outFoo);
    },

    "test nodelist.on('hover', over, out, thisObj)": function () {
    },

    "test node.on('hover', over, out, thisObj, arg)": function () {
    },

    "test Y.on('hover', over, out, '#foo', thisObj, arg)": function () {
    },

    "test nodelist.on('hover', over, out, thisObj), arg": function () {
    },

    "test node.on('hover', over, out, null, arg)": function () {
    },

    "test Y.on('hover', over, out, '#foo', null, arg)": function () {
    },

    "test nodelist.on('hover', over, out, null), arg": function () {
    }

}));

suite.add(new Y.Test.Case({
    name: 'detach',

    setUp: setUp,
    tearDown: tearDown,

    "test node.on('hover', over, out); node.detach('hover');": function () {
    },

    "test node.on('hover', over, out); node.detach('hover', over);": function () {
    },

    "test node.on('cat|hover', over, out); node.detach('cat|hover');": function () {
    },

    "test node.on('cat|hover', over, out); node.detach('cat|*');": function () {
    },

    "test node.on('hover', over, out); handle.detach();": function () {
    }

}));

suite.add(new Y.Test.Case({
    name: 'delegate',

    setUp: setUp,
    tearDown: tearDown

}));

Y.Test.Runner.add(suite);
