YUI({
    base: '../../../build/',
    filter: 'DEBUG',
    //filter: 'RAW',
    logExclude: {
        'yui': true,
        event: true,
        base: true,
        attribute: true,
        augment: true
    },
    useConsole: true
}).use('yql', 'console', 'test', 'substitute', 'selector-css3', function(Y) {
        var myConsole = new Y.Console({
            height: Y.one(window).get('winHeight') + 'px',
            width: '375px'
        }).render();    
            

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
            this.wait(wait, 1500);
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
            this.wait(wait, 1500);
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
            this.wait(wait, 1500);
        }
    };
    var suite = new Y.Test.Suite("YQL");
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);
    Y.Test.Runner.run();
});

