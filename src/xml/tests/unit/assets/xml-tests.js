YUI.add('xml-tests', function(Y) {
        // Set up the page
        var ASSERT = Y.Assert,
            ARRAYASSERT = Y.ArrayAssert;

        var testParse = new Y.Test.Case({
            name: "XML Parse Tests",
        
            testUndefined: function() {
                var xmldoc = Y.XML.parse();
                ASSERT.isNull(xmldoc, "Expected null.");
            },
            
            testNull: function() {
                var xmldoc = Y.XML.parse(null);
                ASSERT.isNull(xmldoc, "Expected null.");
            },

            testStrings: function() {
                var xmldoc = Y.XML.parse("<myroot><item type='foo'><name>Abc</name><rank>1</rank></item><item type='bar'><name>Def</name><rank>2</rank></item><item type='bat'><name>Ghhi</name><rank>3</rank></item></myroot>");
                ASSERT.areSame("item", xmldoc.documentElement.firstChild.nodeName, "Incorrect node name.");
                ASSERT.areSame(3, xmldoc.getElementsByTagName("item").length, "Incorrect length.");
            }
        });
            
        var testFormat = new Y.Test.Case({
            name: "XML Format Tests",

            testUndefined: function() {
                var output = Y.XML.format();
                ASSERT.areSame("", output, "Expected empty string.");
            },

            testNull: function() {
                var output = Y.XML.format(null);
                ASSERT.areSame("", output, "Expected empty string.");
            },

            testFormat: function() {
                var origString = "<myroot><item type=\"foo\"><name>Abc</name><rank>1</rank></item><item type=\"bar\"><name>Def</name><rank>2</rank></item><item type=\"bat\"><name>Ghhi</name><rank>3</rank></item></myroot>",
                    xmldoc = Y.XML.parse(origString),
                    newString = Y.XML.format(xmldoc),
                    ie9String = '<myroot xmlns=""><item type="foo"><name>Abc</name><rank>1</rank></item><item type="bar"><name>Def</name><rank>2</rank></item><item type="bat"><name>Ghhi</name><rank>3</rank></item></myroot>';

                ASSERT.isTrue((newString.indexOf(origString) > -1) || (newString === ie9String), "Expected new string same as old string.");
            }
        });

        var suite = new Y.Test.Suite("XML");
        suite.add(testParse);
        suite.add(testFormat);

        Y.Test.Runner.add(suite);
});
