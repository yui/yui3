YUI.add('datatable-formatting-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-formatting example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test template strings table': function() {
            var tableSelector = '#template ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(3, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of th');
            Assert.areEqual(4, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('$6.99', td.item(2).getHTML(), ' - Failed to format number to $');
            Assert.areEqual('Data formatting with string template', cap.getHTML(), ' - Wrong or no caption');
        },
        'test function formatting table': function() {
            var tableSelector = '#function ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(3, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of th');
            Assert.areEqual(4, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('$2.00', td.item(2).getHTML(), ' - Failed to format number to $');
            Assert.areEqual('Data formatting with custom function', cap.getHTML(), ' - Wrong or no caption');
        },
        'test populating with HTML table': function() {
            var tableSelector = '#allowhtml ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(3, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of th');
            Assert.areEqual(4, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.isTrue((td.item(0).getHTML().indexOf('checkbox') > -1), ' - Failed to insert input HTML');
            Assert.areEqual('Allowing HTML content in cells', cap.getHTML(), ' - Wrong or no caption');
        },
        'test empty cell and dates table': function() {
            var tableSelector = '#dates ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(3, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of th');
            Assert.areEqual(4, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('06/01/2006', td.item(2).getHTML(), ' - Failed to formatt date');
            Assert.areEqual('(unknown)', td.item(8).getHTML(), ' - Failed to formatt empty cell value');
            Assert.areEqual('Data formatting with DataType.Date', cap.getHTML(), ' - Wrong or no caption');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
