function f() {}

Y.namespace("UnitTests")["queue-base"] = {

    NAME : "queue-base-test",

    //YUI_CONFIG : { ... } Y.UnitTest uses Y.config by default

    USE : ['queue-base'],

    apiTests : {
        "instantiation" : {
            _should : {
                fail : {},
                error : {}
            },

            "instantiation should not error" : function () {
                var empty = new Y.Queue(),
                    loaded = new Y.Queue(f,f,f,f);

                Y.Assert.areSame(true, empty instanceof Y.Queue);
                Y.Assert.areSame(true, loaded instanceof Y.Queue);
            }
        },

        "add" : {
            "supplied items at construction should be added" : function () {
                var q = new Y.Queue(f,f,f,f);

                Y.ArrayAssert.itemsAreEqual([f,f,f,f], q._q);
            },

            "added items should be appended" : function () {
                var q = new Y.Queue();

                Y.ArrayAssert.itemsAreEqual([], q._q);

                q.add(1);
                q.add(2,3,4,5);

                Y.ArrayAssert.itemsAreEqual([1,2,3,4,5], q._q);

                q = new Y.Queue(f, 1, f, 2);
                q.add(f, 3, f, 4);

                Y.ArrayAssert.itemsAreEqual([f,1,f,2,f,3,f,4], q._q);
            }
        },

        "next" : {
            "next should not error when queue is empty" : function () {
                var q = new Y.Queue(),
                    x = q.next();

                Y.Assert.isUndefined(x);
                Y.Assert.isUndefined(q.next());
                Y.Assert.isUndefined(q.next());
            },

            "next should remove and return the first item" : function () {
                var q = new Y.Queue(1,2,3);

                Y.Assert.areSame(1, q.next());
                Y.Assert.areSame(2, q.next());
                Y.Assert.areSame(3, q.next());
                Y.Assert.isUndefined(q.next());
            }
        },

        "size" : {
            "size should report correct value" : function () {
                var q = new Y.Queue();

                Y.Assert.areSame(0, q.size());

                q.add(1,2,3);
                Y.Assert.areSame(3, q.size());

                q = new Y.Queue(1,2,3,4);
                Y.Assert.areSame(4, q.size());
                
                q.next();
                Y.Assert.areSame(3, q.size());
                q.next();
                Y.Assert.areSame(2, q.size());
                q.next();
                Y.Assert.areSame(1, q.size());
                q.next();
                Y.Assert.areSame(0, q.size());
                q.next();
                Y.Assert.areSame(0, q.size());
            }
        }
    }
};
