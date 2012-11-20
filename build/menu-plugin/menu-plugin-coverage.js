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
_yuitest_coverage["build/menu-plugin/menu-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/menu-plugin/menu-plugin.js",
    code: []
};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].code=["YUI.add('menu-plugin', function (Y, NAME) {","","/**","Provides the `Y.Plugin.Menu` Node plugin.","","@module menu","@submodule menu-plugin","**/","","/**","Node plugin that toggles a dropdown menu when the host node is clicked.","","### Example","","    YUI().use('menu-plugin', function (Y) {","        var button = Y.one('#button');","","        // Plug a dropdown menu into the button.","        button.plug(Y.Plugin.Menu, {","            items: [","                {label: 'Item One'},","                {label: 'Item Two'},","                {label: 'Item Three'}","            ]","        });","","        // The menu will automatically be displayed whenever the button is","        // clicked, but you can also toggle it manually.","        button.menu.toggle();","    });","","@class Plugin.Menu","@constructor","@extends Menu","@uses Plugin.Base","**/","","Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function (config) {","        this._host       = config.host;","        this._hostIsBody = this._host === Y.one('body');","","        this._attachMenuPluginEvents();","    },","","    destructor: function () {","        clearTimeout(this._pluginHideTimeout);","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    If no anchor point is specified, the menu will be positioned relative to its","    host node.","","    @method reposition","    @param {Node|Number[]|Object} [anchorPoint] Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        return Y.Menu.prototype.reposition.call(this, anchorPoint || this._host);","    },","","    // -- Protected Methods ----------------------------------------------------","    _attachMenuPluginEvents: function () {","        // Events added to this._menuEvents will be cleaned up by Y.Menu.","","        if (this.get('showOnClick')) {","            this.afterHostEvent('click', this._afterHostClick);","        }","","        if (this.get('showOnContext')) {","            // If the host node is the <body> element, we need to listen on the","            // document.","            if (this._hostIsBody) {","                this._menuEvents.push(Y.one('doc').on('contextmenu', this._onHostContext, this));","            } else {","                this.onHostEvent('contextmenu', this._onHostContext);","            }","        }","","        if (this.get('showOnHover')) {","            this.afterHostEvent({","                blur      : this._afterHostBlur,","                focus     : this._afterHostFocus,","                mouseenter: this._afterHostMouseEnter,","                mouseleave: this._afterHostMouseLeave","            });","        }","    },","","    /**","    Returns an efficient test function that can be passed to `Y.Node#ancestor()`","    to test whether a node is this menu's container or its plugin host.","","    This is broken out to make overriding easier in subclasses.","","    @method _getAncestorTestFn","    @return {Function} Test function.","    @protected","    **/","    _getAncestorTestFn: function () {","        var container = this.get('container'),","            host      = this._host;","","        return (function (node) {","            return node === container || node === host;","        });","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterHostBlur: function () {","        this.hide();","    },","","    _afterHostClick: function () {","        if (!this.rendered) {","            this.render();","        }","","        this.toggle({anchorPoint: this._host});","    },","","    _afterHostFocus: function () {","        clearTimeout(this._timeouts.menu);","","        if (!this.rendered) {","            this.render();","        }","","        this.show({anchorPoint: this._host});","    },","","    _afterHostMouseEnter: function () {","        clearTimeout(this._timeouts.menu);","","        if (!this.rendered) {","            this.render();","        }","","        this.show({anchorPoint: this._host});","    },","","    _afterHostMouseLeave: function () {","        var self = this;","","        this._timeouts.menu = setTimeout(function () {","            self.hide();","        }, 300);","    },","","    _onHostContext: function (e) {","        e.preventDefault();","","        if (!this.rendered) {","            this.render();","        }","","        this.show({anchorPoint: [e.clientX, e.clientY]});","    }","}, {","    NS: 'menu',","","    ATTRS: {","        /**","        If `true`, this menu will be hidden when the user moves the mouse","        outside the menu.","","        @attribute {Boolean} hideOnMouseLeave","        @default true","        **/","        hideOnMouseLeave: {","            // Overrides the default value in Y.Menu.","            value: true","        },","","        /**","        If `true`, this menu will be shown when the host node is clicked with","        the left mouse button or (in the case of `<button>`, `<input>`, and","        `<a>` elements) activated with the Return key.","","        @attribute {Boolean} showOnClick","        @default true","        @initOnly","        **/","        showOnClick: {","            value: true,","            writeOnce: 'initOnly'","        },","","        /**","        If `true`, this menu will be shown when the host node's `contextmenu`","        event occurs, which happens when the user takes an action that would","        normally display the browser's context menu (such as right-clicking).","","        When `true`, the browser's default context menu will be prevented from","        appearing.","","        @attribute {Boolean} showOnContext","        @default false","        @initOnly","        **/","        showOnContext: {","            value: false,","            writeOnce: 'initOnly'","        },","","        /**","        If `true`, this menu will be shown when the host node is hovered or","        receives focus instead of only being shown when it's clicked.","","        @attribute {Boolean} showOnHover","        @default false","        @initOnly","        **/","        showOnHover: {","            value: false,","            writeOnce: 'initOnly'","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"event-focus\", \"menu\", \"node-pluginhost\", \"plugin\"]});"];
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].lines = {"1":0,"38":0,"41":0,"42":0,"44":0,"48":0,"71":0,"78":0,"79":0,"82":0,"85":0,"86":0,"88":0,"92":0,"93":0,"113":0,"116":0,"117":0,"123":0,"127":0,"128":0,"131":0,"135":0,"137":0,"138":0,"141":0,"145":0,"147":0,"148":0,"151":0,"155":0,"157":0,"158":0,"163":0,"165":0,"166":0,"169":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].functions = {"initializer:40":0,"destructor:47":0,"reposition:70":0,"_attachMenuPluginEvents:75":0,"(anonymous 2):116":0,"_getAncestorTestFn:112":0,"_afterHostBlur:122":0,"_afterHostClick:126":0,"_afterHostFocus:134":0,"_afterHostMouseEnter:144":0,"(anonymous 3):157":0,"_afterHostMouseLeave:154":0,"_onHostContext:162":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].coveredLines = 37;
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].coveredFunctions = 14;
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 1);
YUI.add('menu-plugin', function (Y, NAME) {

/**
Provides the `Y.Plugin.Menu` Node plugin.

@module menu
@submodule menu-plugin
**/

/**
Node plugin that toggles a dropdown menu when the host node is clicked.

### Example

    YUI().use('menu-plugin', function (Y) {
        var button = Y.one('#button');

        // Plug a dropdown menu into the button.
        button.plug(Y.Plugin.Menu, {
            items: [
                {label: 'Item One'},
                {label: 'Item Two'},
                {label: 'Item Three'}
            ]
        });

        // The menu will automatically be displayed whenever the button is
        // clicked, but you can also toggle it manually.
        button.menu.toggle();
    });

@class Plugin.Menu
@constructor
@extends Menu
@uses Plugin.Base
**/

_yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 38);
Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "initializer", 40);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 41);
this._host       = config.host;
        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 42);
