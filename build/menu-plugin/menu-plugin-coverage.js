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
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].code=["YUI.add('menu-plugin', function (Y, NAME) {","","/**","Provides the `Y.Plugin.Menu` Node plugin.","","@module menu","@submodule menu-plugin","**/","","/**","Node plugin that toggles a dropdown menu when the host node is clicked.","","### Example","","    YUI().use('menu-plugin', function (Y) {","        var button = Y.one('#button');","","        // Plug a dropdown menu into the button.","        button.plug(Y.Plugin.Menu, {","            items: [","                {label: 'Item One'},","                {label: 'Item Two'},","                {label: 'Item Three'}","            ]","        });","","        // The menu will automatically be displayed whenever the button is","        // clicked, but you can also toggle it manually.","        button.menu.toggle();","    });","","@class Plugin.Menu","@constructor","@extends Menu","@uses Plugin.Base","**/","","Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function (config) {","        this._host       = config.host;","        this._hostIsBody = this._host === Y.one('body');","","        this._attachMenuPluginEvents();","    },","","    destructor: function () {","        clearTimeout(this._pluginHideTimeout);","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Repositions this menu so that it is anchored to a specified node, region, or","    set of pixel coordinates.","","    The menu will be displayed at the most advantageous position relative to the","    anchor point to ensure that as much of the menu as possible is visible","    within the viewport.","","    If no anchor point is specified, the menu will be positioned relative to its","    host node.","","    @method reposition","    @param {Node|Number[]|Object} [anchorPoint] Anchor point at which this menu","        should be positioned. The point may be specified as a `Y.Node`","        reference, a region object, or an array of X and Y pixel coordinates.","    @chainable","    **/","    reposition: function (anchorPoint) {","        return Y.Menu.prototype.reposition.call(this, anchorPoint || this._host);","    },","","    // -- Protected Methods ----------------------------------------------------","    _attachMenuPluginEvents: function () {","        var doc = Y.one('doc');","","        // Events added to this._menuEvents will be cleaned up by Y.Menu.","        this._menuEvents.push(","            doc.after('mousedown', this._afterDocMouseDown, this)","        );","","        if (this.get('showOnClick')) {","            this.afterHostEvent('click', this._afterHostClick);","        }","","        if (this.get('showOnContext')) {","            // If the host node is the <body> element, we need to listen on the","            // document.","            if (this._hostIsBody) {","                this._menuEvents.push(doc.on('contextmenu', this._onHostContext, this));","            } else {","                this.onHostEvent('contextmenu', this._onHostContext);","            }","        }","","        if (this.get('showOnHover')) {","            this.afterHostEvent({","                blur      : this._afterHostBlur,","                focus     : this._afterHostFocus,","                mouseenter: this._afterHostMouseEnter,","                mouseleave: this._afterHostMouseLeave","            });","","            this._menuEvents.push(this.get('container').after({","                mouseenter: Y.bind(this._afterContainerMouseEnter, this),","                mouseleave: Y.bind(this._afterContainerMouseLeave, this)","            }));","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterHostBlur: function () {","        this.hide();","    },","","    _afterHostClick: function () {","        if (!this.rendered) {","            this.render();","        }","","        this.toggle({anchorPoint: this._host});","    },","","    _afterHostFocus: function () {","        clearTimeout(this._pluginHideTimeout);","","        if (!this.rendered) {","            this.render();","        }","","        this.show({anchorPoint: this._host});","    },","","    _afterHostMouseEnter: function () {","        clearTimeout(this._pluginHideTimeout);","","        if (!this.rendered) {","            this.render();","        }","","        this.show({anchorPoint: this._host});","    },","","    _afterHostMouseLeave: function () {","        var self = this;","","        this._pluginHideTimeout = setTimeout(function () {","            self.hide();","        }, 300);","    },","","    _afterContainerMouseEnter: function () {","        clearTimeout(this._pluginHideTimeout);","    },","","    _afterContainerMouseLeave: function () {","        var self = this;","","        this._pluginHideTimeout = setTimeout(function () {","            self.hide();","        }, 300);","    },","","    _afterDocMouseDown: function (e) {","        if (!this.get('visible')) {","            return;","        }","","        var container = this.get('container'),","            host      = this._hostIsBody ? null : this._host;","","        if (!e.target.ancestor(function (node) {","            return node === container || node === host;","        }, true)) {","            this.hide();","        }","    },","","    _onHostContext: function (e) {","        e.preventDefault();","","        if (!this.rendered) {","            this.render();","        }","","        this.show({anchorPoint: [e.clientX, e.clientY]});","    }","}, {","    NS: 'menu',","","    ATTRS: {","        /**","        If `true`, this menu will be shown when the host node is clicked with","        the left mouse button or (in the case of `<button>`, `<input>`, and","        `<a>` elements) activated with the Return key.","","        @attribute {Boolean} showOnClick","        @default true","        @initOnly","        **/","        showOnClick: {","            value: true,","            writeOnce: 'initOnly'","        },","","        /**","        If `true`, this menu will be shown when the host node's `contextmenu`","        event occurs, which happens when the user takes an action that would","        normally display the browser's context menu (such as right-clicking).","","        When `true`, the browser's default context menu will be prevented from","        appearing.","","        @attribute {Boolean} showOnContext","        @default false","        @initOnly","        **/","        showOnContext: {","            value: false,","            writeOnce: 'initOnly'","        },","","        /**","        If `true`, this menu will be shown when the host node is hovered or","        receives focus instead of only being shown when it's clicked.","","        @attribute {Boolean} showOnHover","        @default false","        @initOnly","        **/","        showOnHover: {","            value: false,","            writeOnce: 'initOnly'","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"event-focus\", \"menu\", \"node-pluginhost\", \"plugin\"]});"];
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].lines = {"1":0,"38":0,"41":0,"42":0,"44":0,"48":0,"71":0,"76":0,"79":0,"83":0,"84":0,"87":0,"90":0,"91":0,"93":0,"97":0,"98":0,"105":0,"114":0,"118":0,"119":0,"122":0,"126":0,"128":0,"129":0,"132":0,"136":0,"138":0,"139":0,"142":0,"146":0,"148":0,"149":0,"154":0,"158":0,"160":0,"161":0,"166":0,"167":0,"170":0,"173":0,"174":0,"176":0,"181":0,"183":0,"184":0,"187":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].functions = {"initializer:40":0,"destructor:47":0,"reposition:70":0,"_attachMenuPluginEvents:75":0,"_afterHostBlur:113":0,"_afterHostClick:117":0,"_afterHostFocus:125":0,"_afterHostMouseEnter:135":0,"(anonymous 2):148":0,"_afterHostMouseLeave:145":0,"_afterContainerMouseEnter:153":0,"(anonymous 3):160":0,"_afterContainerMouseLeave:157":0,"(anonymous 4):173":0,"_afterDocMouseDown:165":0,"_onHostContext:180":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].coveredLines = 47;
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].coveredFunctions = 17;
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
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_attachMenuPluginEvents", 75);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 76);
var doc = Y.one('doc');

        // Events added to this._menuEvents will be cleaned up by Y.Menu.
        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 79);
