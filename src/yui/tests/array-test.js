YUI.add('array-test', function (Y) {

var Assert = Y.Assert,

    suite = new Y.Test.Suite('Y.Array (core)');

suite.add(new Y.Test.Case({
    name: 'Array tests',

    testArray: function () {
        var els   = document.getElementById('tester').getElementsByTagName('span'),
            nodes = Y.all('#tester span');

        Assert.isArray(Y.Array(els), '');
        Assert.areSame(3, Y.Array(els).length);
        Assert.areSame(2, Y.Array(els, 1).length);

        // @TODO NodeList will be wrapped rather than have the items coerced into an
        // array.  If Array.test is adapted to handle NodeLists this could be made to
        // work.
        Assert.isArray(Y.Array(nodes));
        Assert.areSame(1, Y.Array(nodes).length);

        // Y.log('els length:' + els.length);
        // Y.log('a length:' + a.length);
        // Y.log('els tagName:' + els.tagName);
        // Y.log('els alert:' + els.alert);
        // Y.log('els size:' + els.size);
        // Y.log('els array test:' + Y.Array.test(els));

        // Y.Lang.type is broken for HTMLElementCollections in Safari.  isObject
        // returns false because typeof returns function

        // Y.log('els isObject:' + Y.Lang.isObject(els)); // false in Safari
        // Y.log('els type:' + Y.Lang.type(els) + '+'); // object
        // Y.log('els typeof:' + typeof els); // function
        // Y.log('els isFunction:' + Y.Lang.isFunction(els)); // false
        // Y.log('els.call:' + els.call);
        // Y.log('els.apply:' + els.apply);
    },

    testDedupe: function () {
        var array = ['foo', 'bar', 'foo', 'baz', 'foo', 'baz'];

        Y.ArrayAssert.itemsAreSame(['foo', 'bar', 'baz'], Y.Array.dedupe(array));
    },

    testEach: function () {
        var calls = 0,
            data  = ['a', 'b', 'c', 'd'],
            obj   = {foo: 'bar'};

        Y.Array.each(data, function (item, index, array) {
            calls += 1;

            Assert.areSame(data[index], item, 'the current item should be passed to the callback');
            Assert.areSame(data, array, 'the array should be passed to the callback');
            Assert.areSame(Y, this, 'the `this` object should default to the YUI instance');
        });

        Assert.areSame(calls, 4, 'the callback should be called 4 times');

        Y.Array.each(data, function () {
            Assert.areSame(obj, this, 'the `this` object should be overridable');
        }, obj);

        Assert.areSame(Y.Array.each, Y.Array.forEach, 'forEach should be an alias for each');
    },

    'each() should handle sparse arrays correctly': function () {
        var calls = 0,
            foo   = Array(5);

        foo.push('foo');

        Y.Array.each(foo, function () {
            calls += 1;
        });

        Assert.areSame(1, calls);
    },

    testHash: function () {
        Y.ObjectAssert.areEqual(
            {a: 'foo', b: 'bar', c: true},
            Y.Array.hash(['a', 'b', 'c'], ['foo', 'bar']),
            'keys should be mapped to values; true is used for missing values'
        );

        Y.ObjectAssert.areEqual(
            {a: true, b: true, c: true},
            Y.Array.hash(['a', 'b', 'c']),
            'the values array is optional'
        );
    },

    'hash() should handle sparse arrays correctly': function () {
        var keys   = ['foo', 'bar'],
            values = ['baz'],
            hash;

        keys.length   = 5;
        values.length = 5;

        hash = Y.Array.hash(keys, values);

        Y.Assert.areSame(2, Y.Object.size(hash));
        Y.Assert.areSame('baz', hash.foo);
        Y.Assert.isTrue(hash.bar);
    },

    testIndexOf: function () {
        var data = ['a', 'b', 1, 0, false, null, 'a'];

        Assert.areSame(0, Y.Array.indexOf(data, 'a'), 'should find the first match');
        Assert.areSame(-1, Y.Array.indexOf(data, 'z'), 'should return -1 on no match');
        Assert.areSame(2, Y.Array.indexOf(data, 1), 'should find numbers');
        Assert.areSame(4, Y.Array.indexOf(data, false), 'should perform strict equality checks');
        Assert.areSame(5, Y.Array.indexOf(data, null), 'should find null');
    },

    'indexOf() should support an ES5-compatible fromIndex arg': function () {
        var data = ['a', 'b', 1, 0, false, null, 'a'];

        Assert.areSame(0, Y.Array.indexOf(data, 'a', 0), 'should find the first match');
        Assert.areSame(6, Y.Array.indexOf(data, 'a', 1), 'should find the 6th match');
        Assert.areSame(-1, Y.Array.indexOf(data, 'a', 7), 'should return -1 on no match');
        Assert.areSame(0, Y.Array.indexOf(data, 'a', -8), 'should find the first match');
        Assert.areSame(6, Y.Array.indexOf(data, 'a', -1), 'should find the 6th match');

        Assert.areSame(0, Y.Array.indexOf(data, 'a', 0.1), 'should convert fromIndex to an int');
        Assert.areSame(0, Y.Array.indexOf(data, 'a', -0.1), 'should floor the absolute value of fromIndex to convert to an int');
        Assert.areSame(6, Y.Array.indexOf(data, 'a', '1'), 'should convert string fromIndex to a number');
        Assert.areSame(0, Y.Array.indexOf(data, 'a', undefined), 'should convert undefined fromIndex to a number');
        Assert.areSame(0, Y.Array.indexOf(data, 'a', NaN), 'should treat NaN as 0');
        Assert.areSame(-1, Y.Array.indexOf(data, 'a', 8), 'should return -1 on too-high fromIndex');
        Assert.areSame(-1, Y.Array.indexOf(data, 'a', Infinity), 'should return -1 on Infinity');
        Assert.areSame(0, Y.Array.indexOf(data, 'a', -Infinity), 'should return 0 on negative Infinity');
    },

    'indexOf() should handle sparse arrays correctly': function () {
        var array = ['a', 'b'];
        array[3] = undefined;

        Y.Assert.areSame(3, Y.Array.indexOf(array, undefined));
    },

    testNumericSort: function () {
        // the stock sort behavior should fail to produce desired result
        Y.ArrayAssert.itemsAreEqual([1, 100, 2, 3], [3, 100, 1, 2].sort());
        Y.ArrayAssert.itemsAreEqual([1, 2, 3, 100], [3, 100, 1, 2].sort(Y.Array.numericSort));
    },

    testSome: function () {
        var data  = [1, 2, 3],
            obj   = {foo: 'bar'},
            calls = 0;

        Assert.isTrue(Y.Array.some(data, function (v, index, array) {
            calls += 1;

            Assert.areSame(data[index], v, 'the current item should be passed to the callback');
            Assert.areSame(data, array, 'the array should be passed to the callback');
            Assert.areSame(Y.config.win, this, 'the `this` object should default to the global object');

            if (v === 2) { return 'truthy'; }
            if (v === 3) { Y.fail('truthy value did not stop iteration'); }
        }), 'should return true');

        Assert.areSame(2, calls, 'callback should be called twice');

        Assert.isFalse(Y.Array.some(data, function () {
            Assert.areSame(obj, this, 'the `this` object should be overridable');
        }, obj), 'should return false');
    },

    'some() should handle sparse arrays correctly': function () {
        var calls = 0,
            foo   = Array(5);

        foo.push('foo');

        Y.Array.some(foo, function () {
            calls += 1;
        });

        Assert.areSame(1, calls);
    },

    testTest: function () {
        Y.Assert.areEqual(0, Y.Array.test(function(){})); // functions should fail
        Y.Assert.areEqual(0, Y.Array.test(Y.one('#tester'))); // single nodes should fail
        Y.Assert.areEqual(0, Y.Array.test('string'));
        Y.Assert.areEqual(0, Y.Array.test(12345));
        Y.Assert.areEqual(0, Y.Array.test(null));
        Y.Assert.areEqual(0, Y.Array.test(undefined));
        Y.Assert.areEqual(0, Y.Array.test(/regexp/));
        Y.Assert.areEqual(0, Y.Array.test(new Date()));
        Y.Assert.areEqual(1, Y.Array.test([1, 2]));
        Y.Assert.areEqual(1, Y.Array.test([]));
        // Y.Assert.areEqual(1, Y.Array.test('string'.toCharArray()));
        Y.Assert.areEqual(2, Y.Array.test(arguments), 'arguments should be arraylike'); // arguments collection
        Y.Assert.areEqual(2, Y.Array.test(document.getElementsByTagName('span')), 'htmlelement collections should be arraylike'); // HTMLElementsCollection

        // @TODO figure out what to do with this.  A NodeList does not contain a collection of Nodes; it
        // contains a collection of HTMLElements.
        // Y.Assert.areEqual(3, Y.Array.test(Y.all('#btnRun')), 'nodelists should be specifically identified as a special collection'); // NodeList
        Y.Assert.areEqual(0, Y.Array.test(Y.all('span')), 'nodelists are not currently considered arraylike'); // NodeList
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
