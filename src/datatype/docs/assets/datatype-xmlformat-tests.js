YUI.add('datatype-xmlformat-tests', function(Y) {

    var suite = new Y.Test.Suite('xml format example test suite'),
        Assert = Y.Assert;
            var demo_btn = Y.one("#demo_btn"),
                demo_output = Y.one("#demo_output"),
                xmlString = '<myroot><item type="foo"><name>Abc</name><rank>1</rank></item><item type="bar"><name>Def</name><rank>2</rank></item><item type="bat"><name>Ghhi</name><rank>3</rank></item></myroot>';

    suite.add(new Y.Test.Case({

        name: 'XML Format tests',

        'xml format output': function() {
                demo_btn.simulate("click");
                Assert.areEqual(xmlString, demo_output.get("text"), " - The formatted XML string does not match the expected value.");
         }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate'] });
