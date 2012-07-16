YUI.add('datatype-numberparse-tests', function(Y) {

    var suite = new Y.Test.Suite('numbers parse example test suite'),
        Assert = Y.Assert;
            var demo_btn = Y.one("#demo_btn"),
                demo_input = Y.one("#demo_input"),
                parsed_number = Y.one("#parsed_number");

    suite.add(new Y.Test.Case({

        name: 'Number Parse tests',

        'number parse': function() {

                demo_input.set("value", "1000");
                demo_btn.simulate("click");
                Assert.areEqual(parsed_number.get("text"), "1000", "- The parsed number doesn't match the expected value.");

                demo_input.set("value", "1,000");
                demo_btn.simulate("click");
                Assert.areEqual(parsed_number.get("text"), "null", "- The parsed number doesn't match the expected value.");

                demo_input.set("value", "1234.567");
                demo_btn.simulate("click");
                Assert.areEqual(parsed_number.get("text"), "1234.567", "- The parsed number doesn't match the expected value.");

         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate'] });
