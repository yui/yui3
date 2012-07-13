YUI.add('datatype-xmlparse-tests', function(Y) {

    var suite = new Y.Test.Suite('xml parse example test suite'),
        Assert = Y.Assert;
            var nodename = Y.one("#nodename"),
                nodetype = Y.one("#nodetype"),
                demo_btn = Y.one("#demo_btn");

    suite.add(new Y.Test.Case({

        name: 'XML Parse tests',

        'xml parse output': function() {
                demo_btn.simulate("click");

                Assert.areEqual("#document", nodename.get("text").toLowerCase(), " - The node name does not match the expected value.");
                Assert.areEqual("9", nodetype.get("text").toLowerCase(), " - The node type does not match the expected value.");
         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate'] });
