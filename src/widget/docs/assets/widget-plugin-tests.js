YUI.add('widget-plugin-tests', function(Y) {

    var suite = new Y.Test.Suite('widget-plugin example test suite'),
        TIMEOUT = 10000;

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test initial render' : function() {

            var test = this;

                condition = function() {

                    // Assume No data/unparsable data is a failure,
                    // just in case it mean the feed we're using changed.
                    // We can use the "red" flag to go check the 
                    // service API/availability

                    return Y.Node.one("ul.yui3-feed-data") !== null;
                },

                success = function() {
                    var feedData = Y.Node.one("ul.yui3-feed-data");

                    // Is it ok to assume we always get 10 back?
                    Y.Assert.isTrue(feedData.all("li a").size() === 10);
                },

                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + TIMEOUT + "ms.");
                };

            test.poll(condition, 100, TIMEOUT, success, failure);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['node']})