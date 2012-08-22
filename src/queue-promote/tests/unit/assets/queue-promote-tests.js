YUI.add('queue-promote-tests', function(Y) {

var suite = new Y.Test.Suite("QueuePromote");

suite.add(new Y.Test.Case({
    name : "queue-promote API",

    "methods should exist": function () {
        YUI().use(function (X) {
            var q = new X.Queue('a', 'b', 'c');

            Y.Assert.isInstanceOf(X.Queue, q);

            Y.Assert.isUndefined(q.promote);
            Y.Assert.isUndefined(q.remove);
            Y.Assert.isUndefined(q.indexOf);

            X.use('queue-promote', function () {
                Y.Assert.isFunction(q.promote);
                Y.Assert.isFunction(q.remove);
                Y.Assert.isFunction(q.indexOf);
            });
        });
    },

    "promote should move found item to the head" : function () {
        var q = new Y.Queue('a', 'b', 'c');

        Y.ArrayAssert.itemsAreSame(['a','b','c'], q._q);

        q.promote('c');

        Y.ArrayAssert.itemsAreSame(['c','a','b'], q._q);
    },

    "remove should remove found item": function () {
        var q = new Y.Queue('a', 'b', 'c');

        Y.ArrayAssert.itemsAreSame(['a','b','c'], q._q);

        // From the front
        q.remove('a');

        Y.ArrayAssert.itemsAreSame(['b','c'], q._q);

        // From the end
        q.remove('c');

        Y.ArrayAssert.itemsAreSame(['b'], q._q);

        q.add('d', 'e');

        // From the middle
        q.remove('d');

        Y.ArrayAssert.itemsAreSame(['b','e'], q._q);

        // Not in the queue
        q.remove('x');

        Y.ArrayAssert.itemsAreSame(['b','e'], q._q);
    },

    "indexOf should return index or -1": function () {
        var q = new Y.Queue('a', 'b', 'c');

        Y.Assert.areSame(0, q.indexOf('a'));
        Y.Assert.areSame(1, q.indexOf('b'));
        Y.Assert.areSame(2, q.indexOf('c'));
        Y.Assert.areSame(-1, q.indexOf('x'));
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['queue-promote', 'test']});
