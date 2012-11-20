YUI.add('yui-isa-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-isa example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check buttons click': function() {
        
            var checkButton = function(id) {
                var button = Y.one('#demo-' + id),
                    before = Y.all('#demo tr').item(id).all('td').size(),
                    after;
                
                button.simulate('click');
                after = Y.all('#demo tr').item(id).all('td').size();

                Assert.areNotEqual(before, after, 'Failed to inject new table cells (' + id + ')');
                Assert.areEqual(after, 5, 'Failed to inject proper number of cells (' + id + ')');
            };

            for (var i = 1; i < 6; i++) {
                checkButton(i);
            }
        },
        'check results': function() {
            var results = {
                '1': [ 'N', 'N', 'N', 'null' ],
                '2': [ 'Y', 'Y', 'N', 'array' ],
                '3': [ 'Y', 'N', 'N', 'object' ],
                '4': [ 'Y', 'N', 'Y', 'function' ],
                '5': [ 'Y', 'N', 'N', 'object' ]
            };

            Y.all('#demo tr').each(function(row, index) {
                if (index > 0) {
                    var name = row.one('td').one('code').get('innerHTML');
                    var check = results[index];
                    row.all('td').each(function(cell, index) {
                        if (index > 0) {
                            Assert.areEqual(cell.get('innerHTML'), check[index - 1], 'Failed to get index [' + (index - 1) + '] result for ' + name);
                        }
                    });
                }
            });
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
