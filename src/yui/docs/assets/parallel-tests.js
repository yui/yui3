YUI.add('parallel-tests', function(Y) {

    var suite = new Y.Test.Suite('parallel example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'start example': function() {
            var html = Y.one('#results').get('innerHTML');
            Y.one('#runner').simulate('click');
            var html2 = Y.one('#results').get('innerHTML');

            Assert.areNotSame(html, html2, 'Failed to start example');
        },
        'check example output': function() {
            var test = this,
                res = Y.one('#results'),
                timer;

            timer = setInterval(function() {
                var size = res.all('strong').size();
                if (size === 2) {
                    clearInterval(timer);
                    test.resume(function() {
                        var count = 0;
                        var html = res.get('innerHTML').split('<br>');
                        Y.Array.each(html, function(line) {
                            if (line.indexOf('Callback fired') > -1) {
                                count++;
                            }
                        });
                        Assert.areEqual(count, 5, 'Failed to execute 5 parallel functions');
                    });
                }
            }, 1000);
            

            test.wait(8000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
