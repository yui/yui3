YUI.add('perf-instantiation-yui3-3.1.1', function (Y) {

Y.Performance.addTestGroup({
    name   : 'YUI3 (3.1.1)',
    suite  : 'Instantiation Tests',
    version: '2010-06-10',

    tests: {
        "yui-min.js + loader-min.js parsing/execution": {
            duration: 500,
            iterations: 10,

            // Run each iteration in a new sandbox.
            useStrictSandbox: true,

            setup: function () {
                var js = sandbox.xhrGet('/combo/yui3-3.1.1?build/yui/yui-min.js&build/loader/loader-min.js');

                if (js) {
                    window.yuiScript = js;
                } else {
                    sandbox.log('Failed to load JS.', 'warn', 'sandbox');
                    return false;
                }
            },

            test: function () {
                eval(yuiScript);
                done();
            }
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
