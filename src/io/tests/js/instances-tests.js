YUI.add('instances-tests', function(Y) {

    var suite = new Y.Test.Suite('IO Instances Tests');

    suite.add(new Y.Test.Case({
        name: 'Static Instance of Y.IO',

        'test: static': function() {
            var instance1 = new Y.IO(),
                static1 = Y.io(IO_URLS.get + '?test=static', {});

            //I think this should be `areNotEqual`
            Y.Assert.areEqual(instance1._uid, static1.io._uid);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Compare IO Instances',

        'test: instances': function() {
            var instance1 = new Y.IO(),
                instance2 = new Y.IO();

            Y.Assert.areNotEqual(instance1, instance2);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'IO Instance is an Object',

        'test: is an Object': function() {
            var instance1 = new Y.IO();
            
            Y.Assert.isObject(instance1);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Instance of Y.IO',

        'test: instanceOf': function() {
            var instance1 = new Y.IO();
            
            Y.Assert.isInstanceOf(Y.IO, instance1);
        }
    }));

    Y.Test.Runner.add(suite);

});
