YUI.add('datatable-nestedcols-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-nestedcols example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test nested table elements': function() {
            var tableSelector = '#nested ',
                th = Y.all(tableSelector + 'th'),
                td = Y.all(tableSelector + 'td'),
                tr = Y.all(tableSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(5, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of th');
            Assert.areEqual(6, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(4).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('Table with nested column headers', cap.getHTML(), ' - Wrong or no caption');
            Assert.areEqual(3, th.item(0).getAttribute('colspan'), ' - Wrong colspan th.item(0)');
            Assert.areEqual(1, th.item(1).getAttribute('colspan'), ' - Wrong colspan th.item(1)');
            Assert.areEqual(2, th.item(1).getAttribute('rowspan'), ' - Wrong rowspan th.item(1)');
            Assert.areEqual(2, th.item(2).getAttribute('colspan'), ' - Wrong colspan th.item(2)');
            Assert.areEqual(1, th.item(3).getAttribute('colspan'), ' - Wrong colspan th.item(3)');
            Assert.areEqual(1, th.item(4).getAttribute('colspan'), ' - Wrong colspan th.item(4)');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
