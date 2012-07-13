YUI.add('cookie-subcookie-example-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('cookie-subcookie-example');

    suite.add(new Y.Test.Case({
        name: 'cookie-subcookie-example',
        'is rendered': function() {
            var test = this;

            test.wait(function() {
                var html = Y.one('#results').get('innerHTML');
                Assert.isTrue((html.indexOf('Yahoo!') > -1), 'failed to find Yahoo in html');
                Assert.isTrue((html.indexOf("'today'") > -1), 'failed to find today in html');
                Assert.isTrue((html.indexOf("'count'") > -1), 'failed to find count in html');
            }, 200);
        },
        'did it set cookies': function() {
            var c = document.cookie;
            Assert.isTrue((c.indexOf('example=') > -1), 'failed to find example= in cookie');
            Assert.isTrue((c.indexOf('name=Yahoo!') > 0), 'failed to find Yahoo in cookie');
            Assert.isTrue((c.indexOf('today=') > 0), 'failed to find today in cookie');
            Assert.isTrue((c.indexOf('count=') > 0), 'failed to find count in cookie');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });
