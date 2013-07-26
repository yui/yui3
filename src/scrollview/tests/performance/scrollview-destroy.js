var suite = new PerfSuite({
    name: 'ScrollView Performance: Destroy',
    html: 'assets/scrollview.html',
    yui: {
        use: ['scrollview'],
        config: {
            foo: 'bar'
        }
    },
    global: {
        setup: function () {
            var scrollview = new Y.ScrollView({
                srcNode: Y.one('#container'),
                render: true
            });
        }
    },
    tests: [
        {
            name: 'ScrollView: Create & Destroy',
            fn: function () {
                scrollview.destroy();
            }
        }
    ]
});
