var testModules = {
    "io-urls": {
        "fullpath": "./urls.js",
        "requires": [ "io-base" ]
    },
    "header-tests": {
        "fullpath": "./js/header-tests.js",
        "requires": ["io-base", "test"]
    },
    "requests-tests": {
        "fullpath": "./js/requests-tests.js",
        "requires": ["io-base", "test"]
    },
    "instances-tests": {
        "fullpath": "./js/instances-tests.js",
        "requires": ["io-base", "test"]
    },
    "events-tests": {
        "fullpath": "./js/events-tests.js",
        "requires": ["io-base", "test"]
    },
    "globalevents-tests": {
        "fullpath": "./js/globalevents-tests.js",
        "requires": ["io-base", "test"]
    },
    "timeout-tests": {
        "fullpath": "./js/timeout-tests.js",
        "requires": ["io-base", "test"]
    },
    "facades-tests": {
        "fullpath": "./js/facades-tests.js",
        "requires": ["io-base", "test"]
    },
    "transport-tests": {
        "fullpath": "./js/transport-tests.js",
        "requires": ["io-xdr", "test"]
    }
};

if (typeof exports !== 'undefined') {
    module.exports = testModules;
    delete testModules['transport-tests']; //Remove non Nodejs Tests
}
