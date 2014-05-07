YUI.add('datatable-colorsort-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-colorsort example test suite'),
        Assert = Y.Assert,
        tableSelector = '#cTable ',
        tableHeaderSelector = tableSelector + '.yui3-datatable-columns ',
        tableDataSelector = tableSelector + '.yui3-datatable-data ',
        th = Y.all(tableHeaderSelector + 'th'),
        td = Y.all(tableDataSelector + 'td'),
        tr = Y.all(tableHeaderSelector + 'tr, ' + tableDataSelector + 'tr');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test table elements': function() {
            Assert.areEqual(5, th.size(), ' - Wrong number of th');
            Assert.areEqual(115, td.size(), ' - Wrong number of td');
            Assert.areEqual(24, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.isTrue((th.item(1).one('div').hasClass('yui3-datatable-sort-liner')), ' - Failed to find sort-linear class in 2nd col');
            Assert.isTrue((th.item(1).one('div span').hasClass('yui3-datatable-sort-indicator')), ' - Failed to include span with double arrows');
            Assert.isTrue((th.item(2).one('div').hasClass('yui3-datatable-sort-liner')), ' - Failed to sort-linear class 3rd col');
            Assert.areEqual('Sort by Hex', th.item(2).getAttribute('title'), ' - Failed to assign title to sortable th');
        },
        'test click to sort': function() {
            Assert.areEqual('thistle', td.item(1).getHTML(), ' - Wrong text in col 2 row 1 before sort');
            ///////// first click
            th.item(3).simulate('click');
            td = Y.all(tableSelector + 'td'); // refresh the nodeList
            Assert.areEqual('indianred', td.item(1).getHTML(), ' - Wrong text in col 2 row 1 after sort');
            Assert.areEqual('Reverse sort by Hue', th.item(3).getAttribute('title'), ' - Failed to assign "reverse sort..." title to sortable th');
            ////////// second click
            th.item(3).simulate('click');
            td = Y.all(tableSelector + 'td'); // refresh the nodeList
            Assert.areEqual('thistle', td.item(1).getHTML(), ' - Wrong text in col 2 row 1 after sort');
        }
    }));

    /* sortable data types test */

    var suiteFilter = new Y.Test.Suite('datatable-colorsort example test suite'),
        tableSelector = '#cTable ',
        filtRadios = Y.all('.filters'),
        th = Y.all(tableSelector + 'th'),
        tds = Y.all(tableSelector + 'td'),
        trs = Y.all(tableSelector + 'tr');

    suiteFilter.add(new Y.Test.Case({
        name: 'Example sortable tests',
        'test click to sort data types': function() {
            Assert.areEqual('thistle', tds.item(1).getHTML(), ' - Wrong text in col 1 row 1 before filter');
            Assert.areEqual(24, trs.size(), ' - Wrong number of tr before filter');

            filtRadios.item(2).simulate('click');
            trs = Y.all(tableSelector + 'tr'); // refresh the nodeList
            tds = Y.all(tableSelector + 'td'); // refresh the nodeList
            Assert.areEqual(40, trs.size(), ' - Wrong number of tr after filter');
            Assert.areEqual('palevioletred', tds.item(1).getHTML(), ' - Wrong text in col 1 row 1 after filter "mid-tones"');
            
            th.item(4).simulate('click');
            tds = Y.all(tableSelector + 'td'); // refresh the nodeList
            Assert.areEqual('deeppink', tds.item(1).getHTML(), ' - Wrong text in col 1 row 1 after sort "brightness" on "mid-tones" filter');

            // restore to initial, pre-test state
            filtRadios.item(4).simulate('click');
            th.item(3).simulate('click');
            th.item(3).simulate('click');
        }
    }));

    Y.Test.Runner.add(suite);
    Y.Test.Runner.add(suiteFilter);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
