YUI.add('cookie-advanced-example-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('cookie-advanced-example');

    suite.add(new Y.Test.Case({
        name: 'cookie-advanced-example',
        setUp: function() {
            Y.Cookie.set('example', 'yui1234');
        },
        'verify current cookie': function() {
            Assert.areEqual('yui1234', Y.Cookie.get('example'));
        },
        'verify example sees current cookie': function() {
            var button = Y.one('#yui-cookie-btn1'),
                results = Y.one('#results');

            results.set('innerHTML', '');

            button.simulate('click');
            var html = results.get('innerHTML').replace('\n', '');
            Assert.areEqual("Cookie 'example' has a value of 'yui1234'<br>", html);
        },
        'verify that random value is set': function() {
            var button = Y.one('#yui-cookie-btn2'),
                results = Y.one('#results');

            results.set('innerHTML', '');

            button.simulate('click');

            this.wait(function() {
                var html = results.get('innerHTML');
                var m = html.match(/([\d+](.*))/);

                m[0] = m[0].replace("'", '');
                Assert.areEqual(m[0], parseInt(m[0], 10));

                var str = 'example=yui' + m[0];
                Assert.isTrue(document.cookie.indexOf(str) > -1);
            }, 1000);
        },
        'verify cookie is unset': function() {
            var button = Y.one('#yui-cookie-btn3'),
                results = Y.one('#results');

            results.set('innerHTML', '');

            button.simulate('click');

            Assert.areEqual("removed cookie 'example'.\n<br>", results.get('innerHTML').toLowerCase());
            Assert.isTrue((document.cookie.indexOf('example=yui') === -1));

            results.set('innerHTML', '');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: ['cookie', 'node-event-simulate' ] });
