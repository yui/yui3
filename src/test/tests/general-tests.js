YUI.add('general-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('General Tests');


    suite.add(new Y.Test.Case({
        name: 'Wait/Resume',
        'test: resume without wait': function() {
            this.resume(function() {
                //Nothing
            });

        },
        'test: wait without function': function() {
            this.wait(100);
        },
        _should: {
            error: {
                'test: resume without wait': true,
            },
            fail: {
                'test: wait without function': true
            }
        }
    }));


    suite.add(new Y.Test.Case({
        name: 'Suite/Case Tests',
        'test: suite with no name': function() {
            var s = new Y.Test.Suite();
            Assert.isTrue((s.name.indexOf('testSuiteyui') === 0));
        },
        'test: case with no name': function() {
            var s = new Y.Test.Case();
            Assert.isTrue((s.name.indexOf('testCaseyui') === 0));
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'General Asserts',
        'test: asserts': function() {
            Assert.areNotEqual(true, false);
            Assert.areNotSame(1, '1');
            Assert.isFalse(false);
            Assert.isTrue(true);
            Assert.isNaN(parseInt('foobar'));
            Assert.isNotNaN(parseInt(100));
            Assert.isNull(null);
            Assert.isNotNull(true);
            Assert.isUndefined(undefined);
            Assert.isNotUndefined('foo');
            Assert.isArray([]);
            Assert.isInstanceOf(Y.Test.Case, this);
            Assert.isTypeOf(typeof 'foo', 'FooBar');
            Y.assert(true);
        },
        'test: asserts fail areNotEqual': function() {
            Assert.areNotEqual(true, true);
        },
        'test: asserts fail areNotSame': function() {
            Assert.areNotSame(1, 1);
        },
        'test: asserts fail isFalse': function() {
            Assert.isFalse(true);
        },
        'test: asserts fail isTrue': function() {
            Assert.isTrue(false);
        },
        'test: asserts fail isNaN': function() {
            Assert.isNaN(parseInt(100));
        },
        'test: asserts fail isNotNaN': function() {
            Assert.isNotNaN(parseInt('Foobar'));
        },
        'test: asserts fail isNull': function() {
            Assert.isNull(false);
        },
        'test: asserts fail isNotNull': function() {
            Assert.isNotNull(null);
        },
        'test: asserts fail isUndefined': function() {
            Assert.isUndefined(false);
        },
        'test: asserts fail isNotUndefined': function() {
            Assert.isNotUndefined(undefined);
        },
        'test: asserts fail isArray': function() {
            Assert.isArray({});
            Assert.isArray('asdf');
            Assert.isArray(function() {});
            Assert.isArray(arguments);
        },
        'test: asserts fail isInstanceOf': function() {
            Assert.isInstanceOf(Y.Test.Suite, this);
        },
        'test: asserts fail isTypeOf': function() {
            Assert.isTypeOf(typeof 'string', {});
        },
        'test: Y.assert fail': function() {
            Y.assert(false);
        },
        _should: {
            fail: {
                'test: asserts fail areNotEqual': true,
                'test: asserts fail areNotSame': true,
                'test: asserts fail isFalse': true,
                'test: asserts fail isTrue': true,
                'test: asserts fail isNaN': true,
                'test: asserts fail isNotNaN': true,
                'test: asserts fail isNull': true,
                'test: asserts fail isNotNull': true,
                'test: asserts fail isUndefined': true,
                'test: asserts fail isNotUndefined': true,
                'test: asserts fail isArray': true,
                'test: asserts fail isInstanceOf': true,
                'test: asserts fail isTypeOf': true,
                'test: Y.assert fail': true
            }
        }
    }));

    var DateAssert = Y.DateAssert;

    suite.add(new Y.Test.Case({
        name: 'Date Tests',
        'test: datesAreEqual()': function() {
            var date1 = date2 = new Date();
            DateAssert.datesAreEqual(date1, date2);
        },
        'test: datesAreEqual() fail': function() {
            var date1 = new Date();
            DateAssert.datesAreEqual(date1, new Date('01/01/1999'));
        },
        'test: timesAreEqual()': function() {
            var date1 = date2 = new Date();
            DateAssert.datesAreEqual(date1, date2);
        },
        'test: timesAreEqual() fail': function() {
            var date1 = new Date('01/01/1999 16:16:16');
            DateAssert.timesAreEqual(date1, new Date('01/01/1999 12:12:12'));
        },
        _should: {
            fail: {
                'test: datesAreEqual() fail': true,
                'test: timesAreEqual() fail': true
            }
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Runner Tests',
        'test: logging': function() {
            Assert.isTrue(Y.Test.Runner._log);
            Y.Test.Runner.disableLogging();
            Assert.isFalse(Y.Test.Runner._log);
            Y.Test.Runner.enableLogging();
            Assert.isTrue(Y.Test.Runner._log);
        },
        'test: set name': function() {
            var setName = 'YUI Test Suite',
                name = Y.Test.Runner.getName();

            Assert.isTrue(name.indexOf('yuitests') === 0);
            Y.Test.Runner.setName(setName);
            name = Y.Test.Runner.getName();
            Assert.areSame(setName, name);
        },
        'test: ignore': function() {
            Assert.isTrue(false);
        },
        'test: running/waiting': function() {
            Assert.isTrue(Y.Test.Runner.isRunning(), 'Running');
            Assert.isFalse(Y.Test.Runner.isWaiting(), 'Waiting');
        },
        _should: {
            ignore: {
                'test: ignore': true
            }
        }
    }));

    Y.Test.Runner.add(suite);

});
