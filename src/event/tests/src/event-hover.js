// Not sure why the module isn't getting included
if (!Y.Node.prototype.simulate) {
    Y.Node.prototype.simulate = function(type, options) {
        Y.Event.simulate(this._node, type, options);
    };
}
Y.Node.prototype.mouseover = function (config) {
    this.simulate('mouseover', config);
};
Y.Node.prototype.mouseout = function (config) {
    this.simulate('mouseout', config);
};

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
        i, len, relatedTarget;

    if (out) {
        for (i = ancestors.size() - 1; i >= 1; --i) {
            relatedTarget = ancestors._nodes[i - 1];
            console.log(ancestors.item(i)._node.tagName, ancestors._nodes[i - 1].tagName);
            ancestors.item(i).simulate(eventname, { relatedTarget: relatedTarget });
        }
    } else {
        for (i = 1, len = ancestors.size(); i < len; ++i) {
            relatedTarget = ancestors._nodes[i - 1];
            console.log(ancestors.item(i)._node.tagName, ancestors._nodes[i - 1].tagName);
            ancestors.item(i).simulate(eventname, { relatedTarget: relatedTarget });
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

    "test Y.on('hover', over, out, '#foo')": function () {
    },

    "test nodelist.on('hover', over, out)": function () {
    },

    "test node.on('hover', over, out, thisObj)": function () {
    },

    "test Y.on('hover', over, out, '#foo', thisObj)": function () {
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
