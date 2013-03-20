YUI().use('scrollview-base', 'benchmark', function (Y) {

    var container = document.createElement('div'),
        bench,
        scrollview;

    container.id = "container";
    document.body.appendChild(container);

    var suite = new Benchmark.Suite();
    
    Y.Benchmark.addTest(suite);
    
    suite.add("Create and Destroy", function () {
        scrollview = new Y.ScrollView({
            render: container
        });
        scrollview.destroy();
    });
    
    suite.run();

});