(function() {

    var tests = (window.location.search.match(/[?&]tests=([^&]+)/) || [])[1] || null,
        filter = (window.location.search.match(/[?&]filter=([^&]+)/) || [])[1] || null,
        manual = (window.location.search.match(/[?&]manual=([^&]+)/) || [])[1] || null,
        showConsole = (window.location.search.match(/[?&]console=([^&]+)/) || [])[1] || null,
        name = YUI.Env.Tests.name,
        title = YUI.Env.Tests.title,
        projectAssets = YUI.Env.Tests.project,
        assets = YUI.Env.Tests.assets,
        auto = YUI.Env.Tests.auto || YUI().UA.phantomjs,
        examples = YUI.Env.Tests.examples,
        newWindow = YUI.Env.Tests.newWindow,
        isExample = false, i;

    
    for (i = 0; i < examples.length; i++) {
        if (name === examples[i]) {
            isExample = true;
        }
    }
    if (newWindow === 'true') {
        isExample = false;
    }

    if (!isExample) { //Don't test landing pages
        return false;
    }

    if (auto) {
        filter = filter || 'raw';
        tests = true;
    }

    if (filter) {
        YUI.applyConfig({
            filter: filter
        });
    }

    if (!tests) {
        //Abort the tests.
        return;
    }

    window.onerror = function(msg) {
        if (msg.indexOf('Error loading script') === -1) {
            YUI.Env.windowError = msg;
        }
        return true;
    };
    var mods = {
        'runner-css': projectAssets + '/yui/test-runner.css'
    };
    mods[name + '-tests'] = {
        fullpath: assets + '/' + name + '-tests.js',
        requires: [ 'test', 'runner-css' ]
    };

    mods[name + '-manual-tests'] = {
        fullpath: assets + '/' + name + '-manual-tests.js',
        requires: [ name + '-tests' ]
    };

    var defaultMod = name + (manual ? '-manual' : '') + '-tests';

    YUI({
        modules: mods
    }).use(defaultMod, 'test-console', function(Y, status) {
        var log, testConsole,
            renderLogger = function() {
                if (!log) {
                    log = Y.Node.create('<div id="logger" class="yui3-skin-sam"/>');
                    Y.one('body').prepend(log);
                    testConsole = (new Y.Test.Console()).render('#logger');
                    testConsole.collapse();
                    if (!auto && !showConsole) {
                        testConsole.hide();
                    }
                }
        };

        renderLogger();
        
        Y.Test.Case.prototype._poll = function(condition, period, timeout, success, failure, startTime) {

            var currentTime = (new Date()).getTime(),
                test = this;

            if (startTime === undefined) {
                startTime = currentTime;
            }

            if ((currentTime + period) - startTime < timeout) {
                Y.later(period, null, function() {
                    if (condition()) {
                        test.resume(success);
                    } else {
                        test._poll(condition, period, timeout, success, failure, startTime);
                    }
                });
            } else if (failure) {
                test.resume(failure);
            }
        };

        Y.Test.Case.prototype.poll = function(condition, period, timeout, success, failure) {
            this._poll(condition, period, timeout, success, failure);
            this.wait(timeout + 1000);
        };
      
        //This is a temporary fix for functional tests that are affected by #2532840. The ultimate fix is address subpixel issues with Dom.setXY().  
        Y.Test.Case.prototype.closeEnough = function(expected, actual) { 
            return (Math.abs(expected - actual) < 2);
        };

        var counter = 0,
        count = function() {
            counter++;
        },
        testCase = new Y.Test.Case({
            name: 'Checking for load failure',
            'automated test script loaded': function() {
                if (!status.success) {
                    if (status.msg) {
                        if (status.msg.indexOf(name + '-manual-tests.js') > -1) {
                            Y.Assert.isTrue(true);
                            return; // return here and don't throw on this test.
                        }
                    }
                }
                Y.Assert.isTrue(status.success, 'Automated script 404ed');
            },
            'window.onerror called': function() {
                Y.Assert.isUndefined(YUI.Env.windowError, 'window.onerror fired');
            },
            'check for automated Y.TestCase': function() {
                Y.Assert.isTrue(Y.Test.Runner.masterSuite.items.length > 1, 'Automated script does not contain a Y.Test.Case');
            },
            'check for tests': function() {
                var num = Y.Object.keys(this).length - 3; //name, _should & this test
                if (num === counter) {
                    Y.Assert.fail('Automated script contains no tests');
                }
                Y.Assert.pass('All Good');
            }
        });

        Y.Test.Runner.on('pass', count);
        Y.Test.Runner.on('fail', count);
        Y.Test.Runner.on('ignored', count);

        Y.Test.Runner.add(testCase);
        
        Y.Test.Runner._ignoreEmpty = false; //Throw on no assertions
        Y.Test.Runner.setName(title);
        Y.Test.Runner.on('complete', function(e) {
            
            if (e.results.failed) {
                testConsole.show();
            }

            if (log) {
                var header = log.one('.yui3-console-hd h4');

                if (e.results.failed) {
                    log.addClass('failed');
                    header.setHTML(e.results.failed + ' tests failed!');
                    testConsole.expand();
                } else {
                    header.setHTML('All tests passed!');
                    log.addClass('passed');
                }
            }
        });
        Y.Test.Runner.run();
    });

}());
