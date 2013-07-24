[
    {
        title: 'ScrollView Performance: Create',
        slug: 'scrollview-performance-create',
        html: 'assets/scrollview.html',
        yui: {
            use: ['scrollview']
        },
        global: {
            teardown: function () {
                Y.one('#container').empty(true);
            }
        },
        tests: [
            {
                title: 'ScrollView Create',
                fn: function () {
                    new Y.ScrollView();
                }
            },
            {
                title: 'ScrollView Create - getElementById',
                fn: function () {
                    new Y.ScrollView({
                        srcNode: document.getElementById('container')
                    });
                }
            },
            {
                title: 'ScrollView Create - YNode',
                fn: function () {
                    new Y.ScrollView({
                        srcNode: Y.one('#container')
                    });
                }
            },
            {
                title: 'ScrollView Create - YNode and render',
                fn: function () {
                    var scrollview = new Y.ScrollView({
                        srcNode: Y.one('#container')
                    });
                    scrollview.render();
                }
            }
        ]
    },
    {
        title: 'ScrollView Performance: Render',
        slug: 'scrollview-performance-render',
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
                title: 'ScrollView Render',
                fn: function () {
                    scrollview.render();
                }
            }
        ]
    },
    {
        title: 'ScrollView Performance: Destroy',
        slug: 'scrollview-performance-destroy',
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
                title: 'ScrollView: Create & Destroy',
                fn: function () {
                    scrollview.destroy();
                }
            }
        ]
    }
];
