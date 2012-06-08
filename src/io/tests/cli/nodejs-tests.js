YUI.add('nodejs-tests', function(Y) {

    var suite = new Y.Test.Suite('NodeJS IO tests');

    suite.add(new Y.Test.Case({
        name: 'NodeJS IO Tests',
        'test: Get Request with empty data object': function() {
            var test = this,
                status,
                handler = function() {
                    Y.Assert.areSame(200, status);
                };  

            Y.io(Y.IO.URLS.get, {
                data: {},
                on: {
                    success: function(i, o, a) {
                        status = o.status;
                        test.resume(handler);
                    }
                }
            });

            this.wait(null, 1000); 
        },
        'test: Get Request with data object': function() {
            var test = this,
                status,
                handler = function() {
                    Y.Assert.areSame(200, status);
                };  

            Y.io(Y.IO.URLS.get, {
                data: {
                    foo: 'bar'
                },
                on: {
                    success: function(i, o, a) {
                        status = o.status;
                        test.resume(handler);
                    }
                }
            });

            this.wait(null, 1000); 
        },
        'test: Get Request with data string': function() {
            var test = this,
                status,
                handler = function() {
                    Y.Assert.areSame(200, status);
                };  

            Y.io(Y.IO.URLS.get, {
                data: 'foo=bar&bob=uncle',
                on: {
                    success: function(i, o, a) {
                        status = o.status;
                        test.resume(handler);
                    }
                }
            });

            this.wait(null, 1000); 
        }
    }));

    Y.Test.Runner.add(suite);

});
