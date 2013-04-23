YUI.add('general-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('General Tests');

            var simpleReport = {
                passed: 2,
                failed: 2,
                ignored: 1,
                total: 5,
                type: "report",
                name: "YUI Test Results",
                duration: 500,

                "Some Suite":{
                    passed: 2,
                    failed: 2,
                    ignored: 1,
                    total: 5,
                    type: "testsuite",
                    name: "Some Suite",
                    duration: 356,

                    "Some Tests": {
                        passed: 2,
                        failed: 2,
                        ignored: 1,
                        total: 5,
                        type: "testcase",
                        name: "Some Tests",
                        duration: 250,

                        test1:{
                            result: "pass",
                            message: "Test passed.",
                            type: "test",
                            name: "test1",
                            duration: 25
                        },

                        test2:{
                            result: "pass",
                            message: "Test passed.",
                            type: "test",
                            name: "test2",
                            duration: 30
                        },

                        test3:{
                            result: "ignore",
                            message: "Test ignored.",
                            type: "test",
                            name: "test3",
                            duration: 35
                        },

                        test4:{
                            result: "fail",
                            message: "Test failed.",
                            type: "test",
                            name: "test4",
                            duration: 45
                        },

                        test5:{
                            result: "fail",
                            message: "Test failed.",
                            type: "test",
                            name: "test5",
                            duration: 50
                        }
                    }
                }
            };



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
                'test: resume without wait': true
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
            Assert.isTrue((s.name.indexOf('testSuite') === 0));
        },
        'test: case with no name': function() {
            var s = new Y.Test.Case();
            Assert.isTrue((s.name.indexOf('testCase') === 0));
        },
        'test: callback': function() {
            var fn = this.callback();
        },
        'test: assert': function() {
            this.assert(true, 'Assert');
        },
        'test: assert no condition': function() {
            this.assert();
        },
        'test: assert.fail': function() {
            this.fail('Failed');
        },
        _should: {
            fail: {
                'test: assert.fail': true,
                'test: assert no condition': true
            }
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'EventTarget',
        'test: attach': function() {
            var tcase = Y.Test.Runner;
            var noop = function() {};
            var count = Y.Object.keys(tcase._handlers).length;
            tcase.subscribe('foobar', noop);
            var count2 = Y.Object.keys(tcase._handlers).length;
            Assert.areEqual(count + 1, count2);
            tcase.unsubscribe('foobar', noop);
            var count3 = tcase._handlers.foobar.length;
            Assert.areEqual(0, count3);
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
        'test: should error for not passing dates': function() {
            DateAssert.datesAreEqual(null, null);
        },
        'test: should error for not passing times': function() {
            DateAssert.timesAreEqual(null, null);
        },
        _should: {
            fail: {
                'test: datesAreEqual() fail': true,
                'test: timesAreEqual() fail': true
            },
            error: {
                'test: should error for not passing dates': true,
                'test: should error for not passing times': true
            }
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Runner Tests',
        'test: set name': function() {
            var setName = 'YUITest Test Suite',
                name = Y.Test.Runner.getName();

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
        'test: getResults': function() {
            var results = Y.Test.Runner.getResults();
            Assert.isNull(results);
        },
        'test: clear': function() {
            var suite = Y.Test.Runner.masterSuite;

            Y.Test.Runner.clear();

            Assert.isTrue((Y.Test.Runner.masterSuite.name.indexOf('testSuite_') === 0));

            Y.Test.Runner.masterSuite = suite;
        },

        'test: _getCount and reset': function() {
                var asserts = Assert._asserts;

            Assert.areEqual(asserts, Assert._getCount());
            Assert._reset();
            Assert.areEqual(0, Assert._getCount());
            Assert._asserts = asserts;
        },
        _should: {
            ignore: {
                'test: ignore': true
            }
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Error Tests',
        'test: Assert.Error': function() {
            var e = new Y.Assert.Error('Assertion Error');
            Assert.areEqual('Assert Error', e.name);
            Assert.areEqual('Assert Error: Assertion Error', e.toString());
            Assert.areEqual('Assert Error: Assertion Error', e.valueOf());
            Assert.areEqual('Assertion Error', e.message);
        },
        'test: Assert.ComparisonFailure': function() {
            var e = new Y.Assert.ComparisonFailure('ComparisonFailure Error', false, true);
            Assert.areEqual('ComparisonFailure', e.name);
            Assert.areEqual('ComparisonFailure: ComparisonFailure Error\nExpected: false (boolean)\nActual: true (boolean)', e.toString());
            Assert.areEqual('ComparisonFailure: ComparisonFailure Error\nExpected: false (boolean)\nActual: true (boolean)', e.valueOf());
            Assert.areEqual('ComparisonFailure Error', e.message);
        },
        'test: Assert.UnexpectedValue': function() {
            var e = new Y.Assert.UnexpectedValue('UnexpectedValueError', false);
            Assert.areEqual('UnexpectedValue', e.name);
            Assert.areEqual('UnexpectedValue: UnexpectedValueError\nUnexpected: false (boolean) ', e.toString());
            Assert.areEqual('UnexpectedValue: UnexpectedValueError\nUnexpected: false (boolean) ', e.valueOf());
            Assert.areEqual('UnexpectedValueError', e.message);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Reporter',
        'test: report': function() {
            var url = "http://foobar.com/",
                reporter = new Y.Test.Reporter(url, Y.Test.Format.JSON),
                form,
                foo,
                results,
                json;
            reporter.addField('foo', 'bar');

            json = Y.Test.Format.JSON(simpleReport);
            reporter.report(simpleReport, false);
            
            Assert.isNotNull(reporter._form);
            Assert.areEqual(url, reporter.url);
            
            form = Y.one(reporter._form);
            foo = form.one('input[name=foo]');
            results = form.one('input[name=results]');
            
            Assert.areEqual("bar", foo.get('value'));
            Assert.areEqual(json, results.get('value'));
            
            reporter.clearFields();

            reporter.destroy();
            Assert.isNull(reporter._form);
        }
    }));

    Y.Test.Runner.add(suite);

});