this._menuEvents.push(
            doc.after('mousedown', this._afterDocMouseDown, this)
        );

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 83);
if (this.get('showOnClick')) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 84);
this.afterHostEvent('click', this._afterHostClick);
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 87);
if (this.get('showOnContext')) {
            // If the host node is the <body> element, we need to listen on the
            // document.
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 90);
if (this._hostIsBody) {
                _yuitest_coverline("build/menu-plugin/menu-plugin.js", 91);
this._menuEvents.push(doc.on('contextmenu', this._onHostContext, this));
            } else {
                _yuitest_coverline("build/menu-plugin/menu-plugin.js", 93);
this.onHostEvent('contextmenu', this._onHostContext);
            }
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 97);
if (this.get('showOnHover')) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 98);
this.afterHostEvent({
                blur      : this._afterHostBlur,
                focus     : this._afterHostFocus,
                mouseenter: this._afterHostMouseEnter,
                mouseleave: this._afterHostMouseLeave
            });

            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 105);
this._menuEvents.push(this.get('container').after({
                mouseenter: Y.bind(this._afterContainerMouseEnter, this),
                mouseleave: Y.bind(this._afterContainerMouseLeave, this)
            }));
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterHostBlur: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostBlur", 113);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 114);
this.hide();
    },

    _afterHostClick: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostClick", 117);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 118);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 119);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 122);
this.toggle({anchorPoint: this._host});
    },

    _afterHostFocus: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostFocus", 125);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 126);
clearTimeout(this._pluginHideTimeout);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 128);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 129);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 132);
this.show({anchorPoint: this._host});
    },

    _afterHostMouseEnter: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostMouseEnter", 135);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 136);
clearTimeout(this._pluginHideTimeout);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 138);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 139);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 142);
this.show({anchorPoint: this._host});
    },

    _afterHostMouseLeave: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterHostMouseLeave", 145);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 146);
var self = this;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 148);
this._pluginHideTimeout = setTimeout(function () {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 2)", 148);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 149);
self.hide();
        }, 300);
    },

    _afterContainerMouseEnter: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterContainerMouseEnter", 153);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 154);
clearTimeout(this._pluginHideTimeout);
    },

    _afterContainerMouseLeave: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterContainerMouseLeave", 157);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 158);
var self = this;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 160);
this._pluginHideTimeout = setTimeout(function () {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 3)", 160);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 161);
self.hide();
        }, 300);
    },

    _afterDocMouseDown: function (e) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterDocMouseDown", 165);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 166);
if (!this.get('visible')) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 167);
return;
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 170);
var container = this.get('container'),
            host      = this._hostIsBody ? null : this._host;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 173);
if (!e.target.ancestor(function (node) {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 4)", 173);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 174);
return node === container || node === host;
        }, true)) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 176);
this.hide();
        }
    },

    _onHostContext: function (e) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_onHostContext", 180);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 181);
e.preventDefault();

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 183);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 184);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 187);
this.show({anchorPoint: [e.clientX, e.clientY]});
    }
}, {
    NS: 'menu',

    ATTRS: {
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
