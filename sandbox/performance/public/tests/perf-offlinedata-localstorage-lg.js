YUI.add('perf-localstorage-lg', function (Y) {

var ITERATIONS = 10,
    USESTRICTSANDBOX = false;

function clearCache() {
    var store = window.localStorage;
    if(store) {
        if(store.clear) {
            store.clear();
        }
        else {
            for (var key in store) {
                if (store.hasOwnProperty(key)) {
                    store.removeItem(key);
                    delete store[key];
                }
            }
        }
    }
}

Y.Performance.addTestGroup({
    name   : 'localStorage',
    suite  : 'Offline Data (>1MB)',
    version: '2010-06-18',

    tests: {
        "Read 1MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-1MB.js');

                if (!data) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                eval(data);
                
                if (!window.string) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                window.localStorage.setItem("1MB-read", window.string);
            },

            test: function () {
                window.localStorage.getItem("1MB-read");
                done();
            },

            teardown: clearCache
        },

        "Write 1MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-1MB.js');

                if (!data) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                eval(data);

                if (!window.string) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
            },

            test: function () {
                window.localStorage.setItem("1MB-write", window.string);
                done();
            },

            teardown: clearCache
        },

        "Read 2MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-2MB.js');

                if (!data) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                eval(data);

                if (!window.string) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                window.localStorage.setItem("2MB-read", window.string);
            },

            test: function () {
                window.localStorage.getItem("2MB-read");
                done();
            },

            teardown: clearCache
        },

        "Write 2MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-2MB.js');

                if (!data) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                eval(data);

                if (!window.string) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
            },

            test: function () {
                window.localStorage.setItem("2MB-write", window.string);
                done();
            },

            teardown: clearCache
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
