YUI.add('console-tests', function(Y) {

var suite = new Y.Test.Suite("Console");

suite.add( new Y.Test.Case({
    name: "Lifecycle",

    "test default construction": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "API",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test log": function () {
    },

    "test clearConsole": function () {
    },

    "test reset": function () {
    },

    "test collapse": function () {
    },

    "test expand": function () {
    },

    "test scrollToLatest": function () {
    },

    "test render": function () {
    },

    "test printBuffer": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "Attributes",

    "logEvent should be writeOnce": function () {
    },

    "logSource should be writeOnce": function () {
    },

    "test strings": function () {
    },

    "test paused": function () {
    },

    "test defaultCategory": function () {
    },

    "test defaultSource": function () {
    },

    "test entryTemplate": function () {
    },

    "test logLevel": function () {
    },

    "test printTimeout": function () {
    },

    "test printLimit": function () {
    },

    "test consoleLimit": function () {
    },

    "test newestOnTop": function () {
    },

    "test scrollIntoView": function () {
    },

    "test collapsed": function () {
    },

    "test style": function () {
    }

}));

suite.add( new Y.Test.Case({
    name: "Runtime expectations",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "Bugs",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));

Y.Test.Runner.add( suite );


}, '@VERSION@' ,{requires:['console', 'test']});
