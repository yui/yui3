YUI.add('yql-tests', function(Y) {

    var template = {
        name: 'YQL Test',
        setUp : function() {
        },
        
        tearDown : function() {
        },
        test_load: function() {
            Y.Assert.isFunction(Y.YQL);
            Y.Assert.isFunction(Y.YQLRequest);
        },
        test_query: function() {
            var returnedQuery;
            Y.YQL('select * from weather.forecast where location=62896', function(r) {
                returnedQuery = r;
            });
            var wait = function() {
                Y.Assert.isObject(returnedQuery);
                Y.Assert.isObject(returnedQuery.query);
                Y.Assert.areEqual(1, returnedQuery.query.count);
            };
            this.wait(wait, 2500);
        },
        test_https: function() {
            var returnedQuery;
            Y.YQL('select * from weather.forecast where location=62896', function(r) {
                returnedQuery = r;
            }, {}, {proto:"https"});
            var wait = function() {
                Y.Assert.isObject(returnedQuery);
                Y.Assert.isObject(returnedQuery.query);
                Y.Assert.areEqual(1, returnedQuery.query.count);
            };
            this.wait(wait, 2500);
        },
        test_failed: function() {
            var returnedQuery;
            Y.YQL('select * from weatherFOO.forecast where location=62896', function(r) {
                returnedQuery = r;
            });
            var wait = function() {
                Y.Assert.isObject(returnedQuery);
                Y.Assert.isObject(returnedQuery.error);
            };
            this.wait(wait, 2500);
        },
        test_escaped: function() {
            var returnedQuery;
            Y.YQL("select * from html where url = \"http://instantwatcher.com/genres/506\" and xpath='//div[@id=\"titles\"]/ul/li/a'", function(r) {
                returnedQuery = r;
            });
            var wait = function() {
                Y.Assert.isObject(returnedQuery);
                Y.Assert.isObject(returnedQuery.query);
            };
            this.wait(wait, 2500);
        }
    };
    var suite = new Y.Test.Suite("YQL");
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);

});

