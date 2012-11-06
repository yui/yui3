YUI.add('nodejs-tests', function(Y) {
    
    var http = require('http');
    var suite = new Y.Test.Suite('NodeJS IO tests');

    suite.add(new Y.Test.Case({
        name: 'NodeJS IO Tests',
        'test: 404 status Text': function() {
            var test = this;

            Y.io(Y.IO.URLS.http + '404', {
                on: {
                    complete: function(i, o, a) {
                        test.resume(function() {
                            Y.Assert.areSame(404, o.status);
                            Y.Assert.areSame(http.STATUS_CODES['404'], o.statusText);
                        });

                    }
                }
            });

            this.wait(null, 1000); 
        },
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
            var test = this;

            Y.io(Y.IO.URLS.get, {
                data: {
                    foo: 'bar'
                },
                on: {
                    success: function(i, o, a) {
                        test.resume(function() {
                            Y.Assert.areSame(200, o.status);
                            Y.Assert.areSame('OK', o.statusText);
                            Y.Assert.areSame('foo=bar', o.responseText);
                        });

                    }
                }
            });

            this.wait(null, 1000); 
        },
        'test: Get Request with data string': function() {
            var test = this;

            Y.io(Y.IO.URLS.get, {
                data: 'foo=bar&bob=uncle',
                on: {
                    success: function(i, o, a) {
                        test.resume(function() {
                            Y.Assert.areSame(200, o.status);
                            Y.Assert.areSame('foo=bar&bob=uncle', o.responseText);
                        });
                    }
                }
            });

            this.wait(null, 1000); 
        },
        'test: Get Request with data string and querystring': function() {
            var test = this;

            Y.io(Y.IO.URLS.get + '?baz=foobar', {
                data: 'foo=bar&bob=uncle',
                on: {
                    success: function(i, o, a) {
                        test.resume(function() {
                            Y.Assert.areSame(200, o.status);
                            Y.Assert.areSame('baz=foobar&foo=bar&bob=uncle', o.responseText);
                        });
                    }
                }
            });

            this.wait(null, 1000); 
        }
    }));

    Y.Test.Runner.add(suite);

});
