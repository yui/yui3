if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/menu-base/menu-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/menu-base/menu-base.js",
    code: []
};
_yuitest_coverage["build/menu-base/menu-base.js"].code=["YUI.add('menu-base', function (Y, NAME) {","","/**","Provides `Menu.Base`.","","@module menu","@submodule menu-base","**/","","/**","Base menu functionality.","","@class Menu.Base","@constructor","@param {Object} [config] Config options.","    @param {Menu.Item[]|Object[]} [config.items] Array of `Menu.Item` instances","        or menu item config objects to add to this menu.","@extends Tree","**/","","var MenuBase = Y.Base.create('menuBase', Y.Tree, [], {","    nodeClass: Y.Menu.Item,","","    // -- Lifecycle ------------------------------------------------------------","    initializer: function (config) {","        config || (config = {});","","        if (config.items) {","            this.appendNode(this.rootNode, config.items, {silent: true});","        }","    }","});","","Y.namespace('Menu').Base = MenuBase;","","","}, '@VERSION@', {\"requires\": [\"menu-item\", \"tree\"]});"];
_yuitest_coverage["build/menu-base/menu-base.js"].lines = {"1":0,"21":0,"26":0,"28":0,"29":0,"34":0};
_yuitest_coverage["build/menu-base/menu-base.js"].functions = {"initializer:25":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu-base/menu-base.js"].coveredLines = 6;
_yuitest_coverage["build/menu-base/menu-base.js"].coveredFunctions = 2;
_yuitest_coverline("build/menu-base/menu-base.js", 1);
YUI.add('menu-base', function (Y, NAME) {

/**
Provides `Menu.Base`.

@module menu
@submodule menu-base
**/

/**
Base menu functionality.

@class Menu.Base
@constructor
@param {Object} [config] Config options.
    @param {Menu.Item[]|Object[]} [config.items] Array of `Menu.Item` instances
        or menu item config objects to add to this menu.
@extends Tree
**/

_yuitest_coverfunc("build/menu-base/menu-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/menu-base/menu-base.js", 21);
var MenuBase = Y.Base.create('menuBase', Y.Tree, [], {
    nodeClass: Y.Menu.Item,

    // -- Lifecycle ------------------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/menu-base/menu-base.js", "initializer", 25);
_yuitest_coverline("build/menu-base/menu-base.js", 26);
config || (config = {});

        _yuitest_coverline("build/menu-base/menu-base.js", 28);
if (config.items) {
            _yuitest_coverline("build/menu-base/menu-base.js", 29);
this.appendNode(this.rootNode, config.items, {silent: true});
        }
    }
});

_yuitest_coverline("build/menu-base/menu-base.js", 34);
Y.namespace('Menu').Base = MenuBase;


}, '@VERSION@', {"requires": ["menu-item", "tree"]});
