YUI.add('arraylist-tests', function(Y) {

var suite = new Y.Test.Suite("Collection: ArrayList");

suite.add( new Y.Test.Case({
    name: "Lifecycle",

    "construct with array should not error": function () {
        var list = new Y.ArrayList(["foo"]);
        Y.Assert.isObject(list);
        Y.Assert.isInstanceOf(Y.ArrayList, list);
    },

    "construct after augmented class instantiation should not clobber items": function () {
        function C(items) {
            this._items = items.slice();
        }
        Y.augment(C, Y.ArrayList);

        var list = new C(['foo']);

        Y.Assert.areSame(1, list._items.length);
        list.each(function () {}); // trigger AL constructor from augmentation 

        Y.Assert.areSame(1, list._items.length);
        Y.Assert.areSame(1, list.size());
    }
}));

suite.add( new Y.Test.Case({
    name: "API",

    setUp: function () {
        this.list = new Y.ArrayList(['foo', { bar: 'bar' }, new Y.ArrayList()]);
    },

    "test item": function () {
        Y.Assert.isString(this.list.item(0));
        Y.Assert.isObject(this.list.item(1));
        Y.Assert.isInstanceOf(Y.ArrayList, this.list.item(2));
    },

    "test each": function () {
        var size = 0,
            list = this.list;

        list.each(function (item, index) {
            size++;
            if (Y.Lang.isObject(list._items[index])) {
                Y.Assert.areSame(list._items[index], this);
            }

            Y.Assert.areSame(list._items[index], item);
        });

        Y.Assert.areSame(3, size);
    },

    "test each with context override": function () {
        var size = 0,
            list = this.list,
            obj  = { goop: 'goop' };

        list.each(function (item, index) {
            size++;
            Y.Assert.areSame(obj, this);
            Y.Assert.areSame(list._items[index], item);
        }, obj);

        Y.Assert.areSame(3, size);
    },

    "test some": function () {
        var size = 0,
            list = this.list;

        list.some(function (item, index) {
            size++;
            if (Y.Lang.isObject(list._items[index])) {
                Y.Assert.areSame(list._items[index], this);
                return true;
            }

            Y.Assert.areSame(list._items[index], item);
        });

        Y.Assert.areSame(2, size);
    },

    "test some with context override": function () {
        var size = 0,
            list = this.list,
            obj  = { goop: 'goop' };

        list.some(function (item, index) {
            Y.Assert.areSame(obj, this);
            Y.Assert.areSame(list._items[index], item);

            if (size++) {
                return true;
            }
        }, obj);

        Y.Assert.areSame(2, size);
    },

    "test some without breaking out of the loop": function () {
        var size = 0,
            list = this.list;

        list.some(function (item, index) {
            size++;
            if (Y.Lang.isObject(list._items[index])) {
                Y.Assert.areSame(list._items[index], this);
            }

            Y.Assert.areSame(list._items[index], item);
        });

        Y.Assert.areSame(3, size);
    },

    "test indexOf": function () {
        Y.Assert.areSame(0, this.list.indexOf('foo'));
        Y.Assert.areSame(1, this.list.indexOf(this.list._items[1]));
        Y.Assert.areSame(2, this.list.indexOf(this.list._items[2]));

        Y.Assert.areSame(-1, this.list.indexOf('bar'));
        Y.Assert.areSame(-1, this.list.indexOf({ bar: 'bar' }));
        Y.Assert.areSame(-1, this.list.indexOf(new Y.ArrayList()));
    },

    "test size": function () {
        Y.Assert.areSame(3, this.list.size());

        Y.Assert.areSame(0, (new Y.ArrayList()).size());
    },

    "test isEmpty": function () {
        Y.Assert.isFalse(this.list.isEmpty());

        Y.Assert.isTrue((new Y.ArrayList()).isEmpty());
    },

    "test toJSON": function () {
        var json = this.list.toJSON();

        Y.Assert.isArray(json);
        Y.Assert.areSame('foo', json[0]);
        Y.Assert.isObject(json[1]);
        Y.Assert.areSame('bar', json[1].bar);

        // toJSON doesn't recurse
        Y.Assert.isInstanceOf(Y.ArrayList, json[2]);
    }
}));

suite.add( new Y.Test.Case({
    name: "addMethod",

    "test addMethod": function () {
        function Counter(value) {
            this.value = value;
        }
        Y.mix(Counter.prototype, {
            increment: function (by) { this.value += by || 1; },
            decrement: function (by) { this.value -= by || 1; },
            reset: function (to) { this.value = to || 0; }
        });

        var list = new Y.ArrayList([ new Counter(1), new Counter(5) ]);

        Y.Assert.isUndefined(list.increment);
        Y.ArrayList.addMethod(list, 'increment');

        Y.Assert.areSame(1, list.item(0).value);
        Y.Assert.areSame(5, list.item(1).value);

        Y.Assert.isFunction(list.increment);
        list.increment();

        Y.Assert.areSame(2, list.item(0).value);
        Y.Assert.areSame(6, list.item(1).value);

        Y.Assert.isUndefined(list.decrement);
        Y.Assert.isUndefined(list.reset);
        Y.ArrayList.addMethod(list, ['decrement', 'reset']);

        list.decrement();

        Y.Assert.areSame(1, list.item(0).value);
        Y.Assert.areSame(5, list.item(1).value);

        list.decrement(3);

        Y.Assert.areSame(-2, list.item(0).value);
        Y.Assert.areSame(2, list.item(1).value);

        list.reset(3);

        Y.Assert.areSame(3, list.item(0).value);
        Y.Assert.areSame(3, list.item(1).value);
    },

    "methods should be chainable unless a value is returned": function () {
        function Counter(value) {
            this.value = value;
        }
        Y.mix(Counter.prototype, {
            getValue: function () { return this.value; },
            increment: function (by) { this.value += by || 1; }
        });

        var list = new Y.ArrayList([ new Counter(1), new Counter(5) ]);

        Y.Assert.isUndefined(list.getValue);
        Y.Assert.isUndefined(list.increment);
        Y.ArrayList.addMethod(list, ['increment', 'getValue']);

        Y.Assert.isFunction(list.getValue);
        Y.Assert.isFunction(list.increment);

        Y.Assert.areSame(list, list.increment());
        Y.ArrayAssert.itemsAreSame([2, 6], list.getValue());
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['arraylist', 'test']});
