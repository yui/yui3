YUI.add('datatable-select-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: select");

var data = [
        { name: 'Apple',     qty: 7, price: 0.31 },
        { name: 'Banana',    qty: 6, price: 2.38 },
        { name: 'Cherry',    qty: 5, price: 5.72 },
        { name: 'Grape',     qty: 4, price: 1.18 },
        { name: 'Orange',    qty: 3, price: 2.93 },
        { name: 'Pineapple', qty: 2, price: 1.31 }
    ];



suite.add(new Y.Test.Case({

    name: "select",

    "test selecing all rows": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                selectMode: 'row',
                render: true
            }),
            className = dt.selectClassNames.row;

        dt.selectAll();

        Y.Assert.areSame(data.length, dt._selectSelected.length);
        Y.Assert.areSame(dt.body.tbodyNode.all('tr').size(), dt.body.tbodyNode.all('.' + className).size());

        dt.clearSelection();

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className).size());

        dt.destroy();
    },

    "test selecting all columns": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                selectMode: 'col',
                render: true
            }),
            colLen = dt.get('columns').length,
            className = dt.selectClassNames.col;

        dt.selectAll();

        Y.Assert.areSame(colLen, dt._selectSelected.length);
        Y.Assert.areSame(colLen * data.length, dt.body.tbodyNode.all('.' + className).size());

        dt.clearSelection();

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className).size());

        dt.destroy();
    },

    "test selecting all cells": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                selectMode: 'cell',
                render: true
            }),
            colLen = dt.get('columns').length,
            className = dt.selectClassNames.cell;

        dt.selectAll();

        Y.Assert.areSame(colLen * data.length, dt._selectSelected.length);
        Y.Assert.areSame(colLen * data.length, dt.body.tbodyNode.all('.' + className).size());

        dt.clearSelection();

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className).size());

        dt.destroy();
    },

    "test selecting rows": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                selectMode: 'row',
                render: true
            }),
            className = dt.selectClassNames.row;


        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.all('.' + className).size());


        dt.getCell([3,2]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.all('.' + className).size());


        dt.getCell([0,0]).simulate('click', { shiftKey: true });

        Y.Assert.areSame(4, dt._selectSelected.length);
        Y.Assert.areSame(4, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([1,1]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(3, dt._selectSelected.length);
        Y.Assert.areSame(3, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([3,0]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(2, dt._selectSelected.length);
        Y.Assert.areSame(2, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([5,0]).simulate('click', { shiftKey: true });

        Y.Assert.areSame(6, dt._selectSelected.length);
        Y.Assert.areSame(6, dt.body.tbodyNode.all('.' + className).size());

        dt.clearSelection();

        dt.getCell([0,0]).simulate('click');
        dt.getCell([1,1]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(2, dt._selectSelected.length);
        Y.Assert.areSame(2, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([0,0]).simulate('click');
        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className).size());

        dt.destroy();
    },

    "test selecting cols": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                selectMode: 'col',
                render: true
            }),
            className = dt.selectClassNames.col;


        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.one('tr').all('.' + className).size());


        dt.getCell([3,2]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.one('tr').all('.' + className).size());


        dt.getCell([0,0]).simulate('click', { shiftKey: true });

        Y.Assert.areSame(3, dt._selectSelected.length);
        Y.Assert.areSame(3, dt.body.tbodyNode.one('tr').all('.' + className).size());

        dt.getCell([1,1]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(2, dt._selectSelected.length);
        Y.Assert.areSame(2, dt.body.tbodyNode.one('tr').all('.' + className).size());

        dt.getCell([3,0]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.one('tr').all('.' + className).size());

        dt.getCell([5,0]).simulate('click', { shiftKey: true });

        Y.Assert.areSame(3, dt._selectSelected.length);
        Y.Assert.areSame(3, dt.body.tbodyNode.one('tr').all('.' + className).size());

        dt.clearSelection();

        dt.getCell([0,0]).simulate('click');
        dt.getCell([1,1]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(2, dt._selectSelected.length);
        Y.Assert.areSame(2, dt.body.tbodyNode.one('tr').all('.' + className).size());

        dt.getCell([0,0]).simulate('click');
        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.one('tr').all('.' + className).size());

        dt.destroy();
    },

    "test selecting cells": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                selectMode: 'cell',
                render: true
            }),
            className = dt.selectClassNames.cell;


        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.all('.' + className).size());


        dt.getCell([3,2]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.all('.' + className).size());


        dt.getCell([0,0]).simulate('click', { shiftKey: true });

        Y.Assert.areSame(12, dt._selectSelected.length);
        Y.Assert.areSame(12, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([1,1]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(11, dt._selectSelected.length);
        Y.Assert.areSame(11, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([3,0]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(10, dt._selectSelected.length);
        Y.Assert.areSame(10, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([5,0]).simulate('click', { shiftKey: true });

        Y.Assert.areSame(15, dt._selectSelected.length);
        Y.Assert.areSame(15, dt.body.tbodyNode.all('.' + className).size());

        dt.clearSelection();

        dt.getCell([0,0]).simulate('click');
        dt.getCell([1,1]).simulate('click', { ctrlKey: true });

        Y.Assert.areSame(2, dt._selectSelected.length);
        Y.Assert.areSame(2, dt.body.tbodyNode.all('.' + className).size());

        dt.getCell([0,0]).simulate('click');
        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className).size());

        dt.destroy();
    },

    "test selecting a row, then a column, then a cell": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                selectMode: 'row',
                render: true
            }),
            className = dt.selectClassNames;


        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.all('.' + className.row).size());

        dt.set('selectMode', 'col');

        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.one('tr').all('.' + className.col).size());

        dt.set('selectMode', 'cell');

        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(1, dt._selectSelected.length);
        Y.Assert.areSame(1, dt.body.tbodyNode.all('.' + className.cell).size());

        dt.set('selectMode', 'foo');

        dt.getCell([0,0]).simulate('click');

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.row).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.one('tr').all('.' + className.col).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.cell).size());

        dt.destroy();
    },

    "test selecting with no mode set": function () {
        var dt = new Y.DataTable({
                columns: ['name', 'qty', 'price'],
                data: data,
                render: true
            }),
            className = dt.selectClassNames;


        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.row).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.one('tr').all('.' + className.col).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.cell).size());

        dt.selectAll();

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.row).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.one('tr').all('.' + className.col).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.cell).size());

        dt.getCell([1,1]).simulate('click');

        Y.Assert.areSame(0, dt._selectSelected.length);
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.row).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.one('tr').all('.' + className.col).size());
        Y.Assert.areSame(0, dt.body.tbodyNode.all('.' + className.cell).size());

        dt.destroy();
    }


}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable', 'datatable-select', 'node-event-simulate', 'test', 'color']});