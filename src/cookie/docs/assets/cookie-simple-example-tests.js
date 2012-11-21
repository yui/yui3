YUI.add('cookie-simple-example-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('cookie-simple-example');

    suite.add(new Y.Test.Case({
        name: 'cookie-simple-example',
        'is rendered': function() {
            this.wait(function() {
                var html = Y.one('#results').get('innerHTML').toLowerCase().split('<br>');
                var m = html[1].match(/([\d+](.*))/);

                m[0] = m[0].replace("'", '');
                Assert.areEqual(m[0], parseInt(m[0], 10));
            }, 1000);
        },
        'is cookie set': function() {
            var html = Y.one('#results').get('innerHTML').toLowerCase().split('<br>');
            var m = html[1].match(/([\d+](.*))/);

            m[0] = m[0].replace("'", '');
            var str = 'example=yui' + m[0];
            Assert.isTrue(document.cookie.indexOf(str) > -1);
        }
    }));

    Y.Test.Runner.add(suite);

});
