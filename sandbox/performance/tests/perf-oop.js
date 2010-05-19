YUI.add('perf-oop', function (Y) {

Y.Performance.addTestSuite('OOP Tests', {
    "Y.each() on a big object": {
        asyncSetup: true,
        bootstrapYUI: true,
        duration: 500,
        iterations: 40,

        setup: function () {
            window.Y = YUI().use('oop', function (Y) {
                var i, testObject = window.testObject = {};

                for (i = 0; i < 10000; ++i) {
                    testObject[Y.guid()] = i;
                }

                done();
            });
        },

        test: function () {
            Y.each(testObject, function (value, key) {});
            done();
        }
    },

    "for (foo in bar) on a big object": {
        asyncSetup: true,
        bootstrapYUI: true,
        duration: 500,
        iterations: 40,

        setup: function () {
            window.Y = YUI().use('oop', function (Y) {
                var i, testObject = window.testObject = {};

                for (i = 0; i < 10000; ++i) {
                    testObject[Y.guid()] = i;
                }

                done();
            });
        },

        test: function () {
            var key;

            for (key in testObject) {
                // noop
            }

            done();
        }
    },

    "for (foo in bar) + hasOwnProperty on a big object": {
        asyncSetup: true,
        bootstrapYUI: true,
        duration: 500,
        iterations: 40,

        setup: function () {
            window.Y = YUI().use('oop', function (Y) {
                var i, testObject = window.testObject = {};

                for (i = 0; i < 10000; ++i) {
                    testObject[Y.guid()] = i;
                }

                done();
            });
        },

        test: function () {
            var key;

            for (key in testObject) {
                if (testObject.hasOwnProperty(key)) {
                    // noop
                }
            }

            done();
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
