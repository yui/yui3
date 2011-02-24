YUI.add('arraylist-tests', function(Y) {

var suite = new Y.Test.Suite("Y.ArrayList");

suite.add( new Y.Test.Case({
    name: "Lifecycle",

    "construct with array should not error": function () {
    },

    "construct after augmented class instantiation should not clobber items": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "API",

    setUp: function () {
    },

    "test item": function () {
    },

    "test each": function () {
    },

    "test some": function () {
    },

    "test indexOf": function () {
    },

    "test size": function () {
    },

    "test isEmpty": function () {
    },

    "test _item": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "Additional API",

    setUp: function () {
    },

    "test add": function () {
    },

    "test remove": function () {
    },

    "test filter": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "addMethod",

    "test addMethod": function () {
    },

    "methods should be chainable unless a value is returned": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "Array.invoke",

    "test Y.Array.invoke": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "Runtime expectations",

    "test ": function () {
    }
}));

suite.add( new Y.Test.Case({
    name: "Bugs",

    "test ": function () {
    }
}));

Y.Test.Runner.add( suite );


}, '@VERSION@' ,{requires:['arraylist', 'test']});