this._hostIsBody = this._host === Y.one('body');

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 44);
this._attachMenuPluginEvents();
    },

    destructor: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "destructor", 47);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 48);
clearTimeout(this._pluginHideTimeout);
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Repositions this menu so that it is anchored to a specified node, region, or
    set of pixel coordinates.

    The menu will be displayed at the most advantageous position relative to the
    anchor point to ensure that as much of the menu as possible is visible
    within the viewport.

    If no anchor point is specified, the menu will be positioned relative to its
    host node.

    @method reposition
    @param {Node|Number[]|Object} [anchorPoint] Anchor point at which this menu
        should be positioned. The point may be specified as a `Y.Node`
        reference, a region object, or an array of X and Y pixel coordinates.
    @chainable
    **/
    reposition: function (anchorPoint) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "reposition", 70);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 71);
return Y.Menu.prototype.reposition.call(this, anchorPoint || this._host);
    },

    // -- Protected Methods ----------------------------------------------------
    _attachMenuPluginEvents: function () {
        // Events added to this._menuEvents will be cleaned up by Y.Menu.

        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_attachMenuPluginEvents", 75);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 78);
if (this.get('showOnClick')) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 79);
this.afterHostEvent('click', this._afterHostClick);
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 82);
if (this.get('showOnContext')) {
            // If the host node is the <body> element, we need to listen on the
            // document.
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 85);
if (this._hostIsBody) {
                _yuitest_coverline("build/menu-plugin/menu-plugin.js", 86);
this._menuEvents.push(Y.one('doc').on('contextmenu', this._onHostContext, this));
            } else {
                _yuitest_coverline("build/menu-plugin/menu-plugin.js", 88);
this.onHostEvent('contextmenu', this._onHostContext);
            }
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 92);
if (this.get('showOnHover')) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 93);
this.afterHostEvent({
                blur      : this._afterHostBlur,
                focus     : this._afterHostFocus,
                mouseenter: this._afterHostMouseEnter,
                mouseleave: this._afterHostMouseLeave
            });
        }
    },

    /**
    Returns an efficient test function that can be passed to `Y.Node#ancestor()`
    to test whether a node is this menu's container or its plugin host.

    This is broken out to make overriding easier in subclasses.

    @method _getAncestorTestFn
    @return {Function} Test function.
    @protected
    **/
    _getAncestorTestFn: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_getAncestorTestFn", 112);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 113);
