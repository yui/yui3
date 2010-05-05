YUI.add('perf-instantiation', function (Y) {

// Object hash mapping test names to test objects. A test object may have the
// following properties, of which only the "test" property is required:
//
// setup (Function):
//   Setup function to execute before each iteration of the test.
//
// teardown (Function):
//   Teardown function to execute after each iteration of the test.
//
// test (Function):
//   The test itself, each iteration of which will be timed. In order to make
//   async execution testable, the test function needs to set this.done = true
//   when it's completely finished; until this happens, the next test cannot
//   run and the profile timer will keep ticking.
//
Y.Performance.addTests({

/*
    "yui-min.js parse/execution time": {
        iterations: 10,

        // Don't bootstrap YUI by default.
        noBootstrap: true,

        // // Preload yui-min.js, but don't execute it.
        // preload: [
        //     '../../build/yui/yui-min.js'
        // ],

        // Run each iteration in a new sandbox.
        useStrictSandbox: true,

        setup: function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '../../build/yui/yui-min.js', false);
            xhr.send(null);

            if (xhr.status == 200) {
                window.yuiScript = xhr.responseText;
            }
        },

        test: function () {
            eval(yuiScript);
        }
    },
*/


    "YUI().use()": {
        iterations: Y.UA.ie ? 20 : 40,

        test: function () {
            YUI().use(function (Y) {
                profileStop();
            });
        }
    },

    "YUI().use('anim', 'io', 'json', 'node')": {
        iterations: Y.UA.ie ? 20 : 40,

        test: function () {
            YUI().use('anim', 'io', 'json', 'node', function (Y) {
                profileStop();
            });
        }
    },

    "TabView with 3 tabs": {
        iterations: Y.UA.ie ? 20 : 40,

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

                tabview.render();
                profileStop();
            });
        }
    }
});

}, '@VERSION@', {requires: ['performance']});
