YUI.add('test-string-tests-tests', function (Y) {

Y.Test.Runner.add(new Y.Test.Case({

    name: "Monitoring the test console",

    init: function () {
        this.test_console = Y.one("#testLogger");
    },

    "console should have rendred": function () {
        Y.Assert.isNotNull(this.test_console);
    },

    "console should have some passed entries": function () {
        Y.Assert.isNotNull(this.test_console.one(".yui3-testconsole-entry-pass"));
    },

    "console should not have failed entries": function () {
        Y.Assert.isNull(this.test_console.one(".yui3-testconsole-entry-fail"));
    }
}));

}, '', {
    requires: ['node']
});