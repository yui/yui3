YUI.add('get-vendor-test', function (Y) {

    Y.GetTests = new Y.Test.Suite("get vendor");

    Y.GetTests.vendor = new Y.Test.Case({
        name: "Y.get vendor tests",

        'test: global to work across runtimes' : function() {
            Y.Assert.areEqual(1, Y.foo, 'Y.config.global.foo is not set correctly');
        }
    });

}, '', {
    requires: ['get', 'vendor-script-signed', 'test']
});
