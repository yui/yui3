YUI.add('datatype-dateformat-lang-tests', function(Y) {

    var suite = new Y.Test.Suite('date format lang example test suite'),
        Assert = Y.Assert;
            var demo_btn = Y.one("#demo_btn"),
                demo_lang = Y.one("#demo_lang"),
                demo_output = Y.one("#demo_output");

    suite.add(new Y.Test.Case({

        name: 'Date Format tests',

        'date format': function() {
                var test = this;
                demo_lang.set("value", "en-AU");

                Y.use("lang/datatype-date-format_en-AU", function(Y) {
                    test.resume(function() {
                        Y.Intl.setLang("datatype-date-format", "en-AU");
                        demo_btn.simulate("click");
                        var dateAtNoon = new Date();
                        dateAtNoon.setHours(12,0,0,0);
                        formattedDate = Y.DataType.Date.format(dateAtNoon, {format:"%c"});
                        Assert.areEqual(Y.Lang.trim(demo_output.get("text")), Y.Lang.trim(formattedDate), " - The formatted date string doesn't match the expected value.");
                    }, 10);
                });

                test.wait();            
         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate', 'datatype-date-format'] });
