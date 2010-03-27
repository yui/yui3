YUI.add('async-queue-test', function(Y) {

var suite = new Y.Test.Suite("Y.AsyncQueue");

// FIXME: remove this and update the tests to handle the asynchronicity
Y.AsyncQueue.defaults.timeout = -1;

function f() {}

if (!window.console) {
    console = { log: f };
}

suite.add(new Y.Test.Case({
    name : "Queue isntantiation",

    test_instantiation : function () {
        var basic         = new Y.AsyncQueue(),
            withCallbacks = new Y.AsyncQueue(f,f,f,f);

        Y.Assert.areSame(true, basic instanceof Y.AsyncQueue);

        Y.Assert.areSame(0, basic.size());
        Y.Assert.areSame(0, basic._q.length);

        Y.Assert.areSame(4, withCallbacks.size());
        Y.Assert.isFunction(withCallbacks._q[0]);
        Y.Assert.isFunction(withCallbacks.next());
        Y.Assert.areSame(f, withCallbacks.next().fn);
    }
}));

suite.add(new Y.Test.Case({
    name : "queue-base",

    test_next : function () {
        var i = 0;

        YUI({
            useBrowserConsole : false,
            logInclude : { TestRunner: true }
        }).use('queue-base', function (Y) {
            function inc() { i++; }

            var callback,

                q = new Y.Queue(inc, inc, "string", inc);
            
            while ((callback = q.next())) {
                if (Y.Lang.isFunction(callback)) {
                    callback();
                }
            }
        });

        Y.Assert.areSame(3, i);
    }
}));

suite.add(new Y.Test.Case({
    name : "Test API",

    test_chaining : function () {
        var q = new Y.AsyncQueue();
            q.defaults = {
                timeout : 10
            };

        Y.Assert.areSame(q, q.add());
        Y.Assert.areSame(q, q.add(f));
        Y.Assert.areSame(q, q.add(f,f,{fn:f,id:'a'},"garbage"));

        Y.Assert.areSame(q, q.pause());
        Y.Assert.areSame(q, q.promote('a'));
        Y.Assert.areSame(q, q.remove('a'));
        Y.Assert.areSame(q, q.run());
        Y.Assert.areSame(q, q.stop());
    },

    test_add : function () {
        var q = new Y.AsyncQueue(f);

        Y.Assert.areSame(1, q.size());

        q = new Y.AsyncQueue().add(f);
        Y.Assert.areSame(1, q.size());

        q.add(f,f).add(f,f,f);
        Y.Assert.areSame(6, q.size());

        q.add("Only functions and objects are allowed",
              undefined,
              null,
              1,
              true);

        Y.Assert.areSame(6, q.size());

        q.add({},{}); // empty objects are ok, since config can be defaulted
        Y.Assert.areSame(8, q.size());

        // Add from within a callback
        var count = 0;
        function x() {
            count++;
        }
        function addToQueue() {
            this.add(x);
        }

        // Three x calls scheduled.  A fourth added during a callback
        q = new Y.AsyncQueue(x,f,x,addToQueue,f,x).run();

        Y.Assert.areSame(4,count);
    },

    test_remove : function () {

        var results = '',
            self = this,
            q = new Y.AsyncQueue(
                    function () {
                        Y.Assert.areSame(7, this.size());
                        results += 'R';
                    },
                    { id: "remove me", fn: X },
                    {
                        id: "not removed",
                        fn: function () {
                            results += 'E';
                            this.remove('me too');
                        },
                        timeout: 10
                    },
                    { id: "me too", fn: X },
                    function () {
                        this.remove("fail");
                        if (q.size() !== 4) {
                            self.resume(function () {
                                Y.Assert.fail("Expected 3, got " + q.size() + " - remove(n) should defer until callback completion");
                            });
                        }
                        results += 'M';
                    },
                    { id: "fail",
                     fn: function () {
                            self.resume(function () {
                                Y.Assert.fail("This callback should have been removed");
                            });
                         }
                    },
                    function () {
                        if (q.size() !== 2) {
                            self.resume(function () {
                                Y.Assert.fail("Size should be 1");
                            });
                        }
                        results += 'OV';
                    },
                    function () {
                        self.resume(function () {
                            results += 'E';
                            Y.Assert.areSame('REMOVE', results);
                        });
                    });

        function X() {
            q.run();
            results += 'X';
        }

        Y.Assert.areSame(8, q.size());

        // Removal when the Queue is inactive is immediate
        q.remove("remove me");
        Y.Assert.areSame(7, q.size());

        q.run();
        Y.Assert.areSame('R',results);
        Y.Assert.areSame(6, q.size());

        q.remove("not removed");
        Y.Assert.areSame(6, q.size());

        this.wait();
    },

    test_promote : function () {
        function O() {
            results += 'O';
        }

        var results = '',
            self = this,
            q = new Y.AsyncQueue(
                    function () {
                        results += "R";
                    },
                    {
                        id: "p",
                        fn: function () { results += 'P'; }
                    },
                    O,
                    {
                        id: 'm',
                        fn: function () {
                            if (this.count++ > 3) {
                                results += 'M';
                            } else if (!this.count) {
                                q.promote('o');
                            }
                        },
                        context : { count : 0 },
                        iterations : 5
                    },
                    {
                        id : 'o',
                        fn: O,
                        timeout: 10
                    },
                    function () { results += 'E'; },
                    {
                        id : 't',
                        fn : function () {
                            results += 'T';
                        }
                    },
                    function () {
                        self.resume(function () {
                            Y.Assert.areSame('PROMOTE', results);
                        });
                    });

        Y.Assert.isUndefined(q._q[0].id);

        q.promote('p');
        Y.Assert.areSame('p', q._q[0].id);

        q.run();
        Y.Assert.areSame('PROM', results);

        q.promote('t');

        this.wait();
    },

    test_pause : function () {
        var results = '',
            self = this,
            q = new Y.AsyncQueue(
                function () { results += 'P'; },
                {
                    fn: function () {
                        results += 'A';
                    },
                    timeout : 10
                },
                function () {
                    results += 'U';
                },
                function () {
                    results += 'S';
                    this.pause();

                    self.resume(function () {
                        Y.Assert.areSame('PAUS',results);

                        setTimeout(function () {
                            q.run();
                        },10);

                        self.wait();
                    });

                },
                function () {
                    results += 'E';
                    self.resume(function () {
                        Y.Assert.areSame('PAUSE',results);
                    });
                });

        Y.Assert.areSame(5,q.size());
        q.run();

        // Test during timeout
        Y.Assert.areSame('P', results);
        q.pause();

        setTimeout(function () {
            self.resume(function () {
                q.run();
                self.wait();
            });
        }, 20);

        this.wait();
    },

    test_stop : function () {
        var results = "",
            self = this,
            q = new Y.AsyncQueue(
                    function () { results += 'S'; },
                    function () { results += 'T'; },
                    function () { results += 'O'; },
                    function () { results += 'P'; },
                    {
                        fn: function () {
                            self.resume(function () {
                                Y.Assert.fail("Synchronous q.stop() should have cleared this async callback");
                            });
                        },
                        timeout: 10
                    });

        q.run();
        q.stop();
        Y.Assert.areSame('STOP',results);
        Y.Assert.areSame(0,q.size());

        setTimeout(function () {
            self.resume(function () {
                Y.Assert.areSame('STOP',results);
            });
        },100);

        q.run();

        this.wait();
    },

    test_getCallback : function () {
        var c,
            q = new Y.AsyncQueue(
                    { id : 'a', test: 1 },
                    { id : 'b', test: 2, fn: function () {
                            this.pause();
                        }
                    },
                    { id : 'c', test: 3 },
                    { id : 'd', test: 4,
                      fn: function () {
                          Y.Assert.areSame(this._q[0], this.getCallback('d'));
                      }
                    },
                    { id : 'a', test: 5 });

        q.defaults = { fn: function () {} };

        c = q.getCallback('a');
        Y.Assert.isObject(c);
        Y.Assert.areSame(1, c.test);

        q.run();
        c = q.getCallback('a');
        Y.Assert.isObject(c);
        Y.Assert.areSame(5, c.test);

        q.run();
    },

    test_isRunning : function () {
        var self = this,
            q = new Y.AsyncQueue(
                    function () {
                        Y.Assert.areSame(true, this.isRunning());
                    },
                    {
                        fn: function () {
                            q.pause();
                            self.resume(function () {
                                Y.Assert.areSame(false, q.isRunning());
                            });
                        },
                        timeout: 10
                    });

        Y.Assert.areSame(false, q.isRunning());
        q.run();

        Y.Assert.areSame(true, q.isRunning());

        /*
        setTimeout(function () {
            self.resume(function () {
                Y.Assert.areSame(false, q.isRunning());
                q.run(); // run to completion
                Y.Assert.areSame(false, q.isRunning());
            });
        },100);
        */

        this.wait();
    }
}));

suite.add(new Y.Test.Case({
    name : "Test callback config",

    test_fn : function () {
        var results = '',
            q = new Y.AsyncQueue(
                    function () { results += 'R'; },
                    {},
                    function () { results += 'N'; });

        q.defaults = { fn: function () { results += 'U'; } };
        q.run();

        Y.Assert.areSame("RUN", results);

        q.add({ fn : "results += 'X'" },
              { fn : /results += 'X'/ },
              { fn : function () { Y.Assert.areSame("RUN", results); } }).run();
    },

    test_context : function () {
        var a = { id : 'a',
                  test : 'A',
                  fn : function () {
                    Y.Assert.areSame('A', this.test);
                  }
                },

            q = new Y.AsyncQueue({ test : 'callbacks exec from Queue ctx by default' },
                function () { Y.Assert.areSame('X', this.test); },
                {
                    fn: function () {
                        Y.Assert.areSame('X', this.test);
                        this.test = 'Z';
                    }
                },
                function () { Y.Assert.areSame('Z', this.test); },
                a,
                {
                    fn: function () {
                        Y.Assert.areSame('B', this.test);
                    },
                    context : { test : 'B' }
                });

        q.getCallback('a').context = a;

        q.test = 'X';
        q.run();
    },

    test_args : function () {
        (new Y.AsyncQueue(
            function () {
                Y.Assert.areSame(0,arguments.length);
            },
            {
                fn: function () {
                    Y.ArrayAssert.itemsAreSame([1,2,3],arguments);
                },
                args : [1,2,3]
            },
            {
                fn: function () {
                    Y.ArrayAssert.itemsAreSame(['X'],arguments);
                },
                args : 'X'
            })).run();
    },

    test_iterations : function () {
        var results = '',
            self = this;
       
        (new Y.AsyncQueue(
            function () { results += 'A'; },
            { fn: function () { results += 'B'; } },
            { fn: function () { results += 'C'; }, iterations: 3 },
            { fn: function () { results += 'D'; }, iterations: 3, timeout: 10 },
            { fn: function () {
                self.resume(function () {
                    Y.Assert.areSame('ABCCCDDD', results);
                });
              }
            })).run();

        this.wait();
    },

    test_until : function () {
        var results = '',
            self = this;
       
        (new Y.AsyncQueue(
            function () { results += 'A'; },
            {
                fn: function () {
                    results += 'B';
                },
                until: function () {
                    this.data = this.data.slice(1);
                    return !this.data;
                },
                data : '1234'
            },
            {
                fn: function () {
                    results += 'C';
                },
                until: function () {
                    return results.length >= 7;
                },
                timeout: 10
            },
            { fn: function () {
                self.resume(function () {
                    Y.Assert.areSame('ABBBCCC', results);
                });
              }
            })).run();

        Y.Assert.areSame('ABBB', results);

        this.wait();
    },

    test_timeout : function () {
        function inc() { ++results; }

        var results = 0,
            self = this,
                // default timeout -1 triggers synchronous mode
            q = new Y.AsyncQueue(
                inc, // -1 == sync
                { fn: inc }, // -1 == sync
                { fn: inc, timeout: 10, iterations: 4 },
                { fn: inc, timeout: -300, iterations: 4 }, // neg == sync
                // garbage timeout doesn't throw error, but is async
                { fn: inc, timeout: 'a',
                    until: function () {
                        return results >= 10;
                    }
                },
                function () {
                    self.resume(function () {
                        Y.Assert.areSame(10,results);
                    });
                }).run();

        Y.Assert.areSame(2, results);

        this.wait();
    }

    /*
    test_waitForIOResponse : function () {
        function good() {
            var url = 'queue.html?cachebuster='+Y.guid();
            Y.io(url, {
                on : {
                    success : function () { results.success++; },
                    failure : function () { results.failure++; }
                }
            });
        }

        function bad() {
            var url = Y.guid() + (Math.random() * 1000) + '.html'; // 404
            Y.io(url, {
                on : {
                    success : function () { results.success++; },
                    failure : function () { results.failure++; }
                }
            });
        }

        function late() {
            var url = 'io_timeout.php?cachebuster=' + Y.guid();
            Y.io(url, {
                on : {
                    success : function () { results.success++; },
                    failure : function () { results.failure++; },
                    abort   : function () { results.failure++; }
                },
                timeout : 10
            });
        }
        
        function test(s,f,step) {
            return function () {
                var msg = "Incorrect number of ",
                    data;

                if (results.success !== s) {
                    msg += 'successes';
                    data = [s,results.success];
                } else if (results.failure !== f) {
                    msg += 'failures';
                    data = [f,results.failure];
                } else {
                    msg = '';
                }

                if (msg) {
                    msg += ' at step ' + step +
                           '. Expected ' + data[0] + ', got ' + data[1];
                    q.stop();
                    self.resume(function () {
                        Y.Assert.fail(msg);
                    });
                }
            }
        }

        var results = { success: 0, failure: 0 },
            self = this,
            q = new Y.AsyncQueue(
                {
                    fn : good,
                    waitForIOResponse: true
                },
                test(1,0,1),
                {
                    fn : function () { good(); good(); good(); },
                    waitForIOResponse: true
                },
                test(4,0,2),
                {
                    fn : function () { bad(); good(); late(); },
                    waitForIOResponse: true
                },
                test(5,2,3),
                {
                    fn : function () { late(); good(); },
                    waitForIOResponse: true
                },
                test(6,3,4),
                {
                    // wait not triggered
                    fn : function () {
                        bad(); bad();
                    }
                },
                test(6,3,5),
                function () { self.resume(function () {}); }).run();

        this.wait();
    }
    */
}));

suite.add(new Y.Test.Case({
    name : "Test Events",

    test_events : function () {
        var results = [],
            self = this,
            q = new Y.AsyncQueue(
                function () { results.push("E"); this.pause(); },
                {
                    fn: function () { results.push("E"); },
                    until: function () { return results.length > 25; },
                    timeout: 10
                },
                {
                    id: 'x',
                    fn: function () { results.push("X"); }
                },
                {
                    id: 'v',
                    fn: function () { results.push("V"); },
                    iterations: 3
                },
                {
                    fn: function () {
                        results.push("N");
                        Y.io(Y.guid() + '.html', { // 404
                            on : {
                                failure : function () {
                                    results.push("T");
                                }
                            }
                        });
                    },
                    waitForIOResponse : true
                });

        q.on('execute',function () { results.push("(onExec)"); });
        q.after('execute',    function () { results.push("(afterExec)"); });

        q.on("shift",  function () { results.push("(onShift)"); });
        q.after("shift",      function () { results.push("(afterShift)"); });

        q.on("remove", function () { results.push("(onRemove)"); });
        q.after("remove", function () { results.push("(afterRemove)"); });

        q.on("add", function (e) { results.push("(onAdd)"); });
        q.after("add", function (e) {
            var data = e.added;
            results.push("(afterAdd)");
            if (!data || data.length !== 4) {
                self.resume(function () {
                    Y.Assert.fail("add args not right");
                });
            }
        });

        q.on("promote", function () { results.push("(onPromote)"); });

        q.after("promote", function () {
            results.push("(afterPromote)");
            setTimeout(function () {
                q.run();
            }, 0);
        });

        q.on("complete", function () {
            results.push("(onComplete)");
            self.resume(function () {
                Y.ArrayAssert.itemsAreEqual([
                    "(onAdd)",
                    "(afterAdd)",

                    "(onRemove)",
                    "(afterRemove)",

                    "(onExec)",
                    "E",
                    "(afterExec)",

                    "(onShift)",
                    "(afterShift)",

                    "(onPromote)",
                    "(afterPromote)",

                    "(onExec)",
                    "V",
                    "(afterExec)",
                    "(onExec)",
                    "V",
                    "(afterExec)",
                    "(onExec)",
                    "V",
                    "(afterExec)",

                    "(onShift)",
                    "(afterShift)",

                    "(onExec)",
                    "E",
                    "(afterExec)",
                    "(onExec)",
                    "E",
                    "(afterExec)",

                    "(onShift)",
                    "(afterShift)",

                    "(onExec)",
                    "N",
                    "(afterExec)",

                    "(onShift)",
                    "(afterShift)",

                    /*
                    "(onExec)",
                    "T",
                    "(afterExec)",
                    "(onShift)",
                    "(afterShift)",
                    */

                    "(onExec)",
                    "S",
                    "(afterExec)",

                    /* // no shift because stop() flushed _q
                    "(onShift)",
                    "(afterShift)",
                    */

                    "(onComplete)"
                    ], results);
            });
        });

        q.add(function () { results.push("S"); this.stop(); },f,f,f);
        q.remove('x');

        q.run();
        q.promote('v');

        this.wait();
    },

    test_preventCallback : function () {
        function inc () { i++; }

        var i = 0,
            q = new Y.AsyncQueue(inc,inc,
                {
                    foo: true,
                    fn: inc,
                    iterations: 20
                },
                {
                    fn: inc,
                    until : function () {
                        return i >= 10;
                    }
                });

        q.on('execute', function (e) {
            if (e.callback.foo) {
                e.preventDefault();
            }
        });

        q.run();

        Y.Assert.areSame(10,i);

        q = new Y.AsyncQueue(inc, inc, inc, inc, inc, inc, inc, inc, inc, inc);
        q.on('shift', function (e) {
            if (i % 2) {
                e.preventDefault();
                q._q[0].iterations++;
            }
        });

        q.run();

        Y.Assert.areSame(30, i);
    }
}));

/*
// Avoiding a Y.Test bug where tests repeat infinitely
suite.add(new Y.Test.Case({
    name : "From bugs",

    // Bug 2528602
    test_double_exec_when_pause_and_run_async : function () {
        var q = new Y.AsyncQueue(),
            register = 0,
            self = this;

        q.defaults.timeout = 10;
        q.add({
            id: 'one',
            fn: function() {
                q.pause();
                register += 1;
                q.run();
            }
        }, {
            id: 'two',
            fn: function() {
                register += 10;
            },
            iterations: 1
        });

        q.on( 'complete', function () {
            self.resume( function () {
                Y.Assert.areSame( 11, register );
            } );
        } );
        
        q.run();

        this.wait();

    }
}));
*/

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['test', 'async-queue', 'io-base']});
