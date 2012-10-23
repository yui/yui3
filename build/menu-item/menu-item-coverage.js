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
_yuitest_coverage["build/menu-item/menu-item.js"].code=["YUI.add('menu-item', function (Y, NAME) {","","/**","Provides the `Menu.Item` class.","","@module menu","@submodule menu-item","**/","","/**","Represents a single menu item in a `Menu`.","","@class Menu.Item","@constructor","@param {Menu} menu `Menu` instance with which this node should be associated.","@param {Object} [config] Configuration hash for this menu item. Supports all the","    config properties of `Tree.Node` in addition to the following.","","    @param {Object} [config.state] State hash for this menu item.","","        @param {Boolean} [config.state.disabled=false] If `true`, this menu item","            will be disabled, and will not be clickable or selectable.","","        @param {Boolean} [config.state.hidden=false] If `true`, this menu item","            will be hidden.","","    @param {String} [config.type='item'] Type of this menu item. May be 'item',","        'heading', or 'separator'.","","    @param {String} [config.url='#'] URL associated with this item. If this item","        is of type 'item', clicking on the item will navigate to this URL.","","@extends Tree.Node","**/","","function MenuItem(menu, config) {","    config || (config = {});","","    this.id   = this._yuid = config.id || Y.guid('menuItem-');","    this.type = config.type || 'item';","    this.url  = config.url || '#';","","    MenuItem.superclass.constructor.call(this, menu, config);","}","","Y.extend(MenuItem, Y.Tree.Node, {","    _serializable: Y.Tree.Node.prototype._serializable.concat('type', 'url'),","","    /**","    Disables this menu item. Disabled items are not clickable or selectable.","","    @method disable","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `disable` event","            will be suppressed.","    @chainable","    **/","    disable: function (options) {","        this.tree.disableItem(this, options);","        return this;","    },","","    /**","    Enables this menu item.","","    @method enable","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `enable` event","            will be suppressed.","    @chainable","    **/","    enable: function (options) {","        this.tree.enableItem(this, options);","        return this;","    },","","    /**","    Hides this menu item.","","    @method hide","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `hide` event","            will be suppressed.","    @chainable","    **/","    hide: function (options) {","        this.tree.hideItem(this, options);","        return this;","    },","","    /**","    Returns `true` if this menu item is currently disabled.","","    @method isDisabled","    @return {Boolean} `true` if this menu item is currently disabled, `false`","        otherwise.","    **/","    isDisabled: function () {","        return !!this.state.disabled;","    },","","    /**","    Returns `true` if this menu item is currently hidden.","","    @method isHidden","    @return {Boolean} `true` if this menu item is currently hidden, `false`","        otherwise.","    **/","    isHidden: function () {","        return !!this.state.hidden;","    },","","    /**","    Shows this menu item.","","    @method show","    @param {Object} [options] Options.","        @param {Boolean} [options.silent=false] If `true`, the `show` event","            will be suppressed.","    @chainable","    **/","    show: function (options) {","        this.tree.showItem(this, options);","        return this;","    }","});","","Y.namespace('Menu').Item = MenuItem;","","","}, '@VERSION@', {\"requires\": [\"oop\", \"tree-node\"]});"];
_yuitest_coverage["build/menu-item/menu-item.js"].lines = {"1":0,"36":0,"37":0,"39":0,"40":0,"41":0,"43":0,"46":0,"59":0,"60":0,"73":0,"74":0,"87":0,"88":0,"99":0,"110":0,"123":0,"124":0,"128":0};
_yuitest_coverage["build/menu-item/menu-item.js"].functions = {"MenuItem:36":0,"disable:58":0,"enable:72":0,"hide:86":0,"isDisabled:98":0,"isHidden:109":0,"show:122":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu-item/menu-item.js"].coveredLines = 19;
_yuitest_coverage["build/menu-item/menu-item.js"].coveredFunctions = 8;
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

        @param {Boolean} [config.state.hidden=false] If `true`, this menu item
            will be hidden.

    @param {String} [config.type='item'] Type of this menu item. May be 'item',
        'heading', or 'separator'.

    @param {String} [config.url='#'] URL associated with this item. If this item
        is of type 'item', clicking on the item will navigate to this URL.

@extends Tree.Node
**/

_yuitest_coverfunc("build/menu-item/menu-item.js", "(anonymous 1)", 1);
_yuitest_coverline("build/menu-item/menu-item.js", 36);
function MenuItem(menu, config) {
    _yuitest_coverfunc("build/menu-item/menu-item.js", "MenuItem", 36);
_yuitest_coverline("build/menu-item/menu-item.js", 37);
config || (config = {});

    _yuitest_coverline("build/menu-item/menu-item.js", 39);
this.id   = this._yuid = config.id || Y.guid('menuItem-');
    _yuitest_coverline("build/menu-item/menu-item.js", 40);
this.type = config.type || 'item';
    _yuitest_coverline("build/menu-item/menu-item.js", 41);
this.url  = config.url || '#';

    _yuitest_coverline("build/menu-item/menu-item.js", 43);
MenuItem.superclass.constructor.call(this, menu, config);
}

_yuitest_coverline("build/menu-item/menu-item.js", 46);
Y.extend(MenuItem, Y.Tree.Node, {
    _serializable: Y.Tree.Node.prototype._serializable.concat('type', 'url'),

    /**
    Disables this menu item. Disabled items are not clickable or selectable.

    @method disable
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `disable` event
            will be suppressed.
    @chainable
    **/
    disable: function (options) {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "disable", 58);
_yuitest_coverline("build/menu-item/menu-item.js", 59);
this.tree.disableItem(this, options);
        _yuitest_coverline("build/menu-item/menu-item.js", 60);
return this;
    },

    /**
    Enables this menu item.

    @method enable
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `enable` event
            will be suppressed.
    @chainable
    **/
    enable: function (options) {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "enable", 72);
_yuitest_coverline("build/menu-item/menu-item.js", 73);
this.tree.enableItem(this, options);
        _yuitest_coverline("build/menu-item/menu-item.js", 74);
return this;
    },

    /**
    Hides this menu item.

    @method hide
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `hide` event
            will be suppressed.
    @chainable
    **/
    hide: function (options) {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "hide", 86);
_yuitest_coverline("build/menu-item/menu-item.js", 87);
this.tree.hideItem(this, options);
        _yuitest_coverline("build/menu-item/menu-item.js", 88);
return this;
    },

    /**
    Returns `true` if this menu item is currently disabled.

    @method isDisabled
    @return {Boolean} `true` if this menu item is currently disabled, `false`
        otherwise.
    **/
    isDisabled: function () {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "isDisabled", 98);
_yuitest_coverline("build/menu-item/menu-item.js", 99);
return !!this.state.disabled;
    },

    /**
    Returns `true` if this menu item is currently hidden.

    @method isHidden
    @return {Boolean} `true` if this menu item is currently hidden, `false`
        otherwise.
    **/
    isHidden: function () {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "isHidden", 109);
_yuitest_coverline("build/menu-item/menu-item.js", 110);
return !!this.state.hidden;
    },

    /**
    Shows this menu item.

    @method show
    @param {Object} [options] Options.
        @param {Boolean} [options.silent=false] If `true`, the `show` event
            will be suppressed.
    @chainable
    **/
    show: function (options) {
        _yuitest_coverfunc("build/menu-item/menu-item.js", "show", 122);
_yuitest_coverline("build/menu-item/menu-item.js", 123);
this.tree.showItem(this, options);
        _yuitest_coverline("build/menu-item/menu-item.js", 124);
return this;
    }
});

_yuitest_coverline("build/menu-item/menu-item.js", 128);
Y.namespace('Menu').Item = MenuItem;


}, '@VERSION@', {"requires": ["oop", "tree-node"]});
