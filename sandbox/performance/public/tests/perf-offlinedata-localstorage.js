YUI.add('perf-localstorage', function (Y) {

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
    suite  : 'Offline Data',
    version: '2010-06-18',

    tests: {
        "Read 512b string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-512b.js');

                if (!data) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                eval(data);

                if (!window.string) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                window.localStorage.setItem("512b-read", window.string);
            },

            test: function () {
                window.localStorage.getItem("512b-read");
                done();
            },

            teardown: clearCache
        },

        "Write 512b string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-512b.js');

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
                window.localStorage.setItem("512b-write", window.string);
                done();
            },

            teardown: clearCache
        },

        "Read 5KB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-5KB.js');

                if (!data) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                eval(data);

                if (!window.string) {
                    sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                    return false;
                }
                window.localStorage.setItem("5KB-read", window.string);
            },

            test: function () {
                window.localStorage.getItem("5KB-read");
                done();
            },

            teardown: clearCache
        },

        "Write 5KB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,

            setup: function() {
                var data = sandbox.xhrGet('tests/offlinedata-assets/string-5KB.js');

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
                window.localStorage.setItem("5KB-write", window.string);
                done();
            },

            teardown: clearCache
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
