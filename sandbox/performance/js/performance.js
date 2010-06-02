YUI.add('performance', function (Y) {

var Lang       = Y.Lang,
    Obj        = Y.Object,
    Perf,

    isFunction = Lang.isFunction,
    isValue    = Lang.isValue,

    CHART_URL         = 'http://chart.apis.google.com/chart?',
    DEFAULT_DURATION  = 1000, // default duration for time-based tests
    YQL_XDR_DATATABLE = 'http://yuilibrary.com/~rgrove/test/yui3/sandbox/performance/assets/xdr.xml',

    EVT_FINISH = 'finish',
    EVT_START  = 'start',
    EVT_STOP   = 'stop',

    xhrCache   = {},
    yqlCache   = {},
    yqlQueue   = {};

Perf = Y.Performance = {
    // -- Public Constants -----------------------------------------------------
    MODE_ITERATION: 1,
    MODE_TIME     : 2, // not yet fully baked

    // -- Protected Properties -------------------------------------------------
    _mode     : 1,
    _queue    : [],
    _results  : {},
    _sandboxes: [],
    _suites   : {},

    // -- Public Methods -------------------------------------------------------
    addTestGroup: function (config) {
        var suiteName = config.suite || 'Default',
            suite     = Perf._suites[suiteName];

        // Test suites are created on demand.
        if (!suite) {
            suite = Perf._suites[suiteName] = {
                name  : suiteName,
                groups: {}
            };
        }

        return (suite.groups[config.name || 'Default'] = config);
    },

    clearResults: function () {
        Perf._results = {};

        // TODO: move this to a renderer.
        if (Perf._table) {
            Perf._table.one('tbody').get('children').remove();
        }
    },

    getTestGroup: function (suiteName, groupName) {
        return Perf._suites[suiteName] &&
                Perf._suites[suiteName].groups[groupName] || undefined;
    },

    getTestSuite: function (name) {
        return Perf._suites[name];
    },

    getTestSuites: function () {
        return Y.mix({}, Perf._suites, true); // shallow clone
    },

    render: function (parent) {
        parent = Y.one(parent || Y.config.doc.body);
        parent.append(Perf._table = Y.Node.create(
            '<table class="yui3-perf-results">' +
                '<thead>' +
                    '<tr>' +
                        '<th class="group">Group</th>' +
                        '<th class="test">Test</th>' +
                        '<th class="calls">Calls</th>' +
                        '<th class="failures">Failures</th>' +
                        '<th class="mean">Mean</th>' +
                        '<th class="median">Median</th>' +
                        '<th class="mediandev"><abbr title="Median Absolute Deviation">Med. Dev.</abbr></th>' +
                        '<th class="stdev"><abbr title="Sample Standard Deviation">Std. Dev.</abbr></th>' +
                        '<th class="max">Max</th>' +
                        '<th class="min">Min</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot><tr><td colspan="10"></td></tr></tfoot>' +
                '<tbody>' +
                    '<tr>' +
                        '<td colspan="10">' +
                            '<p>Click the button to gather results.</p>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>'
        ));

        Perf._table.delegate('click', Perf._onTestClick, 'tbody tr.test');
    },

    /**
     * Starts running the specified test suite.
     *
     * @method start
     * @param {String} suiteName test suite to run
     */
    start: function (suiteName) {
        if (Perf._queue.length) {
            Y.log('Performance tests are already running.', 'warn', 'performance');
            return;
        }

        var suite = Perf.getTestSuite(suiteName);

        if (!suite) {
            Y.log("There's no test suite named '" + suiteName + "'.", 'error', 'performance');
            return;
        }

        Perf.clearResults();

        // TODO: move this into a renderer.
        if (Perf._table) {
            Perf._table.addClass('running');
        }

        Perf.fire(EVT_START);

        // Queue up all the tests from each group.
        Obj.each(suite.groups, function (group) {
            Obj.each(group.tests, function (test, testName) {
                Perf._queueTest(test, testName, group);
            });
        });

        this._runNextTest();
    },

    stop: function () {
        Perf._queue = [];
        Perf.fire(EVT_STOP);
    },

    // -- Protected Methods ----------------------------------------------------

    // Returns an object hash containing the mean, median, sample variance,
    // sample standard deviation, and median absolute deviation of the values in the
    // specified array.
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
            median   : Perf._median(values),
            mediandev: Perf._medianDeviation(values),
            min      : min,
            variance : variance,
            stdev    : Math.sqrt(variance)
        };
    },

    // Creates a query string based on the specified object of name/value params.
    _createQueryString: function (params) {
        var _params = [];

        Obj.each(params, function (value, key) {
            if (isValue(value)) {
                _params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
        });

        return _params.join('&amp;');
    },

    _finish: function () {
        var sandbox;

        while (sandbox = Perf._sandboxes.pop()) { // assignment
            sandbox.destroy();
        }

        // TODO: move this into a renderer
        if (Perf._table) {
            Perf._table.removeClass('running');
        }

        Perf.fire(EVT_FINISH);
    },

    _htmlEntities: function (string) {
        return string.replace(/&/g, '&amp;').
                      replace(/</g, '&lt;').
                      replace(/>/g, '&gt;').
                      replace(/"/g, '&quot;');
    },

    // Returns the median of the values in the specified array. This implementation
    // is naïve and does a full sort before finding the median; if we ever start
    // working with very large arrays, this should be rewritten to use a linear
    // selection algorithm.
    _median: function (values) {
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

    // Returns the median absolute deviation of the values in the specified array.
    _medianDeviation: function (values) {
        var deviations = [],
            i          = values.length,
            median     = Perf._median(values);

        // Find the absolute deviations from the median of the set.
        while (i--) {
            deviations.push(Math.abs(values[i] - median));
        }

        // The median of the deviations is the median absolute deviation.
        return Perf._median(deviations);
    },

    _queueTest: function (test, name, group) {
        var i = Perf._mode === Perf.MODE_ITERATION ? test.iterations || 1 : 1,
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
                Perf._sandboxes.push(sandbox = new Y.Sandbox({
                    bootstrapYUI: test.bootstrapYUI,
                    waitFor     : test.preloadUrls && 'preload'
                }));

                sandbox.setEnvValue('xhrGet', Perf._xhrGet);

                if (test.preloadUrls) {
                    Obj.each(test.preloadUrls, function (url, key) {
                        Perf._yqlGet(url, function (result) {
                            preload[key] = result.response.body;
                        });
                    });

                    poll = Y.later(Y.config.pollInterval || 15, this, function (sandbox) { // note the local sandbox reference being passed in
                        if (Obj.size(preload) === Obj.size(test.preloadUrls)) {
                            poll.cancel();
                            sandbox.setEnvValue('preload', preload);
                        }
                    }, sandbox, true);
                }
            }

            // Push the test and its sandbox onto the queue.
            Perf._queue.push({
                group    : group,
                name     : name,
                sandbox  : sandbox,
                test     : test,
                warmup   : test.warmup && !(test.warmup = false) // intentional assignment, sets warmup to false for future iterations
            });
        };

        while (i--) {
            push();
        }
    },

    _renderTestResult: function (result, test, group) {
        var chartParams = {
                cht: 'ls',
                chd: 't:' + result.points.join(','),
                chf: 'bg,s,00000000', // transparent background
                chs: '100x20'
            };

        Perf._table.one('tbody').append(Y.substitute(
            '<tr class="{classNames test}">' +
                '<td class="group">{groupName}</td>' +
                '<td class="test"><div class="bd">{name} <img src="{chartUrl}" style="height:20px;width:100px" alt="Sparkline chart illustrating execution times."></div></td>' +
                '<td class="calls">{calls}</td>' +
                '<td class="failures">{failures}</td>' +
                '<td class="mean">{mean}</td>' +
                '<td class="median">{median}</td>' +
                '<td class="mediandev">{mediandev}</td>' +
                '<td class="stdev">{stdev}</td>' +
                '<td class="max">{max}</td>' +
                '<td class="min">{min}</td>' +
            '</tr>' +
            '<tr class="code hidden">' +
                '<td colspan="10">' +
                    '<pre><code>{code}</code></pre>' +
                '</td>' +
            '</tr>',

            Y.merge(result, {
                chartUrl : CHART_URL + Perf._createQueryString(chartParams),
                code     : Perf._htmlEntities(test.test.toString()),
                groupName: Perf._htmlEntities(group.name || 'Default'),
                mediandev: result.mediandev !== '' ? '±' + result.mediandev : '',
                name     : Perf._htmlEntities(result.name),
                stdev    : result.stdev !== '' ? '±' + result.stdev : ''
            }),

            function (key, value, meta) {
                if (key === 'classNames') {
                    return meta + (result.failures ? ' fail' : '');
                }

                return value;
            }
        ));
    },

    _runNextTest: function (pending) {
        var iteration = pending || Perf._queue.shift(),
            test      = iteration && iteration.test;

        // If no pending iteration was passed in and the queue was empty, we're
        // done running tests.
        if (!iteration) {
            Perf._finish();
            return;
        }

        // Wait for this iteration's sandbox to be ready, then set up and run
        // the test. If the sandbox is already ready, the callback will execute
        // immediately.
        iteration.sandbox.on('ready', function () {
            var count;

            // Run the setup function if there is one and if it hasn't already
            // been run for this iteration.
            if (!iteration.setupDone && isFunction(test.setup)) {
                if (test.asyncSetup) {
                    // The setup function is asynchronous, so we'll pause the
                    // iteration while it runs, then restart the iteration once
                    // the setup function finishes successfully.
                    iteration.sandbox.run(test.setup, function (result) {
                        if (result === false) {
                            // Setup function returned false, so abort the test.
                            Y.log('Test "' + iteration.name + '" failed.', 'warn', 'performance');
                            Perf._runNextTest();
                        } else {
                            // Restart the iteration.
                            iteration.setupDone = true;
                            Perf._runNextTest(iteration);
                        }
                    });

                    return;

                } else if (iteration.sandbox.run(test.setup) === false) {
                    // Setup function returned false, so abort the test.
                    Y.log('Test "' + iteration.name + '" failed.', 'warn', 'performance');
                    Perf._runNextTest();
                    return;
                }
            }

            if (Perf._mode === Perf.MODE_ITERATION) {
                // In iteration mode, we time the execution of each individual
                // iteration. This is the default mode.
                iteration.sandbox.profile(test.test, function (profileData) {
                    Perf._onIterationComplete(iteration, profileData);
                });

            } else if (Perf._mode === Perf.MODE_TIME) {
                // In time mode, we run as many iterations as we can within the
                // specified duration rather than profiling each iteration. For
                // some tests, this can be a more accurate way of arriving at
                // consistent benchmark results.
                //
                // This is wrapped in a setTimeout to allow some breathing room
                // between tests and allow other UI events to be processed.
                setTimeout(function () {
                    count = iteration.sandbox.count(test.test,
                                test.duration || DEFAULT_DURATION);

                    Perf._onTimeComplete(iteration, count);
                }, 100);
            }
        });
    },

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
        Perf._xhrGet = function (url) {
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

        return Perf._xhrGet(url);
    },

    // Cross-domain request proxied via YQL. Allows us to preload external JS
    // resources and have full control over when they're parsed and executed.
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
    },

    // -- Protected Callbacks & Event Handlers ---------------------------------
    _onIterationComplete: function (iteration, profileData) {
        var groupName    = iteration.group.name,
            groupResults = Perf._results[groupName],
            result,
            test         = iteration.test;

        // If the test has a teardown function, run it.
        if (isFunction(test.teardown)) {
            iteration.sandbox.run(test.teardown);
        }

        // Destroy the sandbox unless we need to reuse it for another iteration.
        if (test.useStrictSandbox) {
            iteration.sandbox.destroy();
        }

        // If this was a warmup iteration, continue without collecting the
        // results.
        if (iteration.warmup) {
            Perf._runNextTest();
            return;
        }

        // Collect the results of the iteration.
        if (!groupResults) {
            groupResults = Perf._results[groupName] = {};
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
            result = Y.merge(result, Perf._analyzePoints(result.points));

            Y.Array.each(['max', 'mean', 'median', 'mediandev', 'min', 'stdev', 'variance'], function (key) {
                result[key] = isValue(result[key]) ? result[key].toFixed(2) : '';
            });

            Perf._renderTestResult(result, test, iteration.group);
        }

        groupResults[iteration.name] = result;
        Perf._runNextTest();
    },

    _onTestClick: function (e) {
        // TODO: move this to a renderer.
        var code = e.currentTarget.next('tr.code');
        code.toggleClass('hidden');
    },

    _onTimeComplete: function (iteration, count) {
        var groupName    = iteration.group.name,
            groupResults = Perf._results[groupName],
            mean,
            result,
            test         = iteration.test;

        // If the test has a teardown function, run it.
        if (isFunction(test.teardown)) {
            iteration.sandbox.run(test.teardown);
        }

        // Destroy the sandbox unless we need to reuse it for another iteration.
        if (test.useStrictSandbox) {
            iteration.sandbox.destroy();
        }

        // If this was a warmup iteration, continue without collecting the
        // results.
        if (iteration.warmup) {
            Perf._runNextTest();
            return;
        }

        // Collect the results of the time test.
        if (!groupResults) {
            groupResults = Perf._results[groupName] = {};
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

        Perf._renderTestResult(result, test);
        Perf._runNextTest();
    }
};

Y.augment(Perf, Y.EventTarget);

}, '@VERSION@', {
    requires: [
        'event-custom-base', 'gallery-sandbox', 'gallery-yql', 'later', 'node',
        'substitute'
    ]
});
