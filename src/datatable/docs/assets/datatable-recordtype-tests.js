YUI.add('datatable-recordtype-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-recordtype example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test first table elements': function() {
            var tableSelector = '#dtable ',
                tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
                tableDataSelector = tableSelector + '.yui3-datatable-data ',
                th = Y.all(tableHeaderSelector + 'th'),
                td = Y.all(tableDataSelector + 'td'),
                tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr');

            Assert.areEqual(6, th.size(), ' - Wrong number of th');
            Assert.areEqual(30, td.size(), ' - Wrong number of th');
            Assert.areEqual(6, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.isTrue((th.item(5).one('div').hasClass('yui3-datatable-sort-liner')), ' - Failed to sort-linear class last col');
            Assert.areEqual('Sort by Gain or Loss', th.item(5).getAttribute('title'), ' - Failed to assign title to sortable th');
            Assert.areEqual('32.14 %', td.item(5).getHTML(), ' - Failed to generate the gain or loss in top row');
            Assert.areEqual('n/a', td.item(23).getHTML(), ' - Failed to generate the "n/a" or loss in top row');

            th.item(5).simulate('click');
            td = Y.all(tableDataSelector + 'td'); // refresh the nodeList
            Assert.areEqual('-79.84 %', td.item(5).getHTML(), ' - Failed to find correct generated value after sort/click');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
