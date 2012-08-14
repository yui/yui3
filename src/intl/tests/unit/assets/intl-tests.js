YUI.add('intl-tests', function(Y) {

    // Set up the page
    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert,
        suite = new Y.Test.Suite("Intl"),
        areObjectsReallyEqual = function (o1, o2) {
            Y.ObjectAssert.areEqual(o1, o2);
            Y.ObjectAssert.areEqual(o2, o1);
        };

    suite.add(new Y.Test.Case({
        name: "Lookup Best Language Tests",
    
        testArray: function() {
            var language = Y.Intl.lookupBestLang(["de-DE", "en-SG", "ja-JP"], ["fr-FR", "en", "en-SG"]);
            Assert.areSame(language, "en-SG", "Expected en-SG.");
        },

        testString: function() {
            var language = Y.Intl.lookupBestLang("de-DE,en-SG,ja-JP", ["fr-FR", "en", "en-SG"]);
            Assert.areSame(language, "en-SG", "Expected en-SG.");
        },

        testStar: function() {
            var language = Y.Intl.lookupBestLang("de-DE,*,en-SG,ja-JP", ["fr-FR", "en", "en-SG"]);
            Assert.areSame(language, "en-SG", "Expected en-SG.");
        },

        testPrivate: function() {
            var language = Y.Intl.lookupBestLang("de-DE,zh-Hant-CN-x-private1-private2", ["fr-FR", "zh-Hant-CN", "zh-Hant-CN-x"]);
            Assert.areSame(language, "zh-Hant-CN", "Expected zh-Hant-CN.");
        }
    }));
    
    suite.add(new Y.Test.Case({
        name: "Basic Intl Language Store Tests",

        testAdd: function() {

            var eventStack = [],
                expectedEventStack = [
                    {module:"modA", newVal:"fr", prevVal:"en-US"},
                    {module:"modA", newVal:"ja-JP", prevVal:"fr"},
                    {module:"modA", newVal:"fr", prevVal:"ja-JP"}
                ];

            Y.Intl.add("modA", "en-US", {
                hello:"Hello"
            });

            Assert.areSame(Y.Intl.get("modA").hello, "Hello");

            var h = Y.Intl.after("intl:langChange", function(e) {
                eventStack.push({module:e.module, newVal:e.newVal, prevVal:e.prevVal});
            });

            Y.Intl.add("modA", "fr", {
                hello:"Bonjour"
            });

            Assert.areSame(Y.Intl.get("modA").hello, "Bonjour");

            Y.Intl.add("modA", "ja-JP", {
                hello: "こんにちは"
            });

            Assert.areSame(Y.Intl.get("modA").hello, "こんにちは");

            Y.Intl.setLang("modA", "fr");
            Assert.areSame(Y.Intl.get("modA").hello, "Bonjour");

            ArrayAssert.itemsAreEquivalent(expectedEventStack, eventStack, function(a, b) {
                var equal = true;
                try {
                    areObjectsReallyEqual(a, b);
                } catch(e) {
                    equal = false;
                }
                return equal;
            });
            
            h.detach();
        },

        testRoot : function() {

            Y.Intl.add("modB", "fr", {
                hello:"Bonjour"
            });

            Assert.areSame(Y.Intl.getLang("modB"), "fr");

            Y.Intl.add("modB", "", {
               hello:"HELLO"
            });

            Assert.areSame(Y.Intl.getLang("modB"), "");
            Assert.areSame(Y.Intl.get("modB").hello, "HELLO");

            Y.Intl.setLang("modB", "fr");

            Assert.areSame(Y.Intl.get("modB").hello, "Bonjour");
            Assert.areSame(Y.Intl.getLang("modB"), "fr");
        },

        testGet : function() {

            var origSet = {
                hello : "Hello",
                world : "World"
            };

            Y.Intl.add("modC", "en", {
                hello : "Hello",
                world : "World"
            });

            var strs = Y.Intl.get("modC");
            areObjectsReallyEqual(strs, origSet);

            Assert.areSame(Y.Intl.get("modC", "hello"), origSet.hello);
            Assert.areSame(Y.Intl.get("modC", "world"), origSet.world);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Get All Languages',
        'test: getAvailableLangs': function() {
            Assert.areSame(Y.Intl.getAvailableLangs().length, [].length);
        }
    }));


    Y.Test.Runner.add(suite);

});
