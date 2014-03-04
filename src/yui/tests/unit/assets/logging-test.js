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

    var hasWorkingConsole = function() {
        return !(typeof console === "undefined" || !console.info || Y.UA.nodejs);
    };

    var testLogging = new Y.Test.Case({

        name: "Logging tests",
        _should: {
            ignore: {
                test_log_params: !hasWorkingConsole(),
                test_log_default_category: !hasWorkingConsole(),
                test_log_filter: !hasWorkingConsole(),
                'logInclude: glob override': !hasWorkingConsole(),
                'logInclude: minLevel override - matching': !hasWorkingConsole(),
                'logInclude: minLevel override - not matching': !hasWorkingConsole(),
                'logInclude: truthful boolean - matching': !hasWorkingConsole(),
                'logInclude: truthful boolean - mismatching': !hasWorkingConsole(),
                'logInclude: falsey boolean': !hasWorkingConsole(),
                'logExclude: glob override': !hasWorkingConsole(),
                'logExclude: overridden glob': !hasWorkingConsole()
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
        },
        test_log_filter: function() {
            var Assert = Y.Assert;

            // Test the default log category override.
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        '*': 'debug'
                    }
                });

                // Debug is the default level defined in logIncludes and will override the default logLevel:
                lastCategory = undefined;
                Y.log('This has a valid log level', 'debug');
                Assert.areEqual(lastCategory, 'debug', 'Failed to log at debug log category');
            });

            // Test overrides for a specific source:
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: 'info'
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('This has a valid log level', 'debug', 'a');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'info', 'a');
                Assert.areEqual(lastCategory, 'info', 'Failed to log at info log category');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'warn', 'a');
                Assert.areEqual(lastCategory, 'warn', 'Failed to log at warn log category');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'error', 'a');
                Assert.areEqual(lastCategory, 'error', 'Failed to log at error log category');
            });

            // Test not overriding for a specific source:
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: 'debug'
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('This has a valid log level', 'debug', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'info', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');
                lastCategory = undefined;
                Y.log('This has a valid log level', 'warn', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'error', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');
            });

            // Test true boolean state for logIncludes
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: true
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('This has a valid log level', 'debug', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'info', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'warn', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'error', 'b');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was higher.');
            });

            // Test false boolean state for logIncludes
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: false
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('This has a valid log level', 'debug', 'a');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug level when the logInclude level was false.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'info', 'a');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug info when the logInclude level was false.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'warn', 'a');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug warn when the logInclude level was false.');

                lastCategory = undefined;
                Y.log('This has a valid log level', 'error', 'a');
                Assert.areEqual(lastCategory, undefined, 'Failed to filter out a debug error when the logInclude level was false.');
            });
        },

        'logInclude: glob override': function() {
            var Assert = Y.Assert;

            // Test the default log category override.
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        '*': 'debug'
                    }
                });

                // Debug is the default level defined in logIncludes and will override the default logLevel:
                lastCategory = undefined;
                Y.log('This has a valid log level', 'debug');
                Assert.areEqual(lastCategory, 'debug', 'Failed to log at \'debug\' log category');
            });
        },

        'logInclude: minLevel override - matching': function() {
            var Assert = Y.Assert;

            // Test overrides for a specific source:
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: 'info'
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('Some message', 'debug', 'a');
                Assert.isUndefined(lastCategory, 'Failed to filter out \'debug\' log message.');

                lastCategory = undefined;
                Y.log('Some message', 'info', 'a');
                Assert.areEqual(lastCategory, 'info', 'Failed to log at \'info\' log category');

                lastCategory = undefined;
                Y.log('Some message', 'warn', 'a');
                Assert.areEqual(lastCategory, 'warn', 'Failed to log at \'warn\' log category');

                lastCategory = undefined;
                Y.log('Some message', 'error', 'a');
                Assert.areEqual(lastCategory, 'error', 'Failed to log at \'error\' log category');
            });
        },

        'logInclude: minLevel override - not matching': function() {
            var Assert = Y.Assert;

            // Test not overriding for a specific source:
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: 'debug'
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('Some message', 'debug', 'b');
                Assert.isUndefined(lastCategory, 'Failed to filter out \'debug\' log message.');

                lastCategory = undefined;
                Y.log('Some message', 'info', 'b');
                Assert.isUndefined(lastCategory, 'Failed to filter out \'info\' log message.');

                lastCategory = undefined;
                Y.log('Some message', 'warn', 'b');
                Assert.isUndefined(lastCategory, 'Failed to filter out \'warn\' log message.');

                lastCategory = undefined;
                Y.log('Some message', 'error', 'b');
                Assert.isUndefined(lastCategory, 'Failed to filter out \'error\' log message.');
            });

        },

        'logInclude: truthful boolean - matching': function() {
            var Assert = Y.Assert;

            // Test true boolean state for logIncludes
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: true
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('Some message', 'debug', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'debug' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'info', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'info' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'warn', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'warn' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'error', 'a');
                Assert.areEqual('error', lastCategory, "Failed to log at 'error' log message.");

            });
        },

        'logInclude: truthful boolean - mismatching': function() {
            var Assert = Y.Assert;
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: true
                    }
                });

                // Anything with a source of 'b' should not log if it's at 'info' or below:
                lastCategory = undefined;
                Y.log('Some message', 'debug', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'debug' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'info', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'info' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'warn', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'warn' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'error', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'error' log message.");
            });
        },

        'logInclude: falsey boolean': function() {
            var Assert = Y.Assert;

            // Test false boolean state for logIncludes
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logInclude: {
                        a: false
                    }
                });

                // Anything with a source of 'a' should log if it's at 'info' or above:
                lastCategory = undefined;
                Y.log('Some message', 'debug', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'debug' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'info', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'info' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'warn', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'warn' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'error', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'error' log message.");
            });
        },

        'logExclude: glob override': function() {
            var Assert = Y.Assert;

            // Test the default log category override.
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logExclude: {
                        '*': true
                    }
                });

                // Debug is the default level defined in logExcludes and will override the default logLevel:
                lastCategory = undefined;
                Y.log('Some message', 'debug');
                Assert.isUndefined(lastCategory, "Failed to filter out 'debug' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'info');
                Assert.isUndefined(lastCategory, "Failed to filter out 'info' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'warn');
                Assert.isUndefined(lastCategory, "Failed to filter out 'warn' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'error');
                Assert.isUndefined(lastCategory, "Failed to filter out 'error' log message.");
            });
        },

        'logExclude: overridden glob': function() {
            var Assert = Y.Assert;

            // Test true boolean state for logExcludes
            YUI().use(function (Y) {
                Y.applyConfig({
                    logLevel: 'error',
                    logExclude: {
                        '*': true,
                        a: false
                    }
                });

                // Anything matching 'a' should log when at error, or above.
                lastCategory = undefined;
                Y.log('Some message', 'debug', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'debug' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'info', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'info' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'warn', 'a');
                Assert.isUndefined(lastCategory, "Failed to filter out 'warn' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'error', 'a');
                Assert.areEqual('error', lastCategory, "Failed to log 'error' log message at a non-excluded category");


                lastCategory = undefined;
                Y.log('Some message', 'debug', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'debug' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'info', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'info' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'warn', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'warn' log message.");

                lastCategory = undefined;
                Y.log('Some message', 'error', 'b');
                Assert.isUndefined(lastCategory, "Failed to filter out 'error' log message.");
            });
        }
    });

    Y.SeedTests.add(testLogging);
});
