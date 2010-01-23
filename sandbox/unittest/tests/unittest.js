YUI.add('unittest', function(Y) {

Y.namespace('UnitTests');

function UnitTest() {
    this._init();
}

UnitTest.prototype = {

    _init : function () {
        this._q = new Y.Queue();

        // TODO: Allow log output or consume events for data collection?
        // Y.Test.Runner.disableLogging();
    },
    
    run : function () {
        var tests = arguments.length ?
                Y.Array(arguments,0,true) :
                Y.Object.keys(Y.UnitTests),
            t;

        Y.Array.each(tests, function (name) {
            t = Y.UnitTests[name];

            if (t) {
                var T   = YUI(t.YUI_CONFIG || Y.merge(Y.config)),
                    use = t.USE || [];

                use.push(Y.bind(Y.UnitTest._runTest, T, t));

                T.use.apply(T, use);
            }
        });
    },

    _runTest : function (config, T) {
        Y.Test.Runner.clear();

        var suite = new Y.Test.Suite(config.NAME);

        Y.each(config.apiTests, function (t, name) {
            var test = new Y.Test.Case(t);
            test.name = name;

            suite.add(test);
        });

        Y.Test.Runner.add(suite);
        Y.Test.Runner.run();
    }

};

Y.UnitTest = new UnitTest();


}, '@VERSION@' ,{requires:['test']});
