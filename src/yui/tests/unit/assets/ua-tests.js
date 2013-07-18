YUI.add('ua-tests', function(Y) {
    var Assert = Y.Assert,
        suite  = new Y.Test.Suite('YUI: User Agent');

    suite.add(new Y.Test.Case({
        name: 'Node.js',
        _should: {
            ignore: {
                'test: Node.js platform': !Y.UA.nodejs
            },
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
        name: 'Touch Enabled Tests',
        _should: {
            ignore: {
                'test: ie10 Windows touchEnabled': !Y.UA.ie,
                'test: iOS touchEnabled': !Y.UA.ios
            }
        },
        'test: ie10 Windows touchEnabled': function() {
            if (('msMaxTouchPoints' in Y.config.win.navigator) && (Y.config.win.navigator.msMaxTouchPoints)) {
                Assert.isTrue(Y.UA.touchEnabled);
            } else {
                Assert.isFalse(Y.UA.touchEnabled);
            }
        },
        'test: iOS touchEnabled': function() {
            if ('ontouchstart' in Y.config.win) {
                Assert.isTrue(Y.UA.touchEnabled);
            } else {
                Assert.isFalse(Y.UA.touchEnabled);
            }
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'IE 10/Windows 8 App',
        _should: {
            ignore: {
                'test: win8 app': !Y.config.win,
                'test: not win8 app': (!Y.config.win || Y.UA.winjs)
            }
        },
        setUp: function() {
            if (!window.Windows && !this.skip) {
                window.Windows = {
                    System: true,
                    YUI: true
                };
            }
        },
        tearDown: function() {
            if (window && window.Windows && window.Windows.YUI) {
                try {
                    delete window.Windows;
                } catch (e) {
                    // For IE6, IE7
                    window.Windows = undefined;
                }
            }
        },
        'test: win8 app': function() {
            var ua = YUI.Env.parseUA();
            Assert.isTrue(ua.winjs);
            this.skip = true;
        },
        'test: not win8 app': function() {
            var ua = YUI.Env.parseUA();
            Assert.isFalse(ua.winjs);
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

    Y.Object.each(Y.UAData, function (tests, name) {
        var testCase = {name: 'User Agent: ' + name};

        Y.Array.each(tests, function (test) {
            testCase['test: ' + test.ua] = function () {
                var ua = YUI.Env.parseUA(test.ua);

                Y.Object.each(test.data, function (value, key) {
                    Y.Assert.areEqual(value, ua[key], 'Key (' + key + ') for ' + test.ua);
                });
            };
        });

        suite.add(new Y.Test.Case(testCase));
    });

    Y.Test.Runner.add(suite);

});
