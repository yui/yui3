var suite = new PerfSuite({
    name: 'Y.soon performance tests',
    yui: {
        use: ['timers']
    },
    tests: [
        {
            name: 'Single soon() call',
            fn: function (deferred) {
                Y.soon(function () {
                    deferred.resolve();
                });
            }
        },
        {
            name: 'Parallel soon() calls',
            fn: function (deferred) {
                var count = 0,
                    i = 1,
                    times = 100;

                function step() {
                    count++;
                    if (count === times) {
                        deferred.resolve();
                    }
                }

                for (; i <= times; i++) {
                    Y.soon(step);
                }
            }
        },
        {
            name: 'Serial soon() calls',
            fn: function (deferred) {
                var i = 0;

                function step() {
                    i++;

                    if (i === 100) {
                        deferred.resolve();
                        return;
                    }

                    Y.soon(step);
                }
                step();
            }
        }
    ]
});
