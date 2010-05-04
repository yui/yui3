// Very rough performance testing tool. Needs more work and a methodology review
// before its results should be trusted against anything other than themselves.
YUI.add('performance', function (Y) {

var Profiler   = Y.Profiler,
    isFunction = Y.Lang.isFunction,

    iterations = Y.UA.ie && Y.UA.ie < 9 ? 20 : 40,
    poll,

// Object hash mapping test names to test objects. A test object may have the
// following properties, of which only the "test" property is required:
//
// bootstrap (Array):
//   Array of YUI modules that should be bootstrapped before the test is
//   executed.
//
// setup (Function):
//   Setup function to execute before each iteration of the test.
//
// teardown (Function):
//   Teardown function to execute after each iteration of the test.
//
// test (Function):
//   The test itself, each iteration of which will be profiled. In order to make
//   async execution testable, the test function needs to set this.done = true
//   when it's completely finished; until this happens, the next test cannot
//   run and the profile timer will keep ticking.
//
PerfTests = {
    "YUI().use()": {
        test: function () {
            var that = this;
            YUI().use(function (Y) {
                that.done = true;
            });
        }
    },

    "YUI().use('anim', 'io', 'json', 'node')": {
        bootstrap: ['anim', 'io', 'json', 'node'],

        test: function () {
            var that = this;
            YUI().use('anim', 'io', 'json', 'node', function (Y) {
                that.done = true;
            });
        }
    },

    "TabView with 3 tabs": {
        bootstrap: ['tabview'],

        teardown: function () {
            Y.one('#container').get('children').remove();
        },

        test: function () {
            var that = this;
            YUI().use('tabview', function(Y) {
                var tabview = new Y.TabView({
                    children: [{
                        label: 'foo',
                        content: '<p>foo content</p>'
                    }, {
                        label: 'bar',
                        content: '<p>bar content</p>'
                    }, {
                        label: 'baz',
                        content: '<p>baz content</p>'
                    }]
                });

                tabview.render('#container');
                that.done = true;
            });
        }
    }
},

Perf = {
    render: function (parent) {
        var report = Profiler.getFullReport(),
            table,
            tbody;

        parent = Y.one(parent);
        table  = Y.Node.create(
            '<table class="yui3-perf-results">' +
                '<thead>' +
                    '<tr>' +
                        '<th class="test">Test</th>' +
                        '<th class="calls">Calls</th>' +
                        '<th class="mean">Mean</th>' +
                        '<th class="median">Median</th>' +
                        '<th class="max">Max</th>' +
                        '<th class="min">Min</th>' +
                        '<th class="mediandev"><abbr title="Median Absolute Deviation">Med. Dev.</abbr></th>' +
                        '<th class="stdev"><abbr title="Standard Deviation">Std. Dev.</abbr></th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot></tfoot>' +
                '<tbody></tbody>' +
            '</table>'
        );

        tbody = table.one('tbody');

        Y.Object.each(report, function (results, name) {
            results = Y.merge(results, analyze(results.points));

            Y.Array.each(['max', 'mean', 'median', 'mediandev', 'min', 'stdev', 'variance'], function (key) {
                results[key] = results[key].toFixed(2);
            });

            tbody.append(Y.substitute(
                '<tr>' +
                    '<td class="test">{name}</td>' +
                    '<td class="calls">{calls}</td>' +
                    '<td class="mean">{mean}</td>' +
                    '<td class="median">{median}</td>' +
                    '<td class="max">{max}</td>' +
                    '<td class="min">{min}</td>' +
                    '<td class="mediandev">±{mediandev}</td>' +
                    '<td class="stdev">±{stdev}</td>' +
                '</tr>',
                Y.merge(results, {name:name})
            ));
        });

        parent.removeClass('loading').setContent('').append(table);
    },

    start: function () {
        var active,
            queue = [],
            runTest;

        Profiler.clear();

        // Queue up as many iterations of each test as are desired.
        Y.Object.each(PerfTests, function (test, name) {
            var i = iterations;

            while (i--) {
                queue.push({name: name, test: test});
            }
        });

        // Processes a single test that has been shifted off the queue.
        runTest = function () {
            active.test.done = false;

            if (active.test.setup) {
                active.test.setup.call(active.test);
            }

            // Profiling is started here and ended in the poll function below
            // when the test function indicates its own completion.
            Profiler.start(active.name);
            active.test.test.call(active.test);
        };

        // This poll function monitors test status and takes care of shifting
        // the next test off the queue when the active test finishes. In good
        // browsers, we use a 0ms interval to ensure that the poll runs as often
        // as possible; in IE, we have to use a 1ms interval or the poll won't
        // actually execute.
        //
        // This is a compromise between profiling accuracy and the ability to
        // reliably test async operations.
        poll = Y.later(Y.UA.ie ? 1 : 0, null, function () {
            if (!active || active.test.done) {
                if (active && active.test.done) {
                    Profiler.stop(active.name);

                    if (active.test.teardown) {
                        active.test.teardown.call(active.test);
                    }
                }

                active = queue.shift();

                if (active) {
                    if (active.test.bootstrap) {
                        bootstrap.call(window, active.test.bootstrap);
                    }

                    runTest();
                } else {
                    poll.cancel();
                    Perf.render('#results');
                }
            }
        }, null, true);
    }
},

// Returns an object hash containing the mean, median, sample variance,
// sample standard deviation, and median absolute deviation of the values in the
// specified array.
analyze = function (set) {
    var i,
        len = set.length,
        mean,
        sum = 0,
        variance;

    // Find the sum.
    for (i = len; i--; sum += set[i]); // no block

    // And the mean.
    mean = sum / len;

    // And the sum of the squared differences of each value from the mean.
    for (i = len, sum = 0; i--; sum += Math.pow(set[i] - mean, 2)); // no block

    // And finally the sample variance and standard deviation.
    variance = sum / (len - 1);

    return {
        mean     : mean,
        median   : median(set),
        mediandev: medianDeviation(set),
        variance : variance,
        stdev    : Math.sqrt(variance)
    };
},

// Bootstraps the specified modules and their dependencies to ensure that module
// load times won't pollute our profiling data.
bootstrap = function (args) {
    var loaded = false;

    args = [].concat(args || []); // ensure copy, not reference

    args.push(function (Y) {
        loaded = true;
    });

    YUI().use.apply(YUI, args);

    while (!loaded) {}
},

// Returns the median of the values in the specified array. This implementation
// is naïve and does a full sort before finding the median; if we ever start
// working with very large arrays, this should be rewritten to use a linear
// selection algorithm.
median = function (set) {
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
},

// Returns the median absolute deviation of the values in the specified array.
medianDeviation = function (set) {
    var deviations = [],
        i,
        setMedian  = median(set);

    // Find the absolute deviations from the median of the set.
    for (i = set.length; i--; deviations.push(Math.abs(set[i] - setMedian))); // no block

    // The median of the deviations is the median absolute deviation.
    return median(deviations);
};

Y.Performance = Perf;

}, '1.0.0', {
    requires: ['later', 'node', 'profiler', 'substitute']
});
