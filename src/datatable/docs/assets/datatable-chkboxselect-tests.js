YUI.add('datatable-chkboxselect-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-chkboxselect example test suite'),
        Assert = Y.Assert;

    var tableSelector = '#dtable ',
        th = Y.all(tableSelector + 'th'),
        td = Y.all(tableSelector + 'td'),
        tr = Y.all(tableSelector + 'tr');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test populating with HTML table': function() {

            Assert.areEqual(8, th.size(), ' - Wrong number of th');
            Assert.isTrue((td.size() > 20), ' - Wrong number of td');
            Assert.isTrue((tr.size() > 10), ' - Wrong number of tr');
            Assert.isTrue((tr.item(3).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
            Assert.isTrue((td.item(0).getHTML().indexOf('type="checkbox"') > -1), ' - Failed to insert input HTML');
        },
        'test selecting and processing': function() {

            td.item(0).one('input').setAttribute('checked', 'checked');
            td.item(4).one('input').setAttribute('checked', 'checked');
            Y.one('#btnSelected').simulate('click');
            Assert.areEqual(8, 8, 'blah');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
