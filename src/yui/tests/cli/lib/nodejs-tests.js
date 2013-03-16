var path = require('path');

YUI.add('core-nodejs-tests', function(Y) {

    var suite = new Y.Test.Suite('YUI Node.js Tests'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'setLoadHook',
        'YUI._getLoadHook should be null': function() {
            Y.Assert.isNull(YUI._getLoadHook);
        },
        'YUI.setLoadHook should be a function': function() {
            Y.Assert.isFunction(YUI.setLoadHook);
        },
        'YUI._getLoadHook should NOT be null': function() {
            YUI.setLoadHook(function() {});
            Y.Assert.isNotNull(YUI._getLoadHook);
        },
        'YUI._getLoadHook should be null again': function() {
            YUI.setLoadHook(null);
            Y.Assert.isNull(YUI._getLoadHook);
        },
        'HOOK should be used': function() {
            var used = false;
            Assert.isUndefined(YUI._HOOK_LOADED);
            YUI.setLoadHook(function(data) {
                used = true;
                data += '\n\nYUI._HOOK_LOADED = true;\n';
                return data;
            });
            Y.applyConfig({
                useSync: true,
                modules: {
                    'loadhook-test': path.join(__dirname, './loadhook-test.js')
                }
            });
            Y.use('loadhook-test');
            Assert.isTrue(used);
            Assert.isTrue(Y.LOADHOOK);
            Assert.isTrue(YUI._HOOK_LOADED);
            delete YUI._HOOK_LOADED;
                
        }
    }));


    Y.Test.Runner.add(suite);

});
