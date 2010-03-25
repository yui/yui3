YUI.add('event-synthetic-test', function(Y) {

var suite = new Y.Test.Suite("Y.SyntheticEvent");

suite.add( new Y.Test.Case({
    name: "Lifecycle",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "API",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "Attributes",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
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


}, '@VERSION@' ,{requires:['test', 'event-synthetic']});
