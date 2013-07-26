var suite = new PerfSuite({
    name: 'ScrollView Performance: Render',
    html: 'assets/scrollview.html',
    yui: {
        use: ['scrollview']
    },
    global: {
        setup: function () {
            var scrollview = new Y.ScrollView({
                srcNode: Y.one('#container')
            });
        }
    },
    tests: [
        {
            name: 'ScrollView Render',
            fn: function () {
                scrollview.render();
            }
        }
    ]
});
