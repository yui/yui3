YUI.add('perf-instantiation', function (Y) {

// Object hash mapping test names to test objects. A test object may have the
// following properties, of which only the "test" property is required:
//
// iterations (Number):
//   Number of iterations to run.
//
// noBootstrap (Boolean):
//   By default, YUI3 core and Loader are bootstrapped into each test sandbox.
//   Set this to true to start with a pristine sandbox.
//
// setup (Function):
//   Setup function to execute before each iteration of the test. Runs in the
//   same sandbox as the test.
//
// teardown (Function):
//   Teardown function to execute after each iteration of the test. Runs in the
//   same sandbox as the test.
//
// test (Function):
//   The test itself, each iteration of which will be timed. In order to make
//   async execution testable, the test function needs to call profileStop()
//   when it's completely finished; until this happens, the next test cannot
//   run and the profile timer will keep ticking.
//
// useStrictSandbox (Boolean):
//   By default, each test gets a single sandbox which is reused for all
//   iterations of that test. Set this to true if you want a brand new sandbox
//   to be created for each iteration of the test.
//
// warmup (Boolean):
//   If this is true, the test will be run once (and timing data discarded) as a
//   warmup before the main iterations begin.
//
Y.Performance.addTests({
    "YUI3: yui-min.js + loader-min.js parsing/execution": {
        iterations: 10,

        // Don't bootstrap YUI by default.
        noBootstrap: true,

        // Run each iteration in a new sandbox.
        useStrictSandbox: true,

        setup: function () {
            var yuiJS    = sandbox.xhrGet('../../build/yui/yui-min.js'),
                loaderJS = sandbox.xhrGet('../../build/loader/loader-min.js');

            if (yuiJS && loaderJS) {
                window.yuiScript = yuiJS + "\n" + loaderJS;
            } else {
                sandbox.log('Failed to load yui-min.js and/or loader-min.js.', 'warn', 'sandbox');
                return false;
            }
        },

        test: function () {
            eval(yuiScript);
            profileStop();
        }
    },

    "YUI2: yuiloader-dom-event.js parsing/execution": {
        iterations: 10,
        noBootstrap: true,
        useStrictSandbox: true,

        setup: function () {
            var yuiLoaderJS = sandbox.xhrGet('assets/yui2/yuiloader-dom-event.js');

            if (yuiLoaderJS) {
                window.yuiScript = yuiLoaderJS;
            } else {
                sandbox.log('Failed to load yuiloder-dom-event.js.', 'warn', 'sandbox');
                return false;
            }
        },

        test: function () {
            eval(yuiScript);
            profileStop();
        }
    },

    "YUI().use()": {
        iterations: Y.UA.ie ? 20 : 40,

        test: function () {
            YUI().use(function (Y) {
                profileStop();
            });
        }
    },

    "YUI().use('anim', 'event', 'io', 'json', 'node')": {
        iterations: Y.UA.ie ? 20 : 40,
        warmup: true,

        test: function () {
            YUI().use('anim', 'event', 'io', 'json', 'node', function (Y) {
                profileStop();
            });
        }
    },

    "TabView with 3 tabs": {
        iterations: Y.UA.ie ? 20 : 40,
        warmup: true,

        setup: function () {
            window.tabViewContainer = document.body.appendChild(
                    document.createElement('div'));
        },

        teardown: function () {
            document.body.removeChild(window.tabViewContainer);
        },

        test: function () {
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

                tabview.render(window.tabViewContainer);
                profileStop();
            });
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
