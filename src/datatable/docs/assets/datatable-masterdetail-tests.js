YUI.add('datatable-masterdetail-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-masterdetail example test suite'),
        Assert = Y.Assert;

    var clickedNodeTiggers,
        clickedNodeBears;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test first table elements': function() {
            var tableSelector = '#mtable ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(2, th.size(), ' - Wrong number of th');
            Assert.areEqual(12, td.size(), ' - Wrong number of td');
            Assert.areEqual(7, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('Select an animal category below:', cap.getHTML(), ' - Wrong or no caption');
            clickedNodeTiggers = td.item(4); // tigers
            clickedNodeBears = td.item(9); // bears, the second column
        },
        'test detail table after clicking master table': function() {
            clickedNodeTiggers.simulate('click');
            var tableSelector = '#dtable ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(2, th.size(), ' - Wrong number of th');
            // one is hidden "No critter characters were found!"
            // so all the numbers below here will seem off
            Assert.areEqual(7, td.size(), ' - Wrong number of td');
            Assert.areEqual(5, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(3).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('Tigger', td.item(4).getHTML(), ' - Failed to find "Tigger" in detail table');
            Assert.isTrue((cap.getHTML().indexOf('Tigers') > -1),  ' - Wrong or no caption');
        },
        'test detail table after clicking master table': function() {
            clickedNodeBears.simulate('click');
            var tableSelector = '#dtable ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');

            Assert.areEqual(2, th.size(), ' - Wrong number of th');
            Assert.areEqual(10, td.size(), ' - Wrong number of td');
            Assert.areEqual(6, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.areEqual('Yogi', td.item(9).getHTML(), ' - Failed to find "Yogi" in detail table');
            Assert.isTrue((cap.getHTML().indexOf('Bears') > -1),  ' - Wrong or no caption');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
