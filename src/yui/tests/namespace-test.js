YUI.add('namespace-test', function(Y) {
    
    var testNamespace = new Y.Test.Case({
        name: "Namespace tests",


    test_create_namespace: function () {

            // set up Y.my.namespace
            var ns = Y.namespace("my.namespace");

            // use the returned reference, assign a value
            ns.test = "yahoo_my_namespace_test";

            // check for the assigned value using the full path
            Y.Assert.areEqual(Y.my.namespace.test, "yahoo_my_namespace_test", "The namespace was not set up correctly");

            // assign a value to my to test that it doesn't get wiped out
            Y.my.test = "yahoo_my_test";

            // create another namespace on my
            var ns2 = Y.namespace("my.namespace2");

            // make sure my stays the same
            Y.Assert.areEqual(Y.my.test, "yahoo_my_test", "The namespace was obliterated");
        } 

    });
        

    Y.SeedTests.add(testNamespace);
    
});
