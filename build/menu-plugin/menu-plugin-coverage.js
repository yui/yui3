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
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].code=["YUI.add('menu-plugin', function (Y, NAME) {","","/**","Provides the `Y.Plugin.Menu` Node plugin.","","@module menu","@submodule menu-plugin","**/","","/**","Node plugin that toggles a dropdown menu when the host node is clicked.","","### Example","","    YUI().use('menu-plugin', function (Y) {","        var button = Y.one('#button');","","        // Plug a dropdown menu into the button.","        button.plug(Y.Plugin.Menu, {","            items: [","                {label: 'Item One'},","                {label: 'Item Two'},","                {label: 'Item Three'}","            ]","        });","","        // The menu will automatically be displayed whenever the button is","        // clicked, but you can also toggle it manually.","        button.menu.toggle();","    });","","@class Plugin.Menu","@constructor","@extends Menu","@uses Plugin.Base","**/","","Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function (config) {","        this._host = config.host;","","        this._published = {};","        this._attachMenuPluginEvents();","    },","","    destructor: function () {","        clearTimeout(this._pluginHideTimeout);","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Repositions this dropdown menu so that it is anchored to its host node at","    the most advantageous position to ensure that as much of the menu as","    possible is visible within the viewport.","","    @method reposition","    @chainable","    **/","    reposition: function () {","        var container = this.get('container'),","","            menuRegion = this._getSortedAnchorRegions(","                ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],","                container.get('region'),","                this._host.get('region')","            )[0].region;","","        container.setXY([menuRegion.left, menuRegion.top]);","","        return this;","    },","","    show: function () {","        this.reposition();","        return Y.Menu.prototype.show.call(this);","    },","","    // -- Protected Methods ----------------------------------------------------","    _attachMenuPluginEvents: function () {","        // These events will be cleaned up by Y.Menu.","        this._menuEvents.push(","            Y.one('doc').after('click', this._afterDocClick, this)","        );","","        this.afterHostEvent('click', this._afterAnchorClick);","","        if (this.get('showOnHover')) {","            this.afterHostEvent({","                blur      : this._afterAnchorBlur,","                focus     : this._afterAnchorFocus,","                mouseenter: this._afterAnchorMouseEnter,","                mouseleave: this._afterAnchorMouseLeave","            });","","            this._menuEvents.push(this.get('container').after({","                mouseenter: Y.bind(this._afterContainerMouseEnter, this),","                mouseleave: Y.bind(this._afterContainerMouseLeave, this)","            }));","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterAnchorClick: function () {","        if (!this.rendered) {","            this.render();","        }","","        this.toggle();","    },","","    _afterAnchorBlur: function () {","        this.hide();","    },","","    _afterAnchorFocus: function () {","        clearTimeout(this._pluginHideTimeout);","","        if (!this.rendered) {","            this.render();","        }","","        this.show();","    },","","    _afterAnchorMouseEnter: function () {","        clearTimeout(this._pluginHideTimeout);","","        if (!this.rendered) {","            this.render();","        }","","        this.show();","    },","","    _afterAnchorMouseLeave: function () {","        var self = this;","","        this._pluginHideTimeout = setTimeout(function () {","            console.log('anchorTimeout');","            self.hide();","        }, 300);","    },","","    _afterContainerMouseEnter: function () {","        clearTimeout(this._pluginHideTimeout);","    },","","    _afterContainerMouseLeave: function () {","        var self = this;","","        this._pluginHideTimeout = setTimeout(function () {","            self.hide();","        }, 300);","    },","","    _afterDocClick: function (e) {","        if (!this.get('visible')) {","            return;","        }","","        var container = this.get('container'),","            host      = this._host;","","        if (!e.target.ancestor(function (node) {","            return node === container || node === host;","        }, true)) {","            this.hide();","        }","    }","}, {","    NS: 'menu',","","    ATTRS: {","        /**","        If `true`, this menu will be shown when the host node is hovered or","        receives focus instead of only being shown when it's clicked.","","        @attribute {Boolean} showOnHover","        @default false","        @initOnly","        **/","        showOnHover: {","            value: false,","            writeOnce: 'initOnly'","        }","    }","});","","","}, '@VERSION@', {\"requires\": [\"event-focus\", \"menu\", \"node-pluginhost\", \"plugin\"]});"];
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].lines = {"1":0,"38":0,"41":0,"43":0,"44":0,"48":0,"62":0,"70":0,"72":0,"76":0,"77":0,"83":0,"87":0,"89":0,"90":0,"97":0,"106":0,"107":0,"110":0,"114":0,"118":0,"120":0,"121":0,"124":0,"128":0,"130":0,"131":0,"134":0,"138":0,"140":0,"141":0,"142":0,"147":0,"151":0,"153":0,"154":0,"159":0,"160":0,"163":0,"166":0,"167":0,"169":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].functions = {"initializer:40":0,"destructor:47":0,"reposition:61":0,"show:75":0,"_attachMenuPluginEvents:81":0,"_afterAnchorClick:105":0,"_afterAnchorBlur:113":0,"_afterAnchorFocus:117":0,"_afterAnchorMouseEnter:127":0,"(anonymous 2):140":0,"_afterAnchorMouseLeave:137":0,"_afterContainerMouseEnter:146":0,"(anonymous 3):153":0,"_afterContainerMouseLeave:150":0,"(anonymous 4):166":0,"_afterDocClick:158":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].coveredLines = 42;
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
this._host = config.host;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 43);
this._published = {};
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
    Repositions this dropdown menu so that it is anchored to its host node at
    the most advantageous position to ensure that as much of the menu as
    possible is visible within the viewport.

    @method reposition
    @chainable
    **/
    reposition: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "reposition", 61);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 62);
