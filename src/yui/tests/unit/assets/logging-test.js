YUI.add('logging-test', function(Y) {

    YUI.GlobalConfig = YUI.GlobalConfig || {};

    var lastSource, lastCategory, lastMessage,
        stockFunctions = {
            log: console.log,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error
        };

    var testLogging = new Y.Test.Case({

        name: "Logging tests",
        _should: {
            ignore: {
                test_log_params: (typeof console == "undefined" || !console.info || Y.UA.nodejs),
                test_log_default_category: (typeof console == "undefined" || !console.info || Y.UA.nodejs)
            }
        },

        setUp: function() {
            // Override all of the console functions so that we can check
            // their return values.
            var fnName,
                // Note, this uses partial function binding so the level is first.
                consoleFn = function(level, str) {
                    var splitString = str.split(':');
                    lastCategory = level;
                    lastSource = splitString && splitString[0] || undefined;
                    lastMessage = splitString && splitString[1] || str;
                };
            for (fnName in stockFunctions) {
                console[fnName] = consoleFn.bind(undefined, fnName);
            }
        },

        tearDown: function() {
            var fnName;
            for (fnName in stockFunctions) {
                console[fnName] = stockFunctions[fnName];
            }
        },

        test_log_params: function() {
            var Assert = Y.Assert;

            YUI().use(function (Y) {
                Y.applyConfig({
                    logInclude: {
                        logMe: true,
                        butNotMe: false
                    }
                });

                lastSource = undefined;
                Y.log('test logInclude logMe','info','logMe');
                Assert.areEqual(lastSource, 'logMe', 'logInclude (true) Failed');

                lastSource = undefined;
                Y.log('test logInclude butNotMe','info','butNotMe');
                Assert.isUndefined(lastSource, 'logInclude (false) Failed');

                Y.applyConfig({
                    logInclude: '',
                    logExclude: {
                        excludeMe: true,
                        butDontExcludeMe: false
                    }
                });

                lastSource = undefined;
                Y.log('test logExclude excludeMe','info','excludeMe');
                Assert.isUndefined(lastSource, 'excludeInclude (true) Failed');

                lastSource = undefined;
                Y.log('test logExclude butDontExcludeMe','info','butDontExcludeMe');
                Assert.areEqual(lastSource, 'butDontExcludeMe', 'logExclue (false) Failed');

                Y.applyConfig({
                    logInclude: {
                        davglass: true
                    },
                    logExclude: {
                        '': true
                    }
                });

                lastSource = undefined;
                Y.log('This should be ignored', 'info');
                Assert.isUndefined(lastSource, 'Failed to exclude log param with empty string');

                lastSource = undefined;
                Y.log('This should NOT be ignored', 'info', 'davglass');
                Assert.areEqual(lastSource, 'davglass', 'Failed to include log param');

                // Default logLevel is debug
                Y.applyConfig({
                    logInclude: {
                        'logleveltest': true
                    }
                });

                lastSource = undefined;
                Y.log('This should be logged', 'debug', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                // Debug should also take effect when actively specified
                Y.applyConfig({
                    logLevel: 'debug'
                });
                lastSource = undefined;
                Y.log('This should be logged', 'debug', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                // An invalid log level has the same effect as 'debug'
                Y.applyConfig({
                    logLevel: 'invalidloglevel'
                });

                lastSource = undefined;
                Y.log('This should be logged', 'debug', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                lastSource = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'info'
                });
                lastSource = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold');
                lastSource = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');
                lastSource = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');
                lastSource = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'warn'
                });
                lastSource = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold');
                lastSource = undefined;
                Y.log('This should NOT be logged', 'info', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold');
                lastSource = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');
                lastSource = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'error'
                });
                lastSource = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold');
                lastSource = undefined;
                Y.log('This should NOT be logged', 'info', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold');
                lastSource = undefined;
                Y.log('This should NOT be ignored', 'warn', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold');
                lastSource = undefined;
                Y.log('This should NOT be ignored', 'error', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'ERROR'
                });
                lastSource = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold - case insensitivty possibly ignored');
                lastSource = undefined;
                Y.log('This should NOT be logged', 'info', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold - case insensitivty possibly ignored');
                lastSource = undefined;
                Y.log('This should NOT be ignored', 'warn', 'logleveltest');
                Assert.isUndefined(lastSource, 'Failed to exclude log level below threshold - case insensitivty possibly ignored');
                lastSource = undefined;
                Y.log('This should NOT be ignored', 'error', 'logleveltest');
                Assert.areEqual(lastSource, 'logleveltest', 'Failed to include log param');
            });
        },
        test_log_default_category: function() {
            var Assert = Y.Assert;

            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'debug'
                });
                lastCategory = undefined;
                Y.log('This has a valid log level', 'debug');
                Assert.areEqual(lastCategory, 'debug', 'Failed to log at debug log category');
                lastCategory = undefined;
                Y.log('This has a valid log level', 'info');
                Assert.areEqual(lastCategory, 'info', 'Failed to log at info log category');
                lastCategory = undefined;
                Y.log('This has a valid log level', 'warn');
                Assert.areEqual(lastCategory, 'warn', 'Failed to log at warn log category');
                lastCategory = undefined;
                Y.log('This has a valid log level', 'error');
                Assert.areEqual(lastCategory, 'error', 'Failed to log at error log category');
                lastCategory = undefined;
                Y.log('This has no log level and should use the default');
                Assert.areEqual(lastCategory, 'info', 'Failed to log at default log category of info');
                lastCategory = undefined;
                Y.log('This has an invalid log level and should use the default', 'notice');
                Assert.areEqual(lastCategory, 'info', 'Failed to log at default info log category');
            });
        }
        }
    });

    Y.SeedTests.add(testLogging);
});
