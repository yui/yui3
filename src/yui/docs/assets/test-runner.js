(function() {

    var tests = (window.location.search.match(/[?&]tests=([^&]+)/) || [])[1] || null,
        filter = (window.location.search.match(/[?&]filter=([^&]+)/) || [])[1] || null,
        name = YUI.Env.Tests.name,
        projectAssets = YUI.Env.Tests.project,
        assets = YUI.Env.Tests.assets,
        auto = YUI.Env.Tests.auto;

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
        YUI.Env.windowError = msg;
        return true;
    };
    var mods = {
        'runner-css': projectAssets + '/yui/test-runner.css'
    };
    mods[name + '-tests'] = {
        fullpath: assets + '/' + name + '-tests.js',
        requires: [ 'test', 'runner-css' ]
    };

    YUI({
        modules: mods
    }).use(name + '-tests', 'test-console', function(Y, status) {
        
        var log = Y.Node.create('<div id="logger" class="yui3-skin-sam"/>');
        Y.one('body').prepend(log);

        var testConsole = (new Y.Test.Console()).render('#logger');
        testConsole.collapse();

        var counter = 0,
        count = function() {
            counter++;
        },
        testCase = new Y.Test.Case({
            name: 'Checking for load failure',
            'automated test script loaded': function() {
                Y.Assert.isTrue(status.success, 'Automated script 404ed');
            },
            'test: onerror': function() {
                Y.Assert.isUndefined(YUI.Env.windowError, 'window.onerror fired');
            },
            'check for automated test execution': function() {
                Y.Assert.isTrue(Y.Test.Runner.masterSuite.items.length > 1, 'Automated script does not contain a test');
            },
            'check for assertions': function() {
                var num = Y.Object.keys(this).length - 3; //name, _should & this test
                Y.Assert.areNotSame(num, counter, 'Automated script contains no tests');
            }
        });

        Y.Test.Runner.on('pass', count);
        Y.Test.Runner.on('fail', count);
        Y.Test.Runner.on('ignored', count);

        Y.Test.Runner.add(testCase);
        
        Y.Test.Runner._ignoreEmpty = false;
        Y.Test.Runner.setName('Automated ' + name + ' tests');
        Y.Test.Runner.on('complete', function(e) {
            var header = log.one('.yui3-console-hd h4');

            if (e.results.failed) {
                log.addClass('failed');
                header.setHTML(e.results.failed + ' tests failed!');
                testConsole.expand();
            } else {
                header.setHTML('All tests passed!');
                log.addClass('passed');
            }
        });
        Y.Test.Runner.run();
    });

}());


