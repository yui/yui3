// Very rough performance testing tool. Needs more work and a methodology review
// before its results should be trusted against anything other than themselves.
YUI.add('performance', function (Y) {

var Node       = Y.Node,
    Obj        = Y.Object,
    Perf,

    isFunction = Y.Lang.isFunction,
    yqlCache   = {},
    yqlQueue   = {},

    CHART_URL         = 'http://chart.apis.google.com/chart?',
    DEFAULT_DURATION  = 1000, // default duration for time-based tests
    YQL_XDR_DATATABLE = 'http://pieisgood.org/test/yui/yui3/sandbox/performance/assets/xdr.xml';

// -- Private Methods ----------------------------------------------------------

// Returns an object hash containing the mean, median, sample variance,
// sample standard deviation, and median absolute deviation of the values in the
// specified array.
function analyze(set) {
    var i,
        len = set.length,
        max = null,
        mean,
        min = null,
        sum = 0,
        value,
        variance;

    // Find the sum, max, and min.
    i = len;

    while (i--) {
        value = set[i];
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
        sum += Math.pow(set[i] - mean, 2);
    }

    // And finally the sample variance and sample standard deviation.
    variance = sum / (len - 1);

    return {
        max      : max,
        mean     : mean,
        median   : median(set),
        mediandev: medianDeviation(set),
        min      : min,
        variance : variance,
        stdev    : Math.sqrt(variance)
    };
}

// Creates a query string based on the specified object of name/value params.
function createQueryString(params) {
    var _params = [];

    Y.Object.each(params, function (value, key) {
        if (Y.Lang.isValue(value)) {
            _params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
    });

    return _params.join('&amp;');
}

function htmlentities(string) {
    return string.replace(/&/g, '&amp;').
                  replace(/</g, '&lt;').
                  replace(/>/g, '&gt;').
                  replace(/"/g, '&quot;');
}

// Returns the median of the values in the specified array. This implementation
// is naïve and does a full sort before finding the median; if we ever start
// working with very large arrays, this should be rewritten to use a linear
// selection algorithm.
function median(set) {
    var len    = set.length,
        sorted = [].concat(set), // copy
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
}

// Returns the median absolute deviation of the values in the specified array.
function medianDeviation(set) {
    var deviations = [],
        i          = set.length,
        setMedian  = median(set);

    // Find the absolute deviations from the median of the set.
    while (i--) {
        deviations.push(Math.abs(set[i] - setMedian));
    }

    // The median of the deviations is the median absolute deviation.
    return median(deviations);
}

// Cross-domain request proxied via YQL. Allows us to preload external JS
// resources and have full control over when they're parsed and executed.
function xdrGet(url, callback) {
    if (yqlCache[url]) {
        callback.call(Y.config.win, yqlCache[url]);
    } else if (yqlQueue[url]) {
        yqlQueue[url].push(callback);
    } else {
        yqlQueue[url] = [callback];

        new Y.yql("use '" + YQL_XDR_DATATABLE + "'; select * from xdr where url = '" + url + "'", function (result) {
            var callback;

            result = result.query.results.result;
            yqlCache[url] = result;

            while (callback = yqlQueue[url].shift()) {
                callback.call(Y.config.win, result);
            }

            delete yqlQueue[url];
        });
    }
}

function xhrGet(url) {
    if (typeof XMLHttpRequest === 'undefined') {
        Y.config.win.XMLHttpRequest = function () {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP.6.0');
            } catch (ex) {}

            try {
                return new ActiveXObject('Msxml2.XMLHTTP.3.0');
            } catch (ex) {}

            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch (ex) {}

            Y.error('This browser does not support XMLHttpRequest.');
        };
    }

    var xhr = new XMLHttpRequest();

    try {
        xhr.open('GET', url, false);
        xhr.send(null);
    } catch (ex) {
        Y.log("XMLHttpRequest failed. Make sure you're running these tests on an HTTP server, not the filesystem.", 'warn', 'performance');
    }

    return xhr.status === 200 ? xhr.responseText : null;
}

Perf = Y.Performance = {
    // -- Public Constants -----------------------------------------------------
    MODE_ITERATION: 1,
    MODE_TIME     : 2, // not yet fully-baked

    // -- Protected Properties -------------------------------------------------
    _mode     : 1,
    _queue    : [],
    _results  : {},
    _sandboxes: [],
    _tests    : {},

    // -- Public Methods -------------------------------------------------------
    addTests: function (tests) {
        // Give each test a unique id and add it to _tests.
        Obj.each(tests, function (test, name) {
            Perf._tests[name] = test;
            Perf._tests[name]._id = Y.guid('perf-');
        });
    },

    clear: function () {
        Perf._results = {};

        if (Perf._table) {
            Perf._table.one('tbody').get('children').remove();
        }
    },

    render: function (parent) {
        parent = Y.one(parent || Y.config.doc.body);
        parent.append(Perf._table = Y.Node.create(
            '<table class="yui3-perf-results">' +
                '<thead>' +
                    '<tr>' +
                        '<th class="test">Test</th>' +
                        '<th class="calls">Calls</th>' +
                        '<th class="mean">Mean</th>' +
                        '<th class="median">Median</th>' +
                        '<th class="mediandev"><abbr title="Median Absolute Deviation">Med. Dev.</abbr></th>' +
                        '<th class="stdev"><abbr title="Sample Standard Deviation">Std. Dev.</abbr></th>' +
                        '<th class="max">Max</th>' +
                        '<th class="min">Min</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot><tr><td colspan="8"></td></tr></tfoot>' +
                '<tbody>' +
                    '<tr>' +
                        '<td colspan="8">' +
                            '<p>Click the button to gather results.</p>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>'
        ));

        Perf._table.delegate('click', Perf._onTestClick, 'tbody tr.test');
    },

    start: function () {
        if (Perf._queue.length) {
            Y.log('Performance tests are already running.', 'warn', 'performance');
            return;
        }

        Perf.clear();

        if (Perf._table) {
            Perf._table.addClass('running');
        }

        Obj.each(Perf._tests, Perf._queueTest);
        this._runNextTest();
    },

    stop: function () {
        Perf._queue = [];
    },

    // -- Protected Methods ----------------------------------------------------
    _finish: function () {
        var sandbox;

        while (sandbox = Perf._sandboxes.pop()) { // assignment
            sandbox.destroy();
        }

        if (Perf._table) {
            Perf._table.removeClass('running');
        }
    },

    _queueTest: function (test, name) {
        var i = Perf._mode === Perf.MODE_ITERATION ? test.iterations || 1 : 1,
            push,
            sandbox;

        if (test.warmup) {
            i += 1;
        }

        push = function () {
            // Yeah, I know, this is wanton closure abuse. Deal with it.
            var poll,
                preload = {};

            // Use one sandbox for all iterations of a given test unless the
            // useStrictSandbox option is true.
            if (test.useStrictSandbox || !sandbox) {
                Perf._sandboxes.push(sandbox = new Y.Sandbox({
                    bootstrapYUI: test.bootstrapYUI,
                    waitFor     : test.preloadUrls && 'preload'
                }));

                sandbox.setEnvValue('xhrGet', xhrGet);

                if (test.preloadUrls) {
                    Y.Object.each(test.preloadUrls, function (url, key) {
                        xdrGet(url, function (result) {
                            preload[key] = result.response.body;
                        });
                    });

                    poll = Y.later(Y.config.pollInterval || 15, this, function (sandbox) { // note the local sandbox reference being passed in
                        if (Y.Object.size(preload) === Y.Object.size(test.preloadUrls)) {
                            poll.cancel();
                            sandbox.setEnvValue('preload', preload);
                        }
                    }, sandbox, true);
                }
            }

            Perf._queue.push({
                name   : name,
                sandbox: sandbox,
                test   : test,
                warmup : test.warmup && !(test.warmup = false) // intentional assignment, sets warmup to false for future iterations
            });
        };

        while (i--) {
            push();
        }
    },

    _renderTestResult: function (result, test) {
        var chartParams = {
                cht: 'ls',
                chd: 't:' + result.points.join(','),
                chf: 'bg,s,00000000', // transparent background
                chs: '100x20'
            };

        Perf._table.one('tbody').append(Y.substitute(
            '<tr class="test">' +
                '<td class="test">{name} <img src="{chartUrl}" style="height:20px;width:100px" alt="Sparkline chart illustrating execution times."></td>' +
                '<td class="calls">{calls}</td>' +
                '<td class="mean">{mean}</td>' +
                '<td class="median">{median}</td>' +
                '<td class="mediandev">±{mediandev}</td>' +
                '<td class="stdev">±{stdev}</td>' +
                '<td class="max">{max}</td>' +
                '<td class="min">{min}</td>' +
            '</tr>' +
            '<tr class="code hidden">' +
                '<td colspan="8">' +
                    '<pre><code>' +
                        htmlentities(test.test.toString()) +
                    '</code></pre>' +
                '</td>' +
            '</tr>',

            Y.merge(result, {chartUrl: CHART_URL + createQueryString(chartParams)})
        ));
    },

    _runNextTest: function () {
        var iteration = Perf._queue.shift(),
            test      = iteration && iteration.test;

        if (!iteration) {
            Perf._finish();
            return;
        }

        iteration.sandbox.on('ready', function () {
            var count;

            if (isFunction(test.setup)) {
                if (iteration.sandbox.run(test.setup) === false) {
                    // Setup function returned false, so abort the test.
                    Y.log('Test "' + iteration.name + '" failed.', 'warn', 'performance');
                    Perf._runNextTest();
                    return;
                }
            }

            if (Perf._mode === Perf.MODE_ITERATION) {
                iteration.sandbox.profile(test.test, function (profileData) {
                    Perf._onIterationComplete(iteration, profileData);
                });
            } else if (Perf._mode === Perf.MODE_TIME) {
                setTimeout(function () {
                    count = iteration.sandbox.count(test.test,
                                test.duration || DEFAULT_DURATION);

                    Perf._onTimeComplete(iteration, count);
                }, 100);
            }
        });
    },

    // -- Protected Callbacks & Event Handlers ---------------------------------
    _onIterationComplete: function (iteration, profileData) {
        var result,
            test = iteration.test;

        if (isFunction(test.teardown)) {
            iteration.sandbox.run(test.teardown);
        }

        if (!iteration.warmup) {
            result = Perf._results[iteration.name] || {
                calls : 0,
                name  : iteration.name,
                points: []
            };

            result.calls += 1;
            result.points.push(profileData.duration);

            if (result.calls === iteration.test.iterations) {
                result = Y.merge(result, analyze(result.points));

                Y.Array.each(['max', 'mean', 'median', 'mediandev', 'min', 'stdev', 'variance'], function (key) {
                    result[key] = result[key].toFixed(2);
                });

                Perf._renderTestResult(result, test);
            }

            Perf._results[iteration.name] = result;
        }

        if (test.useStrictSandbox) {
            iteration.sandbox.destroy();
        }

        Perf._runNextTest();
    },

    _onTestClick: function (e) {
        var code = e.currentTarget.next('tr.code');

        code.toggleClass('hidden');
    },

    _onTimeComplete: function (iteration, count) {
        var mean,
            result,
            test = iteration.test;

        if (isFunction(test.teardown)) {
            iteration.sandbox.run(test.teardown);
        }

        if (!iteration.warmup) {
            mean = ((test.duration || DEFAULT_DURATION) / count).toFixed(2);

            result = Perf._results[iteration.name] = {
                calls : count,
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
        }

        if (test.useStrictSandbox) {
            iteration.sandbox.destroy();
        }

        Perf._runNextTest();
    }
};

}, '@VERSION@', {
    requires: ['gallery-sandbox', 'gallery-yql', 'later', 'node', 'substitute']
});
