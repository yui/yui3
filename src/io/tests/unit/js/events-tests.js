YUI.add('events-tests', function(Y) {

    var suite = new Y.Test.Suite('IO Events Tests');

    suite.add(new Y.Test.Case({
        name: 'Transaction flow test',
        testSuccess: function() {
            var actual = [], t = this;
            this.success = ['start', 'complete', 'success', 'end'],
            this.compare = function() {
                for (var i=0; i < 4; i++) {
                    Y.Assert.areSame(t.success[i], actual[i]);
                }
            };
            Y.io(Y.IO.URLS.http + '200', {
                on: {
                    start: function() {
                        actual.push('start');
                    },
                    complete: function() {
                        actual.push('complete');
                    },
                    success: function() {
                        actual.push('success');
                    },
                    end: function() {
                        actual.push('end');
                        t.resume(t.compare);
                    }
                }
            });
            this.wait(null, 1000);
        },
        test404Failure: function() {
            var actual = [], t = this;
            this.failure = ['start', 'complete', 'failure', 'end'],
            this.compare = function() {
                for (var i=0; i < 4; i++) {
                    Y.Assert.areSame(t.failure[i], actual[i]);
                }
            };
            Y.io(Y.IO.URLS.non, {
                on: {
                    start: function() {
                        actual.push('start');
                    },
                    complete: function() {
                        actual.push('complete');
                    },
                    failure: function() {
                        actual.push('failure');
                    },
                    end: function() {
                        actual.push('end');
                        t.resume(t.compare);
                    }
                }
            });
            this.wait(null, 1000);
        },
        test500Failure: function() {
            var actual = [], t = this;
            this.failure = ['start', 'complete', 'failure', 'end'],
            this.compare = function() {
                Y.Assert.areSame(500, t.status);
                for (var i=0; i < 4; i++) {
                    Y.Assert.areSame(t.failure[i], actual[i]);
                }
            };
            Y.io(Y.IO.URLS.http + '500', {
                on: {
                    start: function() {
                        actual.push('start');
                    },
                    complete: function(id, o, a) {
                        actual.push('complete');
                    },
                    failure: function(id, o, a) {
                        actual.push('failure');
                        t.status = o.status;
                    },
                    end: function() {
                        actual.push('end');
                        t.resume(t.compare);
                    }
                }
            });
            this.wait(null, 1000);
        },
        testHttpException: function() {
            var actual = [], t = this;
            this.failure = ['start', 'complete', 'failure', 'end'],
            this.compare = function() {
                for (var i=0; i < 4; i++) {
                    Y.Assert.areSame(t.failure[i], actual[i]);
                }
            };
            Y.io(Y.IO.URLS.http + '999', {
                on: {
                    start: function() {
                        actual.push('start');
                    },
                    complete: function() {
                        actual.push('complete');
                    },
                    failure: function(id, o, a) {
                        actual.push('failure');
                        t.status = o.status;
                    },
                    end: function() {
                        actual.push('end');
                        t.resume(t.compare);
                    }
                }
            });
            this.wait(null, 1000);
        },
        test304: function() {
            var actual = [], t = this;
            this.success = ['start', 'complete', 'end'],
            this.compare = function() {
                for (var i=0; i < 3; i++) {
                    Y.Assert.areSame(t.success[i], actual[i]);
                }
            };
            Y.io(Y.IO.URLS.http + '304', {
                on: {
                    start: function() {
                        actual.push('start');
                    },
                    complete: function() {
                        actual.push('complete');
                    },
                    end: function() {
                        actual.push('end');
                        t.resume(t.compare);
                    }
                }
            });
            this.wait(null, 1000);
        }
    }));

    Y.Test.Runner.add(suite);

});
