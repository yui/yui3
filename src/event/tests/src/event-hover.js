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

var suite = new Y.Test.Suite("event-hover"),
    areSame = Y.Assert.areSame;

suite.add(new Y.Test.Case({
    name: 'subscribe',

    setUp: setUp,
    tearDown: tearDown,

    "test node.on('hover', over, out)": function () {
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
