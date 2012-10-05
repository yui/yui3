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
_yuitest_coverage["build/menu-item/menu-item.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/menu-item/menu-item.js",
    code: []
};
_yuitest_coverage["build/menu-item/menu-item.js"].code=["YUI.add('menu-item', function (Y, NAME) {","","/**","Provides the `Menu.Item` class.","","@module menu","@submodule menu-item","**/","","/**","Represents a single menu item in a `Menu`.","","@class Menu.Item","@constructor","@param {Menu} menu `Menu` instance with which this node should be associated.","@param {Object} [config] Configuration hash for this menu item. Supports all the","    config properties of `Tree.Node` in addition to the following.","","    @param {Object} [config.state] State hash for this menu item.","","        @param {Boolean} [config.state.disabled=false] If `true`, this menu item","            will be disabled, and will not be clickable or selectable.","","    @param {String} [config.type='item'] Type of this menu item. May be 'item',","        'heading', or 'separator'.","","    @param {String} [config.url='#'] URL associated with this item. If this item","        is of type 'item', clicking on the item will navigate to this URL.","","@extends Tree.Node","**/","","function MenuItem(menu, config) {","    config || (config = {});","","    this.id   = this._yuid = config.id || Y.guid('menuItem-');","    this.type = config.type || 'item';","    this.url  = config.url || '#';","","    MenuItem.superclass.constructor.call(this, menu, config);","}","","Y.extend(MenuItem, Y.Tree.Node, {","    _serializable: Y.Tree.Node.prototype._serializable.concat('type', 'url'),","","    /**","    Disables this menu item. Disabled items are not clickable or selectable.","","    @method disable","    @chainable","    **/","    disable: function () {","        this.state.disabled = true;","        return this;","    },","","    /**","    Enables this menu item.","","    @method enable","    @chainable","    **/","    enable: function () {","        delete this.state.disabled;","        return this;","    },","","    /**","    Returns `true` if this menu item is currently disabled.","","    @method isDisabled","    @return {Boolean} `true` if this menu item is currently disabled, `false`","        otherwise.","    **/","    isDisabled: function () {","        return !!this.state.disabled;","    }","});","","Y.namespace('Menu').Item = MenuItem;","","","}, '@VERSION@', {\"requires\": [\"oop\", \"tree-node\"]});"];
_yuitest_coverage["build/menu-item/menu-item.js"].lines = {"1":0,"33":0,"34":0,"36":0,"37":0,"38":0,"40":0,"43":0,"53":0,"54":0,"64":0,"65":0,"76":0,"80":0};
_yuitest_coverage["build/menu-item/menu-item.js"].functions = {"MenuItem:33":0,"disable:52":0,"enable:63":0,"isDisabled:75":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu-item/menu-item.js"].coveredLines = 14;
_yuitest_coverage["build/menu-item/menu-item.js"].coveredFunctions = 5;
_yuitest_coverline("build/menu-item/menu-item.js", 1);
YUI.add('menu-item', function (Y, NAME) {

/**
Provides the `Menu.Item` class.

@module menu
@submodule menu-item
**/

/**
Represents a single menu item in a `Menu`.

@class Menu.Item
@constructor
@param {Menu} menu `Menu` instance with which this node should be associated.
@param {Object} [config] Configuration hash for this menu item. Supports all the
    config properties of `Tree.Node` in addition to the following.

    @param {Object} [config.state] State hash for this menu item.

        @param {Boolean} [config.state.disabled=false] If `true`, this menu item
            will be disabled, and will not be clickable or selectable.

    @param {String} [config.type='item'] Type of this menu item. May be 'item',
        'heading', or 'separator'.

    @param {String} [config.url='#'] URL associated with this item. If this item
        is of type 'item', clicking on the item will navigate to this URL.

@extends Tree.Node
**/

_yuitest_coverfunc("build/menu-item/menu-item.js", "(anonymous 1)", 1);
_yuitest_coverline("build/menu-item/menu-item.js", 33);
function MenuItem(menu, config) {
    _yuitest_coverfunc("build/menu-item/menu-item.js", "MenuItem", 33);
_yuitest_coverline("build/menu-item/menu-item.js", 34);
config || (config = {});

    _yuitest_coverline("build/menu-item/menu-item.js", 36);
this.id   = this._yuid = config.id || Y.guid('menuItem-');
    _yuitest_coverline("build/menu-item/menu-item.js", 37);
this.type = config.type || 'item';
    _yuitest_coverline("build/menu-item/menu-item.js", 38);
this.url  = config.url || '#';

    _yuitest_coverline("build/menu-item/menu-item.js", 40);
MenuItem.superclass.constructor.call(this, menu, config);
}

_yuitest_coverline("build/menu-item/menu-item.js", 43);
Y.extend(MenuItem, Y.Tree.Node, {
    _serializable: Y.Tree.Node.prototype._serializable.concat('type', 'url'),

    /**
    Disables this menu item. Disabled items are not clickable or selectable.

    @method disable
    @chainable
    **/
    disable: function () {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "disable", 52);
_yuitest_coverline("build/menu-item/menu-item.js", 53);
this.state.disabled = true;
        _yuitest_coverline("build/menu-item/menu-item.js", 54);
return this;
    },

    /**
    Enables this menu item.

    @method enable
    @chainable
    **/
    enable: function () {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "enable", 63);
_yuitest_coverline("build/menu-item/menu-item.js", 64);
delete this.state.disabled;
        _yuitest_coverline("build/menu-item/menu-item.js", 65);
return this;
    },

    /**
    Returns `true` if this menu item is currently disabled.

    @method isDisabled
    @return {Boolean} `true` if this menu item is currently disabled, `false`
        otherwise.
    **/
    isDisabled: function () {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "isDisabled", 75);
_yuitest_coverline("build/menu-item/menu-item.js", 76);
return !!this.state.disabled;
    }
});

_yuitest_coverline("build/menu-item/menu-item.js", 80);
Y.namespace('Menu').Item = MenuItem;


}, '@VERSION@', {"requires": ["oop", "tree-node"]});