var container = this.get('container'),
            host      = this._host;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 116);
return (function (node) {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 2)", 116);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 117);
return node === container || node === host;
        });
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterHostBlur: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostBlur", 122);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 123);
this.hide();
    },

    _afterHostClick: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostClick", 126);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 127);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 128);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 131);
this.toggle({anchorPoint: this._host});
    },

    _afterHostFocus: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostFocus", 134);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 135);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 137);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 138);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 141);
this.show({anchorPoint: this._host});
    },

    _afterHostMouseEnter: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostMouseEnter", 144);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 145);
clearTimeout(this._timeouts.menu);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 147);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 148);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 151);
this.show({anchorPoint: this._host});
    },

    _afterHostMouseLeave: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostMouseLeave", 154);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 155);
var self = this;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 157);
this._timeouts.menu = setTimeout(function () {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 3)", 157);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 158);
self.hide();
        }, 300);
    },

    _onHostContext: function (e) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_onHostContext", 162);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 163);
e.preventDefault();

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 165);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 166);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 169);
this.show({anchorPoint: [e.clientX, e.clientY]});
    }
}, {
    NS: 'menu',

    ATTRS: {
        /**
        If `true`, this menu will be hidden when the user moves the mouse
        outside the menu.

        @attribute {Boolean} hideOnMouseLeave
        @default true
        **/
        hideOnMouseLeave: {
            // Overrides the default value in Y.Menu.
            value: true
        },

        /**
        If `true`, this menu will be shown when the host node is clicked with
        the left mouse button or (in the case of `<button>`, `<input>`, and
        `<a>` elements) activated with the Return key.

        @attribute {Boolean} showOnClick
        @default true
        @initOnly
        **/
        showOnClick: {
            value: true,
            writeOnce: 'initOnly'
        },

        /**
        If `true`, this menu will be shown when the host node's `contextmenu`
        event occurs, which happens when the user takes an action that would
        normally display the browser's context menu (such as right-clicking).

        When `true`, the browser's default context menu will be prevented from
        appearing.

        @attribute {Boolean} showOnContext
        @default false
        @initOnly
        **/
        showOnContext: {
            value: false,
            writeOnce: 'initOnly'
        },

        /**
        If `true`, this menu will be shown when the host node is hovered or
        receives focus instead of only being shown when it's clicked.

        @attribute {Boolean} showOnHover
        @default false
        @initOnly
        **/
        showOnHover: {
            value: false,
            writeOnce: 'initOnly'
        }
    }
});


}, '@VERSION@', {"requires": ["event-focus", "menu", "node-pluginhost", "plugin"]});
