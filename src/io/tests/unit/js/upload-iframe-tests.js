YUI.add('upload-iframe-tests', function(Y, NAME) {

    var suite = new Y.Test.Suite('IO Upload iFrame Tests');

    form  = Y.one('#test-form');

    suite.add(new Y.Test.Case({
        name: 'Basic tests',
        setUp: function() {
            this.form = Y.one('#test-form');
            this.config = {
                method: 'POST',
                form: {
                    id: 'test-form',
                    upload: true
                },
                on: {}
            };
        },

        tearDown: function () {
            if (typeof this.form !== 'undefined') {
                this.form.remove();
                delete this.form;
            }
            form.cloneNode(true).appendTo('body');
        },

        'Execution should create an iFrame': function () {
            var Test = this,
                config = this.config,
                request;

            Y.Assert.areSame(0, Y.all('iframe').size());
            request = Y.io(Y.IO.URLS.post, config);
            Y.Assert.areSame(1, Y.all('iframe').size());

            // Delay required to let the transaction complete
            Y.later(100, this, Test.resume);
            Test.wait();
        },

        'Execution should remove the iFrame on completion': function () {
            var Test = this,
                config = this.config,
                request;

            config.on['complete'] = function (id, transaction) {
                // It takes a bit to remove the iframe
                Y.later(100, this, function () {
                    Test.resume(function () {
                        Y.Assert.areSame(0, Y.all('iframe').size());
                    });
                });
            };

            request = Y.io(Y.IO.URLS.post, config);

            Test.wait();
        },

        'Execution should report inProgress = true': function () {
            var Test = this,
                config = this.config,
                request;

            request = Y.io(Y.IO.URLS.delay, config);

            config.on['complete'] = function (id, transaction) {
                // It takes a bit to remove the iframe
                Y.later(100, this, function () {
                    Test.resume(function () {
                        Y.Assert.areSame(0, Y.all('iframe').size());
                    });
                });
            };

            Y.Assert.isTrue(request.isInProgress());

            Test.wait();
        }
    }));


/*
    These timeout tests might need a little more work (see: Android) before they
    are ready for CI.

    suite.add(new Y.Test.Case({
        name: 'Timeout tests',
        setUp: function() {
            this.form = Y.one('#test-form');
            this.timeout = 100;
            this.config = {
                method: 'POST',
                form: {
                    id: this.form,
                    upload: true
                },
                timeout: this.timeout,
                on: {}
            };
        },

        tearDown: function () {
            this.form.remove();
            delete this.form;
            form.cloneNode(true).appendTo('body');
        },

        'Setting timeout should create a timeout': function () {
            var Test = this,
                config = this.config,
                request;

            request = Y.io(Y.IO.URLS.post, config);

            Y.Assert.isNumber(request.io._timeout[request.id]);

            // Delay required to let the transaction complete
            Y.later(100, this, Test.resume);
            Test.wait();
        },

        'Setting timeout should clear the timeout': function () {
            var Test = this,
                config = this.config,
                request;

            request = Y.io(Y.IO.URLS.post, config);

            Y.later(200, this, function () {
                Test.resume(function () {
                    Y.Assert.isUndefined(request.io._timeout[request.id]);
                });
            });

            Test.wait();
        },

        'Elapsing the timeout should report an error': function () {
            var Test = this,
                config = this.config,
                timeout = this.timeout,
                then = Y.Lang.now(),
                completesFired = 0,
                expected = timeout * 1.2,
                request, now, elapsed;

            config.on['complete'] = function (id, transaction) {
                Y.one('#io_iframe' + id).detach('load'); // TODO: io-upload-frame should do this for you.  Without detaching, 'complete' will fire twice.
                Test.resume(function () {
                    now = Y.Lang.now();
                    elapsed = now - then;
                    // Now make sure it timed out beneath the threshold, plus a small buffer
                    if (elapsed < expected) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail('Transaction did not timeout underneath the requested threshold. Expected ' + expected + ', got ' + elapsed);
                    }
                });
            };

            request = Y.io(Y.IO.URLS.delay, config);

            Test.wait();
        }
    }));
*/


    suite.add(new Y.Test.Case({
        name: 'Attribute tests',
        setUp: function() {
            this.form = Y.one('#test-form');
            this.config = {
                method: 'POST',
                form: {
                    id: this.form,
                    upload: true
                },
                on: {}
            };
        },

        tearDown: function () {
            this.form.remove();
            delete this.form;
            form.cloneNode(true).appendTo('body');
        },

        'Form attributes should set to new values upon execution': function () {
            var Test = this,
                form = this.form,
                config = this.config,
                request;

            request = Y.io(Y.IO.URLS.post, config);

            Y.Assert.areNotSame("", form.get('action'));
            Y.Assert.areNotSame("", form.get('target'));

            // Delay required to let the transaction complete
            Y.later(100, this, Test.resume);
            Test.wait();
        },

        'Form attributes should reset to original values upon completion': function () {
            var Test = this,
                form = this.form,
                config = this.config,
                request;

            config.on['end'] = function () {
                Test.resume(function () {
                    Y.Assert.areSame("", form.get('action'));
                    Y.Assert.areSame("", form.get('target'));
                });
            };

            request = Y.io(Y.IO.URLS.post, config);

            Test.wait();
        },

        'Form attribute resetting should not happen if the form was removed before completion': function () {
            var Test = this,
                form = this.form.cloneNode(true),
                config = this.config,
                request;

            config.form.id = 'test-form-removal';
            form.set('id', config.form.id);
            form.appendTo('body');

            config.on.end = function () {
                Test.resume(function () {
                    Y.Assert.isNull(Y.one('#' + config.form.id));
                });
            };

            config.on.start = function() {
                form.remove(true);
            };

            request = Y.io(Y.IO.URLS.post, config);

            Test.wait();
        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Abort tests',
        setUp: function() {
            this.form = Y.one('#test-form');
            this.config = {
                method: 'POST',
                form: {
                    id: this.form,
                    upload: true
                },
                on: {}
            };
        },

        tearDown: function () {
            this.form.remove();
            delete this.form;
            form.cloneNode(true).appendTo('body');
        },

        'Abort should return a transaction with no keys': function () {
            var Test = this,
                config = this.config,
                request;

            config.on['complete'] = function (id, transaction) {
                Test.resume(function () {
                    Y.ObjectAssert.ownsNoKeys(transaction);
                });
            };

            request = Y.io(Y.IO.URLS.delay, config);

            Y.later(100, this, function () {
                request.abort();
            });

            Test.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Data tests',
        setUp: function() {
            this.form = Y.one('#test-form');
            this.origRemoveData = Y.IO.prototype._removeData,
            this.config = {
                method: 'POST',
                form: {
                    id: this.form,
                    upload: true
                },
                data: {
                    foo: 'bar',
                    baz: 'bop'
                }
            };
        },

        tearDown: function () {
            var form = this.form,
                config = this.config,
                origRemoveData = this.origRemoveData;

            Y.IO.prototype._removeData = origRemoveData;

            Y.Array.each(Y.Object.keys(this.config.data), function (name) {
                form.all('input[name=' + name + ']').each(function(node) {
                    form.removeChild(node);
                });
            });

            form.cloneNode(true).appendTo('body');
        },

        'Hidden input nodes should be created for each `data` element': function () {
            var Test = this,
                config = this.config,
                form = this.form,
                removeDataExecuteCount = 0,
                origRemoveData = Y.IO.prototype._removeData,
                request, size;

            // Overwrite this method, because it will delete what is attempting to be tested
            Y.IO.prototype._removeData = function () {
                removeDataExecuteCount++;
            };

            request = Y.io(Y.IO.URLS.post, config);

            Y.later(100, this, function () {
                Test.resume(function(){
                    Y.Array.each(Y.Object.keys(config.data), function (name) {
                        size = form.all('input[name=' + name + ']').size();
                        Y.Assert.areSame(1, size);
                    });
                    Y.Assert.areSame(1, removeDataExecuteCount);
                });
            });

            Test.wait();
        },

        'Hidden input nodes should be removed after upload': function () {
            var Test = this,
                config = this.config,
                form = this.form,
                request, size;

            request = Y.io(Y.IO.URLS.post, config);

            Y.later(100, this, function () {
                Test.resume(function(){
                    Y.Array.each(Y.Object.keys(config.data), function (name) {
                        size = form.all('input[name=' + name + ']').size();
                        Y.Assert.areSame(0, size);
                    });
                });
            });

            Test.wait();
        }
    }));

    Y.Test.Runner.add(suite);
});
