YUI.add('console-filters-tests', function(Y) {

var suite = new Y.Test.Suite("Console: Filters");

function setUp() {
    var testbed = Y.one('#testbed') ||
                  Y.one('body').appendChild('<div id="testbed"></div>');
}

function tearDown() {
    var testbed = Y.one('#testbed');
    if (testbed) {
        testbed.remove().destroy(true);
    }
}

suite.add(new Y.Test.Case({
    name : "resources",

    setUp: setUp,
    tearDown: tearDown,

    _should: {
        fail: {
            //test_skin_loaded: 2529194 // bug
        }
    },

    test_module_loaded: function () {
        Y.Assert.isFunction(Y.Plugin.ConsoleFilters);
    },

    test_skin_loaded: function () {
        var found = Y.all('link').some(function (node) {
            if (/console-filters.css/.test(node.get('href'))) {
                return true;
            }
        });

        Y.Assert.isTrue(found);
    }
}));

suite.add(new Y.Test.Case({
    name : "instantiation",
    
    setUp: setUp,
    tearDown: tearDown,

    test_instantiation : function () {
        var c = new Y.Console({
            newestOnTop: true,
            boundingBox: '#testbed'
        });
        
        c.plug(Y.Plugin.ConsoleFilters);

        c.destroy();
    },

    test_render : function () {
        var c = new Y.Console({
            newestOnTop: true,
            boundingBox: '#testbed'
        });
        
        c.plug(Y.Plugin.ConsoleFilters);

        c.render();

        c.destroy();
    }
}));

suite.add(new Y.Test.Case({
    name : "ui",

    "Filter controls should be in the footer" : function () {
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['console-filters', 'test']});