var container = this.get('container'),

            menuRegion = this._getSortedAnchorRegions(
                ['tl-bl', 'tr-br', 'bl-tl', 'br-tr'],
                container.get('region'),
                this._host.get('region')
            )[0].region;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 70);
container.setXY([menuRegion.left, menuRegion.top]);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 72);
return this;
    },

    show: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "show", 75);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 76);
this.reposition();
        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 77);
return Y.Menu.prototype.show.call(this);
    },

    // -- Protected Methods ----------------------------------------------------
    _attachMenuPluginEvents: function () {
        // These events will be cleaned up by Y.Menu.
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_attachMenuPluginEvents", 81);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 83);
this._menuEvents.push(
            Y.one('doc').after('click', this._afterDocClick, this)
        );

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 87);
this.afterHostEvent('click', this._afterAnchorClick);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 89);
if (this.get('showOnHover')) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 90);
this.afterHostEvent({
                blur      : this._afterAnchorBlur,
                focus     : this._afterAnchorFocus,
                mouseenter: this._afterAnchorMouseEnter,
                mouseleave: this._afterAnchorMouseLeave
            });

            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 97);
this._menuEvents.push(this.get('container').after({
                mouseenter: Y.bind(this._afterContainerMouseEnter, this),
                mouseleave: Y.bind(this._afterContainerMouseLeave, this)
            }));
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterAnchorClick: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterAnchorClick", 105);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 106);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 107);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 110);
this.toggle();
    },

    _afterAnchorBlur: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterAnchorBlur", 113);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 114);
this.hide();
    },

    _afterAnchorFocus: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterAnchorFocus", 117);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 118);
clearTimeout(this._pluginHideTimeout);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 120);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 121);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 124);
this.show();
    },

    _afterAnchorMouseEnter: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterAnchorMouseEnter", 127);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 128);
clearTimeout(this._pluginHideTimeout);

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 130);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 131);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 134);
this.show();
    },

    _afterAnchorMouseLeave: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterAnchorMouseLeave", 137);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 138);
var self = this;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 140);
this._pluginHideTimeout = setTimeout(function () {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 2)", 140);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 141);
console.log('anchorTimeout');
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 142);
self.hide();
        }, 300);
    },

    _afterContainerMouseEnter: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterContainerMouseEnter", 146);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 147);
clearTimeout(this._pluginHideTimeout);
    },

    _afterContainerMouseLeave: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterContainerMouseLeave", 150);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 151);
var self = this;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 153);
this._pluginHideTimeout = setTimeout(function () {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 3)", 153);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 154);
self.hide();
        }, 300);
    },

    _afterDocClick: function (e) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterDocClick", 158);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 159);
if (!this.get('visible')) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 160);
return;
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 163);
var container = this.get('container'),
            host      = this._host;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 166);
if (!e.target.ancestor(function (node) {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 4)", 166);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 167);
return node === container || node === host;
        }, true)) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 169);
this.hide();
        }
    }
}, {
    NS: 'menu',

    ATTRS: {
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
