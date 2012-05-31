YUI.add('pattern-module', function(Y) {
    
    Y.PatternModule = function() {
        var myColumnDefs = [
            { key: "id", sortable: true, resizeable: true },
            { key: "quantity", sortable: true, resizeable: true }
        ];

        var myDataSource = new Y.YUI2.util.DataSource([ { id: "po-0167", quantity: 1 } ]);
        myDataSource.responseType = Y.YUI2.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = { fields: ["id", "quantity"] };

        var myDataTable = new Y.YUI2.widget.DataTable("basic", myColumnDefs, myDataSource, { caption: "DataTable Caption", scrollable: true, draggableColumns: true });

    };

}, '', { requires: [ 'yui2-dragdrop', 'yui2-datatable']});
