YUI.add('treeview-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    Mock        = Y.Mock,
    TreeView    = Y.TreeView,

    mainSuite = Y.TreeViewTestSuite = new Y.Test.Suite('TreeView');

// -- Y.TreeView ---------------------------------------------------------------
var treeViewSuite = new Y.Test.Suite('TreeView');
mainSuite.add(treeViewSuite);

// -- Lifecycle ----------------------------------------------------------------
treeViewSuite.add(new Y.Test.Case({
    name: 'Lifecycle'

    // TODO: moar tests!
}));

// -- Properties and Attributes ------------------------------------------------
treeViewSuite.add(new Y.Test.Case({
    name: 'Properties & Attributes'

    // TODO: moar tests!
}));

// -- Methods ------------------------------------------------------------------
treeViewSuite.add(new Y.Test.Case({
    name: 'Methods'

    // TODO: moar tests!
}));

}, '@VERSION@', {
    requires: ['treeview', 'test']
});
