YUI.add('datatable-sort-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-sort example test suite'),
        Assert = Y.Assert;
            var tableSelector = '#sort ',
                th = Y.all(tableSelector + 'th'),
                td = Y.all(tableSelector + 'td'),
                tr = Y.all(tableSelector + 'tr'),
                cap = Y.one(tableSelector + 'caption');


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test table elements': function() {
            Assert.areEqual(3, th.size(), ' - Wrong number of th');
            Assert.areEqual(9, td.size(), ' - Wrong number of th');
            Assert.areEqual(4, tr.size(), ' - Wrong number of tr');
            Assert.isTrue((tr.item(2).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.isTrue((th.item(0).one('div').hasClass('yui3-datatable-sort-liner')), ' - Failed to sort-linear class first col');
            Assert.isTrue((th.item(0).one('div span').hasClass('yui3-datatable-sort-indicator')), ' - Failed to include span with double arrows');
// alert(th.item(0).one('div').getHTML());
// alert(th.item(0).one('div span').getContent());
// alert(th.item(0).one('div span').getStyle('backgroundImage'));
// alert(th.item(0).one('div .yui3-datatable-sort-indicator').getStyle('backgroundPosition'));
//    IE8 returns undefined for ....getStyle('backgroundPosition'), so I removed that arrow test
//            Assert.areEqual('0px 0px', th.item(0).one('div span').getComputedStyle('backgroundPosition'), ' - Failed to include span with arrow pointing up');
            Assert.isTrue((th.item(2).one('div').hasClass('yui3-datatable-sort-liner')), ' - Failed to sort-linear class last col');
            Assert.areEqual('Sort by Click to Sort Column C', th.item(2).getAttribute('title'), ' - Failed to assign title to sortable th');
            Assert.areEqual('Table with simple column sorting', cap.getHTML(), ' - Wrong or no caption');
        },
        'test click to sort': function() {
            Assert.areEqual('Company Bee', td.item(0).getHTML(), ' - Wrong text in col 1 row 1 before sort');
            ///////// first click
            th.item(0).simulate('click');
            td = Y.all(tableSelector + 'td'); // refresh the nodeList
            Assert.areEqual('Acme Company', td.item(0).getHTML(), ' - Wrong text in col 1 row 1 after sort');
            Assert.areEqual('Reverse sort by Click to Sort Column A', th.item(0).getAttribute('title'), ' - Failed to assign "reverse sort..." title to sortable th');
//            Assert.areEqual('0px -10px', th.item(0).one('div span').getComputedStyle('backgroundPosition'), ' - Failed to include span with arrow pointing down');


            ////////// second click
            th.item(0).simulate('click');
            td = Y.all(tableSelector + 'td'); // refresh the nodeList
            Assert.areEqual('Industrial Industries', td.item(0).getHTML(), ' - Wrong text in col 1 row 1 after sort');
//            Assert.areEqual('0px -20px', th.item(0).one('div span').getComputedStyle('backgroundPosition'), ' - Failed to include span with arrow pointing up');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
