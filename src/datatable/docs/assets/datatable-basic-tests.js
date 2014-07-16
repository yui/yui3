YUI.add('datatable-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-basic example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test first table elements': function() {
            var tableSelector = '#simple ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(3, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of td');
            Assert.areEqual(4, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('Example table with simple columns', cap.getHTML(), ' - Wrong or no caption');
        },
        'test second table elements': function() {
            var tableSelector = '#labels ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(3, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of td');
            Assert.areEqual(4, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('These columns have labels and abbrs', cap.getHTML(), ' - Wrong or no caption');
        },
        'test second table header contents': function() {
            var tableSelector = '#labels ',
                th = Y.all(tableSelector + 'th');
            Assert.areEqual('Wholesale Price', th.item(2).getHTML(), ' - Wrong or th contents');
            Assert.areEqual('Name', th.item(1).getAttribute('abbr'), ' - Wrong or th contents');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
