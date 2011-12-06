YUI.add('namespace-test', function(Y) {
    
    var Assert = Y.Assert;

    var testNamespace = new Y.Test.Case({
        name: "Namespace tests",


        test_create_namespace: function () {

            // set up Y.my.namespace
            var ns = Y.namespace("my.namespace");

            // use the returned reference, assign a value
            ns.test = "yahoo_my_namespace_test";

            // check for the assigned value using the full path
            Assert.areEqual(Y.my.namespace.test, "yahoo_my_namespace_test", "The namespace was not set up correctly");

            // assign a value to my to test that it doesn't get wiped out
            Y.my.test = "yahoo_my_test";

            // create another namespace on my
            var ns2 = Y.namespace("my.namespace2");

            // make sure my stays the same
            Assert.areEqual(Y.my.test, "yahoo_my_test", "The namespace was obliterated");
            Assert.isObject(Y.my.namespace2, 'New namespace not created');
        },
        test_multi_args: function() {
            
            Assert.isUndefined(Y.foo, 'Namespace Y.foo existed before test');
            Assert.isUndefined(Y.bar, 'Namespace Y.bar existed before test');

            //This should create both Y.foo and Y.bar, not Y.foo.bar
            var ns = Y.namespace('foo', 'bar');

            Assert.isObject(Y.foo, 'First top level multi namespace failed');
            Assert.isObject(Y.bar, 'Second top level multi namespace failed');
            Assert.isUndefined(Y.foo.bar, 'Multi namespaces was not created');

            Y.bar.test = 'davglass';

            Assert.areEqual(ns.test, 'davglass', 'Returned object was not correct');
        },
        test_multi_args_dotted: function() {
            
            Assert.isUndefined(Y.foo2, 'Namespace Y.foo2 existed before test');
            Assert.isUndefined(Y.bar2, 'Namespace Y.bar2 existed before test');

            //This should create both Y.foo2.davglass and Y.bar2.davglass
            var ns = Y.namespace('foo2.davglass', 'bar2.davglass');

            Assert.isObject(Y.foo2, 'First top level multi namespace failed');
            Assert.isObject(Y.foo2.davglass, 'First second level multi namespace failed');
            Assert.isObject(Y.bar2, 'Second top level multi namespace failed');
            Assert.isObject(Y.bar2.davglass, 'Second second top level multi namespace failed');

            Y.bar2.davglass.test = 'davglass';

            Assert.areEqual(ns.test, 'davglass', 'Returned object was not correct');
        }

    });
        

    Y.SeedTests.add(testNamespace);
    
});
