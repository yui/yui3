YUI.add('scrollview-benchmark', function (Y, NAME) {

    var suite = Y.Benchmark.suite,
        container,
        scrollview;
    
    container = document.createElement('div')
    container.id = "container";
    document.body.appendChild(container);

    suite.add({
        Y: Y,
        name: 'ScrollView: Create', 
        fn: function () {
            scrollview = new Y.ScrollView({
                render: container
            });
        }
    });
    
    suite.add({
        Y: Y,
        name: 'ScrollView: Create & Destroy', 
        fn: function () {
            scrollview = new Y.ScrollView({
                render: container
            });
            scrollview.destroy();
        }
    });

}, '@VERSION@', {requires: ['scrollview-base']});