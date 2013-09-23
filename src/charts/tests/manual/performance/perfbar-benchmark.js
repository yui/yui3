YUI.add('perfbar-benchmark', function (Y) {
    Y.BenchmarkSuite = new Benchmark.Suite();
    var suite = Y.BenchmarkSuite,
        chart,
        container,
        dataProvider = Y.GeneratePerfTestDataProvider.getData();
    container = document.createElement('div');
    container.style.left = "10px";
    container.style.top = "10px";
    container.style.width = "600px";
    container.style.height = "500px";
    container.id = "container";
    document.body.appendChild(container);
    
    suite.add("PerfBarChart", function() {
        chart = new Y.Chart({
            dataProvider: dataProvider,
            type: "bar",
            categoryType: "time",
            categoryKey: "date",
            render: container 
        });
        chart.destroy(true);
    });
}, '@VERSION@', {requires: ['charts']});
