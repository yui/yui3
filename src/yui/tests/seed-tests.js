YUI.add('seed-tests', function(Y) {
    Y.SeedTests = new Y.Test.Suite("YUI Core Test Suite");
    Y.Test.Runner.add(Y.SeedTests);
});
