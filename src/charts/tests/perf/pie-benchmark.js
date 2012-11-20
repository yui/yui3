YUI.add('pie-benchmark', function (Y) {
    Y.BenchmarkSuite = new Benchmark.Suite();
    var suite = Y.BenchmarkSuite,
        chart,
        container,
        pieDataProvider;
    container = document.createElement('div');
    pieDataProvider = [
        {category:"5/1/2010", revenue:2200}, 
        {category:"5/2/2010", revenue:100}, 
        {category:"5/3/2010", revenue:1500}, 
        {category:"5/4/2010", revenue:2800}, 
        {category:"5/5/2010", revenue:2650}
    ];
    container.style.left = "10px";
    container.style.top = "10px";
    container.style.width = "600px";
    container.style.height = "300px";
    container.id = "container";
    document.body.appendChild(container);

    suite.add("PieChart", function() {
        chart = new Y.Chart({
            dataProvider: pieDataProvider,
            type: "pie",
            render: container,
            categoryKey: "category"
        });
        chart.destroy(true);
    });

    suite.add("PieChartLegend", function() {
        chart = new Y.Chart({
            legend: {
                position: "right"
            },
            dataProvider: pieDataProvider,
            type: "pie",
            render: container,
            categoryKey: "category"
        });
        chart.destroy(true);
    });

}, '@VERSION@', {requires: ['charts']});
