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
            var test = this;
            
            Y.YQL('select * from weather.forecast where location=62896', function(r) {
                test.resume(function() {
                    Y.Assert.isObject(r, 'Query Failure');
                    Y.Assert.isObject(r.query, 'Query object not present');
                    Y.Assert.areEqual(1, r.query.count, 'Query Count not correct');
                });
            });

            this.wait();
        },

        test_https: function() {
            var test = this;

            Y.YQL('select * from weather.forecast where location=62896', function(r) {

                test.resume(function() {
                    Y.Assert.isObject(r, 'Query Failure');
                    Y.Assert.isObject(r.query, 'Query object not present');
                    Y.Assert.areEqual(1, r.query.count, 'Query Count not correct');
                });

            }, {}, {proto:"https"});

            this.wait();
        },

        test_failed: function() {
            var test = this;

            Y.YQL('select * from weatherFOO.forecast where location=62896', function(r) {
                test.resume(function() {
                    Y.Assert.isObject(r, 'Query Failure');
                    Y.Assert.isObject(r.error, 'Query did not produce an error object');
                });
            });

            this.wait();
        },
        test_escaped: function() {
            var test = this;
            
            Y.YQL("select * from html where url = \"http://instantwatcher.com/genres/506\" and xpath='//div[@id=\"titles\"]/ul/li/a'", function(r) {
                test.resume(function() {
                    Y.Assert.isObject(r, 'Query Failure');
                    Y.Assert.isObject(r.query, 'Query object not present');
                });
            });

            this.wait();
        },
        test_requery: function() {
            var test = this,
                counter = 0;
            
            var q = Y.YQL('select * from weather.forecast where location=62896', function(r) {
                counter++;
                if (counter === 1) {
                    q.send();
                } else {
                    test.resume(function() {
                        Y.Assert.isTrue((counter === 2), 'Query did not send twice');
                        Y.Assert.isObject(r, 'Query Failure');
                        Y.Assert.isObject(r.query, 'Query object not present');
                    });
                }
            });

            this.wait();
        },
        'test: context as option': function() {
            var test = this;

            var q = Y.YQL('select * from weather.forecast where location=62896', function(r) {
                var context = this;
                test.resume(function() {
                    Y.Assert.isInstanceOf(YUI, context, 'Context object not YUI');
                    Y.Assert.isObject(r, 'Query Failure');
                    Y.Assert.isObject(r.query, 'Query object not present');
                });
            }, {}, {
                context: Y
            });

            this.wait();
        },
        'test: context as param': function() {
            var test = this;

            var q = Y.YQL('select * from weather.forecast where location=62896', function(r) {
                var context = this;
                test.resume(function() {
                    Y.Assert.isInstanceOf(YUI, context, 'Context object not YUI');
                    Y.Assert.isObject(r, 'Query Failure');
                    Y.Assert.isObject(r.query, 'Query object not present');
                });
            }, {
                context: Y
            });

            this.wait();
        },
        'test: success handler': function() {
            var test = this;

            Y.YQL('select * from weather.forecast where location=62896', {
                on: {
                    success: function(r) {
                        test.resume(function() {
                            Y.Assert.isObject(r, 'Query Failure');
                        });
                    },
                    failure: function(r) {
                        test.resume(function() {
                            Y.Assert.fail('Should not execute the failure handler');
                        });
                    }
                }
            });

            this.wait();
        },
        'test: failure handler': function() {
            var test = this;

            Y.YQL('select * from weatherFOO.forecast where location=62896', {
                on: {
                    success: function(r) {
                        test.resume(function() {
                            Y.Assert.fail('Should not execute the success handler');
                        });
                    },
                    failure: function(r) {
                        test.resume(function() {
                            Y.Assert.isObject(r, 'Query Failure');
                        });
                    }
                }
            });

            this.wait();
        }
    };
    var suite = new Y.Test.Suite("YQL");
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);

});

