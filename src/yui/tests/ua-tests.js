YUI.add('ua-tests', function(Y) {
    var Assert = Y.Assert,
        suite  = new Y.Test.Suite('User Agent String Tests');

    suite.add(new Y.Test.Case({
        name: 'Node.js',
        _should: {
            fail: {
                'test: Node.js version': (Y.UA.nodejs !== 0.615)
            }
        },

        'test: Node.js version': function() {
            Assert.areEqual(0.615, Y.UA.nodejs, 'Failed to get Node.js process version from process object');
        },
        'test: Node.js platform': function() {
            Assert.areEqual(process.platform, Y.UA.os, 'Failed to get Node.js process platform from process object');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'General',

        'compareVersions() should compare major versions': function () {
            Assert.areSame(-1, Y.UA.compareVersions('1', '2'), '1 < 2');
            Assert.areSame(-1, Y.UA.compareVersions(1, 2), '1 < 2 (numeric)');
            Assert.areSame(-1, Y.UA.compareVersions('1.0', '2'), '1.0 < 2');
            Assert.areSame(-1, Y.UA.compareVersions('1.0.0', '2'), '1.0.0 < 2');
            Assert.areSame(-1, Y.UA.compareVersions('1', '2.0'), '1 < 2.0');
            Assert.areSame(-1, Y.UA.compareVersions('1', '2.0.0'), '1 < 2.0.0');

            Assert.areSame(0, Y.UA.compareVersions('1', '1'), '1 == 1');
            Assert.areSame(0, Y.UA.compareVersions(1, 1), '1 == 1 (numeric)');
            Assert.areSame(0, Y.UA.compareVersions('1.0', '1'), '1.0 == 1');
            Assert.areSame(0, Y.UA.compareVersions('1.0.0', '1'), '1.0.0 == 1');
            Assert.areSame(0, Y.UA.compareVersions('1', '1.0'), '1 == 1.0');
            Assert.areSame(0, Y.UA.compareVersions('1', '1.0.0'), '1 == 1.0.0');

            Assert.areSame(1, Y.UA.compareVersions('2', '1'), '2 > 1');
            Assert.areSame(1, Y.UA.compareVersions(2, 1), '2 > 1 (numeric)');
            Assert.areSame(1, Y.UA.compareVersions('2.0', '1'), '2.0 > 1');
            Assert.areSame(1, Y.UA.compareVersions('2.0.0', '1'), '2.0.0 > 1');
            Assert.areSame(1, Y.UA.compareVersions('2', '1.0'), '2 > 1.0');
            Assert.areSame(1, Y.UA.compareVersions('2', '1.0.0'), '2 > 1.0.0');
        },

        'compareVersions() should compare major + minor versions': function () {
            Assert.areSame(-1, Y.UA.compareVersions('0.1', '0.2'), '0.1 < 0.2');
            Assert.areSame(-1, Y.UA.compareVersions(0.1, 0.2), '0.1 < 0.2 (numeric)');
            Assert.areSame(-1, Y.UA.compareVersions('0.8', '0.20'), '0.8 < 0.20');
            Assert.areSame(-1, Y.UA.compareVersions('1.0', '2.0'), '1.0 < 2.0');
            Assert.areSame(-1, Y.UA.compareVersions(1.0, 2.0), '1.0 < 2.0 (numeric)');
            Assert.areSame(-1, Y.UA.compareVersions('1.8', '1.20'), '1.8 < 1.20');
            Assert.areSame(-1, Y.UA.compareVersions('1.8.0', '1.20'), '1.8.0 < 1.20');
            Assert.areSame(-1, Y.UA.compareVersions('1.8.0', '1.20.0'), '1.8.0 < 1.20.0');

            Assert.areSame(0, Y.UA.compareVersions('1.0', '1.0'), '1.0 == 1.0');
            Assert.areSame(0, Y.UA.compareVersions(1.0, 1.0), '1.0 == 1.0 (numeric)');
            Assert.areSame(0, Y.UA.compareVersions('1.0.0', '1.0'), '1.0.0 == 1.0');
            Assert.areSame(0, Y.UA.compareVersions('1.0', '1.0.0'), '1.0 == 1.0.0');

            Assert.areSame(1, Y.UA.compareVersions('0.2', '0.1'), '0.2 > 0.1');
            Assert.areSame(1, Y.UA.compareVersions(0.2, 0.1), '0.2 > 0.1 (numeric)');
            Assert.areSame(1, Y.UA.compareVersions('0.20', '0.8'), '0.20 > 0.8');
            Assert.areSame(1, Y.UA.compareVersions('2.0', '1.0'), '2.0 > 1.0');
            Assert.areSame(1, Y.UA.compareVersions(2.0, 1.0), '2.0 > 1.0 (numeric)');
            Assert.areSame(1, Y.UA.compareVersions('1.20', '1.8'), '1.20 > 1.8');
            Assert.areSame(1, Y.UA.compareVersions('1.20.0', '1.8'), '1.20.0 > 1.8');
            Assert.areSame(1, Y.UA.compareVersions('1.20.0', '1.8.0'), '1.20.0 > 1.8.0');
        },

        'compareVersions() should compare major + minor + build versions': function () {
            Assert.areSame(-1, Y.UA.compareVersions('0.0.1', '0.0.2'), '0.0.1 < 0.0.2');
            Assert.areSame(-1, Y.UA.compareVersions('0.1.0', '0.2.0'), '0.1.0 < 0.2.0');
            Assert.areSame(-1, Y.UA.compareVersions('0.8.0', '0.20.0'), '0.8.0 < 0.20.0');
            Assert.areSame(-1, Y.UA.compareVersions('1.0.0', '2.0.0'), '1.0.0 < 2.0.0');
            Assert.areSame(-1, Y.UA.compareVersions('1.8.0', '1.20.0'), '1.8.0 < 1.20.0');

            Assert.areSame(0, Y.UA.compareVersions('1.0.0', '1.0.0'), '1.0.0 == 1.0.0');
            Assert.areSame(0, Y.UA.compareVersions('1.20.0', '1.20.0.0'), '1.20.0 == 1.20.0.0');

            Assert.areSame(1, Y.UA.compareVersions('0.2.1', '0.1.1'), '0.2.1 > 0.1.1');
            Assert.areSame(1, Y.UA.compareVersions('0.20.525', '0.8.900'), '0.20.525 > 0.8.900');
            Assert.areSame(1, Y.UA.compareVersions('2.0.1', '1.0.0'), '2.0.1 > 1.0.0');
            Assert.areSame(1, Y.UA.compareVersions('1.20.0', '1.8.5'), '1.20.0 > 1.8.5');
        },

        'compareVersions() should handle null/undefined/empty input': function () {
            Assert.areSame(-1, Y.UA.compareVersions(null, '1.0'), 'null < 1.0');
            Assert.areSame(-1, Y.UA.compareVersions(undefined, '1.0'), 'undefined < 1.0');
            Assert.areSame(-1, Y.UA.compareVersions('', '1.0'), '"" < 1.0');

            Assert.areSame(0, Y.UA.compareVersions(null, null), 'null == null');
            Assert.areSame(0, Y.UA.compareVersions(null), 'null == undefined');
            Assert.areSame(0, Y.UA.compareVersions(null, ''), 'null == ""');
            Assert.areSame(0, Y.UA.compareVersions(), 'undefined == undefined');
            Assert.areSame(0, Y.UA.compareVersions('', ''), '"" == ""');

            Assert.areSame(1, Y.UA.compareVersions('1.0', null), '1.0 > null');
            Assert.areSame(1, Y.UA.compareVersions('1.0', undefined), '1.0 > undefined');
            Assert.areSame(1, Y.UA.compareVersions('1.0', ''), '1.0 > ""');
        }
    }));

    Y.each(Y.UAData, function(info, name) {
        var testCase = {
            name: 'User Agent: ' + name
        };

        Y.each(info, function(data) {
            testCase['test: ' + data.ua] = (function(i) {
                return function() {
                    var ua = YUI.Env.parseUA(i.ua);
                    Y.each(i.data, function(v, k) {
                        Y.Assert.areEqual(v, ua[k], 'Key (' + k + ') for ' + i.ua);
                    });
                };
            }(data));
        });

        suite.add(new Y.Test.Case(testCase));
    });

    Y.Test.Runner.add(suite);

});
