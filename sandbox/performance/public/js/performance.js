YUI.add('performance', function (Y) {

// -- Shorthand & Private Variables --------------------------------------------
var Lang       = Y.Lang,
    Obj        = Y.Object,

    isFunction = Lang.isFunction,
    isValue    = Lang.isValue,

    DEFAULT_DURATION = 1000, // default duration for time-based tests
    XDR_PROXY_URL    = '/proxy?url={url}',

    EVT_CLEAR      = 'clear',
    EVT_END        = 'end',
    EVT_FINISH     = 'finish',
    EVT_RESULT_ADD = 'resultAdd',
    EVT_START      = 'start',
    EVT_STOP       = 'stop',

    MODE_ITERATION = 1,
    MODE_TIME      = 2, // not yet fully baked

    ACTIVE_SUITE = 'activeSuite',
    COMPLETE     = 'complete',
    RESULTS      = 'results',
    RUNNING      = 'running',

    suites     = {},
    xhrCache   = {};
    // yqlCache   = {},
    // yqlQueue   = {};

function Performance() {
    Performance.superclass.constructor.apply(this, arguments);
}

Performance.NAME  = 'performance';
Performance.ATTRS = {
    activeSuite: {
        readOnly: true
    },

    complete: {
        getter: function (value) {
            return value && !!this.get(ACTIVE_SUITE) && !this.get(RUNNING);
        },
        
        readOnly: true,
        value: false
    },

    mode: {
        value: MODE_ITERATION,

        validator: function (value) {
            return value === MODE_ITERATION || value === MODE_TIME;
        }
    },

    results: {
        readOnly: true,
        value: {}
    },

    running: {
        getter: function () {
            return this._queue && this._queue.length > 0;
        },

        readOnly: true
    }
};

Y.extend(Performance, Y.Base, {
    // -- Protected Properties -------------------------------------------------
    _queue    : [],
    _sandboxes: [],
    _stopped  : false,

    // -- Public Methods -------------------------------------------------------

    /**
     * Clears results from the most recent test suite and stops running tests if
     * tests are currently running.
     *
     * @method clearResults
     */
    clearResults: function () {
        this.stop();
        this._set(RESULTS, {});
        this.fire(EVT_CLEAR);
    },

    /**
     * Starts running the specified test suite.
     *
     * @method start
     * @param {String} suiteName test suite to run
     */
    start: function (suiteName) {
        var tests = {};

        if (this.get(RUNNING)) {
            Y.log("Can't start tests: tests are already running.", 'warn', 'performance');
            return;
        }

        var suite = Performance.getTestSuite(suiteName);

        if (!suite) {
            Y.log("There's no test suite named '" + suiteName + "'.", 'error', 'performance');
            return;
        }

        this.clearResults();

        this._set(ACTIVE_SUITE, suite);
        this._set(COMPLETE, false);

        this.fire(EVT_START, {suite: suite});

        // Queue up all the tests from each group, interleaving them so that
        // we run all tests with the same name from all groups before moving on
        // to the next test.
        Obj.each(suite.groups, function (group) {
            Obj.each(group.tests, function (test, testName) {
                if (!tests[testName]) {
                    tests[testName] = [];
                }

                test.group = group;
                tests[testName].push(test);
            }, this);
        }, this);

        Obj.each(tests, function (tests, testName) {
            Y.Array.each(tests, function (test) {
                this._queueTest(test, testName, test.group);
            }, this);
        }, this);

        // Start running tests.
        this._runNextTest();
    },

    /**
     * Stops running tests if tests are currently running.
     *
     * @method stop
     */
    stop: function () {
        if (this.get(RUNNING)) {
            this._stopped = true;
            this.fire(EVT_STOP);
            this.fire(EVT_END);
        }
    },

    // -- Protected Methods ----------------------------------------------------
    _finish: function () {
        var sandbox;

        while (sandbox = this._sandboxes.pop()) { // assignment
            sandbox.destroy();
        }

        this._queue = [];

        if (!this._stopped) {
            this._set(COMPLETE, true);
            this.fire(EVT_FINISH);
            this.fire(EVT_END);
        }

        this._stopped = false;
    },

    _queueTest: function (test, name, group) {
        var i = this.get('mode') === MODE_ITERATION ? test.iterations || 1 : 1,
            push,
            sandbox;

        test = Y.mix({}, test, true);

        // Note: test is now a shallow clone, but functions are still references
        // to the original test functions. Don't modify them.

        // Add a warmup iteration if desired.
        if (test.warmup) {
            i += 1;
        }

        // This function will create or reuse a sandbox for each test iteration
        // and then push that iteration onto the queue, while also providing a
        // handy closure to make async sandbox configuration easier.
        push = function () {
            var poll,
                preload = {};

            // Use one sandbox for all iterations of a given test unless the
            // useStrictSandbox option is true.
            if (test.useStrictSandbox || !sandbox) {
                this._sandboxes.push(sandbox = new Y.Sandbox({
                    bootstrapYUI: test.bootstrapYUI,
                    waitFor     : test.preloadUrls && 'preload'
                }));

                // TODO: clone this
                sandbox.setEnvValue('xhrGet', Performance._xhrGet);

                if (test.preloadUrls) {
                    // TODO: use async xhr
                    Obj.each(test.preloadUrls, function (url, key) {
                        // Proxy non-local URLs.
                        if (/^https?:\/\//.test(url)) {
                            url = XDR_PROXY_URL.replace('{url}', encodeURIComponent(url));
                        }

                        preload[key] = Performance._xhrGet(url);
                    });

                    sandbox.setEnvValue('preload', preload);
                }
            }

            // Push the test and its sandbox onto the queue.
            this._queue.push({
                group    : group,
                name     : name,
                sandbox  : sandbox,
                test     : test,
                warmup   : test.warmup && !(test.warmup = false) // intentional assignment, sets warmup to false for future iterations
            });
        };

        while (i--) {
            push.apply(this);
        }
    },

    _runNextTest: function (pending) {
        var iteration = pending || this._queue.shift(),
            test      = iteration && iteration.test;

        // If no pending iteration was passed in and the queue was empty, we're
        // done running tests.
        if (!iteration || this._stopped) {
            this._finish();
            return;
        }

        // Wait for this iteration's sandbox to be ready, then set up and run
        // the test. If the sandbox is already ready, the callback will execute
        // immediately.
        iteration.sandbox.on('ready', function () {
            var count,
                mode = this.get('mode');

            // Run the setup function if there is one and if it hasn't already
            // been run for this iteration.
            if (!iteration.setupDone && isFunction(test.setup)) {
                if (test.asyncSetup) {
                    // The setup function is asynchronous, so we'll pause the
                    // iteration while it runs, then restart the iteration once
                    // the setup function finishes successfully.
                    iteration.sandbox.run(test.setup, Y.bind(function (result) {
                        if (result === false) {
                            // Setup function returned false, so abort the test.
                            Y.log('Test "' + iteration.name + '" failed.', 'warn', 'performance');
                            this._runNextTest();
                        } else {
                            // Restart the iteration.
                            iteration.setupDone = true;
                            this._runNextTest(iteration);
                        }
                    }, this));

                    return;

                } else if (iteration.sandbox.run(test.setup) === false) {
                    // Setup function returned false, so abort the test.
                    Y.log('Test "' + iteration.name + '" failed.', 'warn', 'performance');
                    this._runNextTest();
                    return;
                }
            }

            if (mode === MODE_ITERATION) {
                // In iteration mode, we time the execution of each individual
                // iteration. This is the default mode.
                iteration.sandbox.profile(test.test, Y.bind(function (profileData) {
                    this._onIterationComplete(iteration, profileData);
                }, this));

            } else if (mode === MODE_TIME) {
                // In time mode, we run as many iterations as we can within the
                // specified duration rather than profiling each iteration. For
                // some tests, this can be a more accurate way of arriving at
                // consistent benchmark results.
                //
                // This is wrapped in a setTimeout to allow some breathing room
                // between tests and allow other UI events to be processed.
                setTimeout(Y.bind(function () {
                    count = iteration.sandbox.count(test.test,
                                test.duration || DEFAULT_DURATION);

                    this._onTimeComplete(iteration, count);
                }, this), 100);
            }
        }, this);
    },

    // -- Protected Callbacks & Event Handlers ---------------------------------
    _onIterationComplete: function (iteration, profileData) {
        var groupName    = iteration.group.name,
            result,
            results      = this.get('results'),
            groupResults = results[groupName],
            test         = iteration.test;

        // If the test has a teardown function, run it.
        if (!iteration.teardownDone && isFunction(test.teardown)) {
            if (test.asyncTeardown) {
                // The teardown function is asynchronous, so we'll pause the
                // iteration while it runs, then restart the iteration once the
                // teardown function finishes successfully.
                iteration.sandbox.run(test.teardown, Y.bind(function (result) {
                    if (result === false) {
                        // Teardown function failed.
                        Y.log('Test "' + iteration.name + '" failed on teardown.', 'warn', 'performance');
                    }

                    // Continue ending the iteration.
                    iteration.teardownDone = true;
                    this._onIterationComplete(iteration, profileData);
                }, this));

                return;
            } else if (iteration.sandbox.run(test.teardown) === false) {
                // Teardown function failed.
                Y.log('Test "' + iteration.name + '" failed on teardown.', 'warn', 'performance');
            }
        }

        // Destroy the sandbox unless we need to reuse it for another iteration.
        if (test.useStrictSandbox) {
            iteration.sandbox.destroy();
        }

        // If this was a warmup iteration, continue without collecting the
        // results.
        if (iteration.warmup) {
            this._runNextTest();
            return;
        }

        // Collect the results of the iteration.
        if (!groupResults) {
            groupResults = results[groupName] = {};
        }

        result = groupResults[iteration.name] || {
            calls   : 0,
            failures: 0,
            name    : iteration.name,
            points  : []
        };

        result.calls += 1;

        if (profileData.returnValue === false) {
            // A false return value indicates that the test failed.
            result.failures += 1;
        } else {
            result.points.push(profileData.duration);
        }

        if (result.calls === iteration.test.iterations) {
            result = Y.merge(result, Performance._analyzePoints(result.points));

            Y.Array.each(['max', 'mean', 'median', 'mediandev', 'min', 'stdev', 'variance'], function (key) {
                result[key] = isValue(result[key]) ? result[key].toFixed(2) : '';
            });

            this.fire(EVT_RESULT_ADD, {
                group : iteration.group,
                result: result,
                test  : test
            });
        }

        groupResults[iteration.name] = result;
        this._set('results', results);

        this._runNextTest();
    },

    _onTimeComplete: function (iteration, count) {
        var groupName    = iteration.group.name,
            mean,
            result,
            results      = this.get('results'),
            groupResults = results[groupName],
            test         = iteration.test;

        // If the test has a teardown function, run it.
        if (!iteration.teardownDone && isFunction(test.teardown)) {
            if (test.asyncTeardown) {
                // The teardown function is asynchronous, so we'll pause the
                // iteration while it runs, then restart the iteration once the
                // teardown function finishes successfully.
                iteration.sandbox.run(test.teardown, Y.bind(function (result) {
                    if (result === false) {
                        // Teardown function failed.
                        Y.log('Test "' + iteration.name + '" failed on teardown.', 'warn', 'performance');
                    }

                    // Continue ending the iteration.
                    iteration.teardownDone = true;
                    this._onTimeComplete(iteration, count);
                }, this));

                return;
            } else if (iteration.sandbox.run(test.teardown) === false) {
                // Teardown function failed.
                Y.log('Test "' + iteration.name + '" failed on teardown.', 'warn', 'performance');
            }
        }

        // Destroy the sandbox unless we need to reuse it for another iteration.
        if (test.useStrictSandbox) {
            iteration.sandbox.destroy();
        }

        // If this was a warmup iteration, continue without collecting the
        // results.
        if (iteration.warmup) {
            this._runNextTest();
            return;
        }

        // Collect the results of the time test.
        if (!groupResults) {
            groupResults = results[groupName] = {};
        }

        mean = ((test.duration || DEFAULT_DURATION) / count).toFixed(2);

        result = groupResults[iteration.name] = {
            calls    : count,
            max      : mean,
            mean     : mean,
            median   : mean,
            mediandev: 0.00,
            min      : mean,
            name     : iteration.name,
            points   : [mean],
            stdev    : 0.00,
            variance : 0.00
        };

        this.fire(EVT_RESULT_ADD, {
            group : iteration.group,
            result: result,
            test  : test
        });

        this._set('results', results);
        this._runNextTest();
    }
}, {
    // -- Public Static Constants ----------------------------------------------
    MODE_ITERATION: MODE_ITERATION,
    MODE_TIME     : MODE_TIME,
    NAME          : 'performance',

    // -- Public Static Methods ------------------------------------------------
    addTestGroup: function (config) {
        var suiteName = config.suite || 'Default',
            suite     = suites[suiteName];

        config.name  = config.name || 'Default';
        config.suite = suiteName;

        // Test suites are created on demand.
        if (!suite) {
            suite = suites[suiteName] = {
                id    : Y.guid('suite-'),
                name  : suiteName,
                groups: {}
            };
        }

        // Assign a unique id to each test.
        Obj.each(config.tests, function (test) {
            test.id = Y.guid('test-');
        });

        suite.groups[config.name] = Y.merge(config, {id: Y.guid('group-')});

        return config;
    },

    getTestGroup: function (suiteName, groupName) {
        return suites[suiteName] &&
                suites[suiteName].groups[groupName] || undefined;
    },

    getTestSuite: function (name) {
        return suites[name];
    },

    getTestSuites: function () {
        return Y.mix({}, suites, true); // shallow clone
    },

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Returns an object hash containing the mean, median, sample variance,
     * sample standard deviation, and median absolute deviation of the values in
     * the specified array.
     *
     * @method _analyzePoints
     * @param {Array} values values to analyze
     * @return {Object}
     * @protected
     */
    _analyzePoints: function (values) {
        var i,
            len = values.length,
            max = null,
            mean,
            min = null,
            sum = 0,
            value,
            variance;

        // Find the sum, max, and min.
        i = len;

        while (i--) {
            value = values[i];
            sum += value;

            if (max === null || value > max) {
                max = value;
            }

            if (min === null || value < min) {
                min = value;
            }
        }

        // And the mean.
        mean = sum / len;

        // And the sum of the squared differences of each value from the mean.
        i   = len;
        sum = 0;

        while (i--) {
            sum += Math.pow(values[i] - mean, 2);
        }

        // And finally the sample variance and sample standard deviation.
        variance = sum / (len - 1);

        return {
            max      : max,
            mean     : mean,
            median   : Performance._median(values),
            mediandev: Performance._medianDeviation(values),
            min      : min,
            variance : variance,
            stdev    : Math.sqrt(variance)
        };
    },

    /**
     * Returns the median of the values in the specified array of numbers, or
     * <code>null</code> if the array is empty.
     *
     * @method _median
     * @param {Array} values array of numbers
     * @return {Number|null}
     * @protected
     */
    _median: function (values) {
        // Note: This implementation is naïve and does a full sort before
        // finding the median. If we ever start working with very large arrays,
        // this should be rewritten to use a linear selection algorithm.

        var len    = values.length,
            sorted = [].concat(values), // copy
            middle;

        if (!len) {
            return null;
        }

        sorted.sort(function (a, b) {
          return a > b;
        });

        if (len % 2) { // odd number of items
            return sorted[Math.floor(len / 2)];
        } else { // even number of items
            middle = sorted.splice(len / 2 - 1, 2);
            return (middle[0] + middle[1]) / 2;
        }
    },

    /**
     * Returns the median absolute deviation of the values in the specified
     * array of numbers, or <code>null</code> if the array is empty.
     *
     * @method _medianDeviation
     * @param {Array} values array of numbers
     * @return {Number|null}
     * @protected
     */
    _medianDeviation: function (values) {
        var deviations = [],
            i          = values.length,
            median     = Performance._median(values);

        // Find the absolute deviations from the median of the set.
        while (i--) {
            deviations.push(Math.abs(values[i] - median));
        }

        // The median of the deviations is the median absolute deviation.
        return Performance._median(deviations);
    },

    /**
     * Performs a synchronous XMLHttpRequest GET for the specified URL.
     *
     * @method _xhrGet
     * @param {String} url
     * @return {String|null} response body, or <code>null</code> on error
     * @protected
     */
    _xhrGet: function (url) {
        // Create a local XMLHttpRequest so we can overwrite it later if
        // necessary without affecting the global scope.
        var XMLHttpRequest = Y.config.win.XMLHttpRequest;

        if (Lang.isUndefined(XMLHttpRequest)) {
            XMLHttpRequest = function () {
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP.6.0');
                } catch (ex1) {}

                try {
                    return new ActiveXObject('Msxml2.XMLHTTP.3.0');
                } catch (ex2) {}

                try {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                } catch (ex3) {}

                Y.error("This browser doesn't support XMLHttpRequest.");
            };
        }

        // Redefine _xhrGet to avoid running the XHR feature detection again.
        Performance._xhrGet = function (url) {
            // If the URL is already in the cache, return it.
            if (Obj.owns(xhrCache, url)) {
                return xhrCache[url];
            }

            var xhr = new XMLHttpRequest();

            try {
                // Synchronous request.
                xhr.open('GET', url, false);
                xhr.send(null);
            } catch (ex) {
                Y.log("XMLHttpRequest failed. Make sure you're running on an HTTP server, not the local filesystem.", 'warn', 'performance');
            }

            if (xhr.status >= 200 && xhr.status <= 299) {
                // Cache the response and return it.
                xhrCache[url] = xhr.responseText;
                return xhrCache[url];
            } else {
                return null;
            }
        };

        return Performance._xhrGet(url);
    },

    /**
     * Performs a cross-domain GET request via a YQL proxy. This allows us to
     * preload external resources resources and have full control over when
     * they're parsed and executed. Responses are cached for the life of the
     * pageview.
     *
     * @method _yqlGet
     * @param {String} url url to get
     * @param {Function} callback callback to execute when the response is
     *   received
     * @protected
     */
    _yqlGet: function (url, callback) {
        if (yqlCache[url]) {
            // If this URL is already in the cache, return it.
            callback.call(null, yqlCache[url]);

        } else if (yqlQueue[url]) {
            // If a request for this URL is already queued, add the callback to
            // the original request's callback stack instead of creating a new
            // request.
            yqlQueue[url].push(callback);

        } else {
            // Add this URL and its callback to the request queue and send the
            // request. It'll be removed from the queue when the response
            // arrives.
            yqlQueue[url] = [callback];

            (new Y.yql("use '" + YQL_XDR_DATATABLE + "'; select * from xdr where url = '" + url + "'", function (result) {
                var callback;

                // Cache the result.
                result = result.query.results.result;
                yqlCache[url] = result;

                // Call each callback in this request's stack.
                while (callback = yqlQueue[url].shift()) { // assignment
                    callback.call(null, result);
                }

                // Remove the request from the queue.
                delete yqlQueue[url];
            }));
        }
    }
});

Y.Performance = Performance;

}, '@VERSION@', {
    requires: [
        'base', 'event-custom-base', 'gallery-sandbox', 'gallery-yql', 'later'
    ]
});
