YUI.add('yui-gallery-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-gallery example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        setUp: function() {
            this.urls = {
                l: Y.one('#shorten').get('value'),
                s: Y.one('#expand').get('value')
            };
        },
        'check shorten button click': function() {
            var test = this;
            test.wait(function() {
                var el = Y.one('#shorten').getDOMNode();
                el.focus();
                el.blur();
                test.wait(function() {
                    var a = Y.one('#shorten').get('parentNode').one('em  a').get('href');
                    Assert.areSame(test.urls.s, a, 'Failed to shorten URL');
                }, 3000);
            }, 5000);
        },
        'check expand button click': function() {
            var test = this;
            var el = Y.one('#expand').getDOMNode();
            el.focus();
            el.blur();
            test.wait(function() {
                var a = Y.one('#expand').get('parentNode').one('em  a').get('href');
                Assert.areSame(test.urls.l, a, 'Failed to expand URL');
            }, 3000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
