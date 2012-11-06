YUI.add('datatype-dateparse-tests', function(Y) {

    var suite = new Y.Test.Suite('date parse example test suite'),
        Assert = Y.Assert;
            var demo_btn = Y.one("#demo_btn"),
                demo_input = Y.one("#demo_input"),
                demo_output = Y.one("#demo_output");

    suite.add(new Y.Test.Case({

        name: 'Date Parse tests',

        'date parse': function() {

                demo_btn.simulate("click");

                Assert.areEqual(new Date(demo_input.get("value")).toString(), demo_output.get("text"), " - The parsed date string doesn't match the expected value.");
         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate'] });
