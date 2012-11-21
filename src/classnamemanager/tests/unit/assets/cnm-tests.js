YUI.add('cnm-tests', function(Y) {
	    var testClassNameManager = new Y.Test.Case({

            name: "ClassNameManager Tests",

            testSingleSection: function() {
				Y.Assert.areEqual(Y.ClassNameManager.getClassName("menuitem"), "yui3-menuitem");
            },
            
            testSingleSectionNoPrefix: function() {
                Y.Assert.areEqual(Y.ClassNameManager.getClassName("menuitem", true), "menuitem");
            },
            
            testMoreThanOneSection : function() {
				Y.Assert.areEqual(Y.ClassNameManager.getClassName("menuitem", "active"), "yui3-menuitem-active");
            },

            testMoreThanOneSectionNoPrefix : function() {
                Y.Assert.areEqual(Y.ClassNameManager.getClassName("menuitem", "active", true), "menuitem-active");
            }
        });

        var suite = new Y.Test.Suite("ClassNameManager");
        suite.add(new Y.Test.Case(testClassNameManager));

        Y.Test.Runner.setName("ClassNameManager Tests");
        Y.Test.Runner.add(suite);

});
