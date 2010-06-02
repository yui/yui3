YUI.add('perf-loops-yui3', function (Y) {

Y.Performance.addTestGroup({
    name   : 'YUI 3 (git)',
    suite  : 'Loop Constructs',
    version: '2010-05-28',

    tests: {
        "Object enumeration (exclude prototype)": {
            asyncSetup  : true,
            bootstrapYUI: true,
            iterations  : 20,

            setup: function () {
                var i          = 10000,
                    testObject = window.testObject = {};

                while (i--) {
                    testObject['key_' + i] = i;
                }

                window.Y = YUI().use(function () {
                    done();
                });
            },

            test: function () {
                var sum = 0;

                Y.Object.each(testObject, function (value) {
                    // Simple arithmetic operation just to prevent an optimizing
                    // JS engine from skipping over the empty loop.
                    sum += value;
                });

                done(sum === 49995000);
            }
        },

        "Object enumeration (include prototype)": {
            asyncSetup  : true,
            bootstrapYUI: true,
            iterations  : 20,

            setup: function () {
                var i          = 10000,
                    testObject = window.testObject = {};

                while (i--) {
                    testObject['key_' + i] = i;
                }

                window.Y = YUI().use(function () {
                    done();
                });
            },

            test: function () {
                var sum = 0;

                Y.Object.each(testObject, function (value) {
                    // Simple arithmetic operation just to prevent an optimizing
                    // JS engine from skipping over the empty loop.
                    sum += value;
                }, null, true);

                done(sum === 49995000);
            }
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
