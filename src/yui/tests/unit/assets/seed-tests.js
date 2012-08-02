YUI.add('seed-tests', function(Y) {
    Y.SeedTests = new Y.Test.Suite(TestName || "YUI");
    Y.Test.Runner.add(Y.SeedTests);
});
