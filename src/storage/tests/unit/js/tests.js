YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('storage'),
        Assert = Y.Test.Assert,
        storage = new Y.Storage({
            name: 'storage-test',
            version: 1,
            stores: ['test']
        });

    suite.add(new Y.Test.Case({
        name: 'Basic Storage Tests',
        'instantiation': function () {
            Assert.isInstanceOf(Y.Storage, storage, 'Incorrect instance');
        },
        'put then get a string': function() {
            var test = this;

            storage.test.put('foo', 'bar', function (err) {
                if (err) {
                    test.resume(function () {
                        Assert.fail(err.message);
                    });
                    return;
                }
                storage.test.get('foo', function (err, value) {
                    test.resume(function () {
                        if (err) Assert.fail(err.message);

                        Assert.areEqual('bar', value, 'Stored value is not the original value');
                    });
                });
            });

            test.wait(1000);
        },
        'put then get an object': function () {
            var test = this,
                obj = {
                    hello: 'world'
                };

            storage.test.put('testObj', obj, function (err) {
                if (err) {
                    test.resume(function () {
                        throw err;
                    });
                    return;
                }
                storage.test.get('testObj', function (err, value) {
                    test.resume(function () {
                        if (err) throw err;

                        Assert.areEqual('world', value.hello, 'Stored object is not the original object');
                        Assert.areNotSame(obj, value, 'Stored objects are the same');
                    });
                });
            });

            test.wait(1000);
        },
        'count keys': function () {
            var test = this;

            storage.test.count(function (err, count) {
                test.resume(function () {
                    if (err) throw err;

                    Assert.areEqual(2, count, 'Unexpected number of keys');
                });
            });

            test.wait(1000);
        },
        'remove a key': function () {
            var test = this;

            storage.test.remove('testObj', function (err) {
                if (err) {
                    test.resume(function () {
                        throw err;
                    });
                    return;
                }
                storage.test.count(function (err, count) {
                    test.resume(function () {
                        if (err) throw err;

                        Assert.areEqual(1, count, 'Unexpected number of keys after removing one key');
                    });
                });
            });

            test.wait(1000);
        },
        'delete all keys': function () {
            var test = this;

            storage.test.clear(function (err) {
                if (err) {
                    test.resume(function () {
                        throw err;
                    });
                    return;
                }
                storage.test.count(function (err, count) {
                    test.resume(function () {
                        if (err) throw err;

                        Assert.areEqual(0, count, 'Clear did not remove all rows');
                    });
                });
            });

            test.wait(1000);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
