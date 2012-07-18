YUI.add('intl-basic-tests', function(Y) {
    
    var suite = new Y.Test.Suite('intl-basic example test suite')
    
    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'Initial State' : function() {

            var TIMEOUT = 10000;

            var test = this,
                out = Y.Node.one("#out");

                condition = function() {
                    return out.all("p.word").size() === 6;
                },

                success = function() {
                    var outputList = out.all("p");

                    Y.Assert.areEqual("Speaking in: en", outputList.item(0).get("text"));
                    Y.Assert.areEqual("Hello", outputList.item(1).get("text"));
                    Y.Assert.areEqual("Goodbye", outputList.item(2).get("text"));

                    Y.Assert.areEqual("Speaking in: fr", outputList.item(3).get("text"));
                    Y.Assert.areEqual("Bonjour", outputList.item(4).get("text"));
                    Y.Assert.areEqual("Au revoir", outputList.item(5).get("text"));

                    Y.Assert.areEqual("Speaking in: es", outputList.item(6).get("text"));
                    Y.Assert.areEqual("Hola", outputList.item(7).get("text"));
                    Y.Assert.areEqual("Adiós", outputList.item(8).get("text"));
                },

                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + TIMEOUT + "ms.");
                };

            test.poll(condition, 100, TIMEOUT, success, failure);
        }

        // no interaction, so no other tests

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['node']})
