YUI.add('datatype-numberformat-advanced-tests', function(Y) {

    var suite = new Y.Test.Suite('number format example test suite'),
        Assert = Y.Assert;
            var numberToFormat = Y.one("#demo_number"),
                locale = Y.one("#demo_lang"),
                style = Y.one("#demo_numberStyle"),
                output = Y.one("#demo_output");

    suite.add(new Y.Test.Case({

        name: 'Number Format tests',

        'test number format': function() {
                var test = this;
                numberToFormat.set("value", "1234.56789");
                locale.set("value", "en-US");
                style.set("value", "CURRENCY_STYLE");
               
                Y.one("#demo_btn").simulate("click");

                Y.Intl.setLang("datatype-number-format-advanced", "en-US");
                var result = Y.Number.format(1234.56789, { style: "CURRENCY_STYLE"});
	            Assert.areEqual(result, output.getContent(), " - The formatted number string doesn't match the expected value.");
         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate', 'datatype-number-format-advanced', 'lang/datatype-number-format-advanced_en-US'] });
