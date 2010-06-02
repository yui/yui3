YUI.add('perf-loops-native', function (Y) {

Y.Performance.addTestGroup({
    name   : 'Native',
    suite  : 'Loop Constructs',
    version: '2010-05-28',

    tests: {
        "Object enumeration (exclude prototype)": {
            iterations: 20,

            setup: function () {
                var i          = 10000,
                    testObject = window.testObject = {};

                while (i--) {
                    testObject['key_' + i] = i;
                }
            },

            test: function () {
                var key, sum = 0;

                for (key in testObject) {
                    // The first two checks here could be done outside the loop,
                    // but then there's a potential for failure if the object or
                    // the hasOwnProperty method are modified during the loop.
                    if (testObject && testObject.hasOwnProperty && testObject.hasOwnProperty(key)) {
                        // Simple arithmetic operation just to prevent an
                        // optimizing JS engine from skipping over the empty
                        // loop.
                        sum += testObject[key];
                    }
                }

                done(sum === 49995000);
            }
        },

        "Object enumeration (include prototype)": {
            iterations: 20,

            setup: function () {
                var i          = 10000,
                    testObject = window.testObject = {};

                while (i--) {
                    testObject['key_' + i] = i;
                }
            },

            test: function () {
                var key, sum = 0;

                for (key in testObject) {
                    // Simple arithmetic operation just to prevent an optimizing
                    // JS engine from skipping over the empty loop.
                    sum += testObject[key];
                }

                done(sum === 49995000);
            }
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
