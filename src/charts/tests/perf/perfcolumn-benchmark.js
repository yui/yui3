YUI.add('perfcolumn-benchmark', function (Y) {
    Y.BenchmarkSuite = new Benchmark.Suite();
    var suite = Y.BenchmarkSuite,
        chart,
        container,
        dataProvider = Y.GeneratePerfTestDataProvider.getData();
    container = document.createElement('div');
    container.style.left = "10px";
    container.style.top = "10px";
    container.style.width = "600px";
    container.style.height = "300px";
    container.id = "container";
    document.body.appendChild(container);
    
    suite.add("PerfColumnChart", function() {
        chart = new Y.Chart({
            dataProvider: dataProvider,
            type: "column",
            categoryType: "time",
            categoryKey: "date",
            render: container 
        });
        chart.destroy(true);
    });
}, '@VERSION@', {requires: ['charts']});
