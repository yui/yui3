{
    title: 'ScrollView Performance: Create',
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
}
