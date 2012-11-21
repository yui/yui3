YUI.add('globalevents-tests', function(Y) {

    var suite = new Y.Test.Suite('IO Global Events Tests');

    suite.add(new Y.Test.Case({
        name: 'Success flow test',
        setUp: function() {
            var t = this;
            this.a0 = [];
            this.a1 = ['start', 'complete', 'success', 'end'];

            this.start = function(id, a) {
                t.a0.push(a);
            };
            this.complete = function(id, o, a) {
                t.a0.push(a);
            };
            this.success = function(id, o, a) {
                t.a0.push(a);
            };
            this.end = function(id, a) {
                t.a0.push(a);
                t.resume(t.resolve);
            };
            this.resolve = function() {
                for (var i=0; i < 4; i++) {
                    Y.Assert.areSame(t.a1[i], t.a0[i]);
                }
            };
            this.start = Y.on('io:start', t.start, t, 'start');
            this.complete = Y.on('io:complete', t.complete, t, 'complete');
            this.success = Y.on('io:success', t.success, t, 'success');
            this.end = Y.on('io:end', t.end, t, 'end');
        },
        tearDown: function() {
            this.start.detach();
            this.complete.detach();
            this.success.detach();
            this.end.detach();
        },
        testSuccessFlow: function() {
            Y.io(Y.IO.URLS.get);
            this.wait(null, 1000);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Failure flow test',
        setUp: function() {
            var t = this;
            this.a0 = [];
            this.a2 = ['start', 'complete', 'failure', 'end'];

            this.start = function(id, a) {
                t.a0.push(a);
            };
            this.complete = function(id, o, a) {
                t.a0.push(a);
            };
            this.failure = function(id, o, a) {
                t.a0.push(a);
            };
            this.end = function(id, a) {
                t.a0.push(a);
                t.resume(t.resolve);
            };
            this.resolve = function() {
                for (var i=0; i < 4; i++) {
                    Y.Assert.areSame(t.a2[i], t.a0[i]);
                }
            };
            this.start = Y.on('io:start', t.start, t, 'start');
            this.complete = Y.on('io:complete', t.complete, t, 'complete');
            this.failure = Y.on('io:failure', t.failure, t, 'failure');
            this.end = Y.on('io:end', t.end, t, 'end');
        },
        tearDown: function() {
            this.start.detach();
            this.complete.detach();
            this.failure.detach();
            this.end.detach();
        },
        testFailureFlow: function() {
            Y.io(Y.IO.URLS.http + '404');
            this.wait(null, 1000);
        }
    }));

    Y.Test.Runner.add(suite);
});
