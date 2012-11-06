YUI.add('datatype-numberformat-tests', function(Y) {

    var suite = new Y.Test.Suite('number format example test suite'),
        Assert = Y.Assert;
            var numberToFormat = Y.one("#demo_number"),
                kSeparator = Y.one("#demo_thousandsSeparator"),
                dSeparator = Y.one("#demo_decimalSeparator"),
                places = Y.one("#demo_decimalPlaces"),
                prefix = Y.one("#demo_prefix"),
                suffix = Y.one("#demo_suffix"),
                output = Y.one("#demo_output");

    suite.add(new Y.Test.Case({

        name: 'Number Format tests',

        'test number format': function() {

                numberToFormat.set("value", "1234.56789");
                kSeparator.set("value", ",");
                dSeparator.set("value", ".");
                places.set("value", "2");
                prefix.set("value", "$");
                suffix.set("value", "%");

                Y.one("#demo_btn").simulate("click");

                Assert.areEqual("$1,234.57%", output.get("text"), " - The formatted number string doesn't match the expected value.");
         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate'] });
