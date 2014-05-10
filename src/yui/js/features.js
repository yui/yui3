var feature_tests = {};

/**
Contains the core of YUI's feature test architecture.
@module features
*/

/**
* Feature detection
* @class Features
* @static
*/

Y.mix(Y.namespace('Features'), {

    /**
    * Object hash of all registered feature tests
    * @property tests
    * @type Object
    */
    tests: feature_tests,

    /**
    * Add a test to the system
    *
    *   ```
    *   Y.Features.add("load", "1", {});
    *   ```
    *
    * @method add
    * @param {String} cat The category, right now only 'load' is supported
    * @param {String} name The number sequence of the test, how it's reported in the URL or config: 1, 2, 3
    * @param {Object} o Object containing test properties
    * @param {String} o.name The name of the test
    * @param {Function} o.test The test function to execute, the only argument to the function is the `Y` instance
    * @param {String} o.trigger The module that triggers this test.
    */
    add: function(cat, name, o) {
        feature_tests[cat] = feature_tests[cat] || {};
        feature_tests[cat][name] = o;
    },
    /**
    * Execute all tests of a given category and return the serialized results
    *
    *   ```
    *   caps=1:1;2:1;3:0
    *   ```
    * @method all
    * @param {String} cat The category to execute
    * @param {Array} args The arguments to pass to the test function
    * @return {String} A semi-colon separated string of tests and their success/failure: 1:1;2:1;3:0
    */
    all: function(cat, args) {
        var cat_o = feature_tests[cat],
            // results = {};
            result = [];
        if (cat_o) {
            Y.Object.each(cat_o, function(v, k) {
                result.push(k + ':' + (Y.Features.test(cat, k, args) ? 1 : 0));
            });
        }

        return (result.length) ? result.join(';') : '';
    },
    /**
    * Run a specific test and return a Boolean response.
    *
    *   ```
    *   Y.Features.test("load", "1");
    *   ```
    *
    * @method test
    * @param {String} cat The category of the test to run
    * @param {String} name The name of the test to run
    * @param {Array} args The arguments to pass to the test function
    * @return {Boolean} True or false if the test passed/failed.
    */
    test: function(cat, name, args) {
        args = args || [];
        var result, ua, test,
            cat_o = feature_tests[cat],
            feature = cat_o && cat_o[name];

        if (!feature) {
            Y.log('Feature test ' + cat + ', ' + name + ' not found');
        } else {

            result = feature.result;

            if (Y.Lang.isUndefined(result)) {

                ua = feature.ua;
                if (ua) {
                    result = (Y.UA[ua]);
                }

                test = feature.test;
                if (test && ((!ua) || result)) {
                    result = test.apply(Y, args);
                }

                feature.result = result;
            }
        }

        return result;
    }
});

// Y.Features.add("load", "1", {});
// Y.Features.test("load", "1");
// caps=1:1;2:0;3:1;

