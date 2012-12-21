YUI.add('datatable-benchmark', function (Y) {

    var dataA = [];

    for (var i=0; i<1000; i++) {
        dataA.push({ id: 'ga-3475' + i, name: 'gadget', price: '$6.99'});
    }

    var suite = Y.BenchmarkSuite = new Benchmark.Suite();


    suite.add('Y.DataTable: Instantiate a bare data table >>', function () {
        var dt = new Y.DataTable();
    });

    suite.add('Y.DataTable: Instantiate a bare data table rendered >>', function () {
        var dt = new Y.DataTable();
        dt.render();
        dt.destroy();
    });

    // 1 x 3
    suite.add('Y.DataTable: Instantiate with 1 x 3 data >>', function() {
        var dt = new Y.DataTable({
            columns: ['id', 'name', 'price'],
            data: [{ id: 'ga-3475', name: 'gadget', price: '$6.99'}]
        });
    });

    suite.add('Y.DataTable: Instantiate with 1 x 3 data rendered >>', function() {
        var dt = new Y.DataTable({
            columns: ['id', 'name', 'price'],
            data: [{ id: 'wi-0650', name: 'widget',   price: '$4.25'}]
        });
        dt.render();
    });

    suite.add('Y.DataTable: Instantiate with 1 x 3 data rendered and destroyed >>', function() {
        var dt = new Y.DataTable({
            columns: ['id', 'name', 'price'],
            data: [{ id: 'wi-0650', name: 'widget',   price: '$4.25'}]
        });
        dt.render();
        dt.destroy();
    });

    // 1000 x 3
    suite.add('Y.DataTable: Instantiate with 1000 x 3 data >>', function() {
        var dt = new Y.DataTable({
            columns: ['id', 'name', 'price'],
            data: dataA
        });
    });

    suite.add('Y.DataTable: Instantiate with 1000 x 3 data rendered >>', function() {
        var dt = new Y.DataTable({
            columns: ['id', 'name', 'price'],
            data: dataA
        });
        dt.render();
    });

    suite.add('Y.DataTable: Instantiate with 1000 x 3 data rendered and destroyed >>', function() {
        var dt = new Y.DataTable({
            columns: ['id', 'name', 'price'],
            data: dataA
        });
        dt.render();
        dt.destroy();
    });


}, '@VERSION@', {requires: ['datatable']});