var suite = new PerfSuite('Y.Model performance tests', {
    html: 'assets/scrollview.html',
    yui: {
        use: ['scrollview']
    },
    teardown: function () {
        Y.one('#container').empty(true);
    }
});

suite.add('ScrollView Create', function () {
    new Y.ScrollView();
});

suite.add({
    name: 'ScrollView Create - getElementById',
    fn: function () {
        new Y.ScrollView({
            srcNode: document.getElementById('container')
        });
    }
});

suite.add({
    'ScrollView Create - YNode': function () {
        new Y.ScrollView({
            srcNode: Y.one('#container')
        });
    },
    'ScrollView Create - YNode and render': function () {
        var scrollview = new Y.ScrollView({
            srcNode: Y.one('#container')
        });
        scrollview.render();
    }
});
