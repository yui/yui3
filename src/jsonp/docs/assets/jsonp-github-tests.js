YUI.add('jsonp-github-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('jsonp-github');

    var testCase = new Y.Test.Case({
        name: 'jsonp-github',
        setUp: function() {
            var button = Y.one('#demo_btn');
            var select = Y.one('#github_user');


            this.fetchUser = function(user, cb) {
                Y.one('#out').set('innerHTML', '');


                select.set('value', user);

                button.simulate('click');

                this.poll(function() {
                    var html = Y.one('#out').get('innerHTML');
                    return html !== '';
                }, 100, 10000, cb, function() {
                    Assert.fail('Polling failed');
                });
            };

            this.getUser = function() {
                return Y.one('#out table caption code').get('innerHTML');
            };

            this.checkData = function() {
                var cells = Y.all('#out table tbody tr td');
                cells.each(function(n) {
                    var html = parseInt(n.get('innerHTML'), 10);
                    Assert.isNotNaN(html);
                });
            };
        },
        'is rendered': function() {
            Assert.isNotNull(Y.one('#github_user'));
            Assert.isNotNull(Y.one('#demo_btn'));
            Assert.isNotNull(Y.one('#out'));
        }
    });

    var items = Y.one('#github_user').get('options');
    items.each(function(n) {
        var user = n.get('value');
        testCase['fetch ' + user + ' user'] = (function(user) {
            return function() {
                this.fetchUser(user, function() {
                    Assert.areEqual(user, this.getUser());
                    this.checkData();
                });
            };
        })(user);
    });
    
    suite.add(testCase);

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node-event-simulate'] });
