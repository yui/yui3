YUI.add('datatable-dsget-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-dsget example test suite'),
        Assert = Y.Assert;


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test table elements': function() {
            var test = this;
            setTimeout(function() {
                test.resume(function() {

                    var tableSelector = '#pizza ',
                        th = Y.all(tableSelector + 'th'),
                        td = Y.all(tableSelector + 'td'),
                        tr = Y.all(tableSelector + 'tr'),
                        cap = Y.one(tableSelector + 'caption'),
                        summary = Y.one(tableSelector + 'table').getAttribute('summary');

                    Assert.areEqual(3, th.size(), ' - Wrong number of th');
                    Assert.isTrue((td.size() > 15), ' - Should be more than 15 td');
                    Assert.isTrue((tr.size() > 5), ' - Should be more than 5 tr');
                    Assert.isTrue((tr.item(3).hasClass('yui3-datatable-odd')), ' - Failed to assign odd row class');
                    Assert.areEqual('Table with JSON data from YQL', cap.getHTML(), ' - Wrong or no caption');
                    Assert.areEqual('Pizza places near 98089', summary, ' - Wrong or missing summary');
                    Assert.areEqual('Title', th.item(0).getHTML(), ' - Wrong col 1 head');
                    Assert.areEqual('Phone', th.item(1).getHTML(), ' - Wrong col 2 head');
                    Assert.areEqual('Rating', th.item(2).getHTML(), ' - Wrong col 3 head');
                });
            }, 1000);
            test.wait(1500);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });


