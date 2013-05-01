YUI.add('scrollview-benchmark', function (Y, NAME) {

    var suite = Y.BenchmarkSuite = new Benchmark.Suite,
        container,
        scrollview;
    
    container = document.createElement('div')
    container.id = "container";
    document.body.appendChild(container);

    suite.add('ScrollView: Create', function () {
        scrollview = new Y.ScrollView({
            render: container
        });
    });
    
    suite.add('ScrollView: Create & Destroy', function () {
        scrollview = new Y.ScrollView({
            render: container
        });
        scrollview.destroy();
    });

}, '@VERSION@', {requires: ['scrollview-base']});
