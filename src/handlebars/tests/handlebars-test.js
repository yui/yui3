YUI.add('handlebars-test', function (Y) {

var Assert = Y.Assert,

    suite;

suite = new Y.Test.Suite({
    name: 'Handlebars',

    setUp: function () {
    },

    tearDown: function () {
    }
});

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    setUp: function () {
    },

    tearDown: function () {
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['handlebars', 'test']
});
