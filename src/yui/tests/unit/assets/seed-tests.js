YUI.add('seed-tests', function(Y) {
    var name = "YUI";
    if (typeof TestName != 'undefined') {
        name = TestName;
    }
    Y.SeedTests = new Y.Test.Suite(name);
    Y.Test.Runner.add(Y.SeedTests);
});
